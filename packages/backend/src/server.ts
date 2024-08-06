import express from "express";
import cors from "cors";

//Routes
import createProfile from "./routes/create_profile.route.ts";

const app = express();

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// Use this after the variable declaration
app.use(cors(corsOptions)); 

// Body parser
app.use(express.json());

//Mount routers
app.use("/create_profile", createProfile);

const PORT = process.env.PORT || 5000;

//* SERVER */
const server = app.listen(
  PORT,
  () => console.log(
    `server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);

// Handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${JSON.stringify(err)}`);

  //Close the server & exit process
  server.close(() => process.exit(1));
});
