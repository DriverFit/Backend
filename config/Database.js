import { Sequelize } from "sequelize";


const db = new Sequelize('driverfit_db','root','',{
    host: "localhost",
    dialect: "mysql"
});

export default db;