const express = require('express');
const app = express();

const routes = require('./routes');
const initDatabase = require('./config/databaseConfig')

const hbsConfig = require('./config/hbsConfig');//1
const expressConfig = require('./config/expressConfig')//2
hbsConfig(app);//1.1
expressConfig(app);//2.1
//1+1.1 = require('./config/hbs-config')(app)


app.use(routes)

initDatabase().then(()=>{
    app.listen(3000, ()=> console.log('the app is running on localhost:3000'))
})
.catch(err=>{
    console.log('Cannot connect database:', err)
});




 