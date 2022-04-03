//1 - invocar a express
const express = require('express');
const app = express();

//2 - setear urlencoded para capturar datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3 - invocar a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

//4 - el directorio public
app.use('/resourse', express.static('public'));
app.use('/resourse', express.static(_dirname + '/public'));

//5 - establecer motor de plantillas ejs
app.set('view engine', 'ejs');

//6 - invocar a bcryptjs
const bcryptjs = require('bcryptjs');

//7 - Var. de sesion
const session = require('express-session');
app.use(session({
    secret:'secret',
    resave: true,
    saveUninitialized:true
}));

//8 - invocar modulo de conexion BD 
const connection = require('./database/db');

//9 - establecer rutas
app.get('/', (req, res)=>{
    res.render('index', {msg:'ESTO ES UN MENSAJE DESDE NODE'});
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/register', (req, res)=>{
    res.render('register');
})

//10- registro
app.post('/register', async (req, res)=>{
    const user = req.body.user;
    const name = req.body.name; 
    const rol = req.body.rol;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, rol:rol, pass:passwordHaash}, async(error, results)=>{
        if(error){
            console.log(error);
        }else{
            res.render('register',{
                alert: true,
                alertTitle: "Registro",
                alertMessage: "¡Registro Exitoso!",
                alertIcon: 'success',
                showConfirmButton:false,
                time:1500,
                ruta:''
            })
        }
    })
})

app.listen(3000, (req, res)=>{
    console.log('SERVER RUNNING IN https://localhost:3000');

})