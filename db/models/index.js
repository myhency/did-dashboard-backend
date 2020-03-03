// import fs from 'fs';
// import path from 'path';
import Sequelize from 'sequelize';
import configs from '../config';

// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configs[env];
// const models = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/*
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});


models.sequelize = sequelize;
models.Sequelize = Sequelize;
console.log('asdfdasfd');
console.log(models);


module.exports = models;
*/

export default sequelize;
// module.exports = sequelize;

