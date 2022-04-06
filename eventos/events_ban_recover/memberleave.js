const { client } = require("../..");
const config = require("../../config");
const logger = require("../../utils/logger");

// Deleltes the exclusive ticket for a user when joining in the baneds server

client.on("guildMemberRemove", async member =>{

    try{
        if(member.guild.id != config.ban_recover.guild_id) return
        await member.guild.channels.cache.get(config.ban_recover.log_chnnl).send("👈" + member.user.tag+` [${member.user.id}]`+ " saiu da guilda")
        await member.guild.channels.cache.find(m=> m.name == member.id).delete()
    }catch(err){
        logger.error(err)
    }
})