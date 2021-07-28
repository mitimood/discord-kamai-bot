const config = require("./config")
const { MongoClient } = require("mongodb");
// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://kamaibot:${config.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports={client, SetTempMute, SetUnmute, CheckMute, transferdb, warn_list, warn_remove, warn_add }
const moment = require("moment-timezone");

async function SetTempMute(id,since, duration) {
  try {              
    const database = client.db('kamaibot');
    const members_adm = database.collection('member_management');
    let config = {"upsert":true}
    let insert = {"$set":{"_id":id,"muted":true,"duration":duration,"since":since}}
    let query = {"_id":id}
    await members_adm.updateOne(query, insert, config);
 
  } finally {
    // Ensures that the client will close when you finish/error
  }
}

async function transferdb(file){
  try {
    
    const database = client.db('kamaibot');
    const members_adm = database.collection('member_management');
    let warndb = require(`./warnregister.json`)
    for(let id in warndb["guilds"]["612117634909208576"][`users`]){
      let warnings = warndb["guilds"]["612117634909208576"][`users`][id]["warnings"]
      if(warnings){
        warnings.forEach(element => {
          if(element && element["time"]){
            element["time"] = moment.utc(moment.tz(element["time"],'MMM Do YYYY, h:mm a', "Australia/Brisbane")).format('MMM Do YYYY, h:mm a')
          }
          if(warndb["guilds"]["612117634909208576"]["last_warn_id"]){
          warndb["guilds"]["612117634909208576"]["last_warn_id"] = warndb["guilds"]["612117634909208576"]["last_warn_id"] + 1
        }else{
          warndb["guilds"]["612117634909208576"]["last_warn_id"] = 1
        }
          element["warn_id"] = warndb["guilds"]["612117634909208576"]["last_warn_id"]
          console.log(element["warn_id"])
        });
      }
      if(warndb["guilds"]["612117634909208576"][`users`][id]["muted"]){
        delete warndb["guilds"]["612117634909208576"][`users`][id]["muted"]
      }

      let warning = {warnings}
     await members_adm.updateMany({"_id":id},{"$set": warning},{"upsert":true});

    }

  } finally {
    // Ensures that the client will close when you finish/error
  }
}

async function warn_add(target_id, executor_id, points, reason){
  const database = client.db('kamaibot');
  const member_management = database.collection('member_management');

  try {
  
    await member_management.updateOne({"_id":0},{"$inc":{"last_warn_id": 1}},{"upsert":true})   
    
  }catch{
    return false

  }finally{

    try{

      let doc = await member_management.findOne({"_id":0})
      let insert = {"warnings":{"warn_id": doc["last_warn_id"],"points":points, "reason": reason, "issuer": executor_id,"time": moment.utc().format('MMM Do YYYY, h:mm a')}}
      let x = await member_management.updateOne({"_id":target_id},{"$push":insert},{"upsert":true})
      return true

    }catch(err){
      return false
    
    } 
  }
}


async function warn_remove(warn_id){
  warn_id=parseInt(warn_id)
  const database = client.db('kamaibot');
  const member_management = database.collection('member_management');
  try {
    
    let deleted_doc = await member_management.findOneAndUpdate({"warnings" : {"$elemMatch": {"warn_id":warn_id}}},{"$unset":{"warnings.$" : {"warn_id":warn_id}}})
    if(deleted_doc["value"]["warnings"]){
      return deleted_doc["value"]["_id"]
    }
  }catch(err){
    return false
  } finally {
    // Ensures that the client will close when you finish/error
  }
}

async function warn_list(user_id){

  user_id = user_id.toString()
  try {
    const database = client.db('kamaibot');
    const member_management = database.collection('member_management');
    let doc = await member_management.findOne({"_id":user_id})
    var Total_points = 0
    if(doc && doc["warnings"]){
      var warns = ""
      warns += `Advertencias (${doc["warnings"].length})\n`

      doc["warnings"].forEach((element, i) => {
        if(element){
          Total_points += parseInt(element["points"])
          warns += `**${i+1} - ${element["reason"]}** (id: ${element["warn_id"]})`
          warns +=  `\n↳ ${element["points"]} ponto${(!(element["points"] == 1)) ? "s" : ""} | Por: <@${element["issuer"]}>| Em: ${moment.tz(element["time"],'MMM Do YYYY, h:mm a', 'America/Sao_Paulo').format(`DD-MM-YYYY HH:mm`)}\n`
  
        }
      });

    }else{
      return false
    }

  }catch(err){
    console.log(err)
  } finally {
    let warnings = {"points":Total_points, "warns":warns}

    return warnings
  }
}

async function SetUnmute(id) {
    try {              
      const database = client.db('kamaibot');
      const members_adm = database.collection('member_management');
      let config = {"upsert":true}
      let insert = {"$set":{"_id":id,"muted":false,"duration":null,"since":null}}
      let query = {"_id":id}
      await members_adm.updateOne(query, insert, config);
   
    } finally {
      // Ensures that the client will close when you finish/error
    }
  }

  async function CheckMute(id) {
    try {
        const database = client.db('kamaibot');
        const members_adm = database.collection('member_management');
        let query = {"_id":id}
        let doc = await members_adm.findOne(query);
        if(doc && doc.muted){
            if(doc.muted)
          return true
        }else{
          return false
        }
    } finally {
      // Ensures that the client will close when you finish/error
    }
  }

