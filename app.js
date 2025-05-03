const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3001;

//Tesla specific
const url_auth_endpoint = new URL("https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/authorize");
const url_token_endpoint = new URL("https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/token");

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
    res.redirect(url_auth_endpoint + "?" + searchparams.toString());
})

app.get('/auth/callback', (req, res, next) => {
    callback_code=req.query.code.toString() || next(err);
    
    const paramsObj = {
        'content-type': 'application/x-www-form-urlencoded',
        'grant_type': 'authorization_code',
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'code': callback_code,
        'redirect_uri': 'https://' + req.get('host') + '/auth/token',
        'audience': 'https://fleet-api.prd.na.vn.cloud.tesla.com'
    };
    
    res.redirect(url_token_endpoint + "?" + searchparams.toString().replace("*","%2A"));
});

app.get('/auth/token', (req, res, next) => {
    
    refresh_token=req.query.refresh_token.toString() || next(err);
    access_token=req.query.access_token.toString() || next(err);
    
    res.send(req.body + "\n\n" + 
             "refresh_token: " + refresh_token + "\n" + 
             "access_token: " + access_token );
});

app.get('/',(req,res) => {
    res.send(html);
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
    <title>Hey Dane!</title>
  </head>
  <body>
    <section>
      Totally functional web page, nothing to see here...
    </section>
  </body>
</html>
`