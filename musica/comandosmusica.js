const index  = require("../index");
const config = require("../config")
const fs = require("fs");


    index.client.on("message", message =>{
        

        if(!message.author.bot && message.guild){
            if(message.member.voice.channel){
                if(message.content.startsWith(config.prefixo)){
              let comando =  message.content.toLowerCase().split(" ")[0].substr(config.prefixo.length)
              const args = message.content.slice(config.prefixo.length).trim().split(/ +/g);
              

            if(["play", "p"].includes(comando)){
                fs.readFile('./bot1.txt', 'utf8' , (err, data) => {
                    if (err) {
                      console.error(err)
                      return
                    }
                    if(data==0){
                        index.db2.comandonovo(message,"bot1")

                    }else{
                        fs.readFile('./bot2.txt', 'utf8' , (err, data) => {
                            if (err) {
                              console.error(err)
                              return
                            }
                            if(data==0){
                                index.db2.comandonovo(message,"bot2")

                            }else{
                                fs.readFile('./bot3.txt', 'utf8' , (err, data) => {
                                    if (err) {
                                      console.error(err)
                                      return
                                    }
                                    if(data==0){
                                        index.db2.comandonovo(message,"bot3")

                                    }else{
                                        fs.readFile('./bot4.txt', 'utf8' , (err, data) => {
                                            if (err) {
                                              console.error(err)
                                              return
                                            }
                                            if(data==0){
                                                index.db2.comandonovo(message,"bot4")

                                            }else{
                                                message.channel.send("Todos os lacaios em uso")
                                            }
                                        })
                
                                    }
                                })
        
                            }
                        })

                    }
                })  

            }


            }}
        }
       

});


            
   