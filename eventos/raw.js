const { bot1 } = require("./startMusicBots");

bot1.on('raw', d=> bot1.manager.updateVoiceState(d))
/*bot2.on('raw', d=> bot2.manager.updateVoiceState(d))
bot3.on('raw', d=> bot3.manager.updateVoiceState(d))
bot4.on('raw', d=> bot4.manager.updateVoiceState(d))*/