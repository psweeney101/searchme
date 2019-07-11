import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import noImage from "../assets/noUserAvatar.png"
TimeAgo.locale(en);
const timeAgo = new TimeAgo("en-US");

class Dm extends React.Component {
    render() {
        return (
            <div className="item" onClick={() => window.location.href = `/dm/${this.props.dm.other_user.id}`}>
                <img className="circular ui image mini" src={this.props.dm.other_user.avatar_url || noImage} style={{ objectFit: "cover", width: "50px", height: "50px" }} alt="Group avatar" />
                <div className="content">
                    <div className="header" style={{ fontSize: "14px" }}>{this.props.dm.other_user.name}</div>
                    <div className="description">{"Last updated " + timeAgo.format(this.props.dm.updated_at * 1000)}</div>
                </div>
            </div>
        )
    }
}

export default Dm;