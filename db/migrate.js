const Postgrator = require("postgrator");
const path = require("path");
require('dotenv').config()


const postgrator = new Postgrator({
  migrationDirectory: path.resolve(__dirname, "../db/migrations"),
  driver: "pg",
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD
});

// Migrate to max version
async function runMigration() {
  return postgrator.migrate().then(() => {
    console.log("migrations applied");
  });
}
postgrator.on("migration-finished", (migration) => {
  console.log(migration);
});

runMigration()
