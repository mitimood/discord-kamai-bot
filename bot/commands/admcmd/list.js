const { client } = require("../../");
const config = require("../../config");
const { TrimMsg } = require("../../funções/funções");
const mongoDB = require("../../mongodb");

/*
show a list of user warnings

list (id of user)
*/

module.exports={
    name: "list",
    aliases: [],
    description: "Lista as advertencias de um usuário",

    async execute (msg){

            let msgArgs = TrimMsg(msg)
            if(!msgArgs[1] || !msgArgs[1].match(/[0-9]+/) && !msg.mentions.members.first())return msg.channel.send("Mencione um usuário")
            let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];

            let warns_list = await mongoDB.warn_list(userid)
            if(warns_list){
                let user = await client.users.fetch(userid, true)
                
                msg.channel.send({embeds:[{
                    author:{name:user.tag, url: user.displayAvatarURL() },
                    description: warns_list["warns"],
                    footer:{
                        text:userid,
                    },
                    color: config.color.sucess
                }]})
            }else{
                return msg.channel.send("Não existe registro de advertencias para esse membro")
            }
    }
}