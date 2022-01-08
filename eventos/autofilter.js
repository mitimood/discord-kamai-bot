const { MessageEmbed } = require("discord.js");
const { client } = require("..");
const config = require("../config");
const db = require("../mongodb")
/* 
Filters all the messages sent searching for scam links 
*/

client.on("messageCreate", async msg =>{

   if(msg.channelId == "817597687934746624" && msg.content.match(/300/g)){
        await msg.react("✅")

        await msg.react("❌")
    }

    if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(msg.content) && msg?.member?.roles?.cache?.size == 1){
        try {
            console.log("Auto filter " + new Date())
            
            await msg.delete()

            const scamLog = await msg.client.channels.fetch(config.channels.scamLog)

            const emb = new MessageEmbed()
                        .setTimestamp(msg.createdTimestamp)
                        .setDescription(
                            `\`\`\`
${msg.content}
                            \`\`\`
                            `
                        )
                        .setTitle("Possivel SCAM => "+ msg.author.username)
                        .setColor("RED")
                        .setFooter(msg.author.id)
                        .setThumbnail(msg.author.avatarURL())

            await scamLog.send({embeds:[emb]})

        } catch (error) {
            console.log(error)
        }
    }

})