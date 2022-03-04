const { LocalDb } = require("../..");
const config = require("../../config");
const logger = require("../../utils/logger");
require('dotenv').config();
const envTemp = require('../../envtemp.json')

/*
    Open the abbadon channel channel requiring a password
*/
module.exports={
    name: "open",
    aliases: [],
    description: "Abre a sala de abaddon", 
    async execute(msg){
        try {
            try{
                if(await LocalDb.get_channel(config.channels.abaddon_voice)["state"]) return await msg.channel.send("<#"+config.channels.abaddon_voice+">")
                var question = await msg.channel.send({embeds:[{
                    image:{url:"https://media0.giphy.com/media/WFOmpGEzIFnHYAYvR2/giphy.gif?cid=790b76118c086bcc53069aaf9bba6512c50d9815cf3fc3b5&rid=giphy.gif&ct=g"},
                    description:"`É um possuidor do passe?`",
                    title: "Quem tenta abrir os portões?",
                    color: config.color.red
                }]})
                let filter = x=> msg.author == x.author
                let password = await msg.channel.awaitMessages({filter,time:10000,max:1})
    
                if(password.first().content.toLowerCase() == envTemp.passwordAbaddon){
                    await question.delete()
                    open(password.first())
                
                }else{
                    throw `WrongPassword`
                    
                }
            }catch(e){
                if(e == `WrongPassword`){
                    await question.delete()
                    await msg.channel.send({embeds:[{
                        description:"A voz da sua alma ira te guiar por um caminho. Escute o seu interior",
                        title: "Você não tem noção do que diz",
                        color: config.color.red
                    }]})
                }else{
                    await question.delete()
                    await msg.channel.send({embeds:[{
                        description:"*Até uma proxima*",
                        title: "Vejo que perdi meu tempo aqui",
                        color: config.color.red
                    }]})
                }
            }        
        } catch (error) {
            logger.error(error)
        }
        
    }
}

async function open(msg){
    try {
        await msg.delete()

        if(await LocalDb.get_channel(config.channels.abaddon_voice)["state"]) return msg.channel.send("<#"+config.channels.abaddon_voice+">")
        
        LocalDb.set_channel_state(config.channels.abaddon_voice, true)
        
        let abaddon = msg.guild.channels.cache.get(config.channels.abaddon_voice)
        
        var welcome = await msg.channel.send({embeds:[{
            thumbnail:{url:"https://media2.giphy.com/media/6G118Ea8ppWuCAhMDw/giphy.gif?cid=790b761104af5a82e6d44948502f7b25dd42bc4e6931159d&rid=giphy.gif&ct=s"},
            image:{url:"https://i.imgur.com/dFlhEmM.png"},
            description:"`Estou fazendo os preparativos`",
            title: "Bom vê-lo por aqui!",
            color: config.color.red
        }]})
        
        setTimeout(async()=>{
            try {
                await welcome.delete()
        
                await msg.channel.send({content:"<#"+config.channels.abaddon_voice+">",embed:{
                    description:"`Irei me retirar do meu posto de guarda! Cuide por mim`",
                    title: "Seja bem vindo!",
                    color: config.color.red
                }})
                await abaddon.permissionOverwrites.create(msg.guild.id,{CONNECT:true})
            } catch (error) {
                logger.error(error)
            }

        }, 20000)
    } catch (error) {
        logger.error(error)
    }
    

}