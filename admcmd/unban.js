const config = require("../config");

/*
  Unban a user from the server

  unban (id of the user)
*/

module.exports = {unban}
function unban(message) {
    
    var msgArgs = message.content.split(" ");

    var userid = (message.mentions.members.first()) ? message.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];

      message.guild.fetchBans().then(bans=> {
      if(bans.size == 0) return 
      let bUser = bans.find(b => b.user.id == userid)
      if(!bUser) return
      message.guild.members.unban(bUser.user)})
      message.channel.send({ embed: {
        color: config.color.sucess,
        description: `Membro **desbanido** com sucesso.:  id:${userid} `}})
};