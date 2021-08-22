const config = require("../../config");

/*
  Unban a user from the server

  unban (id of the user)
*/

module.exports={
    name: "unban",
    aliases: [],
    description: "desbane um usuario",
  
    execute(message) {
      
      var msgArgs = message.content.split(" ");
      if(!msgArgs || !msgArgs[1]) return message.channel.send("Especifique o id do membro a ser desbanido")
      var userid = (message.mentions.members.first()) ? message.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];

        message.guild.bans.fetch().then(bans=> {
        if(bans.size == 0) return 
        let bUser = bans.find(b => b.user.id == userid)
        if(!bUser) return
        message.guild.members.unban(bUser.user)})
        message.channel.send({ embeds: [{
          color: config.color.sucess,
          description: `Membro **desbanido** com sucesso.:  id:${userid} `}]})
    }
}