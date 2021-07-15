const config = require(`../config`);
const {client, db} = require("../index");
const moment = require("moment");


module.exports={checkPoints, TrimMsg, VerificId, Banning}


    function TrimMsg(msg){

        return msg.content.split(/\n| /gm).filter((str) => str.trim())
    
    }
    async function Banning(id,reason,guild){
        await guild.members.ban(id,{reason:reason}).catch(e=>console.log(e))

    }

    async function VerificId(idArray,guild){
        let temp = ``
        let result= {
            members:[],
            users:[],
            noUser:[]
        }
        for (i in idArray){
            if(/^<[@][!&]?[0-9]+>$/.test(idArray[i])){
                idArray[i] = idArray[i].replace(/[\\<>@#&!]/g, "") 
              }
            temp = guild.members.cache.get(idArray[i]);

            //Verify if the id is member of the guild
            if(temp===undefined){
                temp = await client.users.fetch(idArray[i],false).catch(e=>console.log(e))

                //Verify if the id is a valid user
                if(temp==undefined)result.noUser.push(idArray[i]);
                else{
                result.users.push(temp);}
                }else{    
                    result.members.push(temp);
                }
                      
        }

        return result;
    }

var temp = {};

    function checkPoints(guild, user, points) {
        config.points.forEach(async item => {
            let itemPoints = item.range.split("-");
            let member = guild.members.cache.get(user);
            if (parseInt(itemPoints[0]) <= points && parseInt(itemPoints[1]) >= points) {
                if (item.message) await member.user.send(item.message.replace("%guild", guild.name).replace("%points", points))
                .catch(() => { const canal =  client.channels.cache.get(config.channels.modlog)
                    canal.send({embed:{
                      description:`⚠️ Ouve um erro ao enviar DM para o membro ${member.user.tag}`,
                      color:config.color.err,
                      
                    },content: member.user.tag})    
                });
                pointsActions( item, { member, points });
            }
        });
    }

    async function pointsActions( action, user){
        
        let actionSplit = action.action.split("-");
        action = { type: actionSplit[0], timer: actionSplit[1] };
        // Ban
        if (action.type == "ban") {
            if (action.timer) { // Temp ban
                user.member.ban({ reason: `{kamaitachi} Temp > Alcançando ${user.points} advertencias` })
                .then(() => { 
                    temp[user.member.id] = {
                        type: "ban",
                        timeout: setTimeout(() => { 
                            user.member.guild.members.unban(user.member.id)
                            .then(() => {
                                delete temp[user.member.id];
                                const canal =  client.channels.cache.get(config.channels.modlog)
                                canal.send({embed:{
                                description:`🙌 ${user.member.user.tag} foi **desbanido** por que o tempo expirou.`,
                                color:config.color.sucess,}})
                            })
                            .catch(unbanerr => {
                                console.error(unbanerr);
                                const canal =  client.channels.cache.get(config.channels.modlog)
                                canal.send({embed:{
                                description:`⚠️ ${user.member.user.tag} ocorreu um erro desbanindo o membro por tempo esgotado.`,
                                color:config.color.err,}})
                            });
                        }, moment(0).add(parseInt(action.timer.replace(/[^\d]/g, "")), action.timer.replace(/\d/g, "")).valueOf())
                    }
                    const canal =  client.channels.cache.get(config.channels.modlog)
                    canal.send({embed:{
                    description:`🔨 ${user.member.user.tag} foi **banido temporariamente** por alcançar ${user.points} advertências.`,
                    color:config.color.sucess,}})
                })
                .catch(err => {
                    console.error(err);

                    const canal =  client.channels.cache.get(config.channels.modlog)
                    canal.send({embed:{
                    description:`⚠️ ${user.member.user.tag} ocorreu um erro desbanindo o membro por tempo esgotado  ao alcançar ${user.points} advertências`,
                    color:config.color.err,}})
                    
                });
            }
            else { // Perm ban
                try{
                    let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({unique:true,reason:"ban invite",maxUses:1, maxAge:604800})
                    await user.member.send(`Você foi banido de KAMAITACHI` + `\nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)
                }catch{

                }finally{
                    user.member.ban({ reason: `[warnable] alcançando ${user.points} advertências` })
                    .then(() => { 
                        const canal =  client.channels.cache.get(config.channels.modlog)
                        canal.send({embed:{
                        description:`🔨 ${user.member.user.tag} foi **banido** por alcançar ${user.points} advertencias.`,
                        color:config.color.sucess,}})                    
                    })
                    .catch(err => {
                        console.error(err);
                        const canal =  client.channels.cache.get(config.channels.modlog)
                        canal.send({embed:{
                        description:`⚠️ ${user.member.user.tag} tentou ser **banido** por alcançar ${user.points} advertencias, **mas ouve um erro.**`,
                        color:config.color.err,}})
                    });
                }

            }
        }
        if (action.type == "adv1") {
            if (action.timer) { // Temp mute
            db.addmute(user.member.guild.id, user.member.id)
            user.member.roles.add(config.roles.adv1);
            user.member.roles.add(config.roles.muted, `{Kamaitachi}  ${user.points} advertencia(s). Tempo: ${action.timer}`)
            .then(() => {
                
                temp[user.member.id] = {
                    type: "mute",
                    timeout: setTimeout(() => {
                        db.removemute(user.member.guild.id, user.member.id); 
                        user.member.roles.remove(config.roles.muted, `{Kamaitachi} Tempo ${action.timer} esgotado.`)
                        .then(() => {
                            delete temp[user.member.id];
                            let canal =  client.channels.cache.get(config.channels.modlog)
                            canal.send({embed:{
                                description:`🙌 ${user.member.user.tag} foi **desmutado** pois o tempo se esgotou.`,
                                color:config.color.sucess,
                            }})             
                        })
                        .catch(unmuteerr => {
                            console.error(unmuteerr);
                            let canal =  client.channels.cache.get(config.channels.modlog)
                            canal.send({embed:{
                                description:`⚠️ ${user.member.user.tag} tentou ser **desmutado** pois o tempo se esgotou, **mas ouve um problema.**`,
                                color:config.color.err,
                            }})     
                        });
                    }, moment(0).add(parseInt(action.timer.replace(/[^\d]/g, "")), action.timer.replace(/\d/g, "")).valueOf())
                }
                let canal =  client.channels.cache.get(config.channels.modlog)
                canal.send({embed:{
                    description:`🤫 ${user.member.user.tag} foi **mutado temporariamente** por alcançar ${user.points} advertências.`,
                    color:config.color.sucess,
                }})     
            })
            .catch(err => {
                console.error(err);
                let canal =  client.channels.cache.get(config.channels.modlog)
                canal.send({embed:{
                    description:`⚠️ ${user.member.user.tag} tentou ser **mutado temporariamente** por alcançar ${user.points} advertencias, **mas ouve um problema.**`,
                    color:config.color.err,
                }})     
                });
                }
        else { // Perm mute
            user.member.roles.add(config.roles.muted, `{kamaitachi} Alcançando ${user.points} advertencia(s). Tempo: ∞`)
            .then(() => {
                let canal =  client.channels.cache.get(config.channels.modlog)
                canal.send({embed:{
                    description:`🤫 ${user.member.user.tag} estava **mutado** por alcançar ${user.points} advertencias.`,
                    color:config.color.err,
                }})             })
            .catch(err => {
                console.error(err);
                let canal =  client.channels.cache.get(config.channels.modlog)
                canal.send({embed:{
                    description:`🤫 ${user.member.user.tag} estava **mutado** por alcançar ${user.points} advertencias.`,
                    color:config.color.err,
                }})
            });
        }
    }
    if (action.type == "adv2") {
        if (action.timer) { // Temp mute
            db.addmute(user.member.guild.id, user.member.id);
        if(!user.member.roles.cache.has(config.roles.adv1)){
            user.member.roles.add(config.roles.adv1)}
        user.member.roles.add(config.roles.adv2);
        user.member.roles.add(config.roles.muted, `{Kamaitachi}  ${user.points} advertencia(s). Tempo: ${action.timer}`)
        .then(() => { 
            temp[user.member.id] = {
                type: "mute",
                timeout: setTimeout(() => { 
                    db.removemute(user.member.guild.id, user.member.id);
                    user.member.roles.remove(config.roles.muted, `{Kamaitachi} Tempo ${action.timer} esgotado.`)
                    .then(() => {
                        delete temp[user.member.id];
                        let canal =  client.channels.cache.get(config.channels.modlog)
                        canal.send({embed:{
                            description:`🙌 ${user.member.user.tag} foi **desmutado** pois o tempo se esgotou.`,
                            color:config.color.sucess,
                        }})             
                    })
                    .catch(unmuteerr => {
                        console.error(unmuteerr);
                        let canal =  client.channels.cache.get(config.channels.modlog)
                        canal.send({embed:{
                            description:`⚠️ ${user.member.user.tag} tentou ser **desmutado** pois o tempo se esgotou, **mas ouve um problema.**`,
                            color:config.color.err,
                        }})     
                    });
                }, moment(0).add(parseInt(action.timer.replace(/[^\d]/g, "")), action.timer.replace(/\d/g, "")).valueOf())
            }
            let canal =  client.channels.cache.get(config.channels.modlog)
            canal.send({embed:{
                description:`🤫 ${user.member.user.tag} foi **mutado temporariamente** por alcançar ${user.points} advertências.`,
                color:config.color.sucess,
            }})     
        })
        .catch(err => {
            console.error(err);
            let canal =  client.channels.cache.get(config.channels.modlog)
            canal.send({embed:{
                description:`⚠️ ${user.member.user.tag} tentou ser **mutado temporariamente** por alcançar ${user.points} advertencias, **mas ouve um problema.**`,
                color:config.color.err,
            }})     
            });
            }
    else { // Perm mute
        user.member.roles.add(config.roles.muted, `{kamaitachi} Alcançando ${user.points} advertencia(s). Tempo: ∞`)
        .then(() => {
            let canal =  client.channels.cache.get(config.channels.modlog)
            canal.send({embed:{
                description:`🤫 ${user.member.user.tag} estava **mutado** por alcançar ${user.points} advertencias.`,
                color:config.color.err,
            }})             })
        .catch(err => {
            console.error(err);
            let canal =  client.channels.cache.get(config.channels.modlog)
            canal.send({embed:{
                description:`🤫 ${user.member.user.tag} estava **mutado** por alcançar ${user.points} advertencias.`,
                color:config.color.err,
            }})
        });
    }
}   
if (action.type == "adv3") {
    if (action.timer) { // Temp mute
        db.addmute(user.member.guild.id, user.member.id);
        if(!user.member.roles.cache.has(config.roles.adv1)){
            user.member.roles.add(config.roles.adv1)
            if(!user.member.roles.cache.has(config.roles.adv2)){
                user.member.roles.add(config.roles.adv2)}}
    user.member.roles.add(config.roles.adv3);
    user.member.roles.add(config.roles.muted, `{Kamaitachi}  ${user.points} advertencia(s). Tempo: ${action.timer}`)
    .then(() => { 
        temp[user.member.id] = {
            type: "mute",
            timeout: setTimeout(() => { 
                db.removemute(user.member.guild.id, user.member.id);
                user.member.roles.remove(config.roles.muted, `{Kamaitachi} Tempo ${action.timer} esgotado.`)
                .then(() => {
                    delete temp[user.member.id];
                    let canal =  client.channels.cache.get(config.channels.modlog)
                    canal.send({embed:{
                        description:`🙌 ${user.member.user.tag} foi **desmutado** pois o tempo se esgotou.`,
                        color:config.color.sucess,
                    }})             
                })
                .catch(unmuteerr => {
                    console.error(unmuteerr);
                    let canal =  client.channels.cache.get(config.channels.modlog)
                    canal.send({embed:{
                        description:`⚠️ ${user.member.user.tag} tentou ser **desmutado** pois o tempo se esgotou, **mas ouve um problema.**`,
                        color:config.color.err,
                    }})     
                });
            }, moment(0).add(parseInt(action.timer.replace(/[^\d]/g, "")), action.timer.replace(/\d/g, "")).valueOf())
        }
        let canal =  client.channels.cache.get(config.channels.modlog)
        canal.send({embed:{
            description:`🤫 ${user.member.user.tag} foi **mutado temporariamente** por alcançar ${user.points} advertências.`,
            color:config.color.sucess,
        }})     
    })
    .catch(err => {
        console.error(err);
        let canal =  client.channels.cache.get(config.channels.modlog)
        canal.send({embed:{
            description:`⚠️ ${user.member.user.tag} tentou ser **mutado temporariamente** por alcançar ${user.points} advertencias, **mas ouve um problema.**`,
            color:config.color.err,
        }})     
        });
        }
    else { // Perm mute
    user.member.roles.add(config.roles.muted, `{kamaitachi} Alcançando ${user.points} advertencia(s). Tempo: ∞`)
    .then(() => {
        let canal =  client.channels.cache.get(config.channels.modlog)
        canal.send({embed:{
            description:`🤫 ${user.member.user.tag} estava **mutado** por alcançar ${user.points} advertencias.`,
            color:config.color.err,
        }})             })
    .catch(err => {
        console.error(err);
        let canal =  client.channels.cache.get(config.channels.modlog)
        canal.send({embed:{
            description:`🤫 ${user.member.user.tag} estava **mutado** por alcançar ${user.points} advertencias.`,
            color:config.color.err,
        }})
    });
}
}

            
}
