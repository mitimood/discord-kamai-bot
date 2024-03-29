const { Collection, EmbedBuilder,  InteractionType } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { gamesDB } = require("../../..");
const logger = require("../../../utils/logger");
const config = require("../../../config");
const cooldown = new Collection()

module.exports={
    data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Ganhe a sua quantidade diaria de Kamaicoins ☀'),
    name: "daily",
    aliases: ["diario"],
    description: "Use o comando 1x ao dia para ganhar kamaicoins",

    async execute(msg) {

        try {
            let authorId = ""

            if(msg.type === InteractionType.ApplicationCommand){
                authorId = msg.user.id

            }else{
                authorId = msg.author.id

            }
            const localDaily = cooldown.get(authorId)

            if( localDaily && new Date().valueOf() < localDaily + 86400000 ) return await cooldownMessage(localDaily)

            const last = await gamesDB.daily_get(authorId)

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
                    const daily = await gamesDB.daily_set(authorId)
                    const emb = new EmbedBuilder()
                                    .setColor(config.color.yellow)
                                    .setDescription(`Você ganhou <a:Coin:881915668499398686>**${daily.money}**! 
                                    Volte amanhã para mais`)
                                    .setTitle( daily.streak === 1 ? "Você só tem 1 daily acumulado" : `Você tem ${daily.streak} dailys acumulados`)
                                    .setThumbnail("https://media4.giphy.com/media/NHx0Z1RsBpymPzU8SE/giphy.gif?cid=790b7611e9caefea16ed9f9c6cb0ff88294b179a7d1cf092&rid=giphy.gif&ct=s")
                    
                    cooldown.set( authorId, new Date().valueOf() )
                    if(msg.type === InteractionType.ApplicationCommand){
                        return await msg.editReply({embeds: [emb]})

                    }else{
                        return await msg.reply({embeds: [emb]})

                    }

                } catch (error) {
                    logger.error(error)
                }
            }

            async function cooldownMessage(time){
                try {
                    const nextDaily = new Date( time + 86400000 )
                    const today = new Date()
                    const timeLast = new Date(nextDaily - today)
                    
                    if( msg.type === InteractionType.ApplicationCommand){
                        return await msg.editReply( { content: `Você precisa esperar ${timeLast.getUTCHours() ? `${timeLast.getUTCHours()}h` : ""} ${timeLast.getUTCMinutes() ? `${timeLast.getUTCMinutes()}m` : "" } ${timeLast.getUTCSeconds() ? `${timeLast.getUTCSeconds()}s` : ""} para utilizar o comando novamente` } )

                    }else{
                        return await msg.reply( { content: `Você precisa esperar ${timeLast.getUTCHours() ? `${timeLast.getUTCHours()}h` : ""} ${timeLast.getUTCMinutes() ? `${timeLast.getUTCMinutes()}m` : "" } ${timeLast.getUTCSeconds() ? `${timeLast.getUTCSeconds()}s` : ""} para utilizar o comando novamente` } )

                    }
        
                } catch (error) {
                    logger.error(error)
                }
            }
        } catch (error) {
            logger.error(error)
        }
        
    }
}
