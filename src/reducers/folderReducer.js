import { State } from 'react-native-gesture-handler'
import { ADD_ROOT_FOLDER, ADD_TASK_VERTEX } from 'C:/Users/Hodeem/Documents/Mobile and Web Development Projects/react-native/Membah/actions.js'
import { ADD_SUB_FOLDER, DELETE_ITEM, TOGGLE_DELETE } from 'C:/Users/Hodeem/Documents/Mobile and Web Development Projects/react-native/Membah/actions.js'
import { ModifiedGraph }  from 'C:/Users/Hodeem/Documents/Mobile and Web Development Projects/react-native/Membah/Graph.js'
// import update from 'immutability-helper'
import _ from 'lodash'

var vertices = [
    {Type: 'Root', Title: 'Root'},

    {Type: 'rootFolder', Parent: 'Root', Title: 'Vehicle'},
    {Type: 'rootFolder', Parent: 'Root', Title: 'Property'},
    {Type: 'rootFolder', Parent: 'Root', Title: 'Business'},

    {Type: 'subFolder', Parent: 'Vehicle', Title: 'Maintenance'},
    {Type: 'subFolder', Parent: 'Property', Title: 'Pool'},

    {Type: 'Task', Parent:'Vehicle', Title: 'Task1'},     
    {Type: 'Task', Parent:'Property', Title: 'Task2'},     
    {Type: 'Task', Parent:'Business', Title: 'Task3'},     
    
]

var initialGraph = new ModifiedGraph(8,vertices)

for (var i = 0; i < vertices.length; i++) {
    var checkTypeOfVertex = vertices[i].Type
    if (checkTypeOfVertex != 'Task') {
        initialGraph.addVertex(vertices[i]);
    } else {
        initialGraph.addTaskVertex(vertices[i])
    }
}

for (var i = 0; i < vertices.length; i++) {
    initialGraph.addEdgeWithoutDirectParentReference(vertices[i]);
}

var rootFolderVertex = initialGraph.findParentVertex('Root')
var rootFolderVertices = initialGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)

const initialState = {
    delButtonVisible : false,
    rootFolders : rootFolderVertices,
    childrenOfRootAndSubFolders : []
}

var subs = initialGraph.returnVerticesWithChildren()
initialState.childrenOfRootAndSubFolders = subs


export const updateStateReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_ROOT_FOLDER: {
   
            initialGraph.addFolderVertex(action.folder)
            initialGraph.addEdge(rootFolderVertex,action.folder)
            const newGraph = _.cloneDeep(initialGraph)
            var newRootFolderVertices = newGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)
            const newState = _.cloneDeep(state)
            newState.rootFolders = newRootFolderVertices

            // console.log("@folderReducer New state is ", newState)
            // console.log("@folderReducer Shallow equality check ", newState === initialState)

            return newState 
        }   
            
        case ADD_TASK_VERTEX: {

            initialGraph.addTaskVertex(action.task)
            initialGraph.addEdgeWithoutDirectParentReference(action.task)
            var subs = initialGraph.returnVerticesWithChildren()
            const newState = {...state}
            newState.childrenOfRootAndSubFolders = subs

            return newState
        }

        case ADD_SUB_FOLDER: {

            initialGraph.addFolderVertex(action.folder)
            initialGraph.addEdgeWithoutDirectParentReference(action.folder)
            subs = initialGraph.returnVerticesWithChildren()
            const newState = {...state}
            newState.childrenOfRootAndSubFolders = subs

            return newState
        }

        case DELETE_ITEM: {

            initialGraph.deleteFolderVertex(action.item)
            var newRootFolderVertices = initialGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)
            var newSubs = initialGraph.returnVerticesWithChildren()
            state = {
                delButtonVisible : true,
                rootFolders : newRootFolderVertices,
                childrenOfRootAndSubFolders : newSubs
            }

            return state
        }

        case TOGGLE_DELETE: {

            var newState = {
                delButtonVisible : !state.delButtonVisible,
                rootFolders : rootFolderVertices,
                childrenOfRootAndSubFolders : subs
            }

            return newState
        }
    
     default:
            return state
            }
}

