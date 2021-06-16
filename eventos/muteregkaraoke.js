const config = require("../config");
const { client } = require("../index")

    client.on('voiceStateUpdate', async (oldState, newState) => {
        if(newState == oldState)return;
    
        if(newState.serverMute != undefined){
            const fetchedLogs = await newState.guild.fetchAuditLogs({
                limit: 1, 
                type: 'MEMBER_UPDATE'
            })

        const mutado = fetchedLogs.entries.first();
        if(mutado.createdTimestamp > (Date.now() - 1500)){  
            const { executor, target, changes} = mutado;
       
           const memberex =newState.guild.members.cache.get(executor.id)

    if(executor == target) return
            
    if(memberex.roles.cache.has(config.roles.equipekaraoke)){
    
        changes.forEach(c=>{
            if(c.key==`mute`){
                const canal = client.channels.cache.get(config.channels.equipekaraoke)

                if(c.new){
                    canal.send({embed:{
                        description: `🔈\n${target} foi calado por ${executor}\n\n*Um dia encontrará redenção?*`,
                        color:config.color.sucess,
              }})

                }else{
                    canal.send({embed:{
                      description: `🔊\n${executor} levou a redenção a ${target} e permitiu  que voltasse a falar.`,
                      color:config.color.sucess,
                    }})                          
                      let rolecap = newState.guild.roles.cache.get(config.roles.capkaraoke).members.map(m => m.user.id);
       
                    rolecap.forEach(id => {
                     newState.guild.members.cache.get(id).user.send({embed:{
                        title:"⚡É melhor verificar", 
                        description:` [${executor.id}]\n${executor.username} levou a redenção a \n\n[${target.id}]\n${target.username} e permitiu que voltasse a falar.\n<#612487253650046976>`}})
                    })
                }
            }
        })                              
        }

    }}
    })
