const { client } = require('../..');
const config = require('../../config');
const { add_voice_xp } = require('../../mongodb');


var ids = []
xp_voice_Add()

async function xp_voice_Add(){
    setTimeout(async ()=>{
        const voice = client.guilds.cache.get(config.guild_id).channels.cache.filter(channels => channels.isVoice())
        voice.forEach(voice_channel => {
            if (voice_channel.members.size > 1 && voice_channel.members.filter(member => !member.bot).size >= 2) {
                voice_channel.members.forEach(member => {   
                    if(!member.user.bot){
                        ids.push(member.id)
                    }
                })
            }
        })
        if (ids) {
            add_voice_xp(ids, 1)
            ids = []
        }
        try {
            console.log("Adicionando xp call " + new Date())

            await xp_voice_Add()

        } catch (error) {
            console.log(error)
        }
    },60000)
        
}
