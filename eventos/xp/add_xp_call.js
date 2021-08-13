const schedule = require('node-schedule');
const { client } = require('../..');
const config = require('../../config');
const { add_voice_xp } = require('../../mongodb');


var ids = []
xp_chat_Add()


function xp_chat_Add(){
    setTimeout(()=>{
        const voice = client.guilds.cache.get(config.guild_id).channels.cache.filter(channels => channels.isVoice())
        voice.forEach(voice_channel => {
            if (voice_channel.members.size > 1 && voice_channel.members.filter(member => !member.bot).size >= 2) {
        
                voice_channel.members.forEach(member => {   
        
                    ids.push(member.id)
                })
            }
        })
        if (ids) add_voice_xp(ids, 1)
        xp_chat_Add()
    },300000)
        
}
