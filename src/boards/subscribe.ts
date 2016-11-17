import {BoardUsers} from "./board-users"

export function subscribe(boardUsers: BoardUsers) {
    return (req, res) => {
        if (!req.user) {
            console.log("Can't subscribe unless you're logged in");
            res.sendStatus(401);
        } else {
            boardUsers.addUser(req.params.board_id, req.user.id).then(() => {
                res.sendStatus(200);
            }).catch(err => {
                console.log("Failed to subscribe", err);
                res.sendStatus(500)
            });
        }
    }
}
