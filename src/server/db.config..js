import pgPromise from "pg-promise";
const pgp = pgPromise({
    capSQL: true, // capitalize all generated SQL
});
const connectionConfig = {    
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true, // enable SQL logging
};

const db = pgp(connectionConfig);
db.connect()
    .then((obj) => {
        console.log("Connected to PostgreSQL database");
        obj.done(); // success, release the connection
    })
    .catch((error) => {
        console.log("Error connecting to PostgreSQL database:", error.message || error);
    });
   
export { db, pgp };