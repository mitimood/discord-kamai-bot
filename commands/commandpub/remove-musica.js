const config = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const spotifyLinkToYoutubeLinks = require("../../utils/spotifyLinkToYoutubeLinks");
const youtubeVideos = require("../../utils/youtubeVideos");
const logger = require("../../utils/logger");
const {fetch} = require('cross-fetch')
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js')

module.exports= {
    data: new SlashCommandBuilder()
    .setName('remove-musica')
    .setDescription('remove uma música da playlist')
    .addIntegerOption(o=>o.setName('posicao-da-musica').setDescription('Me passa a posição da música para eu remover da lista').setRequired(true)),
    name: "remove-musica",
    aliases: [],
    description: "Remove uma música da playlist",
    async execute(msg) {
        try {
            let songPos;

            if(msg.type === "APPLICATION_COMMAND"){
                songPos = msg.options._hoistedOptions[0].value
    
            }else{
                return await msg.followUp('Utilize esse comando com "/" antes')
            }
    
    
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
    
            const res = await mandaGerenteBot({botId:botId,songPos: songPos, action: 'REMOVESONG'})
            
            const emb = new MessageEmbed()
    
            if(res.status){
                emb
                .setThumbnail(res.bot.avatar)
                .setDescription(`REMOVIDA ===>${res.status}`)
                .setTitle('▶ ' + res.nowPlaying.original_title)
                .setColor('ORANGE')
                .setFooter({'iconURL': res.bot.avatar ,text:res.bot.username})
    
            }else{
                emb
                .setThumbnail(res.bot.avatar)
                .setDescription(`'Não achei nenhuma música nessa posição :/'`)
                .setTitle('▶ ' + res.nowPlaying.original_title)
                .setColor('RED')
                .setFooter({text:res.bot.username})
            }
    
            await msg.followUp({embeds: [emb]})
        } catch (error) {
            logger.error(error)
        }
      
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
        logger.error(error)
    }
}