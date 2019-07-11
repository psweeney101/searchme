import React from "react";
import { Accordion, Icon, Dropdown } from "semantic-ui-react";

class Sort extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
        this.handleClick = () => {
            this.setState({ active: !this.state.active });
        }
        this.handleSort = (event, data) => {
            props.sort(data.value);
        }
        this.options = [
            { text: "Most Recent", value: "most_recent" },
            { text: "Least Recent", value: "least_recent" },
            { text: "Nickname A-Z", value: "nickname_az" },
            { text: "Nickname Z-A", value: "nickname_za" },
            { text: "Most Liked", value: "most_liked" },
            { text: "Least Liked", value: "least_liked" }
        ];
    }
    render() {
        return (
            <Accordion styled style={{ width: "100%" }}>
                <Accordion.Title active={this.state.active} onClick={this.handleClick}>
                    <Icon name="sort" /> Sort Messages
                </Accordion.Title>
                <Accordion.Content active={this.state.active}>
                    <center><Dropdown onChange={this.handleSort} value={this.props.value} inline options={this.options} /></center>
                </Accordion.Content>
            </Accordion>
        );
    }
}

export default Sort;