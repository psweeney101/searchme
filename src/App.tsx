import { Component, ReactNode } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { Image } from 'semantic-ui-react';
import { Toaster } from 'react-hot-toast';
import { GroupMe } from 'src/services';
import { Styles } from 'src/interfaces';
import logo from 'src/assets/searchme-logo.png';

type Props = {};
type State = {};

export class App extends Component<Props, State> {
  render(): ReactNode {
    if (!GroupMe.authenticated) {
      return <Navigate to="/login" />;
    }

    // Automatically redirect from Heroku to Vercel
    if (window.location.href.includes('herokuapp.com')) {
      window.alert('SearchMe is moving to https://searchme.vercel.app. Heroku is ending its free tier support on November 28, 2022. Starting then, this herokuapp.com URL will no longer be available. Redirecting now...');
      window.location.href = "https://searchme.vercel.app";
    }

    return (
      <div style={styles.wrapper}>

        <Image src={logo} centered size="medium" alt="SearchMe logo" />

        <Outlet />

        <div style={styles.footer}>
          <div>Powered by GroupMe®</div>
          <Link to="/about">About</Link>
          <a href="https://www.buymeacoffee.com/psweeney101" target="_blank" rel="noreferrer">☕️ Buy Me A Coffee ☕️</a>
          <Link to="/logout">Logout</Link>
        </div>
        <Toaster position="bottom-center" />
      </div>
    )
  }
}

const styles: Styles = {
  wrapper: {
    width: '90%',
    maxWidth: '700px',
    margin: 'auto',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
  }
}
