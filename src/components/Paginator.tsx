import { ReactElement } from 'react';
import { Button, Header } from 'semantic-ui-react';
import { SearchParam, SetSearchParams, Styles } from 'src/interfaces';

type Props = {
  page: number;
  displayed: number;
  total: number;
  messagesPerPage: number;
  setSearchParams: SetSearchParams;
};

export function Paginator(props: Props): ReactElement {
  const start = Math.min((props.page - 1) * props.messagesPerPage + 1, props.total);
  const end = Math.min(start + props.messagesPerPage - 1, props.total);

  const maxPage = props.total ? Math.ceil(props.total / props.messagesPerPage) : 1;

  return (
    <div style={styles.wrapper}>
      <Button
        icon="angle double left"
        style={{ visibility: props.page !== 1 ? 'visible' : 'hidden' }}
        onClick={() => props.setSearchParams([{ name: SearchParam.Page }])}
      />
      <Button
        icon="angle left"
        style={{ visibility: props.page > 1 ? 'visible' : 'hidden' }}
        onClick={() => props.setSearchParams([{ name: SearchParam.Page, value: props.page - 1 }])}
      />

      <span className="spacer" />

      <Header style={styles.header}>
        {start.toLocaleString()} - {end.toLocaleString()} of {props.total.toLocaleString()}
      </Header>

      <span className="spacer" />

      <Button
        icon="angle right"
        style={{ visibility: props.page < maxPage ? 'visible' : 'hidden' }}
        onClick={() => props.setSearchParams([{ name: SearchParam.Page, value: props.page + 1 }])}
      />
      <Button
        icon="angle double right"
        style={{ visibility: props.page !== maxPage ? 'visible' : 'hidden' }}
        onClick={() => props.setSearchParams([{ name: SearchParam.Page, value: maxPage }])}
      />
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
