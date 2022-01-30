const { MessageEmbed } = require("discord.js");
const { client } = require("..");
const config = require("../config");
const logger = require("../utils/logger");

client.on("messageUpdate", async (oldMessage, newMessage)=>{
    try{
        if (newMessage.author.bot) return

        logger.info(`Atualizando mensagem `)

        let newEmb = new MessageEmbed()
        let oldEmb = new MessageEmbed()

        let oldImageUrl = '';

        for( let atach of oldMessage.attachments ){
            oldImageUrl += `\n${atach[1].attachment}`
        }

        oldEmb.setDescription("Mensagem antiga em: " + "<#" + oldMessage.channel.id + ">\n\n" + "```\n" + oldMessage.content + "\n```" + oldImageUrl).setColor("GREY").setAuthor({name: oldMessage.author.username, iconURL:oldMessage.author.avatarURL(), url: oldMessage.author.avatarURL()}).setTimestamp(oldMessage.createdTimestamp).setTitle(oldMessage.channel.name ).setFooter({text:oldMessage.member.id})
        
        let newImageUrl = '';

        for( let atach of newMessage.attachments ){
            newImageUrl +=  `\n${atach[1].attachment}`
        }
        
        newEmb.setDescription("Mensagem nova em: " + "<#" + newMessage.channel.id + ">\n\n" + "```\n" + newMessage.content + "\n```" + newImageUrl).setColor("GREEN").setAuthor({name: newMessage.author.username, iconURL: newMessage.author.avatarURL(), url: newMessage.author.avatarURL()}).setTimestamp(newMessage.createdTimestamp).setTitle(newMessage.channel.name ).setFooter({text:newMessage.member.id})

        await newMessage.guild.channels.cache.get(config.channels.msglog).send({embeds:[oldEmb, newEmb]})

    }catch(err){
        logger.error(err)
    }
})

client.on("messageDelete", async (delMessage)=>{



    try{
        if (delMessage.author.bot) return
    
        logger.info(`Mensagem apagada `)

        let delemb = new MessageEmbed()
        let imageUrl = '';

        for( atach of delMessage.attachments ){
            imageUrl += `\n${atach[1].attachment}`
        }

        delemb.setDescription("Mensagem deletada em <#" + delMessage.channel.id + ">\n" + "```" + delMessage.content  +"```" + imageUrl).setColor("DARK_RED").setAuthor({name: delMessage.author.username, iconURL: delMessage.author.avatarURL(), url: delMessage.author.avatarURL()}).setTimestamp(delMessage.createdTimestamp).setTitle(delMessage.channel.name).setFooter({text:delMessage.member.id})
        
        await delMessage.guild.channels.cache.get(config.channels.msglog).send({embeds:[delemb]})

    }catch(err){
        logger.error(err)
    }
})

client.on('messageDeleteBulk', async mapMsg =>{

    try {
        let bulkText = ""

        logger.info(`Mensagem apagada em massa `)
    
        for(let msg of mapMsg ){
            bulkText += `[${Date(msg[1].createdTimestamp)}] ${msg[1].author.username} => ${msg[1].content}`
            for ( let atach of msg[1].attachments ){
                bulkText += atach[1].attachment
            }
            bulkText += "\n"
        }
    
        let bulkDeletedMessages = await new Buffer.from(bulkText, "utf-8")
    
        await client.channels.cache.get(config.channels.msglog).send({files: [{ attachment:bulkDeletedMessages, name: "mensagensApagadas.txt"}]})

    } catch (error) {
        logger.error(error)
    }

})