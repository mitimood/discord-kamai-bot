const { client } = require("..");



client.on("message", msg =>{

    if(['steancomunnity.ru',`stmeacomunnitty.ru`].includes(msg.content)){
        msg.delete();
        msg.member.user.send(`Banido por enviar uma tentativa de scam`)
        msg.member.ban({reason:`Steancommunnity Scam`});
    }


})