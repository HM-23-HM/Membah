import React, { useState } from 'react'
import { Text, View, ScrollView, TouchableOpacity, StyleSheet, TextInput, Button, Alert } from 'react-native'
import uuid from 'react-native-uuid'
import { connect } from 'react-redux'
import { addTaskVertex } from './actions'

import BigAddButton from './BigAddButton'



const mapStateToProps = (state) => ({
    children: state.updateStateReducer.childrenOfRootAndSubFolders,
})

const mapDispatchToProps = {
    dispatchAddTaskVertex: (task) => addTaskVertex(task)
}

var taskTitle;
var taskNote;

const TaskScreen = (props) => {

    const { Title, Children } = props.route.params
    const { navigation, children } = props

    // const getRelevantChildrenArray = (nameOfFolder) => {

    //     var relevantChildObject = children.find((element) => element.Title == nameOfFolder )
    //     var relevantChildren = relevantChildObject.Children

    //     return relevantChildren

    // }

    const blankTask = {
        Type: 'Task',
        Parent: Title,
        Title: '',
        Note: ''
    }
  

    const [newTaskVertex, setNewTaskVertex] = useState(blankTask)

    const addTaskNow = () => {
        setNewTaskVertex({
            Type: 'Task',
            Parent: Title,
            Title: taskTitle,
            Note: taskNote
        }) 

        if (newTaskVertex.Title == "" || newTaskVertex.Title == undefined) {
            Alert.alert("Title is blank")
        } else {
        console.log("New Title is ", taskTitle)
        console.log("New Note is", taskNote)
        console.log("New Task is ", newTaskVertex)
        props.dispatchAddTaskVertex(newTaskVertex)

        }
    }

        return (
            <View style={styles.container}> 
                <View style={styles.header}> 
                    <Text>{Title}</Text>
                </View>    
                <ScrollView>
                    { Children ?
                     Children.map((task) => (
                        <View key={uuid.v4()}>
                            <TouchableOpacity 
                                onPress={task.Type == 'Task' ? 
                            () => navigation.navigate('Details', {Title: task.Title, Note: task.Note}) : 
                            () => navigation.navigate('Tasks',{...children.find((element) => element.Title == task.Title)})}
                            >
                                <View                         
                        style={[task.Type == 'Task' ? styles.task : styles.folder ]}
                        >
                                <Text style={styles.folderText}>{task.Title}</Text>
                                </View>
                            </TouchableOpacity>
                            <Text>Number of Children is {Children.length}</Text>
                        </View>
                    )) : 
                    <View>
                        <Text>Add your first task or folder</Text>
                    </View>
                    }
                </ScrollView>
               
                <BigAddButton 
                    Title={Title}
                />
                
            </View>
        )
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    folder: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 75,
      width: 200,
      borderWidth: 2,
      borderRadius: 5,
      backgroundColor: '#add8e6',
      margin: 20
    },

    task: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 75,
      width: 200,
      borderWidth: 2,
      borderRadius: 5,
      backgroundColor: '#facfed',
      margin: 20
    },
  
    folderText: {
      color: '#000',
      
    },

    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 75,
        width: 200,
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: '#FFE5B4',
        margin: 20
    },

    
  });