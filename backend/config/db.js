import mongoose from 'mongoose';
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true,
    });
    console.log(`DB connect at host ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`DB error ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
