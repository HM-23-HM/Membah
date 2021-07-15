import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  Pressable
} from "react-native";

import uuid from "react-native-uuid";
import { connect } from "react-redux";
import { addTaskVertex } from "./actions";
import { deleteItem, toggleDeleteVisibility } from './actions'

import BigAddButton from "./BigAddButton";

import BouncyCheckbox from "react-native-bouncy-checkbox";

import { 
  menuBackground,
  menuBorder,
  menuTextColor,
  background,
  sectionHeaderBackgroundColor, 
  sectionHeaderBorderColor, 
  sectionHeaderTextColor,
  toggleCompleteButtonBackground,
  toggleCompleteTextColor } from './src/colors'
  


const mapStateToProps = (state, ownProps) => {
    const { Title } = ownProps.route.params
    return {    
        children: state.updateStateReducer.childrenOfRootAndSubFolders.find((element) => element.Title == Title).Children,
        state_delButtonVis: state.updateStateReducer.delButtonVisible
      }
}

const mapDispatchToProps = {
  dispatchAddTaskVertex: (task) => addTaskVertex(task),
  dispatchDelButtonVis: () => toggleDeleteVisibility(),
  dispatchDeleteItem: (item) => deleteItem(item),
};


const TaskScreen = (props) => {
  const { Title } = props.route.params;
  const { navigation, children, state_delButtonVis } = props;

  const [deleteButtonsAreVisible, changeDeleteButtonVisibility] = useState(state_delButtonVis)
  const [areTasksCompleted, setAreTasksCompleted] = useState(false)

  const toggleDeleteButtonVisibility = () => {
    props.dispatchDelButtonVis()
    changeDeleteButtonVisibility(state_delButtonVis => !state_delButtonVis)
    console.log("@TaskScreen : Visibility should now be after toggle ", state_delButtonVis)
}

  const deleteItemNow = (item) => {
    props.dispatchDeleteItem(item)
}


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{Title}</Text>
      </View>
      <View style={styles.toggleCompleteContainer}>
        <Pressable 
            style={styles.toggleCompleteButton} 
            onPress={() => setAreTasksCompleted(!areTasksCompleted)}
            disabled={!areTasksCompleted}
        >
            <Text style={styles.toggleCompleteText}>Not Completed</Text>
        </Pressable>
        <Pressable 
            style={styles.toggleCompleteButton}
            onPress={() => setAreTasksCompleted(!areTasksCompleted)}
            disabled={areTasksCompleted}
        >
            <Text style={styles.toggleCompleteText}>Completed</Text>
        </Pressable>
      </View>
      <ScrollView>
        {children ? (
          children.filter((element) => element.isComplete == areTasksCompleted).map((task) => (
            <View 
                key={uuid.v4()}
                style={styles.folderContainer}
                >
              <Pressable
                onLongPress={() => toggleDeleteButtonVisibility()}
                delayLongPress={2000}
                onPress={
                  task.Type == "Task"
                    ? () =>
                        navigation.navigate("Details", {
                          Title: task.Title,
                          Note: task.Note,
                        })
                    : () =>
                        navigation.navigate("Tasks", {
                          ...children.find(
                            (element) => element.Title == task.Title
                          ),
                        })
                }
              >
                <View
                  style={[task.Type == "Task" ? styles.task : styles.folder]}
                >
                    <View style={styles.checkbox}>
                        
                        <BouncyCheckbox 
                            unfillColor = "#fff"
                            size = {50}
                            onPress = {() => {
                                task.isComplete = !task.isComplete
                                console.log("@taskScreen : Task is Complete? ", task.isComplete)}}
                            isChecked={task.isComplete}
                        />
                        
                    </View>
                  <Text style={styles.folderText}>{task.Title}</Text>
                </View>

              </Pressable>

              {deleteButtonsAreVisible &&
                            <Pressable
                                onPress={() => deleteItemNow(task)}
                                // style={{justifyContent: 'center'}}
                                >
                                    <View style={styles.deleteButton}>
                                        <Text style={styles.deleteSign} >x</Text>
                                    </View>
                            </Pressable>
                        } 
              
                
            </View>
          ))
        ) : (
          <View>
            <Text>Add your first task or folder</Text>
          </View>
        )}
      </ScrollView>

      <BigAddButton Title={Title} />
    </View>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(TaskScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: background,
    alignItems: "center",
    justifyContent: "center",
  },
  folder: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 250,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: menuBackground,
    borderColor: menuBorder,
    margin: 20,
  },

  task: {
    justifyContent: "center",
    alignItems: "center",
    height: 100,
    width: 250,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#ffe5dc",
    backgroundColor: "#ffeee7",
    margin: 20,
  },

  folderText: {
    color: menuTextColor,
    fontSize: 16,
  },

  header: {
    justifyContent: "center",
    alignItems: "center",
    height: 75,
    width: "100%",
    borderWidth: 2,
    borderColor: sectionHeaderBorderColor,
    backgroundColor: sectionHeaderBackgroundColor,
  },
  headerText: {
    color: sectionHeaderTextColor,
    fontSize: 40
  },
  checkbox: {
      position: 'absolute',
      right: 3,
      top: 25,
  },
  deleteButton: {
    height: 30,
    width: 30,
    alignSelf: 'center',
    top: 55,
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: '#f54e42',
},
    deleteSign: { 
        alignSelf: 'center', 
        justifyContent: 'center',
        color: '#fff'
    },
    folderContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    toggleCompleteContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: sectionHeaderBorderColor,
        marginBottom: 10,
        width: '100%',
        justifyContent: 'space-evenly'
    },
    toggleCompleteButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: sectionHeaderBorderColor,
        backgroundColor: toggleCompleteButtonBackground,
        width: '50%',
        alignItems: 'center'
    },
    toggleCompleteText: {
      color: toggleCompleteTextColor,
      fontSize: 25
    }
});
