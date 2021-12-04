const config = require("./config")
require('dotenv').config();
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://kamaibot:${process.env.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const MongodbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports = {resetXp ,verifyXp, MongodbClient, SetTempMute, voiceMuteSet, voiceMuteCheck, SetUnmute, CheckMute, transferdb, warn_list,notifyList, warn_remove, warn_add, Check_all_mutes, role_register_add, role_register_remove, check_roles,add_voice_xp, add_bonus_xp, add_chat_xp, get_xp, daily_get, daily_set, moneyGet, moneyAdd, moneyRemove, getAllActiveReports, getReport, updateStateReport, addReport }
const moment = require("moment-timezone");
const databaseSite = require("./mongoDbSite.js");

async function transferdb() { 
  try {

    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');
    let warndb = require(`./warnregister.json`)
    for (let id in warndb["guilds"]["612117634909208576"][`users`]) {
      let warnings = warndb["guilds"]["612117634909208576"][`users`][id]["warnings"]
      if (warnings) {
        warnings.forEach(element => {
          if (element && element["time"]) {
            element["time"] = moment.utc(moment.tz(element["time"], 'MMM Do YYYY, h:mm a', "Australia/Brisbane")).format('MMM Do YYYY, h:mm a')
          }
          if (warndb["guilds"]["612117634909208576"]["last_warn_id"]) {
            warndb["guilds"]["612117634909208576"]["last_warn_id"] = warndb["guilds"]["612117634909208576"]["last_warn_id"] + 1
          } else {
            warndb["guilds"]["612117634909208576"]["last_warn_id"] = 1
          }
          element["warn_id"] = warndb["guilds"]["612117634909208576"]["last_warn_id"]
          console.log(element["warn_id"])
        });
      }
      if (warndb["guilds"]["612117634909208576"][`users`][id]["muted"]) {
        delete warndb["guilds"]["612117634909208576"][`users`][id]["muted"]
      }
      let warning = { warnings }
      await members_adm.updateMany({ "_id": id }, { "$set": warning }, { "upsert": true });

    }

  } finally {
    // Ensures that the MongodbClient will close when you finish/error
  }
}

async function warn_add(target_id, executor_id, points, reason) {
  const database = MongodbClient.db(config.mongo.db_geral);
  const member_management = database.collection('member_management');

  try {

    await member_management.updateOne({ "_id": 0 }, { "$inc": { "last_warn_id": 1 } }, { "upsert": true })

  } catch {
    return false

  } finally {

    try {
      let doc = await member_management.findOne({ "_id": 0 })
      let insert = { "warnings": { "warn_id": doc["last_warn_id"], "points": points, "reason": reason, "issuer": executor_id, "time": moment.utc().format('MMM Do YYYY, h:mm a') } }
      await member_management.updateOne({ "_id": target_id }, { "$push": insert }, { "upsert": true })
      return true

    } catch (err) {
      return false

    }
  }
}


async function warn_remove(warn_id) {

  try {
    warn_id = parseInt(warn_id)
    if(!warn_id) return false
    const database = MongodbClient.db(config.mongo.db_geral);
    const member_management = database.collection('member_management');

    let deleted_doc = await member_management.findOneAndUpdate({ "warnings": { "$elemMatch": { "warn_id": warn_id } } }, { "$pull": { "warnings": { "warn_id": warn_id } } })
    if (deleted_doc["value"]["warnings"]) {
      return deleted_doc["value"]["_id"]
    }
  } catch (err) {
    return false
  } finally {
    // Ensures that the MongodbClient will close when you finish/error
  }
}

