import {Devicetokens} from "./push"
import {Users} from "./users";

export function register_token(users: Users, tokens: Devicetokens) {
    function validateBody(body:any) {
        return body && body.token
    }

    function registertoekn(req, res, newid){
            tokens.register(req.user.id, req.body.token, newid)
            .then((id) => {
                console.log("Registered Token");
                res.send({'data': {id: id}});
                
            }).catch(err => {
                console.log("Failed to do registertoken", err);
                res.sendStatus(503)
            });
            // res.send({'data': {id: req.user.id, token: req.body.token}});
        }
    function getmaxid(req, res){
        tokens.getmaxid().then((id) => {
               registertoekn(req, res, id[0].max);
            //  res.send({'data': {id: id}});
           //   res.send({'data': {id: id[0].max}});
        }).catch(err => {
                console.log("Failed to do registertoken", err);
                res.sendStatus(504)
        });
    }


    return (req, res) => {
        if (!req.user) {
            console.log("Can't update unless you're a manager");
            return res.sendStatus(401);
        } else if (!validateBody(req.body)) {
            console.log("Invalid create body", req.body);
            return res.sendStatus(400);
        }

        tokens.finduserBytoken(req.body.token).then((userid) => {

                if (userid[0] == null) {
                    getmaxid(req, res);
                } else if (userid[0].user_id != req.user.id) {
                    tokens.updateuserid(req.body.token, req.user.id, userid[0].id).then(() => {
                       res.send({'data': {id: 'update'}});
                       //   res.send({'data': {id: id[0].max}});
                    }).catch(err => {
                        console.log("Failed to do registertoken", err);
                        res.sendStatus(504)
                    });
                } else{
                    res.send({'data': {id: 'exist'}});
                }
                // res.send({'data': {id: userid}});
            }).catch((err) => {
                console.error("token failed", err);
                res.sendStatus(501);
            });

        


        
    }
}
