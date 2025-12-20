const Database = require('better-sqlite3')
const { EmbedBuilder } = require('discord.js')
const db = new Database('database.db', {fileMustExist: true})

function config(interaction, rowexists){
    const t = interaction.options.get('time').value
    const isvalidtime = /^((2[0-3])|([01]\d)):[0-5]\d$/.test(t)
    embedcolor = interaction.options.get('embedcolor')?.value
    if (embedcolor === undefined){
        embedcolor = '#008000'
    }
    const isvalidcolor = /^#(\d|[A-Fa-f]){6}$/.test(embedcolor)
    embed = new EmbedBuilder()
    if (!isvalidtime){
        embed.addFields({
            name: 'Invalid time',
            value: `${t} is not a valid time in HH:MM format`
        })
    }
    if (!isvalidcolor){
        embed.addFields({
            name: 'Invalid color code',
            value: `${embedcolor} is not a valid hex color code`
        })
    }
    if(interaction.options.get('days_in_advance').value < 0){
        embed.addFields({
            name: 'Invalid value for days in advance',
            value: 'Days in advance mustn\'t be negative'
        })
    }
    if (isvalidtime && isvalidcolor){
        const values = {
            guildid: interaction.guildId,
            hour: parseInt(t.slice(0, 2)),
            minute: parseInt(t.slice(3, 5)),
            inadvance: parseInt(interaction.options.get('days_in_advance').value),
            channelid: interaction.channelId,
            embedcolor: embedcolor
        }
        if (rowexists){
            const oldguildid = db
            .prepare('SELECT channelid FROM servers WHERE guildid = @guildid')
            .get(values)
            db.transaction(() => {
                if(oldguildid !== interaction.guildId){
                    db
                    .prepare('UPDATE exams SET guildid = @guildid WHERE guildid = ?')
                    .run(values, oldguildid)
                }
                db
                .prepare('UPDATE servers SET hour = @hour, minute = @hour, inadvance = @inadvance, channelid = @channelid, embedcolor = @embedcolor WHERE guildid = @guildid')
                .run(values)
            })
        }
        else{
            db
            .prepare('INSERT INTO servers VALUES (@guildid, @hour, @minute, @inadvance, @channelid, @embedcolor)')
            .run(values)
        }
        embed
        .setColor(0x00C000)
        .setTitle('Config')
        .setDescription(`Successfully configured bot to send reminders at ${t}, ${interaction.options.get('days_in_advance').value} days in advance, with the color ${embedcolor.toUpperCase()}.`)
    }
    else{
        embed
        .setColor(0xD80000)
        .setTitle('Error')
    }
    interaction.reply({embeds: [embed]})
}
module.exports = {config}