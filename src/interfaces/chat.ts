import { ChatType } from './chat-type';

export type Chat = {
  type: ChatType;
  id: string;
  name: string;
  image_url: string;
  members: {
    id: string;
    name: string;
    image_url: string;
  }[];
  num_messages: number;
};
