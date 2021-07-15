import React from 'react'
import { View, Text, StyleSheet } from 'react-native'




export default DetailScreen = (props) => {

    const { Title, Note } = props.route.params

    return (
        <View style = {styles.container}>
            <Text style={styles.title}>{Title}</Text>
            <Text>{Note}</Text>
            <Text>Placeholder for reminder</Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
      },
      title: {
        fontWeight: 'bold',
        fontSize: 24,
        margin: 20,
      }
})