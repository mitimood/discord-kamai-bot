const { client } = require("../..");
const config = require("../../config");

const talkedRecently = new Set();
const { add_chat_xp } = require("../../mongodb");

client.on("messageCreate", msg=>{

    const cooldown = 300000
    
    if (talkedRecently.has(msg.author.id) || msg.author.bot) return

    talkedRecently.add(msg.author.id);
    setTimeout(() => {
        // Removes the user from the set after a minute
        add_chat_xp(msg.author.id, 1)
        talkedRecently.delete(msg.author.id);
    }, cooldown);
    
})
