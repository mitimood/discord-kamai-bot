const config = require("../config");

/*
 returns the latency of the bot
*/

module.exports={
    name: "ping",
    aliases: [],
    description: "",

    async execute(msg){
    let pingingMsg = await msg.channel.send({ embeds: [{
        color: config.color.sucess,
        description: "Pinging..."
    }]});
    pingingMsg.edit({ embeds: [{
        color: config.color.sucess,
        description: `**Pong!** Corri até valhalla e voltei em ${pingingMsg.createdTimestamp - msg.createdTimestamp}ms`
    }]});

    }
}