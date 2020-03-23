import sequelize from './index';
import Sequelize from 'sequelize';

const Model = Sequelize.Model;
class Instance extends Model { }
Instance.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    endpoint: {
        type: Sequelize.STRING(256),
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    serviceId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    modelName: 'instance',
    sequelize: sequelize
});

export default Instance;