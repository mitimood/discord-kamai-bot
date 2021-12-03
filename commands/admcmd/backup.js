const job = require("../../eventos/backup")

module.exports = {
    name: "backup",
    aliases: ["bkp", "b"],
    description: "Backup dos dados do bot",

    async execute(msg) {

        job.invoke()
        msg.reply({content:"Processo de backup iniciado"})
        
    }
}