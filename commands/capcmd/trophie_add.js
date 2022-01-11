const config = require("../../config")
const { TrimMsg } = require("../../utils/funções")
const { role_register_add } = require("../../mongodb")

/*
    Adds a trophie to a user and save its to a external db

reward (id user)
*/

module.exports={
    name: "reward",
    aliases: [],
    description: "adiciona o cargo de trofeu no membro",

    async execute(msg) {
    
        let msgArgs = TrimMsg(msg)

        if(!msgArgs[1] || !msgArgs[1].match(/[0-9]+/) && !msg.mentions.members.first())return msg.channel.send("Mencione um usuário")
        let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];

        let member = msg.guild.members.cache.get(userid)

            if(member._roles.includes(config.storage_role.troph5)){
                msg.channel.send("O membro já possui o cargo maximo")

            }else if(member._roles.includes(config.storage_role.troph4)){
                member.roles.add(config.storage_role.troph5)
                role_register_add(member.id, config.storage_role.troph5)
                msg.channel.send("O membro recebeu o cargo 5")

            }else if(member._roles.includes(config.storage_role.troph3)){
                member.roles.add(config.storage_role.troph4)
                role_register_add(member.id, config.storage_role.troph4)
                msg.channel.send("O membro recebeu o cargo 4")

            }else if(member._roles.includes(config.storage_role.troph2)){
                member.roles.add(config.storage_role.troph3)
                role_register_add(member.id, config.storage_role.troph3)
                msg.channel.send("O membro recebeu o cargo 3")

            }else if(member._roles.includes(config.storage_role.troph1)){
                member.roles.add(config.storage_role.troph2)
                role_register_add(member.id, config.storage_role.troph2)
                msg.channel.send("O membro recebeu o cargo 2")

            }else{
                member.roles.add(config.storage_role.troph1)
                role_register_add(member.id, config.storage_role.troph1)
                msg.channel.send("O membro recebeu o cargo 1")
            }
    }
}