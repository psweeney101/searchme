import { format } from 'date-fns';
import { ReactElement, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Feed, Icon, Modal, Popup, Segment } from 'semantic-ui-react';
import { GMChat, GMMessage, SearchParam, SetSearchParams, Styles } from 'src/interfaces';
import { Avatar } from './Avatar';
import { Highlight } from './Highlight';

type Props = {
  chat: GMChat;
  message: GMMessage;
  query: string;
  setSearchParams: SetSearchParams;
};

export function Message({ chat, message, query, setSearchParams }: Props): ReactElement {
  const [modal, setModal] = useState<GMMessage['attachments'][0] | undefined>(undefined);

  /** Maps a favoriter to the user */
  const getUser = (id: string) => {
    const user = chat.members.find(m => m.id === id);
    if (!user) return undefined;
    return (
      <Popup
        key={id}
        hoverable on={['focus', 'hover']}
        trigger={
          <span tabIndex={0}>
            <Avatar type="user" src={user.image_url} alt={user.name} size="25px" />
          </span>
        }
      >
        <Popup.Content>{user.name}</Popup.Content>
      </Popup>
    );
  }

  const copy = useCallback(() => {
    const url = `${window.location.origin}${window.location.pathname}?${SearchParam.MessageID}=${message.id}`;
    try {
      navigator.clipboard.writeText(url);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error(`Failed to copy message to clipboard: ${error}`);
    }
  }, [message.id]);

  return (
    <Feed id={message.id} as={Segment}>
      <Feed.Event>
        <Feed.Label>
          <Avatar
            type={message.user.id === 'system' ? 'group' : 'user'}
            src={message.user.image_url}
            alt={message.user.name}
          />
        </Feed.Label>
        <Feed.Content style={styles.content}>
          <Feed.Summary>
            <Feed.User as="span">{message.user.name}</Feed.User>
            <Feed.Date
              as={Button}
              inverted
              onClick={() => setSearchParams([{ name: SearchParam.MessageID, value: message.id }])}
              tabIndex="0"
            >
              {format(message.created_at, 'MMM dd yyyy p')}
            </Feed.Date>
          </Feed.Summary>
          <Feed.Extra text style={styles.text}>
            <Highlight query={query} text={message.text} />
          </Feed.Extra>
          <Feed.Extra images style={styles.images}>{message.attachments.map((attachment, index) => {
            if (attachment.type === 'image' || attachment.type === 'linked_image') {
              return (
                <div key={index} style={styles.mediaWrapper}>
                  <img
                    src={attachment.url}
                    alt={message.text}
                    style={styles.media}
                    tabIndex={0}
                    onClick={() => setModal(attachment)}
                    onKeyDown={e => e.key === 'Enter' ? setModal(attachment) : null}
                  />
                </div>
              );
            }
            if (attachment.type === 'video') {
              return (
                <div key={index} style={styles.mediaWrapper}>
                  <video
                    src={`${attachment.url}#t=0.1`}
                    style={styles.media}
                    controls
                    preload="metadata"
                  />
                </div>
              );
            }
            return null;
          })}
          </Feed.Extra>
          <Feed.Meta>
            <Popup
              hoverable
              on={['focus', 'hover']}
              disabled={!message.liked_by.length}
              trigger={(
                <span tabIndex={0}>
                  <Icon name="like" />
                  {message.liked_by.length}
                </span>
              )}
            >
              <Popup.Content style={styles.likers}>
                {message.liked_by.map(getUser)}
              </Popup.Content>
            </Popup>
            <Popup
              content="Copy link to message"
              trigger={
                <Icon
                  name="linkify"
                  style={{ cursor: 'pointer' }}
                  tabIndex="0"
                  onClick={copy}
                  onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' ? copy() : null}
                />
              }
            />
          </Feed.Meta>
        </Feed.Content>
        <Modal
          basic
          size="fullscreen"
          style={styles.modal}
          open={!!modal}
          onClose={() => setModal(undefined)}
        >
          <Modal.Content image style={styles.modalContent}>
            <img
              src={modal?.url}
              style={styles.modalImage}
              alt="Attachment"
            />
            <Button
              inverted
              style={styles.modalClose}
              onClick={() => setModal(undefined)}
              content="Close"
            />
          </Modal.Content>
        </Modal>
      </Feed.Event>
    </Feed>
  );
}

const styles: Styles = {
  content: {
    overflow: 'hidden',
  },
  text: {
    maxWidth: '100%',
  },
  images: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1em',
  },
  mediaWrapper: {
    height: '150px',
  },
  media: {
    height: '100%',
    width: 'auto',
    cursor: 'pointer',
    margin: 0,
  },
  likers: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '7px',
  },
  modal: {
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
    margin: 0,
  },
  modalContent: {
    width: 'fit-content',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1em',
    margin: 'auto',
    padding: 0,
  },
  modalImage: {
    maxWidth: '100%',
    maxHeight: 'calc(100% - 1em - 36px)',
    objectFit: 'fill',
  },
  modalClose: {
    alignSelf: 'flex-start',
  }
}
