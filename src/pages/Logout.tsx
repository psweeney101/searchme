import { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { GroupMe } from 'src/services';

type Props = {};
type State = {};

export class Logout extends Component<Props, State> {
  render(): ReactNode  {
    GroupMe.access_token = null;

    return <Navigate to="/login" />
  }
}