async function warn_list(user_id) {

  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const member_management = database.collection('member_management');
    const doc = await member_management.findOne({ "_id": user_id })
    let Total_points = 0

    if (doc && doc["warnings"] && doc["warnings"].find(warn => warn != null)) {
      let warns = ""
      let notifications = 0

      doc["warnings"].forEach((element, i) => {
        if (element) {
          Total_points += parseInt(element["points"])
          warns += `**${i + 1} - ${element["reason"]}** (id: ${element["warn_id"]})`
          warns += `\n↳ ${element["points"]} ponto${(!(element["points"] == 1)) ? "s" : ""} | Por: <@${element["issuer"]}>| Em: ${moment.tz(element["time"], 'MMM Do YYYY, h:mm a', 'America/Sao_Paulo').format(`DD-MM-YYYY HH:mm`)}\n`

        }
        if(parseInt(element["points"]) === 0){
          ++notifications
        }
      });
      warns = `Advertencias (${Total_points}) Notificações (${notifications})\n` + warns

      let warnings = { "points": Total_points, "warns": warns }

      return warnings
    } else {
      return false
    }

  } catch (err) {
    console.log(err)
  }
}


async function notifyList(user_id) {

  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const member_management = database.collection('member_management');
    const doc = await member_management.findOne({ "_id": user_id })

    if (doc && doc["warnings"] && doc["warnings"].find(warn => warn != null)) {
      let ntf = ""
      let notifications = 0

      doc["warnings"].forEach((element, i) => {

        if(parseInt(element["points"]) === 0){
          ++notifications
          ntf += `**${i + 1} - ${element["reason"]}** (id: ${element["warn_id"]})`
          ntf += `\n↳ ${element["points"]} ponto${(!(element["points"] == 1)) ? "s" : ""} | Por: <@${element["issuer"]}>| Em: ${moment.utc(element["time"], 'MMM Do YYYY, h:mm a', 'America/Sao_Paulo').format(`DD-MM-YYYY HH:mm`)}\n`

        }
      });
      ntf = `Notificações (${notifications})\n` + ntf

      let warnings = { "warns": ntf }

      return warnings
    } else {
      return false
    }

  } catch (err) {
    console.log(err)
  }
}

async function SetTempMute(id, since_stamp, duration_stamp) {
  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');
    let configuration = { "upsert": true }
    let insert = { "$set": { "_id": id, "chatMuted": true, "since": since_stamp, "duration": duration_stamp } }
    let query = { "_id": id }
    await members_adm.updateOne(query, insert, configuration);
  }catch(err){
    console.log(err)
  } finally {
    // Ensures that the MongodbClient will close when you finish/error
  }
}

async function SetUnmute(id) {
  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');
    let configuration = { "upsert": true }
    let insert = { "$set": { "_id": id, "chatMuted": false, "duration": null, "since": null } }
    let query = { "_id": id }
    await members_adm.updateOne(query, insert, configuration);

  }catch(err){
    console.log(err)
  } finally {
    // Ensures that the MongodbClient will close when you finish/error
  }
}

async function CheckMute(id) {
  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');
    let query = { "_id": id }
    let doc = await members_adm.findOne(query);
    if (doc && doc.chatMuted) {
      if (doc.chatMuted) {
        if (moment.utc().valueOf() >= doc["duration"] + doc["since"]) {
          SetUnmute(id)
          return false
        } else {
          return true
        }
      }
    } else {
      return false
    }
  } catch (err){
    console.log(err)
  } finally {
    // Ensures that the MongodbClient will close when you finish/error
  }
}

async function voiceMuteSet ( id = Number, state = Boolean ){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const member_management = database.collection('member_management');

    await member_management.updateOne({"_id": id}, { "voiceMute": state }, { upsert:true } )
  }catch(err){
    console.log(err)
  }
}


async function voiceMuteCheck ( id = Number, state = Boolean ){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const member_management = database.collection('member_management');

    const doc = await member_management.findOne( { "_id": id, "voiceState": true } )

    if (doc){
      console.log(doc)
    }

  }catch(err){
    console.log(err)
  }
}

async function Check_all_mutes() {

  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');
    
    let docs = members_adm.find({ "chatMuted": true })
    const index = require(`./`)

    docs.forEach( async doc => {
      if (moment.utc().valueOf() >= doc["duration"] + doc["since"]) {
        await SetUnmute(doc["_id"])
        try {
          await index.client.guilds.cache.get(config.guild_id).members.cache.get(doc["_id"]).roles.remove(config.roles.muted)
        } catch (err) {
          console.log(err)
        }
      }
    })
  } catch(err) {
    console.log(err)
  }
}
  
