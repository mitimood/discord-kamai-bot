const { client } = require("../index");
const config = require("../config");

module.exports = {send}; 

function send (message){

    
    var msgArgs = message.content.split(" ");
    if(/[0-9]+/.test(msgArgs[1])){
    const channel =  client.channels.cache.find(channel =>channel.id === msgArgs[1])
    if(channel==undefined){
        message.channel.send({embed:{
            description:"Não foi possivel achar o canal no servidor",
            color: config.color.err,
        }})
    }else{
    var mensagem = message.content.substring(msgArgs.slice(0, 2).join(" ").length + 1);
        if(mensagem){
            channel.send(`${mensagem}`,{allowedMentions: {roles:[config.roles.event, config.roles.equipekaraoke, config.roles.equipeArte, config.roles.equipeEvent]}});
        };
        message.delete()}
    }
        else{
            var mensagem = message.content.substring(msgArgs.slice(0, 1).join(" ").length + 1);
            if(mensagem){
            message.channel.send(`${mensagem}`,{allowedMentions:{roles:[config.roles.event, config.roles.equipekaraoke, config.roles.equipeArte, config.roles.equipeEvent]}});
            message.delete()
            }else{
                message.channel.send({embed:{
                    description:"Você não informou a mensagem para que eu possa portá-la",
                    color:config.color.err,
                }});
            };
        };
    };