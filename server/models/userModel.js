const {Schema, model} = require("mongoose")

const userSchema = new Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    profilePhoto: {type: String, default: "https://res.cloudinary.com/djn7vlas1/image/upload/v1766894472/greenSpider_z5pknu.png"},
    bio: {type: String, default: "No bio yet"},
    followers: [{type: Schema.Types.ObjectId, ref: "User"}],
    following: [{type: Schema.Types.ObjectId, ref: "User"}],
    bookmarks: [{type: Schema.Types.ObjectId, ref: "Post"}],
    posts: [{type: Schema.Types.ObjectId, ref: "Post"}]
}, {timestamps: true})

/**The ref keyword enables population. MongoDB stores only IDs, 
 * but Mongoose can replace them with full documents when needed. 
 * Schema = data structure + rules. Does not read or write data
 * model() = turns schema into a MongoDB-powered class. Wraps the schema. Connects it to a MongoDB collection. Gives you methods to interact with the database
You must use a model to query or save data
Exporting the model lets your app use it everywhere*/

module.exports = model("User", userSchema)

//"User" → model name. Mongoose automatically maps this to the users collection