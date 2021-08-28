const { MessageEmbed } = require("discord.js");
const { client } = require("..");
const config = require("../config");

client.on("messageUpdate", (oldMessage, newMessage)=>{
    if (newMessage.author.bot) return
    try{
        let newEmb = new MessageEmbed()
        let oldEmb = new MessageEmbed()

        let oldImageUrl = '';

        for( atach of oldMessage.attachments ){
            oldImageUrl +=  `\n${atach[1].attachment}`
        }

        oldEmb.setDescription("Mensagem antiga em: " + "<#" + oldMessage.channel.id + ">\n\n" + "```\n" + oldMessage.content + "\n```" + oldImageUrl).setColor("GREY").setAuthor(oldMessage.author.username, oldMessage.author.avatarURL(), oldMessage.author.avatarURL()).setTimestamp(oldMessage.createdTimestamp).setTitle(oldMessage.channel.name ).setFooter(oldMessage.member.id)
        
        let newImageUrl = '';

        for( atach of newMessage.attachments ){
            newImageUrl +=  `\n${atach[1].attachment}`
        }
        
        newEmb.setDescription("Mensagem nova em: " + "<#" + newMessage.channel.id + ">\n\n" + "```\n" + newMessage.content + "\n```" + newImageUrl).setColor("GREEN").setAuthor(newMessage.author.username, newMessage.author.avatarURL(), newMessage.author.avatarURL()).setTimestamp(newMessage.createdTimestamp).setTitle(newMessage.channel.name ).setFooter(newMessage.member.id)

        newMessage.guild.channels.cache.get(config.channels.msglog).send({embeds:[oldEmb, newEmb]})

    }catch(err){
        console.log(err)
    }
})

client.on("messageDelete", (delMessage)=>{

    if (delMessage.author.bot) return
    try{
        let delemb = new MessageEmbed()
        let imageUrl = '';

        for( atach of delMessage.attachments ){
            imageUrl += `\n${atach[1].attachment}`
        }

        delemb.setDescription("Mensagem deletada em <#" + delMessage.channel.id + ">\n" + "```" + delMessage.content  +"```" + imageUrl).setColor("DARK_RED").setAuthor(delMessage.author.username, delMessage.author.avatarURL(), delMessage.author.avatarURL()).setTimestamp(delMessage.createdTimestamp).setTitle(delMessage.channel.name).setFooter(delMessage.member.id)
        
        delMessage.guild.channels.cache.get(config.channels.msglog).send({embeds:[delemb]})

    }catch(err){
        console.log(err)
    }
})