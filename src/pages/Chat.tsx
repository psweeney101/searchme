import { FC, ReactElement, useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Accordion, Divider, Header, Image, Input } from 'semantic-ui-react';
import { Chat as GroupMeChat, ChatType, Sort as MessageSort, Styles } from 'src/interfaces';
import { GroupMe } from 'src/services';
import groupNoAvatar from 'src/assets/group-no-avatar.png';
import userNoAvatar from 'src/assets/user-no-avatar.png';
import { Filter, Sort } from 'src/components';

type Props = { type: ChatType };

export const Chat: FC<Props> = (props: Props): ReactElement => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [chat, setChat] = useState<GroupMeChat>();
  const [messages, setMessages] = useState();
  const [filtered, setFiltered] = useState();
  const [sorted, setSorted] = useState();
  const [paginated, setPaginated] = useState();

  const query = searchParams.get('query') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const sentBy = searchParams.get('sentBy') || '';
  const likedBy = searchParams.get('likedBy') || '';
  const attachments = searchParams.get('attachments') || '';

  const sort = searchParams.get('sort') as MessageSort || MessageSort.MostRecent;
  const page = Number(searchParams.get('page')) || 0;

  // Re-fetch chat when id/type changes
  useEffect(() => {
    console.log('Set chat!', props.type, id);
    if (!id) throw new Error('Chat ID not found.');
    GroupMe.getChat(props.type, id).then(setChat).catch(() => window.location.href = '/');
  }, [props.type, id]);

  // Re-fetch messages when group changes
  useEffect(() => {
    console.log('Set messages!', chat);
    setMessages(undefined);
  }, [chat]);

  // Re-filter messages when group or filter changes
  useEffect(() => {
    console.log('Set filtered!', messages, query, startDate, endDate, sentBy, likedBy, attachments);
    setFiltered(undefined);
  }, [messages, query, startDate, endDate, sentBy, likedBy, attachments]);

  // Re-sort messages when group or sort or filter changes
  useEffect(() => {
    console.log('Set sort!', filtered, sort);
    setSorted(undefined);
  }, [filtered, sort]);

  // Re-page messages when group or sort or filter or page changes
  useEffect(() => {
    console.log('Set paginated!', sorted, page, paginated);
    setPaginated(undefined);
  }, [sorted, page, paginated]);

  /** Updates a search parameter */
  const setSearchParam = (name: string, value?: string | string[]): void => {
    setSearchParams(params => {
      const string = Array.isArray(value) ? value.filter(v => v).toString() : value;

      if (string) params.set(name, string);
      else params.delete(name);
      return params;
    });
  }

  return (
    <div>
      <div style={styles.header}>
        <Header style={styles.header_element}>
          <Image avatar={chat?.type === ChatType.DM} src={chat?.image_url || (chat?.type === ChatType.Group ? groupNoAvatar : userNoAvatar)} size="tiny" centered style={styles.avatar} alt="Avatar" />
          <span>{chat?.name}</span>
        </Header>
        <div style={styles.header_element}>
          <Input icon='search' placeholder="Search..." value={query} onChange={event => setSearchParam('query', event.target.value)} />
        </div>
      </div>

      <Divider />

      <Accordion fluid styled>
        <Filter chat={chat} startDate={startDate} endDate={endDate} sentBy={sentBy} likedBy={likedBy} attachments={attachments} setSearchParam={setSearchParam} reset={() => {
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

        <Sort sort={sort} setSearchParam={setSearchParam} />
      </Accordion>
    </div>
  )
}

const styles: Styles = {
  header: {
    paddingTop: '16px',
    width: '100%',
    display: 'inline-flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
  },
  header_element: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  avatar: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
  },
}
