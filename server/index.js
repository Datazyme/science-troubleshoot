const express = require("express")
const {connect} = require("mongoose") //pulls the connect function from exported mongoose object. Stores function as constant "connect"
/* The above can also be written as:
const mongoose = require("mongoose");
const connect = mongoose.connect; */
require("dotenv").config()
const cors = require("cors")
const upload = require("express-fileupload")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

const app = express()

app.use(express.urlencoded({extended: true}))
    /* app.use(express.urlencoded({ extended: true })) lets Express read form data from POST requests and makes it available as req.body.
    express.urlencoded: is built-in Express middleware. It parses URL-encoded data, which is the format used by HTML forms.
    { extended: true }: This option controls how complex objects are parsed. Uses the qs library, Allows nested objects and arrays.
     app.use(...): Registers the middleware globally. Runs before every route. Makes parsed data available on req.body*/
app.use(express.json({extended: true}))
app.use(cors({credentials: true, origin: ["http://localhost:5173"]})) //replaced with front end url
app.use(upload())

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URL).then(app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`))).catch(err => console.log(err))
//npm run dev


