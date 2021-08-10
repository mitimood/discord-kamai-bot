var fs = require('fs');
const { client } = require("../index");
const config = require("../config")

// kicks multiple members
// kick (ids) (reason)

module.exports={
  name: "kick",
  aliases: [],
  description: "expulsa o membro",

  async execute (message){
    //Verifies if the ban command is still running, avoiding spamming the discord API
      if(fs.readFileSync(`cdl.txt`)==`1`){
        message.channel.send(
          { embeds: [{
            color: config.color.err,
            description: `Ainda estou punindo os vermes`}]}
            )
            message.delete()
            return
      }
      var msgArgs = message.content.split(" ");
      var guild = message.guild
      //stacks each id into banidmembers
      if ((/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1]))) {

        let banidmembers = []
          for(var i = 1,z = -1; /^<[@][!&]?[0-9]+>$/.test(msgArgs[i]) || /[0-9]+/.test(msgArgs[i]);i++,z++ ){
            
            if(/^<[@][!&]?[0-9]+>$/.test(msgArgs[i])){
              let g = msgArgs[i].replace(/[\\<>@#&!]/g, "")
              banidmembers.push(g)
              
            }else{
            banidmembers.push(msgArgs[i])
            }
          }
            //merge the rest of the string to extract the reason
          let reason = (msgArgs[i]) ? message.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : 1;e4r

              
          if(reason == 1){
            i++
            reason = (msgArgs[i]) ? message.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : 1;
            
            if(reason == 1){
              i++
              reason = (msgArgs[i]) ? message.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : "Motivo desconhecido";

            }
          }
          //define as running
          fs.writeFileSync('cdl.txt',`1`)
          //ban each id
        banidmembers.forEach( (id,index)=>{
            
            setTimeout(async()=> {
              let temp = await client.users.fetch(id).catch(e =>{ message.channel.send(`O ID não é de um usuário de discord: ${id}`)});
              
              if(temp){
              await temp.send({ embeds: [{
                color: config.color.sucess,
                description: `Você foi banido em ${guild.name} por: ${reason}`}]});
              
              await guild.members.kick(id, {reason: ( `[KAMAI]${message.author} ${reason}`)})
                .catch(message.channel.send({embeds:[{
                
                description: "Não tenho permição para banir o: " + id,
                color:config.color.err,

                }]})).then(async() => {
                
                const canal = client.channels.cache.get(config.channels.modlog)
                canal.send({embeds:[{
                  description:"Expurgado" + temp + temp.tag+ "por:"+ reason,
                  color:config.color.sucess,
                }]})              
                message.channel.send({ embeds: [{
                  color: config.color.sucess,
                  
                  description: `Expurgado ${temp} ${temp.tag} por: ${reason} `,
                  thumbnail: {
                    url: 'https://images.genius.com/93a16c1f0873bdfdfaac3b0b6e23f680.300x300x1.jpg',
                  },
                }]})
        
        
              }).catch()
      }
            //define as ready to run againg
            if(z==index){fs.writeFileSync('cdl.txt',`0`)}
            ;},index*1000)
              
          });
      }
        else{
          message.channel.send({ embeds: [{
            color: config.color.err,
            description: `Como irei punilos sem saber quem são? `}]})
          };
      }
}