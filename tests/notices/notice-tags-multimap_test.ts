/// <reference path="../../typings/globals/mocha/index.d.ts" />
var assert = require('chai').assert;

import {NoticeTagsMultiMap} from "../../src/notices/notice-tags-multimap";
describe('NoticeTagsMultimap', () => {

    let fn = NoticeTagsMultiMap.aggregateTags;

    it("doesn't aggregate empty tags", () => {
        assert.deepEqual(fn([]), {});
    });

    it("aggregates single tags", () => {
        let result = fn([
            {
                board_id: 1,
                notice_id: 1,
                name: "apple"
            }
        ]);
        assert.deepEqual(result, {1: ["apple"]});
    });

    it("aggregates single tags used twice", () => {
        let result = fn([
            {
                board_id: 1,
                notice_id: 1,
                name: "apple"
            },
            {
                board_id: 1,
                notice_id: 1,
                name: "banana"
            }
        ]);
        assert.deepEqual(result, {1: ["apple", "banana"]});
    });


    it("aggregates multiple tags", () => {
        let result = fn([
            {
                board_id: 1,
                notice_id: 1,
                name: "apple"
            },
            {
                board_id: 2,
                notice_id: 2,
                name: "lemon"
            },
            {
                board_id: 1,
                notice_id: 1,
                name: "banana"
            }
        ]);
        assert.deepEqual(result, {1: ["apple", "banana"], 2: ["lemon"]});
    });

});
