const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./models/user-models/db');
const port = process.env.PORT;
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); // to allow cross-origin requests from the frontend


const AuthRouter = require('./routes/AuthRouter') // for all routes starting with /auth, use the routes defined in AuthRoutes.js
app.use('/auth',AuthRouter);  // for all routes starting with /auth, use the routes defined in AuthRoutes.js
const ProductRouter = require('./routes/ProductRouter') // for all routes starting with /auth, use the routes defined in AuthRoutes.js
app.use('/products',ProductRouter);  // for all routes starting with /product, use the routes defined in AuthRoutes.js


const SARColorizeRouter = require('./routes/SARColorize');
app.use('/sar-api',SARColorizeRouter);

const VitRouter = require('./routes/Vit');
app.use('/vit-api',VitRouter);

const VggRouter = require('./routes/Vgg');
app.use('/vgg-api',VggRouter);

const FloodDetectRouter = require('./routes/FloodDetect');
app.use('/flood-api',FloodDetectRouter);
// routes
app.get('/',(req,res)=>{
    console.log('Hello world');
    res.send('<h1>Hello world<h1/>');
    
});

// app.get('/home',(req,res)=>{
//     res.send('<h1>Home page<h1/>');
// })
app.listen(port,'0.0.0.0',()=>{
    console.log(`Server is running on port ${port}`);
});