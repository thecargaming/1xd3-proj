# Building
```bash
    cd client
    npm i
    cd ..
    npm run build
```

# Deploy
```bash
    npm run build
    mkdir -p "$HTDOC_DIR/~chenp102/team"
    cp dist/* "$HTDOC_DIR/~chenp102/team"
```

# Development
## Running the client
```bash
    npm run dev
```

## Running the server
To run the development server, docker and docker compose must be installed
```bash
    npm run docker
```
