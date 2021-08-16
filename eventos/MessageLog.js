const { MessageEmbed } = require("discord.js");
const { client } = require("..");
const config = require("../config");

client.on("messageUpdate", (oldMessage, newMessage)=>{
    if (newMessage.author.bot) return
    try{
        let newEmb = new MessageEmbed()
        let oldEmb = new MessageEmbed()

        oldEmb.setDescription("Mensagem antiga em: " + "<#" + oldMessage.channel.id + ">\n\n" + "```\n" + oldMessage.content + "\n```").setColor("GREY").setAuthor(oldMessage.author.username, oldMessage.author.avatarURL(), oldMessage.author.avatarURL()).setTimestamp(oldMessage.createdTimestamp).setTitle(oldMessage.channel.name )
        newEmb.setDescription("Mensagem nova em: " + "<#" + newMessage.channel.id + ">\n\n" + "```\n" + newMessage.content + "\n```").setColor("GREEN").setAuthor(newMessage.author.username, newMessage.author.avatarURL(), newMessage.author.avatarURL()).setTimestamp(newMessage.createdTimestamp).setTitle(newMessage.channel.name )

        newMessage.guild.channels.cache.get(config.channels.msglog).send({embeds:[oldEmb, newEmb]})

    }catch(err){
        console.log(err)
    }
})

client.on("messageDelete", (delMessage)=>{
    if (delMessage.author.bot) return
    try{
        let delemb = new MessageEmbed()

        delemb.setDescription("Mensagem deletada em <#" + delMessage.channel.id + ">\n" + "```" + delMessage.content + "```").setColor("DARK_RED").setAuthor(delMessage.author.username, delMessage.author.avatarURL(), delMessage.author.avatarURL()).setTimestamp(delMessage.createdTimestamp).setTitle(delMessage.channel.name)
        
        delMessage.guild.channels.cache.get(config.channels.msglog).send({embeds:[delemb]})
    }catch(err){
        console.log(err)
    }
})