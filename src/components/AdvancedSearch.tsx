import { FC, ReactElement, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Accordion, Button, Dropdown, Form, Icon } from 'semantic-ui-react';
import { Chat } from 'src/interfaces';

type Props = {
  chat?: Chat;
  startDate: string;
  endDate: string;
  sentBy: string;
  likedBy: string;
  attachments: string;
  setSearchParam: (name: string, value?: string | string[] | number) => void;
  reset: () => void;
};

export const AdvancedSearch: FC<Props> = (props: Props): ReactElement => {
  const [active, setActive] = useState(false);

  const sentBy = props.sentBy.split(',') || [];
  const likedBy = props.likedBy.split(',') || [];
  const attachments = props.attachments.split(',') || [];

  const startDate = props.startDate ? new Date(props.startDate) : null;
  const endDate = props.endDate ? new Date(props.endDate) : null;

  return (
    <>
      <Accordion.Title active={active} onClick={() => setActive(!active)}>
        <Icon name="dropdown" />
        Advanced Search
      </Accordion.Title>

      <Accordion.Content active={active}>
        <Form>
          <Form.Field>
            <label>Start Date</label>
            <DatePicker placeholderText="mm/dd/yyyy" selected={startDate} maxDate={endDate} onChange={date => props.setSearchParam('startDate', date?.toLocaleDateString())} />
          </Form.Field>

          <Form.Field>
            <label>End Date</label>
            <DatePicker placeholderText="mm/dd/yyyy" selected={endDate} minDate={startDate} onChange={date => props.setSearchParam('endDate', date?.toLocaleDateString())} />
          </Form.Field>

          <Form.Field>
            <label>Sent by</label>
            <Dropdown placeholder="Select members..." fluid multiple search selection value={sentBy} options={
              props.chat?.members.map(member => ({ text: member.name, value: member.id })) || []
            } onChange={(_, data) => props.setSearchParam('sentBy', data.value as string[])} />
          </Form.Field>

          <Form.Field>
            <label>Liked by</label>
            <Dropdown placeholder="Select members..." fluid multiple search selection value={likedBy} options={
              props.chat?.members.map(member => ({ text: member.name, value: member.id })) || []
            } onChange={(_, data) => props.setSearchParam('likedBy', data.value as string[])} />
          </Form.Field>

          <Form.Field>
            <label>Attachments</label>
            <Dropdown placeholder="Select attachment types..." fluid multiple search selection value={attachments} options={[
              { text: "Image", value: "image", label: { color: "red", empty: true, circular: true } },
              { text: "Linked Image", value: "linked_image", label: { color: "blue", empty: true, circular: true } },
              { text: "Event", value: "event", label: { color: "black", empty: true, circular: true } },
              { text: "Poll", value: "poll", label: { color: "purple", empty: true, circular: true } },
              { text: "File", value: "file", label: { color: "olive", empty: true, circular: true } },
              { text: "Location", value: "location", label: { color: "yellow", empty: true, circular: true } },
              { text: "Video", value: "video", label: { color: "pink", empty: true, circular: true } },
            ]} onChange={(_, data) => props.setSearchParam('attachments', data.value as string[])} />
          </Form.Field>

          <Button negative onClick={() => props.reset()}>
            <Icon name="x" />
            Clear Filters
          </Button>
        </Form>
      </Accordion.Content>
    </>
  );
}
