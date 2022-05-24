const { SlashCommandBuilder } = require("@discordjs/builders");
const {fetch} = require('cross-fetch')
const {MessageEmbed} = require('discord.js');
const config = require("../../config");
const logger = require("../../utils/logger");

module.exports={
    data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Despausa a música'),
    name: "resume",
    aliases: [],
    description: "Despausa a música",

    async execute(msg) {
        if(msg.type != "APPLICATION_COMMAND") return await msg.followUp('Utilize esse comando com "/" antes')
        
        if(!msg?.member?.voice?.channel) return await msg.followUp({content: 'Entre em um canal de voz primeiro'})
        
        let botId

        try {
            botId = getBotId(msg)

        } catch (error) {
            if(error == 'not in voice'){
                return await msg.followUp({content: 'Nenhum bot no seu canal'})

            }else{
                return await msg.followUp({content: 'Erro ao chamar bot'})
            }
        }

        const res = await mandaGerenteBot({botId:botId, action: 'PAUSE'})
        
        const emb = new MessageEmbed()
        .setThumbnail(res.bot.avatar)
        .setDescription(`\`${res.bot.username}\` ${res.paused ? "**PAUSADO**" : "**Voltou** a tocar um somzão"}`)
        .setTitle('▶ ' + res.nowPlaying.original_title)
        .setColor(res.paused ? 'ORANGE' : 'GREEN')
        .setFooter({'iconURL': res.bot.avatar ,text:res.bot.username})

        await msg.followUp({embeds:[emb]})
    }
}


function getBotId(msg){
    const bots = Object.values(config.music.bots)

    let botId = msg?.member?.voice?.channel?.members?.find((v,k)=> bots?.find(id=> k==id))?.id
        
    if(!botId)  throw 'not in voice'

    return botId
}

async function mandaGerenteBot(obj){
    try {
        return await fetch('http://localhost:4205', {body:JSON.stringify(obj),'method': 'POST'}).then(r=>r.json())

    } catch (error) {
        console.log(error)
    }
}