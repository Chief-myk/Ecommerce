const express = require('express');
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174" , "https://ecommerce-ailk.onrender.com", "https://ecommerce-admin-cuh3.onrender.com"], credentials: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/user', authRoutes);
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes );
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port} check : http://localhost:${port}/`);
});