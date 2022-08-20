const { joinVoiceChannel, NoSubscriberBehavior, createAudioPlayer, AudioPlayerStatus, createAudioResource, StreamType } = require('@discordjs/voice');
const {Client, ChannelType} = require('discord.js')

const http = require('http')
const {stream, video_info} = require('play-dl')
const logger = require('./logger');
const client = require('./loader/discordClient');
const config = require('../config');


let botsPlayer = new Map()

const server = http.createServer(async(req, res) => {

    if(req.method === 'POST'){
        let body = "";
        req.on("data", function (chunk) {
            body += chunk;
        });
    
        let load = await new Promise((resolve, rej)=>{
            req.on("end", function(){
                resolve(JSON.parse(body))
        
            });
        })

        let status = await botHandler(load)

        const bot = botsPlayer.get(load.botId)

        res.end(JSON.stringify({videos : bot.videos ? bot.videos : [], nowPlaying: bot.nowPlaying, bot: bot.bot, paused: bot.paused, status:status}))

    }
    
});

async function botHandler(load){
    let status = true
    if(load.action == 'CREATE'){ 
        adicionaMusica(load)

        await createConnector(load)

    }else if(load.action == 'ADD_SONG'){
        adicionaMusica(load)

    }else if(load.action == 'PAUSE'){
        pauseUnpause(load)

    }else if(load.action == 'SKIP'){
        await nextSong(load)

    }else if(load.action == 'REMOVESONG'){
        status = await removeSong(load)

    }else if(load.action == 'STOP'){
        playerDestroy(load.botId)

    }else if(load.action == 'SHUFFLE'){
        status = shufflePlaylist(load)

    }else if(load.action == 'LOOP'){
        loopPlaylist(load)
    
    }else if(load.action == 'PLAYSELECT'){
        status = await nextSong(load)

    }

    return status
}

async function createConnector(load){
    const channelId = load.channelId
    const botId = load.botId
    const cli = botsPlayer.get(load.botId).client

    const guild = await cli.channels.fetch(channelId).then(c=>c.guild)
    
    let connection = joinVoiceChannel({
        channelId: channelId,
        guildId: guild.id,
        adapterCreator: guild.voiceAdapterCreator,
        group: botId 
    })

    let bot = botsPlayer.get(botId)
    
    const player = createAudioPlayer({behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
    },})

    connection.subscribe(player)

    player.on(AudioPlayerStatus.Idle,async ()=>{
        try {
            await nextSong(load)
        } catch (error) {
            logger.error(error)
        }
    })

    bot.connector = connection
    bot.player = player

    botsPlayer.set(botId, bot)

    await nextSong( load )

}

function loopPlaylist(load){
    let bot = botsPlayer.get(load.botId)

    if (load.loop == 'disable'){
        bot.loop.active = false

    }else{
        bot.loop.mode = load.loop
        bot.loop.active = true
    
    }

    botsPlayer.set(load.botId, bot)
}


function pauseUnpause(load){
    const botId = load.botId

    let bot = botsPlayer.get(botId)
    const player = bot.player

    if(player?.state?.status == 'paused'){
        bot.paused = false
        player.unpause()
    }
    else if (player?.state?.status == 'playing'){
        bot.paused = true
        player.pause(true)
    }
}

function playerDestroy(botId){
    let bot = botsPlayer.get(botId)
    const connector = bot.connector

    connector.destroy()

    bot.paused = false
    bot.loop.active = false
    delete bot.videos

    botsPlayer.set(botId, bot)
}

async function nextSong(load){
    const botId = load.botId

    let bot, player, songPlaying;
    let status = true

    try {
        bot = botsPlayer.get(botId)
        player = bot.player
        
        // have an specific video call
        if(!load.musId){
            // loop is active on the bot
            if(bot.loop.active){
                // wich mode is active on the bot
                if(bot.loop.mode == 'playlist'){
                    if (bot.videos.length){
                        songPlaying = bot.videos.shift()
    
                        bot.videos.push(songPlaying)
                    }else{
                        songPlaying = bot.nowPlaying
                    }
    
                
                }else if(bot.loop.mode == 'song'){
                    songPlaying = bot.nowPlaying
                }
            }else{
                songPlaying = bot.videos.shift()
            }
        }else{
            if(bot?.videos?.length){
                let musId = load.musId
                musId = parseInt(musId) - 1

                songPlaying = bot.videos[musId]
                
                if(!songPlaying) return false
            }
        }
        
        bot.nowPlaying = songPlaying

        botsPlayer.set(botId, bot)

        player.play(await mountAudioResource(songPlaying.url))

        return true

    } catch (error) {
        try {
            if(botsPlayer.get(botId)?.videos?.length){
                return nextSong(botId)
            } 
            else{
                playerDestroy(botId)
            }
        } catch (error) {
            logger.error(error)
        }
    }
}

