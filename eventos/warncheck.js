const {client} = require(`../index`);
const config = require(`../config`)
const { CheckMute, warn_list, check_roles } = require("../mongodb");

client.on("guildMemberAdd", async (member) => {
    if(member.guild.id != config.guild_id) return
    let userid=member.user.id

    let muted = await CheckMute(member.id)
    if(muted)member.roles.add(config.roles.muted, "Mutado por entrar após tempmute")
    //if(index.db.db.exists(`/guilds/${guildid}/users/${userid}/muted`))member.roles.add(config.roles.muted)


    let roles = await check_roles(member.id)
    if(roles)member.roles.add(roles)

    let warns = warn_list(userid) 
    
            if (warns["points"] == 0) return 
            if (warns["points"] >= 1) {member.roles.add(config.roles.adv1);
            {if (warns["points"] >= 2) member.roles.add(config.roles.adv2);
            if (warns["points"] >= 3) member.roles.add(config.roles.adv3);}}
    
})
