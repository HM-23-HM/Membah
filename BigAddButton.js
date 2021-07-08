import React, { useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, TextInput, Alert } from 'react-native'
import { connect } from 'react-redux'
import { addRootFolderVertex, addTaskVertex, addSubFolderVertex } from './actions'

import { 
    addButtonColor, 
    addButonTextColor, 
    addButtonTextColor,
    addButtonPressedColor,
    folderAndTaskInputBackgroundColor,
    folderAndTaskInputTextColor } from './src/colors'

const mapStateToProps = (state) => ({
    rootFolders: state.updateStateReducer.rootFolders,
    children: state.updateStateReducer.childrenOfRootAndSubFolders,
    state_delButtonVis: state.updateStateReducer.deleteButtonsVisible
})

const mapDispatchToProps = {
    dispatchAddRootFolderVertex: (folder) => addRootFolderVertex(folder),
    dispatchAddTaskVertex: (task) => addTaskVertex(task),
    dispatchAddSubFolderVertex: (folder) => addSubFolderVertex(folder)
}

var taskTitle;
var taskNote;

const BigAddButton = (props) => {

    const [newRootFolder, setNewRootFolder] = useState(blankRootFolder)
    const [newSubFolder, setNewSubFolder] = useState(blankSubFolder)
    const [newTaskVertex, setNewTaskVertex] = useState(blankTask)

    const [addFolderTaskVisibility, changeVisibility] = useState(false)
    const [FolderInputVisibility, changeFolderInputVisibility] = useState(false)
    const [TaskInputVisibility, changeTaskInputVisibility] = useState(false)


    const { rootFolders, children, screen, Title, state_delButtonVis } = props

    const blankRootFolder = {
        Type: 'rootFolder',
        Parent: 'Root',
        Title: ''
    }

    const blankTask = {
        Type: 'Task',
        Parent: Title,
        Title: '',
        Note: '',
        isComplete: false
    }

    const blankSubFolder = {
        Type: 'subFolder',
        Parent: Title,
        Title: '',
        isComplete: false
    }

    const addRootFolderVertexNow = () => {
        if (newRootFolder.Title == ''){
            Alert.alert("Title of new folder is blank")
        } else {
            props.dispatchAddRootFolderVertex(newRootFolder)
            setNewRootFolder(blankRootFolder)
            changeFolderInputVisibility(false)
        }
    }

    const addSubFolderVertexNow = () => {
        if (newSubFolder == undefined || newSubFolder.Title == '' || newSubFolder.Title == undefined){
            Alert.alert("Title of new folder is blank")
        } else {
            console.log("New sub folder is ", newSubFolder)
            props.dispatchAddSubFolderVertex(newSubFolder)
            setNewSubFolder(blankSubFolder)
            changeFolderInputVisibility()
        }
    }

    const addTaskNow = () => {
        setNewTaskVertex({
            Type: 'Task',
            Parent: Title,
            Title: taskTitle,
            Note: taskNote
        }) 
        console.log("New Task Vertex is ", newTaskVertex)

        if (newTaskVertex == undefined || newTaskVertex.Title == "" || newTaskVertex.Title == undefined) {
            Alert.alert("Title is blank")
        } else {
        console.log("New Title is ", taskTitle)
        console.log("New Note is", taskNote)
        props.dispatchAddTaskVertex(newTaskVertex)
        changeTaskInputVisibility()

        }
    }

    const toggleVisibilityOfFolderTask = () => {
        changeVisibility(!addFolderTaskVisibility)

    }

    const toggleVisibilityOfFolderInputs = () => {
        changeFolderInputVisibility(!FolderInputVisibility)
        changeVisibility(!addFolderTaskVisibility)
    }

    const toggleVisibilityOfTaskInputs = () => {
        changeTaskInputVisibility(!TaskInputVisibility)
        changeVisibility(!addFolderTaskVisibility)
    }


    return (
        <View style={styles.container}>
            <View>
                { FolderInputVisibility && 
                        <View style={styles.addFolder}>
                            <TextInput
                                    style={styles.folderAndTaskInput}
                                    placeholder='Enter new folder name'
                                    onChangeText = {(text) => {
                                        if (screen == 'HomeScreen'){                                    
                                            setNewRootFolder({
                                            Type: 'rootFolder',
                                            Parent: 'Root',
                                            Title: text
                                            })
                                        } else {
                                            setNewSubFolder({
                                                    Type: 'subFolder',
                                                    Parent: Title,
                                                    Title: text,
                                                    isComplete: false  
                                                })
                                        }    
                                    }
                                }
                            />
                        </View>
                }
            </View>
            <View>
            { TaskInputVisibility && 
                    <View >
                        <TextInput
                            // value={newTitle}
                            placeholder="Enter title of task here"
                            maxLength={50}
                            style={styles.entryField}
                            onChangeText={(text) => taskTitle = text}
                        />
                        <TextInput
                            // value={newNote}
                            placeholder="Enter note here"
                            multiline={true}
                            maxLength={280}
                            style={styles.entryField}
                            onChangeText={(text) => taskNote = text}
                        /> 
                    </View> }
            </View>
            <View style ={styles.addTaskOrFolderButtons}>
                { addFolderTaskVisibility &&
                    <View> 
                        { screen != "HomeScreen" && 
                            <View>
                                <TouchableOpacity 
                                style={styles.addOptionsText}
                                onPress={ () => toggleVisibilityOfTaskInputs()}>
                                        <Text>Add Task</Text>
                                </TouchableOpacity> 
                            </View>
                        }
                    
                        <TouchableOpacity 
                            style={styles.addOptionsText}
                            onPress = {() => toggleVisibilityOfFolderInputs()  }>
                                <Text>Add Folder</Text>
                        </TouchableOpacity>
                    </View> 
                }
                                              
                    <TouchableOpacity onPress={() => {
                                if (!FolderInputVisibility && !TaskInputVisibility){
                                toggleVisibilityOfFolderTask()}
                                if (FolderInputVisibility){
                                    if (screen == 'HomeScreen'){
                                    addRootFolderVertexNow()
                                    } else {
                                        addSubFolderVertexNow()
                                    }
                                }
                                if (TaskInputVisibility){
                                    addTaskNow()
                                }                        

                            }}>
                            <View style={[styles.addButton, (FolderInputVisibility || TaskInputVisibility) && styles.greenButton,]}>
                                    <Text style={styles.plusSign}>+</Text>
                            </View>
                        </TouchableOpacity>
                    

            </View>
        </View>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(BigAddButton)

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 10,
        bottom: 10,
        flexDirection: 'row',
        flex: 1,
        zIndex: 1,
        width: '80%',
        // borderWidth: 1,
        height: 120
    },
    doneButton: {
        backgroundColor: '#a84832'
    },
    doneButtonText: {
        fontSize: 30,
        color: '#fff',
        padding: 5
    },
    addTaskOrFolderButtons: {    
        // borderWidth: 1,
        width: '100%'    
    },
    addOptionsText: {
        alignSelf: 'center',
        margin: 15,
        borderWidth: 1,
        padding: 5,
        borderRadius: 5
    },
    addButtonContainer: {
        borderWidth: 1
    },
    addButton: {
        height: 100,
        width: 100,
        position: 'absolute',
        top: 8,
        // bottom: 5,
        right: 15,
        // alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: addButtonColor,
        // margin: 16
    },

    plusSign: {
        fontWeight: 'bold',
        fontSize: 50,
        color: addButtonTextColor,
    },
    addFolder: {
        justifyContent: 'center',
        top: 35,
        // alignSelf: 'center'
        
    },
    greenButton: {
        backgroundColor: addButtonPressedColor
    },
    folderAndTaskInput: {
        fontSize: 16,
        margin: 10,
        padding: 8,
        backgroundColor: folderAndTaskInputBackgroundColor,
        borderRadius: 10,
        color: folderAndTaskInputBackgroundColor
    },
    addNewTask: {
        margin: 20,
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        width: 250
    },
    entryField: {
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#d3d3d3',
        padding: 5,
        margin: 10,
        width: 180
    },
})