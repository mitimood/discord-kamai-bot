const { LocalDb } = require("..");
const config = require("../config");
const config_secret = require("../config_secret")

module.exports = { open_abbadon }


async function open_abbadon(msg) {
 
    try{
        if(await LocalDb.get_channel(config.channels.abaddon_voice)["state"]) return msg.channel.send("<#"+config.channels.abaddon_voice+">")
        var question = await msg.channel.send({embed:{
            image:{url:"https://media0.giphy.com/media/WFOmpGEzIFnHYAYvR2/giphy.gif?cid=790b76118c086bcc53069aaf9bba6512c50d9815cf3fc3b5&rid=giphy.gif&ct=g"},
            description:"`É um possuidor do passe?`",
            title: "Quem tenta abrir os portões?",
            color: config.color.red
        }})
        let filter = x=> msg.author == x.author
        let password = await msg.channel.awaitMessages(filter,{time:10000,max:1})

        if(password.first().content.toLowerCase() == config_secret.passwords.abaddon){
            question.delete()
            open(password.first())
        
        }else{
            throw `WrongPassword`
            
        }
    }catch(e){
        if(e == `WrongPassword`){
                question.delete()
                msg.channel.send({embed:{
                    description:"A voz da sua alma ira te guiar por um caminho. Escute o seu interior",
                    title: "Você não tem noção do que diz",
                    color: config.color.red
                }})
        }else{
            question.delete()
            msg.channel.send({embed:{
                description:"*Até uma proxima*",
                title: "Vejo que perdi meu tempo aqui",
                color: config.color.red
            }})
        }
    }
    
}

async function open(msg){

    msg.delete()
    if(await LocalDb.get_channel(config.channels.abaddon_voice)["state"]) return msg.channel.send("<#"+config.channels.abaddon_voice+">")
    LocalDb.set_channel_state(config.channels.abaddon_voice, true)
    let abaddon = msg.guild.channels.cache.get(config.channels.abaddon_voice)
    var welcome = await msg.channel.send({embed:{
        thumbnail:{url:"https://media2.giphy.com/media/6G118Ea8ppWuCAhMDw/giphy.gif?cid=790b761104af5a82e6d44948502f7b25dd42bc4e6931159d&rid=giphy.gif&ct=s"},
        image:{url:"https://i.imgur.com/dFlhEmM.png"},
        description:"`Estou fazendo os preparativos`",
        title: "Bom vê-lo por aqui!",
        color: config.color.red
    }})
    setTimeout(()=>{
        welcome.delete()
        msg.channel.send({content:"<#"+config.channels.abaddon_voice+">",embed:{
            description:"`Irei me retirar do meu posto de guarda! Cuide por mim`",
            title: "Seja bem vindo!",
            color: config.color.red
        }})
        abaddon.updateOverwrite(msg.guild.id,{CONNECT:true})

    }, 20000)

}