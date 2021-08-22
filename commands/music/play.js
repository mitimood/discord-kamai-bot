const { bot1 } = require('../../eventos/startMusicBots')
const { TrimMsg } = require('../../funções/funções')

module.exports={
    name:"play",
    aliases:["p"],
    description: "Toca uma musica para você",

    async execute(msg){

        try {
            msg = await bot1.channels.cache.get(msg.channel.id).messages.fetch(msg.id, { force:false, cache: false })
        }catch(err) {
            console.log(err)
        }

        let msgArgs = TrimMsg(msg)
        msgArgs.shift()

        let search = msgArgs.join(" ")
        
        let res;

        try {
            res = await bot1.manager.search(search, msg.author)

            if (res.loadType === "LOAD_FAILED") throw res.exception
            else if (res.loadType === "PLAYLIST_LOADED") throw { message: "Playlist não suportada" }
        }catch(err) {
            
            return msg.reply({ content: `Aconteceu um erro ao tentar buscar a música ${err.message}`, ephemeral: true})
        }
        if (!msg.member?.voice?.channel?.id) return msg.reply({ content: `Você precisa estar em um canal de voz`, ephemeral:true })
        if (!res?.tracks?.[0]) return msg.reply( { content: `Música não encontrada!`, ephemeral:true })

        const player = bot1.manager.create({
            guild: msg.guild.id,
            voiceChannel: msg.member.voice.channel.id,
            textChannel: msg.channel.id,
            node: "1"
        })

        if(player.state == 'DISCONNECTED') player.connect()
        player.queue.add(res.tracks[0])

        if (!player.playing && !player.paused) player.play()
        return msg.reply({ content: `\`${res.tracks[0].title}\`` })
    }
}
