const express = require('express');
const keys = require('./config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const bodyParser = require('body-parser');
const handlebar = require('express-handlebars');


const app = express();

app.engine('handlebars', handlebar({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.   use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false})); 

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.render('index',{
    stripePublishableKey: keys.stripePublishableKey
}); 
}); 

app.post('/charge', (req, res) => {
    const amount = 1000;

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
        amount,
        description: 'web development ebook',
        currency: 'usd',
        customer:customer.id  
    }))
    .then(charge => res.render('success'));
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started on ${port} `);
}); 