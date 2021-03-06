import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet, TextInput, Pressable, Alert, Button } from 'react-native'
import { connect } from 'react-redux'
import { deleteItem, toggleDeleteVisibility } from './actions'
import uuid from 'react-native-uuid'

import BigAddButton from './BigAddButton'
import BigDoneButton from './BigDoneButton'

import { background, menuBackground, menuBorder, menuTextColor } from './src/colors'

const blankRootFolder = {
    Type: 'rootFolder',
    Parent: 'Root',
    Title: ''
}

const mapStateToProps = (state) => ({
    rootFolders: state.updateStateReducer.rootFolders,
    children: state.updateStateReducer.childrenOfRootAndSubFolders,
    state_delButtonVis: state.updateStateReducer.delButtonVisible
})

const mapDispatchToProps = {
    dispatchDeleteItem: (item) => deleteItem(item),
    dispatchDelButtonVis: () => toggleDeleteVisibility()
}

const eventFromNow = {
    summary: 'Poc Dev From Now',
    time: 480,
};

const HomeScreen = (props) => {

    var realDeleteButtonVisibility = !deleteButtonsAreVisible

    const { rootFolders, children, state_delButtonVis } = props

    const [deleteButtonsAreVisible, changeDeleteButtonVisibility] = useState(state_delButtonVis)


    const toggleDeleteButtonVisibility = () => {
        props.dispatchDelButtonVis()
        changeDeleteButtonVisibility(state_delButtonVis => !state_delButtonVis)
        console.log("@homeScreen : Visibility should now be after toggle ", state_delButtonVis)
        realDeleteButtonVisibility = !deleteButtonsAreVisible
    }

    const deleteItemNow = (item) => {
        props.dispatchDeleteItem(item)
    }


        return (
            <View style={styles.container}>
                <ScrollView>
                    {rootFolders.map((folder) => (
                        <View 
                            style={styles.folderContainer}
                            key={uuid.v4()} 
                        >
                            <Pressable 
                                onLongPress={()=> toggleDeleteButtonVisibility()}
                                delayLongPress={2000}
                                onPress={() => {
                                    if(!deleteButtonsAreVisible){
                                props.navigation.navigate('Tasks', {...children.find((element) => element.Title == folder.Title)})
                                } else {

                                }}
                            }
                            >
                                    <View style={styles.folder}>
                                        <Text style={styles.folderText}>{folder.Title}</Text>
                                    </View>
                            </Pressable>
                            {deleteButtonsAreVisible &&
                                <Pressable
                                    onPress={() => deleteItemNow(folder)}
                                    style={{justifyContent: 'center'}}>
                                    <View style={styles.deleteButton}>
                                        <Text style={styles.deleteSign} >x</Text>
                                    </View>
                                </Pressable>
                            }       
                        </View>
                    ))}
                </ScrollView>               
                {!state_delButtonVis && <BigAddButton 
                    screen="HomeScreen"
                    deleteButtonsVisible={realDeleteButtonVisibility}
                />}
                {state_delButtonVis && <BigDoneButton/>}
                
            </View>
        ) 
}


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    folder: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 75,
      width: 250,
      borderWidth: 2,
      borderRadius: 5,
      backgroundColor: menuBackground,
      borderColor: menuBorder,
      margin: 20,
    },
  
    folderText: {
      color: menuTextColor,
      fontSize: 20
    },

    folderContainer: {
        flexDirection: 'row'
    },
    deleteButton: {
        height: 30,
        width: 30,
        alignSelf: 'center',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: '#f54e42'
    },
    deleteSign: { 
        alignSelf: 'center', 
        justifyContent: 'center',
        color: '#fff'
    }
    
  });