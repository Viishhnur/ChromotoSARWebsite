const mongoose = require('mongoose');
const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri, 
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to chromoto-sar database');
    })
    .catch((err) => {
        console.log(err);
    });