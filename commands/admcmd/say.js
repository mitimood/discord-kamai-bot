const { client } = require("../../index");
const config = require("../../config");
const logger = require("../../utils/logger");
const { ActionRowBuilder, ButtonStyle, ButtonBuilder, ChannelType } = require("discord.js");

/*
    say command, will reply a message content inside the especified channel

say (channel id) (message content)
*/
module.exports={
    name: "say",
    aliases: [],
    description: "o bot envia uma mensagem no canal desejado",

    async execute (message){
        try {
            msgArgs = message.content.split(" ");

            let channel;
            let postText;
            let toUser = false
            let memberToSend


            if(!/[0-9]+/.test(msgArgs[1])) {
                channel = message.channel
                await message.delete()

                postText = message.content.substring(msgArgs.slice(0, 1).join(" ").length + 1);

            }else{
                channel = client.channels.cache.find(channel =>channel.id === msgArgs[1])

                if (!channel){
                
                    let userIdMesg = msgArgs[1].match(/[0-9]+/)
                    
                    userIdMesg = userIdMesg ?  userIdMesg[0] : userIdMesg

                    memberToSend = message.guild.members.cache.get(userIdMesg)

                    if(memberToSend){
                        toUser = true
                    }else{
                        return await message.channel.send({content: message.author.toString(),embeds:[{description:"Não foi possivel achar o canal no servidor",color: config.color.err,}]})

                    }                    
                }
                
                postText = message.content.substring(msgArgs.slice(0, 2).join(" ").length + 1);

                

            }

            if( !postText || postText?.length >= 3000){

                const messageToSend = {content: message.author.toString(),embeds:[{description:"Ouve um erro ao enviar a mensagem. Verifique o conteudo do texto passado",color: config.color.err,}]}
                
                try {
                    return await message.channel.send(messageToSend)

                } catch (error) {
                    return await message.channel.send({content: message.author.toString(),embeds:[{description:"Não foi possivel enviar a mensagem",color: config.color.err,}]})

                }
            }

            let compToSend

            if (toUser){
                compToSend = memberToSend

            }else{
                compToSend = channel

            }

            const post = await compToSend.send(postText)

            message.channel.send({content: 'Mensagem enviada com sucesso!'})

            if (post.channel.type != ChannelType.GuildNews) return

            const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("yes")
                                .setStyle(ButtonStyle.Success)
                                .setLabel("POSTAR"),
                            new ButtonBuilder()
                                .setCustomId("no")
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("NÃO POSTAR"),
                        );

            const optionPost = await message.channel.send({components:[row], content: `O canal <#${channel.id}> passado é um canal de anuncios. Deseja compartilhar esse conteudo com os outros servidores?`})
            
            const timeout = 30_000
            const filter = (interaction) => interaction.message.id === optionPost.id && interaction.user.id === message.author.id;
            
            try {
                const opt = await optionPost.awaitMessageComponent({ filter, time: timeout })

                if(opt.customId === "yes"){
                    await post.crosspost()
                    await optionPost.delete()
    
                    
                }else if(opt.customId === "no"){
                    await optionPost.delete()
                }
            } catch (error) {
                await optionPost.delete()

            }

            
        } catch (error) {
            logger.error(error)
        }

    }
}