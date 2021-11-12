const express = require("express");

const app = express();
const multer = require('multer');
import path from 'path';
//const upload = multer({dest: 'uploads/'});


/**
 * Cria uma instancia do middleware configurada
 * distination: lida com o destino
 * filename: permmite definir o nome do arquivo
 */

 const storage = multer.diskStorage({
  destination: function(req, file, cb){
    //req = requisiçao
    //file = arquivvo
    //cb = funcao callback
    //primeiro parametro = erro
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb){
     //primeiro parametro = erro
     // salvando com o nome do input e a data atual
     //cb(null, file.fieldname + '-' + Date.now())
     //cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)

     //salvando com o mesmo nome do arquivo
     cb(null,file.originalname);
  }
});

//utiliza a storage para configurar a instancia do multer
const upload = multer({ storage });

/**
 * Configuração do parser para requisições post
 */
 app.use(express.json());
 app.use(express.urlencoded({
     extended: true
 }))

 /**
 * Conexão com banco de dados via pool de conexões
 * https://node-postgres.com/
 */
  const pool = require('./dao/conexao');

  app.use(express.json());
  app.use(express.urlencoded({
      extended: true
  }))

const PORTA = process.env.PORT || 3000;
 app.listen(PORTA, function(){
     console.log("Servidor rodando na porta 8080");
 })

 const routes = require('./api/routes');
 routes(app);


//caminhos
app.use('/views', express.static(__dirname + '/views'));
app.use('/img', express.static(__dirname + '/img'));
app.use('/uploads', express.static('./uploads'));
app.use('/publico', express.static(__dirname + '/publico'));
app.use('/bscss', express.static('./node_modules/bootstrap/dist/css'));
app.use('/bsjs', express.static('./node_modules/bootstrap/dist/js'));
app.use('/popperjs', express.static('./node_modules/@popperjs/core/dist/umd'));
app.use('/jquery', express.static('./node_modules/jquery/dist'));

// requisição - upload de arquivos
app.post('/uploadFoto',upload.single('foto'), function(req,resp){
  resp.end();
});

/**
 * Condiguração das paginas
 */

app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');

/**
 * Rota teste
 */
 app.get('/teste', function(req,resp){
  resp.render('teste')
});

//requisições

app.get('/', function(req,resp){
  resp.render('index')
});

app.get('/index', function(req,resp){
  resp.render('index')
});


app.get('/album', function(req,resp){
   resp.render('album')
});

app.get('/relatorioalbuns', function(req,resp){
  resp.render('relatorioalbuns')
});

app.get('/login', function(req,resp){
  resp.render('login')
});

app.post('/album',function(req, resp){
  
/**
 * Configurações Sequelize
 * 
 */

/**
 * Configuração do parser para requisições post
 */
 
 

    //Conferir dados da requisição
    /* console.log(`
    req.body.nome = ${req.body.nome}
    req.body.cpf = ${req.body.cpf}
    req.body.telefone = ${req.body.telWhats}
    req.body.email = ${req.body.email}
    req.body.estado = ${req.body.estado}
    req.body.cidade = ${req.body.cidade}
    req.body.dataNascimento = ${req.body.dataNascimento}
    req.body.nomeresp = ${req.body.nomeresp}
    req.body.cpfresp = ${req.body.cpfresp}
    req.body.titulo = ${req.body.titulo}
    req.body.nomeFotogra = ${req.body.nomeFotogra}
    req.body.foto = ${req.body.foto}
    `); 
     */
    pool.query(`INSERT INTO album
               (nome, cpf, tel, email, estado, cidade, data_nascimento, nome_responsavel, cpf_responsavel, titulo_foto, nome_fotografo, nome_foto) 
             VALUES 
               ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, 
                [req.body.nome, req.body.cpf, req.body.telefone, req.body.email, req.body.estado, req.body.cidade, req.body.dataNascimento, req.body.nomeresp, req.body.cpfresp, req.body.titulo, req.body.nomeFotogra, req.body.foto])
        .then(res => console.log('ok'))
       .catch(err => console.log('erro: ' + err));

   resp.render('album');
});