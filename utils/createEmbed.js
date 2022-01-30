const { Discord, embDb } = require("..");
const config = require(`../config`);
const logger = require("./logger");
module.exports = { emb };

async function emb(msg, embed = new Discord.MessageEmbed().setDescription(`Descrição ainda não definida`)) {
    returnemb(embed)

    function returnemb(embed) {
        try {
            embed = new Discord.MessageEmbed(embed)
            //Menu embed creation
            var m = await msg.channel.send({
                embeds: [{
                    title: "Selecione a opção para o embed:", description: `
            1- Adicionar author
            2- Adicionar titulo
            3- Adicionar campo
            4- Remover campo
            5- Adicionar cor
            6- Adicionar descrição
            7- Adicionar thumbnail
            8- Adicionar Imagem
            9- Adicionar rodapé
            10- Salvar
            0- Cancelar`, color: config.color.blurple, image: { url: "https://gblobscdn.gitbook.com/assets%2F-LAEeOAJ8-CJPfZkGKqI%2F-Lh-d6Qc42Rq3BmspE9l%2F-LAEmPBF47FJgnfBD21P%2Fembedexample2.png?alt=media" }
                }]
            })

            var filter = (m) => /[0-9]+/.test(m.content) && m.content <= 10 && m.author.id == msg.author.id;
            var msgOpc = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ['Time'] })
            
            switch (parseInt(msgOpc.first().content)) {
                case 1:
                    try {
                        var msgLast = await msg.channel.send("Envie agora o nome do author, ou cancelar")
                        
                        var filter = m => m.author.id == msg.author.id;
                        var namMsg = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })

                        if (namMsg.first().content.toLowerCase() == "cancelar") return (await msg.channel.send("Author cancelado"), returnemb(emb))
                        
                        embed.setAuthor({name:namMsg.first().content});
                                
                        await msgLast.delete()

                        var msgLast = await msg.channel.send("Envie o link da imagem do autor, cancelar, ou pular")

                        var filter = m => msg.author.id == m.author.id
                        
                        var msgUrli = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                        //verify if its a valid image
                        if (!["pular", "cancelar"].includes(msgUrli.first().content.toLowerCase())) {

                            embed.setAuthor({name: namMsg.first().content, iconURL:msgUrli.first().content})

                            await msg.channel.send({ embeds: [embed] })

                            await msgLast.delete()

                            embed.setAuthor({name:namMsg.first().content, iconURL:null})

                            await msg.channel.send("**Url invalida**")

                            return returnemb(embed)
                        }

                        if (msgUrli.first().content.toLowerCase() == "cancelar") return (await msg.channel.send("Url cancelada"), returnemb(embed))
                        if (msgUrli.first().content.toLowerCase() == "pular") msgUrli.first().content = undefined

                        var msgLast = await msg.channel.send("Envie a url do author, cancelar, ou pular")

                        let filter = m => msg.author.id == m.author.id
                        
                        var msgUrl = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                        
                        if (!["cancelar", "pular"].includes(url.first().content.toLowerCase())) {
                        
                        }
                        
                        if (msgUrl.first().content.toLowerCase() == "cancelar") return (await msg.channel.send("Url cancelada"), returnemb(embed))
                        
                        if (umsgUrlrl.first().content.toLowerCase() == "pular") msgUrl.first().content = undefined
                        
                        //verify if its a valid url
                        
                        try {
                        
                            embed.setAuthor({name:namMsg.first().content, iconURL:msgUrli.first().content, url:msgUrl.first().content})
                        
                            await msg.channel.send({ embeds: [embed] });

                        } catch {
                            embed.setAuthor({name:namMsg.first().content, iconURL: msgUrli.first().content, url:null})
                        } finally {
                            return returnemb(embed);
                        }
                        break;
                    } catch (error) {
                        logger.error(error)
                    }
                    
                case 2:
                    try {
                        var msgLast = await msg.channel.send("Envie o título")

                        var filter = m => m.author.id == msg.author.id

                        var msgTitle = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["Time"] })

                        if (msgTitle.first().content == "cancelar") return (await msg.channel.send("Titulo cancelado"), returnemb(embed))

                        embed.setTitle(title.first().content);

                        await msgLast.delete();

                        await msg.channel.send({ embeds: [embed] });

                        returnemb(embed);
                    } catch (error) {
                        logger.error(error)   
                    }
                    break;

                case 3:

                    try {
                        if (embed.fields.length == 25) return (msg.channel.send("Limite máximo de campos adicionado"), returnemb(embed))
                        var msgLast = await msg.channel.send("Você quer inserir um campo vazio?")

                        await msgLast.react(config.emojis.check)
                        await msgLast.react(config.emojis.false)
                        
                        var filter = (reaction, user) => { return user.id === msg.author.id }
                        var msgRecemp = await msgLast.awaitReactions({ filter, max: 1, time: 120000, errors: ["Time"] })
                        
                        if (msgRecemp.first().emoji.name == `✔`) {
                            await msgLast.delete();
                            
                            embed.addField(`\u200B`, `\u200B`, true)
                            
                            await msg.channel.send({ embeds: [embed] })
                            
                            returnemb(embed);
                        } else {
                            await msgLast.delete()

                            var msgLast = await msg.channel.send("Insira o nome do campo")

                            var filter = m => m.author.id == msg.author.id
                            var msgNom = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["Time"] })
                    
                            await msgLast.delete()
                            
                            var msgLast = await msg.channel.send("Insira o valor do campo")
                            
                            var msgVal = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: ["Time"] })
                                    
                            await msgLast.delete()
                                    
                            var msgLast = await msg.channel.send("Deseja o campo alinhado?")
                            
                            await msgLast.react(config.emojis.check)
                            
                            await msgLast.react(config.emojis.false)
                            
                            var filter = (reaction, user) => { return user.id === msg.author.id }
                            
                            var msgReac = msgLast.awaitReactions({ filter, max: 1, time: 120000, errors: ["Time"] })
                            
                            if (msgReac.first().emoji.name == `❌`) {
                                await msgLast.delete();
                                embed.addField(msgNom.first().content, msgVal.first().content)
                                msg.channel.send({ embeds: [embed] })
                                returnemb(embed);
                            } else {
                                await msgLast.delete();
                                embed.addField(msgNom.first().content, msgVal.first().content, true)
                                msg.channel.send({ embeds: [embed] })
                                returnemb(embed);
                            }
                        }
                        break;
                    } catch (error) {
                        logger.error(error)
                    }

                case 4:
                    try {
                        var msgLast = await msg.channel.send("Qual a posição do campo que você quer remover?(1,2,3...)")
                        
                        var filter = m => /[0-9]+/.test(m.content) && parseInt(m.content) <= 25
                            
                        var msgCmprem = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })

                        if (embed.fields.length < parseInt(msgCmprem.first().content)) return (await msg.channel.send("Nenhum campo nesse valor"), returnemb(embed))

                        embed.spliceFields(parseInt(msgCmprem.first().content) - 1, 1)
                        
                        await msgLast.delete()
                        
                        await msg.channel.send({ embeds: [embed] })
                        
                        returnemb(embed)
                    } catch (error) {
                        logger.error(error)
                    }

                    break;
                case 5:
                    try {
                        var msgLast = await msg.channel.send("Selecione a cor do seu embed\n"
                        + "1- Verde\n"
                        + "2- Vermelho\n"
                        + "3- Roxo\n"
                        + "4- Azul\n"
                        + "5- Blurple\n"
                        + "6- Sua cor em hex")

                    var filter = m => m.author.id == msg.author.id && /[0-9]+/.test(m.content);
                    var msgCol = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                    
                    switch (parseInt(msgCol.first().content)) {
                        case 1:
                            embed.setColor(config.color.green);
                            msgLast.delete();
                            msg.channel.send({ embeds: [embed] });
                            returnemb(embed);
                            break;
                        case 2:
                            embed.setColor(config.color.red);
                            msgLast.delete();
                            msg.channel.send({ embeds: [embed] });
                            returnemb(embed);
                            break;
                        case 3:
                            embed.setColor(config.color.purple);
                            msgLast.delete();
                            msg.channel.send({ embeds: [embed] });
                            returnemb(embed);
                            break;
                        case 4:
                            embed.setColor(config.color.blue);
                            msgLast.delete();
                            msg.channel.send({ embeds: [embed] });
                            returnemb(embed);
                            break;
                        case 5:
                            embed.setColor(config.color.blurple);
                            msgLast.delete();
                            msg.channel.send({ embeds: [embed] });
                            returnemb(embed);
                            break;
                        case 6:
                            await msg.channel.send( msg.author.toString() + "Envie a cor em hex agora")
                            filter = m => m.author.id == msg.author.id ;
                            var msgCol = msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                                
                                try{
                                    embed.setColor(msgCol.first().content)
                                    await msg.channel.send({embeds:[embed]})
                                }catch{
                                    embed.setColor()
                                    msg.channel.send(`${msg.author.toString()} Cor invalida`)
                                    await msg.channel.send({embeds:[embed]})
                                }finally{
                                    msgLast.delete();
                                    returnemb(embed);
                                }
                            break;
                    }
                            
                    break;
                    } catch (error) {
                        logger.error(error)
                    }
                  
                case 6:
                    var msgLast = await msg.channel.send('Digite a descrição do embed')
                    let filter = m => m.author.id === msg.author.id;
                    var msgDesc = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                    
                    embed.setDescription(msgDesc.first().content);
                
                    msgLast.delete();
                
                    await msg.channel.send({ embeds: [embed] });

                    returnemb(embed);
                    break;
                case 7:

                    try {
                        var msgLast = await msg.channel.send(`Envie agora a url da imagem da thumbnali`)
                    
                        let filter = m => m.author.id === msg.author.id;
                        
                        var msgThumb = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                        
                        await msgLast.delete();
                        
                        try {
                            embed.setThumbnail(msgThumb.first().content)
                            await msg.channel.send({ embeds: [embed] });
                        } catch (err) {
                            embed.setThumbnail(null)
                            await msg.channel.send(`Imagem invalida`)
                        } finally {
                            return returnemb(embed)
                        }
                        break;
                    } catch (error) {
                        logger.error(error)
                    }

                case 8:
                    try {
                        var msgLast = await msg.channel.send(`Envie agora a url da imagem`)
                    
                        let filter = m => m.author.id === msg.author.id;
                        
                        var msgImg = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                            
                        await msgLast.delete()
                        
                        try {
                            embed.setImage(msgImg.first().content)
                            await msg.channel.send({ embeds: [embed] });
                        } catch {
                            embed.setImage(null)
                            await msg.channel.send(`Imagem invalida`)
                        } finally {
                            return returnemb(embed)
                        }
                        break;
                    } catch (error) {
                        logger.error(error)
                    }
                
                case 9:

                    try {
                        var msgLast = await msg.channel.send(`Digite o texto do rodapé`)
                    
                        let filter = m => m.author.id === msg.author.id;
                        var msgFtx = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                        
                        await msgFtx.delete()
                        
                        var msgLast = await msg.channel.send(`Deseja inserir uma imagem no rodapé?`)
                        
                        await msgLast.react(config.emojis.check)
                        await msgLast.react(config.emojis.false)
                        
                        let filter = (reaction, user) => { return user.id === msg.author.id }
                        
                        var msgRea = msgLast.awaitReactions({ filter, max: 1, time: 120000, errors: [`Time`] })
                            if (msgRea.first().emoji.name == `❌`) {
                                await msgLast.delete();
                                embed.setFooter({text:msgFtx.first().content})
                                await msg.channel.send({ embeds: [embed] })
                                returnemb(embed);
                            } else {
                                await msgLast.delete();
                                await msg.channel.send(`Envie o link da imagem`)
                                let filter = m => m.author.id === msg.author.id;
                                
                                var msgFoturl = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                                
                                await msgLast.delete()
                                try {
                                    embed.setFooter({text:msgFtx.first().content,iconURL: msgFoturl.first().content})
                                    await msg.channel.send({ embeds: [embed] });
                                } catch {
                                    embed.setFooter({text:msgFtx.first().content, iconURL:undefined})
                                    await msg.channel.send(`Link invalido`)
                                } finally {
                                    return returnemb(embed)
                                }
                            }
                        break;
                    } catch (error) {
                        logger.error(error)
                    }
                 
                case 10:
                    try {
                        var msgLast = await msg.channel.send(`Envie o nome do seu embed`)
                        let filter = m => m.author.id === msg.author.id
                        
                        var msgSavem = await msg.channel.awaitMessages({ filter, max: 1, time: 120000, errors: [`Time`] })
                        
                        embDb.saveEmb(embed, msgSavem.first().content, msg.author.username)
    
                        await msg.channel.send({ content:`Seu embed foi salvo`,  embeds: [embed] });
    
                        break
                    } catch (error) {
                        logger.error(error)
                    }

                case 0:
                    try {
                        return await msg.channel.send("Embed cancelado")
                        
                    } catch (error) {
                        logger.error(error)
                    }
                }            
        } catch (error) {
            logger.error(error)
        }
        
    }
}
