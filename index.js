const express = require ('express');
const routes = require('./src/api-route');
const app= express();   
const cors = require("cors"); 
const port =8006;
const config = require ('./src/config')
const {connectMongoDB}= require ('./src/config/db')
const fs = require("fs");
const dotenvResult = require('dotenv').config({ path: './.env' });
const path = require('path')
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());
const cron = require('node-cron');
const { deletePastEvents } = require('./src/modules/events/event.service');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
cron.schedule('0 0 * * *', async () => {
    await deletePastEvents();
  });

connectMongoDB(config.db.uri).then(() => console.log('MongoDB connected'));app.use("/api" ,routes)


    app.listen(port, () => {
        console.log("Server is running on port", {port});
    }) 
    