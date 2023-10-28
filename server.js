const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });
const app = require('./app');
const PORT = process.env.PORT || 80;

dbConnectionPromise = (url) => {
   return new Promise((resolve, reject) => {
      mongoose
         .connect(url,
            ((err) => {
               if (err) reject('Database is not connected please restart the server!');
               else resolve('Database is connected!');
            }));
   })
}

dbConnectionPromise(process.env.DATABASE).then((params) => {
   console.log('Promise resolved', params);
   app.listen(PORT, () => {
      console.log(`Server Listening at port ${PORT}`);
   })
}).catch((params) => {
   console.log('error', params);
})
