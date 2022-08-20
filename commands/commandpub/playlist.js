const config = require("../../config");
const { SlashCommandBuilder } = require("@discordjs/builders");
const spotifyLinkToYoutubeLinks = require("../../utils/spotifyLinkToYoutubeLinks");
const youtubeVideos = require("../../utils/youtubeVideos");
const logger = require("../../utils/logger");
const {fetch} = require('cross-fetch')
const {EmbedBuilder, MessageActionRow, ButtonStyle, ButtonBuilder, InteractionType} = require('discord.js')

module.exports= {
    data: new SlashCommandBuilder()
    .setName('playlist')
    .setDescription('Mostra a playlist do canal'),
    name: "playlist",
    aliases: [],
    description: "Mostra a playlist do canal",
    async execute(msg) {
        try {
            if(msg.type != InteractionType.ApplicationCommand) return await msg.followUp('Utilize esse comando com "/" antes')
        
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
    
            const res = await mandaGerenteBot({botId:botId, action: 'PLAYLIST'})
    
            function secondsToHms(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);
            
                var hDisplay = h > 0 ? h +  ' h ' : "";
                var mDisplay = m > 0 ? m + ' m ' : "";
                var sDisplay = s > 0 ? s + ' s' : "";
                return hDisplay + mDisplay + sDisplay; 
            }
    
            const videos = res.videos
            let pages = []
            let videoEntry = '' 
    
            videos.forEach((element, i) => {
                videoEntry += `**${i+1}-** [${element.original_title}](${element.url}) (${secondsToHms(element.duration)}) <@${element.reqId}>\n`
                
                if(i + 1 == videos.length){
                    pages.push(videoEntry)
    
                }
                else if( (i+1) % 10 == 0 && i != 0 ){
                    pages.push(videoEntry)
                    videoEntry = ''
                }
            });
            
            function genNavButtons(pages, pos, disabled = false){
                let row = new MessageActionRow()
                
                let comps = []
    
                if(0 < pos){
                    comps.push( new ButtonBuilder()
                    .setCustomId("prev")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("ANTERIOR")
                    .setDisabled(disabled)
                    )
                }
    
                if(pages.length > pos + 1){
                    comps.push(new ButtonBuilder()
                    .setCustomId("next")
                    .setStyle(ButtonStyle.Primary)
                    .setLabel("PRÓXIMA")
                    .setDisabled(disabled))
                }


                if(comps.length)row.addComponents(...comps)
                else row = null
            
                return row
            }
            let pos = 0
            function geraEmb(pages, pos){
                return new EmbedBuilder()
                .setThumbnail(res.bot.avatar)
                .setTitle('▶ ' + res.nowPlaying.original_title)
                .setColor(config.color.blurple)
                .setDescription(pages[pos] ? pages[pos] : `Só tem essa mesmo ¯\\_(ツ)_/¯${res.nowPlaying.original_title}`)
                .setFooter({'iconURL': res.bot.avatar ,text:res.bot.username+ `==> página: ${pos + 1} de ${pages.length}`})
            }
    
            var buttons = genNavButtons(pages, pos)

            const playlistMsg = await msg.followUp({embeds:[geraEmb(pages,pos)], components: buttons ? [buttons] : []})
    
            let filter = (m)=> m.user.id === msg.user.id
            
            const collectBtn = playlistMsg.createMessageComponentCollector({idle: 50_000,  filter: filter, componentType: 'BUTTON'})
    
            collectBtn.on('collect', async (btnInt)=>{
                if(btnInt.customId === 'prev') pos -= 1
                else if(btnInt.customId === 'next') pos += 1
                
                var buttons = genNavButtons(pages, pos)

                await btnInt.update({embeds:[geraEmb(pages,pos)], components: buttons ? [buttons] : [] })
    
            })
    
            collectBtn.on('end',async (btnInt)=>{
                var buttons = genNavButtons(pages, pos)

                await playlistMsg.edit({embeds:[geraEmb(pages,pos)], components: buttons ? [buttons] : [] })
            })
           
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
        console.log(error)
    }
}