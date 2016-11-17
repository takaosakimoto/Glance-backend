import {BoardUsers} from "./board-users";
import {UserTags} from "./user-tags";



export function removeuserTag(boardUsers: BoardUsers, userTags: UserTags) {
    return (req, res) => {
        if (!req.body.board_id) {
            console.log("Can't delete tag");
            res.sendStatus(401);
        } else {
            userTags.remove(req.body.board_id, req.user.id, req.body.name).then(() => {
               console.log("delete user tag");
               res.sendStatus(200);
            }).catch(err => {
                console.error("Failed to delete user", err);
                res.sendStatus(500);
            });
        }
    }
}

export function adduserTag(boardUsers: BoardUsers, userTags: UserTags) {
    return (req, res) => {
        if (!req.body.board_id) {
            console.log("Can't add tag");
            res.sendStatus(401);
        } else {
            userTags.add(req.body.board_id, req.user.id, req.body.name).then(() => {
               console.log("add user usertag");
               res.sendStatus(200);
            }).catch(err => {
                console.error("Failed to add usertag", err);
                res.sendStatus(500);
            });
        }
    }
    
}
export function findsusertag(boardUsers: BoardUsers, userTags: UserTags) {
    return (req, res) => {
        if (!req.user) {
            console.log("Can't find tag");
            res.sendStatus(401);
        } else {
            userTags.findForusertag(req.user.id).then(usertags => {
               res.send({result: usertags});
            }).catch(err => {
                console.error("Failed to find usertag", err);
                res.sendStatus(500);
            });
        }
    }
}