const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect("mongodb://localhost:27017/medicalDB", {
  useNewUrlParser: true,
});

const medSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
});

const Med = mongoose.model("med", medSchema);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  Med.findOne(
    {
      email: email,
    },
    function (err, user) {
      if (user) {
        console.log("User already exists");
        return res.status(404).send({ error: "already exist" });
      } else {
        const newMed = new Med({
          name: name,
          email: email,
          password: password,
          phone: phone,
        });

        newMed.save((err, med) => {
          if (err) {
            console.log(err);
          } else {
            console.log("added");
          }
        });
      }
    }
  );

   /* res.send(200);  */
});

app.post("/login", (req, res) => {

  const email = req.body.email;
  const password = req.body.password;
  console.log(email, password);

  Med.findOne({
    email: email,
  },function(err,user){
    if(!user){
      console.log("no user found");
      return res.status(404).send({error:"no user found"});

    } else {
      if(user.password === password){
        console.log("login success");
        return res.status(200).json({message:"success"});
      } else{
        console.log("wrong password");
        return res.status(404).send({error:"wrong password"});
      }
    }
  })

});

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
