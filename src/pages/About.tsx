import { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Image, Item } from 'semantic-ui-react';
import { GroupMe } from 'src/services';
import { Styles } from 'src/interfaces';
import logo from 'src/assets/searchme-logo.png';

type Props = {};
type State = {};

export class About extends Component<Props, State> {
  render(): ReactNode {
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
                SearchMe is a web-based application that utilizes <a href="https://dev.groupme.com/docs/v3" target="_blank" rel="noreferrer">GroupMe's APIs</a> to enable a fast advanced search of your group chats.
                You can search by keyword, dates, senders, likers, and attachments.
                You can sort by date, sender, or number of likes.
                You can click on the date of a message to jump to that point in the chat's history.
                You can even download a .json file containing the data in your chat.
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
                SearchMe is built with <a href="https://reactjs.org" target="_blank" rel="noreferrer">React</a> and utilizes
                &nbsp;<a href="https://semantic-ui.com" target="_blank" rel="noreferrer">Semantic UI</a>,
                &nbsp;<a href="https://www.npmjs.com/package/axios" target="_blank" rel="noreferrer">Axios</a>,
                &nbsp;<a href="https://www.npmjs.com/package/javascript-time-ago" target="_blank" rel="noreferrer">Javascript-Time-Ago</a>,
                &nbsp;<a href="https://reactdatepicker.com" target="_blank" rel="noreferrer">React-Datepicker</a>,
                &nbsp;and <a href="https://github.com/iansinnott/react-string-replace" target="_blank" rel="noreferrer">React-String-Replace</a>.
                &nbsp;SearchMe has no database - all of your messages are loaded directly from <a href="https://dev.groupme.com/docs/v3" target="_blank" rel="noreferrer">GroupMe.com</a> into your browser.
                You can check out my <a href="https://github.com/psweeney101/searchme" target="_blank" rel="noreferrer">GitHub repository</a> to see how it's done.
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