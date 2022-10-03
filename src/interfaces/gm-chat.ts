import { GMChatType } from './gm-chat-type';

export type GMChat = {
  type: GMChatType;
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