async function muteNameChange(){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');

    await members_adm.updateMany( {muted:{$exists:true} }, { $rename: { muted: "chatMuted" }} )
    
  }catch (err){
    console.log(err)
  }
}

async function role_register_add(user_id = String, role_id = String) {

  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');

    let querry = { "_id": user_id }
    let insert = { "$set": { "_id": user_id, }, "$addToSet": { "roles": role_id } }
    await members_adm.findOneAndUpdate(querry, insert, { upsert: true })
  } catch (err) {
    console.log(err)
  }
}

async function role_register_remove(user_id = String, role_id = String) {

  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');

    let querry = { "_id": user_id }
    let insert = { "$set": { "_id": user_id, }, "$pull": { "roles": { "$in": [role_id] } } }
    await members_adm.findOneAndUpdate(querry, insert, { upsert: true })
  } catch (err) {
    console.log(err)
  }
}

async function check_roles(user_id) {

  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');

    let doc = await members_adm.findOne({ "_id": user_id, "roles": { "$exists": true } })
    
    if (doc?.roles){
      return doc["roles"]
    }else{
      return null
    }

  } catch (err) {
    console.log(err)

  }
}

/*async function create_canary_db() {


  const database = MongodbClient.db(config.mongo.db_geral);
  const databaseB = MongodbClient.db('kamaibot_canary');

  const members_adm = await database.collection('member_management').find().toArray();
  databaseB.collection('member_management').insertMany(members_adm)

  const activitypoems = await database.collection('activitypoems').find().toArray();
  databaseB.collection('activitypoems').insertMany(activitypoems)

  const activitykaraoke = await database.collection('activitykaraoke').find().toArray();
  databaseB.collection('activitykaraoke').insertMany(activitykaraoke)

  const activityarte = await database.collection('activityarte').find().toArray();
  databaseB.collection('activityarte').insertMany(activityarte)

}

*/


async function add_voice_xp(ids, xp) {

  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const xpManagement = database.collection('member_management');
  
    let query = { "_id": { "$in": ids } }
    let insert = { "$inc": { "xp.xp_voice": xp } }

    await xpManagement.updateMany(query, insert, { upsert: true })

    for (const id of ids) {
      await verifyXp(id)
    }

  }catch (err) {
    console.log(err)
  }
}

async function add_bonus_xp(ids, xp) {

  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const xpManagement = database.collection('member_management');
  
    let query = { "_id": { "$in": ids } }
    let insert = { "$inc": { "xp.xp_bonus": xp } }

    await xpManagement.updateMany(query, insert, { upsert: true })

    for (const id of ids) {
      await verifyXp(id)
    }

  }catch (err) {
    console.log(err)
  }
}


async function add_chat_xp(id, xp) {

  try{
    
  const database = MongodbClient.db(config.mongo.db_geral);
  const xpManagement = database.collection('member_management');

  let query = { "_id": id }
  let insert = { "$inc": { "xp.xp_chat": xp } }

  await xpManagement.updateMany(query, insert, { upsert: true })
  
  await verifyXp(id)

  }catch(err){
    console.log(err)
  }
}

async function verifyXp(id){

  try {
    
    const index = require('./index')
    let xp = await get_xp(id)
  
  // let userLvl = xp.global.level
    
    let member = await index.client.guilds.cache.get(config.guild_id).members.fetch({user: id})
    let highestLvlRole 
    let membLvlRoles = member.roles.cache.filter(r=>{
      if(Object.values(config.roles.levels).includes(r.id)){
        if(!highestLvlRole || highestLvlRole.rawPosition < r.rawPosition){
          highestLvlRole = r          
        }
      }
      return Object.values(config.roles.levels).includes(r.id)
    })
    // gets the member high position role level in integer value'
    let highestLvl;
    if(highestLvlRole){
      highestLvl = Object.keys(config.roles.levels).find(key => config.roles.levels[key] === highestLvlRole.id)
      highestLvl = parseInt(highestLvl)
    }else{
      highestLvl = null
    }

    let lvlIds = Object.values(config.roles.levels)
    
    let nxtLvlId;
    
    if(highestLvlRole){
      nxtLvlId = lvlIds[lvlIds.findIndex(k=> k == (highestLvlRole.id)) + 1]
    }else{
      nxtLvlId = lvlIds.shift()
    }
    let nxtLvl = parseInt(Object.keys(config.roles.levels).find(key => config.roles.levels[key] === nxtLvlId))

    if( xp.global.level >= nxtLvl && (!highestLvlRole || highestLvlRole?.id != nxtLvlId) && nxtLvlId){
      await member.roles.add(nxtLvlId)
      await role_register_add(member.id , nxtLvlId)

      if(highestLvlRole){
        await member.roles.remove(highestLvlRole.id)
        await role_register_remove(member.id, highestLvlRole.id)
      }
    }
  } catch (error) {
    console.log(error)
  }
    
}

