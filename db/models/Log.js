import sequelize from './index';
import Sequelize from 'sequelize';

const Model = Sequelize.Model;
class Log extends Model {}
Log.init({
  logId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  timestamp: {
    type: Sequelize.DATE,
    allowNull: false
  },
  siteId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  serviceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  instanceId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  logLevel: {
    type: Sequelize.STRING(256),
    allowNull: false
  },
  logName: {
    type: Sequelize.STRING(256),
    allowNull: false
  },
  logDetail: {
    type: Sequelize.JSON,
    allowNull: false
  }
}, {
  modelName: 'LOG',
  indexes: [
    {
      using: 'BTREE',
      fields: ['timestamp']
    },
    {
      using: 'BTREE',
      fields: ['log_name']
    },
    {
      using: 'BTREE',
      fields: ['service_id']
    }
  ],
  sequelize: sequelize
});

export default Log;