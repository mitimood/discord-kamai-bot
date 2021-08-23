const { Discord } = require('../..');
const config = require('../../config');
const { TrimMsg } = require('../../funções/funções');
const { get_xp } = require('../../mongodb')

/*
    Say some informations about a specific member
    - When the accontou was created
    - How much time since the account was created
    - When the account joined the guild
    - How much time since the account joined in the guild
*/

module.exports={
    name: "info",
    aliases: ["userinfo","profile"],
    description: "informa alguns dados do usuário",

    async execute(msg){
        const embed = new Discord.MessageEmbed()
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
            var member = await msg.guild.members.fetch({user:userid, force: false})
        }catch{
            return msg.channel.send(msg.author.toString() + " Usuario desconhecido")
        }
        embed.setColor(config.color.blurple)
        var flags = null
        if(!member) member = msg.member
        if(member.user.flags){
            flags = separate_flags(member.user.flags.toArray())
        }
        embed.setTitle((flags ? flags.join("") : "") + member.user.username )
        


        embed.setThumbnail(member.user.displayAvatarURL())
        embed.setFooter(`id: ${member.id}`)

        let date = new Date(Date.now() - member.joinedAt )
        let date_duration = new Date(Date.now() - new Date(member.user.createdTimestamp))

        let joined_duration = format_date_created(date)
        let joined_since = format_date(member.joinedAt )
        let created_since = format_date(new Date(member.user.createdTimestamp))
        let created_duration = format_date_created(date_duration)

        embed.addField('🛎Entrada:', joined_since + `(${joined_duration})`, true)
        embed.addField('🚪Criada em:', created_since + `(${created_duration})`, true)

        let joined_duration_month = parseInt(date.getTime() / 2592000000)
        let badges = badge(joined_duration_month)
        if(badges){
            embed.addField('⭐Badges', badges, true)
        }
        embed.addField('💰Kamaicoins', "0.00", false)

        let xp = await xp_info(userid)
        embed.setDescription(`**Chat lvl**: ${xp.chat ? xp.chat.level : 0 }
        ${xp.chat ? xp.chat.xpChatBar : "<‏‏‎          >"} ${xp.chat ? parseInt(xp.chat.percentage * 100) : "0"}%
        
        **Voz lvl**: ${xp.voice ? xp.voice.level : 0 } 
        ${xp.voice ? `(${xp.voice.time.getHours()+ "h" + xp.voice.time.getMinutes()+"m"})` : ""} 
        ${xp.voice ? xp.voice.xpVoiceBar : "<‎‎‎‎‎‎‎‏‏‎          ‎>"} ${xp.voice ? parseInt(xp.voice.percentage * 100) : "0"}%`)

        msg.channel.send({content: msg.author.toString(),embeds:[embed]})

    }
}

function badge(duration){
    let badges = []

    if(duration>2)badges.push(`<:cabelo_arcoiris:868301567646896198>`)
    if(duration>4)badges.push(`<:kamaitachi_chifrinho:868302636422684734>`)
    if(duration>6)badges.push(`<:Juliet:868301567860801586>`)
    if(duration>8)badges.push(`<:Pendurado:868301567827271680>`)
    if(duration>10)badges.push(`<:Homemtorto:868301568833904650>`)
    if(duration>12)badges.push(`<:jhonny:868301567890161685>`)

    badges=badges.join("")
    return badges;
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
    
    let date_formated = []

        
    if(date.getMinutes()) date_formated.push(date.getMinutes()+`m `)
    if(date.getHours()) date_formated.push(date.getHours()+ `h `)
    if(date.getDay()) date_formated.push(date.getDay()+ `${(!(date.getDay() == 1)) ? " dias " : " dia "}`)
    if(date.getMonth()) date_formated.push(date.getMonth()+ `${(!(date.getMonth() == 1)) ? " meses " : " mês "}`)
    if(date.getFullYear() - 1970) date_formated.push(date.getFullYear()- 1970+`${(!(date.getFullYear()- 1970 == 1)) ? " anos " : " ano "}`)  

    return date_formated.reverse().join('');
}

function format_date(date){
    
    let date_formated = []


    if(date.getMinutes()) date_formated.push(date.getMinutes()+`m `)
    if(date.getHours()) date_formated.push(date.getHours() + `h `)
    if(date.getFullYear()) date_formated.push(date.getFullYear()+", as ")
    if(date.getMonth()+1) date_formated.push(date.getMonth()+1+ "/")
    if(date.getDay()) date_formated.push(date.getDay()+ "/")


    return date_formated.reverse().join('');
}

async function xp_info(id) {

    let xp = await get_xp(id)


    if (xp.chat){
        let xpChatBar = "<"

        for ( let i =0 ; xp.chat.percentage*10>=i ; i++){
            xpChatBar += "="
        }
        for (let i = xpChatBar.length; 13>i; i++){
            xpChatBar += " "
        }
        xpChatBar += ">"
        xp.chat.xpChatBar = xpChatBar
    }

    if (xp.voice){
        let xpVoiceBar = "<"
        for ( let i =0 ; xp.voice.percentage*10>=i ; i++){
            xpVoiceBar += "="
        }
        for (let i = xpVoiceBar.length; 13>i; i++){
            xpVoiceBar += " ‎"
        }
        xpVoiceBar += ">"
        xp.voice.time = new Date(xp.voice.total * 300000)
        xp.voice.xpVoiceBar = xpVoiceBar

    }
    return xp
}