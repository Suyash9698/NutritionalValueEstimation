const express = require("express");
const session = require('express-session');
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const cors = require("cors");
const formidable = require("formidable");
const store = new session.MemoryStore();
const app = express();

app.use(cookieParser());
app.use(session({
  secret: 'xyz', 
  resave: false,
  saveUninitialized: false,
  store
  
}));

app.use(express.json());
app.use(cors());


//------------------------------------------->>>>>>>>>>>>>>
const caloricContentPerGram = {
  "apple": 0.52,
  "orange": 0.5,
  "banana": 1.2,
  "broccoli": 0.55,
  "carrot": 0.41,
  "hot dog": 1.5,
  "pizza": 2.66,
  "donut": 4.12,
  "cake": 2.57,
  "sandwich": 3.04,
  "grapes" : 0.7,
  "samosa" : 0.8,
  "dhokla" : 1.5,
  "roti" : 2.01,
  "cucumber" : 0.1,
  "cabbage" : 0.2,
  "jalebi" : 2.01,
  "kiwi" : 0.56,
  "sweetcorn" : 0.4,
  "tomato" : 0.2,
  "burger" : 2.5,
  "pineapple" : 0.5,
  "watermelon" : 0.2,
  "rice" : 1.2,
};

const fruitsWithDensity = {
  "apple": 0.95,
  "orange": 1.06,
  "banana": 1.1,
  "broccoli": 0.92,
  "carrot": 0.86,
  "hot dog": 1.02,
  "pizza": 0.5,
  "donut": 0.8,
  "cake": 0.6,
  "sandwich": 1.2,
  "grapes": 0.7,
  "samosa" : 0.8,
  "dhokla" : 0.871,
  "rice" : 0.72,
  "roti" : 0.77,
  "cucumber" : 0.95,
  "cabbage" : 0.47,
  "jalebi" : 0.46,
  "kiwi" : 0.87,
  "sweetcorn" : 0.49,
  "tomato" : 0.9,
  "burger" : 0.99,
  "pineapple" : 0.8,
  "watermelon" : 0.6
};


const userConnection = mongoose.createConnection("mongodb://localhost:27017/SuyashLabData");
const suyashLab3rdConnection = mongoose.createConnection("mongodb://localhost:27017/userNutritionCalories");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});



// const calorie = new mongoose.Schema({
//   fruit: String,
//   cal : Number,
// })

// const calorie = new mongoose.Schema({
//   data: [{
//     fruit: String,
//     cal: Number,
//   }],
// });

const calorie = new mongoose.Schema({
  username: String,
  items: [{
    name: String,
    quantity: Number,
  }],
});


// Create models for "users" and "chats" collections using their respective connections and schemas
const User = userConnection.model("User", userSchema);
const Calorie = suyashLab3rdConnection.model("Calorie",calorie);







//----------------------------------------------------<<<<<<<<<<

// mongoose.connect("mongodb://localhost:27017/SuyashLabData", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;

// const userSchema = new mongoose.Schema({
//   username: String,
//   password: String,
// });

// const User = mongoose.model("User", userSchema);

//---------------

const { exec } = require("child_process");

const path = require("path");  

