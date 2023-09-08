const express = require("express")
const router = express.Router()

const cloudinary = require("cloudinary")
cloudinary.config({
    api_secret: process.env.CLOUD_API_SECRET,
    api_key: process.env.CLOUD_API_KEY,
    secure: true,
})

// router.get("/sign", (req, res) => {
//     console.log("cloudinary/sign hit")
//     console.log("params_to_sign", req.query.params_to_sign)
//     const params_to_sign = req.query.params_to_sign
//     const signature = cloudinary.utils.api_sign_request(params_to_sign, process.env.CLOUD_API_SECRET)
//     res.send(signature)
//     console.log("signature: ", signature)
// })

router.get("/cloudinary/sign", (req, res) => {
    try {
        console.log("cloudinary/sign hit");
        console.log("params_to_sign", req.query.params_to_sign);
        const params_to_sign = req.query.params_to_sign;
        const signature = cloudinary.utils.api_sign_request(params_to_sign, process.env.CLOUD_API_SECRET);
        res.send(signature);
        console.log("signature: ", signature);
    } catch (error) {
        console.error("Error generating Cloudinary signature:", error);
        res.status(500).send("Error generating Cloudinary signature");
    }
});

module.exports = router