const { faker } = require('@faker-js/faker');
const mysql=require('mysql2');
const express= require("express");
const app=express();
const path=require("path");
const methodOverride = require('method-override');
const {v4:uuidv4}=require("uuid");

app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password:'root'
});


// Entering bulk data using faker
let RandomUser=()=>{
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ]
}


// let q="INSERT INTO user (id,username,email,password) VALUE ?";

// Home route
app.get("/",(req,res)=>{
  let q=`SELECT COUNT(*) FROM user`;
  try {
  // connection.query(q,user,(err,result)=>{
      connection.query(q,(err,result)=>{
      if(err) throw err;
      //  console.log(result);
       let count=result[0]["count(*)"];
      // let count = result[0].count;
      //  res.send(result);
      // res.render("home.ejs",{count:count});
      res.render("home.ejs",{count});
      // connection.end();
    });
  } catch (err) {
      res.send("Something went wrong!");
  }
  // res.send("Welcome to home page");
});

app.get("/user",(req,res)=>{
  let q=`SELECT * FROM user`;
  try {
        connection.query(q,(err,users)=>{
        if(err) throw err;
        res.render("showuser.ejs",{users});
      });
    } catch (err) {
        console.log(err);
        res.send("Something went wrong!");
    }
})

// Edit route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`
  // res.render("edit.ejs");
  try {
        connection.query(q,(err,result)=>{
        if(err) throw err;
        let user=result[0];
        res.render("edit.ejs",{user});
      });
    } catch (err) {
        console.log(err);
        res.send("Something went wrong!");
    }
});

// UPDATE ROUTE
app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let{username, password}=req.body;
  let q=`SELECT * FROM user WHERE id=?`;
  try {
        connection.query(q,(err,result)=>{
        if(err) throw err;
        if(formPass!=user.password){
          res.send("Wrong Password!");
        }else{
          let q2=`UPDATE user SET username='${username}' WHERE id='${id}'`;
          connection.query(q2,(err,result)=>{
            if(err) throw err;
            res.redirect("/user");
          })
        }
      });
    } catch (err) {
        console.log(err);
        res.send("Something went wrong!");
    }
});

app.get("/user/new",(req,res)=>{
  res.render("new.ejs");
});

app.post("/user/new",(req,res)=>{
  let{email,username,password}=req.body;
  let id=uuidv4();
  let q=`INSERT INTO user (id,username,email,password) VALUES ('${id}','${username}','${email}','${password}')`;
  try {
    connection.query(q,(err,result)=>{
    if(err) throw err;
      res.redirect("/user");
  });
} catch (err) {
    console.log(err);
    res.send("Something went wrong!");
}
});

app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  try {
    connection.query(q,(err,result)=>{
    if(err) throw err;
    let user=result[0];
      res.render("delete.ejs",{user});
  });
} catch (err) {
    console.log(err);
    res.send("Something went wrong!");
}
});

app.delete("user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let {password}=req.body;
  let q=`SELECT * FROM user WHERE id=?`;
  try {
    connection.query(q,[id],(err,result)=>{
    if(err) throw err;
    let user=result[0];
    if(user.password!=password){
      res.send("Wrong Password!");
    }else{
      let q2=`DELETE FROM user WHERE id=${id}`;
      try {
        connection.query(q,(err,result)=>{
        if(err) throw err;
          res.redirect("/user");
      });
    } catch (err) {
        console.log(err);
        res.send("Something went wrong!");
    }
    }
  });
} catch (err) {
    console.log(err);
    res.send("Something went wrong!");
}
});

app.listen(8080,()=>{
  console.log(`Server is listing on $(https:/localhost:8080)`);
})
// connection.end();
// let data=[];
// // Push 100 user data into DB
// for(let i=1;i<=100;i++){
//   // console.log(RandomUser());
//   data.push(RandomUser())
// }

// let user=["123","123_username","abc@gmail.com","pass123"];
// let user1=["124","124_username","abcfzv@gmail.com","pass13423"];
// let user2=["125","125_username","abcarv@gmail.com","pass15623"];

//  Entering multiple users data in DB table
// let users=[["121","123_useerrname","abergc@gmail.com","passtrg123"],["127","124_username","abcfzv@gmail.com","pass13423"],["128","125_username","abcarv@gmail.com","pass15623"]];

// try {
//   // connection.query(q,user,(err,result)=>{
//     connection.query(q,[data],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//   })
// } catch (err) {
//   console.log(err);
// }

// try {
//   connection.query("SHOW TABLES",(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//   })
// } catch (err) {
//   console.log(err);
// }


// let RandomUser=()=>{
//     return {
//       userId: faker.string.uuid(),
//       username: faker.internet.userName(),
//       email: faker.internet.email(),
//       password: faker.internet.password()
//     };
// }


// console.log(RandomUser());