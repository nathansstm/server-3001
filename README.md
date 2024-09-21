# Server-3001

This project sets up a simple HTTP/2 server using Node.js with SSL/TLS for secure connections. It includes preflight request handling and a simple route for testing server connection.

## Features
- HTTP/2 support
- SSL/TLS encryption
- CORS support for 'GET', 'POST', and 'OPTIONS' requests
- This server handles preflight requests with a 200 status code response.
- Simple '/app/path/test' route for verifying server setup, tested with XMLHttpRequest and WebView.

## Prerequisites
- Node.js (v14 or later)
- SSL certificate files ('privkey.pem' and 'fullchain.pem') stored in '/app/path/ssl/'
- Git

## Usage

After cloning the repository, you can use the HTTP/2 server as follows:

1. **Start the Server**: 
   To start the server, navigate to the project directory and run:
   'node server.js'

   The server will listen on port 3001. This is an unprivileged port, meaning you won't need root privileges to run it.

2. **Accessing the Server**: 
   Once the server is running, you can access it via:
   'https://localhost:3001/app/path/test'
   You should receive a JSON response: '{ message: "Connection successful" }'

3. **Running in the Background**: 
   To run the server in the background, you can use the following command:
   'nohup node server.js &'
   This allows the server to keep running even after you close the terminal.

4. **Using with Certbot and Let's Encrypt**: 
   The server is designed to work seamlessly with Certbot and Let's Encrypt for SSL certificate management. You can set up automated certificate renewal to ensure your SSL certificates are always up to date.

5. **Dynamic DNS with FreeMyIP**: 
   For dynamic IP environments, consider using FreeMyIP or similar services to keep your domain pointing to your server’s IP address. This is especially useful for home servers or those behind dynamic IP addresses.

## Possible Enhancements
- **Additional Routes**: You can add more routes to handle different requests based on your application's needs.
- **Logging**: Implement logging mechanisms to monitor requests and errors for better debugging and maintenance.
- **Rate Limiting**: Consider adding rate limiting to prevent abuse of your server endpoints.
- **Database Integration**: Integrate with a database (e.g., MongoDB or PostgreSQL) for storing and retrieving data.

## License
This project is licensed under the [Apache 2.0 License](LICENSE).


