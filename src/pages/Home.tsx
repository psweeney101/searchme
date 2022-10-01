import { Component, ReactNode } from 'react';
import { Header, Input, List, Segment } from 'semantic-ui-react';
import Highlighter from 'react-highlight-words';
import { GMChatPreview, GMChatType, Styles } from 'src/interfaces';
import { compare, GroupMe, TimeAgo } from 'src/services';
import { Link } from 'react-router-dom';
import { Avatar } from 'src/components';

type Props = {};
type State = { search: string; chats: GMChatPreview[] | null };

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
        <Header as="h2">
          Groups
          <Header.Subheader>Pick a group you would like to search.</Header.Subheader>
        </Header>

        <Input icon='users' placeholder="Search for a group..." onChange={event => this.setState({ search: event.target.value })} style={styles.search} />

        <Segment>

          {
            (!this.state.chats) ? 'Loading...' :
              (this.state.chats?.length === 0) ? 'No groups found.' :
                (items?.length === 0) ? `No results for "${this.state.search}"` : ''
          }

          <List divided selection link verticalAlign="middle">
            {items?.map(group => (
              <List.Item key={group.id} as={Link} to={`/${group.type}/${group.id}`}>
                <List.Icon>
                  <Avatar type={group.type === GMChatType.Group ? 'group' : 'user'} src={group.image_url} alt={group.name} size="50px" />
                </List.Icon>
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
  search: {
    width: '100%',
  },
  avatar: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
  }
}
