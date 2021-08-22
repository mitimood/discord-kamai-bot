const config = require("./config")
const config_secret = require("./config_secret")
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://kamaibot:${config_secret.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const MongodbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports = { MongodbClient, SetTempMute, SetUnmute, CheckMute, transferdb, warn_list, warn_remove, warn_add, Check_all_mutes, role_register_add, role_register_remove, check_roles, create_canary_db,add_voice_xp, add_chat_xp, get_xp }
const moment = require("moment-timezone");

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
  warn_id = parseInt(warn_id)
  const database = MongodbClient.db(config.mongo.db_geral);
  const member_management = database.collection('member_management');
  try {

    let deleted_doc = await member_management.findOneAndUpdate({ "warnings": { "$elemMatch": { "warn_id": warn_id } } }, { "$unset": { "warnings.$": { "warn_id": warn_id } } })
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
    let doc = await member_management.findOne({ "_id": user_id })
    var Total_points = 0
    if (doc && doc["warnings"] && doc["warnings"].find(warn => warn != null)) {
      var warns = ""
      warns += `Advertencias (${doc["warnings"].length})\n`

      doc["warnings"].forEach((element, i) => {
        if (element) {
          Total_points += parseInt(element["points"])
          warns += `**${i + 1} - ${element["reason"]}** (id: ${element["warn_id"]})`
          warns += `\n↳ ${element["points"]} ponto${(!(element["points"] == 1)) ? "s" : ""} | Por: <@${element["issuer"]}>| Em: ${moment.tz(element["time"], 'MMM Do YYYY, h:mm a', 'America/Sao_Paulo').format(`DD-MM-YYYY HH:mm`)}\n`

        }
      });

      let warnings = { "points": Total_points, "warns": warns }

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
    let insert = { "$set": { "_id": id, "muted": true, "since": since_stamp, "duration": duration_stamp } }
    let query = { "_id": id }
    await members_adm.updateOne(query, insert, configuration);
  } finally {
    // Ensures that the MongodbClient will close when you finish/error
  }
}

async function SetUnmute(id) {
  try {
    const database = MongodbClient.db(config.mongo.db_geral);
    const members_adm = database.collection('member_management');
    let configuration = { "upsert": true }
    let insert = { "$set": { "_id": id, "muted": false, "duration": null, "since": null } }
    let query = { "_id": id }
    await members_adm.updateOne(query, insert, configuration);

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
    if (doc && doc.muted) {
      if (doc.muted) {
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
  } finally {
    // Ensures that the MongodbClient will close when you finish/error
  }
}

async function Check_all_mutes() {
  const database = MongodbClient.db(config.mongo.db_geral);
  const members_adm = database.collection('member_management');
  try {
    let docs = members_adm.find({ "muted": true })
    const index = require(`./`)

    docs.forEach( async doc => {
      if (moment.utc().valueOf() >= doc["duration"] + doc["since"]) {
        SetUnmute(doc["_id"])
        try {
          await index.client.guilds.cache.get(config.guild_id).members.cache.get(doc["_id"]).roles.remove(config.roles.muted)
        } catch (err) {
          console.log(err)
        }
      }
    })
  } catch {
  }
}

async function role_register_add(user_id, role_id) {
  const database = MongodbClient.db(config.mongo.db_geral);
  const members_adm = database.collection('member_management');

  try {
    let querry = { "_id": user_id }
    let insert = { "$set": { "_id": user_id, }, "$addToSet": { "roles": role_id } }
    await members_adm.findOneAndUpdate(querry, insert, { upsert: true })
  } catch (err) {
    console.log(err)
  }
}

async function role_register_remove(user_id, role_id) {
  const database = MongodbClient.db(config.mongo.db_geral);
  const members_adm = database.collection('member_management');

  try {
    let querry = { "_id": user_id }
    let insert = { "$set": { "_id": user_id, }, "$pull": { "roles": { "$in": [role_id] } } }
    await members_adm.findOneAndUpdate(querry, insert, { upsert: true })
  } catch (err) {
    console.log(err)
  }
}

async function check_roles(user_id) {
  const database = MongodbClient.db(config.mongo.db_geral);
  const members_adm = database.collection('member_management');
  try {
    let doc = await members_adm.findOne({ "_id": user_id, "roles": { "$exists": true } })
    return doc["roles"]

  } catch {

  }
}

async function create_canary_db() {


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




async function add_voice_xp(ids, xp) {

  const database = MongodbClient.db(config.mongo.db_geral);
  const members_management = database.collection('member_management');

  let query = { "_id": { "$in": ids } }
  let insert = { "$inc": { "xp.xp_voice": xp } }

  members_management.updateMany(query, insert, { upsert: true })
}



async function add_chat_xp(ids, xp) {

  const database = MongodbClient.db(config.mongo.db_geral);
  const members_management = database.collection('member_management');

  let query = { "_id": ids }
  let insert = { "$inc": { "xp.xp_chat": xp } }

  members_management.updateMany(query, insert, { upsert: true })
}


async function get_xp(id) {

  const database = MongodbClient.db(config.mongo.db_geral);
  const members_management = database.collection('member_management');

  let query = { "_id": id }

  let doc = await members_management.findOne(query)

  let xp = new Object()

  if (doc.xp) {
    if (doc.xp.xp_chat) {
      xp.chat = new Object()
      xp.chat.total = doc.xp.xp_chat
      xp.chat.level = parseInt(Math.log2(doc.xp.xp_chat))
      xp.chat.percentage = parseInt(100 * (Math.log2(doc.xp.xp_chat) - parseInt(Math.log2(doc.xp.xp_chat))))/100

    }
    if (doc.xp.xp_voice) {
      xp.voice = new Object()
      xp.voice.total = doc.xp.xp_voice
      xp.voice.level = parseInt(Math.log2(doc.xp.xp_voice))
      xp.voice.percentage = parseInt(100 * (Math.log2(doc.xp.xp_voice) - parseInt(Math.log2(doc.xp.xp_voice))))/100
    }

  } else {
    xp.chat = undefined
    xp.voice = undefined
  }
  return xp

}
