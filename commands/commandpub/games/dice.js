const { EmbedBuilder, InteractionType } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { moneyAdd } = require("../../../mongodb");
const { gamesDB } = require("../../../")
const logger = require("../../../utils/logger");
const config = require("../../../config");


module.exports={
    data: new SlashCommandBuilder()
    .setName('rolar')
    .setDescription('Role o dado de 10000 lados e tente a sorte'),
    name: "rolar",
    aliases: ["dice", "dado"],
    description: "Role o dado de 10000 lados e tente a sorte",

    async execute(msg) {
        try {
            let authorId = ""
            if(msg.type === InteractionType.ApplicationCommand){
                authorId = msg.user.id
    
            }else{
                authorId = msg.author.id
    
            }
            

            let dices = await gamesDB.diceGet(authorId)
            let found = false
            let diceIndex = null
            let lastTime = 0
            let left = -1

            if(dices){
                for( let i = 1 ; dices.length > i ; i++ ){
                    if( dices[i].time < Date.now() - 7200000 ){
                        diceIndex = i
                        left++
                        found = dices[i]
                    }else{
                        if( lastTime < dices[i].time ){
                            lastTime = dices[i].time 
                        }
                    }
                }

            if(found){
               const prize = await roll( diceIndex, left)
                
               if(msg.type === InteractionType.ApplicationCommand){
                    await msg.editReply({embeds:[prize]})

                }else{
                    await msg.reply({embeds:[prize]})

                }

            }else{
                await cooldownMessage(lastTime)
            }
            
            }else{
                dices = [ {quantity:4}, {type: "normal", time: null}, {type: "normal", time: null}, {type: "normal", time: null}, {type: "normal", time: null} ]

                await gamesDB.diceUpdate(authorId, dices)
                const prize = await roll(1, 3)
                
                if(msg.type === InteractionType.ApplicationCommand){
                    await msg.editReply({embeds: [new EmbedBuilder()
                        .setTitle("Parece que é a sua primeira vez por aqui")
                        .setDescription("Tome 4 dados para começar")
                        .setColor(config.color.dark_red)
                        .setThumbnail("https://media2.giphy.com/media/fmjmxCd7szjzO/giphy.gif"), prize]})
                }else{
                    await msg.reply({embeds: [new EmbedBuilder()
                        .setTitle("Parece que é a sua primeira vez por aqui")
                        .setDescription("Tome 4 dados para começar")
                        .setColor(config.color.dark_red)
                        .setThumbnail("https://media2.giphy.com/media/fmjmxCd7szjzO/giphy.gif"), prize]})
                }

            }

            async function roll(position, diceLeft){
                try {
                    let dice = dices[position]
                    dice.time = Date.now()
    
                    dices[position] = dice
    
                    await gamesDB.diceUpdate(authorId,dices)
                    const message = await prize(dice.type, diceLeft)
                    return message
                } catch (error) {
                    logger.error(error)
                }

            }

            async function prize(type, diceLeft){
                try {
                    let tier1 = 0
                let tier2 = 0
                let tier3 = 0
                let tier4 = 0
                let tier5 = 0

                if(type === "normal"){
                    tier5 = 990
                    tier4 = 950
                    tier3 = 800
                    tier2 = 500
                    tier1 = 0
                }

                const value = parseInt(Math.random() * 1000)
                let message = new EmbedBuilder()

                switch(true){
                    case (value >= tier5):
                        await moneyAdd(authorId, 2000)
                        message.setTitle(`${value}🎲  ${diceLeft} dados restantes`)
                        .setDescription("Você ganhou 2000 kamaicoins")
                        .setThumbnail("https://media1.giphy.com/media/1OQCVjUPg67Jx4gI6J/giphy.gif?cid=790b76115ed1e1727f975fea0559d5af16b7221f6c4a0204&rid=giphy.gif&ct=s")
                        .setColor(config.color.yellow)

                        break;
                    case (value >= tier4):

                        await moneyAdd(authorId, 1000)
                        message.setTitle(`${value}🎲  ${diceLeft} dados restantes`)
                        .setDescription("Você ganhou 1000 kamaicoins")
                        .setThumbnail("https://media1.giphy.com/media/1OQCVjUPg67Jx4gI6J/giphy.gif?cid=790b76115ed1e1727f975fea0559d5af16b7221f6c4a0204&rid=giphy.gif&ct=s")
                        .setColor(config.color.yellow)
                        break;
                    case (value >= tier3):

                        await moneyAdd(authorId, 200)
                        message.setTitle(`${value}🎲  ${diceLeft} dados restantes`)
                        .setDescription("Você ganhou 200 kamaicoins")
                        .setThumbnail("https://media1.giphy.com/media/1OQCVjUPg67Jx4gI6J/giphy.gif?cid=790b76115ed1e1727f975fea0559d5af16b7221f6c4a0204&rid=giphy.gif&ct=s")
                        .setColor(config.color.yellow)

                        break;
                    case (value >= tier2):

                        await moneyAdd(authorId, 100)
                        message.setTitle(`${value}🎲  ${diceLeft} dados restantes`)
                        .setDescription("Você ganhou 100 kamaicoins")
                        .setThumbnail("https://media1.giphy.com/media/1OQCVjUPg67Jx4gI6J/giphy.gif?cid=790b76115ed1e1727f975fea0559d5af16b7221f6c4a0204&rid=giphy.gif&ct=s")
                        .setColor(config.color.yellow)

                        break;      
                    case (value >= tier1):

                        await moneyAdd(authorId, 30)
                        message.setTitle(`${value}🎲  ${diceLeft} dados restantes`)
                        .setDescription("Você ganhou 30 kamaicoins")
                        .setThumbnail("https://media1.giphy.com/media/1OQCVjUPg67Jx4gI6J/giphy.gif?cid=790b76115ed1e1727f975fea0559d5af16b7221f6c4a0204&rid=giphy.gif&ct=s")
                        .setColor(config.color.yellow)

                        break;    
                }
                return message
                } catch (error) {
                    logger.error(error)   
                }
            }

            async function cooldownMessage(time){
                try {
                    const nextDaily = new Date( time + 7200000 )
                    const today = new Date()
                    const timeLast = new Date(nextDaily - today)

                    if(msg.type === InteractionType.ApplicationCommand){
                        return await msg.editReply( { content: `Você precisa esperar ${timeLast.getUTCHours() ? `${timeLast.getUTCHours()}h` : ""} ${timeLast.getUTCMinutes() ? `${timeLast.getUTCMinutes()}m` : "" } ${timeLast.getUTCSeconds() ? `${timeLast.getUTCSeconds()}s` : ""} para rolar os dados novamente` } )
    
                    }else{
                        return await msg.reply( { content: `Você precisa esperar ${timeLast.getUTCHours() ? `${timeLast.getUTCHours()}h` : ""} ${timeLast.getUTCMinutes() ? `${timeLast.getUTCMinutes()}m` : "" } ${timeLast.getUTCSeconds() ? `${timeLast.getUTCSeconds()}s` : ""} para rolar os dados novamente` } )
    
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
