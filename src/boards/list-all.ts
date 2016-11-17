import {Boards} from "./boards"

export function listAll(boards: Boards) {
    return (req, res) => {
        if (!req.user) {
            console.log("Can't list all boards unless you're logged in");
            res.sendStatus(401);
        } else {
            boards.listAll(req.user.id).then(boards => {
                res.send({result: boards});
            }).catch(err => {
                console.log("Failed ot return boards", err);
                res.sendStatus(500)
            });
        }
    }
}
