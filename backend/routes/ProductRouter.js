const ensureAuthenticated = require('../middlewares/Auth');
const router = require('express').Router();              

router.get('/',ensureAuthenticated,(req,res)=>{
    console.log('user details are',req.user);
    res.status(200).json([
        {
            name : "mobile",
            price : 1000
        },
        {
            name : "laptop",
            price : 2000
        }
    ])
});

module.exports = router;