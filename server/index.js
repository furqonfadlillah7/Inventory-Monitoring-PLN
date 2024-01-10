import express from "express";
import cors from "cors";
import session from "express-session";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import FileUpload from "express-fileupload";

// Routes
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import BarangRoute from "./routes/BarangRoute.js";

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

app.use(
  session({
    secret: "13u4tnkdfsi8348ijjnsduauenauasdasdas",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(FileUpload());

app.use(express.static("public"));
app.use(UserRoute);
app.use(AuthRoute);
app.use(BarangRoute);

app.get("/", (req, res) => {
  res.send("Gilang dan Silpiy!");
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
