const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const {Admin} = require('./models')
const port = 8081


app.set('view engine', 'ejs');// Gunakan ejs
app.use(express.static('public'));// Built-in Midleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(expressLayouts);// third party midlleware
app.use(cookieParser('secret'));// Konfigurasi flash
app.use(
    session({
        cookie: {maxAge: 6000},
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(flash());

// Halaman Login Super Admin
app.get('/', (req, res)=>{
    res.render('login', {
        title: 'Halaman Login',
        css: 'css/login.css',
        layout: 'layouts/main-layouts'
    });
});

// Proses Login Admin
app.post('/landingpage', [
    body('password').custom(async(value)=>{
        const findPassword = await Admin.findOne({
            where: {password: value}
        });
        if(!findPassword){
            throw new Error('Password tidak valid!');
        }
        return true;
    }),
    body('nama').custom(async(value)=>{
        const findNama = await Admin.findOne({
            where: {nama: value}
        });
        if(!findNama){
            throw new Error('Nama tidak valid!');
        }
        return true;
    })

    ],
    (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.render('login',{
                layout: 'layouts/main-layouts',
                title: 'Halaman login',
                css: 'css/login.css',
                errors: errors.array()
            });
        } else {
            req.flash('msg', 'Masuk Sebagai admin!'); 
            res.redirect('/landingpage');
        }
    }
);

// Halaman sign up super admin
app.get('/signup', (req, res)=>{
    res.render('signup',{
        title: 'Halaman Sign-Up',
        css: 'css/login.css',
        layout: 'layouts/main-layouts'
    });
});

// Proses Sign-UP
app.post('/',  [
    body('nama').custom(async(value)=>{
        const findName = await Admin.findOne({
            where: {nama: value}
        });
        if(findName){
            throw new Error('Username sudah digunakan!');
        }
        return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('password')
    .isLength({ min: 5 })
    .withMessage('Password harus berisi minimal lima karakter!')
    .matches(/\d/)
    .withMessage('Harus terdapat karakter angka untuk proteksi!')
    ], 
    (req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        // return res.status(400).json({ errors: errors.array() });
        res.render('signup',{
            layout: 'layouts/main-layouts',
            title: 'Halaman Sign-Up',
            css: 'css/login.css',
            errors: errors.array()
        });
    } else {
        Admin.create({
            nama: req.body.nama,
            password: req.body.password,
            email: req.body.email
        }).then((admin)=>{
            req.flash('msg', 'Data Admin bersail ditambahkan!');
            res.redirect('/');
        }).catch(err => {
            res.status(422).json("Can't add Admin")
        })
    }
}
);

// Halaman Landing page
app.get('/landingpage', (req, res)=>{
    res.render('landingPage', {
        title: 'Halaman Home Page',
        css: 'css/landingPage.css',
        layout: 'layouts/main-layouts',
        msg: req.flash('msg'),
    });
});

// Halaman Data user / Contact User

// Port listen
app.listen(port, () =>{
    console.log(`Server ini berjalan di http://localhost:${port}`)
});