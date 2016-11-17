import * as glance from "./glance";

var port: number = process.env.GLANCE_SERVER_PORT || 8080;
var app = glance.app();

var server = app.listen(port, () => {
    console.error(`Example app listening on port ${port}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.error('SIGTERM received and process exited gracefully');
        process.exit(0);
    });
});
