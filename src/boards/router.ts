import {Boards} from "./boards"
import {BoardUsers} from "./board-users"
import * as express from "express"
import {listAll} from "./list-all";
import {subscribe} from "./subscribe";
import {unsubscribe} from "./unsubscribe";
import {updateBoard} from "./update-board";
import {createBoard} from "./create-board";
import {uploadimage} from "./uploadimage";
import {updateimage} from "./updateimage";
//import {addTag, removeTag} from "./tag-edit";
import {addTag} from "./tag-edit";
import {removeboardtag} from "./remove-boardtag";
import {listtags} from "./listtags";
import {UserTags} from "./user-tags";
import {BoardTags} from "./board-tags";
import {adduserTag, findsusertag} from "./edit-usertags";
import {getnumberofusers} from "./getcountofusers";


export function router(boards: Boards, boardUsers: BoardUsers, boardTags: BoardTags, userTags: UserTags) {

    var router = express.Router();

    router.route("/")
        .get(listAll(boards))
        .post(createBoard(boards, boardUsers));

    router.post("/uploadimage", uploadimage(boards));

    router.put("/:board_id", updateBoard(boards, boardUsers));
    router.put("/uploadimage/:board_id", updateimage(boards));

    router.route("/:board_id/users/current")
        .put(subscribe(boardUsers))
        .delete(unsubscribe(boardUsers));
    router.route("/:board_id/tags/:name")
        .put(addTag(boardUsers, boardTags))
        .delete(removeboardtag(boardUsers, boardTags));

    // router.route("/:board_id/tags/:name")
    //     .put(addTag(boardUsers, boardTags))
    //     .delete(removeTag(boardUsers, boardTags));
   //router.put("/:board_id/tags/remove", removeboardtag(boardUsers, boardTags));
        
    router.route("/:board_id/tags/find")
        .post(listtags(boardTags));

    router.route("/usertags/add")
        .put(adduserTag(boardUsers, userTags));
    router.route("/getnumbers")
        .post(getnumberofusers(boardUsers));
    
    return router;
}
