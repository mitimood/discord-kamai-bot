const config = require("../config");
const db = require("../db2");
const { TrimMsg, VerificId, Banning } = require("../eventos/funções");
const { running, client, Discord } = require(`../index`)
const fs = require(`fs`)

module.exports={ban}

async function ban(msg){

    let ids = [];
    let msgArgs=TrimMsg(msg)

    for(let i = 1,z = -1; /^<[@][!&]?[0-9]+>$/.test(msgArgs[i]) || /[0-9]+/.test(msgArgs[i]);i++,z++ ){
        
          ids.push(msgArgs[i])
    }

    let result = VerificId(ids,msg.guild);


    if((await result).members[0] === undefined && (await result).users[0] === undefined && (await result).noUser[0] != undefined)return msg.channel.send(`Todo os usuários são invalidos`)
    
    if((await result).members[0] === undefined && (await result).users[0] === undefined && (await result).noUser[0] === undefined)return msg.channel.send(`Nenhum id passado`)

    
    msg.channel.send({embed:{
        title:`Qual regra o infrator quebrou? Vocêm tem 30s`,
        description:`**INFRAÇÕES QUE RESULTAM EM ADVERTÊNCIAS:**
        \n1- Flood/spam.
        \n2- Divulgação inadequada.
        \n3- Utilização de comandos de bots fora do #👾・comandos 
        \n4- Menção desnecessária de membros e cargos.
        \n5- Provocação e brigas.
        \n6- Poluição sonora (qualquer tipo de ruído que possa causar desconforto aos membros)
        \n7- Atrapalhar o andamento do Karaokê.
        \n8- Denúncias falsas 
        \n9- Linguagem discriminatória
        \n
        \n**INFRAÇÕES QUE RESULTAM EM BANIMENTO:**
        \n10- Exposição de membros/ Assédio 
        \n11- Preconceito, discriminação, difamação e/ou desrespeito.
        \n12- Planejar ou exercer raids no servidor.
        \n13- NSFW/ (+18).
        \n14- Estimular ou praticar atividades ilegais ou que cause banimento de membros.
        \n15- Evasão de punição.
        \n16- Conteúdos graficamente chocantes.
        \n17- Quebra do ToS do Discord. (https://discordapp.com/terms)
        \n18- Selfbot`
    }})

    msg.channel.send({embed:{
        title:`**Membros a banir**`,
        description:`Dentro do servidor: ${(await (result)).members.length}\nFora do servidor: ${(await result).users.length}\nInvalidos: ${(await result).noUser.length}`}})
    const filter = (m)=> /[0-9]+/.test(m.content)&&m.content<=18 && m.author.id == msg.author.id;
    msg.channel.awaitMessages(filter,{max:1,time:30000, errors:['Time up']}).catch(m=>{return msg.channel.send(`O tempo expirou`)}).then(async(collected)=>{
        var reason = ``
        switch (collected.first().content){

        case `1`:
            reason = `Flood/spam`;
            break;

        case `2`:
            reason = `Divulgação inadequada`;
            break;
        
        case `3`:
            reason = `Utilização de comandos de bots fora do <#612121513960669227>`;
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
        }


        for(let i=0;i<(await result).members.length || i < (await result).users.length; i++){    

            if((await result).members[i]!=undefined){
                (await result).members[i].user.send(`Você foi banido de KAMAITACHI, por: `+reason).catch(e=>console.log(e))
                await Banning((await result).members[i].user.id, `[${msg.author.id}] `+reason, msg.guild)};

            if((await result).users[i]!=undefined)await Banning((await result).users[i].id, `[${msg.author.id}] `+reason, msg.guild);

        }

        const ChannelLog = client.channels.cache.get(config.channels.modlog);
        const ModloguMem = new Discord.MessageEmbed().setAuthor(`Kamaitachi ban`,`https://images.genius.com/93a16c1f0873bdfdfaac3b0b6e23f680.300x300x1.jpg`).setColor(`PURPLE`)
        const ModloguUser = new Discord.MessageEmbed().setAuthor(`Kamaitachi ban`,`https://images.genius.com/93a16c1f0873bdfdfaac3b0b6e23f680.300x300x1.jpg`).setColor(`PURPLE`)

        if((await result).members[0]!=undefined){
            ModloguMem.setTitle(msg.author.username)

            for(let answer=`**Membros banidos**`,i= 0;(await result).members.length>i ;i++){
                if(reason=="Selfbot"){
                    fs.writeFile('./selfbotid.txt',"\n " +(await result).members[i].user.id, { flag: 'a' }, err => {})
                }

                if(ModloguMem.fields.length==25){

                    ChannelLog.send(ModloguMem);
                    ModloguMem.spliceFields(0,25)
                }
                if(answer.length>1800){

                await msg.channel.send(answer);
                    answer = ``;
                }
                ModloguMem.addField(reason,(await result).members[i].user.tag+`  `+(await result).members[i].user.id)
                answer=answer.concat("\n"+(await result).members[i].user.tag+" "+(await result).members[i].user.id)

                if((await result).members.length==i+1){

                    ChannelLog.send(ModloguMem);                    
                    msg.channel.send(answer)
                }
            }
        }

        if((await result).users[0]!=undefined){

            ModloguUser.setTitle(msg.author.username)
            
            for(let answer=`**Usuários fora do servidor banidos**`,i= 0; (await result).users.length>i ;i++){
                if(reason=="Selfbot"){
                    fs.writeFile('./selfbotid.txt',"\n " +(await result).users[i].id, { flag: 'a' }, err => {})
                }

                if(ModloguUser.fields.length==25){
                    
                    ChannelLog.send(ModloguUser);   
                    ModloguUser.spliceFields(0,25)
                }
                if(answer.length>1800){
                    await msg.channel.send(answer);
                    answer = ``;
                }
                ModloguUser.addField(reason,(await result).users[i].tag+`  `+(await result).users[i].id)
                answer=answer.concat("\n"+(await result).users[i].tag+" "+(await result).users[i].id)
                if((await result).users.length==i+1){
                    ChannelLog.send(ModloguUser);
                    msg.channel.send(answer)}

            }
        }
        if((await result).noUser[0]!=undefined){

            for(let answer=`**Não são usuarios**`,i= 0; (await result).noUser.length>i ;i++){
                if(answer.length>1800){
                await msg.channel.send(answer);
                    answer = ``;
                }
                answer=answer.concat("\n"+(await result).noUser[i]+" "+reason)
                if((await result).noUser.length==i+1)msg.channel.send(answer)

            }

        }


    })


    
    
};

