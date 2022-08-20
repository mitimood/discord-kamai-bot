const { EmbedBuilder, MessageType } = require("discord.js");
const { client } = require("..");
const config = require("../config");
const db = require("../mongodb");
const logger = require("../utils/logger");
/* 
Filters all the messages sent searching for scam links 
*/

client.on("messageCreate", async msg =>{
    

   if(msg.channelId == "817597687934746624" && msg.content.match(/500/g)){
        await msg.react(":verde_SIM:618576110296367140")

        
        await msg.react(":red_no:618576081544544276")
    }

    try {

        if(msg.type ==  MessageType.ThreadCreated  && msg.system){
            await msg.delete()
        }

        if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(msg.content) && msg?.member?.roles?.cache?.size == 1){
            console.log("Auto filter " + new Date())
            
            await msg.delete()

            const scamLog = await msg.client.channels.fetch(config.channels.scamLog)

            const emb = new EmbedBuilder()
                        .setTimestamp(msg.createdTimestamp)
                        .setDescription(
                            `\`\`\`
${msg.content}
                            \`\`\`
                            `
                        )
                        .setTitle("Possivel SCAM => "+ msg.author.username)
                        .setColor(config.color.red)
                        .setFooter({text:msg.author.id})
                        .setThumbnail(msg.author.avatarURL())

            await scamLog.send({embeds:[emb]})
        }
    } catch (error) {
        logger.error(error)
    }

 

})