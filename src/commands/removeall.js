const fs = require('fs')

function removeall(interaction, path){
    cf = JSON.parse(fs.readFileSync(path))
    cf.exams = []
    fs.writeFileSync(path, JSON.stringify(cf))
    interaction.reply('Removed all exams')
}
module.exports = {removeall}