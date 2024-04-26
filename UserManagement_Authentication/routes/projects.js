const express = require('express');
const router = express.Router();

//exports
const {authUser,setProject,authGetProject} = require('../MiddlewareFunc');

//Routes
router.get('/', (req,res) =>{
    res.json(req.projects)
})

router.get('/:projectId',setProject,authUser, authGetProject, (req,res) =>{
    res.json(req.project)
})

module.exports = router