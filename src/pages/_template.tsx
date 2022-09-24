import { Component, ReactNode } from 'react';
import { Styles } from 'src/interfaces';

type Props = {};
type State = {};

export class Template extends Component<Props, State> {
  render(): ReactNode  {
    return (
      <div style={styles.wrapper}>Template works!</div>
    )
  }
}

const styles: Styles = {
  wrapper: {
    backgroundColor: 'red',
  }
}
