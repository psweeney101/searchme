import React from "react";
import { Modal, Icon, Button, Form, Checkbox } from "semantic-ui-react";

export default class DMDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            content: "all",
            id: false,
            name: true,
            avatar_url: false,
            created_at: false,
            updated_at: false,
            message_id: false,
            source_guid: false,
            recipient_id: false,
            message_created_at: true,
            user_id: false,
            user_name: true,
            message_avatar_url: false,
            text: true,
            favorited_by: false,
            attachments: true
        }
    }
    render() {
        this.download = () => {
            var dm = {};
            if(this.state.id || this.state.name || this.state.avatar_url) dm.other_user = {};
            var messages = this.state.content === "all" ? this.props.messages : this.props.filtered;
            if (this.state.id) dm.other_user.id = this.props.dm.other_user.id;
            if (this.state.name) dm.other_user.name = this.props.dm.other_user.name;
            if (this.state.avatar_url) dm.other_user.avatar_url = this.props.dm.other_user.avatar_url;
            if (this.state.created_at) dm.created_at = this.props.dm.created_at;
            if (this.state.updated_at) dm.updated_at = this.props.dm.updated_at;
            dm.messages = messages.map((m) => {
                var message = {};
                if (this.state.message_id) message.id = m.id;
                if (this.state.source_guid) message.source_guid = m.source_guid;
                if (this.state.message_created_at) message.created_at = m.created_at;
                if (this.state.recipient_id) message.recipient_id = m.recipient_id;
                if (this.state.user_id) message.user_id = m.user_id;
                if (this.state.user_name) message.name = m.name;
                if (this.state.avatar_url) message.avatar_url = m.avatar_url;
                if (this.state.text) message.text = m.text;
                if (this.state.favorited_by) message.favorited_by = m.favorited_by;
                if (this.state.attachments) message.attachments = m.attachments;
                return message;
            });
            var download = document.createElement("a");
            download.setAttribute("id", "thisid");
            download.setAttribute("href", window.URL.createObjectURL(new Blob([JSON.stringify(dm)], {type: "octet/stream"})));
            download.setAttribute("download", "SearchMe " + this.props.dm.other_user.name + ".txt");
            download.click();
            download.remove();
            this.setState({ open: false });
        }
        return (
            <center style={{ display: this.props.messages.length === 0 ? "none" : "" }}>
                <Button onClick={() => this.setState({ open: true })}>Download Direct Message Transcript</Button>
                <Modal open={this.state.open}>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Which messages would you like to download?</label>
                                <Checkbox radio label="Download all messages" checked={this.state.content === "all"} onChange={() => this.setState({ content: "all" })} /> <br />
                                <Checkbox radio label="Download filtered messages" checked={this.state.content === "filtered"} onChange={() => this.setState({ content: "filtered" })} /> <br />
                            </Form.Field>
                            <Form.Field>
                                <label>What would you like to include in the header?</label>
                                <Checkbox label="other user id" checked={this.state.id} onChange={() => this.setState({ id: !this.state.id })} /> <br />
                                <Checkbox label="other user name" checked={this.state.name} onChange={() => this.setState({ name: !this.state.name })} /> <br />
                                <Checkbox label="other user avatar url" checked={this.state.avatar_url} onChange={() => this.setState({ avatar_url: !this.state.avatar_url })} /> <br />
                                <Checkbox label="chat created at" checked={this.state.created_at} onChange={() => this.setState({created_at: !this.state.created_at })} /> <br />
                                <Checkbox label="chat updated at" checked={this.state.updated_at} onChange={() => this.setState({ updated_at: !this.state.updated_at })} /> <br />
                            </Form.Field>
                            <Form.Field>
                                <label>What would you like to include for each message?</label>
                                <Checkbox label="message id" checked={this.state.message_id} onChange={() => this.setState({ message_id: !this.state.message_id })} /> <br />
                                <Checkbox label="message source guid" checked={this.state.source_guid} onChange={() => this.setState({ source_guid: !this.state.source_guid })} /> <br />
                                <Checkbox label="recipient id" checked={this.state.recipient_id} onChange={() => this.setState({ recipient_id: !this.state.recipient_id })} /> <br />
                                <Checkbox label="message timestamp" checked={this.state.message_created_at} onChange={() => this.setState({ message_created_at: !this.state.message_created_at })} /> <br />
                                <Checkbox label="user id" checked={this.state.user_id} onChange={() => this.setState({ user_id: !this.state.user_id })} /> <br />
                                <Checkbox label="user name" checked={this.state.user_name} onChange={() => this.setState({ user_name: !this.state.user_name })} /> <br />
                                <Checkbox label="avatar url" checked={this.state.message_avatar_url} onChange={() => this.setState({ message_avatar_url: !this.state.message_avatar_url })} /> <br />
                                <Checkbox label="message" checked={this.state.text} onChange={() => this.setState({ text: !this.state.text })} /> <br />
                                <Checkbox label="liked by user ids" checked={this.state.favorited_by} onChange={() => this.setState({ favorited_by: !this.state.favorited_by })} /> <br />
                                <Checkbox label="attachments" checked={this.state.attachments} onChange={() => this.setState({ attachments: !this.state.attachments })} /> <br />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='green' onClick={this.download}>
                            <Icon name='download' /> Download
                        </Button>
                        <Button basic color='red' onClick={() => this.setState({ open: false })}>
                            <Icon name='remove' /> Close
                        </Button>
                    </Modal.Actions>
                </Modal>
            </center>
        )
    }
}