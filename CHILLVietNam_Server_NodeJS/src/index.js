const fs = require('fs');
var express = require('express')
const http = require('http');
const https = require('https');
var app = express()
const handlebars = require('express-handlebars').create({ extname: '.hbs', helpers: { increase(a, b) { return a + b}}});
const path = require('path');
const route = require('./routers');
const db = require('./app/config/db');
const methodOverride = require('method-override')
const session = require('express-session');
const requireLogin = require('./app/middleware/requireLogin')



//Allow Access Control Header
const allowedReferers = [
    'https://h5.zdn.vn/zapps/3997858275581649803',
    'zbrowser://h5.zdn.vn/zapps/3997858275581649803'
  ];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
        return next();
    // const origin = req.headers.origin;
    // const allowedCors = allowedReferers.some((element) =>
    //     element.startsWith(origin)
    // );
    // if (allowedCors) {
    //   res.setHeader('Access-Control-Allow-Origin', origin);
    //   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //   res.header('Access-Control-Allow-Methods', 'GET, POST');
    // }
    // return next();
});




//Connect DB
db.connect();

//Cấu hình view engine
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, './resources/views'));
app.set('trust proxy', true);
// Set đường dẫn tĩnh cho file
app.use(express.static(path.join(__dirname, 'public')));

// //body parser
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    }),
);

//dùng để override method theo CRUD
app.use(methodOverride('_method'));


// Cấu hình session middleware
app.use(session({
    secret: 'VNDC@123123!@#', // Thay thế bằng một chuỗi bất kỳ để mã hóa session
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 1000 * 1440
    }
  }));

app.use(requireLogin)

// Khởi chạy route
route(app);


// // Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/vtech.io.vn/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/vtech.io.vn/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/vtech.io.vn/chain.pem', 'utf8');


const credentials = {
	key: privateKey,
	cert: certificate
	// ca: ca
};

// Starting both http & https servers
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

httpServer.listen(3443, () => {
	console.log('HTTPS Server running on port 443');
});
