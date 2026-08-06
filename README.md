# Infrastructure
Pixel63 is built from scratch, with no correlation to existing emulator infrastructure or communication structure. Everything is built from scratch up in a manner that cannot be compared to emulators.

There is one global game server which manages connections with users and global game logic, this includes for example the shop, navigator, friends. Rooms are hosted by dedicated room servers which can hold any amount of rooms. Users tell the server they want to join a room, the server allocates a dedicated room server from a pool of dedicated room servers, prepares the room in that room server, then tells the user to connect to that server for room communications.

# Contributing
## Setting up your environment

### Configurations
Copy and rename the config.example.json files to config.json in the web and server package.

To set up your environment without the web server, change `useAccessTokens` to false in the configuration for the server.

#### For MySQL:
1. Start your MySQL server and create an empty database.
2. Set up your credentials in each config.json file for the web and server package.

#### For SQLite or other local storage dialects:
1. Change the database configuration to the following:
```json
"database": {
    "dialect": "sqlite",
    "storage": "path/to/database.sqlite"
}
```

Initializing server
```sh
cd packages/server
npm run init
```

Close the server and then run `npm run migrate`.

### Starting
#### Shared
```sh
cd packages/shared
npm run build
```

#### Server
The shared package must be built before the server can be built.
```sh
cd packages/server
npm run start
```

#### Web
The static files must be built before you can start the web server.

```sh
cd packages/web
npm run build
npm run start
```

#### Game
The shared package must be built before the game can be built.

```sh
cd packages/game
npm run watch
```
