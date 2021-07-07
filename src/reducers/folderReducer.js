import { State } from 'react-native-gesture-handler'
import { ADD_ROOT_FOLDER, ADD_TASK_VERTEX } from '../../actions.js'
import { ADD_SUB_FOLDER, DELETE_ITEM, TOGGLE_DELETE } from '../../actions.js'
import { ModifiedGraph }  from '../../Graph.js'
import _ from 'lodash'

let vertices = [
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
let rootFolderVertices = initialGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)

const initialState = {
    delButtonVisible : false,
    rootFolders : rootFolderVertices,
    childrenOfRootAndSubFolders : []
}

let subs = initialGraph.returnVerticesWithChildren()
initialState.childrenOfRootAndSubFolders = subs


export const updateStateReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_ROOT_FOLDER: {
   
            initialGraph.addFolderVertex(action.folder)
            initialGraph.addEdge(rootFolderVertex,action.folder)

            let newGraph = _.cloneDeep(initialGraph)
            let newState = _.cloneDeep(state)

            let newRootFolderVertices = newGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)
            newState.rootFolders = newRootFolderVertices

            // console.log("@ADD_ROOT_FOLDER : New State is ", newState)

            return newState 
        }   
            
        case ADD_TASK_VERTEX: {

            initialGraph.addTaskVertex(action.task)
            initialGraph.addEdgeWithoutDirectParentReference(action.task)

            let subs = initialGraph.returnVerticesWithChildren()
            let newState = {...state}

            newState.childrenOfRootAndSubFolders = subs

            return newState
        }

        case ADD_SUB_FOLDER: {

            initialGraph.addFolderVertex(action.folder)
            initialGraph.addEdgeWithoutDirectParentReference(action.folder)
            let subs = initialGraph.returnVerticesWithChildren()
            let newState = {...state}
            newState.childrenOfRootAndSubFolders = subs

            return newState
        }

        case DELETE_ITEM: {

            let newState = _.cloneDeep(state)
            let newGraph = _.cloneDeep(initialGraph)

            let newRootFolderVertex = newGraph.findParentVertex('Root')

            console.log("@DELETE_ITEM : New Graph is ", newGraph)
            console.log('@DELETE_ITEM : Root Folder Vertex is ', newRootFolderVertex)
            console.log('@DELETE_ITEM : Children Vertices before ', newGraph.getChildrenVerticesOfSelectedVertex(newRootFolderVertex))

            // console.log("Action.item is ", action.item)

            newGraph.checkIfParentIsRoot(action.item,newRootFolderVertex)
            newGraph.deleteFolderVertex(action.item)

            console.log('@DELETE_ITEM : Children Vertices after ', newGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex))

            let newRootFolderVertices = newGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)
            let newSubs = newGraph.returnVerticesWithChildren()
            newState.rootFolders = newRootFolderVertices
            newState.childrenOfRootAndSubFolders = newSubs

            // console.log("@DELETE_ITEM : New state is ", newState)

            return newState
        }

        case TOGGLE_DELETE: {

            let newState = _.cloneDeep(state)
            newState.delButtonVisible = !newState.delButtonVisible

            console.log("@TOGGLE_DELETE : New state is ", newState)

            return newState
        }
    
     default:
            return state
            }
}

