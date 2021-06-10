// Warnable 2.0.0 - Command
const index = require(`../index`);
const config = require(`../config`);
const {client} = require(`../index`);
const {checkPoints}= require(`../eventos/funções`)

module.exports = { warn }

async function warn (msg) {
    let msgArgs = msg.content.split(" ");
    if ((/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1])) && /^[-]?[0-9]+$/.test(msgArgs[2])) {
        let userid = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];
        let points = parseInt(msgArgs[2]);
        let reason = (msgArgs[3]) ? msg.content.substring(msgArgs.slice(0, 3).join(" ").length + 1) : "Sem motivo";
        let issuer = msg.author.id;

        let temp = await client.users.fetch(userid).catch(async(e) =>{ await msg.channel.send(`O ID não é de um usuário de discord: ${userid}`);return false});
        if(temp){
        if ((msg.mentions.members.first())  ? !msg.mentions.members.first().roles.cache.has(config.roles.admin) : true) {
            index.db.addWarning(msg.guild.id, userid, points, reason, issuer)
            .then(data => {
                const canal =  client.channels.cache.get(config.channels.modlog)
                canal.send({embed:{
                    description:`**Nova advertencia**\n<@${userid}> (Advertência: ${data}) foi advertido por <@${issuer}>\n Motivo: \`${reason}\` por **${points} advertencia${(!(points == 1 || points == -1)) ? "s" : ""}**`,
                    color:config.color.sucess,
              }})    
                if (points > 0) {
                    checkPoints(msg.guild, userid, data);

                        msg.guild.members.cache.get(userid).user.send({embed:{
                            description: "Você foi advertido com: "+ points + "\nPor: "+reason+", agora tendo um total de:" + data,
                            color: config.color.sucess
                        }});
                    
                }
                if (msg.channel.id !== config.channels.modlog) msg.channel.send({ embed: {
                    color: config.color.sucess,
                    description: `**${points} advertência${(!(points == 1 || points == -1)) ? "s" : ""}** aplicada ao <@${userid}> por \`${reason}\``
                }});
            });
        }
        else {
            msg.channel.send({ embed: {
                color: config.color.err,
                description: "Não é possivel advertir admins."
            }});
        }
    }
    else {
        msg.channel.send({ embed: {
            color: config.color.err,
            description: "Faltando usuários ou pontos"
        }});
    }
};}
