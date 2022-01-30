const config = require("../../config")
const { TrimMsg } = require("../../utils/auxiliarFunctions")
const { role_register_remove } = require("../../mongodb")
const logger = require("../../utils/logger")

/*
    Removies a trophie to a user and save its to a external db

rewardrmv (id user)
*/

module.exports={
    name: "rewardrmv",
    aliases: [],
    description: "remove o cargo de trofeu no membro",
    
    async execute(msg) {
        try {
            let msgArgs = TrimMsg(msg)

        if(!msgArgs[1] || !msgArgs[1].match(/[0-9]+/) && !msg.mentions.members.first())return msg.channel.send("Mencione um usuário")
        let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];

        let member = msg.guild.members.cache.get(userid)

            if(member._roles.includes(config.storage_role.troph5)){
                await member.roles.remove(config.storage_role.troph5)
                await role_register_remove(member.id, config.storage_role.troph5)
                await msg.channel.send("O membro perdeu o cargo 5")
            }else if(member._roles.includes(config.storage_role.troph4)){
                await member.roles.remove(config.storage_role.troph4)
                await role_register_remove(member.id, config.storage_role.troph4)
                await msg.channel.send("O membro perdeu o cargo 4")
            }else if(member._roles.includes(config.storage_role.troph3)){
                await member.roles.remove(config.storage_role.troph3)
                await role_register_remove(member.id, config.storage_role.troph3)
                await msg.channel.send("O membro recebeu o cargo 3")
            }else if(member._roles.includes(config.storage_role.troph2)){
                await member.roles.remove(config.storage_role.troph2)
                await role_register_remove(member.id, config.storage_role.troph2)
                await msg.channel.send("O membro recebeu o cargo 2")
            }else if(member._roles.includes(config.storage_role.troph1)){
                await member.roles.remove(config.storage_role.troph1)
                await role_register_remove(member.id, config.storage_role.troph1)
                await msg.channel.send("O membro recebeu o cargo 1")
            }else{
                await msg.channel.send("O membro não possui cargos a remover")
            }
        } catch (error) {
            logger.error(error)
        }
        
    }
}