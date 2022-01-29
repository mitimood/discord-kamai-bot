const config = require("../../config.js");
const { client } = require("../../index");
const logger = require("../../utils/logger.js");

/*
Edit a message previously sent by the bot

edit (channel id) (id of the message) (new message content)
*/

module.exports={
    name: "edit",
    aliases: [],
    description: "edita o conteudo de uma mensage enviada pelo bot",

    async execute (message) {

        try {
            var msgArgs = message.content.split(" ");

            if(!(/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1]))) return await message.channel.send({content: message.author.toString(), embeds:[{description:"Você precisa mencionar o canal primeiro",color: config.color.err,}]})

            if(!(/^<[@][!&]?[0-9]+>$/.test(msgArgs[2]) || /[0-9]+/.test(msgArgs[2]))) return await message.channel.send({content: message.author.toString(), embeds:[{description:"Como irei modificar o manuscrito se não me enviou o id da mensagem?",color: config.color.err,}]})
                    
            if(!msgArgs[3]) return await message.channel.send({content: message.author.toString(), embeds:[{description:"Como irei modificar o manuscrito se você não me enviou o conteudo?", color: config.color.err,}]})
            
            let msgedit = message.content.substring(msgArgs.slice(0, 3).join(" ").length + 1);
            
            if(msgedit.length > 2000) return await message.channel.send(message.author.toString()+" Mensagem invalida. Verifique seu conteudo")
            
            const canal = client.channels.cache.find(channel =>channel.id === msgArgs[1])
            
            if(!canal) return await message.channel.send({content: message.author.toString(), embeds:[{ description:"Não foi possivel achar o canal", color: config.color.err}]})
            
            try {
                const editMessage = await canal.messages.fetch(msgArgs[2])

                if(!editMessage) return
                
                else try {
                    await editMessage.edit(msgedit)

                    await message.channel.send(message.author.toString()+" Mensagem edita com sucesso em " + editMessage.channel.name)

                } catch (error) {
                    await message.channel.send({content: message.author.toString(), embeds:[{description:"Não tenho permissão para editar essa mensagem",color: config.color.err}]})
                }

            } catch (error) {
                await message.channel.send({content: message.author.toString(), embeds:[{description:"Você precisa me dar uma mensagem valida",color: config.color.err}]})
            }

        } catch (error) {
            logger.error(error)
        }

        
    }
}