const index  = require("../index");
const config = require("../config");
const {client}= require("../index");
const fs = require("fs");

client.on('voiceStateUpdate', (oldState, newState) => {
    
    if(newState.channel){
    if(newState.member.id==config.musica.bot1){
        fs.writeFile('bot1.txt',`1`, function(err, result) {
            if(err) console.log('error', err);
          });

         
    }}
    
    if(newState.channel==null){
    if(oldState.member.id==config.musica.bot1){
        fs.writeFile('bot1.txt',`0`, function(err, result) {
            if(err) console.log('error', err);
          });
    }}

    if(newState.channel){
        if(newState.member.id==config.musica.bot2){
            fs.writeFile('bot2.txt',`1`, function(err, result) {
                if(err) console.log('error', err);
              });
        }}
        if(newState.channel==null){
        if(oldState.member.id==config.musica.bot2){
            fs.writeFile('bot2.txt',`0`, function(err, result) {
                if(err) console.log('error', err);
              });
        }}

        if(newState.channel){
            if(newState.member.id==config.musica.bot3){
                fs.writeFile('bot3.txt',`1`, function(err, result) {
                    if(err) console.log('error', err);
                  })
            }}
            if(newState.channel==null){
            if(oldState.member.id==config.musica.bot3){
                fs.writeFile('bot3.txt',`0`, function(err, result) {
                    if(err) console.log('error', err);
                  })
            }}

            if(newState.channel){
                if(newState.member.id==config.musica.bot4){
                    fs.writeFile('bot4.txt',`1`, function(err, result) {
                        if(err) console.log('error', err);
                      })
                }}
                if(newState.channel==null){
                if(oldState.member.id==config.musica.bot4){
                    fs.writeFile('bot4.txt',`0`, function(err, result) {
                        if(err) console.log('error', err);
                      })
                }}


})