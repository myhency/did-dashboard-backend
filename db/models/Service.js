import sequelize from './index';
import Sequelize from 'sequelize';

const Model = Sequelize.Model;
class Service extends Model {}
Service.init({
  serviceId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(256),
    allowNull: false
  },
  role: {
    type: Sequelize.STRING(10),
    allowNull: false
  },
  openDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  endpoint: {
    type: Sequelize.STRING(256),
    allowNull: false
  },
  siteId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
}, {
  modelName: 'service',
  sequelize: sequelize
});

export default Service;