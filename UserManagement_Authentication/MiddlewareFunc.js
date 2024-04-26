const{users} = require('./data');
const{canViewProject} = require('./permissions/project');


function setUser(req,res,next){//creates a user
    const userId = req.body.userId
    if(userId){
        req.user = users.find(user => user.id === userId)
    }
    next()
}

function authUser(req,res,next){//checks user exists or denies entry
    if(req.user == null){
        res.status(404)
        return res.send('You need to sign in')
    }
    next()
}

function authRole(role){//validates role of a user

    return (req,res,next) => {
        if(req.user.role !== role){
            res.status(401)
            return res.send('Not allowed')
        }
        next()
    }
}

function setProject(req,res,next){
    const projectId = parseInt(req.params.projectId)
    req.project = projects.find(project => project.id === projectId)

    if(req.project == null){
        res.status(404)
        return res.send('Project not found')
    }
    next()
}

function authGetProject(req,res,next){
    if(!canViewProject(req.user, req.project)){
        res.status(401)
        return res.send('Not allowed')
    }
    next()
}

module.exports ={
    setUser,
    authUser,
    authRole,
    setProject,
    authGetProject
}
