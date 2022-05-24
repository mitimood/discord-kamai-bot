const spotifySearch = require('./searchTearmsSpotify')
const {searchVideo} = require('usetube')

async function spotifyLinkToYoutubeLinks({link, userId}){
    const terms = await spotifySearch(link)
    let videos = []

    let counter = 0
    
    await new Promise((res, rej)=>{

        setTimeout(()=> counter = terms.length ,20000)

        terms.forEach(async (term, i)=>{
            let attempts = 0

            await getVideo(term)
            async function getVideo(term){
                if(attempts >= 5) return ++counter  
                
                attempts += 1

                const srchRes = await searchVideo(term)
                            
                const srchVideos = srchRes?.videos
                            
                const video = srchVideos?.at(0)
    
                if(!video) return await getVideo(term)

                video.reqId = userId
        
                video.url = `https://youtu.be/${video.id}`
    
                videos[i] = video
                
                ++counter

                if(counter === terms.length){
                    videos = videos.filter(v=> v!=undefined)
                    res(videos)
                }
            }
        })
    })

    return videos
        
}


module.exports = spotifyLinkToYoutubeLinks