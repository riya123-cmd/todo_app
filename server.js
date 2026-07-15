const serve = require('./Backend/src/app');
const db = require('./Backend/src/config/db'); 
db(); 
serve.listen(3000,() => {
    console.log("Server is running on port 3000");
})