async function removeSong(load){
    try {
        let songPos = parseInt(load.songPos) - 1

        let bot = botsPlayer.get(load.botId)

        let status = true

        if(bot?.videos?.length >= songPos +1 && songPos>=0 ){

            status = bot.videos[songPos].original_title
            bot.videos.splice(songPos, 1)
        } 
        else{
           status = false
        } 

        botsPlayer.set(load.botId, bot)

        return status
    } catch (error) {
        logger.error(error)
    }
    
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }


function shufflePlaylist(load){
    let bot = botsPlayer.get(load.botId)
    let videos = bot.videos
    let status = false

    if(videos.length){
        bot.videos = shuffle(bot.videos)
        status = true
        botsPlayer.set(load.botId, bot)
    }

    return status
    
}

// setInterval(()=>{
    
//     console.log(getMemory());
//     }, 2000)

//     function getMemory() {
//         return Object.entries(process.memoryUsage()).reduce((carry, [key, value]) => {
//             return `${carry}${key}:${Math.round(value / 1024 / 1024 * 100) / 100}MB;`;
//         }, "");
//     };

async function mountAudioResource(url){
//     let readableStream = ytdl(url, {
//         filter: "audioonly",
//         fmt: "mp3",
//         highWaterMark: 1 << 240,
//         liveBuffer: 1 << 240,
//         dlChunkSize: 0, //disabling chunking is recommended in discord bot
//         bitrate: 128,
//         quality: 'highestaudio',
//    })

    try {
        const readableStream = await stream(url, {
            discordPlayerCompatibility: true, quality:2, precache: 1 << 60
        });
    
        return createAudioResource(readableStream.stream, {"inputType": readableStream.type})
    } catch (error) {
        logger.error(error)
    }

}

function adicionaMusica(load){
    try {
        let bot = botsPlayer.get(load.botId)

        if(!bot?.videos) bot.videos = []
        
        if(bot?.player?.state?.status == 'paused') bot.player.unpause()

        bot.videos = bot.videos.concat(load.videos)
        
        botsPlayer.set(load.botId, bot)

        return

    } catch (error) {
        logger.error(error)
    }
}

server.listen(4205, () => console.log('Server is Runing...'))

function registrBot(cli){
    let bot = botsPlayer.get(cli.user.id)

    if(bot){
        bot.client = cli
        bot.bot = {}
        bot.loop = {}
        bot.loop.active = false
        bot.paused = false
        bot.bot.username = cli.user.username
        bot.bot.avatar = cli.user.avatarURL({"format":"png"})
        bot.bot.id = cli.user.id 
    }else{
        bot = {}
        bot.client = cli
        bot.loop = {}
        bot.loop.active = false
        bot.paused = false
        bot.bot = {}
        bot.bot.username = cli.user.username
        bot.bot.avatar = cli.user.avatarURL({"format":"png"})
        bot.bot.id = cli.user.id 
    }
    botsPlayer.set(cli.user.id, bot)

}

// starts
Object.values(config.music.bots).forEach(async (id)=>{
    const clientMus = new Client({ intents: 129})

    clientMus.login(process.env[id])

    clientMus.on('ready', async ()=>{
        registrBot(clientMus)
        logger.info(`${clientMus.user.username} iniciado com sucesso`)
    })

})

client.guilds.cache.get(config.guild_id).channels.cache.forEach(async(c)=>{

    if(c.type === ChannelType.GuildVoice && c.members.size) c.members.forEach(async(m)=>{
        try {
            if(Object.values(config.music.bots).includes(m.user.id) && m.voice.channel) await m.voice.disconnect()
        } catch (error) {
            
        }
    })

})
