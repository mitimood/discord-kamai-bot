const { Discord } = require("..");
const { TrimMsg } = require("../funções/funções");

module.exports={
    name: "avatar",
    aliases: ["image", "profilepic"],
    description: "Envia a imagem do usario",

    async execute(msg) {
        
        const embed = new Discord.MessageEmbed()
        
        let msgArgs = TrimMsg(msg)

        let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1] ? msgArgs[1].match(/[0-9]+/)[0] : msg.member.id;
        let member = await msg.guild.members.fetch({user:userid, force: false})
        embed.setImage(member.user.displayAvatarURL({size:1024}))
        embed.setColor(member.displayHexColor)
        msg.channel.send({embeds: [embed]})
    }
}
