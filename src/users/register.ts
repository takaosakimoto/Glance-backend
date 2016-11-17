import {Users} from "./users";
import {UserCrypto} from "./user_crypto";

export function register(users: Users, crypto: UserCrypto) {
    return (req, res) => {

        function validateBody(body:any) {
            return body &&
                body.username && body.username.length > 0 &&
                body.password && body.password.length > 0 &&
                body.fullname && body.fullname.length > 0
        }        

        function createAccount(req, res) {

            function insert(req, res, hash) {
                users.register(req.body.username, hash, req.body.fullname).then((row) => {
                    console.log("Created", req.body.username, "as", row);
                    res.send({'data': {id: row.id}});
                }).catch((err) => {
                    console.error("Register failed", err);
                    res.sendStatus(500);
                });
            }

            function hashAndInsert(req, res) {
                crypto.hash(req.body.password).then((hash) => {
                    insert(req, res, hash)
                }).catch((err) => {
                    console.error("Hashing password failed", err);
                    res.sendStatus(500);
                });

            }

            users.findByEmail(req.body.username).then((user) => {
                if (user !== null) {
                    console.log("Duplicate registration", req.body.username);
                    res.sendStatus(401);
                } else {
                    hashAndInsert(req, res)
                }
            }).catch((err) => {
                console.error("Lookup failed", err);
                res.sendStatus(500);
            });
        }

        if (!validateBody(req.body)) {
            console.log("Given invalid body", req.body);
            return res.sendStatus(400);
        }

        createAccount(req, res)
    }
}
