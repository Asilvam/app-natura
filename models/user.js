import {Schema, model} from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new Schema({
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        img: {type: String},
        isActive: {type: Boolean, default: true},
        createdByGoogle: {type: Boolean, default: false}
    },
    {
        timestamps: true
    });

userSchema.plugin(mongoosePaginate);

userSchema.methods.toJSON = function () {
    const {__v, password, ...user} = this.toObject();
    return user
}

module.exports = model('User', userSchema);