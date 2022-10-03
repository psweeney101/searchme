import { GMChatType } from './gm-chat-type';

export type GMChatPreview = {
  type: GMChatType;
  id: string;
  name: string;
  image_url: string;
  updated_at: Date;
};
