const {Schema} = require('mongoose');
const UserSchema = new Schema(
    {
        name: {type: String},
    },
    {timestamps: true},
);

module.exports = UserSchema;