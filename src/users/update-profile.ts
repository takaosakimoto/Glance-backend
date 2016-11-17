import {Users} from "./users";

export function updateProfile(users: Users) {
    return (req, res) => {

        function validateBody(body:any) {
            return body &&
                body.fullname && body.fullname.length > 0
        }

        if (!req.user) {
            console.log("Attempted to update profile but not logged in", req.body, req.user);
            return res.sendStatus(404);
        }

        if (!validateBody(req.body)) {
            console.log("Given invalid body", req.body);
            return res.sendStatus(400);
        }

        if (req.body.password || req.body.new_password || req.body.current_password) {
            console.log("Wrong endpoint for this password update");
            return res.sendStatus(400);
        }

        users.updateProfile(req.user.id, req.body.fullname).then(() => {
            res.sendStatus(200);
        }).catch((err) => {
            console.error("Failed to update profile", req.body, err);
            res.sendStatus(500);
        });
    }
}
