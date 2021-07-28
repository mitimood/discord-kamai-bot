// Warnable 2.0.0 - Command
const config = require(`../config`);
const { TrimMsg } = require("../eventos/funções");
const { warn_remove } = require("../mongodb");


module.exports={ remove };

async function remove (msg) {
    
    let msgArgs = TrimMsg(msg)
    if(msgArgs[1].match(/[0-9]/g)){
       let doc = await warn_remove(msgArgs[1])
       if(doc){
        msg.channel.send({embed:{description: `Warn de ${doc}\n${msgArgs[1]} apagada com sucesso`,color:config.color.sucess}})
       }else{
        msg.channel.send({embed:{description: `id de warn invalido`,color:config.color.err}})
       }
    }
};
