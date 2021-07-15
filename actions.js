export const ADD_ROOT_FOLDER = 'ADD_ROOT_FOLDER'
export const ADD_SUB_FOLDER = 'ADD_SUB_FOLDER'
export const ADD_TASK_VERTEX = 'ADD_TASK_VERTEX'
export const DELETE_ITEM = 'DELETE_ITEM'
export const TOGGLE_DELETE = 'TOGGLE_DELETE'

export function addRootFolderVertex(folder) {
    return {
        type: ADD_ROOT_FOLDER,
        folder
        }
    }

export function addTaskVertex(task){
    return {
        type: ADD_TASK_VERTEX,
        task
    }
}

export function addSubFolderVertex(folder){
    return {
        type: ADD_SUB_FOLDER,
        folder
    }
}

export function deleteItem(item) {
    return {
        type: DELETE_ITEM,
        item
    }
}

export function toggleDeleteVisibility() {
    return {
        type: TOGGLE_DELETE,
    }
}


