const config = require("../../config");
const logger = require("../../utils/logger");

/*
  Unban a user from the server

  unban (id of the user)
*/

module.exports={
    name: "unban",
    aliases: [],
    description: "desbane um usuario",
  
    async execute(message) {
      
      try {
        const msgArgs = message.content.split(" ")

        if(!msgArgs || !msgArgs[1]) return await message.channel.send("Especifique o id do membro a ser desbanido")
        
        const userid = (message.mentions.members.first()) ? message.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];
  
        const ban = await message.guild.bans.fetch(userid)

        if(!ban) return await message.channel.send("O membro não esta banido")

        const bUser = ban.user

        await message.guild.members.unban(bUser)

        await message.channel.send({ embeds: [{
          color: config.color.sucess,
          description: `Membro **desbanido** com sucesso${bUser.toString()} .:  id:${bUser.id} `}]})

      } catch (error) {
        logger.error(error)
      }

    }
}