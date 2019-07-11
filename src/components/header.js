import React from "react";
import noImage from "../assets/noGroupAvatar.png";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = (event) => {
            props.search(event.target.value);
        }
    }
    render() {
        return (
            <div className="ui grid middle aligned">
                <div className="two column row">
                    <div className="left floated left aligned column">
                        <h2 className="ui header">
                            <center>
                                <img className="ui tiny image" src={this.props.image_url || noImage} alt="Group avatar" />
                                <span>{this.props.name}</span>
                            </center>
                        </h2>
                    </div>
                    <div className="right floated right aligned column">
                        <div className="ui search">
                            <div className="ui icon input" style={{ width: "100%" }}>
                                <input type="text" onChange={this.handleChange} value={this.props.query} placeholder="Live Search..." />
                                <i className="search icon"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header;