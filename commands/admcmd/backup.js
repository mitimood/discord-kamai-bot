const job = require("../../eventos/backup")
const logger = require("../../utils/logger")

module.exports = {
    name: "backup",
    aliases: ["bkp", "b"],
    description: "Backup dos dados do bot",

    async execute(msg) {

        try {
            job.invoke()

            await msg.reply()

        } catch (error) {
            logger.error(error)
        }
        
    }
}