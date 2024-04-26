require('dotenv').config();
const express = require('express'), app = express();

//exports
const port = process.env.PORT || 8080;
const{ROLE, users} = require('./data');
const projectRouter = require('./routes/projects');
const {setUser, authUser, authRole} = require('./MiddlewareFunc');
const{canViewProject} = require('./permissions/project');

//Middleware
app.use(express.json());
app.use(setUser);
app.use('./projects', projectRouter);

//API
app.get('/',(req,res)=>{
    res.send('Home page');
});

app.get('/dashboard', authUser ,(req,res)=>{
    res.send('Dashboard page');
});

app.get('/admin',authUser, authRole(ROLE.ADMIN), (req,res)=>{
    res.send('Admin page');
});

//SERVER
app.listen(port, ()=>{
    console.log(`listening on port:${port}`)
});