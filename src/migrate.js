const Database = require('better-sqlite3')
const fs = require('fs')

fs.access('database.db', (err) => {
    if(!err){
        console.log('Database already exists!')
    }
    else{
        console.log('Creating database...')
        const db = new Database('database.db')
        db.exec(`
            CREATE TABLE servers
            (
                guildid VARCHAR(25) NOT NULL PRIMARY KEY,
                hour INTEGER NOT NULL,
                minute INTEGER NOT NULL,
                inadvance INTEGER NOT NULL,
                channelid VARCHAR(25) NOT NULL,
                embedcolor INTEGER NOT NULL
            );
            CREATE TABLE exams
            (
                id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                year INTEGER NOT NULL,
                month INTEGER NOT NULL,
                day INTEGER NOT NULL,
                subject VARCHAR(30) NOT NULL,
                type VARCHAR(30) NOT NULL,
                topic VARCHAR(256) NOT NULL,
                notifiedabout BOOL NOT NULL,
                guildid VARCHAR(25) NOT NULL REFERENCES servers(guildid) ON DELETE CASCADE
            );
        `)
        console.log('Successfully created database!')
    }
})