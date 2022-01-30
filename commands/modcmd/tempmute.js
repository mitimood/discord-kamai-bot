const { client } = require("../..");
const { TrimMsg } = require("../../utils/auxiliarFunctions");
const moment = require("moment");
const config = require("../../config");
const { SetTempMute, SetUnmute } = require("../../mongodb");
const logger = require("../../utils/logger");

// &tempmute <member/user/id> <time to mute> <reason>
module.exports={
    name: "tempmute",
    aliases: [],
    description: "silencia temporariamente um membro",
    
    async execute(msg){
        try {
            let msgArgs = TrimMsg(msg)

            if(!(/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1]))) return
            
            if(msg.mentions.members.first()){
                var member = msg.mentions.members.first()
            }else{
                var member = msg.guild.members.cache.get(msgArgs[1])
            }
            let i = 3

            let reason = (msgArgs[i]) ? msg.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : "Motivo não informado";

            if(!msgArgs[2]) return await msg.channel.send("Você precisa definir o tempo de mute")

            if(!member||member.roles.highest.position>=msg.member.roles.highest.position) return await msg.channel.send("Erro ao mutar o membro")

            let muteTime = moment(0).add(parseInt(msgArgs[2].replace(/[a-z]/g, "")), msgArgs[2].replace(/[0-9]/g, "")).valueOf()

            let nowDate = moment.utc().valueOf()

            if(!muteTime) return await msg.channel.send("Tempo invalido")
            
            let muteRole = member.guild.roles.cache.get(config.roles.muted)

            await member.roles.add(muteRole, reason)

            SetTempMute(member.id, nowDate, muteTime)

            await msg.channel.send(`${member} mutado com sucesso`)

            let canal = client.channels.cache.get(config.channels.modlog)

            await canal.send({embeds:[{
                description:`🤫 ${member} foi **mutado temporariamente** por ${msgArgs[2]}: ${reason}.`,
                color:config.color.sucess,
            }]})

            setTimeout(async ()=>{
                try{
                    SetUnmute(member.id)

                    await member.roles.remove(muteRole, "Tempo se esgotou")
                    canal.send({embeds:[{
                        description:`🤫 ${member} foi desmutado.`,
                        color:config.color.sucess,
                    }]})
                }catch(err){
                    logger.error(err)
                }

            },muteTime)
    
        } catch (error) {
            logger.error(error)
        }   
    }
}