app.post("/runPythonScript", (req, res) => {
  //console.log(filePath)


  const form = new formidable.IncomingForm();
form.parse(req, (err, fields, files) => {
  if (err) {
    res.status(500).json({ message: "Error parsing form data" });
    return;
  }

  const fileName = fields.filePath;

  console.log("File Path:", fileName);

 // const filePath = "/Users/suyash9698/desktop/2023202017today/client/src/image.jpeg"; 

  const fullFilePath="/Users/suyash9698/Desktop/apple/"+fileName;
  
  const pythonScriptPath = "/Users/suyash9698/desktop/2023202017today/client/src/newtest.py"; 
  
  const command = `python3 ${pythonScriptPath} ${fullFilePath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the Python script: ${error}`);
      res.status(500).json({ message: "Error running the Python script" });
    } else {
      const modifiedImagePath = stdout.trim(); 
      console.log("---------------------------------");
      console.log(modifiedImagePath)
      const oldarray=modifiedImagePath.split("\n");
      //arr.shift();
      //arr.shift();
      const arr=oldarray[2].split(" ")
      const paths=arr[0];
      arr.shift();
      arr.sort();
      const hashmap = {};

      for(var i=0;i<arr.length;i++){
        const here=arr[i].split(",");
        const density2 = parseFloat(fruitsWithDensity[here[0]]);
        if(isNaN(density2))
        continue;
        
        if (hashmap[here[0]] === undefined) {
          // Key doesn't exist, initialize it
          //console.log(parseFloat(here[1]));
          const density = parseFloat(fruitsWithDensity[here[0]]);
          const calPerGram = parseFloat(caloricContentPerGram[here[0]]);
          console.log(parseFloat(here[1]));
          //hashmap[here[0]] = parseFloat(here[1]) * density * calPerGram; 
          
          hashmap[here[0]] = parseFloat((parseFloat(here[1]) * density * calPerGram));

        } else {
          // Key exists, add the value to the existing value
          
          const density = parseFloat(fruitsWithDensity[here[0]]);
          const calPerGram = parseFloat(caloricContentPerGram[here[0]]);
          //hashmap[here[0]] += parseFloat(here[1]) * density * calPerGram;
          hashmap[here[0]] += parseFloat((parseFloat(here[1]) * density * calPerGram));

          
        }
      }




      //-----------------useless
      // for (const key in hashmap) {
      //   const value = hashmap[key];
      //   console.log(`Key: ${key}, Value: ${value}`);
      // }
      // async function saveData() {
      //   const dataArray = [];
      
      //   for (const key in hashmap) {
      //     if (hashmap.hasOwnProperty(key)) {
      //       const value = hashmap[key];
      //       const data = {
      //         fruit: key,
      //         cal: value
      //       };
      //       dataArray.push(data);
      //     }
      //   }
      
      //   try {
      //     const result = await Calorie.insertMany(dataArray);
      //     console.log('Data saved successfully:', result);
      //   } catch (error) {
      //     console.error('Error saving data:', error);
      //   }
      // }
      
      // saveData();
      
//-------------------------------------------------retrieving
      const storedUsername = req.session.username;
   console.log(store);
   console.log(req.session.username);
     
async function saveData(storedUsername) {
  const transformedData = {
    username: storedUsername,
    items: Object.entries(hashmap).map(([name, quantity]) => ({ name, quantity })),
  };

  // Insert the document into the MongoDB collection
  return Calorie.create(transformedData);
}

// Save data
saveData(storedUsername)
  .then(savedData => {
    console.log('Data saved successfully:', savedData);
  })
  .catch(error => {
    console.error('Error saving data:', error);
  });

      
      
      
      
      const absoluteImagePath = path.join(__dirname, paths); // Construct an absolute path
      res.status(200).json({ 
        message: "Python script executed successfully", 
        imagePath: absoluteImagePath,
        hashmap: hashmap
      });
    }
  });
});
});


//----

app.delete('/deleteFile', (req, res) => {
  const { filePath } = req.body;

  if (!filePath) {
    return res.status(400).json({ error: 'Missing filePath in the request body' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
      res.status(500).json({ error: 'Error deleting the file' });
    } else {
      console.log(`File deleted successfully: ${filePath}`);
      res.status(200).json({ message: 'File deleted successfully' });
    }
  });
});

//----------------

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        res.status(400).json({ message: "Username already registered" });
      } else {
        User.create({ username, password })
          .then((newUser) => {
            res.status(200).json({ message: "Registered successfully" });
          })
          .catch((err) => {
            res.status(500).json({ message: "Error creating user" });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error checking" });
    });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username: username })
    .then((user) => {
      if (user) {
        if (user.password === password) {

          req.session.username = username;
          req.session.save();
         console.log(store);
          res.json({ success: true, message: "Redirecting to home page" });
        } else {
          res.json({ success: false, message: "The password is incorrect" });
        }
      } else {
        res.json({ success: false, message: "No record existed" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    });
});
// Logout endpoint
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Error logging out" });
    } else {
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Logged out successfully" });
    }
  });
});

// Start the server
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});