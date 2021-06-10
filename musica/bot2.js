const Discord2 = require("discord.js");
const config = require("../config");
const client2 = new Discord2.Client();
client2.login(config.musica.token.bot2);
const index = require(`../index`);

const DisTube2 = require('distube')
const distube = new DisTube2(client2, { searchSongs: true, emitNewSongOnly: true });
client2.distube = distube;

let inici = true;

distube.options.leaveOnStop  = inici
distube.options.leaveOnEmpty = inici;
distube.options.leaveOnFinish= inici;

client2.on("ready",()=>{
    client2.voice.connections.forEach(m=>
        m.disconnect()
        )
    })

const status = (queue) => `Volume: \`${queue.volume}%\` | Filtro: \`${queue.filter || "Desligado"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode == 2 ? "Toda Playlist" : "Essa musica" : "Desligado"}\` | Autoplay: \`${queue.autoplay ? "Ligado" : "Desligado"}\``;

client2.distube
    .on("playSong", (message, queue, song) => message.channel.send({embed:{description:
        `Tocando \`${song.name}\` - \`${song.formattedDuration}\`\nPedido por: ${song.user}\n${status(queue)}`}}
    ))
    .on("addSong", (message, queue, song) => message.channel.send({embed:{description:
        `Adicionou ${song.name} - \`${song.formattedDuration}\` a playlist ${song.user}`}}
    ))
    .on("playList", (message, queue, playlist, song) => message.channel.send({embed:{description:
        `Play \`${playlist.name}\` playlist (${playlist.songs.length} musicas).\nPedido por: ${song.user}\nAgora tocando \`${song.name}\` - \`${song.formattedDuration}\`\n${status(queue)}`}}
    ))
    .on("addList", (message, queue, playlist) => message.channel.send({embed:{description:`Adicionou \`${playlist.name}\` playlist (${playlist.songs.length} musicas) a playlist\n${status(queue)}`}}
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send({embed:{title:`**Escolha uma opção a baixo**`, description:`${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n**Escolha uma das opções a cima em 60 segundos ou aguarde para cancelar**`}});
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", (message) => message.channel.send(`Pesquisa cancelada`))
    .on("error", (message, e) => {
        console.error(e)
        message.channel.send("Aconteceu um erro");
    });
    client2.on("message", message=>{

        setTimeout(verificadb, 1000)
        
        async  function verificadb(){
          if(index.db2.db.exists(`/bot2`)){
             let obj= await index.db2.db.getData(`/bot2`)
             index.db2.db.delete(`/bot2`)
            
             const canal = client2.channels.cache.get(obj.channel.id)
             let test = await canal.messages.fetch({ limit: 5 }).catch(console.error)
              
             test.forEach(element => {
              if(element.id==obj.id){
                  element.content = [element.content.slice(0, 1), "2", element.content.slice(1)].join('');
                  message = element
                  if(message){
                      executa(message)
                  }
                          }    
              });
          }}
          if(message){
              executa(message)
          }

          function executa (message){
        if(!message.author.bot && message.guild){
            if(message.member.voice.channel){
                if(message.content.startsWith(config.prefixo+"2")){
              let comando =  message.content.toLowerCase().split(" ")[0].substr(config.prefixo.length+1)
              const args = message.content.slice(config.prefixo.length).trim().split(/ +/g);
              
              if (["play", "p"].includes(comando)){
                distube.play(message, args.join(" "));}
        
            if (["repeat", "loop"].includes(comando)){
                let mode =  distube.setRepeatMode(message, parseInt(args[0]));
            mode = mode ? mode == 2 ? "Repeat queue" : "Repeat song" : "Off";
            message.channel.send({embed:{description:"Modo de repetição: `" + mode + "`"}});
        }
        
            if (["stop", "st"].includes(comando)) {
                distube.stop(message);
                message.channel.send({embed:{description:"Stopped the music!"}});
            }
        
            if (["skip", "s"].includes(comando)){
                distube.skip(message);}
        
            if (["q", "queue","fila"].includes(comando)) {
                let queue = distube.getQueue(message);
                message.channel.send({embed:{title:'Playlist atual:',description: queue.songs.map((song, id) =>
                    `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
                ).slice(0, 10).join("\n")}});
            }
        
            if ([`3d`, `bassboost`, `echo`, `karaoke`, `nightcore`, `vaporwave`].includes(comando)) {
                let filter = distube.setFilter(message, comando);
                message.channel.send({embed:{description:"Filtros na fila: " + (filter || "Desligado")}});
            }
        
            if(["pause","pausar"].includes(comando)){
                distube.pause(message);
                message.channel.send({embed:{description:"Playlist pausada"}})
    
            }
            if(["resume","r"].includes(comando)){
              let queue  = distube.resume(message);
              message.channel.send({embed:{title:'Retornando a playlist:',description: queue.songs.map((song, id) =>
                    `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
                ).slice(0, 10).join("\n")}})
            }
    
            if(["volume","vol","v"].includes(comando)){
    
            }   
    
            if(["shuffle","shufle","mix","misturar"].includes(comando)){
                let queue  = distube.shuffle(message);
                message.channel.send({embed:{title:'Retornando a playlist:',description: queue.songs.map((song, id) =>
                    `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
                ).slice(0, 10).join("\n")}});
    
            }
        
        
        }
            }}}
            
    })