# Infrastructure
Pixel63 is built from scratch, with no correlation to existing emulator infrastructure or communication structure. Everything is built from scratch up in a manner that cannot be compared to emulators.

There is one global game server which manages connections with users and global game logic, this includes for example the shop, navigator, friends. Rooms are hosted by dedicated room servers which can hold any amount of rooms.

Users tell the server they want to join a room, the server allocates a dedicated room server from a pool of dedicated room servers, prepares the room in that room server, then tells the user to connect to that server for room communications.

All events between users and servers, game server and room servers, are done using Protobuff messages.

## Database
By default, Pixel63 uses MySQL, however, this can be changed to SQLite or even Postgres, however, these have not been tested and there is no database schema provided for them.

## Project structure
This repository is designed as a mono-repo with 2 key packages:
- **Server**: contains two types of servers, the game server and the room server. Both must be running for the server to operate, however, the game server can spawn room server as child processes.
- **Game**: contains two types of packages, the client for the primarily the room renderer and its client logic, and the user interface for the React implementation of Pixel63.

# Developers
These instructions are targeted at developers, other instructions for setting up Pixel63 for usage will be provided upon release.

You need to have a MySQL server running, run `npm i` and then `npm run start` in the root direction. This will set up all the other prerequisities needed as well as seed your database.

Once set up, you can start each package individually.

## Web server (packages/web/)
Running `npm run start` will start the provided web server

## Game server (packages/server/)
Running `npm run start` will start the game server and spawn a room server (unless configured otherwise).

To perform migrations, first build the server package using `npm run build` and then run `npm run migrate`.

## Room server (packages/server/)
Running `npm run room -- --port=8080` will spawn a room server on the specified port. For the game server to utilize this room server, the hostname and port for this room server must be specified in the game server's configuration.

## Game package (packages/game/)
Running `npm run build` will build the frontend assets to the build folder. Running `npm run start` will start watching the frontend and build automatically.

## Events package (packages/events/)
Communication messages between users and servers is done with Protobuff via WebSockets. This package contains all Protobuff messages.

To be able to generate the Protobuff messages, you must have `protoc` installed. This can be set up in the setup script.

Running `npm run generate` will build the messages. You must restart the game- and room server, as well as restart the watch process for the game package.
