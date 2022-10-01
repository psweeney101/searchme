import { FC, ReactElement, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Accordion, Button, Divider, Dropdown, Feed, Header, Input, Message as Warning, Progress } from 'semantic-ui-react';
import { GMChatType, GMChat, GMMessage, MessageSort, Styles } from 'src/interfaces';
import { GroupMe } from 'src/services';
import { AdvancedSearch, Avatar, Message, Paginator } from 'src/components';

type Props = { type: GMChatType };

const MESSAGES_PER_PAGE = 100;

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
  const [chat, setChat] = useState<GMChat>();
  const [messages, setMessages] = useState<GMMessage[]>();
  const [filtered, setFiltered] = useState<GMMessage[]>();
  const [startIndex, setStartIndex] = useState<number>(0);
  // Search parameters
  const query = searchParams.get('query') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const sentBy = searchParams.get('sentBy') || '';
  const likedBy = searchParams.get('likedBy') || '';
  const attachments = searchParams.get('attachments') || '';
  // Sort parameter
  const sort = searchParams.get('sort') as MessageSort || MessageSort.MostRecent;
  // Page parameter
  const page = Number(searchParams.get('page')) || 1;

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

  // Reset range when page changes or messages are re-filtered
  useEffect(() => {
    if (!filtered) return;
    console.log('Set range!', page);
    // Ensure page is valid
    const maxPage = Math.ceil(filtered.length / MESSAGES_PER_PAGE);
    if (page < 1) {
      return setSearchParams(params => { params.delete('page'); return params; });
    } else if (page > maxPage) {
      return setSearchParams(params => { params.set('page', String(maxPage)); return params; });
    }
    // Remove page=1 param, but continue
    if (page === 1) {
      setSearchParams(params => { params.delete('page'); return params; });
    }
    // Set start index
    const start = (page - 1) * MESSAGES_PER_PAGE;
    setStartIndex(start);
  }, [page, filtered, setSearchParams]);

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
          <Avatar type={props.type === GMChatType.Group ? 'group' : 'user'} src={chat?.image_url} alt={chat?.name} size="16vw" />
        </div>
      </div>

      <Warning warning hidden={!chat || !messages || chat.num_messages === messages.length || !warning} onDismiss={() => setWarning(false)}>
        <Warning.Header>GroupMe Messages Missing</Warning.Header>
        <Warning.Content>GroupMe is missing the first {(chat?.num_messages || 0) - (messages?.length || 0)} messages in this group. You will still be able to search the most recent {messages?.length} of your {chat?.num_messages} messages. This is a GroupMe issue - the missing messages are not available on the GroupMe app either.</Warning.Content>
      </Warning>

      <Divider />

      {chat && filtered
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

            <Paginator startIndex={startIndex} messagesPerPage={MESSAGES_PER_PAGE} total={filtered.length} page={page} setSearchParam={setSearchParam} />
            <Feed>
              {filtered.slice(startIndex, startIndex + MESSAGES_PER_PAGE).map(message => <Message key={message.id} chat={chat} message={message} />)}
            </Feed>
            <Paginator startIndex={startIndex} messagesPerPage={MESSAGES_PER_PAGE} total={filtered.length} page={page} setSearchParam={setSearchParam}  />
          </>
        )
        : (
          <Progress value={progress} total={chat?.num_messages} progress="percent" precision={0} label={`Loading all ${chat?.num_messages.toLocaleString()} messages...`} />
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
}
