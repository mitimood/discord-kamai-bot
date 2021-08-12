const config = require("../config");
const { client } = require("../index")

// log when a used is muted by an karaoke organizer

    client.on('voiceStateUpdate', async (oldState, newState) => {

        if(newState.guild.id != config.guild_id) return
        if(newState.serverMute == oldState.serverMute)return;
        if(newState.channel && newState.channel.parentId == config.channels.event && newState.member.roles.cache.has(config.roles.teams.equipeEvent)) return
        if(newState.serverMute != undefined){
            const fetchedLogs = await newState.guild.fetchAuditLogs({
                limit: 1, 
                type: 'MEMBER_UPDATE'
            })
        
        const mutado = fetchedLogs.entries.first();
        if(mutado.createdTimestamp > (Date.now() - 1000)){  
            const { executor, target, changes} = mutado;
       
            const memberex =newState.guild.members.cache.get(executor.id)

            if(executor == target) return
            if(memberex.voice.channel && memberex.voice.channel.parentId == config.channels.event && memberex.roles.cache.has(config.roles.teams.equipeEvent)) return
            if(memberex.roles.cache.has(config.roles.teams.equipekaraoke)){
            
                changes.forEach(c=>{
                    if(c.key==`mute`){
                        const canal = client.channels.cache.get(config.channels.equipekaraoke)

                        if(c.new){
                            canal.send({embeds:[{
                                title:newState.channel.name,
                                description: `🔈${target} foi calado por ${executor}\n\n*Um dia encontrará redenção?*`,
                                color:config.color.sucess,
                    }]})

                        }else{
                            canal.send({embeds:[{
                            title:newState.channel.name,
                            description: `🔊${executor} levou a redenção a ${target} e permitiu  que voltasse a falar.`,
                            color:config.color.err,
                            }]})                          
                            let rolecap = newState.guild.roles.cache.get(config.roles.teams.caps.capkaraoke).members.map(m => m.user.id);
            
                            rolecap.forEach(id => {
                            newState.guild.members.cache.get(id).user.send({embeds:[{
                                title:"⚡É melhor verificar "+newState.channel.name, 
                                description:` [${executor.id}]\n${executor.username} levou a redenção a \n\n[${target.id}]\n${target.username} e permitiu que voltasse a falar.\n<#612487253650046976>`}]})
                            })
                        }
                    }
                })                              
            }
        }}
    })
