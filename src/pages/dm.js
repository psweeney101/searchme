import banner from "../assets/SearchMe_Logo.png";
import DMDownload from "../components/dmDownload";
import Filter from "../components/filter";
import GroupMeService from "../services/groupme.service";
import MessageService from "../services/message.service";
import Header from "../components/header";
import { Link } from "react-router-dom";
import Message from "../components/message";
import Paginator from "../components/paginator";
import React from "react";
import Sort from "../components/sort";
import Status from "../components/status";

export default class DM extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            unpagedLength: 0,
            search: "",
            start: "",
            end: "",
            sentBy: [],
            likedBy: [],
            attachments: [],
            sort: "most_recent",
            index: 0,
            size: 50,
            dm: null,
            me: null,
            loaded: "loading..."
        }
        this.messageService = new MessageService();
    }

    componentDidMount = () => {
        GroupMeService.getCurrentUser(this.props.access_token, (me) => {
            GroupMeService.getDm(this.props.access_token, this.props.user_id, (dm) => {
                this.dm = dm;
                this.setState({
                    dm: dm,
                    loaded: `0 / ${dm.messages_count}`,
                    me: me
                }, () => {
                    GroupMeService.getDmMessages(this.props.access_token, this.state.dm.other_user.id, (messages) => {
                        this.messageService.setMessages(messages);
                        this.fetchMessages();
                        this.setState({
                            loaded: ""
                        });
                    }, (loaded) => {
                        this.setState({
                            loaded: `${loaded} / ${this.state.dm.messages_count}`
                        });
                    });
                });
            });
        });
    }

    filter = {
        search: (search) => {
            this.setState({ search: search }, () => {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(this.fetchMessages, 500);
            });
        },
        start: (start) => this.setState({ start: start }, this.fetchMessages),
        end: (end) => this.setState({ end: end }, this.fetchMessages),
        sentBy: (sentBy) => this.setState({ sentBy: sentBy }, this.fetchMessages),
        likedBy: (likedBy) => this.setState({ likedBy: likedBy }, this.fetchMessages),
        attachments: (attachments) => this.setState({ attachments: attachments }, this.fetchMessages),
        clear: () => this.setState({ start: "", finish: "", sentBy: [], likedBy: [], attachments: [] }, this.fetchMessages)
    }
    sort = (sort) => this.setState({ sort: sort }, this.fetchMessages);
    paginate = {
        next: () => this.setState({ index: this.state.index + 1 }, this.fetchMessages),
        back: () => this.setState({ index: this.state.index - 1 }, this.fetchMessages),
        first: () => this.setState({ index: 0 }, this.fetchMessages),
        last: () => this.setState({ index: this.state.unpagedLength === 0 ? 0 : Math.ceil(this.state.unpagedLength / this.state.size) - 1 }, this.fetchMessages)
    }

    fetchMessages = () => {
        var fetchedMessages = this.messageService.fetchMessages(this.state.search, this.state.start, this.state.end, this.state.sentBy, this.state.likedBy, this.state.attachments, this.state.sort, this.state.index, this.state.size);
        this.setState({
            messages: fetchedMessages.messages,
            unpagedLength: fetchedMessages.unpagedLength
        });
    }

    render() {
        if(!this.state.dm) return null;
        return (
            <div>
                <div style={{ width: "80%", maxWidth: "400px", maxHeight: "100%", display: "block", margin: "auto" }} onClick={() => window.location.href = "/directory"}><br />
                    <img src={banner} style={{ width: "80%", maxWidth: "400px", maxHeight: "100%", display: "block", margin: "auto" }} alt="SearchMe" />
                    <br />
                </div>
                {/*.....search function......group name...................group image............................search query..........*/}
                <Header search={this.filter.search} name={this.state.dm.other_user.name} image_url={this.state.dm.other_user.avatar_url} query={this.state.search} />
                <div className="ui divider"></div>
                {/*.....group members......................filtering functions..start date value.........finish date value..........sent by users..............liked by users...............attachment values................*/}
                <Filter members={[{user_id: this.state.dm.other_user.id, nickname: this.state.dm.other_user.name}, {user_id: this.state.me.id, nickname: this.state.me.name}]} filter={this.filter} start={this.state.start} finish={this.state.finish} sentBy={this.state.sentBy} likedBy={this.state.likedBy} attachments={this.state.attachments} />
                {/*...sort functions...sort value..........*/}
                <Sort sort={this.sort} value={this.state.sort} />
                {/*.....numeber messages loaded....page index...............page index.............number of filtered messsages.........*/}
                <Status loaded={this.state.loaded} index={this.state.index} size={this.state.size} unpagedLength={this.state.unpagedLength} />
                {/*............................................message data......group members......................search value...............key...............*/}
                {this.state.messages.map((message) => <Message message={message} members={[{user_id: this.state.dm.other_user.id, nickname: this.state.dm.other_user.name, image_url: this.state.dm.other_user.avatar_url}, {user_id: this.state.me.id, nickname: this.state.me.name, image_url: this.state.me.avatar_url}]} search={this.state.search} key={message.id} />)}
                <br /><br />
                {/*.........paginate functions.......page index............,..page index.............number of filtered messsages.........*/}
                <Paginator paginate={this.paginate} index={this.state.index} size={this.state.size} unpagedLength={this.state.unpagedLength} />
                <br />
                {/*.......dm information.....all messages............................filtered messages..........*/}
                <DMDownload dm={this.props.dm} messages={this.messageService.messages} filtered={this.state.messages} />
                <br />
                <center style={{ width: "100%" }}>
                    <br /> Powered by GroupMe®<br />
                    <Link to="/about">About SearchMe</Link><br />
                    <a href="https://www.buymeacoffee.com/psweeney101" target="_blank">☕ Buy Me A Coffee</a><br />
                    <Link to="/logout">Logout</Link><br />
                    <br /><br />
                </center>
            </div>
        );
    }

}