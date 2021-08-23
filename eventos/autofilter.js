const { client } = require("..");
const config = require("../config");

/* 
Filters all the messages sent searching for scam links 
*/

client.on("messageCreate", async msg =>{
    if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g.test(msg.content)&&msg.member.roles.cache.size == 1){
        msg.delete()
    }

})