import { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Image, Item } from 'semantic-ui-react';
import { GroupMe } from 'src/services';
import { Styles } from 'src/interfaces';
import logo from 'src/assets/searchme-logo.png';

type Props = {};

export function About(props: Props): ReactElement {
  useEffect(() => {
    window.document.title = 'SearchMe';
  }, []);

  return (
    <div style={styles.wrapper}>
      <div>
        <Image src={logo} centered size="medium" alt="SearchMe logo" />
      </div>

      <div style={styles.header}>
        <Button as={Link} to="/" circular icon="left chevron" style={styles.back} />
        <Header as="h1" textAlign="center" style={styles.title}>About</Header>
      </div>

      <Item.Group>
        <Item>
          <Item.Content>
            <Item.Header as="h2">What?</Item.Header>
            <Item.Description>
              SearchMe is a web-based application that utilizes <a href="https://dev.groupme.com/docs/v3" target="_blank" rel="noreferrer">GroupMe's APIs</a> to enable a fast, advanced, and secure search of your group chats.
              You can search using keywords, dates, senders, likers, and attachment types.
              You can sort by date, number of likes, length, or name.
              You can click on the date of a message to jump to that point in the chat's history.
              You can even download a .json file containing the data in your chat.
              From small chats with 100 messages to massive groups with over 135,000 (shoutout Arkansas Meme Machine), SearchMe should get the job done.
            </Item.Description>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Header as="h2">Who?</Item.Header>
            <Item.Description>
              SearchMe was created and is maintained by Patrick Sweeney, Purdue University Computer Science class of 2019.
            </Item.Description>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Header as="h2">When?</Item.Header>
            <Item.Description>
              SearchMe was started as a project for my ENGL 309 class in October of 2017.
            </Item.Description>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Header as="h2">Why?</Item.Header>
            <Item.Description>
              At the time of creation, GroupMe did not have a search feature.
              Although GroupMe now supports keyword searching, SearchMe offers features that GroupMe will likely never support.
            </Item.Description>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Header as="h2">Where?</Item.Header>
            <Item.Description>
              SearchMe is hosted on <a href="https://vercel.com" target="_blank" rel="noreferrer">Vercel</a> and is directly linked to my <a href="https://github.com/psweeney101/searchme" target="_blank" rel="noreferrer">GitHub repository</a>.
            </Item.Description>
          </Item.Content>
        </Item>

        <Item>
          <Item.Content>
            <Item.Header as="h2">How?</Item.Header>
            <Item.Description>
              SearchMe is built in
              &nbsp;<a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a>
              &nbsp;with <a href="https://www.typescriptlang.org" target="_blank" rel="noreferrer">Typescript</a>
              &nbsp;and utilizes several popular open-source projects, including
              &nbsp;<a href="https://axios-http.com" target="_blank" rel="noreferrer">Axios</a>,
              &nbsp;<a href="https://date-fns.org" target="_blank" rel="noreferrer">date-fns</a>,
              &nbsp;<a href="https://gitlab.com/catamphetamine/javascript-time-ago" target="_blank" rel="noreferrer">javascript-time-ago</a>,
              &nbsp;<a href="https://reactdatepicker.com" target="_blank" rel="noreferrer">React Datepicker</a>,
              &nbsp;<a href="https://github.com/nkbt/react-debounce-input" target="_blank" rel="noreferrer">react-debounce-input</a>,
              &nbsp;<a href="https://react-hot-toast.com" target="_blank" rel="noreferrer">React Hot Toast</a>,
              &nbsp;<a href="https://reactrouter.com" target="_blank" rel="noreferrer">React Router</a>,
              &nbsp;<a href="https://github.com/iansinnott/react-string-replace" target="_blank" rel="noreferrer">React String Replace</a>,
              &nbsp;and <a href="https://react.semantic-ui.com" target="_blank" rel="noreferrer">Semantic UI React</a>.
              &nbsp;SearchMe has no database - all of your messages are loaded directly from <a href="https://dev.groupme.com/docs/v3" target="_blank" rel="noreferrer">GroupMe.com</a> into your browser.
              &nbsp;You can check out my <a href="https://github.com/psweeney101/searchme" target="_blank" rel="noreferrer">GitHub repository</a> to see how it's done.
              &nbsp;Have an idea for a new feature? Or did you encounter a bug? Consider adding an <a href="https://github.com/psweeney101/searchme/issues/new/choose" target="_blank" rel="noreferrer">issue to the Github repository</a>.
            </Item.Description>
          </Item.Content>
        </Item>

        <div style={styles.footer}>
          <div>Powered by GroupMe®</div>
          <a href="https://www.buymeacoffee.com/psweeney101" target="_blank" rel="noreferrer">☕️ Buy Me A Coffee ☕️</a>
          {GroupMe.authenticated ? <Link to="/logout">Logout</Link> : null}
        </div>
      </Item.Group>
    </div>
  )
}

const styles: Styles = {
  wrapper: {
    width: '90%',
    maxWidth: '700px',
    margin: 'auto',
  },
  header: {
    display: 'flex',
    paddingTop: '16px',
  },
  back: {
    margin: 0,
  },
  title: {
    margin: 'auto',
    paddingRight: '36px',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '12px',
  }
}