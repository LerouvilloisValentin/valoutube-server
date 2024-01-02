import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"
import videoRoutes from "./routes/videos.js"
import commentRoutes from "./routes/comments.js"
import authRoutes from "./routes/auth.js"
import cookieParser from "cookie-parser";
import path from "path"
import swaggerJSdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
dotenv.config();

const connect = () => {
    mongoose
      .connect(process.env.MONGO)
      .then(() => {
        console.log("Connected to DB");
      })
      .catch((err) => {
        throw err;
      });
  };
console.log(connect)

const options = {

    definition: {
        openapi: '3.0.0',
        info: {
            title: 'valoutube',
            version: '1.0.0',
            description: 'An API made with express and documented with Swagger. For now, all roads can be only tested with insomnia, postman...',
            license: {
                name: 'MIT',
            }
        },
        servers: [
            {
                url: 'http://localhost:3001',
                description: 'Main production server'
            },
        ],
    },

    apis: ['./app/routers/*.js'],

};

const specs = swaggerJSdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(cookieParser())
app.use(express.json())
app.use(express.static('client/build'))
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/videos", videoRoutes)
app.use("/api/comments", commentRoutes)

app.use((err, req,res, next)=>{
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message,
    }) 

})

app.get('/*', (_, res) =>{
    res.sendFile (path.join(__dirname, './client/build/index.html'))
})

app.listen(process.env.PORT || 3001, ()=>{
    connect()
    console.log("connected!");
});