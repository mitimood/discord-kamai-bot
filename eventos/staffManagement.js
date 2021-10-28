const config = require("../config")
const { TrimMsg, punishments } = require("../funções/funções")
const {client} = require("../index")
const {addReport, getReport, updateStateReport, warn_add, warn_list, getAllActiveReports} = require("../mongodb")
const { MessageActionRow, MessageSelectMenu, MessageEmbed, MessageButton } = require('discord.js');

client.on("interactionCreate", async interac =>{
    setInterval(async()=>{
        const reportmod = client.channels.cache.get(config.channels.modReports)
        const docs = await getAllActiveReports()
        await reportmod.setName(`Registros ativos [${docs.length}]`)
    },30000)

    const modlogChannel = client.channels.cache.get(config.channels.modlog)
    if(!interac.isButton()) return

    if(interac.channel.id != config.channels.modReports) return

    if(interac.customId === "ban"){
        if(interac.member.roles.cache.find(id=>Object.values(config.roles.staff).find(ids=> id == ids))){
            ban()
        }else{
            interac.reply({content:"Faltam permissões", ephemeral:true})
        }     
    } else if(interac.customId === "warn"){

        if(interac.member.roles.cache.find(id=>Object.values(config.roles.staff).find(ids=> id == ids))){
            warn()
        }else{
            interac.reply({content:"Faltam permissões", ephemeral:true})
        }

    }else if(interac.customId === "roles"){

        if(interac.member.roles.cache.find(id=>Object.values(config.roles.teams.caps).find(ids=> id == ids))){
            roles()
        }else{
            interac.reply({content:"Faltam permissões", ephemeral:true})
        }

    }else if(interac.customId === "no"){
        const doc = await getReport(interac.message.id)
        if(doc && doc.authorId == interac.user.id || interac.member.roles.cache.has(config.roles.staff.admin)){
            await updateStateReport(doc._id, false)
            for(const id of doc.messages){
                try {
                    await interac.channel.messages.delete(id)
                } catch (error) {
                    
                }
            }
        }else{
            interac.reply({content:"Faltam permissões", ephemeral:true})
        }
    }else if(interac.customId === "yes"){

        const doc = await getReport(interac.message.id)
        if(!doc.toDo) return

        if(interac.member.roles.cache.has(config.roles.staff.admin)){
            switch(doc.toDo.action){
                case"ban":
                if(doc.toDo.users.length >5 ) interac.deferReply({"ephemeral":true})
                const users = await verificaArgsUser(doc.toDo.users)

                for(const memb of users.members){
                    try {
                        let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({unique:true,reason:"ban invite",maxUses:1, maxAge:604800})
                        await memb.send(`Aplicado por(${doc.authorId}--&&--${interac.user.id} [${interac.user.toString()}])\n\nVocê foi banido de KAMAITACHI, por: `+doc.toDo.reason+ `\nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)
                    
                    } catch (error) {
                        
                    }
                 }

                for(const user of users.users){
                    try {
                        await interac.guild.members.ban(user, {reason: `[${interac.member.id}] ${doc.toDo.reason}`})

                    } catch (error) {
                        
                    }
                }
                let embeds2 = []
                const reportUser = await client.users.fetch(doc.authorId)

                for(const [i,user] of users.users.entries()){
                    const emb = new MessageEmbed()
                            .setThumbnail(user.avatarURL())
                            .setTitle(user.tag)
                            .setDescription(`Banido por: ${reportUser.toString()}, aprovado por: ${interac.user.toString()} \n Motivo: \`${doc.toDo.reason}\``)
                            .setColor(config.color.red)
                            .setFooter(`id: ${user.id}`)

                    if(embeds2.length < 10 ){
                        embeds2.push(emb)

                    }else if (embeds2.length == 10){
                        await modlogChannel.send({embeds:embeds2})
                        embeds2 = []
                        embeds2.push(emb)

                    }
                    
                    if(i+1 == users.users.length){
                        await modlogChannel.send({embeds:embeds2})

                    }
                }

                await updateStateReport(doc._id, false)
                for(const id of doc.messages){
                    try {
                        await interac.channel.messages.delete(id)

                    } catch (error) {
                        
                    }
                }
                interac.reply("Banidos com sucesso")

                    break;
                case"warn":
                const usersWarn = await verificaArgsUser(doc.toDo.users)
                    for(const user of usersWarn.users){
                        await warn_add(user.id, interac.user.id, 1, doc.toDo.reason)
                        const warn = await warn_list(user.id)
                        await punishments(user.id, warn.points, interac.guild, interac.user)
                    }
                    let embeds3 = []
                    const reportUserWarn = await client.users.fetch(doc.authorId)

                    for(const [i,user] of usersWarn.users.entries()){
                        const emb = new MessageEmbed()
                                .setThumbnail(user.avatarURL())
                                .setTitle(user.tag)
                                .setDescription(`Advertido por: ${reportUserWarn.toString()}, aprovado por: ${interac.user.toString()} \n Motivo: \`${doc.toDo.reason}\``)
                                .setColor(config.color.orange)
                                .setFooter(`id: ${user.id}`)
    
                        if(embeds3.length < 10 ){
                            embeds3.push(emb)
    
                        }else if (embeds3.length == 10){
                            await modlogChannel.send({embeds:embeds3})
                            embeds3 = []
                            embeds3.push(emb)
    
                        }
                        
                        if(i+1 == usersWarn.users.length){
                            await modlogChannel.send({embeds:embeds3})
    
                        }
                    }
                    await updateStateReport(doc._id, false)
                    for(const id of doc.messages){
                        try {
                            await interac.channel.messages.delete(id)

                        } catch (error) {
                            
                        }
                    }
                    interac.reply("Advertidos com sucesso")

                    break;
                case"addRole":
                const usersAddRole = await verificaArgsUser(doc.toDo.users, true)
                
                const roleAdd = interac.guild.roles.cache.get(doc.toDo.role) 
                
                if(roleAdd){
                    for(const memb of usersAddRole.members){
                        try {
                            await memb.roles.add(roleAdd)
                        } catch (error) {
                            
                        }
                    }
                }

                await updateStateReport(doc._id, false)
                for(const id of doc.messages){
                    try {
                        await interac.channel.messages.delete(id)

                    } catch (error) {
                        
                    }
                }
                interac.reply("Cargos adicionados com sucesso")

                    break;
                case"removeRole":
                const usersRemoveRole = await verificaArgsUser(doc.toDo.users, true)
                
                const role = interac.guild.roles.cache.get(doc.toDo.role) 
                
                if(role){
                    for(const memb of usersRemoveRole.members){
                        try {
                            await memb.roles.remove(role)
                        } catch (error) {
                            
                        }
                    }
                }

                await updateStateReport(doc._id, false)
                for(const id of doc.messages){
                    try {
                        await interac.channel.messages.delete(id)

                    } catch (error) {
                        
                    }
                }
                interac.reply("Cargos removidos com sucesso")

                    break;
                
            }
        }else{
            interac.reply({content:"Faltam permissões", ephemeral:true})
        }

    }
    async function ban(){
        await interac.reply({content:"Envie os ids dos membros", ephemeral:true})
        try {
            const filter = m =>m.author === interac.user;
            const msgColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']})
            
            if((msgColec?.first()?.content)){
                const msgArgs = TrimMsg(msgColec.first())
                if(msgArgs.length > 10){
                    interac.editReply({content:"Carregando...", ephemeral:true})
                }
                msgColec.first().delete()
                const idResponse = await verificaArgsUser(msgArgs)
                if(idResponse.members || idResponse.users){
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(interac.id)
                            .setPlaceholder('Motivo do banimento')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    emoji:"903237786465894430",
                                    label: 'Flood/spam.',
                                    value: '1',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Divulgação inadequada.',
                                    value: '2',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Off topic/mensagem fora de tópico.',
                                    value: '3',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Menção desnecessária de membros e cargos.',
                                    value: '4',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Provocação e brigas.',
                                    value: '5',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Atrapalhar o andamento do Karaokê.',
                                    value: '6',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Denúncias falsas.',
                                    value: '7',
                                },                                {
                                    emoji:"903237786465894430",
                                    label: 'Linguagem discriminatória.',
                                    value: '8',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Exposição de membros/ Assédio.',
                                    value: '9',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Preconceito, discriminação, difamação e/ou desrespeito.',
                                    value: '10',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Planejar ou exercer raids no servidor.',
                                    value: '12',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'NSFW/ (+18).',
                                    value: '13',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Estimular ou praticar atividades ilegais ou que cause banimento de membros.',
                                    value: '14',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Evasão de punição.',
                                    value: '15',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Conteúdos graficamente chocantes.',
                                    value: '16',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Quebra do ToS do Discord.',
                                    value: '17',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Selfbot.',
                                    value: '18',
                                },
                                {
                                    emoji:"903237786465894430",
                                    label: 'Scam.',
                                    value: '19',
                                },
                                
                            ]),
                    );
                    interac.followUp({components:[row], content:`\`Contas a banir:\`
${idResponse.members ? `Dentro do servidor: **${idResponse.members.length}**` : ""}
${idResponse.users ? `Usuarios validos: **${idResponse.users.length}**` : ""}
${idResponse.invalids ? `Usuários invalidos: **${idResponse.invalids.length}**` : ""}`, ephemeral:true})

                    const filter = (interaction) => interaction.customId === interac.id && interaction.user.id === interac.user.id;
                    const collector = interac.channel.createMessageComponentCollector({ filter,max:1,componentType:"SELECT_MENU", time: 60000 });
                    collector.on('collect',async i =>{
                        try {
                            let reason = ""
                        switch(i.values[0]){
                            case `1`:
                                reason = `Flood/spam`;
                                break;
                            case `2`:
                                reason = `Divulgação inadequada`;
                                break;
                            case `3`:
                                reason = `Off topic/mensagem fora de tópico.`;
                                break;
                            case `4`:
                                reason = `Menção desnecessária de membros e cargos`;
                                break;
                            case `5`:
                                reason = `Provocação e brigas`;
                                break;
                            case `6`:
                                reason = `Poluição sonora`;
                                break;
                            case `7`:
                                reason = `Atrapalhar o andamento do Karaokê`;
                                break;
                            case `8`:
                                reason = `Denúncias falsas`;
                                break;
                            case `9`:
                                reason = `Linguagem discriminatória`;
                                break;
                            case `10`:
                                reason = `Exposição de membros/ Assédio`;
                                break;
                            case `11`:
                                reason = `Preconceito, discriminação, difamação e/ou desrespeito`;
                                break;
                            case `12`:
                                reason = `Planejar ou exercer raids no servidor`;
                                break;
                            case `13`:
                                reason = `NSFW/ (+18)`;
                                break;
                            case `14`:
                                reason = `Estimular ou praticar atividades ilegais ou que cause banimento de membros`;
                                break;
                            case `15`:
                                reason = `Evasão de punição`;
                                break;
                            case `16`:
                                reason = `Conteúdos graficamente chocantes`;
                                break;
                            case `17`:
                                reason = `Quebra do ToS do Discord`;
                                break;
                            case `18`:
                                reason = `Selfbot`;
                                break;
                            case `19`:
                                reason = `Scam`;
                                break;
                            
                        }
                        i.reply({content:`Motivo selecionado: ${reason}`, ephemeral:true})
                        const approvalButtons = new MessageActionRow()
                                        .addComponents(
                                            new MessageButton().setLabel("APROVAR").setStyle("SUCCESS").setCustomId("yes")
                                        )
                                        .addComponents(
                                            new MessageButton().setLabel("NEGAR").setStyle("DANGER").setCustomId("no")
                                        )
                        let embed = new MessageEmbed()
                                    .setTitle(`[BAN] => ${idResponse.users.length} [${reason}]`)
                                    .setDescription("Esperando aprovação...\n\nAberto por "+ interac.user.toString())
                                    .setColor(config.color.red)                        
                        const watingAproval = await interac.channel.send({embeds:[embed], components:[approvalButtons]})
                        
                        let embeds = []
                        let ids = []
                        let messages = []

                        messages.push(watingAproval.id)
                        for(const [i,user] of idResponse.users.entries()){
                            ids.push(user.id)
                            const emb = new MessageEmbed()
                                    .setThumbnail(user.avatarURL())
                                    .setTitle(user.tag)
                                    .setDescription(`Banido por ${interac.user.toString()}\n Motivo: \`${reason}\``)
                                    .setColor(config.color.red)
                                    .setFooter(`id: ${user.id}`)

                            if(embeds.length < 10 ){
                                embeds.push(emb)

                            }else if (embeds.length == 10){
                                await watingAproval.reply({embeds:embeds}).then(m=>messages.push(m.id))
                                embeds = []
                                embeds.push(emb)

                            }
                            
                            if(i+1 == idResponse.users.length){
                                await watingAproval.reply({embeds:embeds}).then(m=>messages.push(m.id))

                            }
                        }
                        const reportId = watingAproval.id
                        const toDo ={
                            action: "ban",
                            users: ids,
                            reason: reason

                        }
                        const authorId = interac.user.id
                        await addReport(reportId, toDo, authorId, messages)
                        } catch (error) {
                            console.log(error)
                        }
                        
                        
                    });
                }else{
                    await interac.followUp({content:"Nenhuma conta valida passada", ephemeral:true})
                }
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function warn(){
        await interac.reply({content:"Envie os ids dos membros", ephemeral:true})
        try {
            const filter = m =>m.author === interac.user;
            const msgColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']})
            
            if((msgColec?.first()?.content)){
                const msgArgs = TrimMsg(msgColec.first())
                if(msgArgs.length > 10){
                    interac.editReply({content:"Carregando...", ephemeral:true})
                }
                msgColec.first().delete()
                const idResponse = await verificaArgsUser(msgArgs)
                if(idResponse.members || idResponse.users){
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(interac.id)
                            .setPlaceholder('Motivo da advertencia')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    emoji:"899750162614849546",
                                    label: 'Flood/spam.',
                                    value: '1',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Divulgação inadequada.',
                                    value: '2',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Off topic/mensagem fora de tópico.',
                                    value: '3',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Menção desnecessária de membros e cargos.',
                                    value: '4',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Provocação e brigas.',
                                    value: '5',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Atrapalhar o andamento do Karaokê.',
                                    value: '6',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Denúncias falsas.',
                                    value: '7',
                                },                                {
                                    emoji:"899750162614849546",
                                    label: 'Linguagem discriminatória.',
                                    value: '8',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Exposição de membros/ Assédio.',
                                    value: '9',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Preconceito, discriminação, difamação e/ou desrespeito.',
                                    value: '10',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Planejar ou exercer raids no servidor.',
                                    value: '12',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'NSFW/ (+18).',
                                    value: '13',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Estimular ou praticar atividades ilegais ou que cause banimento de membros.',
                                    value: '14',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Evasão de punição.',
                                    value: '15',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Conteúdos graficamente chocantes.',
                                    value: '16',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Quebra do ToS do Discord.',
                                    value: '17',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Selfbot.',
                                    value: '18',
                                },
                                {
                                    emoji:"899750162614849546",
                                    label: 'Scam.',
                                    value: '19',
                                },
                                
                            ]),
                    );
                    interac.followUp({components:[row], content:`\`Contas a advertir:\`
${idResponse.members ? `Dentro do servidor: **${idResponse.members.length}**` : ""}
${idResponse.users ? `Usuarios validos: **${idResponse.users.length}**` : ""}
${idResponse.invalids ? `Usuários invalidos: **${idResponse.invalids.length}**` : ""}`, ephemeral:true})

                    const filter = (interaction) => interaction.customId === interac.id && interaction.user.id === interac.user.id;
                    const collector = interac.channel.createMessageComponentCollector({ filter,max:1,componentType:"SELECT_MENU", time: 60000 });
                    collector.on('collect',async i =>{
                        try {
                            let reason = ""
                        switch(i.values[0]){
                            case `1`:
                                reason = `Flood/spam`;
                                break;
                            case `2`:
                                reason = `Divulgação inadequada`;
                                break;
                            case `3`:
                                reason = `Off topic/mensagem fora de tópico.`;
                                break;
                            case `4`:
                                reason = `Menção desnecessária de membros e cargos`;
                                break;
                            case `5`:
                                reason = `Provocação e brigas`;
                                break;
                            case `6`:
                                reason = `Poluição sonora`;
                                break;
                            case `7`:
                                reason = `Atrapalhar o andamento do Karaokê`;
                                break;
                            case `8`:
                                reason = `Denúncias falsas`;
                                break;
                            case `9`:
                                reason = `Linguagem discriminatória`;
                                break;
                            case `10`:
                                reason = `Exposição de membros/ Assédio`;
                                break;
                            case `11`:
                                reason = `Preconceito, discriminação, difamação e/ou desrespeito`;
                                break;
                            case `12`:
                                reason = `Planejar ou exercer raids no servidor`;
                                break;
                            case `13`:
                                reason = `NSFW/ (+18)`;
                                break;
                            case `14`:
                                reason = `Estimular ou praticar atividades ilegais ou que cause banimento de membros`;
                                break;
                            case `15`:
                                reason = `Evasão de punição`;
                                break;
                            case `16`:
                                reason = `Conteúdos graficamente chocantes`;
                                break;
                            case `17`:
                                reason = `Quebra do ToS do Discord`;
                                break;
                            case `18`:
                                reason = `Selfbot`;
                                break;
                            case `19`:
                                reason = `Scam`;
                                break;
                            
                        }
                        i.reply({content:`Motivo selecionado: ${reason}`, ephemeral:true})
                        const approvalButtons = new MessageActionRow()
                                        .addComponents(
                                            new MessageButton().setLabel("APROVAR").setStyle("SUCCESS").setCustomId("yes")
                                        )
                                        .addComponents(
                                            new MessageButton().setLabel("NEGAR").setStyle("DANGER").setCustomId("no")
                                        )
                        let embed = new MessageEmbed()
                                    .setTitle(`[ADVERTÊNCIA] => ${idResponse.users.length} [${reason}]`)
                                    .setDescription("Esperando aprovação...\n\nAberto por "+ interac.user.toString())
                                    .setColor(config.color.red)
                        let embeds = []
                        let ids = []
                        let messages = []
                        const watingAproval = await interac.channel.send({embeds:[embed], components:[approvalButtons]})
                        messages.push(watingAproval.id)

                        for(const [i,user] of idResponse.users.entries()){
                            ids.push(user.id)
                            const emb = new MessageEmbed()
                                    .setThumbnail(user.avatarURL())
                                    .setTitle(user.tag)
                                    .setDescription(`Advertido por ${interac.user.toString()}\n Motivo: \`${reason}\``)
                                    .setColor(config.color.orange)
                                    .setFooter(`id: ${user.id}`)

                            if(embeds.length < 10 ){
                                embeds.push(emb)

                            }else if (embeds.length == 10){
                                await watingAproval.reply({embeds:embeds}).then(m=>messages.push(m.id))
                                embeds = []
                                embeds.push(emb)

                            }
                            
                            if(i+1 == idResponse.users.length){
                                await watingAproval.reply({embeds:embeds}).then(m=>messages.push(m.id))

                            }
                        }
                        const reportId = watingAproval.id
                        const toDo ={
                            action: "warn",
                            users: ids,
                            reason: reason

                        }
                        const authorId = interac.user.id
                        await addReport(reportId, toDo, authorId, messages)
                        } catch (error) {
                            console.log(error)
                        }
                        
                        
                    });
                }else{
                    await interac.followUp({content:"Nenhuma conta valida passada", ephemeral:true})
                }
            }

        } catch (error) {
            interac.followUp({content: "Tempo esgotado", ephemeral:true})
            console.log(error)
        }

    }

    async function roles(){
        await interac.reply({content:"Envie o id do cargo, ou mencione-o", ephemeral:true})
        const filter = m =>m.author === interac.user;
        try {
            const roleColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']})
            if(roleColec?.first()?.content){
                const roleArgs = TrimMsg(roleColec.first())
                const role = roleArgs[0].replace(/\<|\>|\@|\!|\&/g, "")

                let roleId = interac.guild.roles.cache.get(role)
                await roleColec.first().delete()
                if(!roleId) return interac.followUp({content: "Cargo invalido", ephemeral:true})

                await interac.followUp({content:"Envie os ids dos membros", ephemeral:true})
        try {
            const msgColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']})
            
            if(msgColec?.first()?.content){
                const msgArgs = TrimMsg(msgColec.first())
                if(msgArgs.length > 10){
                    interac.editReply({content:"Carregando...", ephemeral:true})
                }
                msgColec.first().delete()
                const idResponse = await verificaArgsUser(msgArgs, true)
                if(idResponse.members || idResponse.users){
                    const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId(interac.id)
                            .setPlaceholder('O que fazer?')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .addOptions([
                                {
                                    emoji: config.emojis.check,
                                    label: 'Adicionar cargo.',
                                    value: '1',
                                },
                                {
                                    emoji: config.emojis.false ,
                                    label: 'Remover cargo.',
                                    value: '2',
                                },
                    
                            ]),
                    );
                    interac.followUp({components:[row], content:`\`Contas para gerenciar cargos:\`
${idResponse.users ? `Usuarios validos: **${idResponse.members.length}**` : ""}
${idResponse.invalids ? `Usuários invalidos: **${idResponse.invalids.length + idResponse.users.length - idResponse.members.length}**` : ""}`, ephemeral:true})

                    const filter = (interaction) => interaction.customId === interac.id && interaction.user.id === interac.user.id;
                    const collector = interac.channel.createMessageComponentCollector({ filter,max:1,componentType:"SELECT_MENU", time: 60000 });
                    collector.on('collect',async i =>{
                        try {
                            let action = ""
                        switch(i.values[0]){
                            case `1`:
                                action = `add`;
                                break;
                            case `2`:
                                action = `remove`;
                                break;
                            
                        }
                        i.reply({content:`Ação escolhida: ${action}`, ephemeral:true})
                        const approvalButtons = new MessageActionRow()
                                        .addComponents(
                                            new MessageButton().setLabel("APROVAR").setStyle("SUCCESS").setCustomId("yes")
                                        )
                                        .addComponents(
                                            new MessageButton().setLabel("NEGAR").setStyle("DANGER").setCustomId("no")
                                        )
                        let embed = new MessageEmbed()
                                    .setTitle(`[CARGO] => ${idResponse.users.length}   [${action == "remove" ? "Remover" : "Adicionar"}] `)
                                    .setDescription(`[${roleId.toString()}]`+" Esperando aprovação...\n\nAberto por "+ interac.user.toString())
                                    .setColor(config.color.red)

                        const watingAproval = await interac.channel.send({embeds:[embed], components:[approvalButtons]})
                        
                        let embeds = []
                        let ids = []
                        let messages = []

                        messages.push(watingAproval.id)
                        for(const [i,user] of idResponse.users.entries()){
                            ids.push(user.id)
                            const emb = new MessageEmbed()
                                    .setThumbnail(user.avatarURL())
                                    .setTitle(user.tag)
                                    .setDescription(`Gerenciar cargo por: ${interac.user.toString()}\n Ação: \`${action == "remove" ? "Remover" : "Adicionar"}\``)
                                    .setColor(config.color.blurple)
                                    .setFooter(`id: ${user.id}`)

                            if(embeds.length < 10 ){
                                embeds.push(emb)

                            }else if (embeds.length == 10){
                                await watingAproval.reply({embeds:embeds}).then(m=>messages.push(m.id))
                                embeds = []
                                embeds.push(emb)

                            }
                            
                            if(i+1 == idResponse.users.length){
                                await watingAproval.reply({embeds:embeds}).then(m=>messages.push(m.id))

                            }
                        }
                        const reportId = watingAproval.id
                        const toDo ={
                            action: `${action}Role`,
                            users: ids,
                            role: roleId.id

                        }
                        const authorId = interac.user.id
                        await addReport(reportId, toDo, authorId, messages)
                        } catch (error) {
                            console.log(error)
                        }
                        
                        
                    });
                }else{
                    await interac.followUp({content:"Nenhuma conta valida passada", ephemeral:true})
                }
            }

        } catch (error) {
            console.log(error)
        }
            }
        } catch (error) {
            interac.followUp({content: "Tempo esgotado", ephemeral:true})
        }

        
    }


    async function verificaArgsUser(msgArgs, dontVerifyRole = false){
        let members = []
        let invalids = []
        let users = []

        for(let arg of msgArgs){
            arg = arg.replace(/\<|\>|\@|\!|\&/g, "")

            if(arg.match(/^[0-9]+$/) && toString(Date.now().valueOf()) >= arg){
              try {
                let user = await interac.client.users.fetch(arg)
                try {
                    let memb = await interac.guild.members.fetch(arg)
                    if(memb.roles.highest.position < interac.member.roles.highest.position || dontVerifyRole){
                        members.push(memb)
                        users.push(memb.user)
                    }else{
                        invalids.push(memb.user)
                    }

                } catch (error) {
                    users.push(user)
                }
              } catch (error) {
                invalids.push(arg)
              }  
            }else{
                invalids.push(arg)
            }
        }
        return({users, members, invalids})
    }
})


