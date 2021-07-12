const { client } = require("..");
const { TrimMsg } = require("../eventos/funções");
const moment = require("moment");
const config = require("../config");
const { SetTempMute, SetUnmute } = require("../mongodb");

// &tempmute <member/user/id> <time to mute> <reason>
    module.exports= {tempmute}

    async function tempmute(msg){
        let msgArgs = TrimMsg(msg)
    if(/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1])){
        if(msg.mentions.members.first()){
            var member = msg.mentions.members.first()
        }else{
            var member = msg.guild.members.cache.get(msgArgs[1])
        }
        let i = 3
        let reason = (msgArgs[i]) ? msg.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : 1;
            
        if(reason == 1){
          i++
          reason = (msgArgs[i]) ? msg.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : 1;
          
          if(reason == 1){
            i++
            reason = (msgArgs[i]) ? msg.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : "Motivo não informado";
          }
        }

        if(!msgArgs[2]) return msg.channel.send("Você precisa definir o tempo de mute")
        if(!member||member.roles.highest.position>=msg.member.roles.highest.position)return msg.channel.send("Erro ao mutar o membro")

        let muteTime = moment(0).add(parseInt(msgArgs[2].replace(/[a-z]/g, "")), msgArgs[2].replace(/[0-9]/g, "").valueOf()).valueOf()
        let nowDate = moment.now()
        if(!muteTime) return msg.channel.send("Tempo invalido")
        
        let muteRole = member.guild.roles.cache.get(config.roles.muted)
        member.roles.add(muteRole, reason)
        SetTempMute(member.id, nowDate, muteTime)
        msg.channel.send(`${member} mutado com sucesso`)
        let canal =  client.channels.cache.get(config.channels.modlog)
        canal.send({embed:{
            description:`🤫 ${member} foi **mutado temporariamente** por ${msgArgs[2]}: ${reason}.`,
            color:config.color.sucess,
        }})
        setTimeout(()=>{
            SetUnmute(member.id)
            member.roles.remove(muteRole, "Tempo se esgotou")
            canal.send({embed:{
                description:`🤫 ${member} foi desmutado.`,
                color:config.color.sucess,
            }})
        },muteTime)

    }

    }
    

