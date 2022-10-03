import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { GroupMe } from 'src/services';

type Props = {};

export function Callback(props: Props): ReactElement {
  const access_token = new URLSearchParams(window.location.search).get('access_token');

  if (access_token) {
    GroupMe.access_token = access_token;
    GroupMe.getUser().then(() => {
      const redirect_url = sessionStorage.getItem('redirect_url');
      if (redirect_url) {
        sessionStorage.removeItem('redirect_url');
        window.location.href = redirect_url;
      }
    }).catch(() => {
      window.location.href = '/logout'
    });
  }

  return <Navigate to="/" />
}
