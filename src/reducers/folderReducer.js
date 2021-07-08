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

for (let i = 0; i < vertices.length; i++) {
    let checkTypeOfVertex = vertices[i].Type
    if (checkTypeOfVertex != 'Task') {
        initialGraph.addVertex(vertices[i]);
    } else {
        initialGraph.addTaskVertex(vertices[i])
    }
}

for (let i = 0; i < vertices.length; i++) {
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

            let newState = _.cloneDeep(state)

            let newRootFolderVertices = initialGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)
            newState.rootFolders = newRootFolderVertices

            return newState 
        }   
            
        case ADD_TASK_VERTEX: {

            initialGraph.addTaskVertex(action.task)
            initialGraph.addEdgeWithoutDirectParentReference(action.task)

            let subs = initialGraph.returnVerticesWithChildren()
            let newState = _.cloneDeep(state)

            newState.childrenOfRootAndSubFolders = subs

            return newState
        }

        case ADD_SUB_FOLDER: {

            initialGraph.addFolderVertex(action.folder)
            initialGraph.addEdgeWithoutDirectParentReference(action.folder)
            let subs = initialGraph.returnVerticesWithChildren()
            let newState = _.cloneDeep(state)
            newState.childrenOfRootAndSubFolders = subs

            return newState
        }

        case DELETE_ITEM: {

            let newState = _.cloneDeep(state)
            
            initialGraph.deleteFolderVertex(action.item)

            let newRootFolderVertices = initialGraph.getChildrenVerticesOfSelectedVertex(rootFolderVertex)
            let newSubs = initialGraph.returnVerticesWithChildren()
            newState.rootFolders = newRootFolderVertices
            newState.childrenOfRootAndSubFolders = newSubs

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

