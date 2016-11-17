import * as express from "express";
import {Users} from "./users"
import {UserCrypto} from "./user_crypto"
import {listAllProfiles} from "./list-all-profiles"
import {updateIsManager} from "./update-is-manager"
import {updatePassword} from "./update-password"
import {updateProfile} from "./update-profile"
import {register} from "./register"
import {resetPassword} from "./reset-password"
import {verifyEmail} from "./verify-email"
import {Devicetokens} from "./push"
import {register_token} from "./token_register"
export function router(users: Users, crypto: UserCrypto, devicetokens: Devicetokens) {
// export function router(users: Users, crypto: UserCrypto) {
    function current(req, res) {
        if (!req.user) {
            res.sendStatus(404);
        } else {
            res.send({result: req.user});
        }
    }
    
    function deactivate(req, res) {
        req.sendStatus(500)
    }
    
    var router = express.Router();

    router.post("/", register(users, crypto));
    router.get("/", listAllProfiles(users));
    router.put("/current/password", updatePassword(users, crypto));
    router.put("/reset_password", resetPassword(users, crypto));
    router.post("/verify", verifyEmail(users, crypto));
    router.put("/current", updateProfile(users));
    router.put("/:id/is_manager", updateIsManager(users));
    router.post("/registertoken", register_token(users, devicetokens));

    router.route("/current")
        .get(current)
        .delete(deactivate);

    return router;
}
