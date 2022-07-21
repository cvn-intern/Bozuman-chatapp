/* eslint-disable */
import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  token: String,
  created: { type: Date, default: Date.now },
});

RefreshTokenSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

export const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema);
