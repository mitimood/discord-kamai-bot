const config = require("../config");
const { client } = require("../index");

// Creates an exclusive ticket for a user when joining in the baneds server

client.on("guildMemberAdd", async member=>{
    if(member.guild.id != config.ban_recover.guild_id) return
    member.guild.channels.cache.get(config.ban_recover.log_chnnl).send("👉" + member.user.tag+` [${member.user.id}]`+" entrou na guilda")

    let permissionsTicket = [{id: member.guild.id,type:"role" , "deny":["VIEW_CHANNEL"]},{id:member.id,type:"member", "allow":["VIEW_CHANNEL"]},{id:config.ban_recover.staff_call,"allow":["VIEW_CHANNEL"],type:"role", deny:["SEND_MESSAGES"]},{id: config.ban_recover.staff_chat,"allow":["VIEW_CHANNEL"],type:"role", deny:["SEND_MESSAGES"]},{id:config.ban_recover.staff_mod, type:"role","allow":["VIEW_CHANNEL"]},{id:config.ban_recover.staff_adm,type:"role","allow":["VIEW_CHANNEL"]}]
    let ticket = await member.guild.channels.create(`${member.id}`,{type:`text`, topic:"Ticket para recorrimento de ban, envie seus apontamentos",permissionOverwrites: permissionsTicket})
    ticket.send({embeds:[{title:"Revogação de bans",color:config.color.red, description:"\
    O unico motivo para unban é a contestação da aplicação de uma punição. O ban só pode ser removido caso a punição tenha sido aplicada de uma forma inapropriada, onde o contexto da situação seja permitido nas regras do servidor. As regras se encontram em #:small_orange_diamond:regras\
    \n・Não pingue a staff, aguarde a resposta\
    \n\n\
    Responda as seguintes indagações:\
    \n\
    ・ Quem te baniu?\n\
    ・ Há quanto tempo foi a punição?\n\
    ・Qual foi o motivo da sua punição informado pelo bot?\n\
    ・Explique por que a punição foi aplicada de forma indevida: (esse é o seu momento, não terá outra chance! Então, jogue tudo para rolo!) \n\
       ・Prints são permitidos.\n\
    \n\n\
    Responda as seguintes indagações e aguarde a resposta de seu unban. Caso queira saber o requesito para ser desbanido, consulte o chat #:small_orange_diamond:unban-kamaitachi"}]})
})