const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// MIME types mapping
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse the URL
    let pathname = url.parse(req.url).pathname;
    
    // Default to index.html if root is requested
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Construct file path
    const filePath = path.join(process.cwd(), 'public', pathname);
    
    // Get file extension
    const ext = path.extname(filePath).toLowerCase();
    
    // Check if MIME type is supported
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                console.error(`File not found: ${filePath}`);
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                // Server error
                console.error(`Server Error: ${err.code}`);
                res.writeHead(500);
                res.end('500 Internal Server Error');
            }
        } else {
            // Success - return the requested file
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

// Port configuration
const PORT = process.env.PORT || 8080;

// Start the server
server.listen(PORT, () => {
    console.log(`Dashboard server running at http://localhost:${PORT}/`);
    console.log(`Serving content from ./public directory`);
    console.log(`Press Ctrl+C to stop the server`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});