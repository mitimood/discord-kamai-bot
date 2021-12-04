const { client } = require("..");

client.on("interactionCreate", async interac=>{

    if(!interac.isCommand()) return
    const {commandName} = interac

    const command = client.commands.get(commandName)

    if(!command) return

    command.execute(interac)

})