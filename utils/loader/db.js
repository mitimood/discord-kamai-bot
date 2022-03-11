const Database = require("../../localdb");
const selfbotDB = require("../../db/selfbotRegister");
const selfbotRegister = new selfbotDB();
const DbEmbeds = require("../../dbEmbeds");
const embDb = new DbEmbeds();

const mongodb = require("../../mongodb")

module.exports = {mongodb,}

const gamesConst = require("../../db/games")

const gamesDB = new gamesConst()

const LocalDb = new Database();

const mongoClientSite = require("../../mongoDbSite.js");

try {
    mongodb.MongodbClient.connect()
    mongoClientSite.mongoClientSite.connect()
} catch (error) {
    
}

module.exports = Object.assign(module.exports, {gamesDB, LocalDb, mongoClientSite, embDb, selfbotRegister})