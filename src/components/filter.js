import React from "react";
import moment from "moment";
import { Accordion, Icon, Dropdown } from "semantic-ui-react";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { formatDate, parseDate } from "react-day-picker/moment";

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: false,
        };
        this.handleClick = () => {
            this.setState({ active: !this.state.active });
        }
        this.handleStartChange = (start) => {
            props.filter.start(start);
            if (props.end === "") {
                this.to.getInput().focus();
            }
        }
        this.handleEndChange = (end) => {
            props.filter.end(end);
            if (props.start && moment(end).diff(moment(props.start), 'months') < 2) {
                this.to.getDayPicker().showMonth(props.start);
            }
        }
        this.handleSentByChange = (event, data) => {
            props.filter.sentBy(data.value);
        }
        this.handleLikedByChange = (event, data) => {
            props.filter.likedBy(data.value);
        }
        this.handleAttachmentsChange = (event, data) => {
            props.filter.attachments(data.value);
        }
        this.clearFilters = () => {
            props.filter.clear();
        }
        this.tagOptions = [
            { text: "Image", value: "image", label: { color: "red", empty: true, circular: true } },
            { text: "Linked Image", value: "linked_image", label: { color: "blue", empty: true, circular: true } },
            { text: "Event", value: "event", label: { color: "black", empty: true, circular: true } },
            { text: "Poll", value: "poll", label: { color: "purple", empty: true, circular: true } },
            { text: "File", value: "file", label: { color: "olive", empty: true, circular: true } },
            { text: "Location", value: "location", label: { color: "yellow", empty: true, circular: true } },
            { text: "Video", value: "video", label: { color: "pink", empty: true, circular: true } },
        ]
    }
    render() {
        this.members = this.props.members.map((member) => {
            return {
                key: member.user_id,
                text: member.nickname,
                value: member.user_id
            }
        });
        this.members.push({ key: "system", text: "GroupMe", value: "system" });
        var start = this.props.start;
        var end = this.props.end;
        const modifiers = { start: start, end: end };
        return (
            <Accordion styled style={{ width: "100%" }}>
                <Accordion.Title active={this.state.active} onClick={this.handleClick} index={0}>
                    <Icon name="filter" /> Filter Messages
                </Accordion.Title>
                <Accordion.Content active={this.state.active}>
                    <div className="ui form">
                        <div className="two fields">
                            <div className="field">
                                <label>Start Date</label>
                                <div className="InputFromTo" style={{ width: "100%" }}>
                                    <DayPickerInput
                                        value={start}
                                        placeholder="Any Start Date..."
                                        format="LL"
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        dayPickerProps={{
                                            selectedDays: [start, { start, end }],
                                            disabledDays: { after: end },
                                            toMonth: new Date(end),
                                            modifiers,
                                            numberOfMonths: 1,
                                        }}
                                        onDayChange={this.handleStartChange}
                                    />
                                </div>
                            </div>
                            <div className="field">
                                <label>End Date</label>
                                <div className="InputFromTo-to" style={{ width: "100%" }}>
                                    <DayPickerInput
                                        style={{ width: "100%" }}
                                        ref={el => (this.to = el)}
                                        value={end}
                                        placeholder="Any End Date..."
                                        format="LL"
                                        formatDate={formatDate}
                                        parseDate={parseDate}
                                        dayPickerProps={{
                                            selectedDays: [start, { start, end }],
                                            disabledDays: { before: start },
                                            modifiers,
                                            month: start,
                                            fromMonth: new Date(start),
                                            numberOfMonths: 1,
                                        }}
                                        onDayChange={this.handleEndChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label>Sent by</label>
                            <Dropdown value={this.props.sentBy} onChange={this.handleSentByChange} placeholder="Any Users..." fluid multiple selection search options={this.members} />
                        </div>
                        <div className="field">
                            <label>Liked by</label>
                            <Dropdown value={this.props.likedBy} onChange={this.handleLikedByChange} placeholder="Any Users..." fluid multiple selection search options={this.members} />
                        </div>
                        <div className="field">
                            <label>Attachments</label>
                            <Dropdown value={this.props.attachments} onChange={this.handleAttachmentsChange} placeholder="Any attachments..." fluid multiple selection search options={this.tagOptions} />
                        </div>
                        <br />
                        <center>
                            <button className="ui button" type="submit" id="clearFilters" onClick={() => this.clearFilters()}>Clear Filters</button>
                        </center>
                    </div>
                </Accordion.Content>
            </Accordion>
        );
    }
}

export default Filter;