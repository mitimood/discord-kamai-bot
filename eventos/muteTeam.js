const { AuditLogEvent } = require("discord.js");
const config = require("../config");
const { client } = require("../index");
const logger = require("../utils/logger");

// log when a used is muted by an karaoke organizer

    client.on('voiceStateUpdate', async (oldState, newState) => {
            
        try {

            if(newState.guild.id != config.guild_id) return
            if(newState.serverMute == oldState.serverMute)return;
            if(newState?.channel?.parentId == config.channels.event && newState.member.roles.cache.has(config.roles.teams.equipeEvent)) return

            const fetchedLogs = await newState.guild.fetchAuditLogs({
                limit: 1, 
                type: AuditLogEvent.MemberUpdate
            })

            const mutado = fetchedLogs.entries.first();
            
            if(mutado && mutado.createdTimestamp > (Date.now() - 1000)){  
                const { executor, target, changes} = mutado;
        
                const memberex = newState.guild.members.cache.get(executor.id)

                if(executor == target) return
                if(memberex?.voice?.channel && (memberex?.voice?.channel?.parentId == (config.channels.event && memberex?.roles?.cache.has(config.roles.teams.equipeEvent)))) return
                if(memberex?.roles?.cache?.has(config.roles.teams.equipekaraoke)){
                    logger.info(`Mute team`) 
                
                    changes.forEach(async c=>{                        
                        if(c.key==`mute`){
                            const canal = client.channels.cache.get(config.channels.equipekaraoke)

                            if(c.new){
                                await canal.send({embeds:[{
                                    title:newState.channel.name,
                                    description: `🔈${target} foi calado por ${executor}\n\n*Um dia encontrará redenção?*`,
                                    color:config.color.sucess,
                        }]})

                            }else{
                                await canal.send({embeds:[{
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
        }
        } catch (error) {
            logger.error(error)
        }
        

    
    })
