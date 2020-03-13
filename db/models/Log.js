import sequelize from './index';
import Sequelize from 'sequelize';

const Model = Sequelize.Model;
class Log extends Model { }
Log.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    occurredDate: {
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
    modelName: 'log',
    indexes: [
        {
            using: 'BTREE',
            fields: ['occurred_date']
        },
        {
            using: 'BTREE',
            fields: ['site_id']
        },
        {
            using: 'BTREE',
            fields: ['service_id']
        },
        {
            using: 'BTREE',
            fields: ['instance_id']
        },
        {
            using: 'BTREE',
            fields: ['log_level']
        },
        {
            using: 'BTREE',
            fields: ['log_name']
        },
        // {
        //     using: 'BTREE',
        //     fields: ['log_detail']
        // },
    ],
    sequelize: sequelize
});

export default Log;