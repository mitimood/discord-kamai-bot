const config = require("../../config");
const logger = require("../../utils/logger");

/*
This function returns a message completely readeble of a user message
emojis, user mentions, bold...
*/

module.exports={
    name: "conteudo",
    aliases: [],
    description: "pega o conteudo de uma mensagem e envia abaixo",

    async execute (message){

        var msgArgs = message.content.split(" ");

        try {
            if(!msgArgs[1]) return await message.channel.send({embeds:[{description:"Como irei modificar o manuscrito se não me enviou o id da?",color:config.color.err}]})

            const chatMessage = await message.channel.messages.fetch(msgArgs[1])

            if(chatMessage==undefined) return await message.channel.send({embeds:[{description:"Você não enviou o id da mensagem certo",color:config.color.err}]})
            
            await message.channel.send("```"+ chatMessage.content +"```")

        } catch (error) {
            try {
                return await message.channel.send({embeds:[{color:config.color.err,description:"Não foi possivel encontrar a mensagem"}]})

            } catch (error) {
                logger.error(error)
            }
        }


    }
}