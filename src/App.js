import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';
import jsTPS from './components/jsTPS.js';
import ChangeItem_Transaction from './components/ChangeItem_Transaction.js';
import MoveItem_Transaction from './components/MoveItem_Transaction.js';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();
        this.tps = new jsTPS();
        
        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();
        // SETUP THE INITIAL STATE
        this.state = {
            currentList : null,
            sessionData : loadedSessionData,
            listKeyPairMarkedForDeletion : null,
            prevIndex:-1,
            removeID:null,
            stack:[]//undo and redo stack
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        if (document.getElementById("add-list-button").classList!="top5-button-disabled"){
            // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
            let newKey = this.state.sessionData.nextKey;
            let newName = "Untitled" + newKey;

            // MAKE THE NEW LIST
            let newList = {
                key: newKey,
                name: newName,
                items: ["?", "?", "?", "?", "?"]
            };

            // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
            // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
            let newKeyNamePair = { "key": newKey, "name": newName };
            let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
            this.sortKeyNamePairsByName(updatedPairs);

            // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
            // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
            // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
            // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
            // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
            // SHOULD BE DONE VIA ITS CALLBACK
            this.setState(prevState => ({
                currentList: newList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey + 1,
                    counter: prevState.sessionData.counter + 1,
                    keyNamePairs: updatedPairs
                }
            }), () => {
                // PUTTING THIS NEW LIST IN PERMANENT STORAGE
                // IS AN AFTER EFFECT
                this.db.mutationCreateList(newList);
            });
            document.getElementById("close-button").classList.replace("top5-button-disabled","top5-button");
        }
        document.getElementById("add-list-button").classList.replace("top5-button-disabled","top5-button");
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }
    renameItem = (index,NewName) => {
            let currentList = this.state.currentList;
            currentList.items[index]=NewName
            let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];

            this.setState(prevState => ({
                currentList: prevState.currentList,
                sessionData: {
                    nextKey: prevState.sessionData.nextKey,
                    counter: prevState.sessionData.counter,
                    keyNamePairs: newKeyNamePairs
                }
            }),() => {
                // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
                // THE TRANSACTION STACK IS CLEARED
                let list = this.db.queryGetList(currentList.key);
                list.items[index] = NewName;
                this.db.mutationUpdateList(list);
                this.db.mutationUpdateSessionData(this.state.sessionData);
            })
    }
    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
        this.tps.clearAllTransactions();
        document.getElementById("close-button").classList.replace("top5-button-disabled","top5-button");
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion : prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData
        }), () => {
            // ANY AFTER EFFECTS?
        });
        this.tps.clearAllTransactions();
        this.UpdateDisableControl();
        document.getElementById("close-button").classList.replace("top5-button","top5-button-disabled");
    }
    deleteList = (DeletionLinkPair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL
        this.setState(prevState =>({
            listKeyPairMarkedForDeletion : DeletionLinkPair
        }))
        this.showDeleteListModal();
        this.UpdateDisableControl();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }
    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    RemoveList = () =>{
        this.db.queryRemoveThisList(this.state.removeID);
        let NewkeyNamePairs = [...this.state.sessionData.keyNamePairs];
        this.state.sessionData.keyNamePairs.map((all,index)=>{
            if(all.key===this.state.listKeyPairMarkedForDeletion.key){
                NewkeyNamePairs.splice(index,1);
                if (this.state.currentList!==null && this.state.currentList.key===all.key){
                    this.closeCurrentList();;
                }
            }
            return NewkeyNamePairs;
        })
        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: NewkeyNamePairs
            }
        }),() => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            this.db.mutationUpdateSessionData(this.state.sessionData);
        })
        this.hideDeleteListModal();
        this.UpdateDisableControl();
    }

    handle_DragDrop = (PreIndex,NowIndex) =>{
        this.state.currentList.items.splice(NowIndex, 0, this.state.currentList.items.splice(PreIndex, 1)[0])
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
                }
            }),() => {
                // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
                // THE TRANSACTION STACK IS CLEARED
                let list = this.db.queryGetList(this.state.currentList.key);
                list.items.splice(NowIndex, 0, list.items.splice(PreIndex, 1)[0]);
                this.db.mutationUpdateList(list);
                this.db.mutationUpdateSessionData(this.state.sessionData);
            })
        document.getElementById("undo-button").classList.replace("top5-button-disabled","top5-button");
    }

    prevIndexUpdate =(NewIndex)=>{
        this.setState({
            prevIndex: NewIndex
            })
    }

    UpdateRemoveListId =(NewID)=>{
        this.setState({
            removeID:NewID
            })
    }

    //These function below is to do undo and redo
    UndoItem = () =>{
        if(this.tps.hasTransactionToUndo()){
            this.tps.undoTransaction();
        }
        this.UpdateDisableControl()
    }

    RedoItem = () =>{
        if(this.tps.hasTransactionToRedo()){
            this.tps.doTransaction();
        }
        this.UpdateDisableControl()
    }

    AddMoveTransaction=(prev_index,NewIndex)=>{
        let transaction = new MoveItem_Transaction(this,prev_index,NewIndex);
        this.tps.addTransaction(transaction);
    }

    addChangeItemTransaction = (id, newText) => {
        let oldText = this.state.currentList.items[id];
        let transaction = new ChangeItem_Transaction(this, id, oldText, newText);
        this.tps.addTransaction(transaction);
    }

    //Disable control
    UpdateDisableControl=()=>{
        console.log("redo: "+this.tps.getRedoSize());
        console.log("undo: "+this.tps.getUndoSize());
        if(this.tps.hasTransactionToRedo()){
            console.log("Can redo");
            document.getElementById("redo-button").classList.replace("top5-button-disabled","top5-button");
        }
        else{
            console.log("Can not redo");
            document.getElementById("redo-button").classList.replace("top5-button","top5-button-disabled");
        }

        if(this.tps.hasTransactionToUndo()){
            console.log("Can undo");
            document.getElementById("undo-button").classList.replace("top5-button-disabled","top5-button");
        }
        else{
            console.log("Can not undo");
            document.getElementById("undo-button").classList.replace("top5-button","top5-button-disabled");
        }
    }

    render() {
        return (
            <div id="app-root">
                <Banner 
                    title='Top 5 Lister'
                    closeCallback={this.closeCurrentList} 
                    UndoItemCallback={this.UndoItem}
                    RedoItemCallback={this.RedoItem}/>
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    RemoveListIdCallback={this.UpdateRemoveListId}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                    disableAddCallback={this.disableAddListButton}
                />
                <Workspace
                    currentList={this.state.currentList} 
                    prevIndex={this.state.prevIndex}
                    renameItemCallback={this.addChangeItemTransaction}
                    handle_DragDrop_Callback={this.AddMoveTransaction}
                    prevIndexUpdate={this.prevIndexUpdate}/>
                <Statusbar 
                    currentList={this.state.currentList} />
                <DeleteModal
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    RemoveListCallback={this.RemoveList}
                />
            </div>
        );
    }
}

export default App;
