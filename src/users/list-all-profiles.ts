import {Users} from "./users";

export function listAllProfiles(users: Users) {
    return (req, res) => {
        if (!req.user || !req.user.is_admin) {
            console.log("Can't list all users unless you're an admin", req.user);
            res.sendStatus(401);
        } else {
            users.listAllProfiles()
                .then((rows) => {
                    console.log("Returned profiles", rows.length);
                    res.send({result: rows});
                }).catch((err) => {
                console.log("Failed ot return profiles", err);
                res.sendStatus(500)
            });
        }
    }
}
