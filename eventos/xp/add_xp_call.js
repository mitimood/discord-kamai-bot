const { ChannelType } = require('discord.js');
const { client } = require('../..');
const config = require('../../config');
const { add_voice_xp, add_bonus_xp } = require('../../mongodb');
const logger = require('../../utils/logger');


let xp_id_voice = []
let xp_id_bonus = []

xp_voice_Add()

const karoakeParentId = client.channels.cache.get(config.channels.equipekaraoke).parentId

async function xp_voice_Add(){
    setTimeout(async ()=>{
        try {
            const voice = client.guilds.cache.get(config.guild_id).channels.cache.filter(channels => channels.type === ChannelType.GuildVoice)
            voice.forEach(voice_channel => {
                if (voice_channel.members.filter(member => !member.bot).size >= 2) {
                    voice_channel.members.forEach(member => {
                        if((!member.user.bot && !member?.voice?.mute) || member?.voice?.channel?.parentId == karoakeParentId){
                            if (member?.voice?.selfVideo){
                                xp_id_bonus.push(member.id)
                            }
                            xp_id_voice.push(member.id)
                        }
                    })
                }
            })
            if (xp_id_voice.length) {
                add_voice_xp(xp_id_voice, 2)
                xp_id_voice = []
                logger.info("Adicionando xp call")
            }

            if (xp_id_bonus.length) {
                add_bonus_xp(xp_id_bonus, 1)
                xp_id_bonus = []
                logger.info("Adicionando xp bonus, cam ligada")
            }

            await xp_voice_Add()
        } catch (error) {
            logger.error(error)
        }


    },180000)
        
}
