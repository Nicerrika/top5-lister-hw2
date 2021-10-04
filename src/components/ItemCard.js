import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.item,
            editActive: false,
            prevIndex: this.props.index,
        }
    }
    handleClick = (event) => {
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive,
            text: this.props.item
        });
    }
    handleUpdate = (event) => {
        this.setState({ text: event.target.value });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let text=this.state.text;
        this.props.renameItemCallback(this.props.index,text);
        this.handleToggleEdit();
    }

    handlestart = (event) =>{
        this.props.prevIndexUpdateCallback(this.props.index)
    }
    handledraging = (event) =>{
        event.preventDefault();
        document.getElementById("Item-" + this.props.index).style.background="#669966";
        document.getElementById("Item-card-text-" + this.props.index).style.background="#669966";
    }
    handledrop = (event) =>{
        this.props.handle_DragDrop_Callback(this.props.prevIndex,this.props.index);
        document.getElementById("Item-" + this.props.index).style.background="#e1e4cd";
        document.getElementById("Item-card-text-" + this.props.index).style.background="#e1e4cd";
    }
    DragChangeColor = (event) =>{
        document.getElementById("Item-" + this.props.index).style.background="#e1e4cd";
        document.getElementById("Item-card-text-" + this.props.index).style.background="#e1e4cd";
    }
    render() {
        const { item,index } = this.props;

        if (this.state.editActive) {
            return (
                <input
                    id={"Item-" + item}
                    className='Item-card'
                    type='text'
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={item}
                />)
        }
        else {
            return (
                <div draggable="true"
                    id={"Item-" + index}
                    key={index}
                    onClick={this.handleClick}
                    onDragStart={this.handlestart}
                    onDragOver={this.handledraging}
                    onDrop={this.handledrop}
                    onDragLeave={this.DragChangeColor}
                    className={'top5-item'}>
                    <span
                        id={"Item-card-text-" + index}
                        key={index}
                        className="top5-item">
                        {item}
                    </span>
                </div>
            );
        }
    }
}