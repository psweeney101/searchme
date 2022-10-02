import { Component, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { GroupMe } from 'src/services';

type Props = {};
type State = {};

export class Callback extends Component<Props, State> {
  render(): ReactNode {
    const access_token = new URLSearchParams(window.location.search).get('access_token');

    if (access_token) {
      GroupMe.access_token = access_token;
      GroupMe.getUser().catch(() => {
        alert('ERROR: Invalid access token from GroupMe.');
        window.location.href = '/logout';
      });
    }

    return <Navigate to="/" />
  }
}
