import { FC, ReactElement } from 'react';
import { Image } from 'semantic-ui-react';
import groupNoAvatar from 'src/assets/group-no-avatar.png';
import userNoAvatar from 'src/assets/user-no-avatar.png';

type Props = {
  type: 'group' | 'user',
  src: string | undefined,
  alt: string | undefined;
  size?: string;
};

export const Avatar: FC<Props> = (props: Props): ReactElement => {
  const fallback = props.type === 'group' ? groupNoAvatar : userNoAvatar;

  return <Image
    src={props.src || groupNoAvatar}
    onError={(error: React.SyntheticEvent<HTMLImageElement, Event>) => { error.currentTarget.src = fallback }}
    alt={props.alt}
    size="tiny"
    style={{
      maxWidth: props.size,
      maxHeight: props.size,
      aspectRatio: '1',
      objectFit: 'cover',
      marginLeft: 'auto',
      display: 'block',
      borderRadius: props.type === 'group' ? '.3125em' : '500rem',
    }}
  />
}
