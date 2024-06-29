import connectToMongoDB from "./db.js"
connectToMongoDB()
import express from "express"
import cors from "cors"
const app = express()
app.use(express.json())
app.use(cors())

import apiEndpoints from "./endPoints/apis.js"
app.use("/api", apiEndpoints)
app.listen(8000, () => {
    console.log("your app listing at http://localhost:8000");
})