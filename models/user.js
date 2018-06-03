const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  // photo: {
  //   type: String,
  //   required: false,
  //   trim: true
  // },
    password: {
      type: String,
      required: true
    }
});

// authenticate input against database documents
UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email: email })
      .exec(function (error, user) {
        if (error) {
          return callback(error);
        } else if ( !user ) {
          var err = new Error('User not found.');
          err.status = 401;
          return callback(err);
        }
        bcrypt.compare(password, user.password , function(error, result) {
          if (result === true) {
            return callback(null, user);
          } else {
            return callback();
          }
        })
      });
}

// hash password before saving to database
UserSchema.pre('save', function(next) {
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});

const User = mongoose.model('User', UserSchema);
module.exports = User;

// var mongoose = require('mongoose');
// mongoose.connect("mongodb://localhost:27017/db"); //connect mongoose to the mongo database db
// var db = mongoose.connection;
//
// // On error, log it out in the console
// db.on("error", function(err){
//   console.error("connection error:", err);
// });
//
// // Open connection to the database
// db.once("open", function(){
//   console.log("db connection successful");
//   // All database communication goes here
//
//   var UserSchema = new mongoose.Schema({
//     email: {
//       type: String,
//       required: true,
//       trim: true,
//       unique: true,
//     },
//     name: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     photo: {
//       type: String,
//       required: true,
//       trim: true
//     }
//   });
//
//   var User = mongoose.model("User", UserSchema);
//   var user = new User({
//     email: "carro.forslund@gmail.com",
//     name: "Carro Forslund",
//     photo: "https://www.facebook.com/photo.php?fbid=10210520805313012&set=a.1388319664651.2052107.1131843312&type=3&theater"
//   });
//
//   user.save(function(err){
//     if (err) console.error("Save Failed.", err);
//     else console.log("Saved!");
//     db.close(function(){
//       console.log("Database closed.");
//     }); // close the connection
//   });
//
// });
