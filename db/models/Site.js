import sequelize from './index';
import Sequelize from 'sequelize';
import Service from './Service';

const Model = Sequelize.Model;
class Site extends Model {}
Site.init({
  siteId: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING(256),
    allowNull: false
  },
  openDate: {
    type: Sequelize.DATE,
    allowNull: false
  },
  logoFileName: {
    type: Sequelize.STRING(256),
    allowNull: true
  }
}, {
  modelName: 'site',
  sequelize: sequelize
});

export default Site;