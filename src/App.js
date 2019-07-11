import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Cookies from "universal-cookie";

import About from "./pages/about";
import Directory from "./pages/directory";
import DM from "./pages/dm";
import Group from "./pages/group";
import Login from "./pages/login";

export default class App extends React.Component {
    constructor() {
        super();
        this.cookies = new Cookies();
        this.state = {
            access_token: this.cookies.get("SearchMe")
        }
        this.params = new URLSearchParams(window.location.search);
    }

    about = () => {
        return <About access_token={this.state.access_token} />;
    }

    callback = () => {
        var access_token = this.params.get("access_token");
        if (access_token) {
            this.cookies.set("SearchMe", this.params.get("access_token"), {
                maxAge: 3600 * 24 * 30, // 1 Month
                path: "/",
                //secure: true
            });
        }
        return <Redirect to="/" />;
    }

    directory = () => {
        if (!this.state.access_token) {
            return <Redirect to="/" />;
        }
        return <Directory access_token={this.state.access_token}/>;
    }

    dm = ({ match }) => {
        if (!this.state.access_token) {
            return <Redirect to="/" />;
        }
        return <DM access_token={this.state.access_token} user_id={match.params.user_id} />;
    }

    group = ({ match }) => {
        if (!this.state.access_token) {
            return <Redirect to="/" />;
        }
        return <Group access_token={this.state.access_token} group_id={match.params.group_id} />;
    }

    login = () => {
        if (this.state.access_token) {
            return <Redirect to="/directory" />;
        } else if (this.cookies.get("SearchMe")) {
            this.setState({
                access_token: this.cookies.get("SearchMe")
            }, () => {
                return <Redirect to="/directory" />;
            });
        }
        return <Login />;
    }

    logout = () => {
        this.cookies.remove("SearchMe", {
            maxAge: 3600 * 24 * 30, // 1 Month
            path: "/",
            //secure: true
        });
        this.setState({
            access_token: undefined
        });
        return <Redirect to="/" />;
    }

    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={this.login} />
                    <Route exact path="/logout" component={this.logout} />
                    <Route exact path="/callback" component={this.callback} />
                    <Route exact path="/about" component={this.about} />
                    <Route exact path="/directory" component={this.directory} />
                    <Route exact path="/group/:group_id" component={this.group} />
                    <Route exact path="/dm/:user_id" component={this.dm} />
                    <Redirect to="/" />
                </Switch>
            </BrowserRouter>
        );
    }
}