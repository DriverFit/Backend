import { Sequelize } from "sequelize";


const db = new Sequelize({
    dialect: "mysql",
    host: "/cloudsql/capstone-project-ch2-ps206:asia-southeast2:dbinstance",
    username: '',
    password: '',
    database: "driverfit_db",
    dialectOptions: {
        socketPath: "//cloudsql/capstone-project-ch2-ps206:asia-southeast2:dbinstance",
    },

});

export default db;
