const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 3001;
const https = require("https");

//Tesla specific
const urlAuth = "fleet-auth.prd.vn.cloud.tesla.com";
const urlData = "fleet-api.prd.eu.vn.cloud.tesla.com";

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
    if (!req.query["password"]) {
        res.send("Internal server error");
        return;
    } else if (req.query["password"] !== process.env.PASSWORD) {
        res.send("Internal server error");
        return;
    }

    //Tesla requires this to be query
    const paramsObj = new URLSearchParams({
        'client_id': process.env.CLIENT_ID,
        'scope': 'openid vehicle_device_data vehicle_cmds offline_access',
        'locale': 'en-US',
        'prompt': 'login',
        'redirect_uri': 'https://' + req.get('host') + '/auth/callback',
        'response_type': 'code',
        'state': (Math.floor(Math.random() * 10))
    });
  
    res.redirect('https://' + urlAuth + '/oauth2/v3/authorize' + "?" + paramsObj.toString());
})

app.get('/auth/callback', (req, res) => {
    if (!req.query["code"]) { return; }
    
    callback_code=req.query.code.toString();
    
    const paramsObj = new URLSearchParams({
        'grant_type': 'authorization_code',
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'code': callback_code,
        'redirect_uri': 'https://' + req.get('host') + '/auth/callback',
        'audience': 'https://' + urlData
    });
    
    const options = {
        method: 'POST',
        host: urlAuth,
        path: '/oauth2/v3/token',
        headers: { 'content-type': 'application/x-www-form-urlencoded',
                    'content-length': paramsObj.toString().replace("\*","%2A").length, }
    };
    
    const newreq = https.request(options, (newres) => {
        let data = '';

        newres.on('data', (chunk) => {
            data += chunk;
        });

        // Ending the response 
        newres.on('end', () => {
            console.log('Successful response from Tesla.');
            res.send('<h1>MMM-Tesla3</h1>' +
                     '<br><p>Paste (overwrite) token.json in base directory with the following.</p><br><br>' +
                     '<div style="inline-size: 100%; overflow-wrap: break-word;">' + data + '<br><br></div>');
        });
    }).on("error", (err) => {
        console.log("Error: ", err)
    });
    
    newreq.write(paramsObj.toString().replace("\*","%2A"));
    newreq.end();
});

const server = app.listen(port, function() {
    console.log("Listening on " + port);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
