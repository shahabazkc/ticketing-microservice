import mongoose from 'mongoose';

interface UserAttrs {
    email: string;
    password: string;
};

//An interface that describes the properties
interface UserModel extends mongoose.Model<any> {
    build(attrs: UserAttrs): UserDoc;
};

// An interface that describes the properties
// that a User Document has

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    createdAt: string,
    updatedAt: string;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {

    }
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

User.build({
    email: "klfjdsl",
    password: "llsdfjl"
})


export { User };