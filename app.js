const express = require('express')
const app = express();
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const api = require('./api/api');
const {Admin, User, Biodata, Device} = require('./models')
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
app.use(api); //api

// Halaman Login Super Admin
app.get('/', (req, res)=>{
    res.render('login', {
        title: 'Halaman Login',
        css: 'css/login.css',
        layout: 'layouts/main-layouts'
    });
});

// Halaman trial Games
app.get('/game', (req, res)=>{
    res.render('game', {
        title: 'Trial Game',
        css: 'css/game.css',
        layout: 'layouts/main-layouts',
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
app.get('/dataUser', async (req, res)=>{
    const users = await User.findAll();
    res.render('dataUser',{
        title: 'Halaman Data User',
        css: '',
        layout: 'layouts/main-layouts',
        users,
        msg: req.flash('msg'),
    });
});

// Halaman tambah data User
app.get('/dataUser/tambah', (req, res)=>{
    res.render('dataUser-add',{
        title: 'Halaman Tambah Data User',
        css: 'css/login.css',
        layout: 'layouts/main-layouts'
    });
});

// Proses Tambah data
app.post('/dataUser',  [
    body('nama').custom(async(value)=>{
        const findName = await User.findOne({
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
        res.render('dataUser-add',{
            layout: 'layouts/main-layouts',
            title: 'Halaman Tambah Data User',
            css: 'css/login.css',
            errors: errors.array()
        });
    } else {
        User.create({
            nama: req.body.nama,
            password: req.body.password,
            email: req.body.email
        }).then((admin)=>{
            req.flash('msg', 'Data User berhasil ditambahkan!');
            res.redirect('/dataUser');
        }).catch(err => {
            res.status(422).json("Can't add Admin")
        })
    }
}
);



// Halaman edit data user
app.get('/dataUser/edit/:id', async (req, res)=>{
    const user = await User.findOne({
        where:{id: req.params.id}
    });
    const userid =  req.params.id;
    res.render('dataUser-edit',{
        title: 'Halaman Edit Data User',
        css: 'css/login.css',
        layout: 'layouts/main-layouts',
        userid,
        user
    });
});


// Proses edit data User
app.post('/dataUser/updatedata/:id', (req, res)=>{
    User.update({
        nama: req.body.nama,
        password: req.body.password,
        email: req.body.email,
    }, {where:{
        id:req.params.id
    }})
    .then(()=>{
        req.flash('msg', 'Data user berhasil diedit!');
        res.redirect('/dataUser');
    })
});



// Halaman tambah biodata
app.get('/biodata/add/:id',  (req, res)=>{
    const userid = req.params.id
    res.render('biodata',{
        title: 'Halaman Tambah Biodata User',
        css: '',
        layout: 'layouts/main-layouts',
        userid

    });
});

app.post('/biodata/add/:id', async (req,res)=>{
    const biodata = await Biodata.findOne({
        where:{user_id: req.params.id}
    });
    if(!biodata) {
        Biodata.create({
            user_id: req.params.id,
            nohp: req.body.nohp,
            hobi: req.body.hobi,
            alamat: req.body.alamat,
        }).then(()=>{
            req.flash('msg', 'Biodata User berhasil ditambahkan!');
            res.redirect('/dataUser');
        }).catch(err => {
            res.status(422).json("Can't add Biodata")
        });
    } else {
        res.status(404);
        res.send('<h1>Biodata sudah ada</h1>');
    }
  
});

// Halaman user Device 
app.get('/device/add/:id',  (req, res)=>{
    const userid = req.params.id
    res.render('device',{
        title: 'Halaman Tambah Device User',
        css: '',
        layout: 'layouts/main-layouts',
        userid

    });
});

app.post('/device/add/:id', async (req,res)=>{
    const device = await Device.findOne({
        where:{user_id: req.params.id}
    });
    if(!device) {
        Device.create({
            user_id: req.params.id,
            perangkat: req.body.perangkat,
        }).then(()=>{
            req.flash('msg', 'Device User berhasil ditambahkan!');
            res.redirect('/dataUser');
        }).catch(err => {
            res.status(422).json("Can't add Biodata")
        });
    } else {
        res.status(404);
        res.send('<h1>Device sudah ada</h1>');
    }
  
});



// Proses delete Data user
app.get('/dataUser/delete/:id', (req, res)=>{
    const user = User.findOne({
        where: {id: req.params.id}
    });
    if(!user){
        res.status(404);
        res.send('<h1>404</h1>');
    } else {
        User.destroy({
            where: {id: req.params.id}
        }).then(()=>{
            Biodata.destroy({
                where:{user_id: req.params.id}
            }).then(() =>{
                Device.destroy({
                    where:{user_id: req.params.id}
                }).then(()=>{
                    req.flash('msg', 'Device user berhasil dihapus!');
                }).catch(err=>{
                    res.status(422).json("Can't delete device  user") 
                })
            }).catch(err=>{
                res.status(422).json("Can't delete biodata data user") 
            })
            req.flash('msg', 'Data user berhasil dihapus!');
            res.redirect('/dataUser');
        }).catch(err=>{
            res.status(422).json("Can't delete data user")
        });
    }
});

app.get('/details/:id', async (req, res)=>{
    const user = await User.findOne({
        where: {id: req.params.id}
    });
    const biodata = await Biodata.findOne({where:{
        user_id: req.params.id
    }});
    const device = await Device.findOne({where:{
        user_id: req.params.id
    }});
    if(!biodata || !device) {
        res.status(404);
        res.send('<h1>Mohon isi biodata dan device terlebih dulu </h1>');
    } else{
        res.render('details',{
            title: 'Halaman detail tentang User',
            css: '',
            layout: 'layouts/main-layouts',
            user,
            biodata,
            device
        });
    }
    
});



// Port listen
app.listen(port, () =>{
    console.log(`Server ini berjalan di http://localhost:${port}`)
});