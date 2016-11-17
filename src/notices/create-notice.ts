import {Notices} from "./notices"
import {BoardUsers} from "../boards/board-users";
import {Devicetokens} from "../users/push";
import {Boards} from "../boards/boards";
var ionicPushServer = require('ionic-push-server');


export function createNotice(boardUsers: BoardUsers, notices: Notices, usertoken: Devicetokens, boards: Boards) {

    function validateBody(body) {
        return body &&
            body.board_id > 0 &&
            body.title && body.title.length > 0 &&
            (!body.occurs_at || Date.parse(body.occurs_at) > 0) &&
            (!body.finishes_at || Date.parse(body.finishes_at) > 0) &&
            (!body.noticeDate || Date.parse(body.noticeDate) > 0)
    }
    
    function doCreate(req, res) {
        notices.create(req.body.board_id, req.body.title, req.user.id, req.body.occurs_at, req.body.finishes_at, 
            req.body.location_text, req.body.description, req.body.url, req.body.noticeDate, req.body.noticestate)
            .then((notice_id) => {
                console.log("Added notice to board", req.user.id, req.body.board_id, notice_id);
                if(req.body.title !="bbbb"){
                    sendpush(req, res);
                }
                res.send({result: {id: notice_id}});
            }).catch((err) => {
                console.error("Failed to add notice to board", req.body.board_id, req.user.id, err);
                res.sendStatus(500);
            });
    }

    function sendpush(req, res){

        usertoken.gettokens().then((tokens) => {
            var credentials = {
                IonicApplicationID : "eb533d7b",
                IonicApplicationAPItoken : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1NmU1NDExZi1kZDJkLTRiMmMtODQ2Yi1lZDU3OGU1YmUwM2EifQ.ukbttkkpUlpy1Td2I3mJlsq2se4AniaYT3YmFQYpWHY"
            };
            var realtokens=[];

            for(var aa=0; aa< tokens.length; aa++){
                realtokens.push(tokens[aa].token);
            }
 
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
               ionicPushServer(credentials, notification);
            }).catch((err) => {
                console.log(err);
               // res.send({result: {error:err}});
            });
        }).catch((err) => {
            res.sendStatus(502);
        })

        // var credentials = {
        //     IonicApplicationID : "eb533d7b",
        //     IonicApplicationAPItoken : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI1ZDAzZWMzOC04MWYzLTRjZjktYmYwYS01MmIwMmMwMDExMGIifQ.fb0mT8Ng-0bG7rHraLNfTc48LIGIpUCT8Q8QO_U8xE8"
        // };
 
        // var notification = {
        //   "tokens": ['f93597f5403413f0e8344454e80916a0de0b251daf209fc1be0e2a8839aa9e9d'],
        //   "profile": "push",
        //   "notification": {
        //       "title": "Hi",
        //       "message": "Hello world!",
        //       "android": {
        //           "title": "Hey",
        //           "message": "Hello Android!"
        //        },
        //         "ios": {
        //               "title": "Howdy",
        //                "message": "Hello iOS!"
        //         } 
        //   }
        // };
 
        // ionicPushServer(credentials, notification);
    }

    function doCreateIfManager(req, res) {
        boardUsers.isManager(req.body.board_id, req.user.id).then((isManager) => {
            if (!isManager) {
                console.log("User is not a manager of this board", req.body.board_id, req.user.id);
                return res.sendStatus(401);
            }
            doCreate(req, res);
        }).catch((err) => {
            console.error("Failed to determine if user is a manager", req.body.board_id, req.user.id, err);
            res.sendStatus(500);
        });
    }

    return (req, res) => {
        
        if (req.user == null) {
            console.log("User is not logged in");
            return res.sendStatus(401);
        }

        if (!validateBody(req.body)) {
            console.log("Given invalid body", req.body);
            return res.sendStatus(400);
        }

        doCreateIfManager(req, res);
    }
}
