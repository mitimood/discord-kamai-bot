//ban member command
const index = require("../index");
const config = require(`../config`);
var fs = require('fs');
const { client } = require("../index");

module.exports={bs};

function bs (message) {
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
         let reason = "selfbot"
         //define as running
        fs.writeFileSync('cdl.txt',`1`)
        //ban each id
       banidmembers.forEach( (id,index)=>{
          
          setTimeout(async()=> {
          
            let temp = await client.users.fetch(id).catch(e =>{ message.channel.send(`O ID não é de um usuário de discord: ${id}`)});
            
            if(temp){

              if(temp == message.author){

              let member = message.guild.members.cache.get(temp.id)
              
              if( member.roles.highest.position >= message.member.roles.highest.position){ 
              
             await temp.send({ embed: {
                color: config.color.sucess,
                description: `Você foi banido de ${guild.name} por desconfiarmos de você ser um selfbot. Caso tenha algum problema entre em contato com a staff responsavel.`}}).catch(m=>console.log(m));
              
            await guild.members.ban(id, {reason: ( `[KAMAI]${message.author} ${reason}`)}).catch(m=>console.log(m)).then(async() => {
 
              message.channel.send({ embed: {
                color: config.color.sucess,
                description: `Expurgado ${temp} ${temp.tag} por: ${reason} `,
                
              }})
              fs.writeFile('./selfbotid.txt',"\n " +id, { flag: 'a' }, err => {})
      
             }).catch()
             message.channel.send(`Ta tentando dar o golpe, parceiro?`);
            }
            message.channel.send(`Ta querendo se banir? Ta tudo bem? Quer conversar?`);
          }
            }
          if(z==index){fs.writeFileSync('cdl.txt',`0`)}
          ;},index*1500)
            
        });
    }
      else{
        message.channel.send({ embed: {
          color: config.color.err,
          description: `Como irei punilos sem saber quem são? `}})
        };
      
  
  }