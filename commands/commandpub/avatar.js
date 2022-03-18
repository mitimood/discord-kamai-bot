const { MessageEmbed } = require("discord.js");
const { TrimMsg } = require("../../utils/auxiliarFunctions");
const logger = require("../../utils/logger");

module.exports={
    name: "avatar",
    aliases: ["image", "profilepic"],
    description: "Envia a imagem do usuário",

    async execute(msg) {
        try {
            const embed = new MessageEmbed()
        
            let msgArgs = TrimMsg(msg)

            let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1]?.match(/[0-9]/) ? msgArgs[1] : msg.member.id;
            let member = await msg.guild.members.fetch( { user:userid, force: false } )

            embed.setImage(member.user.avatarURL({dynamic: true , format: 'png', size: 2048 }))
            embed.setColor(member.displayHexColor)
            
            await msg.channel.send({content: msg.author.toString() , embeds: [embed]})
        } catch (error) {
            logger.error(error)
        }
        
    }
}
