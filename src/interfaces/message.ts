export type Message = {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image_url: string;
  };
  attachments: {
    type: string;
    url: string;
  }[];
  liked_by: string[];
  created_at: Date;
}