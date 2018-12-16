const router = require('express').Router();
const multer = require('multer');
const {User} = require('../models/user');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const storage = multer.diskStorage({
    filename: function (req, file, cb){
        let timestamp = new Date().toString().slice(0,24).split(" ").join("-");
        cb(null,timestamp.toLowerCase() + '_' + file.originalname.toLowerCase());
    },
    destination: (req, file, cb)=>{
        // console.log( fs.existsSync('./uploads/profile-images/'+ req.headers.payload.username) )
        if(!fs.existsSync('./uploads/profile-images/'+ req.headers.payload.username))
            fs.mkdirSync('./uploads/profile-images/'+ req.headers.payload.username);

        cb(null,'./uploads/profile-images/'+ req.headers.payload.username +'/');
    } 
});

const multerConfig = {
    storage: storage, 
    limits: 1024 * 1024 * 5, 
    fileFilter: (req, file, cb )=>{
        // Extentions
        const ext = /png|jpg|jpeg|gif/i;
    
        // FileExtention
        const fileExt = ext.test(path.extname(file.originalname)); 
    
        // Mimetype
        const mimetype = ext.test(file.mimetype);
    
        if(! (fileExt && mimetype)) cb('invalid file extention, file must be an image.', false);
        else cb(null, true);
    }
};

const upload = multer(multerConfig).single('image');

router.post('/', async (req, res)=>{

try{
    // multer uploading image
    upload(req, res, async err =>{
        if(err) return res.status(400).send({success:false, msg: err}) // multer err.
        else {
            // if there is no file.
            if(!req.file) return res.status(400).send({
                success: false, 
                msg:'you have to insert image file to upload.'
            });
            
            // update userImage field in database by file path that uploaded.
            let userId = req.headers.payload.id;
            const user = await User.findById(userId);
            if(!user) return res.status(400).send({success: false, msg:'invalid user.'})

            user.userImage = req.file.path;
            res.status(200).send({
                success: true, 
                msg:`image updated successfuly to ${user.username}.`, 
                imagePath: user.userImage,
                user: _.pick(user, ['_id', 'username', 'email'])
            })

        }
    });
}catch(err){
    return res.status(400).send({success:false, msg: err});
}

});

module.exports = router;