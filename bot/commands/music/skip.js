const { bot1 } = require("../../eventos/startMusicBots")

module.exports={
    name:"skip",
    aliases:["s"],
    description: "Pula a música tocando",

    async execute(msg){
        try {
            msg = await bot1.channels.cache.get(msg.channel.id).messages.fetch(msg.id, { force:false, cache: false })
        }catch(err) {
            console.log(err)
        }
        const commandChannel = bot1.channels.cache.get(msg.channel.id)
        const player = bot1.manager.get(msg.guild.id)
        if(!player) return commandChannel.send({content: `Não estou tocando no servidor `})

        const memberVoiceChannel = msg.member.voice.channel
        if (!memberVoiceChannel) return commandChannel.send({ content: `Você precisa estar em um canal do servidor` })
        console.log(player)
        if (memberVoiceChannel.id !== player.voiceChannel) return commandChannel.send({ content: `Você precisa estar no mesmo canal que eu` })
        
        if (!player.queue.current) return commandChannel.send({ content: `Não tem nenhuma música tocando.` })

        const title = player.queue.current.title

        player.stop()

        commandChannel.send({ content: `Música \`${title}\` pulada por ${msg.author.toString()}.` })
    
    }
}