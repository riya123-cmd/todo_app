require("dotenv").config();
const serve = require('./Backend/src/app');
const db = require('./Backend/src/config/db'); 

db(); 

const PORT = process.env.PORT || 3000;

serve.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
