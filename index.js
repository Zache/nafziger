const source = require('./source');
const r = require('request-promise');
const fs = require('fs');
const path = require('path');

const api = 'http://archive.org/wayback/available?url=';
const options = (url, json = true) => ({
    proxy: 'http://localhost:8888/',
    uri: json ? api + url : url,
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

res.filter(e => e.title.indexOf('British Army') > -1 && e.title.indexOf('181') > -1).slice(0, 3).map(e => {
    r(options(e.url)).then(r => {
        if (r.archived_snapshots.closest) {
            return r.archived_snapshots.closest.url.replace('/http://', 'if_/http://');
        }
    }).then(url => {
        if(!url)
            return;
        console.log('Found: ' + e.title + ' at ' + url);

        r(options(url, false)).then(file => {

            const out = path.join(process.cwd(), 'oobs', e.title + '.pdf');
            fs.writeFileSync(out, file);
        });

    });

});