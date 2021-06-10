const { client } = require("../index");
const config = require("../config");

module.exports = { art };

function art(message){
let rolecap = message.guild.roles.cache.get(config.roles.poemas).members.map(m=> m.user);

    let canal = client.channels.cache.get(config.channels.poema);
    
    canal.messages.fetch().catch(m=>m).then(msg=>
        {
            msg.each( m => {
                if(rolecap.includes(m.author)){
                 console.log(m.content)
                    
                
                }
            }
            )
          })
    }


function regart(author){
    return{
        author,
        time

    }
}