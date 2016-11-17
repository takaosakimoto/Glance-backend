/// <reference path="../typings/globals/mocha/index.d.ts" />
import {assert} from "chai";
import {Notices} from "../src/notices/notices";
import * as healthcheck from "../src/healthcheck";
var sinon = require("sinon");
import * as request from "supertest";
import * as express from "express";

describe('healthcheck.router', function() {

    var notices = sinon.mock(Notices.prototype);
    var app = express().use("/healthcheck", healthcheck.router(notices.object));

    beforeEach(() => {
        notices.restore();
        notices = sinon.mock(Notices.prototype);
    });

    describe("GET /healtcheck", () => {

        it('Returns number of notices when the database is working', function(done) {
            notices.expects("totalNotices").once().returns(Promise.resolve({count: 100}));
            request(app)
                .get('/healthcheck')
                .set('Accept', 'application/json')
                .expect({notices: 100})
                .expect('Content-Type', /json/)
                .expect(200, done);
        });


        it('Returns number of notices when the database is failing', function(done) {
            notices.expects("totalNotices").once().returns(Promise.reject(new Error("stub")));
            request(app)
                .get('/healthcheck')
                .set('Accept', 'application/json')
                .expect(500, done);
        });

    });

});
