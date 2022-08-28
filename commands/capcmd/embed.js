const {  ChannelType } = require("discord.js");
const { embDb, client } = require("../..");
const config = require("../../config");
const logger = require("../../utils/logger");

module.exports = {
    name: "embed",
    aliases: ["emb"],
    description: "Utilize o comando emb e siga os passos 😎",

    async execute(msg) {

        try {
            await msg.channel.send({
                embeds: [{
                    title: "O que deseja fazer com o embed", color: config.color.blurple, description: `
            1- Enviar um embed
            2- Criar um embed
            3- Editar um embed
            4- Deletar embed
            5- Traz um embed que não esta dentro ainda no bot, mas esta em um canal
            6- Editar uma mensagem que contem um embed`}]
            })
            
            var filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id
            var msgOpc = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
            
            var embListed = await embDb.EmbList()

            switch (msgOpc.first().content) {
                case "1":
                    if (!embListed) return await msg.channel.send({ embeds: [{ description: "Nenhum embed registrado ainda", color: config.color.err }] })
                    
                    embListed.forEach(emb => {
                        msg.channel.send(emb)
                    });
                    
                    await msg.channel.send("Envie o id do embed que deseja enviar")
                    var filter = (m) => m.author.id == msg.author.id && /[0-9]/.test(m.content)
                    var msgEmbs = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`time`] })
                    
                    var recvdb = await embDb.getEmb(msgEmbs?.first()?.content)
                   
                    if (!recvdb) return await msg.channel.send(`Id invalido`)

                    await msg.channel.send({ embeds: [recvdb.embed] })

                    await msg.channel.send(`Envie id do canal que deseja enviar a mensagem`)
                    filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id
                    var msgChanCol = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                    
                    var channel = client.channels.cache.get(msgChanCol?.first()?.content)
                    
                    if (!channel) return await msg.channel.send("Id de canal invalido")
                    
                    await msg.channel.send("Embed enviado em " + channel.name)
                    
                    await channel.send({ embeds: [recvdb.embed] })

                    break;
                case "2":
                    var createmb = require('../../utils/createEmbed')
                    createmb.emb(msg);
                    break;
                case "3":
                    if (!embListed) return await msg.channel.send({ embeds: [{ description: "Nenhum embed registrado ainda", color: config.color.err }] })
                    embListed.forEach(emb => {
                        msg.channel.send(emb)
                    });
                    await msg.channel.send("Envie o id do embed que deseja editar")

                    filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id;
                    var msgEmbs = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`time`] })
                    
                    var recvdb = await embDb.getEmb(msgEmbs.first().content)
                    
                    if (recvdb) {
                        await msg.channel.send({ embeds: [recvdb.embed] })
                        var createmb = require(`../../utils/createEmbed`)
                        createmb.emb(msg, recvdb.embed);                        
                    } else {
                        await msg.channel.send(`Id invalido`)
                    }
                    break;
                case "4":
                    if (!embListed) return await msg.channel.send({ embeds: [{ description: "Nenhum embed registrado ainda", color: config.color.err }] })

                    embListed.forEach(emb => {
                        msg.channel.send(emb)
                    });

                    await msg.channel.send("Envie o id do embed que deseja deletar")
                    filter = m => /[0-9]/g.test(m.content) && m.author.id === msg.author.id;
                    var msgDelCol = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] })
                    
                    if (!embDb.delEmb(msgDelCol.first().content)) {
                        await msg.channel.send(`**ID ERRADO**`)
                    } else {
                        await msg.channel.send(`**Embed deletado**`)
                    }
                    
                    break;
                
                // copy embed
                case "5":
                    await msg.channel.send("Envie o id do **CANAL** que esta o embed que deseja copiar")
                    var filter = (m) => m.author.id == msg.author.id && /[0-9]/g.test(m.content)
                    var channelEmb = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`time`] })

                    channelEmb = msg.guild.channels.cache.get(channelEmb?.first()?.content)

                    if(!channelEmb || channelEmb.type != ChannelType.GuildText) return await msg.reply("Id de canal invalido")

                    await msg.channel.send("Envie o id da **MENSAGEM** que esta o embed que deseja copiar")
                    var filter = (m) => m.author.id == msg.author.id && /[0-9]/g.test(m.content)
                    var msgEmb = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`time`] })

                    msgEmb = await channelEmb.messages.fetch({message:msgEmb?.first().content})

                    if (!msgEmb?.embeds[0]) return await msg.reply("Nenhum embed encontrado nessa mensagem, no canal " + channelEmb.name)
                    
                    var emb = msgEmb?.embeds[0]
                    
                    await msg.reply({content: "**Embed encontrado!** ", embeds:[emb] } )
                    await msg.reply({content: "**Digite o nome que deseja salvar o embed** " } )
                    
                    var filter = (m) => m.author.id == msg.author.id && m.content
                    var nameEmb = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`time`] })

                    embDb.saveEmb(emb, nameEmb.first().content, msg.author.username)

                    await msg.channel.send('Embed salvo com sucesso!')

                    break;
                case "6":

                    embListed.forEach(emb => {
                        msg.channel.send(emb)
                    });
                    
                    await msg.channel.send("Envie o id do embed que deseja usar")
                    var filter = (m) => m.author.id == msg.author.id && /[0-9]/.test(m.content)
                    var msgEmbs = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`time`] })
                    
                    var recvdb = await embDb.getEmb(msgEmbs?.first()?.content)
                   
                    if (!recvdb) return await msg.channel.send(`Id invalido`)

                    await msg.channel.send({ embeds: [recvdb.embed] })

                    await msg.channel.send(`Envie id do **CANAL** que contem o embed que deseja editar`)
                    filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id
                    var msgChanCol = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                    
                    var channel = client.channels.cache.get(msgChanCol?.first()?.content)
                    
                    if (!channel) return await msg.channel.send("Id de canal invalido")

                    await msg.channel.send(`Envie id da **MENSAGEM** que contem o embed que deseja editar`)
                    var msgMsgCol = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                    try {
                        var msgToEdit = await channel.messages.fetch(msgMsgCol?.first()?.content)

                        await msgToEdit.edit({embeds:[recvdb.embed]})

                        await msg.channel.send(`Mensagem editada`)
                    } catch (error) {
                        logger.error(error)
                        await msg.channel.send('Id da mensagem invalido')
                    }

                break;

            }
        } catch (error) {
            logger.error(error)
        }
        
    }
}
