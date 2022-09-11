import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./app.css";
import About from "./pages/about";
import Directory from "./pages/directory";
import DM from "./pages/dm";
import Group from "./pages/group";
import Login from "./pages/login";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            access_token: localStorage.getItem("access_token")
        }
        this.params = new URLSearchParams(window.location.search);

        // Automatically redirect from Heroku to Vercel
        if (location.href.includes("heroku.com")) {
            alert("NOTICE: SearchMe is moving to https://searchme.vercel.app. Heroku is ending its free tier support on November 28, 2022. Starting then, this heroku.com URL will no longer be available. Redirecting now...")
            location.href = "https://searchme.vercel.app";
        }
    }

    about = () => {
        return <About access_token={this.state.access_token} />;
    }

    callback = () => {
        var access_token = this.params.get("access_token");
        if (access_token) {
            localStorage.setItem("access_token", this.params.get("access_token"));
        }
        return <Redirect to="/" />;
    }

    directory = () => {
        if (!this.state.access_token) {
            return <Redirect to="/" />;
        }
        return <Directory access_token={this.state.access_token} />;
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
        } else if (localStorage.getItem("access_token")) {
            this.setState({
                access_token: localStorage.getItem("access_token")
            }, () => {
                return <Redirect to="/directory" />;
            });
        }
        return <Login />;
    }

    logout = () => {
        localStorage.clear();
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