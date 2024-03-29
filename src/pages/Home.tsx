import { ReactElement, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { DebounceInput } from 'react-debounce-input';
import { Header, Input, List, Segment } from 'semantic-ui-react';
import { GMChatPreview, GMChatType, Styles } from 'src/interfaces';
import { compare, GroupMe, TimeAgo } from 'src/services';
import { Avatar, Highlight } from 'src/components';

type Props = {};

export function Home(props: Props): ReactElement {
  const [search, setSearch] = useState('');
  const [chats, setChats] = useState<GMChatPreview[] | null>(GroupMe.previews);
  const [filtered, setFiltered] = useState<typeof chats>(chats);

  useEffect(() => {
    window.document.title = 'SearchMe';
  }, []);

  useMemo(() => {
    GroupMe.getChatPreviews().then(setChats);
  }, []);

  useEffect(() => {
    if (chats) {
      const results = chats?.filter(chat => compare(search, chat.name));
      setFiltered(results);
    }
  }, [chats, search]);

  return (
    <div>
      <Header as="h2">
        Groups
        <Header.Subheader>
          Pick a group you would like to search.
        </Header.Subheader>
      </Header>

      <Input
        icon='users'
        placeholder="Search for a group..."
        style={styles.search}
        input={
          <DebounceInput
            debounceTimeout={100}
            onChange={event => setSearch(event.target.value)}
          />
        }
      />

      <Segment>

        {
          !filtered ? 'Loading...'
            : search && !filtered.length ? `No results for "${search}"`
              : !filtered.length ? 'No groups found.' : ''
        }

        <List
          divided
          selection
          link
          verticalAlign="middle"
        >
          {filtered?.map(chat => (
            <List.Item
              key={chat.id}
              as={Link}
              to={`/${chat.type}/${chat.id}`}
            >
              <List.Icon>
                <Avatar
                  type={chat.type === GMChatType.Group ? 'group' : 'user'}
                  src={chat.image_url}
                  alt={chat.name}
                  size="50px"
                />
              </List.Icon>
              <List.Content>
                <List.Header>
                  <Highlight text={chat.name} query={search} />
                </List.Header>
                <List.Description>
                  Last updated {TimeAgo(chat.updated_at)}
                </List.Description>
              </List.Content>
            </List.Item>
          ))}
        </List>
      </Segment>
    </div>
  );
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
