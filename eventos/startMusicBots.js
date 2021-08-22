const {Client} = require('discord.js')
const { Manager } = require('erela.js')
const { client, LocalDb } = require('..')
const config_secret = require('../config_secret')
const Spotify  = require("erela.js-spotify");

const bot1 = new Client({ intents: 641 })
/*const bot2 = new Client({ intents: 641 })
const bot3 = new Client({ intents: 641 })
const bot4 = new Client({ intents: 641 })*/

module.exports = {bot1}

 bot1.login(config_secret.musica.token.bot1)
 /*bot2.login(config_secret.musica.token.bot2)
 bot3.login(config_secret.musica.token.bot3)
 bot4.login(config_secret.musica.token.bot4)*/
 
const clientID = config_secret.musica.spotify.clientID; // clientID from your Spotify app
const clientSecret = config_secret.musica.spotify.clientSecret; // clientSecret from your Spotify app


bot1.manager = new Manager({  
  plugins: [
  // Initiate the plugin and pass the two required options.
    new Spotify({
      playlistLimit:2010,
      albumLimit:1,
      clientID,
      clientSecret
    })
  ],
    nodes: [{
      host: "localhost",
      port: 2333,
      password: "discloud",
    }],
    autoPlay: true,
    send: (id, payload) => {
      const guild = bot1.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  })
    .on("nodeConnect", node => console.log(`Lavalink "${node.options.identifier}" connectedo.`))
    .on("nodeError", (node, error) => console.log(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    ))
    .on("trackStart", (player, track) => {
      const channel = bot1.channels.cache.get(player.textChannel);
      channel.send(`Agora tocando: \`${track.title}\`, pedido por: \`${track.requester.tag}\`.`);
    })
    .on("queueEnd", player => {
      const channel = bot1.channels.cache.get(player.textChannel);
      channel.send("A fila de música terminou.");
      player.destroy();
    });

    bot1.on('ready',()=>{
        console.log("Bot1 iniciado")
        bot1.manager.init(bot1.user.id)
    })

/*

    bot2.manager = new Manager({
      nodes: [{
        host: "localhost",
        port: 2333,
        password: "lavalink1234",
        identifier: "2",
        clientName: "bot2",
        clientId: config_secret.musica.bot2,
      }],
      autoPlay: true,
      send: (id, payload) => {
        const guild = bot2.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      }
    })
      .on("nodeConnect", node => console.log(`Lavalink "${node.options.identifier}" connectedo.`))
      .on("nodeError", (node, error) => console.log(
        `Node "${node.options.identifier}" encountered an error: ${error.message}.`
      ))
      .on("trackStart", (player, track) => {
        const channel = bot2.channels.cache.get(player.textChannel);
        channel.send(`Agora tocando: \`${track.title}\`, pedido por: \`${track.requester.tag}\`.`);
      })
      .on("queueEnd", player => {
        const channel = bot2.channels.cache.get(player.textChannel);
        channel.send("A fila de música terminou.");
        player.destroy();
      });
  
      bot2.on('ready',()=>{
          console.log("bot2 iniciado")
          bot2.manager.init(bot2.user.id)
      })



      bot3.manager = new Manager({
    nodes: [{
      host: "localhost",
      port: 2333,
      password: "lavalink1234",
      identifier: "3",
      clientName: "bot3",
      clientId: config_secret.musica.bot3,
    }],
    autoPlay: true,
    send: (id, payload) => {
      const guild = bot3.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  })
    .on("nodeConnect", node => console.log(`Lavalink "${node.options.identifier}" connectedo.`))
    .on("nodeError", (node, error) => console.log(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    ))
    .on("trackStart", (player, track) => {
      const channel = bot3.channels.cache.get(player.textChannel);
      channel.send(`Agora tocando: \`${track.title}\`, pedido por: \`${track.requester.tag}\`.`);
    })
    .on("queueEnd", player => {
      const channel = bot3.channels.cache.get(player.textChannel);
      channel.send("A fila de música terminou.");
      player.destroy();
    });

    bot3.on('ready',()=>{
        console.log("bot3 iniciado")
        bot3.manager.init(bot3.user.id)
    })




    bot4.manager = new Manager({
    nodes: [{
      host: "localhost",
      port: 2333,
      password: "lavalink1234",
      identifier: "4",
      clientName: "bot4",
      clientId: config_secret.musica.bot4,
    }],
    autoPlay: true,
    send: (id, payload) => {
      const guild = bot4.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  })
    .on("nodeConnect", node => console.log(`Lavalink "${node.options.identifier}" connectedo.`))
    .on("nodeError", (node, error) => console.log(
      `Node "${node.options.identifier}" encountered an error: ${error.message}.`
    ))
    .on("trackStart", (player, track) => {
      const channel = bot4.channels.cache.get(player.textChannel);
      channel.send(`Agora tocando: \`${track.title}\`, pedido por: \`${track.requester.tag}\`.`);
    })
    .on("queueEnd", player => {
      const channel = bot4.channels.cache.get(player.textChannel);
      channel.send("A fila de música terminou.");
      player.destroy();
    });

    bot4.on('ready',()=>{
        console.log("bot4 iniciado")
        bot4.manager.init(bot4.user.id)
        
    })


*/



client.on('voiceStateUpdate', (oldstate, newstate)=>{
  if ([config_secret.musica.bot1, config_secret.musica.bot2, config_secret.musica.bot3, config_secret.musica.bot4].includes(newstate.member.id) && newstate.channel != oldstate.channel){

    if(newstate.channel && !oldstate.channel){
      LocalDb.set_bot_state(newstate.member.id, true)

    }
    if(!newstate.channel && oldstate.channel){
      LocalDb.set_bot_state(oldstate.member.id, false)

    }
  }
})

