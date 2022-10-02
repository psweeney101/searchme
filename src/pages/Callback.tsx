import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { GroupMe } from 'src/services';

type Props = {};

export function Callback(props: Props): ReactElement {
  const access_token = new URLSearchParams(window.location.search).get('access_token');

  if (access_token) {
    GroupMe.access_token = access_token;
    GroupMe.getUser().catch(() => {
      toast.error('ERROR: Invalid access token from GroupMe. Redirecting...');
      setTimeout(() => {
        window.location.href = '/logout';
      }, 2000);
    });
  }

  return <Navigate to="/" />
}
