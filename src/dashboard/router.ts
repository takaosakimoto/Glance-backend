import * as express from "express";
import {Notices, Notice} from "../notices";
import {Users, User} from "../users";
import {Boards, Board, BoardImage} from "../boards";
import {NoticeTagsMultiMap} from "../notices/notice-tags-multimap";
import {UserTags, UserTag} from "../boards/user-tags";
export interface Dashboard {
    boards: Array<Board>
    notices: Array<Notice>
    profile: User
    tags: Map<number, Array<string>>
    boardimages: Array<BoardImage>
    myusertags: Array<UserTag>
}

export function router(users: Users, notices: Notices, boards: Boards, tagsBag: NoticeTagsMultiMap, userTags: UserTags) {

    function getDashboardContent(req, res) {

        if (!req.user) {
            console.log("Can't list all users unless you're logged in", req.user);
            return res.sendStatus(404);
        }
        
        let myProfile = users.findProfileById(req.user.id);
        let myBoards = boards.myBoards(req.user.id);
        let myBoardsimage=boards.myBoardsimage(req.user.id);
        let myNotices = notices.myNotices(req.user.id);
        let myTags = tagsBag.findForUser(req.user.id);
        let myusertags= userTags.findForusertag(req.user.id);

        Promise.all([myBoards, myNotices, myProfile, myTags, myBoardsimage, myusertags]).then(p => {
            let dashboard: Dashboard = {
                boards: p[0],
                notices: p[1],
                profile: p[2],
                tags: p[3],
                boardimages: p[4],
                myusertags: p[5]
            };
            res.send(dashboard);
        }).catch(err => {
            console.log("Failed to get dashboard content", err);
            res.sendStatus(500);
        })
    }

    var router = express.Router();
    router.get("/", getDashboardContent);
    return router;
}
