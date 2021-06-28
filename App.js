import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, Button, TouchableOpacity } from 'react-native'

import rootReducer from './src/reducers'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import HomeScreen from './homeScreen'
import TaskScreen from './TaskScreen'
import DetailScreen from './Details'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const store = createStore(rootReducer)

const Stack = createStackNavigator()

export default App = () => {

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            />
          <Stack.Screen
            name="Tasks"
            component={TaskScreen}
          />
          <Stack.Screen
            name="Details"
            component={DetailScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )

}



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

  folderText: {
    color: '#000',
    
  }
});
