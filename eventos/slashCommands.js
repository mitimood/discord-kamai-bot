const { client } = require("..");
const logger = require("../utils/logger");

client.on("interactionCreate", async interac=>{

    if(!interac.isCommand()) return
    
    try {

        await interac.deferReply()
        const {commandName} = interac

        const command = client.commands.get(commandName)

        if(!command) return
    
        command.execute(interac)

    } catch (error) {
        logger.error(error)
    }
   

})