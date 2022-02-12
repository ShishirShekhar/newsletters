// config dotenv file
require("dotenv").config()

// import required modules
const express = require("express");
const bodyParser  = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

// config app
const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({"extended": true}));

// config mailchimp
mailchimp.setConfig({
    apiKey: process.env.APIKEY,
    server: process.env.SERVER
});


// get home route
app.get("/", function(req, res) {
    res.sendFile(__dirname + "/public/pages/signup.html");
});


// post on home route
app.post("/", function(req, res) {
    const listId = process.env.LIST_ID;
    
    const subscribingUser = {
        firstName: req.body.fName,
        lastName: req.body.lName,
        email: req.body.email
    };

    async function run() {
        const response = await mailchimp.lists.addListMember(listId, {
            email_address: subscribingUser.email,
            status: "subscribed",
            merge_fields: {
                FNAME: subscribingUser.firstName,
                LNAME: subscribingUser.lastName
            }
        });
      
        console.log(
          `Successfully added contact as an audience member. The contact's id is ${
            response.id
          }.`
        );
    }

    run().catch(function(error) {
        console.log(error.status);
        res.sendFile(__dirname + "/public/pages/failure.html");
    });
});


// failure post route
app.post("/failure", function(req, res) {
    res.sendFile(__dirname + "/public/pages/signup.html")
});


// host the app
app.listen(3000, function() {
    console.log("Server is up and running at port 3000");
});
