const { Discord } = require("../..");
const { TrimMsg } = require("../../utils/auxiliarFunctions");

module.exports={
    name: "avatar",
    aliases: ["image", "profilepic"],
    description: "Envia a imagem do usario",

    async execute(msg) {
        try {
            const embed = new Discord.MessageEmbed()
        
            let msgArgs = TrimMsg(msg)

            let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1]?.match(/[0-9]/) ? msgArgs[1] : msg.member.id;
            let member = await msg.guild.members.fetch( { user:userid, force: false } )
            embed.setImage(member.user.displayAvatarURL( { size:2048, format: "png"  } ) )
            embed.setColor(member.displayHexColor)
            await msg.channel.send({content: msg.author.toString() , embeds: [embed]})
        } catch (error) {
            console.log(error)
        }
        
    }
}
