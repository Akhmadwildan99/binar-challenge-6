const express = require('express');
const api = express();
const {User, Biodata, Device} = require('../models');

// Read all User
api.get('/api/data/user', (req, res)=>{
    User.findAll().then((user)=>{
        res.status(200).json(user);
    });
});

// Read One User
api.get('/api/data/user/:id', (req, res)=>{
    User.findOne({where:{
        id:req.params.id
    }}).then((User)=>{
        res.status(200).json(User);
    });
});

// Read all Biodata
api.get('/api/data/biodata', (req, res)=>{
    Biodata.findAll().then((biodata)=>{
        res.status(200).json(biodata);
    });
});

// Read one Biodata
api.get('/api/data/biodata/:user_id', (req, res)=>{
    Biodata.findOne({where:{
        user_id:req.params.user_id
    }}).then((biodata)=>{
        res.status(200).json(biodata);
    });
});

// Read all Biodata
api.get('/api/data/device', (req, res)=>{
    Device.findAll().then((device)=>{
        res.status(200).json(device);
    });
});

// Read one Biodata
api.get('/api/data/device/:user_id', (req, res)=>{
    Device.findOne({where:{
        user_id:req.params.user_id
    }}).then((device)=>{
        res.status(200).json(device);
    });
});

// Add data user
api.post('/post/data/user', (req,res)=>{
    User.create({
        nama: req.body.nama,
        password: req.body.password,
        email: req.body.email
    }).then((user)=>{
        res.status(200).json(user)
    });
});

// Update Data User
api.put('/put/data/user/:id', (req, res)=>{
    User.update({
        nama: req.body.nama,
        password: req.body.password,
        email: req.body.email
    },{
        where:{id:req.params.id}
    }).then((user)=>{
        res.status(200).json(user)
    });
});

// Delete data user
api.put('/delete/data/:id', (req, res)=>{
    User.destroy({
        where:{id:req.params.id}
    }).then((user)=>{
        res.status(200).json(user)
    });
});



// Read User and Biodata
api.get('/joinwithbiodata', (req, res)=>{
    User.findAll(
        {include:Biodata}
    ).then((user)=>{
        res.status(200).json(user);
    })
});



module.exports = api;