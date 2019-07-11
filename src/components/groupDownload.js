import React from "react";
import { Modal, Icon, Button, Form, Checkbox } from "semantic-ui-react";

export default class GroupDownload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            content: "all",
            id: false,
            name: true,
            type: false,
            description: false,
            image_url: false,
            creator_user_id: false,
            created_at: false,
            updated_at: false,
            members: true,
            share_url: false,
            message_group_id: false,
            message_id: false,
            source_guid: false,
            message_created_at: true,
            user_id: false,
            user_name: true,
            avatar_url: false,
            text: true,
            system: false,
            favorited_by: false,
            attachments: true
        }
    }
    render() {
        this.download = () => {
            var group = {};
            var messages = this.state.content === "all" ? this.props.messages : this.props.filtered;
            if (this.state.id) group.id = this.props.group.id;
            if (this.state.name) group.name = this.props.group.name;
            if (this.state.type) group.type = this.props.group.type;
            if (this.state.description) group.description = this.props.group.description;
            if (this.state.image_url) group.image_url = this.props.group.image_url;
            if (this.state.creator_user_id) group.creator_user_id = this.props.group.creator_user_id;
            if (this.state.created_at) group.created_at = this.props.group.created_at;
            if (this.state.updated_at) group.updated_at = this.props.group.updated_at;
            if (this.state.members) group.members = this.props.group.members;
            if (this.state.share_url) group.share_url = this.props.group.share_url;
            group.messages = messages.map((m) => {
                var message = {};
                if (this.state.message_group_id) message.group_id = m.group_id;
                if (this.state.message_id) message.id = m.id;
                if (this.state.source_guid) message.source_guid = m.source_guid;
                if (this.state.message_created_at) message.created_at = m.created_at;
                if (this.state.user_id) message.user_id = m.user_id;
                if (this.state.user_name) message.name = m.name;
                if (this.state.avatar_url) message.avatar_url = m.avatar_url;
                if (this.state.text) message.text = m.text;
                if (this.state.system) message.system = m.system;
                if (this.state.favorited_by) message.favorited_by = m.favorited_by;
                if (this.state.attachments) message.attachments = m.attachments;
                return message;
            });
            var download = document.createElement("a");
            download.setAttribute("id", "thisid");
            download.setAttribute("href", window.URL.createObjectURL(new Blob([JSON.stringify(group)], {type: "octet/stream"})));
            download.setAttribute("download", "SearchMe " + this.props.group.name + ".txt");
            download.click();
            download.remove();
            this.setState({ open: false });
        }
        return (
            <center style={{ display: this.props.messages.length === 0 ? "none" : "" }}>
                <Button onClick={() => this.setState({ open: true })}>Download Group Transcript</Button>
                <Modal size="small" open={this.state.open}>
                    <Modal.Content>
                        <Form>
                            <Form.Field>
                                <label>Which messages would you like to download?</label>
                                <Checkbox radio label="Download all messages" checked={this.state.content === "all"} onChange={() => this.setState({ content: "all" })} /> <br />
                                <Checkbox radio label="Download filtered messages" checked={this.state.content === "filtered"} onChange={() => this.setState({ content: "filtered" })} /> <br />
                            </Form.Field>
                            <Form.Field>
                                <label>What would you like to include in the header?</label>
                                <Checkbox label="group id" checked={this.state.id} onChange={() => this.setState({ id: !this.state.id })} /> <br />
                                <Checkbox label="group name" checked={this.state.name} onChange={() => this.setState({ name: !this.state.name })} /> <br />
                                <Checkbox label="group type" checked={this.state.type} onChange={() => this.setState({ type: !this.state.type })} /> <br />
                                <Checkbox label="group description" checked={this.state.description} onChange={() => this.setState({ description: !this.state.description })} /> <br />
                                <Checkbox label="group image url" checked={this.state.image_url} onChange={() => this.setState({ image_url: !this.state.image_url })} /> <br />
                                <Checkbox label="group creator id" checked={this.state.creator_user_id} onChange={() => this.setState({ creator_user_id: !this.state.creator_user_id })} /> <br />
                                <Checkbox label="group created at" checked={this.state.created_at} onChange={() => this.setState({ created_at: !this.state.created_at })} /> <br />
                                <Checkbox label="group updated at" checked={this.state.updated_at} onChange={() => this.setState({ updated_at: !this.state.updated_at })} /> <br />
                                <Checkbox label="group members" checked={this.state.members} onChange={() => this.setState({ members: !this.state.members })} /> <br />
                                <Checkbox label="group share url" checked={this.state.share_url} onChange={() => this.setState({ share_url: !this.state.share_url })} /> <br />
                            </Form.Field>
                            <Form.Field>
                                <label>What would you like to include for each message?</label>
                                <Checkbox label="group id" checked={this.state.message_group_id} onChange={() => this.setState({ message_group_id: !this.state.message_group_id })} /> <br />
                                <Checkbox label="message id" checked={this.state.message_id} onChange={() => this.setState({ message_id: !this.state.message_id })} /> <br />
                                <Checkbox label="message source guid" checked={this.state.source_guid} onChange={() => this.setState({ source_guid: !this.state.source_guid })} /> <br />
                                <Checkbox label="message timestamp" checked={this.state.message_created_at} onChange={() => this.setState({ message_created_at: !this.state.message_created_at })} /> <br />
                                <Checkbox label="user id" checked={this.state.user_id} onChange={() => this.setState({ user_id: !this.state.user_id })} /> <br />
                                <Checkbox label="user name" checked={this.state.user_name} onChange={() => this.setState({ user_name: !this.state.user_name })} /> <br />
                                <Checkbox label="avatar url" checked={this.state.avatar_url} onChange={() => this.setState({ avatar_url: !this.state.avatar_url })} /> <br />
                                <Checkbox label="message" checked={this.state.text} onChange={() => this.setState({ text: !this.state.text })} /> <br />
                                <Checkbox label="system" checked={this.state.system} onChange={() => this.setState({ system: !this.state.system })} /> <br />
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