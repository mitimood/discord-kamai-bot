const fetch = require('node-fetch')

const {getData , getPreview, getTracks, getDetails} = require('spotify-url-info')(fetch)

async function spotifySearch(url){
    const prvw = await getPreview(url)

    let terms = []
    if(prvw.type === 'playlist' || (prvw.type === 'album' || prvw.type === 'artist')){
        terms = terms.concat( await playlist(url))

    }else if(prvw.type === 'track'){
        terms.push(`${prvw.title} ${prvw.artist}`)
    
    }else{
        throw 'NO TRACKS'
    }

    return terms
}

async function playlist(url){
    let tracks = []
    
    const playlist = await getTracks(url)

    playlist.forEach(track => {
        tracks.push(`${track.name} ${track.artists[0]?.name ? track.artists[0]?.name : ""}`)
    });

    return tracks
}

module.exports = spotifySearch