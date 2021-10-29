const { Collection, MessageEmbed } = require("discord.js");
const moment = require('moment-timezone');
const config = require("../../../config");
const { daily_get, daily_set } = require("../../../mongodb");

const cooldown = new Collection()

module.exports={
    name: "daily",
    aliases: ["diario"],
    description: "Use o comando 1x ao dia para ganhar kamaicoins",

    async execute(msg) {

        const authorId = msg.author.id
        const localDaily = cooldown.get(authorId)

        if( new Date().valueOf() < localDaily + 86400000 ){
            return await cooldownMessage(localDaily)

        }

        const last = await daily_get(authorId)

        if (last){
            if( new Date().valueOf() > 86400000 + last){
                
                await adicionarDaily()

            }else {
                cooldown.set(authorId, last)

                return await cooldownMessage(last)

            }

        }else{
            await adicionarDaily()

        }


        async function adicionarDaily(){
            try {
                const daily = await daily_set(authorId)
                const emb = new MessageEmbed()
                                .setColor("YELLOW")
                                .setDescription(`Você ganhou <a:Coin:881915668499398686>**${daily.money}**! 
                                Volte amanhã para mais`)
                                .setTitle( daily.streak === 1 ? "Você só tem 1 daily acumulado" : `Você tem ${daily.streak} dailys acumulados`)
                                .setThumbnail("https://media4.giphy.com/media/NHx0Z1RsBpymPzU8SE/giphy.gif?cid=790b7611e9caefea16ed9f9c6cb0ff88294b179a7d1cf092&rid=giphy.gif&ct=s")
                
                cooldown.set( authorId, new Date().valueOf() )

                return msg.reply({embeds: [emb]})
    
            } catch (error) {
            }
        }

        async function cooldownMessage(time){
            const nextDaily = new Date( time + 86400000 )
            const today = new Date()
            const timeLast = new Date(nextDaily - today)

            return await msg.reply( { content: `Você precisa esperar ${timeLast.getUTCHours() ? `${timeLast.getUTCHours()}h` : ""} ${timeLast.getUTCMinutes() ? `${timeLast.getUTCMinutes()}m` : "" } ${timeLast.getUTCSeconds() ? `${timeLast.getUTCSeconds()}s` : ""} para utilizar o comando novamente` } )
        }
    }
}
