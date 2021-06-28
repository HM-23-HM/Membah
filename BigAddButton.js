import React, { useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, TextInput, Alert } from 'react-native'
import { connect } from 'react-redux'
import { addRootFolderVertex, addTaskVertex, addSubFolderVertex } from './actions'



const mapStateToProps = (state) => ({
    rootFolders: state.updateStateReducer.rootFolders,
    children: state.updateStateReducer.childrenOfRootAndSubFolders,
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


    const { rootFolders, children, screen, Title, deleteButtonsVisible } = props
    // const { Title } = props.route.params

    const blankRootFolder = {
        Type: 'rootFolder',
        Parent: 'Root',
        Title: ''
    }

    const blankTask = {
        Type: 'Task',
        Parent: Title,
        Title: '',
        Note: ''
    }

    const blankSubFolder = {
        Type: 'subFolder',
        Parent: Title,
        Title: ''
    }

    const addRootFolderVertexNow = () => {
        if (newRootFolder.Title == ''){
            Alert.alert("Title of new folder is blank")
        } else {
            console.log("New root folder is ", newRootFolder)
            props.dispatchAddRootFolderVertex(newRootFolder)
            console.log("Root Folders ", rootFolders)
            setNewRootFolder(blankRootFolder)
        }
    }

    const addSubFolderVertexNow = () => {
        if (newSubFolder.Title == ''){
            Alert.alert("Title of new folder is blank")
        } else {
            console.log("New sub folder is ", newSubFolder)
            props.dispatchAddSubFolderVertex(newSubFolder)
            setNewSubFolder(blankSubFolder)
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

        if (newTaskVertex.Title == "" || newTaskVertex.Title == undefined) {
            Alert.alert("Title is blank")
        } else {
        console.log("New Title is ", taskTitle)
        console.log("New Note is", taskNote)
        console.log("New Task is ", newTaskVertex)
        props.dispatchAddTaskVertex(newTaskVertex)

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
                                                    Title: text  
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
                
                { deleteButtonsVisible ? 
                              
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
                : <TouchableOpacity>
                    <View style={styles.doneButton}>
                        <Text>Done</Text>
                    </View>
                </TouchableOpacity>
            }
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
        borderWidth: 1,
        zIndex: 1,
        backgroundColor: '#fff'

    },
    doneButton: {
        fontSize: 30,
    },
    addTaskOrFolderButtons: {        
    },
    addOptionsText: {
        alignSelf: 'center',
        margin: 15,
        borderWidth: 1,
        padding: 5,
        borderRadius: 5
    },
    addButton: {
        height: 100,
        width: 100,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderRadius: 50,
        backgroundColor: '#f54b42',
        margin: 16
    },

    plusSign: {
        fontWeight: 'bold',
        fontSize: 50,
        color: '#fff'
    },
    addFolder: {
        justifyContent: 'center',
        
    },
    greenButton: {
        backgroundColor: '#97f788'
    },
    folderAndTaskInput: {
        fontSize: 16,
        margin: 10
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