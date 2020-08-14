const path = require ('path');
const express = require ('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

console.log(__dirname);
console.log(path.join(__dirname, '../public'));

const app = express();
const port = process.env.PORT || 3000

//define path for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//setup handle bars engine and location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirectoryPath));


//dynamic content(.hbs files)
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Avanthi'
    });
});

app.get('/about', (req,res) =>{
    res.render('about',{
        title: 'About me',
        name: 'Avanthi'
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Help message',
        title: 'Help',
        name: 'Avanthi'
    })
})


//static content (.html files)
// app.get('', (req, res) => {
//     res.send('<h1>Weather</h1>');
// });

// app.get('/help', (req, res) => {
//     res.send([{
//         name: 'Avanthi',
//         age: 34
//     },{
//         name: 'Narendra',
//         age: 37
//     }]);
// });

// app.get('/about', (req, res) => {
//     res.send('<h1>About</h1>');
// });

app.get('/weather', (req,res) => {
    if(!req.query.address){
        return res.send({
            error: 'You must provide address' 
        })
    }
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if(error){
            return res.send({error});
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if(error){
                return res.send({error});
            }
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req,res) => {
    if(!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search);
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Avanthi',
        errorMessage: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 404,
        name: 'Avanthi',
        errorMessage: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})