const {client} = require(`../index`);
const index = require(`../index`);
const config = require(`../config`)
const { CheckMute } = require("../mongodb");

client.on("guildMemberAdd", async (member) => {
    if(member.guild.id != config.guild_id) return
    let userid=member.user.id
    var guildid=member.guild.id

    let muted = await CheckMute(member.id)
    if(muted)member.roles.add(config.roles.muted, "Mutado por entrar após tempmute")
    //if(index.db.db.exists(`/guilds/${guildid}/users/${userid}/muted`))member.roles.add(config.roles.muted)


    index.db.getWarnings(guildid, userid) 
        .then(warnings => {
            if (warnings.length == 0) return 
            if (warnings.length >= 1) {member.roles.add(config.roles.adv1);
            {if (warnings.length >= 2) member.roles.add(config.roles.adv2);
            if (warnings.length >= 3) member.roles.add(config.roles.adv3);}}
    })
})
