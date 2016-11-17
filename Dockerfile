FROM node:6

# Configuration
ENV GLANCE_SERVER_PORT ${GLANCE_SERVER_PORT:-8000}
ENV BUILD_DIR /var/build/

# Install build dependencies
RUN npm install -g typings typescript

# Prepare build directory
RUN mkdir -p $BUILD_DIR
WORKDIR $BUILD_DIR

# Resolve dependencies
COPY package.json typings.json $BUILD_DIR
RUN npm install
RUN typings install

# Prepare source code for build
COPY tsconfig.json $BUILD_DIR
COPY src $BUILD_DIR/src
COPY tests $BUILD_DIR/tests

# Compile typescript
RUN tsc

# Run unit tests
RUN ./node_modules/mocha/bin/mocha --recursive ./target/tests

# Environment
EXPOSE $GLANCE_SERVER_PORT

CMD [ "node", "target/src/app.js" ]