async function get_xp(id) {
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const xpManagement = database.collection('member_management');
  
    let query = { "_id": id }

    const doc = await xpManagement.findOne(query)

    let xp = new Object()

  if (doc?.xp) {
    if (doc?.xp?.xp_chat) {
      doc.xp.xp_chat = doc.xp.xp_chat * config.xp.chat
      xp.chat = new Object()
      xp.chat.total = doc.xp.xp_chat
      xp.chat.level = parseInt(doc.xp.xp_chat/150)
      xp.chat.percentage = parseInt(100 * (Math.log2(doc.xp.xp_chat) - parseInt(Math.log2(doc.xp.xp_chat))))/100

    }else{
      xp.chat = new Object()
    }
    if (doc?.xp?.xp_voice) {
      xp.voice = new Object()
      doc.xp.xp_voice = doc.xp.xp_voice * config.xp.voice

      xp.voice.total = doc.xp.xp_voice
      xp.voice.level = parseInt(Math.log2(doc.xp.xp_voice))
      xp.voice.percentage = parseInt(100 * (Math.log2(doc.xp.xp_voice) - parseInt(Math.log2(doc.xp.xp_voice))))/100
    }else{
      xp.voice = new Object()
    }

    if (doc?.xp?.xp_bonus) {
      xp.bonus = new Object()
      doc.xp.xp_bonus = doc.xp.xp_bonus * config.xp.bonus

      xp.bonus.total = doc.xp.xp_bonus
      xp.bonus.level = parseInt(Math.log2(doc.xp.xp_bonus))
      xp.bonus.percentage = parseInt(100 * (Math.log2(doc.xp.xp_bonus) - parseInt(Math.log2(doc.xp.xp_bonus))))/100
    }else{
      xp.bonus = new Object()
    }
    if(doc?.xp){
      xp.global = new Object()

      xp.global.total = 0
      xp.global.level = 0
      
      if(doc?.xp?.xp_chat){
        xp.global.total =  doc.xp.xp_chat  + xp.global.total
      }
      if(doc?.xp?.xp_voice){
        xp.global.total = doc.xp.xp_voice + xp.global.total
      }
      if(doc?.xp?.xp_bonus){
        xp.global.total = doc.xp.xp_bonus + xp.global.total
      }
      let increaseXP = config.xp.requiredLevelUp

      let xpUp = increaseXP
      let xpTotalCalc = xp.global.total

      while(xpTotalCalc > xpUp){
        xpTotalCalc -= xpUp
        xpUp = xpUp + increaseXP
        xp.global.level++
      }
      xp.global.percentage = ( parseInt( ( xpTotalCalc / xpUp ) * 100 ) ) / 100
    }
  } else {
    xp.chat = new Object()
    xp.voice = new Object()
    xp.bonus = new Object()
    xp.global = new Object()
  }
  return xp

  }catch(err){  
    console.log(err)
  }
}

async function resetXp(){

  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const xpManagement = database.collection('member_management');

    xpManagement.updateMany({xp:{"$exists":true}},{"$unset": {xp:1}} )

  } catch (err) {
    console.log(err)
  }
}


