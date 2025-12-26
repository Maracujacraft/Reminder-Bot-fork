function spam(string, times){
    let result = ''
    for (let i = 0; i < times; i++) {
        result += string
    }
    return result
}

function channelExists(client, channelid) {
    return client.channels.fetch(channelid)
    .then(() => {
        return true
    })
    .catch(() => {
        return false
    })
}

async function listPings(args){
    let result = ''
    const pingsarr = args.pings.split(',')
    if (pingsarr[0] === ''){
        return ''
    }
    for (const pingid of pingsarr) {
        if (args.guild.pings.cache.find(x => x.id === pingid) !== undefined){
            if(args.ping){
                result += `<@&${pingid}> `
            }
            else{
                result += `@${args.guild.pings.cache.get(pingid).name} `
            }
        }
    }
    return result
}

module.exports = {spam, channelExists, listPings: listPings}