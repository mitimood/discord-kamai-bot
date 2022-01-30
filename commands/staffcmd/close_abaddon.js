const { LocalDb } = require("../..")
const config = require("../../config")
const logger = require("../../utils/logger")

module.exports={
    name: "close",
    aliases: ["fechar"],
    description: "fecha a sala do abaddon",

    async execute (msg){
        try {
                    
            if(!await LocalDb.get_channel(config.channels.abaddon_voice) || !await LocalDb.get_channel(config.channels.abaddon_voice)["state"]) return await msg.channel.send("<#"+config.channels.abaddon_voice+">")
            
            LocalDb.set_channel_state(config.channels.abaddon_voice, false)
            
            await msg.channel.send({embeds:[{
                thumbnail:{url:"https://i.imgur.com/dFlhEmM.png"},
                description:`Luz Obscura
                Que Clareia a escuridão
                E da alma mais pura
                Paira em mim a Solidão
                
                Nos meus lábios, tocam o nada
                Em Muitos morbidos a satisfação
                E a luxúria destes saciada
                Prevalece o vazio em meu profano coração
                
                Aprendi o ódio com o amor
                A loucura inválida
                Filho da noite eu sou
                Em minha face a figura pálida
                
                Negro Interior
                Frestas de luz
                Minha inferioridade Superior
                Que as trevas me conduz`,
                title: "Daqui por diante eu cuido",
                color: config.color.red
            }]})
            
            await msg.guild.channels.cache.get(config.channels.abaddon_voice).permissionOverwrites.create(msg.guild.id,{CONNECT:false})
            
        } catch (error) {
            logger.error(error)
        }

    }
}