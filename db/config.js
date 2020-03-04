const config = {
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,

    // Specify options, which are used when sequelize.define is called.
    // The following example:
    //   define: { timestamps: false }
    // is basically the same as:
    //   Model.init(attributes, { timestamps: false });
    //   sequelize.define(name, attributes, { timestamps: false });
    // so defining the timestamps for each model will be not necessary
    define: {
      underscored: true,
      freezeTableName: true,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: false
    },
  },
  development: {
    username: "root",
    password: "root",
    database: "did_dashboard",
    host: "192.168.1.253",
    dialect: "mariadb",
    timezone: '+09:00',
    define: {
      underscored: true,
      freezeTableName: true,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
      timestamps: false
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'mysql',
    use_env_variable: 'DATABASE_URL',
    define: {
      underscored: true,
      freezeTableName: true,
      charset: 'utf8',
      dialectOptions: {
        collate: 'utf8_general_ci'
      },
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