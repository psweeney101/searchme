import { format } from 'date-fns';
import { FC, ReactElement, useState } from 'react';
import { Button, Feed, Icon, Modal, Popup } from 'semantic-ui-react';
import { GMChat, GMMessage, Styles } from 'src/interfaces';
import { Avatar } from './Avatar';
import { Highlight } from './Highlight';

type Props = {
  chat: GMChat;
  message: GMMessage;
  query: string;
};

export const Message: FC<Props> = ({ chat, message, query }: Props): ReactElement => {
  const [modal, setModal] = useState<GMMessage['attachments'][0] | undefined>(undefined);

  /** Maps a favoriter to the user */
  const getUser = (id: string) => {
    const user = chat.members.find(m => m.id === id);
    if (!user) return undefined;
    return (
      <Popup key={id} hoverable on={['focus', 'hover']} trigger={<span><Avatar type="user" src={user.image_url} alt={user.name} size="25px" /></span>}>
        <Popup.Content>{user.name}</Popup.Content>
      </Popup>
    );
  }

  return (
    <Feed.Event id={message.id}>
      <Feed.Label>
        <Avatar type={message.user.id === 'system' ? 'group' : 'user'} src={message.user.image_url} alt={message.user.name} />
      </Feed.Label>
      <Feed.Content style={styles.content}>
        <Feed.Summary>
          <Feed.User as="span">{message.user.name}</Feed.User>
          <Feed.Date as="a" onClick={() => document.location.hash = message.id}>{format(message.created_at, 'MMM dd yyyy p')}</Feed.Date>
        </Feed.Summary>
        <Feed.Extra text style={styles.text}>
          <Highlight query={query} text={message.text} />
        </Feed.Extra>
        <Feed.Extra images>{message.attachments.map((attachment, index) => {
          if (attachment.type === 'image' || attachment.type === 'linked_image') return <img key={index} src={attachment.url} alt={message.text} height="150px" style={{ width: 'auto', cursor: 'pointer' }} onClick={() => setModal(attachment)} />
          if (attachment.type === 'video') return <video key={index} src={`${attachment.url}#t=0.1`} controls preload="metadata" height="150px" />
          return null;
        })}
        </Feed.Extra>
        <Feed.Meta>
          <Popup hoverable on={['focus', 'hover']} disabled={!message.liked_by.length} trigger={(<span><Icon name="like" />{message.liked_by.length}</span>)}>
            <Popup.Content style={styles.likers}>
              {message.liked_by.map(getUser)}
            </Popup.Content>
          </Popup>
        </Feed.Meta>
      </Feed.Content>
      <Modal basic size="small" open={!!modal} onClose={() => setModal(undefined)}>
        <Modal.Content image style={styles.modalContent}>
          <img src={modal?.url} style={styles.modalImage} alt="Attachment" />
          <Button inverted style={styles.modalClose} onClick={() => setModal(undefined)}>Close</Button>
        </Modal.Content>
      </Modal>
    </Feed.Event>
  );
}

const styles: Styles = {
  content: {
    overflow: 'hidden',
  },
  text: {
    maxWidth: '100%',
  },
  likers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '7px',
  },
  modalContent: {
    flexDirection: 'column',
    width: 'fit-content',
    margin: 'auto',
  },
  modalImage: {
    maxHeight: 'calc(100vh - 6em - 36px)',
    maxWidth: '100%',
    objectFit: 'contain',
    margin: 'auto',
  },
  modalClose: {
    width: 'fit-content',
    marginTop: '1em',
  }
}
