const config = require("../config");
const {client, LocalDb} = require(`../index`);
const logger = require("../utils/logger");

client.on("voiceStateUpdate", async (oldstate,newstate)=>
{
    try {

        const premiumRoles = [config.roles.levels["100"], config.roles.nitro, config.roles.trofeu]
        
        const hasPremium = newstate.member.roles.cache.filter((r)=>premiumRoles.includes(r.id)).size >= 1

        let channelcreate = newstate.guild.channels.cache.get(config.channels.pvtcreat);
        var deletechan;
        //Delete channel when empty
        //Previous state category same category as the create category, member has role create, channel already created
        if(( ( oldstate.channel && oldstate.channel.parent == channelcreate.parent ) && hasPremium) && await LocalDb.userVoiceExist(oldstate.id)){
            let channelUser = oldstate.guild.channels.cache.get(await JSON.parse(JSON.stringify(await LocalDb.channelget(oldstate.id))).id)
            if(channelUser != newstate.channel){
                console.log(`Deletando canal premium` + new Date())
                LocalDb.attactivity(newstate.id,0)
                setTimeout(async() => {
                    if(await LocalDb.verifyactivity(oldstate.id)==1) return
                    await channelUser.delete().catch(err=>null)
                    LocalDb.chandelete(newstate.id)
                }, 3000);
            }
        }
        
        //create channel
        if( (newstate.channelId === config.channels.pvtcreat && hasPremium) && !await LocalDb.userVoiceExist(newstate.id)){
            console.log(`Criando o canal premium` + new Date())

            const everyone = newstate.guild.roles.cache.get(newstate.guild.id)
            const bots = newstate.guild.roles.cache.get(config.roles.bots)

            const prmChannel = await newstate.guild.channels.create(`PV [${newstate.member.user.username}]`,{type:"GUILD_VOICE",parent: newstate.channel.parent,permissionOverwrites:[{id:newstate.member.id, allow:["MOVE_MEMBERS","CONNECT"],type:"member"},{id:everyone,deny:"CONNECT",allow:"STREAM",type:"role"}, {id:bots,allow:"CONNECT",type:"role"}]})
            
            LocalDb.attactivity(newstate.id,1)
            LocalDb.savechan(prmChannel,newstate.id)
            await newstate.setChannel(prmChannel)

            }else if(await LocalDb.userVoiceExist(newstate.id)){
            let channelUser = newstate.guild.channels.cache.get(await JSON.parse(JSON.stringify(await LocalDb.channelget(newstate.id))).id)
            if(channelUser == newstate.channel){
                LocalDb.attactivity(newstate.id,1)
                clearTimeout(deletechan)
            }
        }
        
        if (newstate.channel.userLimit < newstate.channel.members.size && hasPremium) {
            try {
                await newstate.disconnect()

                await newstate.member.send({"embeds": [
                    {
                        color: "RED",
                        description: "Você não pode entrar em uma call lotada, seu engraçadinho",
                        image: "https://media2.giphy.com/media/naAaDvbAoOYdW/giphy.gif?cid=ecf05e471j45pmh9mpgf3rx23bw7ia06g4rc40ubcpmwtsxx&rid=giphy.gif&ct=g"
                    }
                ]})
                
            } catch (error) {
                logger.error(error)
            }
        }
    
    } catch (error) {
        logger.error(error)
    }
    
})
