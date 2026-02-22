import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
//import insertData from './controllers/insertData.js';  // Import the insertData function

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

// Test DB connection
(async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Connected to Supabase! Time:', res.rows[0].now);
  } catch (err) {
    console.error('DB Connection failed:', err);
  }
})();

// Test route
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ now: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Create table endpoint
app.get('/api/create-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS seating (
      id SERIAL PRIMARY KEY,
      "firstname" VARCHAR(50) NOT NULL,
      "lastname" VARCHAR(50) NOT NULL,
      "tablenumber" INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // Execute the query to create the table
    await pool.query(createTableQuery);
    res.status(200).json({ message: 'Table "seating" created successfully!' });
  } catch (err) {
    console.error('Error creating table:', err);
    res.status(500).json({ error: 'Error creating table: ' + err.message });
  }
});

// Insert Data endpoint (now in insertData.js)
//Insert Data endpoint
app.get('/api/insert-data', async (req, res) => {
  const insertQuery = `
      INSERT INTO seating ("firstname", "lastname", "tablenumber")
      VALUES 
('Meena','Muthuraman',13),
('Valli Priyanka','Nachiappan',13),
('Manikanden','Nagappan',13),
('Guhan','Nagappan',13),
('Ali','Nahm',13),
('Satish','Nandyala',13),
('Bala','Natarajan',13),
('Saradha','Natarajan',13),
('Pershia','Nelson',14),
('Marie','Noel',14),
('Wendy','Nyugen',14),
('Megan','Opatrny',14),
('Krishnakumar','Padmanabhan',14),
('Dhaval','Patel',14),
('Sangeetha','Payaniappa',14),
('Manivannan','Periakaruppan',14),
('Arun','Periakaruppan',15),
('Priya','Periakaruppan',15),
('CJ','Porter',15),
('Ramya','Prabhakar',15),
('Pramod','Prabhu',15),
('Deepa','Pramod',15),
('Rahul','Pramod',15),
('Rohan','Pramod',15),
('Meena','Raja',16),
('Smitha','Rajesh',16),
('Deepa','Rajesh',16),
('Meena','Ramanathan',16),
('Priya','Ramasamy',16),
('Sudha','Ramsankar',16),
('Vadivu','Ravi',16),
('Sridevi','Ravi',16),
('Gomathi','Ravi',17),
('Leena','Sagar',17),
('Kalyan','Sakthivelayutham',17),
('Meenu','Sampath',17),
('Diya','Sampath',17),
('Sakthi','Sampath',17),
('M.C.','Sankar',17),
('Sarada','Sankar',17),
('Prabhakar','Santhanam',18),
('Latha','Sathappan',18),
('Renuka','Sathya',18),
('Will','Schoener',18),
('Tam','Schoener',18),
('Zaya','Schoener',18),
('Eloise','Schoener',18),
('Derek','Shaffer',18),
('Emily','Shaffer',19),
('Noah','Shaffer',19),
('Oliver','Shaffer',19),
('Kalpana','Shunmugaa',19),
('Giridhar','Singh',19),
('Will','Strober',19),
('TA','Subbaraja',19),
('Praveena','Subbaraja',19),
('Vinod','Subbiah',20),
('Alagu','Subbiah',20),
('Meyyappan','Subramanian',20),
('Nachiappan','Subramanian',20),
('Subbiah','Subramanian',20),
('Indira','Sudhakar',20),
('Sam','Sundaresan',20),
('Sagar','Supanekar',20),
('Erica','Talbot',21),
('Nethra','Thenappan',21),
('Ravi','Thenappan',21),
('Alagu','Thenappan',21),
('Kannan','Thirunavukkarasu',21),
('Alan','Thiruppathy',21),
('Sathya','Thulasiraman',21),
('Jason','Toy',21),
('Raghupathy','Uncle',22),
('Payaniappa','Venkatachalam',22),
('Ramkumar','Venugopal',22),
('Anu','Vinod',22),
('Dianne','Wilson',22),
('Breon','Wilson',22),
('Sashi','Xavier',22),
('Peter','Xavier',22)
      ON CONFLICT DO NOTHING;
  `;

  try {
    // Execute the query to create the table
    await pool.query(insertQuery);
    res.status(200).json({ message: 'Sample data inserted into seating table!' });
  } catch (err) {
    console.error('Error inserting sample data:', err);
    res.status(500).json({ error: 'Error inserting sample data: ' + err.message });
  }
});

// Insert Data endpoint
//app.get('/api/insert-data', async (req, res) => {
//  const insertQuery = `
//    INSERT INTO seating ("firstName", "lastName", "tableNumber")
//    VALUES 
//    ('Alice', 'Smith', 1),
//    ('Bob', 'Johnson', 2),
//    ('Charlie', 'Brown', 3)
//    ON CONFLICT DO NOTHING;
//  `;
//
//  try {
//    // Execute the query to create the table
//    await pool.query(insertQuery);
//    res.status(200).json({ message: 'Sample data inserted into seating table!' });
//  } catch (err) {
//    console.error('Error inserting sample data:', err);
//    res.status(500).json({ error: 'Error inserting sample data: ' + err.message });
//  }
//});



// Search by Name
app.get('/api/people', async (req, res) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing name query parameter' });

  try {
    const result = await pool.query(`
      SELECT "firstname", "lastname", "tablenumber"
      FROM seating
      WHERE "firstname" ILIKE $1 OR "lastname" ILIKE $1
      ORDER BY "lastname" ASC
    `, [`%${name}%`]);
    res.json(result.rows);
  } catch (err) {
    console.error('Database select query failed:', err);
    res.status(500).json({ error: 'Database select query failed' });
  }
});

// Search by Table
app.get('/api/table/:tableNumber', async (req, res) => {
  const tableNumber = parseInt(req.params.tableNumber, 10);
  if (isNaN(tableNumber)) return res.status(400).json({ error: 'Invalid table number' });

  try {
    const result = await pool.query(`
      SELECT "firstname", "lastname"
      FROM seating
      WHERE "tablenumber" = $1
      ORDER BY "lastname" ASC
    `, [tableNumber]);
    res.json(result.rows);
  } catch (err) {
    console.error('Database query failed:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));