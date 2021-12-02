const schedule = require('node-schedule');
const config_secret = require("../config_secret")
const uri = `mongodb+srv://kamaibot:${config_secret.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const fs = require('fs');

const MongodbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Replace the uri string with your MongoDB deployment's connection string.

const job = schedule.scheduleJob('0 4 * * *', async function(){
  const nodejsondb = require("node-json-db").JsonDB;



    try{
      console.log("Backup iniciado " + Date.now().toString() )
      await MongodbClient.connect()

      const database = MongodbClient.db('kamaibot');
      const members_adm = database.collection('member_management');
      const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);
      
      const activitypoems = database.collection('activitypoems');
      const activitypoemsb = new nodejsondb(`./mongo_backup/activitypoems`, true, true);
      
      const activitykaraoke = database.collection('activitykaraoke');
      const activitykaraokeb = new nodejsondb(`./mongo_backup/activitykaraoke`, true, true);
      
      const activityarte = database.collection('activityarte');
      const activityarteb = new nodejsondb(`./mongo_backup/activityarte`, true, true);
      

      await members_adm.find().forEach(doc=>{
        members_admb.push(`/${doc["_id"]}/`, doc, true)

      })

      await activitypoems.find().forEach(doc=>{
        activitypoemsb.push(`/${doc["_id"]}/`, doc, true)

      })

      await activitykaraoke.find().forEach(doc=>{
        activitykaraokeb.push(`/${doc["_id"]}/`, doc, true)

      })

      await activityarte.find().forEach(doc=>{
        activityarteb.push(`/${doc["_id"]}/`, doc, true)

      })

      const zipper = require('zip-local');

      zipper.sync.zip("./").compress().save("./backup.zip");

      const path = require('path')
      var nodemailer = require('nodemailer'); 

      const mail = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config_secret.email.backupSender.email,
            pass: config_secret.email.backupSender.password
          }
        });


      var Transfer = require('transfer-sh')
    
      /* Encrypt and Upload */
      new Transfer(path.resolve(__dirname, './backup.zip'))
        .upload()
        .then(function (link) { 
          const mailOptions = {
            from: 'eliaskamel2021@gmail.com',
            to: ['eliaskamel2011@gmail.com', "Kamaitachisocial@gmail.com"],
            subject: 'backup diario',
            text: link,
            };
      
          mail.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
            });

            fs.unlink('./backup.zip')
          })
        .catch(function (err) { console.log(err) })


      
      console.log("Backup Terminado com sucesso! " + Date.now().toString())

    }catch(err){
        console.log("Ouve um erro no backup")
        console.log(err)
    }
})




// MongodbClient.connect().then(async a=>{
//   console.log(2)
//    const nodejsondb = require("node-json-db").JsonDB;

//   const database = MongodbClient.db('kamaibot')
  
//   const members_adm = database.collection('member_management');
//   const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);

//   const obj = await members_admb.getObject("/")

//   const docs = await members_adm.find().toArray()
//   console.log("baixou tudo")

 
//   const deleteKeys = []

//   for(let key of docs){

//     if( typeof(key.id) != typeof("a") )  key._id = key._id.toString()
    
//     if( !key?._id.toString().match(/\d\d\d\d\d\d\d\d\d\d\d\d/) && key._id != "0"){
//       console.log(key._id)
//       deleteKeys.push(new ObjectId(key._id))
//     }
//   }
//   console.log(deleteKeys)
//   await members_adm.deleteMany({_id:{$in:deleteKeys}})

//   console.log("terminou")
//   // members_adm.deleteMany({_id:{$in:deleteKeys}})
//   // console.log(4)
//   // const database = MongodbClient.db('kamaibot');
//   // const members_adm = database.collection('member_management');
//   // const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);
//   // await members_adm.find().forEach(doc=>{
//   //   members_admb.push(`/${doc["_id"]}/`, doc, true)

//   // })

//   // console.log(1)
// })

