import { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { GroupMe } from 'src/services';

type Props = {};
type State = {};

export class Callback extends Component<Props, State> {
  render(): ReactNode  {
    GroupMe.access_token = new URLSearchParams(window.location.search).get('access_token');

    return <Navigate to="/" />
  }
}
