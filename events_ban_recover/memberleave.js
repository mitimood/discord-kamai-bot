const { client } = require("../");
const config = require("../config");

// Deleltes the exclusive ticket for a user when joining in the baneds server

client.on("guildMemberRemove", member =>{
    if(member.guild.id != config.ban_recover.guild_id) return
    member.guild.channels.cache.get(config.ban_recover.log_chnnl).send("👈" + member.user.tag+ " saiu da guilda")
    try{
        member.guild.channels.cache.find(m=> m.name == member.id).delete()
    }catch{

    }
})