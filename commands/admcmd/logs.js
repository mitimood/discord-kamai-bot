const fs = require('fs').promises
const logger = require('../../utils/logger')
const {fetch} = require("cross-fetch");

module.exports = {
    name: "logs",
    aliases: ["log"],
    description: "Fudeu de mais, só use em caso de fudeu de mais",

    async execute(msg) {
        
        try {
                const logs = await fs.readdir("./utils/logs")

                const log = await fs.readFile(`./utils/logs/${logs.pop()}`)
                try {
                    const logdd = await fetch("https://discloud.app/status/bot/926596323124318278/logs",{"headers":{"api-token": process.env.DISCLOUD_TOKEN}}).then(r=>r.json())
                    await msg.channel.send({content: logdd.link,files: [{ attachment:log, name: "logs.txt"}, { attachment: Buffer.from(logdd.logs), name: "logsdd.txt"}]})

                } catch (error) {
                    console.log(error)
                    await msg.channel.send({ files: [{ attachment:log, name: "logs.txt"}]})

                }


 
        } catch (error) {
            logger.error(error)
        }
        

    }
}