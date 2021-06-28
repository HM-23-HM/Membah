class Graph {

    constructor(numVertices) {
        this.numVertices = numVertices;
        this.AdjList = new Map();
    }

    addVertex(vertex) {
        this.AdjList.set(vertex,[]);
    }

    addEdge(source,destination) {
        this.AdjList.get(source).push(destination);
    }

    printGraph() {
        var keys = this.AdjList.keys();

        for (var i of keys) {
            var values = this.AdjList.get(i)
            var arrayOfValues = []

            if (values != undefined){
            
                // console.log("This is values ", values)

                for (var j of values){
                    // console.log("This is J ", j)
                    arrayOfValues.push(j)
                }
            
                console.log("For " + i + " it is " + arrayOfValues)

            } else {
                console.log("For " + JSON.stringify(i) + " there are no values. This is a task")
            }
        }
    }

    breadthFirstSearch(startingNode, elementToFind) {
        console.log("Trying to determine if " + elementToFind + " is in this graph by starting at " + startingNode)
        var visitedNodes = {};
        var nodesToCheck = new Queue()
        
        nodesToCheck.enqueue(startingNode)
    
        while(!nodesToCheck.isEmpty()){
            var elementToCheck = nodesToCheck.dequeue()
            
            console.log("Currently Checking ", elementToCheck)
    
            if(elementToCheck == elementToFind){
                console.log("Element Found")
                return true }

            else {
                if (!visitedNodes[elementToCheck]){
                    visitedNodes[elementToCheck] = true
                    for (var i = 0; i < this.AdjList.get(elementToCheck).length; i++ ){
                        var neighbours = this.AdjList.get(elementToCheck)
                        nodesToCheck.enqueue(neighbours[i])
                    }
                
                    console.log("Visited Nodes are ", visitedNodes)
                    console.log("Nodes to check are ", nodesToCheck)
                }
            }       
    
        }   
            console.log("Element Not Found")
            return false
    }
}

class Queue {
    constructor(){
        this.items = []
    }

    enqueue(item){
        this.items.push(item)
    }

    dequeue(item){
        if(this.items.length != 0) {
            return this.items.shift()
        } else {
            console.log("The queue is empty")
        }
    }

    isEmpty(){
        return this.items.length == 0
    }
}

export class ModifiedGraph extends Graph {
    constructor(numVertices, vertices){
        super(numVertices)
        this.vertices = vertices
    }

    addFolderVertex(newFolderObject){
        super.addVertex(newFolderObject)
    }

    addTaskVertex(newTaskObject) {
        this.AdjList.set(newTaskObject)
    }

    breadthFirstSearch(startingNode, elementToFind) {
        console.log("Trying to determine if " + elementToFind + " is in this graph by starting at " + startingNode)
        var visitedNodes = {};
        var nodesToCheck = new Queue()
        
        nodesToCheck.enqueue(startingNode)
    
        while(!nodesToCheck.isEmpty()){
            var elementToCheck = nodesToCheck.dequeue()
            
            console.log("Currently Checking ", elementToCheck)
    
            if(elementToCheck.Title == elementToFind){
                console.log("Element Found")
                return true }

            else {
                if (!visitedNodes[elementToCheck]){
                    visitedNodes[elementToCheck] = true
                    if (elementToCheck.Type != "Task"){
                        for (var i = 0; i < this.AdjList.get(elementToCheck).length; i++ ){
                            var neighbours = this.AdjList.get(elementToCheck)
                            nodesToCheck.enqueue(neighbours[i])
                        }
                    }
                
                    console.log("Visited Nodes are ", visitedNodes)
                    console.log("Nodes to check are ", nodesToCheck)
                }
            }       
    
        }   
            console.log("Element Not Found")
            return false
    }

    findParentVertex(titleOfParent){

        var parentVertex = this.vertices.find((element) => {
            return element.Title == titleOfParent
        })
    
        
        return parentVertex
    
    }

    addEdgeWithoutDirectParentReference(childVertexToAdd){
        var titleOfParentVertex = childVertexToAdd.Parent

        var parentVertex = this.findParentVertex(titleOfParentVertex)

        if (parentVertex != undefined){

            // console.log("Parent Vertex is ", ParentVertex)

            super.addEdge(parentVertex,childVertexToAdd)
        } 
    }

