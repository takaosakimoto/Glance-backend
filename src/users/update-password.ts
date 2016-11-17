import {Users} from "./users";
import {UserCrypto} from "./user_crypto";


export function updatePassword(users: Users, crypto: UserCrypto) {
    return (req, res) => {

        function validateBody(body:any) {
            return body &&
                body.current_password && body.current_password.length > 0 &&
                body.new_password && body.new_password.length > 0
        }

        function updatePasswordHash(hash) {
            users.updatePassword(req.user.id, hash).then(() => {
                res.sendStatus(200);
            }).catch((err) => {
                console.error("Failed to update password", req.body, err);
                res.sendStatus(500);
            });
        }

        function hashAndUpdatePassword(confirmed) {
            if (!confirmed) {
                console.log("Incorrect password");
                return res.sendStatus(401);
            }
            crypto.hash(req.body.new_password)
                .then(updatePasswordHash)
                .catch(err => {
                    console.log("Failed to hash new password", err)
                })
        }

        function confirmAndUpdatePassword(user) {
            crypto.verify(user.password, req.body.current_password)
                .then(hashAndUpdatePassword)
                .catch((err) => {
                    console.log("Failed to verify password", err);
                    res.sendStatus(500);
                })
        }

        if (!req.user) {
            console.log("Attempted to update password but not logged in");
            return res.sendStatus(404);
        }

        if (!validateBody(req.body)) {
            console.log("Given invalid body", req.body);
            return res.sendStatus(400);
        }

        users.findById(req.user.id)
            .then(confirmAndUpdatePassword)
            .catch(err => {
                console.log("Failed to look up user", err);
                res.sendStatus(500);
            })
    }
}
