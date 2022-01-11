const { TrimMsg } = require("../../utils/funções")
const fs = require('fs/promises')
const { selfbotRegister } = require("../..")

module.exports={
    name: "selfbotlist",
    aliases: [],
    description: "selfbot time dias",
    async execute (msg){
        
        let msgArgs = TrimMsg(msg)

        if(!msgArgs[1]){
            try{
                const self = await fs.readFile("db/storage/selfbotRegister.json")
                msg.channel.send({files: [{ attachment:self, name: "selfbots.txt"}]})

            }catch(err){
                console.log(err)
            }
        }else if(msgArgs[1].toLowerCase() == "time" && msgArgs[2].match(/[0-9]/)){
            try{
                let d = new Date()
                d.setDate(d.getDate() - msgArgs[2])
                let selfReturn = await selfbotRegister.SelfbotListTime(d.valueOf())
                if(selfReturn){
                    let buffer = Buffer.from(selfReturn, "utf-8")
                    msg.channel.send({files: [{ attachment:buffer, name: "selfbots.txt"}]})

                }else{
                    msg.channel.send("Sem registros")
                }
            }catch(err){

            }
        }
    }

}