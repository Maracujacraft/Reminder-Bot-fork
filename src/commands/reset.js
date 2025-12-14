const fs = require('fs')

function reset(interaction, path){
    fs.rmSync(path)
    interaction.reply('Reset the config')
}
module.exports = {reset}