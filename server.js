const express = require('express');
const cors = require('cors')
const app = express();
const serialPort = require('./pole.display');

app.use(express.json());
const allowedOrigins = ['http://app.sparkypos.test', 'https://app.sparkypos.test', 
                        'http://app.sparkypos.com', 'https://app.sparkypos.com'];

const corsOptions = {
    origin: function (origin, callback) {
        if (allowedOrigins.includes(origin)) {
        callback(null, true);  // Allow the request
        } else {
        callback(new Error('Not allowed by CORS'));  // Deny the request
        }
    },
    credentials: true,  // This is essential when credentials are included
    optionsSuccessStatus: 200  // For legacy browser support
};

app.use(cors(corsOptions)); // Apply CORS with options
const port = 5050;

app.get('/display', (req, res) => {
    const upper = req.query.upper;
    const lower = req.query.lower;

    if (upper || lower) {
        console.log(`Receive the request upper: ${upper} lower: ${lower}`);
        serialPort.text(upper, lower);
    } else {
        serialPort.welcome();
    }
    res.send({
        success: true,
        message: 'Received text'
    });
});

app.post('/display', (req, res) => {
    const {upper, lower} = req.body;

    if (upper || lower) {
        console.log(`Receive the request upper: ${upper} lower: ${lower}`);
        serialPort.text(upper, lower);
    }
    res.send({
        success: true,
        message: 'Received text'
    });
})
app.listen( port, () => {
    console.log(`Server is running on http://localhost:${port}`)
});