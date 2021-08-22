const { bot1 } = require("../../eventos/startMusicBots")

module.exports={
    name:"resume",
    aliases:['rs'],
    description: "Despausa a música",

    async execute(msg){
        try {
            msg = await bot1.channels.cache.get(msg.channel.id).messages.fetch(msg.id, { force:false, cache: false })
        }catch(err) {
            console.log(err)
        }
        const player = bot1.manager.get(msg.guild.id)
        if (!player) return msg.reply({ content: 'Não estou tocando neste servidor.', ephemeral:true})

        const memberVoiceChannel = msg.member.voice.channel
        if (!memberVoiceChannel) return msg.repy({ content: 'Você precisa estar em um canal de voz para enviar comandos', ephemeral:true})
        if (memberVoiceChannel.id !== player.voiceChannel) return msg.reply({ content: 'Você precisa estar no mesmo canal que eu'})

        if (!player.paused) return msg.reply({ content: 'A música já esta tocando', ephemeral:true })

        player.pause(false)
        msg.reply({ content: 'Música despausada' })

    }

}