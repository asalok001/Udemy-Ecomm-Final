const cloudinary = require('cloudinary');


// config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


exports.upload = async (req, res) => {
    let result = await cloudinary.uploader.upload(req.body.image, {
        public_id: `${Date.now()}`,
        resource_type: 'auto'  // jpeg, jpg, png -----
    });

    res.json({
        public_id: result.public_id,
        uril: result.secure_url
    });
};

exports.remove = async (req, res) => {
    let image_id = req.body.public_id;
    cloudinary.uploader.destroy(image_id, (err, result) => {
        if (err) return res.json({ success: false, err });
        res.send('Server Response for Result From Remove', result + ' ok');
    });
};