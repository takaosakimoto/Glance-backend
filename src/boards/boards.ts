
import fs = require("fs");

export interface Board {
    id: number;
    name: string;
    location_text: string;
    description: string;
    invite_code: string;
    is_member: boolean;
    is_manager: boolean;
    joined_at: Date;
    boardimage: any;
   
}

export interface BoardImage {
    board_id: number;
    boardimage: any;
}

export class Boards {

    constructor(public db) {
    }

    create(name: string, locationText: string, description: string, inviteCode: string, boardimage: any): Promise<any> {
        if (name == null) {
            throw new Error("missing name");
        } else if (locationText == null) {
            throw new Error("missing locationText");
        } else if (description == null) {
            throw new Error("missing description");
        } else if (inviteCode == null) {
            throw new Error("missing inviteCode");
        }

       // var imagename= inviteCode+ '.' +logoext;

        // if(boardlogo){
        //     var data=boardlogo.replace(/^data:image\/\w+;base64,/,'');
        //     var buf=new Buffer(data, 'base64');
        //     fs.writeFile("public/image/"+imagename,buf, {encoding: 'base64'}, function(err){

        //     });
        // }



        return this.db.one("INSERT INTO boards (name, location_text, description, invite_code, imagename) VALUES ($1, $2, $3, $4, $5) RETURNING id",
            [name, locationText, description, inviteCode, boardimage]);
    }

    createimage(id: number, boardimage:any): Promise<any> {
        if (id == null) {
            throw new Error("missing board id");
        } else if (boardimage == null) {
            throw new Error("missing boardimage");
        }
        return this.db.one("INSERT INTO board_images (board_id, board_image) VALUES ($1, $2) RETURNING id",
            [id, boardimage]);
    }

    update(id: number, name: string, locationText: string, description: string, boardimage: any): Promise<void> {
        if (name == null) {
            throw new Error("missing name");
        } else if (locationText == null) {
            throw new Error("missing locationText");
        } else if (description == null) {
            throw new Error("missing description");
        } else if (id == null) {
            throw new Error("missing id");
        }
       

        // if(boardlogo){
        //     var data=boardlogo.replace(/^data:image\/\w+;base64,/,'');
        //     var buf=new Buffer(data, 'base64');
        //     fs.writeFile("public/image/"+imagename,buf, {encoding: 'base64'}, function(err){

        //     });
        // }

        return this.db.none("UPDATE boards SET name = $2, location_text = $3, description = $4, imagename = $5 WHERE id = $1",
            [id, name, locationText, description, boardimage]);
    }

    findboardbyid(id: number): Promise<any>{
        if (id == null) {
            throw new Error("missing boardid");
        }
        return this.db.oneOrNone("SELECT name FROM boards WHERE id = $1", id);
    }

    updateimage(id: number, boardimage:any): Promise<void> {
        if (id == null) {
            throw new Error("missing boardid");
        } else if (boardimage == null) {
            throw new Error("missing boardimage");
        }

        if(this.db.oneOrNone("SELECT * FROM board_images WHERE board_id = $1", id)){
             return this.db.none("UPDATE board_images SET board_image=$2 WHERE board_id = $1",[id, boardimage]);
        } else{
            return this.db.one("INSERT INTO board_images (board_id, board_image) VALUES ($1, $2) RETURNING id",[id, boardimage]);
        }
      
       
    }

    findByCode(code: string): Promise<Board> {
        if (code == null) {
            throw new Error("missing code");
        }
        return this.db.oneOrNone("SELECT * FROM boards WHERE invite_code = $1", code);
    }

    myBoards(user: number, isManager: boolean = false): Promise<Array<Board>> {
        if (!user) {
            throw new Error("missing user id");
        }
        return this.db.manyOrNone("SELECT boards.*, board_users.is_manager, board_users.joined_at, " +
            "board_users.joined_at IS NOT NULL AS is_member FROM boards " +
            "LEFT OUTER JOIN board_users ON (board_users.board_id = boards.id AND board_users.user_id = $1 " +
            "AND ($2 = false OR is_manager = true))", [user, isManager])
    }

    myBoardsimage(user: number): Promise<Array<BoardImage>> {
        if (!user) {
            throw new Error("missing user id");
        }
        return this.db.manyOrNone("SELECT board_images.* FROM board_images LEFT OUTER JOIN board_users ON " + 
            "(board_users.board_id = board_images.board_id) WHERE board_users.user_id =$1", user);
    }
    
    listAll(user: number): Promise<Array<Board>> {
        if (!user) {
            throw new Error("missing user id");
        }
        return this.db.manyOrNone("SELECT boards.*, board_users.is_manager, board_users.joined_at, " +
            "board_users.joined_at IS NOT NULL AS is_member FROM boards " +
            "LEFT OUTER JOIN board_users ON (board_users.board_id = boards.id AND board_users.user_id = $1)", user);
    }

}
