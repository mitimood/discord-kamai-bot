const { Collection } = require("discord.js");
const client = require("../../utils/loader/discordClient")

module.exports={
    name: "retrospectiva",
    aliases: [],
    description: "cria uma thread em cada mensagem e marca a pessoa",

    async execute (msg) {

        async function lots_of_messages_getter(channel, limit = 1000000000) {
            let sum_messages = new Collection();
            let last_id;
        
            while (true) {
                const options = { limit: 100 };
                if (last_id) {
                    options.before = last_id;
                }
        
                const messages = await channel.messages.fetch(options);
                
                console.log(sum_messages.size, messages.size)

                sum_messages = sum_messages.concat(messages);

                last_id = messages.last().id;
        
                if (messages.size != 100 || sum_messages >= limit) {
                    break;
                }
            }
        
            return sum_messages;
        }
        
        let channelRetrospec = await client.channels.fetch('926869440031784990')
        

        let messages = await lots_of_messages_getter(channelRetrospec)
        let counter = 0
        
        for (let message of messages.values()){
            counter++
            console.log(`${counter} de ${messages.size}`)

            if (message.type != 0 || !message.author || message.hasThread) continue
            console.log('Passou filtro')

            try {
                console.log('Criando Thread')

                let options = {name: '2023 CHEGOU! 🥂'}
                const thread = await message.startThread(options)
                console.log('Thread criada')

                await thread.send(`Ei ${message.author} os ventos gelados de Jotunheim
vieram lhe trazer uma capsula...
Aqui esta sua capsula do tempo`)
                console.log('Mensagem enviada')

        
            } catch (error) {
                console.log(error)
            }
        }
            


        console.log(messages.size)
    }
}