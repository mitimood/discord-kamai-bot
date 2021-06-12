const {client} = require(`../index`);


client.on("message",msg=>{

    if(msg.channel.id==817597687934746624){

        msg.react('664825289674850315');
        msg.react('664825290802987018');

    }else{
        return
    }



})
