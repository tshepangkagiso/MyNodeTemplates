const{ROLE} = require('../data');

function canViewProject(user,project){
    return(
        user.role === ROLE.ADMIN || project.userId === user.id
    )
}

module.exports = {
    canViewProject
}