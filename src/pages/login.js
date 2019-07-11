import { Link } from "react-router-dom";
import React from "react";
import logo from "../assets/SearchMe_Icon.png";
import banner from "../assets/SearchMe_Text.png";

export default class Login extends React.Component {
    login = () => {
        window.location.href = "https://oauth.groupme.com/oauth/authorize?client_id=7QBCn4P7fvHAwsibvBFzYpIy8f1tNmI8LMHNcTcV0spo85F0";
    }

    render() {
        return (
            <div style={{ height: "100%", overflow: "hidden" }}>
                <div style={bannerBox}>
                    <img style={bannerStyle} src={banner} alt="SearchMe" />
                </div>
                <div style={inner}>
                    <div style={{ width: "100%" }}>
                        <br /> <br /> <br /> <br />
                        <img className="tiny ui middle aligned image" src={logo} alt="SearchMe" />
                        <br /> <br />
                        <button className="ui white button" onClick={this.login}>
                            <i className="lock icon"></i>
                            Login with GroupMe!
                        </button><br /><br /><br />
                        <div className="ui basic icon input">
                            {/*<input type="password" placeholder="Or enter access token directly..." style={{ fontSize: "10px", width: "12pc" }} value={this.state.token} onChange={this.handleChange} />*/}
                            <button className="ui basic icon button" onClick={this.login} >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
                <center style={{ width: "100%" }}>
                    <br /> Powered by GroupMe®<br />
                    <Link to="/about">About SearchMe</Link><br />
                    <br /><br />
                </center>
            </div >
        );
    }
}

const bannerBox = {
    position: "fixed",
    top: "10px",
    left: "0px",
    right: "0px",
    width: "100%"
}

const bannerStyle = {
    display: "block",
    margin: "auto",
    width: "70%",
    maxWidth: "500px"
}

const inner = {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: "100%",
    maxHeight: "400px",
    alignItems: 'center',
    alignContent: 'center',
    margin: "0 auto",
    overflow: "hidden"
}

const img = {
    height: '30%',
    maxHeight: '300px'
}