const { client } = require('../..');
const config = require('../../config');
const { add_voice_xp } = require('../../mongodb');
const logger = require('../../utils/logger');


var ids = []
xp_voice_Add()

const karoakeParentId = client.channels.cache.get(config.channels.equipekaraoke).parentId

async function xp_voice_Add(){
    setTimeout(async ()=>{
        try {
            const voice = client.guilds.cache.get(config.guild_id).channels.cache.filter(channels => channels.isVoice())
            voice.forEach(voice_channel => {
                if (voice_channel.members.size > 1 && voice_channel.members.filter(member => !member.bot).size >= 2) {
                    voice_channel.members.forEach(member => {
                        if((!member.user.bot && !member?.voice?.mute) || member?.voice?.channel?.parentId == karoakeParentId){
                            ids.push(member.id)
                        }
                    })
                }
            })
            if (ids.length) {
                add_voice_xp(ids, 2)
                ids = []
                console.log("Adicionando xp call " + new Date())
    
            }
            await xp_voice_Add()
        } catch (error) {
            logger.error(error)
        }


    },180000)
        
}
