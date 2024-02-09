const ImagesModel = require('../models/ImageModel');
const UserModel = require('../models/UserModel');

const checkUser = async (req, res) => {
    let username = req.body.username;
    console.log('received request for checking user : ', username);
    try {
        // find user by their username
        const user = await UserModel.findOne({ username });
        if (!user) {
            // if no such user is found then create new one with given data
            const newUser = await UserModel.create({ ...req.body });
            console.log('created new user : ', newUser);
            const sampleImage = "https://res.cloudinary.com/datowd0cc/image/upload/v1707477068/TurboShareX/eu4jxqbtpn28stunwc7o.png";
            // add sample image to user's images list
            const images = await ImagesModel.findOneAndUpdate(
                { username: newUser.username },
                { $push: { images: sampleImage } },
                { new: true, upsert: true } // options to return the updated document and create a new document if it doesn't exist
            );
            console.log(images);
            return res.send(newUser);
        }
        else {
            return res.send(user);
        }
    } catch (error) {
        return res.send({ error: error })
    }
}

module.exports = checkUser;