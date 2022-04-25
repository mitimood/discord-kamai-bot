const { MessageEmbed } = require('discord.js');
const config = require('../../config');
const { TrimMsg } = require('../../utils/auxiliarFunctions');
const { get_xp, moneyGet, getPoints } = require('../../mongodb');
const logger = require('../../utils/logger');
const client = require('../../utils/loader/discordClient');

/*
    Say some informations about a specific member
    - When the accontou was created
    - How much time since the account was created
    - When the account joined the guild
    - How much time since the account joined in the guild
*/
const blackProgressBar = "<:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021><:blackbar:891790337809449021>"

module.exports={
    name: "info",
    aliases: ["userinfo","profile"],
    description: "informa alguns dados do usuário",

    async execute(msg){
        try {
            const embed = new MessageEmbed()
            embed.setDescription(`⠀`)
            
            let msgArgs = TrimMsg(msg)
            let userid = ""
    
            if (msg.mentions.members.first()){
                userid =  msg.mentions.members.first().user.id
            }else if( !msgArgs[1] || !msgArgs[1].match(/[0-9]/g) ){
                userid = msg.author.id
            }else if(msgArgs[1].match(/[0-9]/g)){
                userid = msgArgs[1]
            }

            try{
                
                const member = msg.guild.members.cache.get(userid)
                let user;
                try {
                    if(member) user = member.user
                    else user = await client.users.fetch(userid)    
                } catch (error) {
                    console.log(error)
                    return msg.channel.send({content: msg.author.toString() + " Não achamos nenhum usuário"})
                }
                
                embed.setColor(config.color.blurple)
            
                var flags = null
                
                if(member?.user?.flags){
                    flags = separate_flags(member.user.flags.toArray())
                }
                
                embed.setTitle((flags ? flags.join("") : "") + user.username )
                embed.setThumbnail( user.displayAvatarURL({ size:1024, format: "png", dynamic: true }))
                embed.setFooter({text:`id: ${user.id}`})

                if(member){
                    let date = new Date(Date.now() - member.joinedAt )

                    let joined_duration_month = parseInt(date.getTime() / 2592000000)
                
                    let badges = badge(joined_duration_month)
                    
                    if(badges){
                        embed.addField('⭐Badges', badges, false)
                    }

                    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric"};

                    const durJoined = new Date(new Date() - new Date(member.joinedTimestamp))

                    const joinedString = new Date(member.joinedTimestamp).toLocaleString('pt-BR', options) + 
                    ` ➡ \`${durJoined.getFullYear()-1970? `${durJoined.getFullYear()-1970} ano${durJoined.getFullYear()-1970 > 1? 's': ''}` : ''}\
${durCreated.getDay() ? `${durCreated.getDate()} dia${durCreated.getDay()>1 ? 's': ''}` : ""}\
${durJoined.getMonth() ? `${durJoined.getMonth()} mes${durJoined.getMonth() >0 ? 'es': ''}` : ""}\
${durJoined.getHours() ? `${durJoined.getHours()} hora${durJoined.getHours() >1 ? 's': ''}` : ""}\
${durJoined.getMinutes() ? `${durJoined.getMinutes()} minuto${durJoined.getMinutes() >1 ? 's': ''}` : ""}\
${durJoined.getSeconds() ? `${durJoined.getSeconds()} segundo${durJoined.getSeconds() >1 ? 's': ''}` : ""}\``

                    embed.addField('📅 Entrou em', joinedString, false)

                }
                
                var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", second: "numeric"};

                const durCreated = new Date(new Date() - new Date(user.createdTimestamp))

                const createdString = new Date(user.createdTimestamp).toLocaleString('pt-BR', options) + 
 ` ➡ \`${durCreated.getFullYear()-1970? `${durCreated.getFullYear()-1970} ano${durCreated.getFullYear()-1970 > 1? 's': ''}` : ''}\
${durCreated.getMonth() ? `${durCreated.getMonth()} mes${durCreated.getMonth()>0 ? 'es': ''}` : ""}\
${durCreated.getDay() ? `${durCreated.getDate()} dia${durCreated.getDay()>1 ? 's': ''}` : ""}\
${durCreated.getHours() ? `${durCreated.getHours()} hora${durCreated.getHours()>1 ? 's': ''}` : ""}\
${durCreated.getMinutes() ? `${durCreated.getMinutes()} minuto${durCreated.getMinutes()>1 ? 's': ''}` : ""}\
${durCreated.getSeconds() ? `${durCreated.getSeconds()} segundo${durCreated.getSeconds()>1 ? 's': ''}` : ""}\``


                embed.addField('📅 Criada em', createdString, false)
                
                const coins = await moneyGet(userid)
                
                if(coins){
                    embed.addField('<:Coin_kamai:881917666829414430> Kamaicoins', `₵**${coins}**`, true)
                }
                
                try {
                    const points = await getPoints(userid)
                    
                    if(points) embed.addField('🏆 Pontos troféu 🏆', `**${points}**`, true)

                } catch (error) {
                    logger.error(error)
                }

                let xp = await xp_info(userid)
                embed.setDescription(`**global lvl**: ${xp?.global?.level?  xp.global.level : 0 }
                ${xp.global ? xp.global.xpGlobalBar : blackProgressBar} ${xp?.global?.percentage ? parseInt(xp.global.percentage * 100) : "0"}%
                **CHAT**: ${xp.chat.total ? xp.chat.total : 0}xp   **VOZ**: ${xp.voice.total ? xp.voice.total : 0}xp [${xp?.voice?.time ? xp.voice.time : 0}h]  **BÔNUS**: ${xp.bonus.total ? xp.bonus.total : 0}xp
                `)
                try {
                    await msg.channel.send({content: msg.author.toString(),embeds:[embed]})
        
                } catch (error) {
                    logger.error(error)
                }



            }catch (error){

                console.log(error)
                try {
                    return await msg.channel.send(msg.author.toString() + " Usuario desconhecido")
    
                } catch (error) {
                    logger.error(error)
                }
            }


            // let date_duration = new Date(Date.now() - new Date(member.user.createdTimestamp))
    
            // let joined_duration = format_date_created(date)
            // let joined_since = format_date(member.joinedAt)
            // let created_since = format_date(new Date(member.user.createdTimestamp))
            // let created_duration = format_date_created(date_duration)
    
            // embed.addField('🛎Entrada:', joined_since + `(${joined_duration})`, true)
            // embed.addField('🚪Criada em:', created_since + `(${created_duration})`, true)
    
        } catch (error) {
            logger.error(error)
        }

    }
}

