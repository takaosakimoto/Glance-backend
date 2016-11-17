import {Notices} from "./notices"
import {BoardUsers} from "../boards/board-users";
import {NoticeTags} from "./notice-tags";
import {UserTags, UserTag} from "../boards/user-tags";
import {Devicetokens} from "../users/push";
import {Boards} from "../boards/boards";
var ionicPushServer = require('ionic-push-server');
export function updatenotice(boardUsers: BoardUsers, notices: Notices, usertoken: Devicetokens, userTags: UserTags, boards: Boards) {

     return (req, res) => {
        if (!req.body.boardid) {
            console.log("Can't delete notice unless you're logged in");
            res.sendStatus(401);
        } else {
            notices.update(req.body.noticeid, req.body.boardid, req.body.title, req.user.id, req.body.occurs_at, req.body.finishes_at, 
            req.body.location_text, req.body.description, req.body.url, req.body.noticeDate, req.body.noticestate).then(() => {
                getuserfunc(req, res);
               console.log("update notice");
            //   res.send({result: {success: 'ok'}});
               //res.sendStatus(200);
            }).catch(err => {
                console.error("Failed to update notice", err);
                res.sendStatus(500);
            });
        }
    }

    function getuserfunc(req, res){
        var userids=[];
       
        userTags.findusersbyboard(req.body.boardid).then((result) => {
            for(var jj=0; jj< result.length; jj++) {
                var count=0;
                var tags= result[jj].tags.split(',');
                for(var ii=0; ii< req.body.noticetags.length; ii++){
                    if(tags.indexOf(req.body.noticetags[ii]) > -1){
                        count++;
                    }
                }
                if(count>0) userids.push(result[jj].user_id);
            }
           // res.send({result: {success: result}});
            gettokensfunc(req, res, userids);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(405);
        })
    }

    function gettokensfunc(req, res, userids){
      //res.send({result: {success: userids}});
        usertoken.gettokensbyuserids(userids).then((tokens) => {
            var realtokens=[];

            for(var aa=0; aa< tokens.length; aa++){
                realtokens.push(tokens[aa].token);
            }

            sendpush(req, res, realtokens);
             res.send({result: {success: tokens, ids: userids}});

        }).catch((err) => {
            console.log(err);
            res.sendStatus(406);
        })
    }

    function sendpush(req, res, realtokens){
        // res.send({result: {success: realtokens}});
        var credentials = {
            IonicApplicationID : "eb533d7b",
            IonicApplicationAPItoken : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1NmU1NDExZi1kZDJkLTRiMmMtODQ2Yi1lZDU3OGU1YmUwM2EifQ.ukbttkkpUlpy1Td2I3mJlsq2se4AniaYT3YmFQYpWHY"
        };
       boards.findboardbyid(req.body.boardid).then((boardname) => {
         
          var notification = {
            "tokens": realtokens,
            "profile": "push",
            "notification": {
                "title": "Glance",
                 "message": boardname.name+"\n"+req.body.title,
                "android": {
                    "title": "Glance",
                    "message": boardname.name+"\n"+req.body.title
                 },
                  "ios": {
                        "title": "Glance",
                         "message": boardname.name+"\n"+req.body.title
                  } 
            }
           };
          // var notification = {
          //   "tokens": realtokens,
          //   "profile": "push",
          //   "notification": {
          //       "title": "Glance",
          //        "message": "aaaa",
          //       "android": {
          //           "title": "Glance",
          //           "message": "aaaaa"
          //        },
          //         "ios": {
          //               "title": "Glance",
          //                "message": "aaaaa"
          //         } 
          //   }
          //  };
           ionicPushServer(credentials, notification);
           
        }).catch((err) => {
            console.log(err);
            res.sendStatus(407);
        });
 
        
    }
}
