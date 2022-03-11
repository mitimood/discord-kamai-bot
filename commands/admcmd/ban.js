const config = require("../../config");
const { client } = require(`../../index`)
const { SlashCommandBuilder } = require('@discordjs/builders');
const logger = require("../../utils/logger");
const { MessageEmbed } = require("discord.js");

/* 
This should be a module that contains a function that performs the banishment of a user
First of all it will set every word/id in a array
than the ids will be sorted as users, members, non users
all the members and users will be banneds from the guild that the message was sent, but before that
the bot will try to send a message on pv, that contains the ban reason, the mod that sent the command
and an single use invite, that they can use for applyng for unban.


usage => ban id id id id id id
*/

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('bane bobinhos')
    .addStringOption(option => option.setName('motivo-banimento').setDescription('Define o motivo de banimento').setRequired(true)
                                .addChoices([
                                            ['flood/spam', '1'],
                                            ['divulgação-inadequada', '2'],
                                            ['off topic/mensagem fora de tópico', '3'],
                                            ['menção desnecessária de membros e cargos', '4'],
                                            ['Provocação e brigas', '5'],
                                            ['Poluição sonora', '6'],
                                            ['Atrapalhar o andamento do Karaokê', '7'],
                                            ['Denúncias falsas', '8'],
                                            ['Linguagem discriminatória', '9'],
                                            ['Exposição de membros/ Assédio', '10'],
                                            ['Preconceito, discriminação, difamação e/ou desrespeito', '11'],
                                            ['Planejar ou exercer raids no servidor', '12'],
                                            ['NSFW/ (+18)', '13'],
                                            ['Estimular ou praticar atividades ilegais ou que cause banimento de membros', '14'],
                                            ['Evasão de punição', '15'],
                                            ['Conteúdos graficamente chocantes', '16'],
                                            ['Quebra do ToS do Discord', '17'],
                                            ['Selfbot', '18'],
                                            ['Scam', '19']
                                        ])
                    )
    .addStringOption(option=> option.setName('contas-a-banir').setDescription('Joga ai os usuários pra rolo').setRequired(true))
    .setDefaultPermission(false),
    name: "ban",
    aliases: ["bn"],
    description: "bane os membros",
    permissions: [
        {
            id: config.roles.staff.admin,
            type: 'ROLE',
            permission: true,
        },
    ],

    async execute(msg) {

        try {

            if(msg.type != "APPLICATION_COMMAND") return
        
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

            const options = msg.options._hoistedOptions

            let modLogChannel = await client.channels.fetch(config.channels.modlog)

            const reason = getReason(options[0].value)

            const ids = options[1].value.split(/\n| /gm).filter((str) => str.trim())

            const accs = await verificaArgsUser(ids)

            for(const memb of accs.members){
                try {
                    let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({unique:true,reason:"ban invite",maxUses:1, maxAge:604800})
    
                    await memb.send(`Aplicado por(${msg.user.id} [${msg.user.toString()}])\n\nVocê foi banido de KAMAITACHI, por: `+reason+ `\nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)
            
                } catch (error) {
                }
            }
            

            for(const user of accs.users){
                try {
                    if(reason == "Scam") {
    
                        await msg.guild.members.ban(user, {reason: `[${user.id}] ${reason}`, days:2})
                    
                    }else{
                        await msg.guild.members.ban(user, {reason: `[${user.id}] ${reason}`})
    
                    }
    
                } catch (error) {
                    logger.error(error)
                }
            }
    
            let embeds2 = []
    
            for(const [i,user] of accs.users.entries()){
                try {
                    const emb = new MessageEmbed()
                                .setThumbnail(user.avatarURL())
                                .setTitle(user.tag)
                                .setDescription(`Banido por: ${msg.user.toString()}, aprovado por: ${msg.user.toString()} \n Motivo: \`${reason}\``)
                                .setColor(config.color.red)
                                .setFooter({text:`id: ${user.id}`})
                
                    if(embeds2.length < 10 ){
                        embeds2.push(emb)
    
                    }else if (embeds2.length == 10){
                        await modLogChannel.send({embeds:embeds2})
                        embeds2 = []
                        embeds2.push(emb)
    
                    }
                    
                    if(i+1 == accs.users.length){
                        await modLogChannel.send({embeds:embeds2})
    
                    }
    
                } catch (error) {
                    logger.error(error)
                }
    
            }
    
    
            try {
                await msg.followUp({ content:`\`Contas a banir:\`
                ${accs.members ? `Dentro do servidor: **${accs.members.length}**` : ""}
                ${accs.users ? `Usuarios validos: **${accs.users.length}**` : ""}
                ${accs.invalids ? `Usuários invalidos: **${accs.invalids.length}**` : ""} `, ephemeral:true})
            } catch (error) {
                logger.error(error)
            }
    
                    
    
            async function verificaArgsUser(msgArgs, dontVerifyRole = false){
                let members = []
                let invalids = []
                let users = []
    
                for(let arg of msgArgs){
                    arg = arg.replace(/\<|\>|\@|\!|\&/g, "")
    
                    if(arg.match(/^[0-9]+$/) && toString(Date.now().valueOf()) >= arg){
                    try {
                        let user = await msg.client.users.fetch(arg)
                        try {
                            let memb = await msg.guild.members.fetch(arg)
                            if(memb.roles.highest.position < msg.member.roles.highest.position || dontVerifyRole){
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

        } catch (error) {
            logger.error(error)
        }
        
        

    

        // let ids = [];
        // let msgArgs = TrimMsg(msg)

        // for (let i = 1, z = -1; /^<[@][!&]?[0-9]+>$/.test(msgArgs[i]) || /[0-9]+/.test(msgArgs[i]); i++, z++) {

        //     ids.push(msgArgs[i])
        // }

        // let result = await VerificId(ids, msg.guild);


        // if (result.members[0] === undefined && result.users[0] === undefined && result.noUser[0] != undefined) return msg.channel.send(`Todo os usuários são invalidos`)

        // if (result.members[0] === undefined && result.users[0] === undefined && result.noUser[0] === undefined) return msg.channel.send(`Nenhum id passado`)

        // if(result.members){
        //     for(member of result.members){
        //         if(member.roles.highest.position >= msg.member.roles.highest.position){
        //             return msg.channel.send({content:  `${msg.author.toString()}\nVocê não pode banir alguem com o mesmo cargo que você, ou a cima! ${member.user.tag}`} )
        //         }
        //     }
        // }

        // msg.channel.send({
        //     embeds: [{
        //         title: `Qual regra o infrator quebrou? Você tem 30s`,
        //         description: `**INFRAÇÕES QUE RESULTAM EM ADVERTÊNCIAS:**
        //     1- Flood/spam.
        //     2- Divulgação inadequada.
        //     3- Off topic/mensagem fora de tópico.
        //     4- Menção desnecessária de membros e cargos.
        //     5- Provocação e brigas.
        //     6- Poluição sonora
        //     7- Atrapalhar o andamento do Karaokê.
        //     8- Denúncias falsas 
        //     9- Linguagem discriminatória
            
        //     **INFRAÇÕES QUE RESULTAM EM BANIMENTO:**
        //     10- Exposição de membros/ Assédio 
        //     11- Preconceito, discriminação, difamação e/ou desrespeito.
        //     12- Planejar ou exercer raids no servidor.
        //     13- NSFW/ (+18).
        //     14- Estimular ou praticar atividades ilegais ou que cause banimento de membros.
        //     15- Evasão de punição.
        //     16- Conteúdos graficamente chocantes.
        //     17- Quebra do ToS do Discord. (https://discordapp.com/terms)
        //     18- Selfbot
        //     19- Scam`,
        //         color: config.color.red
        //     }]
        // })

        // msg.channel.send({
        //     embeds: [{
        //         title: `**Membros a banir**`,
        //         description: `Dentro do servidor: ${((result)).members.length}\nFora do servidor: ${result.users.length}\nInvalidos: ${result.noUser.length}`
        //     }]
        // })
        // const filter = (m) => /[0-9]+/.test(m.content) && m.content <= 19 && m.author.id == msg.author.id;
        // msg.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['Time up'] }).catch(m => { return msg.channel.send(`O tempo expirou`) }).then(async (collected) => {
        //     var reason = ``
        //     if (!collected.first()) return
        //     switch (collected.first().content) {

        //         case `1`:
        //             reason = `Flood/spam`;
        //             break;
        //         case `2`:
        //             reason = `Divulgação inadequada`;
        //             break;
        //         case `3`:
        //             reason = `Off topic/mensagem fora de tópico.`;
        //             break;
        //         case `4`:
        //             reason = `Menção desnecessária de membros e cargos`;
        //             break;
        //         case `5`:
        //             reason = `Provocação e brigas`;
        //             break;
        //         case `6`:
        //             reason = `Poluição sonora`;
        //             break;
        //         case `7`:
        //             reason = `Atrapalhar o andamento do Karaokê`;
        //             break;
        //         case `8`:
        //             reason = `Denúncias falsas`;
        //             break;
        //         case `9`:
        //             reason = `Linguagem discriminatória`;
        //             break;
        //         case `10`:
        //             reason = `Exposição de membros/ Assédio`;
        //             break;
        //         case `11`:
        //             reason = `Preconceito, discriminação, difamação e/ou desrespeito`;
        //             break;
        //         case `12`:
        //             reason = `Planejar ou exercer raids no servidor`;
        //             break;
        //         case `13`:
        //             reason = `NSFW/ (+18)`;
        //             break;
        //         case `14`:
        //             reason = `Estimular ou praticar atividades ilegais ou que cause banimento de membros`;
        //             break;
        //         case `15`:
        //             reason = `Evasão de punição`;
        //             break;
        //         case `16`:
        //             reason = `Conteúdos graficamente chocantes`;
        //             break;
        //         case `17`:
        //             reason = `Quebra do ToS do Discord`;
        //             break;
        //         case `18`:
        //             reason = `Selfbot`;
        //             break;
        //         case `19`:
        //             reason = `Scam`;
        //             break;
        //     }


        //     for (let i = 0; i < result.members.length || i < result.users.length; i++) {

        //         if (result.members[i] != undefined) {
        //             try {
        //                 let invite = await client.channels.cache.get(config.ban_recover.log_chnnl).createInvite({ unique: true, reason: "ban invite", maxUses: 1, maxAge: 604800 })

        //                 await result.members[i].user.send(`Aplicado por(${msg.author.tag}-----${msg.author.id})\n\nVocê foi banido de KAMAITACHI, por: ` + reason + `\nCaso queira recorrer ao seu ban, entre no servidor ${invite.url}`)
        //             } catch {

        //             } finally {
        //                 let prune_days = 0
        //                 if (reason == "Scam") prune_days = 1
        //                 await Banning(result.members[i].user.id, `[${msg.author.id}] ` + reason, msg.guild, prune_days)
        //             }
        //         }
        //         if (result.users[i] != undefined) await Banning(result.users[i].id, `[${msg.author.id}] ` + reason, msg.guild);

        //     }

        //     const ChannelLog = client.channels.cache.get(config.channels.modlog);
        //     const ModloguMem = new Discord.MessageEmbed().setAuthor(`Kamaitachi ban`, `https://images.genius.com/93a16c1f0873bdfdfaac3b0b6e23f680.300x300x1.jpg`).setColor(config.color.red)
        //     const ModloguUser = new Discord.MessageEmbed().setAuthor(`Kamaitachi ban`, `https://images.genius.com/93a16c1f0873bdfdfaac3b0b6e23f680.300x300x1.jpg`).setColor(config.color.red)
            
        //     const banRegTimestamp = Date.now()  

        //     if (result.members[0] != undefined) {
        //         ModloguMem.setTitle(msg.author.username)

                
        //         for (let answer = `**Membros banidos**`, i = 0; result.members.length > i; i++) {
        //             // register the selfbot information on the databese
        //             if (reason == "Selfbot") {
        //                 let user = result.members[i].user
        //                 selfbotRegister.selfbotAdd(banRegTimestamp, user.avatar, user.id, user.tag, user.createdTimestamp, result.members[i].joinedTimestamp)
        //             }

        //             if (ModloguMem.fields.length == 25) {

        //                 ChannelLog.send({ embeds: [ModloguMem] });
        //                 ModloguMem.spliceFields(0, 25)
        //             }
        //             if (answer.length > 1800) {

        //                 await msg.channel.send(answer);
        //                 answer = ``;
        //             }
        //             ModloguMem.addField(reason, result.members[i].user.tag + `  ` + result.members[i].user.id)
        //             answer = answer.concat("\n" + result.members[i].user.tag + " " + result.members[i].user.id)

        //             if (result.members.length == i + 1) {

        //                 ChannelLog.send({ embeds: [ModloguMem] });
        //                 msg.channel.send(answer)
        //             }
        //         }
        //     }

        //     if (result.users[0] != undefined) {

        //         ModloguUser.setTitle(msg.author.username)

        //         for (let answer = `**Usuários fora do servidor banidos**`, i = 0; result.users.length > i; i++) {
        //             if (reason == "Selfbot") {
        //                 let user = result.users[i]
        //                 selfbotRegister.selfbotAdd( banRegTimestamp, user.avatar, user.id, user.tag, user.createdTimestamp, null)
        //             }

        //             if (ModloguUser.fields.length == 25) {

        //                 ChannelLog.send({ embeds: [ModloguUser] });
        //                 ModloguUser.spliceFields(0, 25)
        //             }
        //             if (answer.length > 1800) {
        //                 await msg.channel.send(answer);
        //                 answer = ``;
        //             }
        //             ModloguUser.addField(reason, result.users[i].tag + `  ` + result.users[i].id)
        //             answer = answer.concat("\n" + result.users[i].tag + " " + result.users[i].id)
        //             if (result.users.length == i + 1) {
        //                 ChannelLog.send({ embeds: [ModloguUser] });
        //                 msg.channel.send(answer)
        //             }

        //         }
        //     }
        //     if (result.noUser[0] != undefined) {

        //         for (let answer = `**Não são usuarios**`, i = 0; result.noUser.length > i; i++) {
        //             if (answer.length > 1800) {
        //                 await msg.channel.send(answer);
        //                 answer = ``;
        //             }
        //             answer = answer.concat("\n" + result.noUser[i] + " " + reason)
        //             if (result.noUser.length == i + 1) msg.channel.send(answer)
        //         }
        //     }
        // })
    }
}