function badge(duration){
    try {
        let badges = []

        if(duration>2)badges.push(`<:cabelo_arcoiris:868301567646896198>`)
        if(duration>4)badges.push(`<:kamaitachi_chifrinho:868302636422684734>`)
        if(duration>6)badges.push(`<:Juliet:868301567860801586>`)
        if(duration>8)badges.push(`<:Pendurado:868301567827271680>`)
        if(duration>10)badges.push(`<:Homemtorto:868301568833904650>`)
        if(duration>12)badges.push(`<:jhonny:868301567890161685>`)
    
        badges=badges.join("")
        return badges;
    } catch (error) {
        logger.error(error)
    }
}


function format_user(member){

    let description = `${member.user.tag}`
    
    let date = Date.now() - member.joinedAt 
    let joined_at = format_date_created(new Date(date))

    description += '\nEntrou a: '+ joined_at
    description += '\nkamaicoins = *null*'
    description += ''
    return description
    
}


function separate_flags(flagsArray){
    let flag_emojis = []
    
    flagsArray.forEach(flag =>{
    
        switch (flag){

            case 'DISCORD_EMPLOYEE':
                flag_emojis.push('<:Discordstaff:868239676765524055>')
                break;
            case 'PARTNERED_SERVER_OWNER':
                flag_emojis.push('<:New_partner_badge:868239677222682694>')
                break;
            case 'HYPESQUAD_EVENTS':
                flag_emojis.push('<:hypesquad:868260206172319765>')
                break;
            case 'BUGHUNTER_LEVEL_1':
                flag_emojis.push('<:Bug_hunter_badge:868239677256237106>')
                break;
            case 'HOUSE_BRAVERY':
                flag_emojis.push('<:Hypesquad_bravery_badge:868239677075890206>')
                break;
            case 'HOUSE_BRILLIANCE':
                flag_emojis.push('<:Hypesquad_brilliance_badge:868239677373681674>')
                break;
            case 'HOUSE_BALANCE':
                flag_emojis.push('<:Hypesquad_balance_badge:868239677096865892>')
                break;
            case 'EARLY_SUPPORTER':
                flag_emojis.push('<:Early_supporter_badge:868239677268844544>')
                break;
            case 'TEAM_USER':
                flag_emojis.push('<:Bug_hunter_badge:868239677256237106>')
                break;
            case 'SYSTEM':
                flag_emojis.push('<:Bug_hunter_badge:868239677256237106>')
                break;
            case 'BUGHUNTER_LEVEL_2':
                flag_emojis.push('<:Bug_buster_badge:868239677214298133>')
                break;
            case 'VERIFIED_BOT':
                flag_emojis.push('<:Verified_developer_badge:868239676887146497>')
                break;
            case 'EARLY_VERIFIED_BOT_DEVELOPER':
                flag_emojis.push('<:Verified_developer_badge:868239676887146497>')
                break;
        }
    })
    return flag_emojis
}


