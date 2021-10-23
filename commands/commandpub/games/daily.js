const { Collection, MessageEmbed } = require("discord.js");
const moment = require('moment-timezone');
const { daily_get, daily_set } = require("../../../mongodb");

const cooldown = new Collection()

module.exports={
    name: "daily",
    aliases: ["diario"],
    description: "Use o comando 1x ao dia para ganhar kamaicoins",

    async execute(msg) {

        const today = moment.utc().valueOf()
        const authorId = msg.author.id

        if( cooldown.has(authorId) && Math.sign( moment( today - cooldown.get(authorId).since)) === 1 ) return messageReturn(cooldown.get(authorId).since, msg)

        let dbResult = {}
        try{
            dbResult = await daily_get(msg.author.id)

            let fromDb = false
            if (Date.now().valueOf() < 86400000 + dbResult.last){
                fromDb = true
                return messageReturn( dbResult.last, msg )
            } 

            let dailyInf = await daily_set(msg.author.id)

            let emb = new MessageEmbed()

            emb.setColor("YELLOW")
            emb.setTitle("Volte amanhã para mais 🌞")
            emb.setDescription(`Você ganhou => <:Coin_kamai:881917666829414430> \`${dailyInf.money}\`  \ \ \ \ ${dailyInf.streak>1 ? ` com ${dailyInf.streak} dias seguidos`  : ""} `)

            msg.reply({embeds:[emb]})
        }catch(err) {
            console.log(err)
        }finally {
            if( fromDb ){

                cooldown.set( authorId, { since:  dbResult.last  } )
                setTimeout(()=>{
                    cooldown.delete( authorId )
                },86400000 )

            }else{
                cooldown.set( authorId, { since: Date.now().valueOf()} )
                setTimeout(()=>{
                    cooldown.delete( authorId )
                },86400000 )
            }


        }

    }
}


function messageReturn(time, msg){
    const tomorrow = moment( time + 86400000  ).valueOf()
    const tomorrowRelative = moment( tomorrow - moment.utc().valueOf() ).utc()

    msg.reply( { content: `Você precisa esperar ${tomorrowRelative.hours() ? `${tomorrowRelative.hours()}h` : ""} ${tomorrowRelative.minutes() ? `${tomorrowRelative.minutes()}m` : ""} para utilizar o comando novamente` } )
}
