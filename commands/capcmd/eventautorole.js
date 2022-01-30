const config = require('../../config')
const logger = require('../../utils/logger')

module.exports={
    name: "eventnotify",
    aliases: ["evtf", "ntfev"],
    description: "O bot envia uma mensagem para ",

    async execute (msg){
        try {
            let eventMsg = await msg.channel.send("Pegue o seu cargo de notificado😉")

            await eventMsg.react("<a:checkyes:884930094458634260>")

            let filter = (reaction, user) => reaction.emoji.id === '884930094458634260'

            const collector = eventMsg.createReactionCollector({ filter, time: 300000 });

            collector.on( "collect" , async(collect, user)=>{
                try {
                    const member = collect.message.guild.members.cache.get(user.id)
                
                    if ( !member.roles.cache.has(config.roles.event) ){
                        await member.roles.add(config.roles.event)
                    }
                } catch (error) {
                    logger.error(error)
                }

            })
        } catch (error) {
            logger.error(error)
        }
        
    }
}