const {fetch} = require('cross-fetch');
const { searchVideo } = require('usetube');
const config = require('../config');

async function youtubeVideos ({link,userId}){
    let terms = []

    const youtubeList = /(\?|&)list=/i
    const youtubeRegex = /^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/

    let youtubeId;

    let isWord = false

    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?Q))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length==11)? match[7] : false;
    }


    if(youtubeRegex.test(link)){
        if(youtubeList.test(link)){

            youtubeId = /[&?]list=([^&]+)/i.exec(link).at(1)

            await loadPage({playlistId:youtubeId})

        }else{
            youtubeId = youtube_parser(link)

            if(!youtubeId) throw 'no youtube video Link'
            terms.push(youtubeId) 
        }

    }else{
        isWord = true
        terms.push(link)
    }

    function geraUrl({playlistId, pageToken}){
        let url;
        if(pageToken){
            url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE}&pageToken=${pageToken}`
        }else{
            // url = `https://www.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails&id=${playlistId}&fields=items(etag%2Cid%2Csnippet(publishedAt%2Ctitle%2Cthumbnails(default(url))%2Ctags)%2CcontentDetails(duration))&key=${process.env.YOUTUBE}`  
            url = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${process.env.YOUTUBE}`
        }
        return url
    }

    async function loadPage({playlistId, pageToken}){
        
        if(terms.length >= config.music.playlistSize) return terms

        const res = await (await fetch(geraUrl({playlistId:playlistId, pageToken:pageToken}))).json()
        res.items.forEach(i=> terms.push(i.contentDetails.videoId))
        if(!res.nextPageToken) return terms
        
        await loadPage({playlistId:playlistId, pageToken: res.nextPageToken})

    }

    let videos = []
    let counter = 0

    setTimeout(()=> counter = terms.length , 200000)

    await new Promise((res, rej)=>{
        terms.forEach(async (term, i)=>{

            let attempts = 0

            await getVideo(isWord ? term :'https://youtu.be/' + term)
            async function getVideo(term){

                if(attempts >= 5) {
                    return ++counter  }
                
                attempts += 1

                const srchRes = await searchVideo(term)
                            
                const srchVideos = srchRes?.videos
                
                const video = srchVideos.at(0)

                if(!video) return getVideo(term)

                video.reqId = userId

                video.url = `https://youtu.be/${video.id}`
    
                videos[i] = video

                ++counter
                if(counter >= terms.length){
                    videos = videos.filter(v=> v!=undefined)
                    res(videos)
                }
            }
        })
    })
    
    return videos

}

module.exports = youtubeVideos