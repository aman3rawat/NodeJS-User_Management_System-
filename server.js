const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });
const app = require('./app');

mongoose
   .connect(process.env.DATABASE,
      ((err) => {
         if (err)
            console.log('Please restart the server!');
         else
            console.log('Hello Mongo Here');
      }));

const PORT = process.env.PORT || 80;

app.listen(PORT, () => {
   console.log(`Server Listening at port ${PORT}`);
})
