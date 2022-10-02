import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { GroupMe } from 'src/services';

type Props = {};

export function Logout(props: Props): ReactElement {
  GroupMe.access_token = null;

  return <Navigate to="/login" />
}