    getChildrenVerticesOfSelectedVertex(parentVertex) {
        var ChildrenVertices = this.AdjList.get(parentVertex)
        return ChildrenVertices
    }

    getAllParentVertices(){
        var arrayOfKeys = []
        this.AdjList.forEach((value,key) => arrayOfKeys.push(key))

        return arrayOfKeys
    }

    getAllChildrenVerticesInGraphExceptForRoot(){
        var arrayOfValues = []
        this.AdjList.forEach((value,key) => {
            if (key.Type != 'Root' && key.Type != 'Task'){
                arrayOfValues.push(value)}
        })

        return arrayOfValues
    }

    getNamesOfParentVerticesExceptRoot(){
        var parentVertices = this.getAllParentVertices()
        var arrayOfParentNames = []

        parentVertices.forEach((element) => {
            if (element.Type != 'Task' && element.Type != 'Root'){
                arrayOfParentNames.push(element.Title)
            }
        })

        return arrayOfParentNames

    }

    returnVerticesWithChildren = () => {
        var names = this.getNamesOfParentVerticesExceptRoot()
      
        var arrayOfArraysOfValues = this.getAllChildrenVerticesInGraphExceptForRoot()
        
        var subs = []
        
        for(var i = 0; i < names.length; i++){
            var sub = {}
            sub.Title = names[i]
            sub.Children = arrayOfArraysOfValues[i]
            subs.push(sub)
        }
        return subs
    }

    removeVertex(Vertex){
        this.AdjList.delete(Vertex)
    }
    
    removeEdge(childVertex){
        var parentVertex = this.findParentVertex(childVertex.Parent)
        var childrenVertices = this.getChildrenVerticesOfSelectedVertex(parentVertex)
        var newChildrenVertices = childrenVertices.filter((element) => element != childVertex)
        this.AdjList.set(parentVertex,newChildrenVertices)
    }

    deleteFolderVertex(folderVertex){
        this.removeVertex(folderVertex)
        this.removeEdge(folderVertex)
    }
}


// var testFolderVertex = {
//     Type: 'rootFolder',
//     Parent: 'Root',
//     Title: 'Crazysss'
// }

// var vertices = [
//     {Type: 'Root', Title: 'Root'},

//     {Type: 'rootFolder', Parent: 'Root', Title: 'Vehicle'},
//     {Type: 'rootFolder', Parent: 'Root', Title: 'Property'},
//     {Type: 'rootFolder', Parent: 'Root', Title: 'Business'},

//     {Type: 'subFolder', Parent: 'Vehicle', Title: 'Maintenance'},
//     {Type: 'subFolder', Parent: 'Property', Title: 'Pool'},

//     {Type: 'Task', Parent:'Vehicle', Title: 'Task1'},     
//     {Type: 'Task', Parent:'Property', Title: 'Task1'},     
//     {Type: 'Task', Parent:'Business', Title: 'Task1'},     
    
// ]

// var initialGraph = new ModifiedGraph(9,vertices)

// for (var i = 0; i < vertices.length; i++) {
//     var checkTypeOfVertex = vertices[i].Type
//     if (checkTypeOfVertex != 'Task') {
//         initialGraph.addFolderVertex(vertices[i]);
//     } else {
//         initialGraph.addTaskVertex(vertices[i])
//     }
// }

// for (var i = 0; i < vertices.length; i++) {
//     initialGraph.addEdgeWithoutDirectParentReference(vertices[i]);
// }

// var rootVertex = initialGraph.findParentVertex('Root')
// var rootFolderVertices = initialGraph.getChildrenVerticesOfSelectedVertex(rootVertex)

// initialState = {
//     rootFolders : rootFolderVertices,
//     childrenOfRootAndSubFolders : []
// }

// initialGraph.addFolderVertex(testFolderVertex)
// initialGraph.addEdge(rootVertex, testFolderVertex)

// var subs = initialGraph.returnVerticesWithChildren()
// initialState.childrenOfRootAndSubFolders = subs

// console.log("Initial State Before ", initialState)

// initialGraph.deleteFolderVertex(testFolderVertex)

// var newRootFolderVertices = initialGraph.getChildrenVerticesOfSelectedVertex(rootVertex)
// var newSubs = initialGraph.returnVerticesWithChildren()
// initialState.rootFolders = newRootFolderVertices
// initialState.childrenOfRootAndSubFolders = newSubs

// console.log("Initial State After ", initialState)



