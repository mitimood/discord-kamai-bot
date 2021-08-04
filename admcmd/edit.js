const config = require("../config.js");
const { client } = require("../index");

/*
Edit a message previously sent by the bot

edit (channel id) (id of the message) (new message content)
*/

module.exports = { edit }

function edit (message) {
    var msgArgs = message.content.split(" ");
    if((/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1]))){
    if((/^<[@][!&]?[0-9]+>$/.test(msgArgs[2]) || /[0-9]+/.test(msgArgs[2]))){
    if(msgArgs[3]){
    let msgedit = message.content.substring(msgArgs.slice(0, 3).join(" ").length + 1);

    const canal = client.channels.cache.find(channel =>channel.id === msgArgs[1])
        if(canal==undefined){
            message.channel.send({embed:{
                description:"Não foi possivel achar o canal",
                color: config.color.err
            }})
        }else{
        canal.messages.fetch(msgArgs[2]).catch(msg=>{
            message.channel.send({embed:{
                description:"Você precisa me dar uma mensagem valida",
                color: config.color.err,
            }})
        }).then(messagem => {
            if(messagem==undefined){
                return;
            }else
            messagem.edit(msgedit);})
        
        }
    }else {

        message.channel.send({embed:{
            description:"Como irei modificar o manuscrito se você não me enviou o conteudo?",
            color: config.color.err,
        }})
    }
    
    }
    else{
        message.channel.send({embed:{
            description:"Como irei modificar o manuscrito se não me enviou o id da mensagem?",
            color: config.color.err,
        }})
    }
    }
    else{
        message.channel.send({embed:{
            description:"Você precisa mencionar o canal primeiro",
            color: config.color.err,
        }})
    }

    }
