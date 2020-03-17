const config = {
    test: {
        username: "root",
        password: "root",
        database: "did_dashboard",
        host: "localhost",
        dialect: "mariadb",
        dialectOptions: {
            timezone: 'Etc/GMT+9'
        },
        timezone: '+09:00',
        define: {
            underscored: true,
            freezeTableName: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false,
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false
    },
    local: {
        username: "root",
        password: "root",
        database: "did_dashboard",
        host: "localhost",
        dialect: "mariadb",
        dialectOptions: {
            timezone: 'Etc/GMT+9'
        },
        timezone: '+09:00',
        define: {
            underscored: true,
            freezeTableName: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    dev: {
        username: "root",
        password: "root",
        database: "did_dashboard",
        host: "localhost",

        dialect: "mariadb",
        dialectOptions: {
            timezone: 'Etc/GMT+9'
        },
        timezone: '+09:00',
        define: {
            underscored: true,
            freezeTableName: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    prod: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        use_env_variable: 'DATABASE_URL',

        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT+9'
        },
        timezone: '+09:00',
        define: {
            underscored: true,
            freezeTableName: true,
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false
        },
        pool: {
            max: 20,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
};

export default config;