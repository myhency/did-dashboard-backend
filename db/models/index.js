import Sequelize from 'sequelize';
import configs from '../config';

const env = process.env.NODE_ENV || 'dev';
const config = configs[env];
if(!config) throw new Error('config not found');

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

export default sequelize;

