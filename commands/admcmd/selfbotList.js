const { TrimMsg } = require("../../utils/auxiliarFunctions")
const fs = require('fs/promises')
const { selfbotRegister } = require("../..")
const logger = require("../../utils/logger")

module.exports={
    name: "selfbotlist",
    aliases: [],
    description: "selfbot time dias",
    async execute (msg){
        try{
            let msgArgs = TrimMsg(msg)

            if(!msgArgs[1]){
                const self = await fs.readFile("db/storage/selfbotRegister.json")
                await msg.channel.send({files: [{ attachment:self, name: "selfbots.txt"}]})

            }else if(msgArgs[1].toLowerCase() == "time" && msgArgs[2].match(/[0-9]/)){
                let d = new Date()

                d.setDate(d.getDate() - msgArgs[2])

                let selfReturn = await selfbotRegister.SelfbotListTime(d.valueOf())

                if(selfReturn){
                    let buffer = Buffer.from(selfReturn, "utf-8")
                    await msg.channel.send({files: [{ attachment:buffer, name: "selfbots.txt"}]})

                }else{
                    await msg.channel.send("Sem registros")
                }

            }
        }catch(error){
            logger.error(error)
        }
        
    }

}