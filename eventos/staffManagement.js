const config = require("../config")
const { TrimMsg, punishments } = require("../utils/auxiliarFunctions")
const {client, selfbotRegister} = require("../index")
const {addReport, getReport, updateStateReport, warn_add, warn_list, getAllActiveReports, MongodbClient} = require("../mongodb")
const { MessageActionRow, SelectMenuBuilder, EmbedBuilder, ButtonStyle, ButtonBuilder, ComponentType } = require('discord.js');
const logger = require("../utils/logger");

let atvtsUP = 0
let channelAtvts = null

let startOneMongo = false

MongodbClient.on("connectionReady",async connection=>{
    if(startOneMongo) return
    startOneMongo = true
    try {
        atvtsUP = await getAllActiveReports()

    } catch (error) {
        logger.error(error)
    }

} )


let lastCount;

setInterval(async()=>{

    if( lastCount != atvtsUP){ 
    
        try {
            
            await client.channels.cache.get(config.channels.modReports).setName(`Registros ativos [${atvtsUP}]`)
            lastCount = atvtsUP
        } catch (error) {
            logger.error(error)
        }
        
    }
},10000)

// Updates the entry counter

const compReasons = [
    {
        emoji: config.emojis.ban,
        label: 'Flood/spam.',
        value: 1,
    },
    {
        emoji: config.emojis.ban,
        label: 'Divulgação inadequada.',
        value: 2,
    },
    {
        emoji: config.emojis.ban,
        label: 'Off topic/mensagem fora de tópico.',
        value: 3,
    },
    {
        emoji: config.emojis.ban,
        label: 'Menção desnecessária de membros e cargos.',
        value: 4,
    },
    {
        emoji: config.emojis.ban,
        label: 'Provocação e brigas.',
        value: 5,
    },
    {
        emoji: config.emojis.ban,
        label: 'Poluição sonora.',
        value: 6,
    },
    {
        emoji: config.emojis.ban,
        label: 'Atrapalhar o andamento do Karaokê.',
        value: 7,
    },
    {
        emoji: config.emojis.ban,
        label: 'Denúncias falsas.',
        value: 8,
    },
    {
        emoji: config.emojis.ban,
        label: 'Linguagem discriminatória.',
        value: 9,
    },
    {
        emoji: config.emojis.ban,
        label: 'Exposição de membros/ Assédio.',
        value: 10,
    },
    {
        emoji: config.emojis.ban,
        label: 'Preconceito, discriminação, difamação e/ou desrespeito.',
        value: 11,
    },
    {
        emoji: config.emojis.ban,
        label: 'Planejar ou exercer raids no servidor.',
        value: 12,
    },
    {
        emoji: config.emojis.ban,
        label: 'NSFW/ (+18).',
        value: 13,
    },
    {
        emoji: config.emojis.ban,
        label: 'Estimular ou praticar atividades ilegais ou que cause banimento de membros.',
        value: 14,
    },
    {
        emoji: config.emojis.ban,
        label: 'Evasão de punição.',
        value: 15,
    },
    {
        emoji: config.emojis.ban,
        label: 'Conteúdos graficamente chocantes.',
        value: 16,
    },
    {
        emoji: config.emojis.ban,
        label: 'Quebra do ToS do Discord.',
        value: 17,
    },
    {
        emoji: config.emojis.ban,
        label: 'Selfbot.',
        value: 18,
    },
    {
        emoji: config.emojis.ban,
        label: 'Scam.',
        value: 19,
    },
    
]


