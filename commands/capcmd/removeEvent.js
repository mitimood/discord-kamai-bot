const { MessageEmbed, Message } = require("discord.js");
const { listEvent, removeEvent } = require("../../mongoDbSite");

module.exports = {
    name: "rmvevent",
    aliases: ["removeevent", ,"removevent"],
    description: "Remove um evento",

    async execute(msg = Message.prototype) {
        
        try {
            const events = await listEvent()
            let listOfEmbs = []
            for (const event of events) {
                const id = event._id
                const name = event.name
                const date = new Date(event.dateSnowflake).toString()
                const image = event.imageUrl
                
                const emb = new MessageEmbed()
                emb.setImage(image)
                emb.setTitle(`${id} => ${name}`)
                emb.setDescription(date)
                listOfEmbs.push(emb)
            }
            if(listOfEmbs){
                await msg.channel.send( { embeds: listOfEmbs} )

            }else{
                msg.channel.send({content:"Nenhum evento registrado"})
            }
        } catch (error) {
            console.log(error)
        }finally{
            msg.channel.send("Digite o id do evento para deletar")
            let filter = m => m.author.id === msg.author.id && m.content.match(/[0-9]/);
            msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] }).then(async msgColec => {

                const idRmv = msgColec.first().content
                const event = await removeEvent(idRmv)


                const id = event._id
                const name = event.name
                const date = new Date(event.dateSnowflake).toString()
                const image = event.imageUrl
                
                const emb = new MessageEmbed()
                emb.setImage(image)
                emb.setTitle(`${id} => ${name}`)
                emb.setDescription(date)
                await msg.channel.send( { content:"Evento apagado ===>",embeds: [emb]} )

            }).catch(error=>{
                console.log(error)
                return msg.channel.send("Tempo esgotado")
            })
        }


        
    }}