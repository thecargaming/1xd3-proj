# Building
```bash
    cd client
    npm i
    cd ..
    npm run build
```

# Deploy
After building the server, copy it to the htdocs directory.
```bash
    mkdir -p "$HTDOCS_DIR/~chenp102/team"
    cp dist/public/* "$HTDOCS_DIR/~chenp102/team"
```
The database credentials are stored in environment variables. An example of
setting env can be found at `server_setup/.htaccess`. Replace the env with the
credentials of your server and copy it to `$HTDOCS_DIR`. A script to initialize
the database can be found at `server_setup/create_tables.sql`.

# Development
## Running the client
The client will be found at `127.0.0.1:3000/~chenp102/team`
```bash
    npm run dev
```

## Running the server
To run the development server, docker and docker compose must be installed.
Building, initializing the database, and building are all done automatically by
the build script.
```bash
    npm run docker
```
