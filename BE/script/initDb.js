const mysql = require("mysql2/promise");
require("dotenv").config();

(async () => {
  try {
    // 1️⃣ Connect to MySQL *without* specifying DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    // 2️⃣ Create the database if not exists
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    console.log(`✅ Database '${process.env.DB_NAME}' is ready.`);

    await connection.end();

    // 3️⃣ Import Sequelize and sync models
    const sequelize = require("../config/db");
    const Student = require("../models/student"); // import all models
    const Teacher = require("../models/teacher");
    const Class = require("../models/class");

    // Sync tables: only add missing tables/columns
    await sequelize.sync({ alter: true });
    console.log("✅ Tables are up-to-date");

    // 4️⃣ Optionally seed data
    // const seed = require('../seeders/seedData');
    // await seed();

    //console.log('🌱 Database seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error("❌ Error initializing database:", err);
    process.exit(1);
  }
})();
