import {Users} from "./users";
import {UserCrypto} from "./user_crypto";
//import {emailjs} from "emailjs/email";
var email = require("emailjs/email");
export function verifyEmail(users: Users, crypto: UserCrypto) {
    return (req, res) => {

        function validateBody(body:any) {
            return body &&
                body.username && body.username.length > 0 &&
                body.password && body.password.length > 0
        }

        function sendverifycode(req, res) {

            

            function sendcode(req, res) {
                var verifiedcode = Math.floor(Math.random() * (99999 - 10000)) + 10001;
                var server = email.server.connect({
                    user:"glance@glanceon.com",
                    password:"beggary-apache-habitat",
                    host:"smtp.gmail.com",
                    port: 465,
                    ssl: true
                });

                server.send({
                    text: "Here is your password reset code: "+ verifiedcode+ "\nPlease go back to Glance and enter this code.",
                    from: "glance@glanceon.com",
                    to: req.body.username,
                    subject: "Reset Password"
                }, function(err, message){ 
                    if(err){
                        console.log("error="+err);
                           res.sendStatus(402);
                    } else{
                        res.send({'code': verifiedcode});
                    }
                });

            }

            users.findByEmail(req.body.username).then((user) => {
                if (user !== null) {
                    sendcode(req, res);
                } else {
                    console.log("can't find user of ", req.body.username);
                    res.sendStatus(401);
                    
                }
            }).catch((err) => {
                console.error("Lookup failed", err);
                res.sendStatus(300);
            });

           // sendcode(req, res);
        }

        if (!validateBody(req.body)) {
            console.log("Given invalid body", req.body);
            return res.sendStatus(400);
        }

        sendverifycode(req, res);

        
    }
}
