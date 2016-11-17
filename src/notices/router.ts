import * as express from "express"
import {Notices, Notice} from "./notices"
import {BoardUsers} from "../boards/board-users";
import {createNotice} from "./create-notice";
import {NoticeTags} from "./notice-tags";
import {createtag} from "./create-tag";
import {removetag} from "./remove-tag";
import {removenotice} from "./remove-notice";
import {updatenotice} from "./update-notice";
import {listnoticetags} from "./findnoticetags";
import {Mynotices} from "./mynotices";
import {Mynoticesbymanager} from "./mynoticesbymanager";
import {Devicetokens} from "../users/push";
import {UserTags} from "../boards/user-tags";
import {Boards} from "../boards/boards";
export function router(boardUsers: BoardUsers, notices: Notices, noticetags:NoticeTags, usertoken: Devicetokens, userTags: UserTags, boards: Boards) {
    var router = express.Router();
    router.post("/", createNotice(boardUsers, notices, usertoken, boards));

    router.route("/createtag")
        .put(createtag(boardUsers, noticetags));
        
    router.route("/removetag")
        .put(removetag(boardUsers, noticetags));
    router.route("/removenotice")
        .put(removenotice(boardUsers, notices));
    // router.route("/updatenotice")
    //     .put(updatenotice(boardUsers, notices, usertoken, userTags));
    router.route("/updatenotice")
        .post(updatenotice(boardUsers, notices, usertoken, userTags, boards));
    router.route("/findnoticetags")
        .post(listnoticetags(noticetags));
    router.route("/findmynotices")
        .get(Mynotices(notices));
    router.route("/managernotices")
        .get(Mynoticesbymanager(notices));
    return router;
}
