const { EmbedBuilder } = require("discord.js");
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
                        const embPv = new EmbedBuilder()
                        embPv.setColor(config.color.sucess)
                        embPv.setDescription(`\`Olá tudo bem? Você recebeu uma notificação pelo motivo: ${reason}\`
\`Lembre-se, Notificação não possui peso — você não sofreu advertência ou algo que gere seu banimento. As notificações existem apenas para te deixar mais por dentro do assunto.\` 
\`Ou seja, relaxe\` :sunglasses: :thumbsup:`)
                        embPv.setFooter({text: `id: ${user.id}`})
                        let mod_log = client.channels.cache.get(config.channels.modlog)

                        const embModLog = new EmbedBuilder()

                        embModLog.setColor(config.color.sucess)
                        embModLog.setDescription(`**Notificação**\n${user.tag} foi notificado por <@${msg.author.id}>\n` + "Motivo:`" + reason + "`")
                        embModLog.setFooter({text: `id: ${user.id}`})

    
                        if (msg.guild.members.cache.get(user.id)) {
                            try {
                                await mod_log.send({ embeds: [embModLog] })
                            } catch (error) {
                                logger.error(error)
                            }

                            try {
                                await msg.guild.members.cache.get(id).send({ embeds: [embPv] })
                            } catch {
                                await mod_log.send({ content: `Ouve um erro, ao enviar para o privado ${user.toString()}`, embeds: [emb] })
                                await msg.channel.send({ content: `O usuário <@${id}> foi notificado pelo motivo: \`${reason}\` \nmas ouve um erro ao notificar no privado!` })
                            }finally{
                                try {
                                    await msg.channel.send({ content: `O usuário <@${id}> foi notificado pelo motivo: \`${reason}\`` })

                                } catch (error) {
                                    logger.error(error)
                                }
                            }
                        } else {
                            await mod_log.send({ embeds: [embModLog] })
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
