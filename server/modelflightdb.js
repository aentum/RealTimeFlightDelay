module.exports = (sequelize, DataTypes) => {
    const FlightsByDate = sequelize.define('flightsByDate', {
        flightName: {
            type: DataTypes.STRING,
            required: true
        },
        date: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        datePlusNum: {
            type: DataTypes.STRING,
            unique: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: DataTypes.DATE,
    }, {
        paranoid: true,
        underscored: true
    });
    return FlightsByDate;
};