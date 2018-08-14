const http = require('http');

const server1 = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(`I'm too lazy to use express for this.\n`);
  res.write(`Oh wait, I mean hi from 3456!`);
  res.end();
}).listen(3456);

const server2 = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(`Ok, this time more effort\n`);
  res.write(`Hi from 4567!`);
  res.end();
}).listen(4567);

const server3 = http.createServer((req, res) => {
  const host = req.headers['host'];
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(`Hey buddy, thanks for visiting my site on ${host}\n`);
  res.end();
}).listen(5678);

console.log(`We're listening on 3456 AND 4567 with some really fancy apps...I tell you what we'll even throw in 5678`);
