const config = require("../config");
const {client, LocalDb} = require(`../index`);

client.on("voiceStateUpdate", async (oldstate,newstate)=>
{
    try {
        let channelcreate = newstate.guild.channels.cache.get(config.channels.pvtcreat);
        console.log(`Problema de `)
    var deletechan;
    //Delete channel when empty
    if(oldstate.channel){
        //Previous state category same category as the create category, member has role create, channel already created
        if(oldstate.channel.parent == channelcreate.parent && newstate.member.roles.cache.has(config.roles.voicecreat) && await LocalDb.userVoiceExist(oldstate.id)){
            let channelUser = oldstate.guild.channels.cache.get(await JSON.parse(JSON.stringify(await LocalDb.channelget(oldstate.id))).id)
            if(channelUser != newstate.channel){
                console.log(`Deletando canal premium` + new Date())
                LocalDb.attactivity(newstate.id,0)
                setTimeout(async() => {
                    if(await LocalDb.verifyactivity(oldstate.id)==1) return
                    channelUser.delete().catch(err=>null)
                    LocalDb.chandelete(newstate.id)
                }, 2000);
            }
        }
    }
    //create channel
    if(newstate.channelId === config.channels.pvtcreat && newstate.member.roles.cache.has(config.roles.voicecreat)&&!await LocalDb.userVoiceExist(newstate.id)){
        console.log(`Deletando canal premium` + new Date())

        let everyone = newstate.guild.roles.cache.get(newstate.guild.id)
        newstate.guild.channels.create(`PV [${newstate.member.user.username}]`,{type:"GUILD_VOICE",parent: newstate.channel.parent,permissionOverwrites:[{id:newstate.member.id, allow:["MOVE_MEMBERS","CONNECT"],type:"member"},{id:everyone,deny:"CONNECT",type:"role"}]}).then(async chan=>
        {
            LocalDb.attactivity(newstate.id,1)
            LocalDb.savechan(chan,newstate.id)
        })
    }else if(await LocalDb.userVoiceExist(newstate.id)){
        let channelUser = newstate.guild.channels.cache.get(await JSON.parse(JSON.stringify(await LocalDb.channelget(newstate.id))).id)
        if(channelUser == newstate.channel){
            LocalDb.attactivity(newstate.id,1)
            clearTimeout(deletechan)
        }
    }
    } catch (error) {
        console.log(error)
    }
    
})