/*async function data_convert(){
  const database = MongodbClient.db(config.mongo.db_geral);
  const xpManagement = database.collection('xpManagement');

  const xpDocs = await xpManagement.find().toArray()
  const memberManagement = database.collection('member_management');

  for(xpDoc of xpDocs){

    if(xpDoc.xp_voice && xpDoc.xp_chat){
      await memberManagement.updateOne( {_id:xpDoc._id}, {"$set":{_id:xpDoc._id, xp:{xp_chat: xpDoc.xp_chat , xp_voice:xpDoc.xp_voice }}}, {upsert:true} )

    }else if(xpDoc.xp_voice){
      await memberManagement.updateOne( {_id:xpDoc._id}, {"$set":{_id:xpDoc._id, xp:{xp_voice:xpDoc.xp_voice }}}, {upsert:true} )

    }else if(xpDoc.xp_chat){
      await memberManagement.updateOne( {_id:xpDoc._id}, {"$set":{_id:xpDoc._id, xp:{xp_chat: xpDoc.xp_chat}}}, {upsert:true} )

    }
    
  }
  console.log("Done")
}*/

async function daily_set(id){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_management = database.collection('member_management');
    
    let dailyDoc =  await members_management.findOne( { "_id":id } )
  
    if ( dailyDoc?.economy?.daily?.last + 172800000 >= Date.now().valueOf() && dailyDoc?.economy?.daily?.last + 86400000 <= Date.now().valueOf() ){
      
      let streak = 1 + dailyDoc.economy.daily.streak
      let money = parseInt( Math.log10(streak) * config.rewards.daily ) + config.rewards.daily
      let newStreak = 1 
      
      await members_management.updateOne( { "_id":id }, { "$setOnInsert":{ "_id":id }, "$set":{ "economy.daily.last": Date.now().valueOf() },"$inc":{ "economy.money":money, "economy.daily.streak": newStreak } }, { upsert: true } )

      return { money: money, streak: streak}
  
    } else{
      
      let money = config.rewards.daily
      let streak = 1
      
      await members_management.updateOne( { "_id":id }, { "$setOnInsert":{ "_id":id }, "$set":{ "economy.daily": { "last" : Date.now().valueOf(),  streak: streak } }, "$inc":{ "economy.money":money } }, { upsert: true } )

      return { money: money, streak: streak }

    }

  }catch(err){
    console.log(err)
  }
  
}

async function daily_get(id){
  
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_management = database.collection('member_management');
  
    let dailyDoc = await members_management.findOne( { "_id":id } )
  
    if ( dailyDoc?.economy?.daily?.last ){
      return dailyDoc.economy.daily.last

    }else{
      return null 

    }
  }catch(err){
    console.log(err)

  }

}


async function moneyAdd(id, money){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_management = database.collection('member_management');

    await members_management.updateOne( { "_id":id }, { "$setOnInsert": { "_id":id }, "$inc":{ "economy.money":money } }, { upsert: true } )
    await databaseSite.siteMoneyAdd(id, money)
  }catch(err){
    console.log(err)
  }

}

async function moneyRemove(id, money){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_management = database.collection('member_management');

    await members_management.updateOne({"_id":id}, { "$inc": { "economy.money": -money } } )

  }catch(err){
    console.log(err)
  }
}

async function moneyGet(id){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_management = database.collection('member_management');
  
    const moneyDoc = await members_management.findOne( { "_id": id } )
    return moneyDoc?.economy?.money
  }catch(err){
    console.log(err)
  }
}


async function addReport(id, toDo, authorId, messages){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const report = database.collection('reports');
  
    await report.insertOne( { "_id": id, toDo:toDo, state: true, authorId: authorId, messages: messages } )
    return true
  }catch(err){
    console.log(err)
    return false
  }
}

async function updateStateReport(id, state){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const report = database.collection('reports');
  
    const doc = await report.updateOne( {"_id": id},{ $set: { state: state } } )
    return true
  }catch(err){
    console.log(err)
    return false
  }
}

async function getReport(id){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const report = database.collection('reports');
  
    const doc = await report.findOne( { "_id": id } )
    return doc
  }catch(err){
    console.log(err)
    return false
  }
}

async function getAllActiveReports(){
  try{
    const database = MongodbClient.db(config.mongo.db_geral);
    const report = database.collection('reports');
  
    const docs = await report.find( { state: true} ).count()
    return docs
  }catch(err){
    console.log(err)
    return false
  }
}