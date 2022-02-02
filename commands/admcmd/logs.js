const fs = require('fs').promises
const logger = require('../../utils/logger')


module.exports = {
    name: "logs",
    aliases: ["log"],
    description: "Fudeu de mais, só use em caso de fudeu de mais",

    async execute(msg) {
        
        try {
            await msg.delete()
                const logs = await fs.readdir("./utils/logs")

                const log = await fs.readFile(`./utils/logs/${logs.pop()}`)

                console.log(log, logs)

                await msg.channel.send({files: [{ attachment:log, name: "logs.txt"}]})
            
            
        } catch (error) {
            logger.error(error)
        }
        

    }
}