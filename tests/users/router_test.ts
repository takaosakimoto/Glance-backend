/// <reference path="../../typings/globals/mocha/index.d.ts" />
import * as users from "../../src/users";
var sinon = require("sinon");
import * as request from "supertest";
import * as express from "express";
import * as bodyParser from "body-parser";

describe('users.router', () => {

    var user = {
        username: "me@jondavey.net",
        password: "letmein",
        fullname: "Jon D"
    };

    var model = sinon.mock(users.Users.prototype);
    var hasher = sinon.mock(users.UserCrypto.prototype);
    var token = sinon.mock(users.Devicetokens.prototype);
    var currentUser = null;
    var app = express();

    app.use(bodyParser.json());

    app.use((req, res, next) => {
        // Mock middleware for setting the user id
        if (currentUser) {
            req.user = currentUser
        }
        next();
    });

    app.use("/users", users.router(model.object, hasher.object, token.object));

    beforeEach(() => {
        model.restore();
        model = sinon.mock(users.Users.prototype);
        hasher.restore();
        hasher = sinon.mock(users.UserCrypto.prototype);
        currentUser = null;
    });


    describe("POST /users", () => {

        it('Fails if fields are missing', function(done) {
            request(app).post('/users')
                .type('application/json')
                .expect(400, done);
        });


        it('Fails if the email is already in use', function(done) {
            model.expects("findByEmail").once().returns(Promise.resolve({
                id: 123,
                username: "me@jondavey.net"
            }));

            request(app).post('/users')
                .type('application/json')
                .send(user)
                .expect(401, done);
        });


        it('Fails if there is a problem looking up the email', function(done) {
            model.expects("findByEmail").once()
                .returns(Promise.reject(new Error("stub")));
            request(app).post('/users')
                .type('application/json')
                .send(user)
                .expect(500, done);
        });


        it('Succeeds if the user record is inserted properly', function(done) {

            model.expects("findByEmail").once().returns(Promise.resolve(null));
            model.expects("register")
                .withArgs(user.username, sinon.match.string, user.fullname)
                .returns(Promise.resolve({id: 123}));

            request(app).post('/users')
                .type('application/json')
                .send(user)
                .expect({ data: { id: 123 } })
                .expect('Content-Type', /json/)
                .expect(200, done);
        });


        it('Fails if there is a problem inserting the user', function(done) {
            model.expects("findByEmail").once().returns(Promise.resolve(null));
            hasher.expects("hash").once().returns(Promise.resolve("password_hash"));
            model.expects("register")
                .withArgs(user.username, "password_hash", user.fullname)
                .returns(Promise.reject(new Error("stub")));

            request(app).post('/users')
                .send(user)
                .expect(500, done);
        });

    });


    describe('GET /users/current', function() {

        it("Fails if the user isn't logged in", (done) => {
            request(app).get('/users/current').expect(404, done);
        });

        it('Returns current user account information', (done) => {
            currentUser = {id: 10};
            request(app).get('/users/current')
                .expect({result: {id: 10}})
                .expect(200, done);
        });

    });

    describe('PUT /users/current', function() {

        it('Allows the user to update their account settings');

    });


    describe('DELETE /users/current', function() {

        it('Allows the user to delete (disable) their account');

    });

});
