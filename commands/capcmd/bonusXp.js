const { client } = require('../..');
const config = require('../../config');
const { add_bonus_xp } = require('../../mongodb');
const logger = require('../../utils/logger');


var ids = []
let activated = false

/*
    say command, will reply a message content inside the especified channel

publi (channel id) (message content)
*/

module.exports={
    name: "xpbonus",
    aliases: ["bonusxp"],
    description: "Ativa ou desliga o xp bonus",

    async execute (msg){
        try {
            let bonusFunc

            if(activated){
                activated = false
                await msg.channel.send("Desativado")
                
            }else{
                activated = true
                bonusFunc = setInterval(xpRun,300000)
                await msg.channel.send("Ativado")

            }
            
            function xpRun(){
                try {
                    if(!activated) clearInterval(bonusFunc)

                    const voice = client.guilds.cache.get(config.guild_id).channels.cache.filter(channels => channels.isVoice())

                    voice.forEach(voice_channel => {
                        if (voice_channel.parentId == config.channels.event) {
                            voice_channel.members.forEach(member => {
                                if(!member.user.bot && member?.user?.id){
                                    ids.push(member.user.id)
                                }
                            })
                        }
                    })
                    
                    if (ids) {
                        add_bonus_xp(ids, 1)
                        ids = []
                    }
                } catch (error) {
                    logger.error(error)
                }
            }
        } catch (error) {
            logger.error(error)
        }
    }
}

