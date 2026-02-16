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

Now build the server package and start the server with the `--reset` flag to build a new database. The shared package must be built before the server can be built.
```sh
cd packages/shared
npm run build

cd packages/server
npm run start -- --reset
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
