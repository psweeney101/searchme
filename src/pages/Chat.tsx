import { FC, ReactElement, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Accordion, Button, Divider, Dropdown, Feed, Header, Icon, Input, Message as Warning, Popup, Progress } from 'semantic-ui-react';
import { format } from 'date-fns';
import { Chat as GroupMeChat, ChatType, Message, Sort as MessageSort, Styles } from 'src/interfaces';
import { GroupMe } from 'src/services';
import { AdvancedSearch, Avatar } from 'src/components';

type Props = { type: ChatType };

const MESSAGES_PER_PAGE = 250;

export const Chat: FC<Props> = (props: Props): ReactElement => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  /** Updates a search parameter */
  const setSearchParam = (name: string, value?: string | string[] | number): void => {
    setSearchParams(params => {
      let string;
      if (Array.isArray(value)) {
        string = value.filter(v => v).toString();
      } else if (typeof value === 'string') {
        string = value;
      } else if (typeof value === 'number') {
        string = value ? String(value) : undefined;
      }

      if (string) params.set(name, string);
      else params.delete(name);
      return params;
    });
  }

  const [progress, setProgress] = useState(0);
  const [warning, setWarning] = useState(true);

  // Chat & Message States
  const [chat, setChat] = useState<GroupMeChat>();
  const [messages, setMessages] = useState<Message[]>();
  const [filtered, setFiltered] = useState<Message[]>();
  const [numDisplayed, setNumDisplayed] = useState(0);
  // Search parameters
  const query = searchParams.get('query') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const sentBy = searchParams.get('sentBy') || '';
  const likedBy = searchParams.get('likedBy') || '';
  const attachments = searchParams.get('attachments') || '';
  // Sort parameter
  const sort = searchParams.get('sort') as MessageSort || MessageSort.MostRecent;

  // Re-fetch chat when id/type changes
  useEffect(() => {
    console.log('Set chat!', props.type, id);
    if (!id) throw new Error('Chat ID not found.');
    GroupMe.getChat(props.type, id)
      .then(setChat)
      .catch(() => window.location.href = '/');
  }, [props.type, id]);

  // Re-fetch messages when group changes
  useEffect(() => {
    if (chat) {
      console.log('Set messages!', chat);
      GroupMe.getMessages(chat.type, chat.id, chat.num_messages, setProgress)
        .then(setMessages);
    }
  }, [chat]);

  // Re-filter messages when messages are loaded and when filter params changes
  useEffect(() => {
    if (messages) {
      console.log('Set filtered!', messages, query, startDate, endDate, sentBy, likedBy, attachments);
      setFiltered([...messages]);
    }
  }, [messages, query, startDate, endDate, sentBy, likedBy, attachments]);

  // Re-sort messages when messages are re-filtered or the sort option is changed
  useEffect(() => {
    if (filtered) {
      console.log('Sort!', filtered, sort);
      filtered.sort();
      setFiltered(filtered);
    }
  }, [sort, filtered]);

  // Reset numDisplayed when messages are re-filtered
  useEffect(() => {
    if (filtered) {
      console.log('Paginate!');
      setNumDisplayed(MESSAGES_PER_PAGE);
    }
  }, [filtered]);

  /** Maps a favoriter to the user */
  const getUser = (id: string) => {
    const user = chat?.members.find(m => m.id === id);
    if (!user) return undefined;
    return (
      <Popup key={id} hoverable trigger={<span><Avatar type="user" src={user.image_url} alt={user.name} size="25px" /></span>}>
        <Popup.Content>{user.name}</Popup.Content>
      </Popup>
    );
  }

  return (
    <div>

      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <Button as={Link} to="/" circular icon="left chevron" style={styles.back} />
        </div>

        <Header as="h1" style={styles.name} textAlign="center">
          <span>{chat?.name}</span>
        </Header>

        <div style={{ flex: 1 }}>
          <Avatar type={props.type === ChatType.Group ? 'group' : 'user'} src={chat?.image_url} alt={chat?.name} size="16vw" />
        </div>
      </div>

      <Warning warning hidden={!chat || !messages || chat.num_messages === messages.length || !warning} onDismiss={() => setWarning(false)}>
        <Warning.Header>GroupMe Messages Missing</Warning.Header>
        <Warning.Content>GroupMe is missing the first {(chat?.num_messages || 0) - (messages?.length || 0)} messages in this group. You will still be able to search the most recent {messages?.length} of your {chat?.num_messages} messages. This is a GroupMe issue - the missing messages are not available on the GroupMe app either.</Warning.Content>
      </Warning>

      <Divider />

      {filtered
        ? (
          <>
            <div style={styles.search}>
              <Input fluid icon='search' placeholder="Search..." value={query} onChange={event => setSearchParam('query', event.target.value)} style={{ flex: 2 }} />

              <Dropdown fluid selection value={sort} options={Object.values(MessageSort).map(option => ({ text: option, value: option }))} onChange={(_, data) => setSearchParam('sort', data.value === MessageSort.MostRecent ? undefined : data.value as string)} style={{ flex: 1 }} />
            </div>

            <Accordion fluid styled>
              <AdvancedSearch chat={chat} startDate={startDate} endDate={endDate} sentBy={sentBy} likedBy={likedBy} attachments={attachments} setSearchParam={setSearchParam} reset={() => {
                setSearchParams(params => {
                  params.delete('query');
                  params.delete('startDate');
                  params.delete('endDate');
                  params.delete('sentBy');
                  params.delete('likedBy');
                  params.delete('attachments');
                  return params;
                })
              }} />
            </Accordion>

            <Feed>
              {filtered.slice(0, numDisplayed).map(message => (
                <Feed.Event key={message.id}>
                  <Feed.Label>
                    <Avatar type={message.user.id === 'system' ? 'group' : 'user'} src={message.user.image_url} alt={message.user.name} />
                  </Feed.Label>
                  <Feed.Content style={styles.content}>
                    <Feed.Summary>
                      <Feed.User as="span">{message.user.name}</Feed.User>
                      <Feed.Date>{format(message.created_at, 'MMM dd yyyy p')}</Feed.Date>
                    </Feed.Summary>
                    <Feed.Extra text>{message.text}</Feed.Extra>
                    <Feed.Extra images>{message.attachments.map((attachment, index) => {
                      if (attachment.type === 'image' || attachment.type === 'linked_image') return <img key={index} src={attachment.url} alt={message.text} />
                      if (attachment.type === 'video') return <video key={index} src={`${attachment.url}#t=0.1`} controls preload="metadata" style={styles.video} />
                      return null;
                    })}</Feed.Extra>
                    <Feed.Meta>
                      <Popup hoverable disabled={!message.liked_by.length} trigger={(<span><Icon name="like" />{message.liked_by.length}</span>)}>
                        <Popup.Content style={styles.likers}>
                          {message.liked_by.map(getUser)}
                        </Popup.Content>
                      </Popup>
                    </Feed.Meta>
                  </Feed.Content>
                </Feed.Event>
              ))}
            </Feed>
          </>
        )
        : (
          <Progress value={progress} total={chat?.num_messages} progress="value" label={`Loading all ${chat?.num_messages.toLocaleString()} messages...`} />
        )}

    </div>
  )
}

const styles: Styles = {
  back: {
    alignSelf: 'flex-start',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    flex: 2,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  search: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  progress: {
    margin: 0,
  },
  content: {
    overflow: 'hidden',
  },
  video: {
    maxWidth: '100%',
    maxHeight: '250px',
  },
  likers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '7px',
  }
}
