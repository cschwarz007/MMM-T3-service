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
app.get('/', (req, res) => {
    res.send('Express server is running!');
});

app.use(express.static('.well-known/appspecific'));


app.listen(3000, function() {
    console.log("Listening on 3000");
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