/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useCallback, useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Accordion, Button, Divider, Dropdown, Header, Input, Message as Warning, Progress } from 'semantic-ui-react';
import { DebounceInput } from 'react-debounce-input';
import { compareAsc, compareDesc, endOfDay, isAfter, isBefore, startOfDay } from 'date-fns';
import { GMChatType, GMChat, GMMessage, MessageSort, Styles, SetSearchParams, SearchParam } from 'src/interfaces';
import { compare, GroupMe } from 'src/services';
import { AdvancedSearch, Avatar, Message, Paginator } from 'src/components';

type Props = { type: GMChatType };

const MESSAGES_PER_PAGE = 50;

export function Chat(props: Props): ReactElement {
  const { id } = useParams();
  const [searchParams, unstableSetSearchParams] = useSearchParams();

  /** Helper function for settings search parameters */
  const setSearchParams = useCallback<SetSearchParams>(inputParams => {
    inputParams.forEach(({ name, value }) => {
      let string: string | undefined;
      if (Array.isArray(value)) {
        string = value.filter(v => v).toString();
      } else if (typeof value === 'string') {
        string = value;
      } else if (typeof value === 'number') {
        string = value ? String(value) : undefined;
      }

      if (string) {
        searchParams.set(name, string);
      } else {
        searchParams.delete(name);
      }
    });
    unstableSetSearchParams(searchParams);
  }, []);

  // Metadata states
  const [progress, setProgress] = useState(0);
  const [warning, setWarning] = useState(true);

  // Data states
  const [chat, setChat] = useState<GMChat>();
  const [messages, setMessages] = useState<GMMessage[]>();
  const [filtered, setFiltered] = useState<GMMessage[]>();
  const [sorted, setSorted] = useState<GMMessage[]>();
  const [paginated, setPaginated] = useState<GMMessage[]>();

  // Query parameters for filtering/sorting/paging
  const query = searchParams.get(SearchParam.Query) || '';
  const startDate = searchParams.get(SearchParam.StartDate) || '';
  const endDate = searchParams.get(SearchParam.EndDate) || '';
  const sentBy = searchParams.get(SearchParam.SentBy) || '';
  const likedBy = searchParams.get(SearchParam.LikedBy) || '';
  const attachments = searchParams.get(SearchParam.Attachments) || '';
  const messageID = searchParams.get(SearchParam.MessageID) || '';
  const sort = searchParams.get(SearchParam.Sort) as MessageSort || MessageSort.MostRecent;
  const page = Number(searchParams.get(SearchParam.Page)) || 1;

  // Re-fetch chat after type/id are set
  useEffect(() => {
    if (id) {
      GroupMe.getChat(props.type, id)
        .then(setChat)
        .catch(() => window.location.href = '/');
    }
  }, [props.type, id]);

  // Re-fetch messages after chat is set
  useEffect(() => {
    if (chat) {
      GroupMe.getMessages(chat.type, chat.id, chat.num_messages, setProgress).then(messages => {
        // Ensure all members are accounted for, since some may have left
        const members = new Map<GMChat['members'][0]['id'], GMChat['members'][0]>();
        chat.members.forEach(member => members.set(member.id, member));
        messages.reverse().forEach(message => members.has(message.user.id) ? null : members.set(message.user.id, message.user));
        chat.members = Array.from(members.values()).sort((a, b) => a.name.localeCompare(b.name));
        setMessages(messages);
      });
    }
  }, [chat]);

  // Re-filter after messages are loaded or filter params change
  useEffect(() => {
    if (messages) {

      // If jumping to message, clear out filters
      if (messageID && (query || startDate || endDate || sentBy || likedBy || attachments)) {
        console.log('jump!!');
        return setSearchParams([
          { name: SearchParam.Query },
          { name: SearchParam.StartDate },
          { name: SearchParam.EndDate },
          { name: SearchParam.SentBy },
          { name: SearchParam.LikedBy },
          { name: SearchParam.Attachments },
        ]);
      }

      console.log('filter!');
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
  }, [messages, messageID, query, startDate, endDate, sentBy, likedBy, attachments]);

  // Re-sort after filter or sort changes
  useEffect(() => {
    if (filtered) {

      // If jumping to message, ensure sorting by most recent
      if (messageID && sort !== MessageSort.MostRecent) {
        return setSearchParams([{ name: SearchParam.Sort }]);
      }

      console.log('sort!');
      const defaultSort: (a: GMMessage, b: GMMessage) => number = (a, b) => compareDesc(a.created_at, b.created_at);
      let sortFn = defaultSort;
      if (sort === MessageSort.LeastRecent) {
        sortFn = (a, b) => compareAsc(a.created_at, b.created_at);
      } else if (sort === MessageSort.MostLiked) {
        sortFn = (a, b) => b.liked_by.length - a.liked_by.length;
      } else if (sort === MessageSort.LeastLiked) {
        sortFn = (a, b) => a.liked_by.length - b.liked_by.length;
      } else if (sort === MessageSort.NameAZ) {
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
      console.log('page');
      // Ensure page is valid
      const maxPage = sorted.length ? Math.ceil(sorted.length / MESSAGES_PER_PAGE) : 1;
      if (page < 1) {
        return setSearchParams([{ name: SearchParam.Page }]);
      } else if (page > maxPage && maxPage > 0) {
        return setSearchParams([{ name: SearchParam.Page, value: maxPage }]);
      }

      // Jump to page with message
      if (messageID) {
        const index = sorted.findIndex(m => m.id === messageID);
        if (index > -1) {
          const messagePage = Math.ceil((index + 1) / MESSAGES_PER_PAGE);
          console.log(messagePage);
          if (page !== messagePage) {
            console.log(messagePage);
            return setSearchParams([
              { name: SearchParam.Page, value: messagePage },
            ]);
          }
        }
      }

      if (page === 1) {
        setSearchParams([{ name: SearchParam.Page }]);
      }

      let startIndex = (page - 1) * MESSAGES_PER_PAGE;
      const results = sorted.slice(startIndex, startIndex + MESSAGES_PER_PAGE);
      setPaginated(results);

      // Scroll to message
      if (messageID) {
        setTimeout(() => {
          const el = document.getElementById(messageID);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          setSearchParams([{ name: SearchParam.MessageID }]);
        });
      }

    }
  }, [sorted, page]);

  /** Downloads messages to a JSON file */
  const download = useCallback((messages: GMMessage[]) => {
    if (!chat) return;
    const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ ...chat, messages }))}`;
    const el = document.createElement('a');
    el.setAttribute('href', data);
    el.setAttribute('download', `SearchMe - ${chat.name}.json`)
    el.click();
    el.remove();
  }, [chat]);

  return (
    <div>

      <div style={styles.header}>
        <div style={{ flex: 1 }}>
          <Button
            as={Link}
            to="/"
            circular
            icon="left chevron"
            style={styles.back}
          />
        </div>

        <Header
          as="h1"
          style={styles.name}
          textAlign="center"
        >
          <span>{chat?.name}</span>
        </Header>

        <div style={{ flex: 1 }}>
          <Avatar
            type={props.type === GMChatType.Group ? 'group' : 'user'}
            src={chat?.image_url}
            alt={chat?.name || 'Chat Avatar'}
            size="16vw"
          />
        </div>
      </div>

      <Warning
        warning
        hidden={!chat || !messages || chat.num_messages <= messages.length || !warning}
        onDismiss={() => setWarning(false)}
      >
        <Warning.Header>GroupMe Messages Missing</Warning.Header>
        <Warning.Content>
          GroupMe is missing the first {(chat?.num_messages || 0) - (messages?.length || 0)} messages in this group.
          You will still be able to search the most recent {messages?.length} of your {chat?.num_messages} messages.
          This is a GroupMe issue - the missing messages are not available on the GroupMe app either.
        </Warning.Content>
      </Warning>

      <Divider />

      {chat && messages && filtered && sorted && paginated && sorted
        ? (
          <>
            <div style={styles.search}>
              <Input
                fluid
                icon='search'
                placeholder="Search..."
                style={{ flex: 2 }}
                input={
                  <DebounceInput
                    value={query}
                    debounceTimeout={500}
                    onChange={event => setSearchParams([{ name: SearchParam.Query, value: event.target.value }])}
                  />
                }
              />

              <Dropdown
                fluid
                selection
                value={sort}
                options={Object.values(MessageSort).map(option => ({ text: option, value: option }))}
                onChange={(_, { value }) => setSearchParams([{ name: SearchParam.Sort, value: value === MessageSort.MostRecent ? undefined : value as MessageSort }])}
                style={{ flex: 1 }}
              />
            </div>

            <Accordion fluid styled>
              <AdvancedSearch
                chat={chat}
                query={query}
                startDate={startDate}
                endDate={endDate}
                sentBy={sentBy}
                likedBy={likedBy}
                attachments={attachments}
                setSearchParams={setSearchParams}
              />
            </Accordion>

            {paginated.length ? (
              <div style={styles.body}>
                <Paginator
                  page={page}
                  displayed={paginated.length}
                  total={sorted.length}
                  messagesPerPage={MESSAGES_PER_PAGE}
                  setSearchParams={setSearchParams}
                />
                {paginated.map(message =>
                  <Message
                    key={message.id}
                    chat={chat}
                    message={message}
                    query={query}
                    setSearchParams={setSearchParams}
                  />)}
                <Paginator
                  page={page}
                  displayed={paginated.length}
                  total={sorted.length}
                  messagesPerPage={MESSAGES_PER_PAGE}
                  setSearchParams={setSearchParams}
                />

                <Dropdown
                  button
                  labeled
                  className="icon secondary"
                  icon="download"
                  text="Download Messages"
                >
                  <Dropdown.Menu>
                    <Dropdown.Header content="Download" />
                    <Dropdown.Divider />
                    <Dropdown.Item
                      icon="list"
                      content={`All Messages (${messages.length.toLocaleString()})`}
                      onClick={() => download(messages)}
                    />
                    <Dropdown.Item
                      icon="filter"
                      content={`Filtered Messages (${filtered.length.toLocaleString()})`}
                      onClick={() => download(sorted)}
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            ) : <div style={styles.empty}>No Results</div>
            }

          </>
        )
        : (
          <Progress
            value={progress}
            total={chat?.num_messages}
            progress="percent"
            precision={0}
            label={`Loading all ${chat?.num_messages.toLocaleString()} messages...`}
          />
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
  body: {
    textAlign: 'center',
  },
  empty: {
    textAlign: 'center',
    padding: '1.5rem',
    fontWeight: 'bold',
  }
}
