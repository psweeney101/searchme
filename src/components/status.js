import React from "react";

class Status extends React.Component {
    render() {
        return (
            <div style={{ width: "100%", height: "45px", maxHeight: "45px", alignItems: "center", textAlign: "center", display: "flex" }} >
                <div style={{ alignItems: "center", display: "flex", height: "100", width: "100%", margin: "auto", textAlign: "center" }}>
                    <div className="ui horizontal statistic" style={{ width: "100%" }}>
                        <div className="label" style={{ width: "100%" }}>
                            <center style={{ width: "100%" }}>{this.props.loaded !== "" ? `Loading ${this.props.loaded} messages...` : `SHOWING ${this.props.index * this.props.size + 1}  - ${Math.min((this.props.index + 1) * this.props.size + 1, this.props.unpagedLength)} OF ${this.props.unpagedLength} MESSAGES`}</center>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Status;