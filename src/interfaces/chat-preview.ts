import { ChatType } from './chat-type';

export type ChatPreview = {
  type: ChatType;
  id: string;
  name: string;
  image_url: string;
  updated_at: Date;
};
