const http2 = require('http2');
const fs = require('fs');
const path = require('path');

// Load configuration from server.json
const config = JSON.parse(fs.readFileSync('server.json', 'utf8'));

// Paths to your SSL certificate and key
const sslOptions = {
    key: fs.readFileSync(config.ssl.key),
    cert: fs.readFileSync(config.ssl.cert)
};

const HTTP_PORT = config.httpPort; // Use configured port

// Create HTTP/2 server with secure connection
const server = http2.createSecureServer(sslOptions, (req, res) => {
    let filePath;

    // Determine filePath based on req.url
    if (req.url === config.rootRoute) {
        filePath = path.join(config.rootDir, '/', config.rootFile);
    } else if (req.url === config.newRoute) {
        filePath = path.join(config.newDir, '/', config.newFile);
    }

    // If filePath is undefined, it means the route doesn't match any known routes
    if (!filePath) {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ message: 'Unknown route' }));
        return;
    }    
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
                // Serve the main index.html for the root route
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            } else if (req.url === config.newRoute) {
                // Serve the main index.html for the root route
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(data);
            } else {
                // Serve a fallback response for unknown routes
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ message: 'Fallback response for unknown route' }));
            }
        }
    });
});

// Start the server
server.listen(HTTP_PORT, () => {
    console.log(`HTTP/2 server running on https://localhost:${HTTP_PORT}`);
});

