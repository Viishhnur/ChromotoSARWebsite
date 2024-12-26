const jwt = require('jsonwebtoken');
const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers.authorization;
    if(!auth){
        return res.status(403).json({message : "Unauthorized access , JWT toke is required",success : false});
    }
    // now the jwt token that someone had sent should be decoded and verified with our secret key
    try{

        const decoded = jwt.verify(auth,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message : "Unauthorized access , JWT token is invalid or expired",success : false});
    }
}

module.exports = ensureAuthenticated;