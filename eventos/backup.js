const schedule = require('node-schedule');
require('dotenv').config();
const uri = `mongodb+srv://kamaibot:${process.env.mongo_password}@cluster0.ysdvr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const { MongoClient } = require("mongodb");
const fs = require('fs');
const logger = require('../utils/logger');

const MongodbClient = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Replace the uri string with your MongoDB deployment's connection string.

const job = schedule.scheduleJob('0 3 * * *', async function(){
  const nodejsondb = require("node-json-db").JsonDB;
    try{
      logger.info("Backup iniciado " + new Date())
      await MongodbClient.connect()

      const database = MongodbClient.db('kamaibot');
      const members_adm = database.collection('member_management');
      const members_admb = new nodejsondb(`./mongo_backup/members_adm`, false, true);
      
      const activitypoems = database.collection('activitypoems');
      const activitypoemsb = new nodejsondb(`./mongo_backup/activitypoems`, false, true);
      
      const activitykaraoke = database.collection('activitykaraoke');
      const activitykaraokeb = new nodejsondb(`./mongo_backup/activitykaraoke`, false, true);
      
      const activityarte = database.collection('activityarte');
      const activityarteb = new nodejsondb(`./mongo_backup/activityarte`, false, true);
      

      const arrayMember = await members_adm.find().toArray()
      const arrayPoems = await activitypoems.find().toArray()
      const arrayKaraoke = await activitykaraoke.find().toArray()
      const arrayArte = await activityarte.find().toArray()

      logger.info("Download concluido MONGODB CONCLUIDO")
      logger.info("Salvando...")

      members_admb.resetData()
      arrayMember.forEach(doc=>{
        members_admb.push(`/${doc["_id"]}/`, doc, true)

      })
      members_admb.save()
      

      activitypoemsb.resetData()
      arrayPoems.forEach(doc=>{
        activitypoemsb.push(`/${doc["_id"]}/`, doc, true)

      })
      activitypoemsb.save()

      activitykaraokeb.resetData()
      arrayKaraoke.forEach(doc=>{
        activitykaraokeb.push(`/${doc["_id"]}/`, doc, true)

      })
      activitykaraokeb.save()

      activityarteb.resetData()
      arrayArte.forEach(doc=>{
        activityarteb.push(`/${doc["_id"]}/`, doc, true)

      })
      activityarteb.save()

      logger.info("Começando a zippar")
      
      const path = require('path')

      const zipper = require('adm-zip');
      const zip = new zipper()
      
      fs.readdirSync(`./`).filter(file => {
        if( ".git" != file && ".gitattributes"  != file && "node_modules" != file && "LICENSE" != file && "Dockerfile" != file && "docker-compose.yml" != file && "resourceRegistry.log" != file){
            if( fs.statSync(path.resolve(__dirname, `../${file}`)).isFile() ){
              zip.addLocalFile(path.resolve(__dirname, `../${file}`))
            
            }else{
              zip.addLocalFolder(path.resolve(__dirname, `../${file}`), `${file}/`)
      
            }
        }
      });
      zip.writeZip(path.resolve(__dirname, `../backup.zip`))
      
      logger.info("Arquivos zipados com sucesso")

      var nodemailer = require('nodemailer'); 

      const mail = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.emailUser,
            pass: process.env.emailPassword
          }
      });


      var Transfer = require('transfer-sh')
    
      /* Encrypt and Upload */
      new Transfer(path.resolve(__dirname, '../backup.zip'))
        .upload()
        .then(function (link) { 
          logger.info(`${link} upload terminado`)
          const mailOptions = {
            from: 'eliaskamel2021@gmail.com',
            to: ['eliaskamel2011@gmail.com', "Kamaitachisocial@gmail.com"],
            subject: 'backup diario',
            text: link,
            };
            try {
                mail.sendMail(mailOptions, function(error, info){
                if (error) {
                    delete_file(path.resolve(__dirname, '../backup.zip'))
                } else {
                    logger.info('Email enviado: ' + info.response);
                    delete_file(path.resolve(__dirname, '../backup.zip'))
                    logger.info("Arquivo removido")
                    logger.info("Backup Terminado com sucesso! " + new Date())

                }
                });
            } catch (error) {
                logger.error(error)
            }
          })
        .catch(function (err) { logger.error(err) })

    }catch(err){
      logger.error(err)
    }
})




function delete_file(path){
    try {
        fs.unlinkSync(path)
    } catch (error) {
        logger.error(error)
    }
}

module.exports = job



// MongodbClient.connect().then(async a=>{
//   logger.info(2)
//    const nodejsondb = require("node-json-db").JsonDB;

//   const database = MongodbClient.db('kamaibot')
  
//   const members_adm = database.collection('member_management');
//   const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);

//   const obj = await members_admb.getObject("/")

//   const docs = await members_adm.find().toArray()
//   logger.info("baixou tudo")

 
//   const deleteKeys = []

//   for(let key of docs){

//     if( typeof(key.id) != typeof("a") )  key._id = key._id.toString()
    
//     if( !key?._id.toString().match(/\d\d\d\d\d\d\d\d\d\d\d\d/) && key._id != "0"){
//       logger.info(key._id)
//       deleteKeys.push(new ObjectId(key._id))
//     }
//   }
//   logger.info(deleteKeys)
//   await members_adm.deleteMany({_id:{$in:deleteKeys}})

//   logger.info("terminou")
//   // members_adm.deleteMany({_id:{$in:deleteKeys}})
//   // logger.info(4)
//   // const database = MongodbClient.db('kamaibot');
//   // const members_adm = database.collection('member_management');
//   // const members_admb = new nodejsondb(`./mongo_backup/members_adm`, true, true);
//   // await members_adm.find().forEach(doc=>{
//   //   members_admb.push(`/${doc["_id"]}/`, doc, true)

//   // })

//   // logger.info(1)
// })

