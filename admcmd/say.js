const { client } = require("../index");
const config = require("../config")

/*
    say command, will reply a message content inside the especified channel

say (channel id) (message content)
*/
module.exports={
    name: "say",
    aliases: [],
    description: "",

    execute (message){

    
    var msgArgs = message.content.split(" ");
    if(/[0-9]+/.test(msgArgs[1])){
    const canal =  client.channels.cache.find(channel =>channel.id === msgArgs[1])
    if(canal==undefined){
        message.channel.send({embeds:[{
            description:"Não foi possivel achar o canal no servidor",
            color: config.color.err,
        }]})
    }else{
        var mensagem = message.content.substring(msgArgs.slice(0, 2).join(" ").length + 1);
        if(mensagem){
        canal.send(mensagem);
        };
        message.delete()}
    }
        else{
            var mensagem = message.content.substring(msgArgs.slice(0, 1).join(" ").length + 1);
            if(mensagem){
            message.channel.send(mensagem);
            message.delete()
            }else{
                message.channel.send({embeds:[{
                    description:"Você não informou a mensagem para que eu possa portá-la",
                    color:config.color.err,
                }]});
            };
        };
    }
}