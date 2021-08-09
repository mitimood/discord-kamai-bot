const { client } = require("..");
const config = require("../config");

/* 
Filters all the messages sent searching for scam links 
*/

client.on("messageCreate", async msg =>{

    if(['steancomunnity.ru',`stmeacomunnitty.ru`,`stearncomminuty.ru`,"http://  discordnitro.host/"].includes(msg.content)){
        msg.delete();
        try{
            
            let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({unique:true,reason:"ban invite",maxUses:1,maxAge:604800})
            await msg.member.send(`Você foi banido de KAMAITACHI, por: utilização de links de scam \nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)

        }catch{
        }finally{
            msg.member.ban({reason:`Steancommunnity Scam`});
        }
    }
})