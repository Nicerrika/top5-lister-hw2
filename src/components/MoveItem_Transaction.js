import jsTPS_Transaction from "./jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, initOld, initNew) {
        super();
        this.model = initModel;
        this.oldItemIndex = initOld;
        this.newItemIndex = initNew;
    }

    doTransaction() {
        console.log(this.oldItemIndex);
        console.log(this.newItemIndex);
        this.model.handle_DragDrop(this.oldItemIndex, this.newItemIndex);
    }
    
    undoTransaction() {
        console.log(this.newItemIndex);
        console.log(this.oldItemIndex);
        this.model.handle_DragDrop(this.newItemIndex, this.oldItemIndex);
    }
}