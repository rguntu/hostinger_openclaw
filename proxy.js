import http from 'http';
import httpProxy from 'http-proxy';

const proxy = httpProxy.createProxyServer({});
const server = http.createServer((req, res) => {
  proxy.web(req, res, { target: 'http://localhost:5174' });
});

server.listen(18790, '0.0.0.0', () => {
    console.log('Proxy running on port 18790');
});
