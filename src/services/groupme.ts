import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { GMChat, GMChatPreview, GMChatType, GMMessage } from 'src/interfaces';
import groupMeIcon from 'src/assets/groupme-icon.png';

export class GroupMe {
  /** Base URL for all API requests */
  static API_URL = 'https://api.groupme.com/v3';
  /** URL for authenticating with GroupMe */
  static LOGIN_URL = process.env.REACT_APP_GROUPME_URL;
  /** A list of previews, which is saved when navigating */
  static previews: GMChatPreview[] | null = null;

  /** The access token for all API requests */
  static get access_token(): string | null {
    return localStorage.getItem('access_token');
  }
  static set access_token(access_token: string | null) {
    if (access_token) {
      localStorage.setItem('access_token', access_token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  /** Whether or not the user has authenticated */
  static get authenticated(): boolean {
    return !!this.access_token;
  }

  /** Gets info about the current user */
  static async getUser(): Promise<GMChat['members'][0]> {
    const user = await this.fetch<{
      id: string;
      name: string;
      image_url: string;
    }>('users/me');

    return {
      id: user.id,
      name: user.name,
      image_url: this.handleURL(user.image_url),
    };
  }

  /** Lists all Groups and DMs the user has access to */
  static async getChatPreviews(): Promise<GMChatPreview[]> {
    const groups = await this.fetch<{
      id: string;
      name: string;
      image_url: string;
      messages: {
        last_message_created_at: number;
      };
      created_at: number;
    }[]>(`groups?per_page=500&omit=memberships`);

    const chats = await this.fetch<{
      other_user: {
        id: number;
        name: string;
        avatar_url: string;
      };
      last_message: {
        created_at: number;
      };
      created_at: number;
    }[]>(`chats?per_page=100`);

    this.previews = groups.map(group => ({
      type: GMChatType.Group,
      id: group.id,
      name: group.name,
      image_url: this.handleURL(group.image_url),
      updated_at: new Date((group.messages.last_message_created_at || group.created_at) * 1000),
    })).concat(chats.map(chat => ({
      type: GMChatType.DM,
      id: String(chat.other_user.id),
      name: chat.other_user.name,
      image_url: this.handleURL(chat.other_user.avatar_url),
      updated_at: new Date((chat.last_message.created_at || chat.created_at) * 1000)
    }))).sort((a, b) => +b.updated_at - +a.updated_at);

    return this.previews;
  }

  /** Gets a Chat's info */
  static async getChat(type: GMChatType, id: string): Promise<GMChat> {
    if (type === GMChatType.Group) {
      const group = await this.fetch<{
        id: string;
        name: string;
        image_url: string;
        members: {
          user_id: string;
          nickname: string;
          image_url: string;
        }[];
        messages: {
          count: number;
        };
      }>(`groups/${id}`);

      return {
        type,
        id: group.id,
        name: group.name,
        image_url: this.handleURL(group.image_url),
        members: group.members.map(member => ({
          id: member.user_id,
          name: member.nickname,
          image_url: this.handleURL(member.image_url),
        })).sort((a, b) => a.name?.localeCompare(b.name)),
        num_messages: group.messages.count,
      };
    }
    if (type === GMChatType.DM) {
      const chats = await this.fetch<{
        other_user: {
          id: number;
          name: string;
          avatar_url: string;
        };
        messages_count: number;
      }[]>(`chats?&per_page=100`);

      const chat = chats.find(c => String(c.other_user.id) === id);
      if (!chat) throw new Error('Chat not found');

      return {
        type,
        id: String(chat.other_user.id),
        name: chat.other_user.name,
        image_url: this.handleURL(chat.other_user.avatar_url),
        members: [{
          id: String(chat.other_user.id),
          name: chat.other_user.name,
          image_url: this.handleURL(chat.other_user.avatar_url),
        },
        await this.getUser(),
        ],
        num_messages: chat.messages_count,
      };
    }
    throw new Error('Unrecognized chat type');
  }

  /** Gets a Chat's messages */
  static async getMessages(type: GMChatType, id: string, total: number, progress: (progress: number) => void): Promise<GMMessage[]> {
    const limit = type === GMChatType.Group ? 100 : 20;
    const chunks = new Array(Math.ceil(total / limit)).fill(id);

    const messages: GMMessage[] = [];
    let before_id = '';

    for await (const chunk of chunks) {
      if (type === GMChatType.Group) {
        const result = await this.fetch<{
          messages: {
            id: string;
            created_at: number;
            user_id: string;
            name: string;
            avatar_url: string;
            text: string;
            system: boolean;
            favorited_by: string[];
            attachments: {
              type: string;
              url: string;
            }[];
          }[];
        }>(`groups/${chunk}/messages?limit=${limit}&before_id=${before_id}`);

        messages.push(...result.messages.map(message => ({
          id: message.id,
          text: message.text,
          user: {
            id: message.user_id,
            name: message.name,
            image_url: message.system ? groupMeIcon : this.handleURL(message.avatar_url),
          },
          attachments: message.attachments.map(a => ({
            type: a.type,
            url: this.handleURL(a.url),
          })),
          liked_by: message.favorited_by,
          created_at: new Date(message.created_at * 1000),
        })));
      } else {
        const result = await this.fetch<{
          direct_messages: {
            id: string;
            created_at: number;
            user_id: string;
            name: string;
            avatar_url: string;
            text: string;
            favorited_by: string[];
            attachments: {
              type: string;
              url: string;
            }[];
          }[];
        }>(`direct_messages?other_user_id=${id}&before_id=${before_id}`);

        messages.push(...result.direct_messages.map(message => ({
          id: message.id,
          text: message.text,
          user: {
            id: message.user_id,
            name: message.name,
            image_url: this.handleURL(message.avatar_url),
          },
          attachments: message.attachments.map(a => ({
            type: a.type,
            url: this.handleURL(a.url),
          })),
          liked_by: message.favorited_by,
          created_at: new Date(message.created_at * 1000),
        })));
      }

      before_id = messages[messages.length - 1].id;
      progress(messages.length);
    }

    return messages;
  }

  /** Helper function for converting all URLs to HTTPS */
  static handleURL(url: string): string {
    return url?.replace(/http:/, 'https:');
  }

  /** Helper function for fetching a GroupMe API */
  static async fetch<T>(url: string, attempts = 0): Promise<T> {
    if (!this.access_token) throw new Error('Access token not yet set.');
    const route = new URL(`${this.API_URL}/${url}`);
    route.searchParams.append('token', this.access_token);

    try {
      const { data: { response } } = await axios.get<{
        meta: {
          code: number;
        };
        response: T;
      }>(route.toString());

      return response;
    } catch (error) {
      if (error instanceof AxiosError && error.code === 'ERR_NETWORK') {
        await new Promise((resolve) => setTimeout(resolve, 100 * ++attempts));
        return this.fetch(url, attempts);
      }

      if (++attempts < 5) {
        return this.fetch(url, attempts);
      }

      if (error instanceof AxiosError) {
        toast.error(error.message);
      } else {
        toast.error('There was a problem fetching data from GroupMe.');
      }

      throw error;
    }
  }
}
