const { embDb, client } = require("..");

module.exports = {emb}

function emb(msg){

    msg.channel.send("**O que deseja fazer com o embed**\n1- Enviar um embed\n2- Criar um embed\n3-Editar um embed\n4- Deletar embed").then(a=>
        {
            let filter = m=> /[0-9]+/.test(m.content)&&m.author.id === msg.author.id
            msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(async opc=>
                {
                    switch (parseInt(opc.first().content)){
                        case 1:
                            msg.channel.send(`Escolha o id do embed que deseja enviar`)
                            msg.channel.send(await embDb.EmbList()).then(a=>
                                {
                                    let filter = m=> m.author.id === msg.author.id;
                                    msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`time`]}).then(async embs=>
                                        {
                                            var recvdb = embDb.getEmb(embs.first().content)
                                            if(await recvdb != null){
                                                msg.channel.send(await recvdb)
                                                msg.channel.send(`Envie id do canal que deseja enviar a mensagem`).then(a=>
                                                    {
                                                        var filter = m => /[0-9]+/.test(m.content)&&m.author.id === msg.author.id
                                                        msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`Time`]}).then(async chanCol=>
                                                            {
                                                                let channel=client.channels.cache.get(chanCol.first().content)
                                                                if (channel){
                                                                    channel.send(await recvdb)
                                                                }else{
                                                                    msg.channel.send("Id de canal invalido")
                                                                }
                                                            }).catch(err=>msg.channel.send("**Tempo esgotado**"))
                                                    })
                                            }else{
                                                msg.channel.send(`Id invalido`)
                                            }
                                        }).catch(err=>msg.channel.send("**Tempo esgotado**"))
                                })
                            break;
                        case 2:
                            let createmb = require(`./createEmbed`)
                            createmb.emb(msg);
                            break;
                        case 3:
                            msg.channel.send(`Escolha o id do embed que deseja editar`)
                            msg.channel.send(await embDb.EmbList()).then(a=>
                                {
                                    let filter = m=> /[0-9]+/.test(m.content)&&m.author.id === msg.author.id;
                                    msg.channel.awaitMessages(filter,{max:1,time:120000,errors:[`time`]}).then(async embs=>
                                        {
                                            var recvdb = embDb.getEmb(embs.first().content)
                                            if(await recvdb != null){
                                                let embedb = await recvdb
                                                embedb.embed=embedb.embed
                                                msg.channel.send(embedb).then(a=>{
                                                    let createmb = require(`./createEmbed`)
                                                    createmb.emb(msg,a.embeds[0]);    
                                                })
                                            }else{
                                                msg.channel.send(`Id invalido`)
                                            }
                                        }).catch(err=>msg.channel.send("**Tempo esgotado**"))
                                })
                            break;
                        case 4:
                            msg.channel.send(`Escolha o id do embed que deseja deletar`)
                            msg.channel.send(await embDb.EmbList()).then(a=>
                                {
                                    let filter = m=> /[0-9]+/.test(m.content)&&m.author.id === msg.author.id;
                                    msg.channel.awaitMessages(filter,{max:1,time:120000,errors:['time']}).then(delCol=>
                                        {
                                            if(embDb.delEmb(delCol.first().content)===null){
                                                msg.channel.send(`**ID ERRADO**`)
                                            }else{
                                                msg.channel.send(`**Embed deletado**`)
                                            }
                                        }).catch(err=>msg.channel.send("**Tempo esgotado**"))        
                                })
                            break;
                    }
                }).catch(err=>msg.channel.send("**Tempo esgotado**"))

        })

}
