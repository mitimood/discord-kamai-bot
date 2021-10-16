const { client, Discord } = require("..");
const config = require("../config");
const { moneyAdd } = require("../mongodb");

client.on("messageCreate", async (msg) => {

    if(msg.channelId == config.channels.voteLog){
        const userId = msg?.embeds[0]?.description?.match(/id:[0-9]*/g).map(m=>m.match(/[0-9]+/g))[0][0]
        let member
        
        try {
            member = await msg.guild.members.fetch({user: userId})

        } catch (error) {
            console.log(error)
        }

        if(member){
            const emb = new Discord.MessageEmbed()

            emb.setDescription(`**OBRIGADO POR TER VOTADO EM NOSSO SERVIDOR!**
            para votar [clique aqui](https://top.gg/servers/612117634909208576/vote) Você pode votar a cada 12h!
            *Você ganhou* <:Coin_kamai:881917666829414430> \`${config.rewards.voteMoney}\``)
            emb.setColor("#7fffd4")
            msg.guild.channels.cache.get(config.channels.geral).send({content: member.toString(), embeds:[emb]})
        }

        try {
            await moneyAdd( userId, config.rewards.voteMoney )
        } catch (error) {
            console.log(error)
        }
    }
})