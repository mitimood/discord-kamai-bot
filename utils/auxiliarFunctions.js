const config = require(`../config`);
const { client } = require("../index");
const moment = require("moment");
const { SetTempMute, SetUnmute } = require("../mongodb");
const { logger } = require("./logger");


module.exports={TrimMsg, Banning, ban_member_send_message, tempmute, VerificId, punishments}
    
// receives a message and than returns an array with every of the message
    function TrimMsg(msg){
        
        return msg.content.split(/\n| /gm).filter((str) => str.trim())
    }

// ban a member
    async function Banning(id,reason,guild, prune_days = 0){
        await guild.members.ban(id,{reason:reason, days: prune_days}).catch(e=>console.log(e))

    }

// ban a member and send a message on pv
    async function ban_member_send_message(id,reason,guild, executor){
        try{
            let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({unique:true,reason:"ban invite",maxUses:1, maxAge:604800})
            await guild.members.cache.get(id).send(`Aplicado por(${executor.tag}-----${executor.id})\n\nVocê foi banido de KAMAITACHI, por: `+reason+ `\nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)
            guild.members.ban(id,{reason:reason}).catch(e=>console.log(e))
        }catch{
        }
   }

// Tempmutes a user

    async function tempmute(duration, unit, member){
        try {
            let muteTime = moment(0).add(duration, unit).valueOf()
        
            await member.roles.add(config.roles.muted, "Warn mute")
            
            let now = moment.utc().valueOf()
    
            SetTempMute(member.id, now, muteTime)

            setTimeout(async ()=>{
                try{
                    SetUnmute(member.id)
                    await member.roles.remove(config.roles.muted, "Tempo se esgotou")
                }catch(err){
                    console.log(err)
                }
    
            },muteTime)

        } catch (error) {
            console.log(error)
        }
    }

// Verify the passed ids if they are a user, member or is a invalid user
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
                temp = await client.users.fetch(idArray[i],{ force: false, cache:true }).catch(e=>console.log(e))

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
    
// apply all the punishment based on the user points

async function punishments(target_id, points, guild, executor) {
    try {
        let member = guild.members.cache.get(target_id)
        
        if(!member) return false

        if(points>=4) return ban_member_send_message(target_id,"4 advertencias", guild, executor)

        const punishment = (points) =>  {return{
            0:[],
            1:[config.roles.adv1],
            2:[config.roles.adv1, config.roles.adv2],
            3:[config.roles.adv1, config.roles.adv2, config.roles.adv3],
            }[points]
        }

        const pointsAdvRoles = punishment(points)

        function inArray(item){
            return this.includes(item)
        }

        function inArrayNot(item){
            return !this.includes(item)
        }

        const membAdvRoles = member.roles.cache.map(r=> r.id).filter(inArray, punishment(3))
        
        // more roles than it should
        if(membAdvRoles.length > pointsAdvRoles.length) {
        
            let remvRoles = membAdvRoles.filter(inArrayNot, pointsAdvRoles)

            await member.roles.remove(remvRoles)

        // less roles than it shoud
        }else if (membAdvRoles.length < pointsAdvRoles.length){
            const tempmuteDuration = (points) =>  {return{
                0:0,
                1:72000,
                2:43200000,
                3:172800000,
                }[points]
            }

            await tempmute(tempmuteDuration(points), "ms", member)

            let addRoles = pointsAdvRoles.filter(inArrayNot, membAdvRoles )

            await member.roles.add(addRoles)

        }

    } catch (error) {
        logger.error(error)
    }
        
        
    }
    // returns an array of entries separated
 
