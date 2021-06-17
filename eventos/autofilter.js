const { client } = require("..");



client.on("message", msg =>{

    if(msg.content.match('steancomunnity.ru')){
        msg.delete();
        msg.member.user.send(`Banido por enviar uma tentativa de scam`)
        msg.member.ban({reason:`Steancommunnity Scam`});
    }


})