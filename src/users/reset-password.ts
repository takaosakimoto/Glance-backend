import {Users} from "./users";
import {UserCrypto} from "./user_crypto";


export function resetPassword(users: Users, crypto: UserCrypto) {
    return (req, res) => {

        function validateBody(body:any) {
            return body &&
                body.username && body.username.length > 0 &&
                body.password && body.password.length > 0
        }

        function resetPass(req, res) {

            function reset(req, hash) {
                users.resetPassword(req.body.username, hash).then(() => {
                    console.log("reseted password of ", req.body.username);
                    res.sendStatus(200);
                }).catch((err) => {
                    console.error("Register failed", err);
                    res.sendStatus(500);
                });
            }

            function hashAndReset(req, res) {
                crypto.hash(req.body.password).then((hash) => {
                    reset(req, hash);
                }).catch((err) => {
                    console.error("Hashing password failed", err);
                    res.sendStatus(404);
                });

            }

            users.findByEmail(req.body.username).then((user) => {
                if (user !== null) {
                    hashAndReset(req, res);
                } else {
                    console.log("can't find user of ", req.body.username);
                    res.sendStatus(401);
                    
                }
            }).catch((err) => {
                console.error("Lookup failed", err);
                res.sendStatus(300);
            });
        }

        if (!validateBody(req.body)) {
            console.log("Given invalid body", req.body);
            return res.sendStatus(400);
        }

        resetPass(req, res);

        
    }
}
