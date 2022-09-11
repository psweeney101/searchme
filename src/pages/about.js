import banner from "../assets/SearchMe_Logo.png";
import { Link } from "react-router-dom";
import React from "react";

class About extends React.Component {
    constructor() {
        super();
        window.scrollTo(0, 0);
    }
    render() {
        return (
            <div>
                <div style={{ width: "80%", maxWidth: "400px", maxHeight: "100%", display: "block", margin: "auto" }} onClick={() => window.location.href = "/"}><br />
                    <img src={banner} style={{ width: "80%", maxWidth: "400px", maxHeight: "100%", display: "block", margin: "auto" }} alt="SearchMe" />
                    <br />
                </div>
                <div className="ui items">
                    <div className="item">
                        <div className="content">
                            <div className="header" style={{ width: "100%" }}>
                                <span style={{ display: "table", margin: "auto" }}>About SearchMe</span>
                            </div>
                            <br />
                            <br />
                            <div className="header">
                                <span>Who?</span>
                            </div>
                            <div className="meta">
                                <span>
                                    SearchMe was created and is maintained by Patrick Sweeney, Purdue University Computer Science class of 2019.
                            </span>
                            </div>
                            <br />
                            <div className="header">
                                <span>What?</span>
                            </div>
                            <div className="meta">
                                <span>
                                    SearchMe is a web-based application that utilizes <a href="https://dev.groupme.com/docs/v3">GroupMe's APIs</a> to allow users to search their groups, a feature that GroupMe doesn't currently have. You can search by keyword, filter by dates, user sent by, user liked by, and attachments, sort by date, user, or likes, and click on the date of a message to jump to that point in the chat's history. You can even download a .txt file containing a stringified JSON object of your group or direct message.
                            </span>
                            </div>
                            <br />
                            <div className="header">
                                <span>Where?</span>
                            </div>
                            <div className="meta">
                                <span>
                                    SearchMe is hosted on Vercel and directly linked to my <a href="https://github.com/psweeney101/searchme">GitHub repository</a>.
                            </span>
                            </div>
                            <br />
                            <div className="header">
                                <span>When?</span>
                            </div>
                            <div className="meta">
                                <span>
                                    SearchMe was started as a project for my ENGL 309 class in October of 2017.
                            </span>
                            </div>
                            <br />
                            <div className="header">
                                <span>Why?</span>
                            </div>
                            <div className="meta">
                                <span>
                                    One day I wanted to find a message I sent in a 600-message group that contained important contact information for an event we were planning. After realizing GroupMe didn't have a simple search feature, digging around online for a "Search your GroupMe" app to find nothing, and scrolling through the messages for minutes, I decided to write a quick program that used <a href="https://dev.groupme.com/docs/v3">GroupMe's APIs</a> to spit out the JSON data of that group. A few days later in my ENGL 309 class, we were asked to find a design problem and implement a solution to it, and here's that solution. Whether your group has 100 or 100,000 messages, SearchMe will get the job done.
                            </span>
                            </div>
                            <br />
                            <div className="header">
                                <span>How?</span>
                            </div>
                            <div className="meta">
                                <span>
                                    SearchMe is built with <a href="https://reactjs.org">React</a>and utilizes <a href="https://semantic-ui.com/">Semantic UI,</a> <a href="https://www.npmjs.com/package/axios">Axios,</a> <a href="https://www.npmjs.com/package/javascript-time-ago">Javascript-Time-Ago,</a><a href="https://momentjs.com/">Moment.js,</a><a href="https://react-day-picker.js.org/">React-Day-Picker,</a><a href="https://github.com/bvaughn/react-highlight-words">React-Highlight-Words,</a>and <a href="https://www.npmjs.com/package/universal-cookie">Universal-Cookie.</a>The server is written in <a href="https://nodejs.org/en/">Node.js</a>and utilizes <a href="https://expressjs.com/">Express.</a>When a user logs in and authenticates through GroupMe, their access token is saved into a cookie; in accordance with <a href="https://dev.groupme.com/GroupMe_API_License_Agreement.pdf">GroupMe's API License Agreement,</a>that cookie expires one month after the latest login. You can also login by pasting your access token (your token can be copied from the bottom of any page after loggin in); this functionality was added for quicker login and to use IOS's webapp capabilities without having to go to Safari after redirecting to GroupMe.  When the user picks a group or direct message to search, all of their messages are loaded directly to the client. SearchMe prioritizes privacy and security, so none of your messages or access tokens are logged or stored at all. You can check out my <a href="https://github.com/psweeney101/searchme">GitHub repository</a> to see how it's done.
                            </span>
                            </div>
                            <br />
                            <div className="header">
                                <span>What's Next?</span>
                            </div>
                            <div className="meta">
                                <span>
                                    <a href="https://dev.groupme.com/tutorials/push">GroupMe's push server</a> doesn't seem to be working, but a live message stream is something I'd like to implement next. Other than that, I'd like to add the ability to view analytics on the group (who likes the most messages, who sends the most messages, whose messages do you like the most), provide the ability to post to the group or like messages from SearchMe, and let users search multiple groups at once.
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
                <center style={{ width: "100%" }}>
                    <br /> Powered by GroupMe®<br />
                    {this.props.access_token ? <Link to="/logout">Logout</Link> : null}
                    <br /><br /><br />
                </center>
            </div>
        )
    }
}

export default About;