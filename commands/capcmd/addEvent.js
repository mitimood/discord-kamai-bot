const { MessageEmbed } = require("discord.js");
const { TrimMsg } = require("../../utils/auxiliarFunctions");
const { addEvent } = require("../../mongoDbSite");
const logger = require("../../utils/logger");

module.exports = {
    name: "addevent",
    aliases: [],
    description: "Adiciona um evento",

    async execute(msg) {
        try {
            const msgArgs = TrimMsg(msg)
            if((msgArgs[1] && msgArgs[2]?.match(/[0-9]/)) && msgArgs[3]){
                
                let d = new Date()
                d.setDate(d.getDate() + parseInt(msgArgs[2]))
                d = d.valueOf()

                try {

                    const emb = new MessageEmbed()
                    const date = new Date(d).toString()

                    emb.setImage(msgArgs[3])
                    emb.setTitle(`Nome: ${msgArgs[1]}`)
                    emb.setDescription(`Evento em ${date}`)

                    await msg.channel.send({embeds:[emb]})
                
                    await addEvent( msgArgs[1], d, msgArgs[3])

                } catch (error) {
                    return await msg.channel.send("Você precisa enviar nessa ordem: Nome do evento, quantos dias para o evento, link da imagem direta do evento")
                }
        
            }else{
                return await msg.channel.send("Você precisa enviar nessa ordem: Nome do evento, quantos dias para o evento, link da imagem direta do evento")
            }
        } catch (error) {
            logger.error(error)
        }
        
    }
}
