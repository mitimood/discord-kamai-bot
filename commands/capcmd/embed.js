const { embDb, client } = require("../..");
const config = require("../../config");
const logger = require("../../utils/logger");

module.exports = {
    name: "embed",
    aliases: ["emb"],
    description: "Utilize o comando emb e siga os passos 😎",

    async execute(msg) {

        try {
            let embListed = await embDb.EmbList()

            const msgMenu = await msg.channel.send({
                embeds: [{
                    title: "O que deseja fazer com o embed", color: config.color.blurple, description: `
            1- Enviar um embed
            2- Criar um embed
            3- Editar um embed
            4- Deletar embed`}]
            })
            
            var filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id
            const msgOpc = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })

            switch (msgOpc.first().content) {
                case "1":
                    if (!embListed) return await msg.channel.send({ embeds: [{ description: "Nenhum embed registrado ainda", color: config.color.err }] })
                    
                    embListed.forEach(emb => {
                        msg.channel.send(emb)
                    });
                    
                    await msg.channel.send("Envie o id do embed que deseja enviar")
                    var filter = (m) => m.author.id == msg.author.id && /[0-9]/.test(m.content)
                    var msgEmbs = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`time`] })
                    
                    var recvdb = await embDb.getEmb(msgEmbs.first().content)
                   
                    if (!recvdb) return await msg.channel.send(`Id invalido`)

                    await msg.channel.send({ embeds: [recvdb.embed] })

                    await msg.channel.send(`Envie id do canal que deseja enviar a mensagem`)
                    filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id
                    const msgChanCol = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                    
                    let channel = client.channels.cache.get(msgChanCol.first().content)
                    
                    if (!channel) return await msg.channel.send("Id de canal invalido")
                    
                    await msg.channel.send("Embed enviado em " + channel.name)
                    
                    await channel.send({ embeds: [recvdb.embed] })

                    break;
                case "2":
                    let createmb = require('../../utils/createEmbed')
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
                        let createmb = require(`../../utils/createEmbed`)
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
                    filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id;
                    var msgDelCol = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['time'] })
                    
                    if (!embDb.delEmb(msgDelCol.first().content)) {
                        await msg.channel.send(`**ID ERRADO**`)
                    } else {
                        await msg.channel.send(`**Embed deletado**`)
                    }
                    
                    break;
            }
        } catch (error) {
            logger.error(error)
        }
        
    }
}
