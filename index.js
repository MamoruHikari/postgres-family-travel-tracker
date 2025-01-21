import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import session from 'express-session';

const app = express();
const port = process.env.PORT || 3000; 

const db = new pg.Client({
  connectionString: 'postgresql://postgresdb_owner:XLNl3T5gmeOB@ep-frosty-dew-a2nbh26t.eu-central-1.aws.neon.tech/postgresdb?sslmode=require',
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: 'a93kd7Gh!sDk4pQe5zB&9mX@tWn2rVc',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.get("/", async (req, res) => {
  const users = await db.query("SELECT * FROM users");  

  const error = req.query.error || null;

  res.render("index.ejs", {
    users: users.rows,
    countries: [],
    total: 0,
    color: "steelblue",
    error: error
  });
});

app.post("/user", (req, res) => {
  if (req.body.user) {
    const userID = req.body.user;
    return res.redirect(`/user?id=${userID}`);
  }
  
  if (req.body.add) {
    return res.render("new.ejs");
  }
});

app.get("/user", async (req, res) => {
  const userID = req.query.id;
  req.session.activeUser = userID;
  
  const usersDB = await db.query("SELECT * FROM users");
  const selectedUser = usersDB.rows.find(u => String(u.id) === userID);
  const userColor = selectedUser ? selectedUser.color : "steelblue";

  const userCountries = await db.query("SELECT country_code FROM visited_countries WHERE user_id = $1", [userID]);
  const visitedCountries = userCountries.rows.map(row => row.country_code);

  const error = req.query.error || null;

  res.render("index.ejs", {
    users: usersDB.rows,
    countries: visitedCountries,
    total: visitedCountries.length,
    color: userColor,
    error: error
  });
});

app.post("/add", async (req, res) => {
  const userID = req.session.activeUser;
  const countryInput = req.body.country;

  const client = await db.connect();

  try {
    await client.query('BEGIN');
    
    const result = await client.query("SELECT country_code FROM countries WHERE country_name ILIKE $1", [`%${countryInput}%`]);

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.redirect(`/user?id=${userID}&error=Country doesn't exist. Please try again.`);
    }

    const countryCode = result.rows[0].country_code;
    const existing = await client.query("SELECT 1 FROM visited_countries WHERE country_code = $1 AND user_id = $2", [countryCode, userID]);

    if (existing.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.redirect(`/user?id=${userID}&error=Country has already been added. Please try again.`);
    }

    await client.query("INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)", [countryCode, userID]);

    await client.query('COMMIT');
    res.redirect(`/user?id=${userID}`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("An error occurred:", error.message);
    res.status(500).redirect("/?error=An unexpected error occurred. Please try again");
  } finally {
    client.release();
  }
});

app.post("/new", async (req, res) => {
  try {
    const newUserName = req.body.name;
    const formattedName = newUserName.charAt(0).toUpperCase() + newUserName.slice(1).toLowerCase();

    const newUserColor = req.body.color;

    if (!newUserName || !newUserColor) {
      return res.status(400).redirect("/?error=Both name and color are required to add new user. Please try again.");
    }

    const result = await db.query("INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id", [formattedName, newUserColor]);
    const newUserID = result.rows[0].id;

    res.redirect(`/user?id=${newUserID}`);

  } catch (error) {
    console.log("Error adding new user:", error.message);
    res.status(500).redirect("/?error=Failed to add new user. Please try again.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