const getReason = reason => {
    return {
            "1": "Flood/spam",
            "2": "Divulgação inadequada",
            "3": "Off topic/mensagem fora de tópico",
            "4": "Menção desnecessária de membros e cargos",
            "5": "Provocação e brigas",
            "6": "Poluição sonora",
            "7": "Atrapalhar o andamento do Karaokê",
            "8": "Denúncias falsas",
            "9": "Linguagem discriminatória",
            "10": "Exposição de membros/ Assédio",
            "11": "Preconceito, discriminação, difamação e/ou desrespeito",
            "12": "Planejar ou exercer raids no servidor",
            "13": "NSFW/ (+18)",
            "14": "Estimular ou praticar atividades ilegais ou que cause banimento de membros",
            "15": "Evasão de punição",
            "16": "Conteúdos graficamente chocantes",
            "17": "Quebra do ToS do Discord",
            "18": "Selfbot",
            "19": "Scam"
            }[reason]
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function msgDeleteMass(channel, ids){
    try {
        await channel.bulkDelete(ids, true)
    } catch (error) {    
        logger.error("ERROR => Bulk delete staffManagement.js\n" + error)
    }
}


async function createReport(action, channel, reason, user_send, acc_action_users, acc_size, color, role = false, selfbot = false){
    try {
        
        const approvalButtons = new MessageActionRow()
        .addComponents(
            new ButtonBuilder().setLabel("APROVAR").setStyle(ButtonStyle.Success).setCustomId("yes")
        )
        .addComponents(
            new ButtonBuilder().setLabel("DELETAR").setStyle(ButtonStyle.Danger).setCustomId("no")
        )
    
        const emb_aproval = new EmbedBuilder()
                    .setTitle(`[${action}] => ${acc_size} afetados ${ reason ? reason : "" }`)
                    .setDescription("Esperando aprovação...\n\nAberto por "+ user_send.toString())
                    .setColor(color)

        const waiting_aproval = await channel.send({embeds:[emb_aproval], components:[approvalButtons]})

        let embeds_action = []
        let acc_ids = []
        let messages = []

        messages.push(waiting_aproval.id)

        for(const [i,user] of acc_action_users.entries()){
        
            acc_ids.push(user.id)

            const emb = new EmbedBuilder()
                        .setThumbnail(user.avatarURL())
                        .setTitle(user.tag + (selfbot ? "DETECÇÃO AUTOMATICA!!!" : ""))
                        .setDescription(`${action} por ${user_send.toString()}
${selfbot ? `⚙ ${selfbot.chance}%` : ""} ${reason ? `Motivo: \`${reason}\` 
${user.toString()}` : "" }`)
                        .setColor(color)
                        .setFooter({text:`id: ${user.id}   by:emanuelstor`})
            
            if(embeds_action.length < 10 ){

                embeds_action.push(emb)

            }else if (embeds_action.length == 10){

                const user_emb1 = await waiting_aproval.reply({embeds:embeds_action})
                
                messages.push(user_emb1.id)

                embeds_action = []
                embeds_action.push(emb)
            }

            if(i+1 == acc_action_users.length){
                const user_emb2 = await waiting_aproval.reply({embeds:embeds_action})

                messages.push(user_emb2.id)
            }
        }

        const reportId = waiting_aproval.id

        action = {"ADVERTENCIA": "warn", "BAN": "ban","ADICIONAR CARGO": "addRole","REMOVER CARGO": "removeRole"}[action]
        const toDo ={
        action: action,
        users: acc_ids,
        reason: reason,
        role: role
        }

        const authorId = user_send.id

        ++atvtsUP

        await addReport(reportId, toDo, authorId, messages)

    } catch (error) {
        logger.error("Error Creating Report\n" + error)
    }

}

exports.createReport = createReport

client.on("interactionCreate", async interac =>{
    let regLogChannel;
    let modLogChannel;

    try {
        regLogChannel = await client.channels.fetch(config.channels.modReports)
        modLogChannel = await client.channels.fetch(config.channels.modlog)

    } catch (error) {
        logger.error(error)
    }
    
    if(!interac.isButton()) return
    if(interac.channel.id != config.channels.modReports) return


    logger.info("Interação modReports")

    // 
    if(interac.customId === "ban"){
        try {
            if(interac.member.roles.cache.find(id=>Object.values(config.roles.staff).find(ids=> id == ids))) await banCreate()

            else await interac.reply({content:"Faltam permissões", ephemeral:true})

        } catch (error) {
            logger.error(error)
        }
             
    } else if(interac.customId === "warn"){

        try {
            if(interac.member.roles.cache.find(id=>Object.values(config.roles.staff).find(ids=> id == ids))) await warnCreate()

            else await interac.reply({content:"Faltam permissões", ephemeral:true})

        } catch (error) {
            logger.error(error)
        }

    }else if(interac.customId === "roles"){
        try {
            if(interac.member.roles.cache.find(id=>Object.values(config.roles.teams.caps).find(ids=> id == ids))) await rolesCreate()

            else await interac.reply({content:"Faltam permissões", ephemeral:true})

        } catch (error) {
            logger.error(error)
        }

    }else if(interac.customId === "no"){
        try {
            const doc = await getReport(interac.message.id)

            if(doc && (doc.state && (doc?.authorId == interac.user.id || interac.member.roles.cache.has(config.roles.staff.admin)))){

                await msgDeleteMass(regLogChannel, doc.messages)

                await updateStateReport(doc._id, false, interac.user.id, true)

                --atvtsUP

            }else{
                await interac.reply({content:"Faltam permissões", ephemeral:true})
            }
        } catch (error) {
            logger.error(error)
        }

    }else if(interac.customId === "yes"){
        
        let doc;
        try {
            doc = await getReport(interac.message.id)
            
            if(!doc || !doc.state) return
    
            if(!interac.member.roles.cache.has(config.roles.staff.admin)) return await interac.reply({content:"Faltam permissões", ephemeral:true})

            const ActionRow = new MessageActionRow()
            interac.message.components.forEach(comp=>{
                comp.components.forEach(button=>{
                    let but = new ButtonBuilder(button).setDisabled(true)
                    ActionRow.addComponents(but)
                })
            })
                
            await interac.update({embeds: interac.message.embeds, components: [ActionRow]})

        } catch (error) {
            logger.error(error)
        }
            switch(doc.toDo.action){                
                case"ban":
                
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
                            if(doc.toDo.reason == "Scam") {

                                await interac.guild.members.ban(user, {reason: `[${interac.member.id}] ${doc.toDo.reason}`, days:2})
                            
                            }else{
                                await interac.guild.members.ban(user, {reason: `[${interac.member.id}] ${doc.toDo.reason}`})
                            
                            }
                           
                        } catch (error) {                           
                        }                    
                    }
                    let reportUser
                    try {
                        reportUser = await client.users.fetch(doc.authorId)

                        let embeds2 = []

                        for(const [i,user] of users.users.entries()){
                            
                            const emb = new EmbedBuilder()
                                            .setThumbnail(user.avatarURL())
                                            .setTitle(user.tag)
                                            .setDescription(`Banido por: ${reportUser.toString()}, aprovado por: ${interac.user.toString()} \n Motivo: \`${doc.toDo.reason}\``)
                                            .setColor(config.color.red)
                                            .setFooter({text:`id: ${user.id}`})
                            
                            if(embeds2.length < 10 ){
                                embeds2.push(emb)
    
                            }else if (embeds2.length == 10){
                                await modLogChannel.send({embeds:embeds2})
                                embeds2 = []
                                embeds2.push(emb)

                            }
                            
                            if(i+1 == users.users.length){
                                await modLogChannel.send({embeds:embeds2})
    
                            }
                        }
                        await updateStateReport(doc._id, false, interac.user.id)

                        await msgDeleteMass( regLogChannel, doc.messages)

                    } catch (error) {
                        logger.error(error)
                    }

                    --atvtsUP

                    break;

                case"warn":
                    try {
                        const usersWarn = await verificaArgsUser(doc.toDo.users)
                        
                        for(const user of usersWarn.users){
                            await warn_add(user.id, interac.user.id, 1, doc.toDo.reason)

                            const warn = await warn_list(user.id)

                            await punishments(user.id, warn.points, interac.guild, interac.user)
                        }

                        let embeds3 = []

                        const reportUserWarn = await client.users.fetch(doc.authorId)                
                        
                        for(const [i,user] of usersWarn.users.entries()){
                            
                            const emb = new EmbedBuilder()
                                        .setThumbnail(user.avatarURL())
                                        .setTitle(user.tag)
                                        .setDescription(`Advertido por: ${reportUserWarn.toString()}, aprovado por: ${interac.user.toString()} \n Motivo: \`${doc.toDo.reason}\``)
                                        .setColor(config.color.orange)
                                        .setFooter({text:`id: ${user.id}`})
            
                            if(embeds3.length < 10 ){
                                embeds3.push(emb)
        
                            }else if (embeds3.length == 10){
                                await regLogChannel.send({embeds:embeds3})
                                embeds3 = []
                                embeds3.push(emb)
        
                            }
                            
                            if(i+1 == usersWarn.users.length){
                                await modLogChannel.send({embeds:embeds3})
        
                            }
                        }

                            await updateStateReport(doc._id, false, interac.user.id)
                            
                            await msgDeleteMass(regLogChannel, doc.messages)

                            --atvtsUP


                    } catch (error) {
                        logger.error(error)
                    }
                    
                    break;
                case"addRole":
                    try {
                        const author = interac.guild.members.cache.get(doc.authorId)
                        const usersAddRole = await verificaArgsUser(doc.toDo.users, true)
                        const roleAdd = interac.guild.roles.cache.get(doc.toDo.role)

                        let membrosLista = ''
                        if(roleAdd){
                            for(const memb of usersAddRole.members){
                                membrosLista = membrosLista + memb.user.username + " " 
                            }
                        }
                        try {
                            await author.send('Acabou de ser aprovado um de seus registros sobre adicionar cargos por '+ interac.member.user.username + "\nContas afetadas:\n" + membrosLista)
                        } catch (error) {
                            
                        }
                        
                        if(roleAdd){
                            for(const memb of usersAddRole.members){
                                await memb.roles.add(roleAdd)
                            }
                        }

                        await msgDeleteMass(regLogChannel, doc.messages)

                        --atvtsUP
    
                        await updateStateReport(doc._id, false, interac.user.id)

                    } catch (error) {
                        logger.error(error)

                    }

                break;

                case"removeRole":
                    try {
                        const usersRemoveRole = await verificaArgsUser(doc.toDo.users, true)
                        const role = interac.guild.roles.cache.get(doc.toDo.role)
                        let membrosRemLista = ''
                        
                        if(role){
                            for(const memb of usersRemoveRole.members){
                                membrosRemLista = membrosRemLista + memb.user.username + " " 
                            }
                        }
                        try {
                            await author.send('Acabou de ser aprovado um de seus registros sobre adicionar cargos por '+ interac.member.user.username + "\nContas afetadas:\n" + membrosRemLista)
                        } catch (error) {
                            
                        }
                        if(role){
                            for(const memb of usersRemoveRole.members){
                                await memb.roles.remove(role)

                            }
                        }

                    await msgDeleteMass(regLogChannel, doc.messages)

                    await updateStateReport(doc._id, false, interac.user.id)

                    --atvtsUP

                } catch (error) {
                        logger.error(error)
                    }

                break;

            }
    }
    async function banCreate(){

        await interac.reply({content:"Envie os ids dos membros", ephemeral:true}).catch(err=>console.log(err))
        
        try {
            let filter = m => m.author === interac.user;

            let msgColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']}).catch(err=>console.log(err))
            
            // return if non response
            if(!msgColec?.first()?.content) return
            
            msgColec = msgColec.first()
            
            const msgArgs = TrimMsg(msgColec)

            await msgColec.delete()

            // sends response if too much users to load
            if(msgArgs.length > 10) await interac.editReply({content:"Carregando os usuários, vc mandou bastantinho...", ephemeral:true})
            
            let acc_action;
            
            // Loads users
            acc_action = await verificaArgsUser(msgArgs)
                
            if(acc_action.members == [] && acc_action.users == []) return await interac.editReply({content:"Nenhuma conta valida passada", ephemeral:true})
            
            const row = new MessageActionRow()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId(interac.id)
                    .setPlaceholder('Motivo do banimento')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(compReasons),
            );

            try {
                await interac.editReply({components:[row], content:`\`Contas a banir:\`
${acc_action.members ? `Dentro do servidor: **${acc_action.members.length}**` : ""}
${acc_action.users ? `Usuarios validos: **${acc_action.users.length}**` : ""}
${acc_action.invalids ? `Usuários invalidos: **${acc_action.invalids.length}**` : ""}
                `, ephemeral:true})
                
            } catch (error) {
                logger.error(error)
            }

                filter = (interaction) => interaction.customId === interac.id && interaction.user.id === interac.user.id;
                
                const collector = interac.channel.createMessageComponentCollector({ filter,max:1,componentType:ComponentType.SelectMenu, time: 120000 });
                
                collector.on('collect',async i =>{
                    try {

                        try {
                            await interac.editReply({components:[], content:'Registrado com sucesso'})
                        } catch (error) {
                            console.log(error)
                        }

                        let reason = i?.values[0]

                        if (!reason) return

                        reason = getReason(reason)

                        await createReport("BAN", regLogChannel, reason, interac.user, acc_action.users, acc_action.users.length, config.color.red)

                    } catch (error) {
                        logger.error(error)
                    }
                });

        } catch (error) {
            logger.error(error)
        }
    }

    async function warnCreate(){
        try {
            await interac.reply({content:"Envie os ids dos membros", ephemeral:true})

            let filter = m =>m.author === interac.user;
            let msgColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']})
            
            if(!msgColec?.first()?.content) return

            msgColec = msgColec.first()

            const msgArgs = TrimMsg(msgColec)
            
            if(msgArgs.length > 10) await interac.editReply({content:"Carregando os usuários, vc mandou bastantinho...", ephemeral:true})
            
            await msgColec.delete()

            const acc_action = await verificaArgsUser(msgArgs)
                
            if(acc_action.members == [] && acc_action.users == []) await interac.editReply({content:"Nenhuma conta valida passada", ephemeral:true})

            const row = new MessageActionRow()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId(interac.id)
                    .setPlaceholder('Motivo da advertencia')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .addOptions(compReasons),
            );

            await interac.editReply({components:[row], content:`\`Contas a advertir:\`
${acc_action.members ? `Dentro do servidor: **${acc_action.members.length}**` : ""}
${acc_action.users ? `Usuarios validos: **${acc_action.users.length}**` : ""}
${acc_action.invalids ? `Usuários invalidos: **${acc_action.invalids.length}**` : ""}
`, ephemeral:true})

            filter = (interaction) => interaction.customId === interac.id && interaction.user.id === interac.user.id;

            const collector = interac.channel.createMessageComponentCollector({ filter,max:1,componentType:ComponentType.SelectMenu, time: 120000 });

            collector.on('collect',async i =>{
                try {

                    try {
                        await interac.editReply({components:[], content:'Registrado com sucesso'})
                    } catch (error) {
                        
                    }
                    let reason = i?.values[0]
                
                    if(!reason) return

                    reason = getReason(reason)
                
                    await createReport("ADVERTENCIA", regLogChannel, reason, interac.user, acc_action.users, acc_action.users.length, config.color.orange)

                } catch (error) {
                    logger.error(error)
                }
                        
            });

        } catch (error) {
            logger.error(error)
        }

    }

    async function rolesCreate(){
        try {
            await interac.reply({content:"Envie o id do cargo, ou mencione-o", ephemeral:true})
            let filter = m =>m.author === interac.user;

            let roleColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']})
            
            if(!roleColec?.first()?.content) return

            roleColec = roleColec.first()

            await roleColec.delete()

            const roleArgs = TrimMsg(roleColec)
            
            const roleId = roleArgs[0].replace(/\<|\>|\@|\!|\&/g, "")

            let role = interac.guild.roles.cache.get(roleId)

            if(!role) return await interac.editReply({content: "Cargo invalido", ephemeral:true})

            await interac.editReply({content:"Envie os ids dos membros", ephemeral:true})

            let msgColec = await interac.channel.awaitMessages({filter, max:1, time:60000, errors: ['time']})
            
            if(!msgColec?.first()?.content) return

            msgColec = msgColec.first()

            const msgArgs = TrimMsg(msgColec)

            if(msgArgs.length > 10) await interac.first({content:"Carregando os usuários, vc mandou bastantinho...", ephemeral:true})
                
            await msgColec.delete()
                
            const acc_action = await verificaArgsUser(msgArgs, true)
                
            if(acc_action.members == [] && acc_action.users == []) await interac.editReply({content:"Nenhuma conta valida passada", ephemeral:true})

            const row = new MessageActionRow()
                        .addComponents(
                            new SelectMenuBuilder()
                                .setCustomId(interac.id)
                                .setPlaceholder('O que fazer?')
                                .setMinValues(1)
                                .setMaxValues(1)
                                .addOptions([
                                    {
                                        emoji: config.emojis.check,
                                        label: 'Adicionar cargo.',
                                        value: 1,
                                    },
                                    {
                                        emoji: config.emojis.false ,
                                        label: 'Remover cargo.',
                                        value: 2,
                                    },
                        
                                ]),
                        );
                    
            await interac.editReply({components:[row], content:`\`Contas para gerenciar cargos:\`
${acc_action.users ? `Usuarios validos: **${acc_action.members.length}**` : ""}
${acc_action.invalids ? `Usuários invalidos: **${acc_action.invalids.length + acc_action.users.length - acc_action.members.length}**` : ""}
`, ephemeral:true})

            filter = (interaction) => interaction.customId === interac.id && interaction.user.id === interac.user.id;
            
            const collector = interac.channel.createMessageComponentCollector({ filter,max:1,componentType:ComponentType.SelectMenu, time: 60000 });
            
            collector.on('collect',async i =>{
                try {

                    try {
                        await interac.editReply({components:[], content:'Registrado com sucesso'})
                    } catch (error) {
                        
                    }
                    let action = ""

                    if(!i?.values[0]) return

                    switch(i.values[0]){
                        case `1`:
                            action = `add`;
                            break;
                        case `2`:
                            action = `remove`;
                            break;
                    }

                    await createReport(action == "add" ? "ADICIONAR CARGO" : "REMOVER CARGO", regLogChannel, role.name, 
                                        interac.user, acc_action.users, acc_action.users.length, config.color.purple, role.id)

                } catch (error) {
                    logger.error(error)
                }
                
                
            });

        } catch (error) {
            logger.error(error)
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

