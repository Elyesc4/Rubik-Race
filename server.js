if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const port = 3000

const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const mariadb = require('mariadb/callback');
const formData = require('express-form-data');
const fs = require('fs');
const app = express()

const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

var users = []

const conn = mariadb.createConnection({
    host: process.env.DB_HOST, 
    user:'root', 
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB
});


conn.connect(err => {
if (err) {
  console.log("not connected due to error: " + err);
} else {
//   console.log("Database connected! connection id is " + conn.threadId);
}
});

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(formData.parse({}));
app.use(express.static('public'));

const viewsDir = __dirname + '/views/';
const contentDir = viewsDir + '/content/';
const pagesDir = viewsDir + '/pages/';

var user = null
var settings;
var infotext;
var lodedlevel;
var gamebord;
var levelgoal;
var levelnames = [];

const getJSONdata = (path, filename) => {
    let file = fs.readFileSync(path + filename);
    let data = JSON.parse(file)
    return data
}

const writeJSONdata = (filename, data) => {
    fs.writeFileSync(contentDir + filename, JSON.stringify(data));
}

const  setRenderData = async () => {
    // gamebord = undefined ? gamebord = null : gamebord = gamebord;
    // levelgoal = undefined ? levelgoal = '/// info ///' : levelgoal = levelgoal;
// 
    levelnames = [] // reset
    // let levels = getJSONdata(contentDir, 'level.json').levels
    // for (let i = 0; i < levels.length; i++) {
        // levelnames.push(levels[i].headline)
    // }

    settings = await getJSONdata(contentDir, 'settings.json')

    var sql = `SELECT headline FROM levels;`
    var data = await conn.query(sql)

    console.log(data);
}

app.get('/', (req, res) => {
    res.redirect('/Rubic-race');
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    var sql = 'SELECT * FROM users'
    conn.query(sql, (err, result) => {
      if (err) throw err;
      users = result
    })
    res.render(pagesDir + 'login.ejs')
})
  
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render(pagesDir + 'register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        var sql = `INSERT INTO users (name, email, password) VALUES ("${req.body.name}", "${req.body.email}", "${hashedPassword}")`;
        conn.query(sql, (err) => {
        if (err) throw err;
        });
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

app.get('/Rubic-race', (req, res) => {

    setRenderData();
    console.log(levelnames);

    res.render(pagesDir + 'Rubic-race', {
        user: req.user,
        infotext: infotext,
        lodedlevel: lodedlevel,
        gamebord: gamebord,
        levelgoal: levelgoal,
        levelnames: levelnames
    });
});

// app.get('/Rubic-race-mobile', (req, res) => {
// 
    // setRenderData();
// 
    // res.render(pagesDir + 'Rubic-race-mobile', {
        // settings: settings,
        // infotext: infotext,
        // lodedlevel: lodedlevel,
        // gamebord: gamebord,
        // levelgoal: levelgoal,
        // levelnames: levelnames
    // });
// });

app.get('/settings', (req, res) => {

    setRenderData();

    res.render(pagesDir + 'settings', {
        user: req.user,
        settings: settings,
    });
});

app.get('/loadlevel/:levelid', (req, res) => {
    levelid = req.params.levelid
    // let data = getJSONdata(contentDir, 'level.json')
    var sql = `SELECT headline, levelpattern, levelgoal FROM levels;`
    conn.query(sql, (err, result) => {
        if (err) throw err;
        let data = result
        
        gamebord = JSON.parse(data[levelid].levelpattern)
        levelgoal = JSON.parse(data[levelid].levelgoal)
        lodedlevel = data[levelid].headline
    })
    

    res.redirect('/Rubic-race');
});

app.post('/settings/save', (req, res) => {
    let data = req.body

    if(data.kontrast == undefined) {
        data.kontrast = "off"
    }

    writeJSONdata('settings.json', data)

    res.redirect('/settings');
})

app.post('/settings/reset', (req, res) => {
    let resetdata = getJSONdata(contentDir, 'resetsettings.json')
    console.log(resetdata);
    
    writeJSONdata('settings.json', resetdata)

    res.redirect('/settings');
})

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})