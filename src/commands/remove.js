const { EmbedBuilder } = require('@discordjs/builders')
const Database = require('better-sqlite3')
const fs = require('fs')
const db = new Database('database.db', {fileMustExist: true})

function remove(interaction){
    const examcnt = db
    .prepare('SELECT COUNT(*) FROM exams WHERE guildid = @guildid')
    .get(interaction.guildId)
    if(examcnt === 0){
        const embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('No upcoming exams')
        .setDescription('There are no upcoming exams')
        interaction.reply({embeds: [embed]})
    }
    else if(examcnt < interaction.options.get('id').value){
        embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('There aren\'t that many exams')
        if(examcnt === 1){
            embed.setDescription('There is only 1 exam')
        }
        else{
            embed.addFields({
                name: '',
                value: `There are only ${examcnt} exams`
            })
        }
        interaction.reply({embeds: [embed]})
    }
    else if(interaction.options.get('id').value <= 0){
        const embed = new EmbedBuilder()
        .setColor(0xD80000)
        .setTitle('Invalid id')
        .setDescription('Id mustn\'t be 0 or negative')
        interaction.reply({embeds: [embed]})
    }
    else{
        db
        .prepare('DELETE FROM (SELECT * FROM exams WHERE guildid = ? ORDER BY year, month, day) WHERE ROW_NUMBER() = ?')
        .run(interaction.guildId, interaction.options.get('id'))
        const embed = new EmbedBuilder()
        .setColor(0x00C000)
        .setTitle('Removed exam')
        .addFields({
            name: '',
            value: `Successfully removed ${subj} exam`
        })
        interaction.reply({embeds: [embed]})
    }
}
module.exports = {remove}