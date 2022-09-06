const http = require('http');
const app = require('./app')

const port = process.env.PORT || 3001;

http.createServer(app);

app.listen(port, console.log("Server started")); 