function format_date_created(date){
    try {
        let date_formated = []

        
        if(date.getMinutes()) date_formated.push(date.getMinutes()+`m `)
        if(date.getHours()) date_formated.push(date.getHours()+ `h `)
        if(date.getDay()) date_formated.push(date.getDay()+ `${(!(date.getDay() == 1)) ? " dias " : " dia "}`)
        if(date.getMonth()) date_formated.push(date.getMonth()+ `${(!(date.getMonth() == 1)) ? " meses " : " mês "}`)
        if(date.getFullYear() - 1970) date_formated.push(date.getFullYear()- 1970+`${(!(date.getFullYear()- 1970 == 1)) ? " anos " : " ano "}`)  
    
        return date_formated.reverse().join('');
    } catch (error) {
        logger.error(error)
    }
}

function format_date(date){
    try {
        let date_formated = []


        if(date.getMinutes()) date_formated.push(date.getMinutes()+`m `)
        if(date.getHours()) date_formated.push(date.getHours() + `h `)
        if(date.getFullYear()) date_formated.push(date.getFullYear()+", as ")
        if(date.getMonth()+1) date_formated.push(date.getMonth()+1+ "/")
        if(date.getDay()) date_formated.push(date.getDay()+ "/")
    
    
        return date_formated.reverse().join('');
    } catch (error) {
        logger.error(error)
    }
}

async function xp_info(id) {
    try {
        let xp = await get_xp(id)

        if (xp.chat){
            let xpChatBar = ""
            
            for ( let i =0 ; xp.chat.percentage*10>=i ; i++){
                xpChatBar += "<:redBar:891790337578782731>"
            }
            //Adds 28 to index => redbarEmoji == 28 characteres
            for (let i = xpChatBar.length; 308>i; i= i+28){
                xpChatBar += "<:blackbar:891790337809449021>"
            }
            xp.chat.xpChatBar = xpChatBar
        }

        if (xp.global){
            let xpGlobalBar = ""
            
            for ( let i =0 ; xp.global.percentage*10>=i ; i++){
                xpGlobalBar += "<:redBar:891790337578782731>"
            }
            //Adds 28 to index => redbarEmoji == 28 characteres
            for (let i = xpGlobalBar.length; 308>i; i= i+28){
                xpGlobalBar += "<:blackbar:891790337809449021>"
            }
            xp.global.xpGlobalBar = xpGlobalBar
        }

        if (xp.voice){
            let xpVoiceBar = ""
            for ( let i = 0 ; xp.voice.percentage*10>=i ; i++){
                xpVoiceBar += "<:redBar:891790337578782731>"
            }
            for (let i = xpVoiceBar.length; 308>i; i = i+28){
                xpVoiceBar += "<:blackbar:891790337809449021>‎"
            }
            xp.voice.time = (parseInt(( ( ( xp.voice.total / config.xp.voice ) * 300000 ) / 3600000)*10))/10
            xp.voice.xpVoiceBar = xpVoiceBar
        }
        if (xp.bonus){
            let xpBonusBar = ""
            for ( let i = 0 ; xp.bonus.percentage*10>=i ; i++){
                xpBonusBar += "<:redBar:891790337578782731>"
            }
            for (let i = xpBonusBar.length; 308>i; i = i+28){
                xpBonusBar += "<:blackbar:891790337809449021>‎"
            }
            xp.bonus.time = (parseInt(( ( ( xp.bonus.total / config.xp.voice ) * 300000 ) / 3600000)*10))/10
            xp.bonus.xpBonusBar = xpBonusBar
        }
        
        return xp

    } catch (error) {
        logger.error(error)
    }

    
}