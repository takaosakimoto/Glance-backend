# Getting started

Install build dependencies

	npm install -g typings typescript

Install node.js dependencies (Linux)

	npm install

If you're using a Mac you'll need to use g++-5 to compile Argon2, the password hash function

	CXX=g++-5 npm install
	
Install the typescript dependencies
	
	typings install

Compile typescript

	tsc

Run unit tests

	./node_modules/mocha/bin/mocha --recursive ./target/tests

Run the server :-)

	node target/src/app.js
	
