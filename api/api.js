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

module.exports = api;