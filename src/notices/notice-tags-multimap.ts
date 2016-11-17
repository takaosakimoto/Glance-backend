
import {NoticeTags, NoticeTag} from "./notice-tags";

/** Turns a series of notice_tags columns into {notice_id: [tag, ..]} objects */
export class NoticeTagsMultiMap {

    constructor(protected noticeTags: NoticeTags) {
    }

    static aggregateTags(tags: Array<NoticeTag>): any {
        let results = {};
        for(let tag of tags) {
            if (!tag.notice_id || !tag.name) {
                continue;
            }
            let result = results[tag.notice_id];
            if (typeof result == 'undefined') {
                result = [];
                results[tag.notice_id] = result;
            }
            result.push(tag.name);
        }
        return results;
    }
    
    findForUser(user_id: number): Promise<Map<number, Array<string>>> {
        return new Promise((resolve, reject) => {
            this.noticeTags
                .findForUser(user_id)
                .then(tags => {
                    resolve(NoticeTagsMultiMap.aggregateTags(tags));
                }).catch(reject);
        });
    }
    
}
