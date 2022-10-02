import { ReactElement, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Accordion, Button, Dropdown, Form, Icon } from 'semantic-ui-react';
import { GMChat, SearchParam, SetSearchParams, Styles } from 'src/interfaces';

type Props = {
  chat: GMChat;
  query: string;
  startDate: string;
  endDate: string;
  sentBy: string;
  likedBy: string;
  attachments: string;
  setSearchParams: SetSearchParams;
};

const ATTACHMENTS: { name: string; id: string; color: string }[] = [
  { name: 'Image', id: 'image', color: 'red' },
  { name: 'Linked Image', id: 'linked_image', color: 'blue' },
  { name: 'Event', id: 'event', color: 'black' },
  { name: 'Poll', id: 'poll', color: 'purple' },
  { name: 'File', id: 'file', color: 'olive' },
  { name: 'Location', id: 'location', color: 'yellow' },
  { name: 'Video', id: 'video', color: 'pink' },
];

export function AdvancedSearch(props: Props): ReactElement {
  const [active, setActive] = useState(false);

  const query = props.query.trim();
  const sentBy = props.sentBy.split(',').filter(s => s);
  const likedBy = props.likedBy.split(',').filter(l => l);
  const attachments = props.attachments.split(',').filter(a => a);

  const startDate = props.startDate ? new Date(props.startDate) : null;
  const endDate = props.endDate ? new Date(props.endDate) : null;

  /** Maps an ID to the user */
  const getUser = (id: string) => props.chat.members.find(m => m.id === id)?.name;
  /** Maps an attachment id to its name */
  const getAttachment = (id: string) => ATTACHMENTS.find(a => a.id === id)?.name;

  return (
    <>
      <Accordion.Title active={active} onClick={() => setActive(!active)}>
        <div style={styles.header}>
          <Icon name="dropdown" />
          Advanced Search

          <div className="spacer"></div>

          <Button
            negative
            size="mini"
            onClick={e => {
              e.stopPropagation();
              props.setSearchParams([
                { name: SearchParam.Query },
                { name: SearchParam.StartDate },
                { name: SearchParam.EndDate },
                { name: SearchParam.SentBy },
                { name: SearchParam.LikedBy },
                { name: SearchParam.Attachments },
              ]);
            }}
            style={{ visibility: query || startDate || endDate || sentBy.length || likedBy.length || attachments.length ? 'visible' : 'hidden' }}
          >
            <Icon name="x" />
            Clear Filters
          </Button>
        </div>

        {active ? null : (
          <div style={styles.subheader}>
            <div>{startDate && `Start Date: ${startDate.toLocaleDateString()}`}</div>
            <div>{endDate && `End Date: ${endDate.toLocaleDateString()}`}</div>
            <div>{!!sentBy.length && `Sent by: ${sentBy.map(getUser).join(', ')}`}</div>
            <div>{!!likedBy.length && `Liked by: ${likedBy.map(getUser).join(', ')}`}</div>
            <div>{!!attachments.length && `Attachments: ${attachments.map(getAttachment).join(', ')}`}</div>
          </div>
        )}
      </Accordion.Title>

      <Accordion.Content active={active}>
        <Form>
          <Form.Field>
            <label>Start Date</label>
            <DatePicker
              placeholderText="mm/dd/yyyy"
              selected={startDate}
              maxDate={endDate}
              onChange={date => props.setSearchParams([{ name: SearchParam.StartDate, value: date?.toLocaleDateString() }])}
            />
          </Form.Field>

          <Form.Field>
            <label>End Date</label>
            <DatePicker
              placeholderText="mm/dd/yyyy"
              selected={endDate}
              minDate={startDate}
              onChange={date => props.setSearchParams([{ name: SearchParam.EndDate, value: date?.toLocaleDateString() }])}
            />
          </Form.Field>

          <Form.Field>
            <label>Sent by</label>
            <Dropdown
              placeholder="Select members..."
              fluid
              multiple
              search
              selection
              value={sentBy}
              options={props.chat?.members.map(member => ({ text: member.name, value: member.id })) || []}
              onChange={(_, data) => props.setSearchParams([{ name: SearchParam.SentBy, value: data.value as string[] }])}
            />
          </Form.Field>

          <Form.Field>
            <label>Liked by</label>
            <Dropdown
              placeholder="Select members..."
              fluid
              multiple
              search
              selection
              value={likedBy}
              options={props.chat?.members.map(member => ({ text: member.name, value: member.id })) || []}
              onChange={(_, data) => props.setSearchParams([{ name: SearchParam.LikedBy, value: data.value as string[] }])}
            />
          </Form.Field>

          <Form.Field>
            <label>Attachments</label>
            <Dropdown
              placeholder="Select attachment types..."
              fluid
              multiple
              search
              selection
              value={attachments}
              options={ATTACHMENTS.map(a => ({ text: a.name, value: a.id, label: { color: a.color, empty: true, circular: true } }))}
              onChange={(_, data) => props.setSearchParams([{ name: SearchParam.Attachments, value: data.value as string[] }])}
            />
          </Form.Field>
        </Form>
      </Accordion.Content>
    </>
  );
}

const styles: Styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  subheader: {
    fontSize: '0.75em',
    fontWeight: 'normal',
    lineHeight: 'normal',
  }
}