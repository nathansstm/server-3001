const http2 = require('http2');
const fs = require('fs');
const path = require('path');

// Load configuration from server.json using __dirname for the path
const configPath = path.join(__dirname, 'server.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Paths to your SSL certificate and key using paths from config
const sslOptions = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
};

// You can now use sslOptions for your HTTP2 server setup

const HTTP_PORT = config.httpPort; // Use configured port

// Create HTTP/2 server with secure connection
const server = http2.createSecureServer(sslOptions, (req, res) => {

    // Logic to find the matching route and create filePath
    const filePath = (() => {
        for (const key in config) {
            if (key.endsWith("Route") && config[key] === req.url) {
                const keyBase = key.replace("Route", ""); // Extract the key base (e.g., root, new)
                const dirKey = keyBase + "Dir";  // Example: rootDir, newDir
                const fileKey = keyBase + "File"; // Example: rootFile, newFile

                // Join the directory and file path intelligently using path.join (OS-agnostic)
                return path.join(config[dirKey], config[fileKey]);

                // If you wanted to force '/' separators, you could do:
                // return config[dirKey] + '/' + config[fileKey];
            }
        }

        // If no match is found, return a default or handle the error
        return null; 
    })();

    fs.readFile(filePath, (err, data) => {
        if (err) {
            // File not found, serve a positive JSON response
            res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ message: 'Not Found' }));
        } else {
            if (req.method === 'OPTIONS') {
                // Handle CORS preflight requests
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                });
                res.end(JSON.stringify({ message: 'Preflight response' }));
            } else if (req.url === config.rootRoute) {
                // Serve the root route file
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            } else if (req.url === config.newRoute) {
                // Serve the new route file
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            } else {
                // Serve the file for the matched route
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            }
        }
    });
});

// Start the server
server.listen(HTTP_PORT, () => {
    console.log(`HTTP/2 server running on https://localhost:${HTTP_PORT}`);
});
