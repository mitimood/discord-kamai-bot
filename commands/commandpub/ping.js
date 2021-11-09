const config = require("../../config");
const moment = require(`moment-timezone`)
/*
 returns the latency of the bot
*/

module.exports={
    name: "ping",
    aliases: [],
    description: "informa o tempo de resposta do bot",

    async execute(msg){

    // Adds the user to the set so that they can't talk for a minute
        try {
            let pingingMsg = await msg.channel.send({ embeds: [{
                color: config.color.sucess,
                description: "Pinging..."
            }]});
            await pingingMsg.edit({content: msg.author.toString() , embeds: [{
                color: config.color.sucess,
                description: `**Pong!** Corri até valhalla e voltei em ${pingingMsg.createdTimestamp - msg.createdTimestamp}ms`
            }]});
        } catch (error) {
            console.log(error)
        }
    }
}