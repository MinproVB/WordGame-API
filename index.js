require('dotenv').config();

const app = require('./src/app');

// Start bot
//require('./src/bot');

// Start API{
const server = app.listen(process.env.port, () => {
    console.log(`API lancée sur ${process.env.port}`);
});