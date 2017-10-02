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

//definindo as rotas
const router = express.Router();
//router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));
app.use('/', router);
// DEFININDO NOSSA ROTA PARA O ANGULARJS/FRONT-END =========
router.get('/', function(req, res) {
    // Carrega nossa view index.html que será a única da nossa aplicação
    // O Angular irá lidar com as mudanças de páginas no front-end
    res.sendFile(__dirname + '/public/index.html');
});
router.get('/contatos', (req, res) =>{
    execSQLQuery('SELECT * FROM Contatos', res);
});
router.post('/contatos', (req, res) =>{
    const nome = req.body.nome.substring(0,150);
    const email = req.body.email.substring(0,150);
    const ip = req.body.ip.substring(0,20);
    const data = req.body.data;
    execSQLQuery(`INSERT INTO Contatos(Nome, Email, IP, Data) VALUES('${nome}','${email}','${ip}', '${data}')`, res);
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