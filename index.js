const source = require('./source');

const lines = source.split(/\d{3}[A-Z]{3,4} /).map(l => l.substring(0, l.indexOf('\n')));

const res = lines.filter(l => l.length > 0).map(l => {
    const parts = l.split('http://');
    const title = parts[0];
    const url = `http://${parts[1]}`;
    const index = l.substring(l.lastIndexOf('/') + 1).replace('.pdf', '');
    
    return { index, title, url }
});

console.log(res.slice(100, 110));