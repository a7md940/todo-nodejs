const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next){
    const token = req.header('x-auth-token');
    try{
      const payload = jwt.verify(token, config.get('jwtSecureKey'));
      req.headers.payload = payload;
      next();
    }catch(ex){
        return res.status(401).send('Sorry, invalid Token you are unauthenticated!');
    }
}