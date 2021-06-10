// Warnable 2.0.0 - Command
const config = require(`../config`);
const index = require(`../index`);


module.exports={ remove };

async function remove (msg) {
    let msgArgs = msg.content.split(" ");

    // Remove last warning made in the guild.
    if (msgArgs[1] == "last") {
        index.db.removeWarning(msg.guild.id)
        .then(user => {
            msg.channel.send({ embed: {
                color: config.color.err,
                description: `Advertencia removida de <@${user}>`
            }});
        })
        .catch(() => {
            msg.channel.send({ embed: {
                color: config.color.err,
                description: "Ouve um erro ao remover a advertência..."
            }});
        });
    }
    // Remove a specific warning from a user
    else if (/^<[@][!&]?[0-9]+>$/.test(msgArgs[1]) || /[0-9]+/.test(msgArgs[1])) {
        let userId = (msg.mentions.members.first()) ? msg.mentions.members.first().user.id : msgArgs[1].match(/[0-9]+/)[0];
        let warningNum = (msgArgs[2]) ? parseInt(msgArgs[2]) : 1;
        index.db.removeWarning(msg.guild.id, userId, warningNum)
        .then(user => {
            msg.channel.send({ embed: {
                color: config.color.sucess,
                description: `A advertencia foi removida de <@${user}>`
            }});
        })
        .catch(() => {
            msg.channel.send({ embed: {
                color: config.color.err,
                description: "Ouve um erro ao remover a advertencia... Verifique duas vezes o usuario e a quantidade de advertencias."
            }});
        });
    }
};
