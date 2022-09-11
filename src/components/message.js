import React from "react";
import { Icon, Popup, Modal, Button } from "semantic-ui-react";
import moment from "moment";
import noImage from "../assets/noUserAvatar.png";
import groupmeLogo from "../assets/GroupMe_Logo.png";
import Highlighter from "react-highlight-words";

class Message extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            url: ""
        }
        this.modal = (url) => {
            this.setState({ open: !this.state.open, url: url })
        }
    }
    render() {
        return (
            <div className="ui padded segment" id={this.props.message.id}>
                <div className="ui middle aligned one column grid">
                    <div className="ui feed" style={{ maxWidth: "100%" }}>
                        <div className="event">
                            <div className="label">
                                {this.props.message.user_id === "system" ? <img src={groupmeLogo} style={{ objectFit: "cover", width: "50px", height: "35px", borderRadius: "0em" }} className="ui large image" alt="Profile" /> : <img src={this.props.message.avatar_url != null ? this.props.message.avatar_url.replace(/http:/, "https:") : noImage} style={{ objectFit: "cover", width: "50px", height: "35px" }} className="ui massive circular image" alt="Profile" />}
                            </div>
                            <div className="content" style={{ width: "calc(100% - 2.5em)" }}>
                                <div className="summary">
                                    <span className="userName">{this.props.message.name}</span>
                                    <div className="date" onClick={() => this.props.jumpToMessage(this.props.message)}>
                                        <div>{moment(new Date(this.props.message.created_at * 1000)).format("MMM DD YYYY h:mm A")}</div>
                                    </div>
                                </div>
                                <div className="extra text">
                                    <p className="text" style={{ whiteSpace: "pre-wrap" }} ><Highlighter searchWords={this.props.search.split(" ")} caseSensitive={false} autoEscape={true} textToHighlight={this.props.message.text || ""} highlightClassName={"Highlight"} /></p>
                                </div>
                                {this.props.message.attachments == null ? null : this.props.message.attachments.map((attachment) => {
                                    if (attachment.type === "image" || attachment.type === "linked_image") {
                                        return (
                                            <div className="extra images" key={attachment.url}>
                                                <img src={attachment.url.replace(/http:/, "https:")} alt="Attached" onClick={() => this.modal(attachment.url.replace(/http:/, "https:"))} />
                                            </div>
                                        );
                                    } else if (attachment.type === "video") {
                                        return (
                                            <div className="extra images" key={attachment.url}>
                                                <a href={attachment.url}>
                                                    <video height="150px" src={attachment.url.replace(/http:/, "https:")} controls />
                                                </a>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                                <div className="meta">
                                    {this.props.message.favorited_by.length === 0 ? <span><Icon name="like" />{this.props.message.favorited_by.length}</span> : <Popup trigger={<span><Icon name="like" />{this.props.message.favorited_by.length}</span>} hoverable>
                                        <Popup.Content>
                                            {this.props.message.favorited_by.map((favoriter) => {
                                                for (var i = 0; i < this.props.members.length; i++) {
                                                    if (this.props.members[i].user_id === favoriter) {
                                                        return <span key={favoriter}><Popup trigger={<img src={this.props.members[i].image_url != null ? this.props.members[i].image_url.replace(/http:/, "https:") : noImage} style={{ objectFit: "cover", width: "20px", height: "20px" }} alt="Favoriter" />}>{this.props.members[i].nickname}</Popup>{'\u00A0'}</span>
                                                    }
                                                }
                                                return null;
                                            })}
                                        </Popup.Content>
                                    </Popup>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal basic size="small" open={this.state.open}>
                    <Modal.Content>
                        <center>
                            <div className="image content">
                                <img src={this.state.url} style={{ maxWidth: "100%", maxHeight: "500px" }} alt="Attachment"></img>
                            </div>
                        </center>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' inverted onClick={() => this.modal("")}>
                            <Icon name='remove' /> Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

export default Message;