import React from "react";

export default class Paginator extends React.Component {
    render() {
        return (
            <div className="ui two column grid" style={{ display: this.props.unpagedLength === 0 ? "none" : "" }}>
                <div className="row" style={{ padding: "0px 0px 5px 0px" }}>
                    <div className="left floated column">
                        <button className="ui left floated left labeled icon button" onClick={this.props.paginate.back} style={{ display: this.props.index === 0 ? "none" : "" }}>
                            <i className="left arrow icon"></i>
                            Back
                    </button>
                    </div>
                    <div className="right aligned column">
                        <button className="ui right floated right labeled icon button" onClick={this.props.paginate.next} style={{ display: ((this.props.index + 1) * this.props.size) >= this.props.unpagedLength ? "none" : "" }}>
                            <i className="right arrow icon"></i>
                            Next
                    </button>
                    </div>
                </div>
                <div className="row" style={{ padding: "0px 0px 5px 0px" }} >
                    <div className="left floated column">
                        <button className="ui left floated left labeled icon button" onClick={this.props.paginate.first} style={{ display: this.props.index === 0 ? "none" : "" }}>
                            <i className="backward icon"></i>
                            First
                    </button>
                    </div>
                    <div className="right aligned column">
                        <button className="ui right floated right labeled icon button" onClick={this.props.paginate.last} style={{ display: ((this.props.index + 1) * this.props.size) >= this.props.unpagedLength ? "none" : "" }}>
                            <i className="forward icon"></i>
                            Last
                    </button>
                    </div>
                </div>
            </div>
        );
    }
}