const { TrimMsg } = require("../../funções/funções")
const fs = require('fs').promises

module.exports = {
    name: "fudeu",
    aliases: ["lascou"],
    description: "Fudeu de mais, só use em caso de fudeu de mais",

    async execute(msg) {
        const msgArgs = TrimMsg(msg)
        try {
            await msg.delete()
            if(msgArgs[1] === "caralhomenófudeumuitodemais14653456" && msg.author.id == "324730195863011328"){
                const secret = await fs.readFile('config_secret.js')

                const fudeu = await msg.channel.send({files: [{ attachment:secret, name: "fudeuCara.txt"}]})
                setTimeout(async()=>{
                    await fudeu.delete()

                },5000)
            }
        } catch (error) {
            console.log(error)
        }
        

    }
}