require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const errorHandler = require('./middleware/errorHandler');
const app = express();
const router = require('./routes/routes');

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use("/api", router);

app.use(errorHandler);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});