const { client } = require("..");
const { TrimMsg } = require("../funções/funções");
const moment = require("moment");
const config = require("../config");
const { SetTempMute, SetUnmute } = require("../mongodb");

// &tempmute <member/user/id> <time to mute> <reason>
module.exports={
    name: "tempmute",
    aliases: [],
    description: "silencia temporariamente um membro",
    
    async execute(msg){
        let msgArgs = TrimMsg(msg)
        if(/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1])){
            if(msg.mentions.members.first()){
                var member = msg.mentions.members.first()
            }else{
                var member = msg.guild.members.cache.get(msgArgs[1])
            }
            let i = 3
            let reason = (msgArgs[i]) ? msg.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : "Motivo não informado";

            if(!msgArgs[2]) return msg.channel.send("Você precisa definir o tempo de mute")
            if(!member||member.roles.highest.position>=msg.member.roles.highest.position) return msg.channel.send("Erro ao mutar o membro")

            let muteTime = moment(0).add(parseInt(msgArgs[2].replace(/[a-z]/g, "")), msgArgs[2].replace(/[0-9]/g, "")).valueOf()
            let nowDate = moment.utc().valueOf()

            if(!muteTime) return msg.channel.send("Tempo invalido")
            
            let muteRole = member.guild.roles.cache.get(config.roles.muted)
            member.roles.add(muteRole, reason)
            SetTempMute(member.id, nowDate, muteTime)
            msg.channel.send(`${member} mutado com sucesso`)
            let canal =  client.channels.cache.get(config.channels.modlog)
            canal.send({embeds:[{
                description:`🤫 ${member} foi **mutado temporariamente** por ${msgArgs[2]}: ${reason}.`,
                color:config.color.sucess,
            }]})
            setTimeout(()=>{
                SetUnmute(member.id)
                member.roles.remove(muteRole, "Tempo se esgotou")
                canal.send({embeds:[{
                    description:`🤫 ${member} foi desmutado.`,
                    color:config.color.sucess,
                }]})
            },muteTime)
        }
    }
}