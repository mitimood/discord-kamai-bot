const config = require(`../config`);
const {client, db} = require("../index");
const moment = require("moment");
const { SetTempMute, SetUnmute } = require("../mongodb");


module.exports={ TrimMsg, VerificId, Banning, punishments}


    function TrimMsg(msg){

        return msg.content.split(/\n| /gm).filter((str) => str.trim())
    
    }
    async function Banning(id,reason,guild){
        await guild.members.ban(id,{reason:reason}).catch(e=>console.log(e))

    }
    async function ban_member_send_message(id,reason,guild, executor){
        try{
            let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({unique:true,reason:"ban invite",maxUses:1, maxAge:604800})
            await guild.members.cache.get(id).send(`Aplicado por(${executor.tag}-----${executor.id})\n\nVocê foi banido de KAMAITACHI, por: `+reason+ `\nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)
            await guild.members.ban(id,{reason:reason}).catch(e=>console.log(e))
        }catch{
        }
    }

    async function tempmute(duration, unit, member){
        let muteTime = moment(0).add(unit, duration,).valueOf()
        member.roles.add(config.roles.muted, "Warn mute")
        let now = moment.utc().valueOf()

        SetTempMute(member.id, now, muteTime)

        setTimeout(()=>{
            try{
                SetUnmute(member.id)
                member.roles.remove(config.roles.muted, "Tempo se esgotou")
            }catch{
                
            }
        },muteTime)
    }

    async function VerificId(idArray,guild){
        let temp = ``
        let result= {
            members:[],
            users:[],
            noUser:[]
        }
        for (i in idArray){
            if(/^<[@][!&]?[0-9]+>$/.test(idArray[i])){
                idArray[i] = idArray[i].replace(/[\\<>@#&!]/g, "") 
              }
            temp = guild.members.cache.get(idArray[i]);

            //Verify if the id is member of the guild
            if(temp===undefined){
                temp = await client.users.fetch(idArray[i],false).catch(e=>console.log(e))

                //Verify if the id is a valid user
                if(temp==undefined)result.noUser.push(idArray[i]);
                else{
                result.users.push(temp);}
                }else{    
                    result.members.push(temp);
                }        
        }
        return result;
    }
    
    function punishments(target_id, points, guild, executor) {

        let member = guild.members.cache.get(target_id)
        if(!member) return false
        
        if(points>=4){ ban_member_send_message(target_id,"4 advertencias", guild, executor)}
        if(points>=3){ 
            member.roles.add(config.roles.adv3)
            tempmute(2, "d", member)
        }
        if(!member.roles.cache.has(config.roles.adv2)){
            if(points>=2){
                member.roles.add(config.roles.adv2)
                tempmute(2, "h", member)
            }
            if(!member.roles.cache.has(config.roles.adv1)){
                    if(points>=1){ 
                        member.roles.add(config.roles.adv1)
                        tempmute(30, "m", member)

                    }
            }
        }
    }