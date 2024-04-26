const express = require('express'), app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(express.json());


const courses = [
    {id: 1 , course:'math'},
    {id: 2 , course:'database'},
    {id: 3 , course:'programming'}
]

/*********************************************************************************************************************/
//Post Requests are the Create of crud operations
//http://localhost:3000/api/courses
app.post('/api/courses', (req,res)=>{
    let _name = req.body.name

    if(!_name || _name.length < 3){
        res.status(400).send('Name is required and a minimun of 3 chars');
    }
    else{
        const course ={
            id:  courses.length + 1, //in the database the id is done automatically
            name: _name
        };
        courses.push(course);
        res.send(course);
    }
});
/*********************************************************************************************************************/


/*********************************************************************************************************************/
//GET Requests are the Read of crud operations
//http://localhost:3000/api/courses
app.get('/api/courses',(req, res)=>{
    res.send(courses);
});
//http://localhost:3000/api/courses/
app.get('/api/courses/:id',(req, res)=>{
    let ID = parseInt(req.params.id);
    let course = courses.find( c => c.id === ID);

    if(!course){
        res.status(404).send('course not found')
    }
    else{
       res.send(course)
    }
   ;
});
/*********************************************************************************************************************/

/*********************************************************************************************************************/
//Put Requests are the Update of crud operations
//http://localhost:3000/api/courses
app.put('/api/courses/:id', (req, res) => {
    // Look up course and validate if it exists
    let ID = parseInt(req.params.id);
    const course = courses.find(c => c.id === ID);
    if (!course) {
        res.status(404).send('Course of given ID not found');
        return;
    }

    // Validate the new name given to the course
    let _name = req.body.name;
    if (!_name || _name.length < 3) {
        res.status(400).send('Name is required and a minimum of 3 characters');
        return;
    } else {
        // Update course
        course.course = _name; // Assuming you want to update the 'course' property.

        // Return updated course
        res.send(course);
    }
});

/*********************************************************************************************************************/

/*********************************************************************************************************************/
//Delete Requests are the Delete of crud operations
//http://localhost:3000/api/courses
app.delete('/api/courses/:id', (req, res) =>{
        //look up course and valid if it exits
        let ID  = parseInt(req.params.id);
        const course = courses.find(c => c.id === ID);
        if(!course){
            res.send(404).send('Course of given ID not found');
            return;
        }
        const index = courses.indexOf(course);
        courses.splice(index, 1);

        res.send(course);
});
/*********************************************************************************************************************/


// Start the server and listen on port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 