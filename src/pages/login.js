import React from "react";
import logo from "../assets/SearchMe_Icon.png";
import banner from "../assets/SearchMe_Text.png";

export default class Login extends React.Component {
  groupmeUrl = process.env.REACT_APP_GROUPME_URL;

  render() {
    return (
      <div class="login" style={container}>
        <div style={bannerContainer}>
          <img src={banner} style={bannerImg}></img>
        </div>
        <div style={content}>
          <div style={logoContainer}>
            <img src={logo} style={logoImg}></img>
          </div>
          <div class="ui header" style={subtitle}>
            Search your GroupMe messages
          </div>
          <a className="ui button" style={loginButton} href={this.groupmeUrl}>
            <i className="sign-in icon"></i>
            Login with GroupMe
          </a>
        </div>
        <div style={extra}>
          <span style={{ flex: 1 }}></span>
          <div class="ui horizontal divider" style={learnMore}>
            Learn More
          </div>
          <div style={links}>
            <a class="ui circular icon button" style={link} href="/about">
              <i class="info circle icon" style={linkIcon}></i>
            </a>
            <a class="ui circular icon button" style={link} href="https://github.com/psweeney101/SearchMe" target="_blank">
              <i class="github icon" style={linkIcon}></i>
            </a>
            <a class="ui circular icon button" style={link} href="https://www.buymeacoffee.com/psweeney101" target="_blank">
              <i class="coffee icon" style={linkIcon}></i>
            </a>
          </div>
          <div style={groupme}>Powered by GroupMe®</div>
        </div>
      </div>
    );
  }
}

const container = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
};
const bannerContainer = {
  backgroundColor: '#00aff0',
  height: '40vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};
const bannerImg = {
  width: '80%',
  maxWidth: '500px',
};
const content = {
  flex: 1,
  textAlign: 'center',
};
const logoContainer = {
  backgroundColor: 'white',
  borderRadius: '50%',
  width: '128px',
  height: '128px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '-64px auto',
};
const logoImg = {
  maxWidth: '80%',
  maxHeight: '80%',
  marginTop: '10px',
};
const subtitle = {
  paddingTop: '64px',
  textAlign: 'center',
};
const loginButton = {
  backgroundColor: '#00aff0',
  color: 'white',
}
const extra = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};
const learnMore = {
  fontWeight: 'normal',
  width: '50%',
  margin: 'auto',
};
const links = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '24px',
};
const link = {
  background: '#747678',
  margin: '0 12px',
};
const linkIcon = {
  color: 'white',
};
const groupme = {
  textAlign: 'center',
  paddingBottom: '10px',
};
