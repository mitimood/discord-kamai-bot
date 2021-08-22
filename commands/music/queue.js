const { MessageEmbed } = require("discord.js")
const config = require("../../config")
const { bot1 } = require("../../eventos/startMusicBots")
const { TrimMsg } = require("../../funções/funções")

module.exports={
    name:"queue",
    aliases:["q", 'fila', 'playlist'],
    description: "Exibe a playlist",

    async execute(msg){
        try {
            msg = await bot1.channels.cache.get(msg.channel.id).messages.fetch(msg.id, { force:false, cache: false })
        }catch(err) {
            console.log(err)
        }
        
        const msgArgs = TrimMsg(msg)
        const player = bot1.manager.get(msg.guild.id)

        if (!player) return msg.reply({ content: `Não estou tocando no servidor`, ephemeral: true })

        const queue = player.queue

        if(!/[0-9]/.test(msgArgs[1])) msgArgs[1] = 0


        const embed = new MessageEmbed()

        let track_pages = [];
        let page = "";

        queue.map((t, i)=>{
            page += (`\n${++i} - [${t.title}](${t.uri})`)
            
            if (queue.length == i++){
                track_pages.push(page)

            }else if (i+2 % 10 ==0){
                track_pages.push(page)
                page = ""
            }

        })

        embed.setTitle(`Tocando agora ${queue.current.title}`)

        if (msgArgs[1]>track_pages.length-1) msgArgs[1] = track_pages.length - 1

        if (track_pages[msgArgs[1]]){
            embed.setDescription(track_pages[msgArgs[1]])
        }
        embed.setFooter(`Página ${msgArgs[1]+1}`)
        embed.setColor(config.music.color1)

        msg.reply({embeds:[embed], content:msg.author.toString()})
    }

}