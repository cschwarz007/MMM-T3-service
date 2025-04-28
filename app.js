const express = require("express");
//const fs = require('fs');
//const https = require('https');
//const path = require('path');
const app = express();
const port = process.env.PORT || 3001;

//const publickey = fs.readFileSync(path.join(__dirname, '.well-known/appspecific/com.tesla.3p.public-key.pem'), 'utf8');
//const certificate = fs.readFileSync(path.join(__dirname, '.well-known/appspecific/client-certificate.pem'), 'utf8');

/*const credentials = {
  key: publickey,
  cert: certificate,
};
*/

// Your Express routes and middleware here
app.get('.well-known/appspecific/com.tesla.3p.public-key.pem', (req, res) => {
    res.send('.well-known/appspecific/com.tesla.3p.public-key.pem');
});

app.get('.well-known/appspecific/test.html', (req, res) => {
    res.send('.well-known/appspecific/test.html');
});

const server = app.listen(port, function() {
    console.log("Listening on " + port);
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