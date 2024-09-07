const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const app = express();
const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "Fatimas",
  password: "Umair1022",
  port: 5432,
});
client
  .connect()
  .then(() => {
    console.log("Connected to Database.");
  })
  .catch((err) => {
    console.log("Error Connecting Database:", err);
  });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

let cartid = "CT001";

app.get("/home", async (req, res) => {
  try {
    const query = `select * from users`;
    const result = await client.query(query);
    const userData = {
      users: result.rows,
    };
    res.json(userData);
  } catch (error) {
    console.error(`Error Getting Data: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/cartData", async(req, res)=>{
  try {
    const query = `select ci.cartid,ci.quantity,p.productid,p.name,p.colour,p.price,p.categoryid,ct.categoryname from cartitems ci join products p on p.productid=ci.productid join category ct on p.categoryid=ct.categoryid`;
    const result = await client.query(query);
    const responseData = {
       cartDetails: result.rows
    };
    res.json(responseData);
  } catch (error) {
    console.error(`Error Fetching Products: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/submitProducts", async (req, res) => {
  try {
    const productid = req.body.productId;
    const cartitemid = await generateUniqueID("C", "cartitems", "carditemid");
    const query = `insert into cartitems(carditemid,quantity,cartid,productid)  values ($1,$2,$3,$4)`;
    const values = [cartitemid, 1, cartid, productid];
    await client.query(query, values);
    res.send(`Data Submission success`);
  } catch (error) {
    console.error(`Error Updating Products: ${error}`);
    res.status(500).send("Internal Server Error");
  }
});

async function generateUniqueID(prefix, tableName, columnName) {
  const idLength = 4;
  let id;
  do {
    const randomDigits = Math.floor(Math.random() * 10000); // Increased the range to generate more unique IDs
    id = prefix + randomDigits.toString().padStart(4, "0");
  } while (!(await isIDUnique(tableName, columnName, id)));
  return id;
}

async function isIDUnique(tableName, columnName, id) {
  try {
    const query = `SELECT EXISTS (SELECT 1 FROM ${tableName} WHERE ${columnName} = $1) AS exists`;
    const result = await client.query(query, [id]);
    const exists = result.rows[0].exists;
    return !exists;
  } catch (error) {
    console.error(`Error checking ${columnName} uniqueness:`, error);
    throw error;
  }
}

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/home`);
});
