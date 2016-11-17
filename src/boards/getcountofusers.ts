import {BoardUsers} from "./board-users"

export function getnumberofusers(boardUsers: BoardUsers) {
    return (req, res) => {
        if (!req.user) {
            console.log("Can't get board users unless you're logged in");
            res.sendStatus(401);
        } else {
            boardUsers.getCountsofUsersById(req.body.boardid).then((count) => {
                res.send({result: count});
            }).catch(err => {
                console.log("Failed to subscribe", err);
                res.sendStatus(500)
            });
        }
    }
}
