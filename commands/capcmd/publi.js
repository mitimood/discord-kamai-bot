const { client } = require("../../index");
const config = require("../../config");
const { TextChannel } = require("discord.js");

/*
    say command, will reply a message content inside the especified channel

publi (channel id) (message content)
*/

module.exports={
    name: "report",
    aliases: ["publi"],
    description: "o bot publica uma mensagem no canal desejado",

    execute (message){

let teams = JSON.parse(JSON.stringify(config.roles.teams))
delete teams.caps
teams = Object.values(teams)

Object.values(config.roles.teams.caps).forEach(element => {
    teams.push(element)
});
        teams.push(config.roles.event)
        
    var msgArgs = message.content.split(" ");
    
    const channel = client.channels.cache.get(msgArgs[1])
    if(!channel?.isText()){
        var mensagem = message.content.substring(msgArgs.slice(0, 1).join(" ").length + 1);
        if(mensagem){
            message.channel.send({ content: mensagem, allowedMentions: { roles:teams }})
            message.delete()
        }else {
            message.reply({ content: "Não é possivel enviar uma mensagem vazia", ephemeral:true })
        }
    }else {
        var mensagem = message.content.substring(msgArgs.slice(0, 2).join(" ").length + 1);
        if(mensagem){
            channel.send({ content: mensagem, allowedMentions: { roles:teams }})
            message.reply({ content: `Mensagem enviada com sucesso, em \`${channel.name}\``});
        }else {
            message.reply({ content: "Não é possivel enviar uma mensagem vazia", ephemeral:true })
        }
        
        }
    }
}