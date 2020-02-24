import mongoose from 'mongoose';

const NotificationsSchema = mongoose.Schema(
  {
    content: {
      type: String,
      requerid: true,
    },
    user: {
      type: Number,
      requerid: true,
    },
    read: {
      type: Boolean,
      requerid: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationsSchema);
