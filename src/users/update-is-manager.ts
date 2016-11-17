import {Users} from "./users";

export function updateIsManager(users: Users) {
    return (req, res) => {

        function successfulUpdate() {
            console.log("Updated is_manager for user", req.params.id, req.body.value);
            res.sendStatus(200);
        }

        function unsuccessfulUpdate(err) {
            console.error("Failed to update is_manager", req.params.id, req.body.value, err);
            res.sendStatus(500);
        }

        if (!req.user || !req.user.is_admin) {
            console.log("Attempted to set is_manager flag but not logged in as an admin", req.body, req.user);
            res.sendStatus(401);
        } else if (typeof req.body.value !== 'boolean') {
            console.log("Attempted to set is_manager flag but given a non-bool value in body", req.body);
            res.sendStatus(400);
        } else {
            users.updateIsManager(req.params.id, req.body.value)
                .then(successfulUpdate)
                .catch(unsuccessfulUpdate);
        }
    }
}
