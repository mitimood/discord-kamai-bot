const { embDb, client, Discord } = require("../..");
const config = require("../../config");

module.exports={
    name: "embed",
    aliases: ["emb"],
    description: "Utilize o comando emb e siga os passos 😎",

    async execute(msg){
        let embListed = await embDb.EmbList()
        msg.channel.send({embeds:[{title:"O que deseja fazer com o embed",color: config.color.blurple, description:`
        1- Enviar um embed
        2- Criar um embed
        3- Editar um embed
        4- Deletar embed`}]}).then(a=>
            {
                let filter = m=> /[0-9]+/.test(m.content)&&m.author.id === msg.author.id
                msg.channel.awaitMessages({filter,max:1,time:120000,errors:[`Time`]}).then(async opc=>
                    {
                        switch (parseInt(opc.first().content)){
                        
                            case 1:
                                if(!embListed) return msg.channel.send({embeds:[{description:"Nenhum embed registrado ainda", color: config.color.err}]})
                                embListed.forEach(emb => {
                                    msg.channel.send(emb)
                                });
                                msg.channel.send("Envie o id do embed que deseja enviar")
                                var filter = (m) => m.author.id == msg.author.id && /[0-9]/.test(m.content)
                                msg.channel.awaitMessages({filter,max:1,time:120000,errors:[`time`]}).then(async embs=>
                                    {
                                        console.log(embs.first().content)
                                        var recvdb = await embDb.getEmb(embs.first().content)
                                        if(recvdb){
                                            msg.channel.send({embeds:[recvdb.embed]})
                                            msg.channel.send(`Envie id do canal que deseja enviar a mensagem`).then(a=>
                                                {
                                                        filter = m => /[0-9]+/.test(m.content) && m.author.id === msg.author.id
                                                    msg.channel.awaitMessages({filter,max:1,time:120000,errors:[`Time`]}).then(async chanCol=>
                                                        {
                                                            let channel = client.channels.cache.get(chanCol.first().content)
                                                            if (channel){
                                                                msg.channel.send("Embed enviado em " + channel.name)
                                                                channel.send({embeds:[recvdb.embed]})
                                                            }else{
                                                                msg.channel.send("Id de canal invalido")
                                                            }
                                                        }).catch(err=>msg.channel.send("**Tempo esgotado**"))
                                                })
                                        }else{
                                            msg.channel.send(`Id invalido`)
                                        }
                                    }).catch(err=>msg.channel.send("**Tempo esgotado**"))
                            break;
                            case 2:
                                let createmb = require(`../funções/createEmbed`)
                                createmb.emb(msg);
                                break;
                            case 3:
                                if(!embListed) return msg.channel.send({embeds:[{description:"Nenhum embed registrado ainda", color: config.color.err}]})
                                embListed.forEach(emb => {
                                    msg.channel.send(emb)
                                });
                                msg.channel.send("Envie o id do embed que deseja editar")

                                        filter = m => /[0-9]+/.test(m.content)&&m.author.id === msg.author.id;
                                        msg.channel.awaitMessages({filter,max:1,time:120000,errors:[`time`]}).then(async embs=>
                                            {
                                                const recvdb = await embDb.getEmb(embs.first().content)
                                                if(recvdb){
                                                    msg.channel.send({embeds:[recvdb.embed]}).then(a=>{
                                                        let createmb = require(`../funções/createEmbed`)
                                                        createmb.emb(msg,recvdb.embed);    
                                                    })
                                                }else{
                                                    msg.channel.send(`Id invalido`)
                                                }
                                            }).catch(err=>msg.channel.send("**Tempo esgotado**"))
                                break;
                            case 4:
                                if(!embListed) return msg.channel.send({embeds:[{description:"Nenhum embed registrado ainda", color: config.color.err}]})
                                embListed.forEach(emb => {
                                    msg.channel.send(emb)
                                });
                                msg.channel.send("Envie o id do embed que deseja deletar")                                   
                                filter = m=> /[0-9]+/.test(m.content)&&m.author.id === msg.author.id;
                                msg.channel.awaitMessages({filter,max:1,time:120000,errors:['time']}).then(delCol=>
                                    {
                                        if(!embDb.delEmb(delCol.first().content)){
                                            msg.channel.send(`**ID ERRADO**`)
                                        }else{
                                            msg.channel.send(`**Embed deletado**`)
                                        }
                                    }).catch(err=>msg.channel.send("**Tempo esgotado**"))        
                                break;
                        }
                    }).catch(err=>{
                        console.log(err)
                        msg.channel.send("**Tempo esgotado**")})
            })
    }
}
