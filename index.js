const express = require('express');
const app = express();         
const bodyParser = require('body-parser');
const port = 3000; //porta padrão
const mysql = require('mysql');

//configurando o body parser para pegar POSTS mais tarde
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//seto a pasta public para pegar os arquivos internos da aplicação
app.use(express.static(__dirname + '/public'));
//app.use('/css', express.static(__dirname + '/public'));

// In your js file (e.g. app.js)
var get_ip = require('ipware')().get_ip;
app.use(function(req, res, next) {
 var ip_info = get_ip(req);
 console.log(ip_info);
 // { clientIp: '127.0.0.1', clientIpRoutable: false }
 next();
});

// `get_ip` also adds two fields to your request object
// 1. `clientIp`, 2. `clientIpRoutable`
// Where:
//    `clientIp` holds the client's IP address
//    'clientIpRoutable` is `true` if user's IP is `public`. (externally route-able)
//                       is `false` if user's IP is `private`. (not externally route-able)

// Advanced option: By default the left most address in the `HTTP_X_FORWARDED_FOR` or `X_FORWARDED_FOR`
// is returned.  However, depending on your preference and needs, you can change this
// behavior by passing the `right_most_proxy=True` to the API.
// Note: Not all proxies are equal. So left to right or right to left preference is not a
// rule that all proxy servers follow.

 var ip_info = get_ip(req, right_most_proxy=True)
//definindo as rotas
const router = express.Router();
//router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);
// DEFININDO NOSSA ROTA PARA O ANGULARJS/FRONT-END =========
router.get('/', function(req, res) {
    // Carrega nossa view index.html que será a única da nossa aplicação
    // O Angular irá lidar com as mudanças de páginas no front-end
    res.sendFile(__dirname + '/public/index.html');
    getCallerIP(req);
});
router.get('/contatos', (req, res) =>{
	console.log(req);
    execSQLQuery('SELECT * FROM Contatos', res);
});
router.post('/contatos', (req, res) =>{
    const nome = req.body.nome.substring(0,150);
    const email = req.body.email.substring(0,150);
    const ip = 
    const data = req.body.data;
    execSQLQuery(`INSERT INTO Contatos(Nome, Email, IP, Data) VALUES('${nome}','${email}','${ip}', '${data}')`, res);
    console.log(req);
})

//inicia o servidor
app.listen(port);
console.log('API funcionando!');

function execSQLQuery(sqlQry, res){
	const connection = mysql.createConnection({
		host     : 'mysql857.umbler.com',
		port     : 41890,
		user     : 'gamaroot',
		password : 'greenforcegama',
		database : 'moeda'
	});

	connection.query(sqlQry, function(error, results, fields){
		if(error) 
		res.json(error);
		else
		res.json(results);
		connection.end();
		console.log('executou!');
	});
}

function getCallerIP(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.connection.remoteAddress ||
        request.socket.remoteAddress ||
        request.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
    console.log(ip);
    return ip;
}