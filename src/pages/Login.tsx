import { Component, ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Button, Divider, Header, Icon, Image } from 'semantic-ui-react';
import { GroupMe } from 'src/services';
import { Styles } from 'src/interfaces';
import banner from 'src/assets/searchme-text.png';
import icon from 'src/assets/searchme-icon.png';

type Props = {};
type State = {};

export class Login extends Component<Props, State> {
  render(): ReactNode {
    if (GroupMe.authenticated) {
      return <Navigate to="/" />
    }

    return (
      <div style={styles.wrapper}>
        <div style={styles.banner_wrapper}>
          <Image src={banner} centered style={styles.banner} alt="SearchMe banner" />
        </div>

        <div style={styles.icon_wrapper}>
          <Image src={icon} centered style={styles.icon} alt="SearchMe icon" />
        </div>

        <Header textAlign="center" style={styles.subtitle}>
          Search your GroupMe messages
        </Header>

        <Button as="a" style={styles.login} href={GroupMe.LOGIN_URL}>
          <Icon name="sign-in" />
          Login with GroupMe
        </Button>

        <div className="spacer" />

        <Divider horizontal style={styles.learn_more}>
          Learn More
        </Divider>

        <div style={styles.links}>
          <Button as={Link} circular icon style={styles.link} to="/about">
            <Icon name="info circle" style={styles.link_icon} />
          </Button>

          <Button as="a" circular icon style={styles.link} href="https://github.com/psweeney101/searchme" target="_blank" rel="noreferrer">
            <Icon name="github" style={styles.link_icon} />
          </Button>

          <Button as="a" circular icon style={styles.link} href="https://www.buymeacoffee.com/psweeney101" target="_blank" rel="noreferrer">
            <Icon name="coffee" style={styles.link_icon} />
          </Button>
        </div>

        <div style={styles.powered_by_groupme}>Powered by GroupMe®</div>
      </div>
    )
  }
}

const styles: Styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  banner_wrapper: {
    backgroundColor: '#00aff0',
  },
  banner: {
    width: '700px',
    maxWidth: '100%',
    maxHeight: '100%',
    padding: '10vh 5vw',
  },
  icon_wrapper: {
    height: '15vh',
    width: '15vh',
    borderRadius: '50%',
    padding: '2vh',
    margin: '-7.5vh auto',
    backgroundColor: 'white',
  },
  icon: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
  subtitle: {
    paddingTop: '10vh',
  },
  login: {
    backgroundColor: '#00aff0',
    color: 'white',
    margin: 'auto',
  },
  links: {
    display: 'flex',
    justifyContent: 'center',
    gap: '24px',
    padding: '24px',
  },
  link: {
    background: 'rgb(116, 118, 120)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  link_icon: {
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  powered_by_groupme: {
    textAlign: 'center',
    padding: '12px',
  }
}
