const config = require(`../../config`);
const { TrimMsg, punishments } = require("../../utils/auxiliarFunctions");
const { warn_remove } = require("../../mongodb");
const { logger } = require("../../utils/logger");

/*
    Removes a warn from the user
*/

module.exports={
    name: "remove",
    aliases: [],
    description: "remove a advertência de um usuário",

    async execute (msg) {
        
        try {
        
            let msgArgs = TrimMsg(msg)

            if(!msgArgs[1]?.match(/[0-9]/g)) return await msg.channel.send('Você precisa especificar o id da warn')

            let doc = await warn_remove(msgArgs[1])
            
            if(!doc) return await msg.channel.send({embeds:[{description: `id de warn invalido`,color:config.color.err}]})

            const warns = await warn_list(doc)

            await punishments(doc, warns.points ? warns.points : 0, msg.guild, msg.author)

            await msg.channel.send({embeds:[{description: `Warn de (${doc})\nid: ${msgArgs[1]} apagada com sucesso`,color:config.color.sucess}]})
            
        } catch (error) {
            logger.error(error)
        }


    }
}
