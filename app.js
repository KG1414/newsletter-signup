// var bodyParser = require("body-parser");
const bodyParser = require("body-parser");
const express = require("express");
const https = require("https");
const favicon = require('express-favicon');

const app = express();
app.use(favicon(__dirname + '/public/images/favicon.ico'));

const myLocalPort = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
        res.status(204).end()
    }
    next();
}

app.use(ignoreFavicon);


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/failure", (req, res) => {
    res.redirect("/");
})

app.post("/", function (req, res) {

    //Form Parameters to add to Body Parameters
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    //Body Parameters
    const data = {
        update_existing: true,
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    //Path Parameters 
    const options = {
        method: "POST",
        auth: "kyle1:d9b95720d898802199cbcee1be53127a-us1"
    }

    const url = "https://us1.api.mailchimp.com/3.0/lists/c1b3338a03";

    //Request
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html")
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        })
    })
    request.write(jsonData);
    request.end();

});

app.listen(process.env.PORT || myLocalPort, () => {
    console.log(`Example app listening`);
})


// const apikey = "d9b95720d898802199cbcee1be53127a-us1";
// const listid = "c1b3338a03";
