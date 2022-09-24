import { Component, ReactNode } from 'react';
import { Header, Image, Input, List, Segment } from 'semantic-ui-react';
import Highlighter from 'react-highlight-words';
import { ChatPreview, ChatType, Styles } from 'src/interfaces';
import { compare, GroupMe, TimeAgo } from 'src/services';
import groupNoAvatar from 'src/assets/group-no-avatar.png';
import userNoAvatar from 'src/assets/user-no-avatar.png';
import { Link } from 'react-router-dom';

type Props = {};
type State = { search: string; chats: ChatPreview[] | null };

export class Home extends Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { search: '', chats: null };
  }

  async componentDidMount(): Promise<void> {
    const chats = await GroupMe.listChats();
    this.setState({ chats });
  }

  render(): ReactNode {
    const items = this.state.chats?.filter(chat => compare(this.state.search, chat.name));

    return (
      <div>
        <div style={styles.header}>
          <Header as="h2">
            Groups
            <Header.Subheader>Pick a group you would like to search.</Header.Subheader>
          </Header>
          <div>
            <Input icon='users' placeholder="Search groups..." onChange={event => this.setState({ search: event.target.value })} />
          </div>
        </div>

        <Segment>

          {
            (!this.state.chats) ? 'Loading...' :
              (this.state.chats?.length === 0) ? 'No groups found.' :
                (items?.length === 0) ? `No results for "${this.state.search}"` : ''
          }

          <List divided animated selection link verticalAlign="middle">
            {items?.map(group => (
              <List.Item key={group.id} as={Link} to={`/${group.type}/${group.id}`}>
                <Image avatar={group.type === ChatType.DM} src={group.image_url || (group.type === ChatType.Group ? groupNoAvatar : userNoAvatar)} size="mini" style={styles.avatar} alt="Avatar" />
                <List.Content>
                  <List.Header>
                    <Highlighter searchWords={this.state.search.split(/\s+/)} textToHighlight={group.name} autoEscape activeIndex={-1}>
                      {group.name}
                    </Highlighter>
                  </List.Header>
                  <List.Description>Last updated {TimeAgo(group.updated_at)}</List.Description>
                </List.Content>
              </List.Item>
            ))}
          </List>
        </Segment>
      </div>
    )
  }
}

const styles: Styles = {
  header: {
    display: 'inline-flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  }
}
