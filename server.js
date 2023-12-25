// import path from 'path';
// import express from "express";
// import { fileURLToPath } from 'url';

// const app = express();
// const port = 3000;
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.set('view engine', 'html');

// app.get('/', function(req, res) {
// 	res.setHeader('Content-Type', 'text/html');
//   res.sendFile(path.join(__dirname, '/index.html'));

// //app.render('index', {"title": "Hive 2024 DJ Contestnpm"}, function (err, html) {
// 	//if (err) console.log(err);
// 	//console.log(html);
// });

// app.use('/jquery', express.static(path.join(__dirname, '/node_modules/jquery/dist/')));

// app.use(express.static('public'));

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// var http = require('http')
// var fs = require('fs')

// const PORT=8080

// fs.readFile('./index.html', function(error, html) {
//     if (error) throw error;
//     http.createServer(function(request, response) {
//         response.writeHeader(200, {"Content-Type": "text/html"});
//         response.write(html);
//         response.end();
//     }).listen(PORT);
// });



const http = require('http');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.static("public"));// default URL for website
app.use(cors({
  origin: '*'
}));
app.use('/', function(req,res){
	//res.setHeader('Access-Control-Allow-Origin', true);
	res.sendFile(path.join(__dirname+'/public/index.html'));
	//__dirname : It will resolve to your project folder.
});
const server = http.createServer(app);
const port = 3000;
server.listen(port);
console.debug('Server listening on port ' + port);
