const {client} = require(`../index`);
const config = require(`../config`)
const { CheckMute, warn_list, check_roles } = require("../mongodb");
const { ban_member_send_message } = require("../funções/funções");

// check some informations when a member join
client.on("guildMemberAdd", async (member) => {
    if(member.guild.id != config.guild_id) return
    let userid=member.user.id

    let muted = await CheckMute(member.id)
    if(muted)member.roles.add(config.roles.muted, "Mutado por entrar após tempmute")

    let roles = await check_roles(member.id)
    if(roles)member.roles.add(roles)

    let warns = await warn_list(userid) 
    
            if (warns["points"] == 1)  member.roles.add(config.roles.adv1)
            if (warns["points"] == 2)  member.roles.add([config.roles.adv1, config.roles.adv2])
            if (warns["points"] == 3)  member.roles.add([config.roles.adv1, config.roles.adv2, config.roles.adv3])

    

    if((member.displayName.toLowerCase()).matchAll(/milena[0-9]*|^! cd17z\W*\w*|Bruninha+|Amanda+|Amandinha+|Larinha+|Thalita+|! Baixinha*|Safira+/)){
        ban_member_send_message(member.id,"Selfbot!!", member.guild, client.user)
        member.guild.channels.cache.get(config.channels.acacus).send("Segurei um possivel invasor ==> " + member.displayName)
    }
})
