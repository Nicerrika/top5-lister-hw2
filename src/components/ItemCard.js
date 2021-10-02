import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            text: this.props.item,
            editActive: false,
        }
    }
    handleClick = (event) => {
        if (event.detail === 1) {
            this.handleLoadList(event);
        }
        else if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleLoadList = (event) => {
        let listKey = event.target.id;
        if (listKey.startsWith("Item-card-text-")) {
            listKey = listKey.substring("Item-card-text-".length);
        }
        this.props.loadListCallback(listKey);
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
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
        console.log("LOL");
        this.props.renameItemCallback(this.props.item);
        this.handleToggleEdit();
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
                <div
                    id={"Item-" + index}
                    key={index}
                    onClick={this.handleClick}
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