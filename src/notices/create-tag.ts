import {Notices} from "./notices"
import {BoardUsers} from "../boards/board-users";
import {NoticeTags} from "./notice-tags"
export function createtag(boardUsers: BoardUsers, noticetags: NoticeTags) {

  function validateBody(body:any) {
         return body && body.boardid >0 && body.noticeid >0 && body.name.length > 0
     }
    function doinserttag(body: any, res) {
        noticetags
            .add(body.noticeid, body.boardid, body.name)
            .then(() => {
                console.log("inserttag");
                res.sendStatus(200);
            }).catch(err => {
                console.log("Failed to do insert", err, body);
                res.sendStatus(500)
            });
    }

    return (req, res) => {
        if (!req.user) {
            console.log("Can't update unless you're logged in");
            res.sendStatus(401);
        } else if (!validateBody(req.body)) {
            console.log("Invalid update request");
            res.sendStatus(400);
        } else {
            doinserttag(req.body, res);
        }
    }







  // function validateBody(body:any) {
  //       return body && body.boardid >0 && body.noticeid >0 && body.name.length > 0
  //   }
  //   return (req, res) => {
  //       if (!req.body.boardid) {
  //           console.log("Can't list all boards unless you're logged in");
  //           res.sendStatus(401);
  //       } else {
  //           noticetags.add(req.body.noticeid, req.body.boardid, req.body.name).then(() => {
  //              console.log("Added noticetag to notice");
  //            	res.sendStatus(200);
  //           }).catch(err => {
  //               console.error("Failed to add noticetag to notice", err);
  //          		res.sendStatus(500);
  //           });
  //       }
  //   }
}
