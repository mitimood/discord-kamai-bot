const { MessageEmbed } = require("discord.js");
const { client } = require("../..");
const config = require("../../config");
const { TrimMsg } = require("../../utils/auxiliarFunctions")
const { warn_add } = require("../../mongodb");
const logger = require("../../utils/logger");

module.exports = {
    name: "notify",
    aliases: ["ntf", "aviso"],
    description: "notifica o membro sobre uma infração",

    async execute(msg) {

        try {
            const msgArgs = TrimMsg(msg)
            let id;
    
            if (msg.mentions.members.first() || /[0-9]+/.test(msgArgs[1])) {
    
                if (msg.mentions.members.first()) {
                    id = msg.mentions.members.first().user.id
                } else {
                    id = msgArgs[1]
                }
                try {
                    const user = await client.users.fetch(id, { force: false, cache: true })
    
                    let reason = (msgArgs[2]) ? msg.content.substring(msgArgs.slice(0, 2).join(" ").length + 1) : "Motivo não informado";
                    if (await warn_add(user.id, msg.author.id, 0, reason)) {
                        const emb = new MessageEmbed()
                        emb.setColor(config.color.sucess)
                        emb.setDescription(`**Notificação**\n${user.tag} foi notificado por <@${msg.author.id}>\n` + "Motivo:`" + reason + "`")
                        emb.setFooter({text: `id: ${user.id}`})
                        let mod_log = client.channels.cache.get(config.channels.modlog)
    
    
                        if (msg.guild.members.cache.get(user.id)) {
                            try {
                                await msg.guild.members.cache.get(id).send({ embeds: [emb] })
    
                                await mod_log.send({ embeds: [emb] })
                                await msg.channel.send({ content: `O usuário <@${id}> foi notificado pelo motivo: \`${reason}\`` })
                            } catch {
                                await mod_log.send({ content: `Ouve um erro, ao enviar para o privado ${user.toString()}`, embeds: [emb] })
                                await msg.channel.send({ content: `O usuário <@${id}> foi notificado pelo motivo: \`${reason}\` \nmas ouve um erro ao notificar no privado!` })
                            }
                        } else {
                            await mod_log.send({ embeds: [emb] })
                            await msg.channel.send({ content: `O usuário <@${id}> foi notificado pelo motivo: \`${reason}\` \nmas não esta no servidor mais!` })
                        }
                    }
                } catch (err) {
                    await msg.channel.send("Usuário invalido!")
                }
    
            } else {
                await msg.reply({ content: `Você não mencionou um usuário valido: \`${msgArgs[1]}\``, ephemeral: true })
            }
        } catch (error) {
            logger.error(error)   
        }      
    }
}
