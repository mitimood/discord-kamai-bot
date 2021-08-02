const index  = require("../index");
const config = require("../config")

    
    index.client.on("message", msg =>{
        if(!msg.author.bot && msg.guild){
            if(msg.content.startsWith(config.prefixo)){
              let comando =  msg.content.toLowerCase().split(" ")[0].substr(config.prefixo.length)
                let args = msg.content.toLowerCase().split(" ");
                
                if (msg.member.roles.cache.has(config.roles.admin)|| msg.member.roles.cache.has(config.ban_recover.staff_adm) || msg.member.roles.cache.has(config.ban_recover.staff_mod) ){
                    console.log(`[${msg.member.user.username}] `+ comando)
                    switch(comando){
                        case "ban":
                            let ban = require("../admcmd/ban");
                            ban.ban(msg);
                            break;
                        case "say":
                            let say = require("../admcmd/say");
                                say.say(msg);
                                break;
                        case "edit":
                            let edit = require("../admcmd/edit");
                                edit.edit(msg);
                                break;
                        case "unban":
                            let unban = require("../admcmd/unban");
                                unban.unban(msg);
                                break;
                        case "conteudo":
                            let conteudo = require("../admcmd/conteudo");
                                conteudo.conteudo(msg);
                                break;
                        case "artesatv":
                            let art = require("../admcmd/artesatv");
                                art.art(msg);
                                break;
                        case "warn":
                            let warn = require("../admcmd/warn");
                                warn.warn(msg);
                                break;
                        case "list":
                            let list = require("../admcmd/list");
                                list.list(msg);
                                break;
                        case "remove":
                            let remove = require("../admcmd/remove");
                                remove.remove(msg);
                                break;

                    }
                }
                if(msg.member.roles.cache.has(config.roles.mod)||msg.member.roles.cache.has(config.roles.admin)){
                    
                        switch(comando){
                            case "kick":
                                let kick = require(`../modcmd/kick`);
                                kick.kick(msg);
                                break;
                            case "tempmute":
                                let tempmute = require(`../modcmd/tempmute`);
                                tempmute.tempmute(msg)
                                break;
                            case "unmute":
                                let unmute = require(`../modcmd/unmute`);
                                unmute.unmute(msg)
                                break;
                                
                        }
                    }
                if(msg.member.roles.cache.has(config.roles.staff_call)||msg.member.roles.cache.has(config.roles.admin)||msg.member.roles.cache.has(config.roles.mod)){

                    switch(comando){
                        case "abrir":
                            let abrir = require(`../staffcmd/open_abaddon`);
                            abrir.open_abbadon(msg)
                            break;
                        case "fechar":
                            let fechar = require(`../staffcmd/close_abaddon`);
                            fechar.close_abaddon(msg)
                            break;
                    }
                }
                if ((msg.member.roles.cache.has(config.roles.mod)||msg.member.roles.cache.has(config.roles.admin)||msg.member.roles.cache.has(config.roles.capkaraoke)||msg.member.roles.cache.has(config.roles.capArte)||msg.member.roles.cache.has(config.roles.capEvent)||msg.member.roles.cache.has(config.roles.capPoems))){
                    switch(comando){
                        case "emb":
                            let cemb = require(`../capcmd/embed`);
                            cemb.emb(msg);
                            break;
                        case "publi":
                            let send = require(`../capcmd/say`);
                            send.send(msg);
                            break;
                        case "reward":
                            let reward = require(`../capcmd/trophie_add`);
                            reward.addtrophie(msg);
                            break;
                        case "rewardrmv":
                            let rewardrmv = require(`../capcmd/trophie_rmv`);
                            rewardrmv.rmvtrophie(msg);
                            break;
                    }
                }
                           switch(comando){
                                case "ping":
                                    let ping = require(`../commandpub/ping`)
                                        ping.ping(msg);
                                        break;
                                case "info":
                                    let info = require(`../commandpub/info`)
                                    info.info(msg)
                                    break; 
            
                                case "help":
                
                                    switch(args[1]){
                                        case "adm":
                                            msg.channel.send({embed:
                                            {
                                                title:"Comandos adm: () obrigatório, {} opcional",
                                                color: config.color.blurple,
                                                fields:[
                                                    {
                                                        name:`BAN, bane os membros utilize:`,
                                                        value:`ban (id) {id} {id} {id} {motivo}`,
                                                    },
                                                    {
                                                        name:`UNBAN, desbane um usuario:`,
                                                        value:`unban (id do usuario)`,
                                                    },
                                                    {
                                                        name:`KICK, expulsa o membro:`,
                                                        value:`kick (id) {id} {id} {id} {motivo}`,
                                                    },
                                                    {
                                                        name:`SAY, o bot envia uma mensagem no canal desejado:`,
                                                        value:`say {id do canal} (mensagem)`,
                                                    },
                                                    {
                                                        name:`CONTEUDO, pega o conteudo de uma mensagem e envia abaixo:`,
                                                        value:`conteudo (id da mensagem)`,
                                                    },
                                                    {
                                                        name:`EDIT, edita o conteudo de uma mensage enviada pelo bot:`,
                                                        value:`edit (id do canal) (id da mensagem) (nova mensagem)`,
                                                    },
                                                    {
                                                        name:`WARN, adiciona uma advertência ao membro:`,
                                                        value:`warn (id do membro) (quantidade de novas advs) (Motivo da(s) adv)`
                                                    },
                                                    {
                                                        name:`LIST, lista as advertencias de um usuário:`,
                                                        value:`list (id do usuário)`,
                                                    },
                                                    {
                                                        name:`REMOVE, remove a advertência de um usuário:`,
                                                        value:`remove (id) {numero da advertencia}`,
                                                    },
                                                    {
                                                        name:`PING, informa o tempo de resposta do bot:`,
                                                        value:`ping`,
                                                    },
                    
                    
                                                ]
                                            }})
                                            break;
                                        case `mod`:
                                            msg.channel.send({embed:{
                                                color: config.color.blurple,
                                                title: `Comandos mod: () obrigatório, {} opcional`,
                                                fields:
                                                    [
                                                        {
                                                            name:`KICK, expulsa o membro:`,
                                                            value:`kick (id) {id} {id} {id} {motivo}`,
                                                        },
                                                        {
                                                            name:`PING, informa o tempo de resposta do bot:`,
                                                            value:`ping`,
                                                        },
                                                        {
                                                            name:`TEMPMUTE, silencia temporariamente um membro`,
                                                            value:`tempmute (id) (tempo) {motivo}`
                                                        },
                                                        {
                                                            name:`UNMUTE, desmuta o membro previamente mutado`,
                                                            value:`unmute (id)`
                                                        }
                                                    ]
                                                }})
                                                break;
                                        case `geral`:
                                            msg.channel.send({embed:{
                                                color: config.color.blurple,
                                                title: `Comandos mod: () obrigatório, {} opcional`,
                                                fields:
                                                    [
                                                        {
                                                            name:`PING, informa o tempo de resposta do bot:`,
                                                            value:`ping`,
                                                        },
                                                        {
                                                            name:`INFO, informa alguns dados basicos do usuário`,
                                                            value:`info (membro)`
                                                        }
                                                    ]
                                                }})
                                                break;
                                        case `cap`:
                                            msg.channel.send({embed:{
                                                color: config.color.blurple,
                                                title: `Comandos mod: () obrigatório, {} opcional`,
                                                fields:
                                                [
                                                    {
                                                        name:`PUBLI, o bot publica uma mensagem no canal desejado:`,
                                                        value:`publi {id do canal} (mensagem)`,
                                                    },
                                                    {
                                                        name:`REWARD, adiciona o cargo de trofeu no membro:`,
                                                        value:`reward (membro)`,
                                                    },
                                                    {
                                                        name:`REWARDRMV, remove o cargo de trofeu no membro:`,
                                                        value:`rewardrmv (membro)`,
                                                    },
                                                    {
                                                        name:`PING, informa o tempo de resposta do bot:`,
                                                        value:`ping`,
                                                    },
                                                ]
                                            }})
                                            break;
                                        case `embed`:
                                            msg.channel.send({embed:{
                                                color: config.color.blurple,
                                                title:`Utilize o comando emb e siga os passos 😎`,
                                                description:`Exemplo de como são os campos de um embed`,
                                                image:{url: `https://gblobscdn.gitbook.com/assets%2F-LAEeOAJ8-CJPfZkGKqI%2F-Lh-d6Qc42Rq3BmspE9l%2F-LAEmPBF47FJgnfBD21P%2Fembedexample2.png?alt=media`}
                                            }})
                                            
                                            break;
                                        default:
                                            msg.channel.send({embed:{
                                                color:config.color.blurple,
                                                fields:[
                                                {
                                                    name: 'ADM',
                                                    value: 'help adm',
                                                    
                                                },
                                                {
                                                    name:`MOD`,
                                                    value:`help mod`,
                                                },
                                                {
                                                    name: `GERAL`,
                                                    value: `help geral`, 
                                                    
                                                },
                                                {
                                                    name: `CAPITÃES`,
                                                    value: `help cap`, 
                                                    
                                                },
                                                {
                                                    name: `EMBED`,
                                                    value: `help embed`
                                                }
                                                ]
                                            }
                                            
                                        })
                                     
                                        break;                            
                                    }                                       
                            }                
                        }
                        }
                        
    })
