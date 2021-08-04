const config = require("../config");

/*
 returns the latency of the bot
*/

module.exports = { ping }

async function ping(msg){

    let pingingMsg = await msg.channel.send("", { embed: {
        color: config.color.sucess,
        description: "Pinging..."
    }});
    pingingMsg.edit({ embed: {
        color: config.color.sucess,
        description: `**Pong!** Corri até valhalla e voltei em ${pingingMsg.createdTimestamp - msg.createdTimestamp}ms`
    }});

}