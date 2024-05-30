// const express = require('express');
// const mongoose = require('mongoose');
// const morgan = require('morgan');
// const bodyParser = require('body-parser')
// require('dotenv/config')
// const authJwt = require('./middlewares/jwt');
// const errorHandler = require('./middlewares/error_handler');
// // const { express-jwt: jwt } = require("express-jwt");
// const app = express();
// const env = process.env;



// const authRouter = require('./routes/auth');;
// const usersRouter = require('./routes/users');
// const vendorsRouter = require('./routes/vendors');
// const eventOrganizersRouter = require('./routes/eventOrganizers');
// const adminRouter = require('./routes/admin');
// const API = env.API_URL;
// // const eventsRouter = require('./routes/events');


// app.use(bodyParser.json());
// // app.use('events', eventsRouter)
// // app.use(corse());
// // app.options('*', cors());    
// app.use(authJwt());
// // app.use(errorHandler);
// app.use(morgan('tiny'));


// app.use(`${API}`, authRouter); //middleware for the route

// app.use(`${API}/admin`, adminRouter);
// app.use(`${API}/users`, usersRouter);
// app.use(`${API}/vendors`, vendorsRouter);
// app.use(`${API}/eventOrganizers`, eventOrganizersRouter);
// app.use('/public', express.static(__dirname + '/public')); //let client fetch images from directory


// // app.get(`${API}/users`, (req, res) => {
// //     return res.json([{ name: 'Aman', org: 'Asheweyna1', age: 26 }]);
// // });
// // app.get(`${API}/vendors`, (req, res) => {
// //     return res.json([{ name: 'Aduniya', org: 'Asheweyna2', age: 36 }]);
// // });
// // app.get(`${API}/eventOrganizers`, (req, res) => {
// //     return res.json([{ name: 'Kira', org: 'Asheweyna3', age: 46 }]);
// // });



// //start the server
// const port = process.env.PORT;
// const hostname = process.env.HOSTNAME;


// mongoose
//     .connect(env.MONGODB_CONNECTION_STRING)
//     .then(() => {
//         console.log('Connected to a database')
//     })
//     .catch((error) => {
//         console.error(error)
//     });

// app.listen(port, hostname, () => {
//     console.log(`The server is running at  ${hostname}:${port}`)
// });


const bodyParser = require('body-parser');
// const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const authJwt = require('./middlewares/jwt');
const errorHandler = require('./middlewares/error_handler');
const authorizePostRequests = require('./middlewares/authorization');

const app = express();
const env = process.env;
const API = env.API_URL;

app.use(bodyParser.json());
app.use(morgan('tiny'));
// app.use(cors());
// app.options('*', cors());
app.use(authJwt());
// app.use(authorizePostRequests);
app.use(errorHandler);

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const vendorsRouter = require('./routes/vendors');
const eventOrganizersRouter = require('./routes/eventOrganizers');
const adminRouter = require('./routes/admin');
const categoriesRouter = require('./routes/categories');
const taxNumberRoutesRouter = require('./routes/taxNumberRoutes');
const productsRouter = require('./routes/products');
const checkoutRouter = require('./routes/checkout');
const ordersRouter = require('./routes/orders');
const ticketsRouter = require('./routes/tickets');

app.use(`${API}/`, authRouter);
app.use(`${API}/users`, usersRouter);
app.use(`${API}/vendors`, vendorsRouter);
app.use(`${API}/eventOrganizers`, eventOrganizersRouter);
app.use(`${API}/admin`, adminRouter);
app.use(`${API}/categories`, categoriesRouter);
app.use('/public', express.static(__dirname + '/public'));
app.use(`${API}`, taxNumberRoutesRouter);
app.use(`${API}/products`, productsRouter);
app.use(`${API}/checkout`, checkoutRouter);
app.use(`${API}/orders`, ordersRouter);
app.use(`${API}/tickets`, ticketsRouter);

// Start the server
// localhost >> 127.1.0.0
const hostname = env.HOST;
const port = env.PORT;
// require('./helpers/cron_job'); 
mongoose
    .connect(env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log('Connected to Database');
    })
    .catch((error) => {
        console.error(error);
    });

app.listen(port, hostname, () => {
    console.log(`The server is running at  ${hostname}:${port}`)
});