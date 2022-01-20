const config = require('../../config')

module.exports={
    name: "eventnotify",
    aliases: ["evtf", "ntfev"],
    description: "O bot envia uma mensagem para ",

    async execute (msg){
        try {
            let eventMsg = await msg.channel.send("Pegue o seu cargo de notificado😉")
        await eventMsg.react("<:verde_SIM:618576110296367140>")

        let filter = (reaction, user) => reaction.emoji.id === '884930094458634260'
        const collector = eventMsg.createReactionCollector({ filter, time: 300000 });

        collector.on( "collect" ,(collect, user)=>{
            const member = collect.message.guild.members.cache.get(user.id)
            
            if ( !member.roles.cache.has(config.roles.event) ){
                member.roles.add(config.roles.event)
            }
        })
        } catch (error) {
            console.log(error)
        }
        
    }
}