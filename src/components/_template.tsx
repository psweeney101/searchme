import { FC, ReactElement } from 'react';
import { Styles } from 'src/interfaces';

type Props = {};

export const _Template: FC<Props> = (props: Props): ReactElement => {
  return (
    <span style={styles.wrapper}>Template works!</span>
  );
}

const styles: Styles = {
  wrapper: {
    backgroundColor: 'red',
  }
}