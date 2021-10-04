import React from "react";
import ItemCard from "./ItemCard";

export default class Workspace extends React.Component {
    render() {
        const {prevIndexUpdate,currentList,renameItemCallback,handle_DragDrop_Callback,prevIndex} = this.props;
        if(currentList !== null){
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id="edit-items">
                            {
                                currentList.items.map((item,index)=>
                                <ItemCard
                                    item={item}
                                    index={index}
                                    currentList={currentList}
                                    renameItemCallback={renameItemCallback}
                                    prevIndex={prevIndex}
                                    handle_DragDrop_Callback={handle_DragDrop_Callback}
                                    prevIndexUpdateCallback={prevIndexUpdate}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )
        }
        else{
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}