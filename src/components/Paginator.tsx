import { FC, ReactElement } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { Styles } from 'src/interfaces';

type Props = {
  startIndex: number;
  messagesPerPage: number;
  total: number;
  page: number;
  setSearchParam: (name: string, value?: string | string[] | number) => void;
};

export const Paginator: FC<Props> = (props: Props): ReactElement => {
  const start = Math.min(props.startIndex + 1, props.total);
  const end = Math.min(start + props.messagesPerPage - 1, props.total);

  const maxPage = Math.ceil(props.total / props.messagesPerPage);

  return (
    <div style={styles.wrapper}>
      <Button icon="angle double left" style={{ visibility: props.page !== 1 ? 'visible': 'hidden' }} onClick={() => props.setSearchParam('page')} />
      <Button icon="angle left" style={{ visibility: props.page > 1 ? 'visible': 'hidden' }} onClick={() => props.setSearchParam('page', props.page - 1)}  />

      <span className="spacer" />

      <Header style={styles.header}>
        {start.toLocaleString()} - {end.toLocaleString()} of {props.total.toLocaleString()}
      </Header>

      <span className="spacer" />

      <Button icon="angle right" style={{ visibility: props.page < maxPage ? 'visible': 'hidden' }} onClick={() => props.setSearchParam('page', props.page + 1)} />
      <Button icon="angle double right" style={{ visibility: props.page !== maxPage ? 'visible': 'hidden' }} onClick={() => props.setSearchParam('page', maxPage)} />
    </div>
  );
}

const styles: Styles = {
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 0',
  },
  header: {
    margin: 0,
    fontSize: '1em',
  }
}
