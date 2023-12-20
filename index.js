const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3030;

// const storage = multer.diskStorage({
//  destination: './public/uploads/',
//  filename: (req, file, cb) => {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//  }
// });

// const upload = multer({ storage: storage });


// Google Cloud Storage configuration
const storage = new Storage({
  projectId: 'capstone-project-ch2-ps206',
  keyFilename: './config/keyfile.json',
});

const bucketName = 'bucketfitdrive';

const multerStorage = multer.memoryStorage();

const upload = multer({ storage: multerStorage });

const db = mysql.createConnection({
 host: '34.128.99.177',
 user: 'root',
 password: '12345',
 database: 'db_driverfit'
});

db.connect((err) => {
 if (err) throw err;
 console.log('MySql Connected...');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', upload.single('image'), async (req, res) => {
  const { name, email, no_hp, password } = req.body;
  const imageBuffer = req.file.buffer;

  let hashedPassword = bcrypt.hashSync(password, 8);

  try {
    let sql = 'SELECT * FROM users WHERE email = ?';
    let results = await db.query(sql, [email]);

    if (results.length > 0) {
      throw new Error('Email already exists...');
    }

    // Specify the destination path in your Google Cloud Storage bucket
    const destinationPath = `images/${name}-${Date.now()}${path.extname(req.file.originalname)}`;

    // Create a Google Cloud Storage file
    const bucket = storage.bucket(bucketName);
    const gcsFile = bucket.file(destinationPath);

    // Create a write stream to upload the file
    const stream = gcsFile.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    // Handle stream events
    stream.on('error', (err) => {
      return res.status(500).json({ error: err.message });
    });

    stream.on('finish', async () => {
      // Insert user data into the database
      let sql2 = `INSERT INTO users SET ?`;
      let values = {
        name: name,
        email: email,
        no_hp: no_hp,
        image: `https://storage.googleapis.com/${bucketName}/${destinationPath}`,
        password: hashedPassword,
      };

      await db.query(sql2, values);
      res.send('Registration Successful...');
    });

    // Write the file data to the stream
    stream.end(imageBuffer);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.post('/login', (req, res) => {
 const { email, password } = req.body;

 let sql = `SELECT * FROM users WHERE email = '${email}'`;
 let query = db.query(sql, (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      let hashedPassword = result[0].password;
      if (bcrypt.compareSync(password, hashedPassword)) {
        res.send('Login Succesful...');
      } else {
        res.send('Wrong Email or Password');
      }
    } else {
      res.send('Wrong Email and Password');
    }
 });
});

// app.get('/users', async (req, res) => {
//     try {
//       const users = await db.query('SELECT * FROM users');
//       const userWithImageUrlList = [];
  
//       for (const user of users) {
//         // Ekstrak ID user dan informasi lain yang dibutuhkan
//         const userId = user.id;
//         const name = user.name;
//         const email = user.email;
//         const noHp = user.no_hp;
  
//         // Tambahkan pengenal unik alih-alih referensi langsung
//         const imageUrl = user.image; // Ganti dengan ID atau pengenal unik lainnya
  
//         // Tambahkan objek user dengan informasi yang dibutuhkan
//         userWithImageUrlList.push({
//           id: userId,
//           name,
//           email,
//           noHp,
//           imageUrl,
//         });
//       }
  
//       // Jika menggunakan pengenal unik, ambil objek terkait
//       if (req.query.includeRelated) {
//         // Implementasi untuk mengambil objek terkait menggunakan pengenal unik
//         // ...
  
//         // Tambahkan informasi terkait ke objek user
//         // ...
//       }
  
//       res.json(userWithImageUrlList);
//     } catch (error) {
//       res.status(500).send(error.message);
//     }
// });
  




app.get('/users/:id', async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (user.length === 0) {
      return res.status(404).send('User not found!');
    }

    // Extract user data and timer ID
    const userData = user[0];
    const timerId = userData.timerId;

    // Fetch Timer if needed
    let timer;
    if (req.query.includeTimer) {
      timer = await db.query('SELECT * FROM timers WHERE id = ?', [timerId]);
      if (timer.length === 0) {
        return res.send({ user: userData, timer: null }); // Optional: send null if timer not found
      }
      timer = timer[0]; // Extract timer data
    }

    // Build user object with timer data (optional)
    const userWithTimer = {
      ...userData,
      timer: timer, // Include timer data if fetched
    };

    res.json(userWithTimer);
  } catch (error) {
    res.status(500).send(error.message);
  }
});





app.post('/logout', (req, res) => {
  // Check if authorization header exists
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).send({ error: 'Unauthorized access!' });
  }

  // Extract and verify token
  const token = authorizationHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    // Clear user session or mark the token as invalid
    // (implement your chosen method for session management)

    res.send({ message: 'Logout successful!' });
  } catch (error) {
    res.status(401).send({ error: 'Invalid token!' });
  }
});


app.listen(port, () => {
 console.log(`Server is running on port ${port}`);
});