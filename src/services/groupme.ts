import axios, { AxiosError } from 'axios';
import { Chat, ChatPreview, ChatType } from 'src/interfaces';

export class GroupMe {
  /** Base URL for all API requests */
  static API_URL = 'https://api.groupme.com/v3';
  /** URL for authenticating with GroupMe */
  static LOGIN_URL = process.env.REACT_APP_GROUPME_URL;

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
  static async getUser(): Promise<Chat['members'][0]> {
    const user = await this.fetch<{id: string; name: string; image_url: string }>('users/me');
    return { id: user.id, name: user.name, image_url: user.image_url };
  }

  /** Lists all Groups and DMs the user has access to */
  static async listChats(): Promise<ChatPreview[]> {
    const groups = await this.fetch<{ id: string; name: string; image_url: string; messages: { last_message_created_at: number }; created_at: number; }[]>(
      `groups?per_page=500&omit=memberships`
    );

    const chats = await this.fetch<{ other_user: { id: number; name: string; avatar_url: string; }; last_message: { created_at: number }; created_at: number; }[]>(
      `chats?per_page=100`
    );

    const previews: ChatPreview[] = groups.map(group => (
      { type: ChatType.Group, id: group.id, name: group.name, image_url: group.image_url, updated_at: new Date((group.messages.last_message_created_at || group.created_at) * 1000) }
    )).concat(chats.map(chat => (
      { type: ChatType.DM, id: String(chat.other_user.id), name: chat.other_user.name, image_url: chat.other_user.avatar_url, updated_at: new Date((chat.last_message.created_at || chat.created_at) * 1000) }
    ))).sort((a, b) => +b.updated_at - +a.updated_at);

    return previews;
  }

  /** Gets a Chat info */
  static async getChat(type: ChatType, id: string): Promise<Chat> {
    if (type === ChatType.Group) {
      const group = await this.fetch<{ id: string; name: string; image_url: string; members: { user_id: string; nickname: string; image_url: string; }[]; messages: { count: number }; }>(
        `groups/${id}`
      );
      return { type, id, name: group.name, image_url: group.image_url, members: group.members.map(member => ({ id: member.user_id, name: member.nickname, image_url: member.image_url })).sort((a, b) => a.name?.localeCompare(b.name)), num_messages: group.messages.count };
    }
    if (type === ChatType.DM) {
      const chats = await this.fetch<{ other_user: { id: number; name: string; avatar_url: string; }; messages_count: number }[]>(
        `chats?&per_page=100`
      );
      const chat = chats.find(c => String(c.other_user.id) === id);
      if (!chat) throw new Error('Chat not found');
      return { type, id, name: chat.other_user.name, image_url: chat.other_user.avatar_url, members: [{ id: String(chat.other_user.id), name: chat.other_user.name, image_url: chat.other_user.avatar_url }, await this.getUser()], num_messages: chat.messages_count };
    }
    throw new Error('Unrecognized chat type');
  }

  /** Helper function for fetching a GroupMe API */
  static async fetch<T>(url: string, attempts = 0): Promise<T> {
    if (!this.access_token) throw new Error('Access token not yet set.');
    const route = new URL(`${this.API_URL}/${url}`);
    route.searchParams.append('token', this.access_token);

    try {
      const { data: { response } } = await axios.get<{ meta: { code: number }; response: T; }>(route.toString());
      return response;
    } catch (error) {
      console.error(error);
      if (++attempts < 5) {
        return this.fetch(url, attempts);
      }
      if (error instanceof AxiosError) {
        alert(error.message);
      } else {
        alert('Error fetching data from GroupMe.');
      }
      throw error;
    }
  }
}
