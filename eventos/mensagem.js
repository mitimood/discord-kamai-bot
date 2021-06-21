const index  = require("../index");
const config = require("../config")

    
    index.client.on("message", msg =>{
        if(!msg.author.bot && msg.guild){
            if(msg.content.startsWith(config.prefixo)){
              let comando =  msg.content.toLowerCase().split(" ")[0].substr(config.prefixo.length)

                if (msg.member.roles.cache.has(config.roles.admin)) {
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
                        case "bs":
                            let bs = require(`../admcmd/ban`);
                                bs.ban(msg);
                    }
                }
                if (msg.member.roles.cache.has(config.roles.mod)||msg.member.roles.cache.has(config.roles.admin) ) {
                    switch(comando){
                        case "kick":
                            let kick = require(`../modcmd/kick`);
                            kick.kick(msg);
                            break;
                            
                    }
                    
                }               
                switch(comando){
                    case "ping":
                        let ping = require(`../commandpub/ping`)
                            ping.ping(msg);
                            break;
                    case "help":
                          msg.channel.send({embed:{
                              color:`9333FF`,
                              title:"**Use &play (musica) para chamar um bot novo**",
                              description:"Use o prefixo na frente do bot invocado para poder interagir com ele",
                              fields:[
                              {
                                  name: 'play (musica)',
                                  value: 'inicia musica',
                                  
                              },
                              {
                                  name: `stop`,
                                  value: `Para a musica`, 
                                  
                              },
                              {
                                  name: `queue`,
                                  value: `Exibe a playlist`, 
                                  
                              },
                              {
                                  name: `skip`,
                                  value: `Pula para a proxima musica`, 
                                  
                              },
                              {
                                  name: `repeat (0,1,2)`,
                                  value: `Para repetir: musica 1; playlist 2; parar de repetir 0`, 
                                  
                              },
                              {
                                  name: `pause`,
                                  value: `pausa a musica`, 
                                  
                              },
                              {
                                  name: `resume`,
                                  value: `Volta a tocar a musica`, 
                                  
                              },
                              {
                                  name: `mix`,
                                  value: `Aleatoriza as musicas da playlist`, 
                                  
                              },
                          
                              ]
                          }
                      }
                      )  
          
                        
                }
            }
        }
    })
