import { FC, ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Accordion, Button, Divider, Dropdown, Feed, Header, Input, Message as Warning, Progress } from 'semantic-ui-react';
import { DebounceInput } from 'react-debounce-input';
import { compareAsc, compareDesc, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { GMChatType, GMChat, GMMessage, MessageSort, Styles } from 'src/interfaces';
import { compare, GroupMe } from 'src/services';
import { AdvancedSearch, Avatar, Message, Paginator } from 'src/components';

type Props = { type: GMChatType };

const MESSAGES_PER_PAGE = 100;

export const Chat: FC<Props> = (props: Props): ReactElement => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  /** Helper for updating a search parameter */
  const setSearchParam = useCallback((name: string, value?: string | string[] | number): void => {
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
    }); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [progress, setProgress] = useState(0);
  const [warning, setWarning] = useState(true);

  // Chat & Message States
  const [chat, setChat] = useState<GMChat>();
  const [messages, setMessages] = useState<GMMessage[]>();
  const [filtered, setFiltered] = useState<GMMessage[]>();
  const [sorted, setSorted] = useState<GMMessage[]>();
  const [paginated, setPaginated] = useState<GMMessage[]>();
  // Search parameters
  const query = searchParams.get('query') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const sentBy = searchParams.get('sentBy') || '';
  const likedBy = searchParams.get('likedBy') || '';
  const attachments = searchParams.get('attachments') || '';
  // Hash
  const { hash } = useLocation();
  // Sort parameter
  const sort = searchParams.get('sort') as MessageSort || MessageSort.MostRecent;
  // Page parameter
  const page = Number(searchParams.get('page')) || 1;

  // Re-fetch chat after type/id are set
  useEffect(() => {
    if (id) {
      console.log('Get chat!', props.type, id);
      GroupMe.getChat(props.type, id)
        .then(setChat)
        .catch(() => window.location.href = '/');
    }
  }, [props.type, id]);

  // Re-fetch messages after chat is set
  useEffect(() => {
    if (chat) {
      console.log('Get messages!', chat);
      GroupMe.getMessages(chat.type, chat.id, chat.num_messages, setProgress)
        .then(setMessages);
    }
  }, [chat]);

  // Re-filter after messages are loaded or filter params change
  useEffect(() => {
    if (messages) {
      console.log('Filter!', messages, query, startDate, endDate, sentBy, likedBy, attachments);
      const start = startDate && startOfDay(new Date(startDate));
      const end = endDate && endOfDay(new Date(endDate));
      const senders = sentBy.split(',').filter(s => s);
      const likers = likedBy.split(',').filter(l => l);
      const attchs = attachments.split(',').filter(a => a);

      const results = messages.filter(message => (
        (compare(query, message.text)) &&
        (!start || isAfter(message.created_at, start)) &&
        (!end || isBefore(message.created_at, end)) &&
        (!senders.length || senders.includes(message.user.id)) &&
        (!likers.length || message.liked_by.some(id => likers.includes(id))) &&
        (!attchs.length || message.attachments.some(attch => attchs.includes(attch.type)))
      ));
      setFiltered(results);
    }
  }, [messages, query, startDate, endDate, sentBy, likedBy, attachments]);

  // Re-sort after filter or sort changes
  useEffect(() => {
    if (filtered) {
      console.log('Sort!', filtered, sort);
      const defaultSort: (a: GMMessage, b: GMMessage) => number = (a, b) => compareDesc(a.created_at, b.created_at);
      let sortFn = defaultSort;
      if (sort === MessageSort.LeastRecent) {
        sortFn = (a, b) => compareAsc(a.created_at, b.created_at);
      } else if (sort === MessageSort.MostLiked) {
        sortFn = (a, b) => b.liked_by.length - a.liked_by.length;
      } else if (sort === MessageSort.LeastLiked) {
        sortFn = (a, b) => a.liked_by.length - b.liked_by.length;
      }else if (sort === MessageSort.NameAZ) {
        sortFn = (a, b) => a.user.name.localeCompare(b.user.name);
      } else if (sort === MessageSort.NameZA) {
        sortFn = (a, b) => b.user.name.localeCompare(a.user.name);
      } else if (sort === MessageSort.Longest) {
        sortFn = (a, b) => (b.text?.length ?? 0) - (a.text?.length ?? 0);
      } else if (sort === MessageSort.Shortest) {
        sortFn = (a, b) => (a.text?.length ?? 0) - (b.text?.length ?? 0);
      }

      const results = [...filtered].sort((a, b) => {
        const num = sortFn(a, b);
        return num === 0 ? defaultSort(a, b) : num;
      });
      setSorted(results);
    }
  }, [filtered, sort]);

  // Re-page after sorting or page changes
  useEffect(() => {
    if (sorted) {
      console.log('Page!', sorted, page);
      // Ensure page is valid
      const maxPage = sorted.length ? Math.ceil(sorted.length / MESSAGES_PER_PAGE) : 1;
      if (page < 1) {
        return setSearchParam('page');
      } else if (page > maxPage && maxPage > 0) {
        return setSearchParam('page', maxPage);
      }

      if (page === 1) {
        setSearchParam('page');
      }

      const start = (page - 1) * MESSAGES_PER_PAGE;
      const results = sorted.slice(start, start + MESSAGES_PER_PAGE);
      setPaginated(results);
    }
  }, [sorted, page, setSearchParam]);

  // Re-filter/sort/page and scroll to message when hash changes
  useEffect(() => {
    if (hash) {
      setSearchParams(params => {
        params.delete('query');
        params.delete('startDate');
        params.delete('endDate');
        params.delete('sentBy');
        params.delete('likedBy');
        params.delete('attachments');
        params.delete('sort');
        params.delete('page');
        return params;
      });
    }
  }, [hash, setSearchParams]);

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

      {chat && paginated && sorted
        ? (
          <>
            <div style={styles.search}>
              <Input fluid icon='search' placeholder="Search..." style={{ flex: 2 }} input={<DebounceInput value={query} debounceTimeout={500} onChange={event => setSearchParam('query', event.target.value)} />} />

              <Dropdown fluid selection value={sort} options={Object.values(MessageSort).map(option => ({ text: option, value: option }))} onChange={(_, { value }) => setSearchParam('sort', value === MessageSort.MostRecent ? undefined : value as MessageSort)} style={{ flex: 1 }} />
            </div>

            <Accordion fluid styled>
              <AdvancedSearch chat={chat} query={query} startDate={startDate} endDate={endDate} sentBy={sentBy} likedBy={likedBy} attachments={attachments} setSearchParam={setSearchParam} />
            </Accordion>

            {paginated.length ? (
              <>
                <Paginator page={page} displayed={paginated.length} total={sorted.length} messagesPerPage={MESSAGES_PER_PAGE} setSearchParam={setSearchParam} />
                <Feed>
                  {paginated.map(message => <Message key={message.id} chat={chat} message={message} />)}
                </Feed>
                <Paginator page={page} displayed={paginated.length} total={sorted.length} messagesPerPage={MESSAGES_PER_PAGE} setSearchParam={setSearchParam} />
              </>
            ) : <div style={styles.empty}>No Results</div>
            }

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
  empty: {
    textAlign: 'center',
    padding: '1.5rem',
    fontWeight: 'bold',
  }
}
