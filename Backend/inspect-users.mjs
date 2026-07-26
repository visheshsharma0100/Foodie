import dotenv from 'dotenv';
dotenv.config();
import connectDb from './Models/db.js';
import Users from './Models/Users.js';

await connectDb();
const users = await Users.find({ email: { $in: ['admin@foodiehub.com', 'vishesh10@gmail.com'] } }).lean();
console.log(JSON.stringify(users, null, 2));
