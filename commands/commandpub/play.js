const config = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const spotifyLinkToYoutubeLinks = require("../../utils/spotifyLinkToYoutubeLinks");
const youtubeVideos = require("../../utils/youtubeVideos");
const logger = require("../../utils/logger");
const {fetch} = require('cross-fetch')
const {MessageEmbed} = require('discord.js')

module.exports= {
    data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Adiciona música no seu canal de voz')
    .addStringOption(o=>o.setName('musica').setDescription('Manda o somzão, pode ser tanto uma musica/playlist do youtube/spotify 🎼').setRequired(true)),
    name: "play",
    aliases: [],
    description: "Toca um somzão",

    async execute(msg) {
        try {
            let link;

            if(msg.type === "APPLICATION_COMMAND"){
                link = msg.options._hoistedOptions[0].value

            }else{
                return await msg.followUp('Utilize esse comando com "/" antes')
            }

            let botId, botInVoice;

            if(!msg?.member?.voice?.channel) return await msg.followUp({content: 'Entre em um canal de voz primeiro'})

            try {
                [botId, botInVoice] = getBotId(msg)

            } catch (error) {
                if(error == 'not in voice'){
                    return await msg.followUp({content: 'Entre em um canal de voz primeiro'})
                }else if(error == 'no bot'){
                    return await msg.followUp({content: 'Nenhum dos bots esta disponivel no momento'})

                }else{
                    return await msg.followUp({content: 'Erro ao chamar bot'})

                }
            }
            let videos;

            try {
                videos = await processaMusica(link, msg.user.id)


            } catch (error) {
                return await msg.followUp({content: 'Link invalido'})
            }

            let res = await mandaGerenteBot({botId:botId, videos: videos, action: botInVoice ? 'ADD_SONG' :'CREATE', data:{}, channelId: msg.member.voice.channel.id})

            const emb = new MessageEmbed()
            .setThumbnail(res.bot.avatar)
            .setDescription(`${videos.length } música${videos.length > 1?"s" : ""} adicionada${videos.length > 1?"s" : ""}

> Quer ver como ta a sua playlist? **/playlist**
> Aleatorizar a playlist? **/aleatorizar**
> Pular para uma música especifica? **/play-select**
> Botar a playlist em loop? **/loop**
> Pular para a proxima musica da lista? **/skip**
> Pausar? **/pause**
> Resumir? **/resume**`)
            .setTitle('▶ ' + res.nowPlaying.original_title)
            .setColor('LUMINOUS_VIVID_PINK')
            .setFooter({'iconURL': res.bot.avatar ,text:res.bot.username})

            await msg.followUp({embeds:[emb]})

        } catch (error) {
            logger.error(error)
        }
    }
}

async function mandaGerenteBot(obj){
    try {
        return await fetch('http://localhost:4205', {body:JSON.stringify(obj),'method': 'POST'}).then(r=>r.json())

    } catch (error) {
        logger.error(error)
    }
}

async function processaMusica(link, userId){
    let videos;
    const spotifyRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:spotify(-nocookie)?\.com|open.spotify.com))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/

    if(spotifyRegex.test(link)){
        try {
            videos = await spotifyLinkToYoutubeLinks({link:link, userId: userId})
            
            if(!videos) throw 'no video found'

        } catch (error) {
            throw 'no video found'
        }
    }else{
        try {
            videos = await youtubeVideos({link:link, userId: userId})

            if(!videos) throw 'no video found'

        } catch (error) {
            throw 'no video found'            
        }
    }
    return videos
}

function getBotId(msg){
    const bots = Object.values(config.music.bots)

    let botInVoice = false;
    let botId;

    if(msg?.member?.voice?.channel){
        botId = msg.member.voice.channel.members.find((v,k)=> bots.find(id=> k==id))?.id
        
        if(!botId){
            const voiceChannels = msg.guild.channels.cache.filter(c=>c.isVoice())
            
            voiceChannels.map((c)=>c.members.map((v,k)=>bots.find(id=> k==id)? bots.splice( bots.findIndex(id=> k==id), 1): false) )
            
            if(!bots.at(0)) throw 'no bot'
            
            botId = bots.at(0)
        }else{
            botInVoice = true
        }


    }else{
        throw 'not in voice'
    }

    return [botId, botInVoice]
 
}

// module.exports = {getBotId, mandaGerenteBot}


// Receves de bot identification and music link, than adds to the bot playlistt
