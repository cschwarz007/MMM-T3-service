const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3001;
const https = require("https");

//Tesla specific
const url_auth = "https://fleet-auth.prd.vn.cloud.tesla.com";
const url_data = "https://fleet-api.prd.na.vn.cloud.tesla.com";

app.get('/.well-known/appspecific/:name', (req, res, next) => {
    const options = {
        root: "./",
        dotfiles: 'allow',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    const fileName = req.path;

    res.sendFile(fileName, options, (err) => {
        if (err) {
            next(err)
        } else {
            console.log('Sent:', fileName)
        }
    })
})

app.get('/auth', (req, res) => {
    //Tesla requires this to be query
    const paramsObj = {
        'client_id': process.env.CLIENT_ID,
        'scope': 'openid vehicle_device_data vehicle_cmds offline_access',
        'locale': 'en-US',
        'prompt': 'login',
        'redirect_uri': 'https://' + req.get('host') + '/auth/callback',
        'response_type': 'code',
        'state': (Math.floor(Math.random() * 10))
    };
  
    const searchparams = new URLSearchParams(paramsObj);
    res.redirect(url_auth + '/oauth2/v3/authorize' + "?" + searchparams.toString());
})

app.get('/auth/callback', (req, res) => {
    callback_code=req.query.code.toString();
    
    var urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'authorization_code');
    urlencoded.append('client_id', process.env.CLIENT_ID);
    urlencoded.append('client_secret', process.env.CLIENT_SECRET);
    urlencoded.append('code', callback_code);
    urlencoded.append('redirect_uri', 'https://' + 'mmm-t3-service.onrender.com' /*+ req.get('host')*/ + '/auth/token');
    urlencoded.append('audience', url_data);
    
    const searchparams = new URLSearchParams(urlencoded);
    res.redirect(url_auth + '/oauth2/v3/token' + "?" + searchparams.toString().replace("\*","%2A"));
    
});

app.get('/auth/token', (req, res, next) => {
    
    refresh_token=req.query.refresh_token.toString() || next(err);
    access_token=req.query.access_token.toString() || next(err);
    
    res.send(req.body + "\n\n" + 
             "refresh_token: " + refresh_token + "\n" + 
             "access_token: " + access_token );
});

//app.get('/',(req,res) => {
//    res.send(html);
//});

const server = app.listen(port, function() {
    console.log("Listening on " + port);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hey Dane!</title>
  </head>
  <body>
    <section>
      Totally functional web page, nothing to see here...
    </section>
  </body>
</html>
`