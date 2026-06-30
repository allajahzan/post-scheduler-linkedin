import { ObjectId } from 'mongodb';

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  telegram_chat_id: string;
  created_at: Date;
}

export interface PostDocument {
  _id?: ObjectId;
  user_id: ObjectId;
  date: string;
  time: string;
  title: string;
  description: string;
  image_url: string;
  generate_image: boolean;
  status: 'pending' | 'completed';
  created_at: Date;
  updated_at: Date;
}
