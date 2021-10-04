import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { title,closeCallback,UndoItemCallback,RedoItemCallback} = this.props;
        return (
            <div id="top5-banner">
                {title}
                <EditToolbar 
                    CloseCurrentList={closeCallback}
                    UndoItemCallback={UndoItemCallback}
                    RedoItemCallback={RedoItemCallback}/>
            </div>
        );
    }
}