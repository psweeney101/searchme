import { ReactElement } from 'react';
import { Styles } from 'src/interfaces';

type Props = {};

export function _Template(props: Props): ReactElement {
  return (
    <span style={styles.wrapper}>Template works!</span>
  );
}

const styles: Styles = {
  wrapper: {
    backgroundColor: 'red',
  }
}
