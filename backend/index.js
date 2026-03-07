const express = require("express");
const cors = require("cors");
const connectDb = require("./config/mongodb.js")

const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();


connectDb().catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

app.get('/',(req,res)=>{
  console.log("here server is running")
  res.send("server is running here")
})

// all middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "https://pragyafinancialservices.vercel.app" , 
  credentials: true
}));


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 

