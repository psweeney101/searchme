import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import noImage from "../assets/noGroupAvatar.png";
TimeAgo.locale(en);
const timeAgo = new TimeAgo("en-US");

class Group extends React.Component {
    render() {
        return (
            <div className="item" onClick={() => window.location.href = `/group/${this.props.group.id}`}>
                <img className="ui image mini" src={this.props.group.image_url || noImage} style={{ objectFit: "cover", width: "50px", height: "50px" }} alt="Group avatar" />
                <div className="content">
                    <div className="header" style={{ fontSize: "14px" }}>{this.props.group.name}</div>
                    <div className="description">{"Last updated " + timeAgo.format((this.props.group.messages.last_message_created_at || this.props.group.updated_at) * 1000)}</div>
                </div>
            </div>
        )
    }
}

export default Group;