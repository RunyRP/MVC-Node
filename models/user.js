const moongose= require('mongoose');
const Schema = moongose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);
module.exports = moongose.model('User', UserSchema);