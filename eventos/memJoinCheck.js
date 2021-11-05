const {client, selfbotRegister} = require(`../index`);
const config = require(`../config`)
const { CheckMute, warn_list, check_roles } = require("../mongodb");
const { ban_member_send_message } = require("../funções/funções");

// check some informations when a member join
client.on("guildMemberAdd", async (member) => {
    console.log(`Verificando entrada ` + Date.UTC())
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

    
    const regTst = /milena[0-9]+|^! cd17z\W*\w*|Bruninhaa+|Amandaa+|Amandinhaa+|Larinhaa+|Thalitaa+|clarinhaa+|Plyss|! Baixinhaa*|Safiraa+|Mirelinha dos pack/ig
    if((member.displayName.toLowerCase()).match(regTst)){
        try{
            await ban_member_send_message(member.id,"Selfbot!!", member.guild, client.user)
            selfbotRegister.selfbotAdd(Date.now().valueOf(), member.avatar, member.id, member.user.tag, member.user.createdTimestamp, member.joinedTimestamp)
        }catch(error){
            console.log(error)
        }
    member.guild.channels.cache.get(config.channels.acacus).send("Segurei um possivel invasor ==> " + member.displayName + ` [${member.id}]`)
    }
})
