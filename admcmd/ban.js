var fs = require('fs');
const { client } = require("../index");
const config = require("../config")

module.exports= { ban }

  function ban (message){
    //Verifies if the ban command is still running, avoiding spamming the discord API
    if(fs.readFileSync(`cdl.txt`)==`1`){
      message.channel.send(
        { embed: {
          color: config.color.err,
          description: `Ainda estou punindo os vermes`}}
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
         let reason = (msgArgs[i]) ? message.content.substring(msgArgs.slice(0, i).join(" ").length + 1) : 1;

            
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

              if(temp != message.author){

              let member = message.guild.members.cache.get(temp.id)
              
              if( member.roles.highest.position < message.member.roles.highest.position){ 

            await temp.send(`Você foi banido em ${guild.name} por: ${reason}`).catch(m=>console.log(m));
            
            await guild.members.ban(id, {reason: ( `[KAMAI]${message.author} ${reason}`)}).catch(m=>console.log(m)).then(async() => {
              const canal = client.channels.cache.get(config.channels.modlog)
              canal.send({embed:{
                color: config.color.sucess,
                title:`Expurgado ${temp} ${temp.tag} por:`,
                description: `${reason} `,
                thumbnail: {
                  url: 'https://images.genius.com/93a16c1f0873bdfdfaac3b0b6e23f680.300x300x1.jpg',
                },
              }})
                            
              message.channel.send({ embed: {
                color: config.color.sucess,
                title:`Expurgado ${temp} ${temp.tag} por:`,
                description: `${reason} `,
                thumbnail: {
                  url: 'https://images.genius.com/93a16c1f0873bdfdfaac3b0b6e23f680.300x300x1.jpg',
                },
              }})
      
      
             }).catch()}
             message.channel.send(`Ta tentando dar o golpe, parceiro?`)

            }
            message.channel.send(`Ta querendo se banir? Ta tudo bem? Quer conversar?`);
          
          }
          //define as ready to run againg
          if(z==index){fs.writeFileSync('cdl.txt',`0`)}
          ;},index*1000)
            
        });
    }
      else{
        message.channel.send({ embed: {
          color: config.color.err,
          description: `Como irei punilos sem saber quem são? `}})
        };
  }