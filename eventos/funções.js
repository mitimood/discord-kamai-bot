const config = require(`../config`);
const { client } = require("../index");
const moment = require("moment");
const { SetTempMute, SetUnmute } = require("../mongodb");


module.exports={

// receives a message and than returns an array with every of the message
    TrimMsg(msg){

        return msg.content.split(/\n| /gm).filter((str) => str.trim())
    },

// ban a member
    async Banning(id,reason,guild){
        await guild.members.ban(id,{reason:reason}).catch(e=>console.log(e))

    },

// ban a member and send a message on pv
    async  ban_member_send_message(id,reason,guild, executor){
        try{
            let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({unique:true,reason:"ban invite",maxUses:1, maxAge:604800})
            await guild.members.cache.get(id).send(`Aplicado por(${executor.tag}-----${executor.id})\n\nVocê foi banido de KAMAITACHI, por: `+reason+ `\nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)
            guild.members.ban(id,{reason:reason}).catch(e=>console.log(e))
        }catch{
        }
   },

// Tempmutes a user

    async  tempmute(duration, unit, member){
        let muteTime = moment(0).add(duration, unit).valueOf()
        member.roles.add(config.roles.muted, "Warn mute")
        let now = moment.utc().valueOf()

        SetTempMute(member.id, now, muteTime)

        setTimeout(()=>{
            SetUnmute(member.id)
            member.roles.remove(config.roles.muted, "Tempo se esgotou")
        },muteTime)
    },

// Verify the passed ids if they are a user, member or is a invalid user
    async  VerificId(idArray,guild){
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
    },
    
// apply all the punishment based on the user points

    punishments(target_id, points, guild, executor) {

        let member = guild.members.cache.get(target_id)
        if(!member) return false
        
        if(points>=4){ ban_member_send_message(target_id,"4 advertencias", guild, executor)}
        if(points>=3){ 
            member.roles.add(config.roles.adv3)
            this.tempmute(2, "d", member)
        }
        if(!member.roles.cache.has(config.roles.adv2)){
            if(points>=2){
                member.roles.add(config.roles.adv2)
                this.tempmute(2, "h", member)
            }
            if(!member.roles.cache.has(config.roles.adv1)){
                    if(points>=1){ 
                        member.roles.add(config.roles.adv1)
                        this.tempmute(30, "m", member)

                    }
            }
        }
    },
    // returns an array of entries separated
    message_limit_embeds_2000(msg_content){
        
    }
}