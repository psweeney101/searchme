import banner from "../assets/SearchMe_Logo.png";
import DirectoryDM from "../components/directorydm";
import DirectoryGroup from "../components/directorygroup";
import GroupMeService from "../services/groupme.service";
import { Link } from "react-router-dom";
import React from "react";

export default class Directory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            search: "",
            directory: undefined
        }
    }

    handleChange = (event) => {
        var query = event.target.value;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.setState({
                search: query.toUpperCase()
            });
        }, 500);
    }
    componentDidMount = () => {
        GroupMeService.getDirectory(this.props.access_token, (directory) => {
            this.setState({
                directory: directory
            });
        });
    }

    render() {
        return (
            <div>
            <div style={{ width: "80%", maxWidth: "400px", maxHeight: "100%", display: "block", margin: "auto" }}><br />
                <img src={banner} style={{ width: "80%", maxWidth: "400px", maxHeight: "100%", display: "block", margin: "auto" }} alt="SearchMe" />
                <br />
            </div>
            <div className="ui grid middle aligned">
                <div className="two column row" style={headerRow}>
                    <div className="left floated left aligned column">
                        <h2 className="ui header">
                            Groups
                        <div className="sub header">Pick a group you would like to search.</div>
                        </h2>
                    </div>
                    <div className="right floated right aligned column">
                        <div className="ui right icon input" style={{ maxWidth: "100%" }}>
                            <input type="text" placeholder="Search groups..." id="searchBar" onChange={this.handleChange} />
                            <i className="users icon"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ui divider"></div>
            <div className="ui segment">
                <div className="ui middle aligned selection animated divided list mini">
                    {this.state.directory === undefined ? "loading..." : this.state.directory.map((item) => {
                        if (item.other_user && item.other_user.name.toUpperCase().indexOf(this.state.search) !== -1) {
                            return <DirectoryDM dm={item} key={item.other_user.id} />
                        } else if (item.name && item.name.toUpperCase().indexOf(this.state.search) !== -1) {
                            return <DirectoryGroup group={item} key={item.id} />
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
            <center style={{ width: "100%" }}>
                <br /> Powered by GroupMe®<br />
                    <Link to="/about">About SearchMe</Link><br />
                    <Link to="/logout">Logout</Link><br />
                <br /><br />
            </center>
        </div>
        );
    }
}

const headerRow = {
    width: "90%"
}