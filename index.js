const source = require('./source');
const r = require('request-promise');
const fs = require('fs');
const path = require('path');

const api = 'http://archive.org/wayback/available?url=';
const options = (url, json = true) => ({
    proxy: 'http://localhost:8888/',
    uri: api + url,
    json,
});

const lines = source.split(/\d{3}[A-Z]{3,4} /).map(l => l.substring(0, l.indexOf('\n')));

const res = lines.filter(l => l.length > 0).map(l => {
    const parts = l.split('http://');
    const title = parts[0];
    const url = `http://${parts[1]}`;
    const index = l.substring(l.lastIndexOf('/') + 1).replace('.pdf', '');

    return { index, title, url }
});

console.log(process.cwd())

res.slice(0, 4).map(e => {
    r(options(e.url)).then(r => {
        if (r.archived_snapshots.closest) {
            const url = r.archived_snapshots.closest.url;

            r(options(url, false)).then(file => {
                console.log('Found: ' + e.title);
                
                const out = path.join(process.cwd(), e.title, '.pdf');
                fs.writeFileSync(out, file);
            })
        }
    })
});