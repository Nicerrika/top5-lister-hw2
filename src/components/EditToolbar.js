import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const {CloseCurrentList,UndoItemCallback,RedoItemCallback}=this.props
        return (
            <div id="edit-toolbar">
                <div 
                    id='undo-button' 
                    className="top5-button"
                    onClick={UndoItemCallback}>
                        &#x21B6;
                </div>
                <div
                    id='redo-button'
                    className="top5-button"
                    onClick={RedoItemCallback}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    className="top5-button"
                    onClick={CloseCurrentList}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}