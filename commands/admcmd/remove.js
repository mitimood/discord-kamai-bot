const config = require(`../../config`);
const { TrimMsg } = require("../../funções/funções");
const { warn_remove } = require("../../mongodb");

/*
    Removes a warn from the user
*/

module.exports={
    name: "remove",
    aliases: [],
    description: "remove a advertência de um usuário",

    async execute (msg) {
        
        let msgArgs = TrimMsg(msg)
        if(msgArgs[1]?.match(/[0-9]/g)){
        let doc = await warn_remove(msgArgs[1])
            if(doc){
                msg.channel.send({embeds:[{description: `Warn de (${doc})\nid: ${msgArgs[1]} apagada com sucesso`,color:config.color.sucess}]})
            }else{
                msg.channel.send({embeds:[{description: `id de warn invalido`,color:config.color.err}]})
            }
        }else {
            msg.channel.send('Você precisa especificar o id da warn')
        }
    }
}
