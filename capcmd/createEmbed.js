const {Discord, embDb } = require("..");
const verimg = require('image-url-validator').default;
const isurl = require(`is-url`)
const config = require(`../config`)
module.exports={ emb };

async function emb(msg,embed = new Discord.MessageEmbed().setDescription(`Descrição ainda não definida`)) {
    returnemb(embed)
    
    function returnemb(embed){
        
        //Menu embed creation
        msg.channel.send(`**Selecione a opção para o embed:**\n
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
0- Cancelar`).then(m=>{

            var filter = (m)=> /[0-9]+/.test(m.content)&&m.content<=10 && m.author.id == msg.author.id;
            msg.channel.awaitMessages(filter,{max:1,time:120000, errors:['Time']}).then((opc)=>{
                switch(parseInt(opc.first().content)){
                    case 1:
                        msg.channel.send("Envie agora o nome do author, ou cancelar").then(a=>
                            {
                                let filter = m=>m.author.id==msg.author.id;
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(nam=>
                                {
                                    if(nam.first().content.toLowerCase()=="cancelar")return(msg.channel.send("Author cancelado"),returnemb(emb)) 
                                    embed.setAuthor(nam.first().content);
                                    a.delete()
                                    msg.channel.send("Envie o link da imagem do autor, cancelar, ou pular").then(a=>
                                    {
                                        let filter= m=>msg.author.id==m.author.id
                                        msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(async urli=>
                                            {
                                                //verify if its a valid image
                                                if(!["pular","cancelar"].includes(urli.first().content.toLowerCase())){
                                                    if(!await verimg(urli.first().content)) return (msg.channel.send("**Url invalida**"),returnemb(embed));
                                                }
                                                if(urli.first().content.toLowerCase()=="cancelar")return(msg.channel.send("Url cancelada"),returnemb(embed)) 
                                                if(urli.first().content.toLowerCase()=="pular") urli.first().content = undefined
                                                    embed.setAuthor(nam.first().content,urli.first().content)
                                                    a.delete()
                                                    msg.channel.send("Envie a url do author, cancelar, ou pular").then(a=>
                                                    {
                                                        let filter= m=>msg.author.id==m.author.id
                                                        msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(url=>{
                                                            if(!["cancelar","pular"].includes(url.first().content.toLowerCase())){
                                                                if(!isurl(url.first().content)) return (msg.channel.send("**Url invalida**"),returnemb(embed));
                                                            }
                                                            if(url.first().content.toLowerCase()=="cancelar")return(msg.channel.send("Url cancelada"),returnemb(embed)) 
                                                            if(url.first().content.toLowerCase()=="pular")url.first().content=undefined
                                                            //verify if its a valid url
                                                            
                                                                embed.setAuthor(nam.first().content,urli.first().content,url.first().content)
                                                                a.delete();
                                                                msg.channel.send(embed);
                                                                returnemb(embed);

                                                        }).catch(m=>msg.channel.send("Tempo esgotado"))
                                                    })

                                            }).catch(m=>msg.channel.send("Tempo esgotado"))
                                    })
                                }).catch(m=>msg.channel.send("Tempo esgotado"))

                            })
                        break;
                    case 2:
                        msg.channel.send("Envie o título").then(a=>
                            {   
                                var filter = m=>m.author.id == msg.author.id
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:["Time"]}).then(title=>{
                                    if(title.first().content=="cancelar")return (msg.channel.send("Titulo cancelado"),returnemb(embed))
                                        embed.setTitle(title.first().content);
                                        a.delete();
                                        msg.channel.send(embed);
                                        returnemb(embed);
                                }).catch(m=>msg.channel.send("Tempo esgotado"))
                            })
                        break;
                    case 3:
                            if(embed.fields.length==25)return (msg.channel.send("Limite máximo de campos adicionado"),returnemb(embed))
                            msg.channel.send("Você quer inserir um campo vazio?").then(a=>
                                {
                                    a.react(config.emojis.check)
                                    a.react(config.emojis.false)
                                    var filter = (reaction,user)=>{return user.id === msg.author.id}
                                    a.awaitReactions(filter,{max:1,time:120000,errors:["Time"]}).then(recemp=>
                                        {
                                            if(recemp.first().emoji.name==`✔`)
                                            {
                                                a.delete();
                                                embed.addField(`\u200B`,`\u200B`,true)
                                                msg.channel.send(embed)
                                                returnemb(embed);
                                            }else{
                                                a.delete()
                                                msg.channel.send("Insira o nome do campo").then(a=>
                                                    {
                                                        
                                                        var filter = m=> m.author.id == msg.author.id
                                                        msg.channel.awaitMessages(filter,{max:1,time:120000,errors:["Time"]}).then(nom=>
                                                            {
                                                                a.delete()
                                                                msg.channel.send("Insira o valor do campo").then(a=>
                                                                    {
                                                                        msg.channel.awaitMessages(filter,{max:1,time:120000,errors:["Time"]}).then(val=>
                                                                            {
                                                                                a.delete()
                    
                                                                                msg.channel.send("Deseja o campo alinhado?").then(a=>
                                                                                    {
                                                                                        a.react(config.emojis.check)
                                                                                        a.react(config.emojis.false)
                                                                                        var filter = (reaction,user)=>{return  user.id === msg.author.id}
                                                                                        a.awaitReactions(filter,{max:1,time:120000,errors:["Time"]}).then(reac=>
                                                                                            {
                                                                                                if(reac.first().emoji.name==`❌`)
                                                                                                {
                                                                                                    a.delete();
                                                                                                    embed.addField(nom.first().content,val.first().content)
                                                                                                    msg.channel.send(embed)
                                                                                                    returnemb(embed);
                                                                                                }else
                                                                                                {
                                                                                                    a.delete();
                                                                                                    embed.addField(nom.first().content,val.first().content,true)
                                                                                                    msg.channel.send(embed)
                                                                                                    returnemb(embed);
                                                                                                }
                                                                                            }).catch(m=>msg.channel.send("Tempo esgotado"))
                                                                                    })
                                                                            }).catch(m=>msg.channel.send("Tempo esgotado"))
                                                                    })
                                                            }).catch(m=>msg.channel.send("Tempo esgotado"))
                                                    })

                                            }
                                        }).catch(m=>msg.channel.send("Tempo esgotado"))
                                })

                                
                            
                        break;
                    case 4:
                        msg.channel.send("Qual a posição do campo que você quer remover?(1,2,3...)").then(a=>
                            {
                                var filter = m=> /[0-9]+/.test(m.content)&&parseInt(m.content)<=25
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(cmprem=>
                                    {
                                        console.log(embed.fields.length)
                                        console.log(parseInt(cmprem.first().content))
                                        if(embed.fields.length<parseInt(cmprem.first().content))return (msg.channel.send("Nenhum campo nesse valor"),returnemb(embed))
                                        embed.spliceFields(parseInt(cmprem.first().content)-1,1)
                                        a.delete()
                                        msg.channel.send(embed)
                                        returnemb(embed)
                                    }).catch(m=>msg.channel.send("Tempo esgotado"))
                            })
                        break;
                    case 5:
                        msg.channel.send("Selecione a cor do seu embed\n"
                                        +"1- Verde\n"
                                        +"2- Vermelho\n"
                                        +"3- Roxo\n"
                                        +"4- Azul\n"
                                        +"5- Blurple").then(a=>
                            {
                                var filter= m=> m.author.id == msg.author.id && /[0-9]+/.test(m.content);
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(col=>
                                    {
                                        switch(parseInt(col.first().content))
                                        {
                                            case 1:
                                                embed.setColor(config.color.green);
                                                break;
                                            case 2:
                                                embed.setColor(config.color.red);
                                                break;
                                            case 3:
                                                embed.setColor(config.color.purple);
                                                break;
                                            case 4:
                                                embed.setColor(config.color.blue);
                                                break;
                                            case 5:
                                                embed.setColor(config.color.blurple);
                                                break;
                                        }
                                        a.delete();
                                        msg.channel.send(embed);
                                        returnemb(embed);
                                    })
                            })
                        break;
                    case 6:
                        msg.channel.send('Digite a descrição do embed').then(a=>
                            {
                                let filter = m=> m.author.id === msg.author.id;
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(desc=>
                                    {
                                        embed.setDescription(desc.first().content);
                                        a.delete();
                                        msg.channel.send(embed);
                                        returnemb(embed);
                                    }).catch(m=>msg.channel.send("**Tempo esgotado**"))
                            })
                        break;
                    case 7:
                        msg.channel.send(`Envie agora a url da imagem da thumbnali`).then(a=>
                            {
                                let filter = m=> m.author.id === msg.author.id;
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(thumb=>
                                    {
                                        a.delete();
                                        if(!verimg(thumb.first().content)) return (msg.channel.send(`Imagem invalida`),returnemb(embed))
                                        embed.setThumbnail(thumb.first().content)
                                        msg.channel.send(embed);
                                        returnemb(embed)
                                    }).catch(m=>msg.channel.send("**Tempo esgotado**"))
                            })
                        break;
                    case 8:
                        msg.channel.send(`Envie agora a url da imagem`).then(a=>
                            {
                                let filter = m=> m.author.id === msg.author.id;
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(img=>
                                    {
                                        a.delete()
                                        if(!verimg(img.first().content)) return (msg.channel.send(`Imagem invalida`),returnemb(embed))
                                        embed.setImage(img.first().content)
                                        msg.channel.send(embed);
                                        returnemb(embed)
                                    }).catch(m=>msg.channel.send("**Tempo esgotado**"))
                            })
                        break;
                    case 9:
                        msg.channel.send(`Digite o texto do rodapé`).then(a=>
                            {
                                let filter = m=> m.author.id === msg.author.id;
                                msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(ftx=>
                                    {
                                        a.delete()
                                        msg.channel.send(`Deseja inserir uma imagem no rodapé?`).then(a=>
                                            {
                                                a.react(config.emojis.check)
                                                a.react(config.emojis.false)
                                                let filter = (reaction,user)=>{return  user.id === msg.author.id}
                                                a.awaitReactions(filter,{max:1,time:120000,errors:[`Time`]}).then(rea=>
                                                    {
                                                        if(rea.first().emoji.name==`❌`)
                                                        {
                                                            a.delete();
                                                            embed.setFooter(ftx.first().contet)
                                                            msg.channel.send(embed)
                                                            returnemb(embed);
                                                        }else
                                                        {
                                                            a.delete();
                                                            msg.channel.send(`Envie o link da imagem`).then(a=>
                                                                {
                                                                    let filter = m => m.author.id === msg.author.id;
                                                                    msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(foturl=>
                                                                        {
                                                                            a.delete()
                                                                            if(!verimg(foturl.first().content)) return (msg.channel.send(`Link invalido`),returnemb(embed))        
                                                                            embed.setFooter(ftx.first().content,foturl.first().content)
                                                                            msg.channel.send(embed);
                                                                            returnemb(embed);
                                                                        }).catch(m=>msg.channel.send("**Tempo esgotado**"))
                                                                })
                                                        }

                                                    }).catch(m=>msg.channel.send("**Tempo esgotado**"))
                                            })
                                    }).catch(m=>msg.channel.send("**Tempo esgotado**"))
                            })
                        break;
                    case 10:

                        msg.channel.send(`Envie o nome do seu embed`).then(a=>
                            {
                                let filter = m=> m.author.id === msg.author.id
                                msg.channel.awaitMessages(filter, {max:1,time:120000,errors:[`Time`]}).then(savem=>
                                    {
                                        embDb.saveEmb(embed,savem.first().content,msg.author.username)
                                        msg.channel.send(`Seu embed foi salvo`)
                                        msg.channel.send(embed);
                                    })
                            })


                        break
                    case 0:
                        return msg.channel.send("Embed cancelado")
                        
                }

            
            
            }).catch(m=>msg.channel.send("**Tempo esgotado**"))

    })



    }
}