const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const PORT = 8080;

const {encrypt, decrypt} = require('./encryptionHandler');
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: '20002991',
    database: 'login_information',
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = encrypt(password);

    db.query("SELECT COUNT( * ) AS existingAccount FROM users WHERE email=?", [email], function(err, rows) {
        if (err) throw err;
        if (rows[0].existingAccount!==0)
        {
            res.send("This email adress already has an account");
        }
        else {
            db.query("SELECT COUNT( * ) AS existingUsername FROM users WHERE username=?", [username], function(err, rows) {
                if (err) throw err;
                if (rows[0].existingUsername!==0)
                {
                    res.send("Username Taken");
                }
                else{
                    db.query("INSERT INTO users (username, password, iv, email) VALUES (?,?,?,?)", 
                    [username, hashedPassword.password, hashedPassword.iv, email],
                    (err, result) => {
                        if (err) { console.log(err); }
                        else { res.send("Success"); } 
                    });
                }
            });
        }
        });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query("SELECT COUNT( * ) AS existingAccount FROM users WHERE username=?;", [username], function(err, rows, fields) {
        if (err) throw err;
        if (rows[0].existingAccount===0)
        {
            res.send("There is no existing username, please sign up !");
        }

        else {
            db.query("SELECT * FROM users WHERE username=?;", 
            [username],
            (err, result) => {
                if (err) { console.log(err); }
                else {
                    const encryptedPassword = { iv: result[0].iv, password: result[0].password };
                    const decryptedPassword = decrypt(encryptedPassword);

                    if (password!==decryptedPassword)
                    {
                        res.send("This is not the right password, forgot password ?");
                    } 
                    else 
                    {
                        res.send("Logged in !");
                    }
                }
            });
        }
        });
});

app.listen(PORT, () => console.log('API is running on http://localhost:8080'));