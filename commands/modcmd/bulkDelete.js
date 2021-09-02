const { TrimMsg } = require("../../funções/funções")

module.exports={
    name: "bulkdelete",
    aliases: ["clear", "clean", "delete"],
    description: "desmuta o membro previamente mutado",

    async execute(msg){
        let msgArgs = TrimMsg(msg)

        if ( msgArgs[1]?.match(/[0-9]/) ){
            let deletedMsg = await bulkdelete( msg.channel , msgArgs[1] + 1 )
            if ( deletedMsg ){
                return msg.channel.send({ content: `${msg.author.toString()} ${msgArgs[1]} mensagens apagadas`})

            }else{
                return msg.channel.send({ content: `${msg.author.toString()} Ouve um erro ao apagar as mensagens`})
            }
        }else {
            return msg.channel.send( { content: `${msg.author.toString()}, você precisa dizer a quantidade de mensagens para eu apagar`} )
        }
    }}


async function bulkdelete( channel, quantity ){
    /**
     * @channel
     * @quantity
     */
    try{
       let deletedMsgs = await channel.bulkDelete(quantity, true)
       return deletedMsgs

    }catch(err){
        console.log(err)
        return false

    }
}