const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const fs = require('fs');
const https = require('https');
const path = require('path');

const publickey = fs.readFileSync(path.join(__dirname, '.well-known/appspecific/com.tesla.3p.public-key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '.well-known/appspecific/client-certificate.pem'), 'utf8');

const credentials = {
  key: publickey,
  cert: certificate,
};

//const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// Your Express routes and middleware here
app.get('/', (req, res) => {
    res.type('html').send(html)
    
    res.send('Express server is running with HTTPS!');
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`