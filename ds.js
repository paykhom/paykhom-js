'use strict';

//import * as dp from './dp.js'

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// DATA STRUCTURES

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// BUILT-IN DATA STRUCTURE CLASSES

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Set Class (Built-in)

/*
var mySet = new Set();
mySet.add("cat");
mySet.add(24);
mySet.add("bunny");
for (let item of mySet) console.log(item); 
// "cat" 
// 24
// "bunny"
*/

/*
const planetsOrderFromSun = new Set();
planetsOrderFromSun.add('Mercury');
planetsOrderFromSun.add('Venus').add('Earth').add('Mars'); // Chainable Method
console.log(planetsOrderFromSun.has('Earth')); // True

planetsOrderFromSun.delete('Mars');
console.log(planetsOrderFromSun.has('Mars')); // False

for (const x of planetsOrderFromSun) {
  console.log(x); // Same order in as out - Mercury Venus Earth
}
console.log(planetsOrderFromSun.size); // 3

planetsOrderFromSun.add('Venus'); // Trying to add a duplicate
console.log(planetsOrderFromSun.size); // Still 3, Did not add the duplicate

planetsOrderFromSun.clear();
console.log(planetsOrderFromSun.size); // 0
*/

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Map Class (Built-in)

/*
var myMap = new Map();
myMap.set("cat", "bengal");
myMap.set(24, 12);
myMap.set(NaN, "not a number");
myMap.get(NaN); // "not a number"
for (var [key, value] of myMap) console.log(key + " - " + value);
// "cat - bengal"
// "24 - 12"
// "NaN - not a number"
*/

/*
const map = new Map(); // Create a new Map
map.set('hobby', 'cycling'); // Sets a key value pair

const foods = { dinner: 'Curry', lunch: 'Sandwich', breakfast: 'Eggs' }; // New Object
const normalfoods = {}; // New Object

map.set(normalfoods, foods); // Sets two objects as key value pair

for (const [key, value] of map) {
  console.log(`${key} = ${value}`); // hobby = cycling  [object Object] = [object Object]
}

map.forEach((value, key) => {
  console.log(`${key} = ${value}`);
}, map); // hobby = cycling  [object Object] = [object Object]

map.clear(); // Clears key value pairs
console.log(map.size === 0); // True
*/

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// WeakSet Class (Built-in)

/*
var myWeakSet = new WeakSet();
var foo = {};
var bar = {};

myWeakSet.add(foo);
myWeakSet.has(bar); // false
myWeakSet.has(foo); // true
myWeakSet.delete(foo);
myWeakSet.add({ kobe: 24 }); // But because the added object has no other references, it will not be held in the set
*/

/*
let isMarked     = new WeakSet()
let attachedData = new WeakMap()

export class Node {
    constructor (id)   { this.id = id                  }
    mark        ()     { isMarked.add(this)            }
    unmark      ()     { isMarked.delete(this)         }
    marked      ()     { return isMarked.has(this)     }
    set data    (data) { attachedData.set(this, data)  }
    get data    ()     { return attachedData.get(this) }
}

let foo = new Node("foo")

JSON.stringify(foo) === '{"id":"foo"}'
foo.mark()
foo.data = "bar"
foo.data === "bar"
JSON.stringify(foo) === '{"id":"foo"}'

isMarked.has(foo)     === true
attachedData.has(foo) === true
foo = null  // remove only reference to foo 
attachedData.has(foo) === false
isMarked.has(foo)     === false
*/

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// WeakMap Class (Built-in)

/*
var myWeakMap = new WeakMap();
var obj1 = {};
var obj2 = function(){};
myWeakMap.set(obj1, "cat");
myWeakMap.set(obj2, 24);
myWeakMap.has(obj1); // true
myWeakMap.get(obj2); // 24
myWeakMap.delete(obj1);
*/

/*
const aboutAuthor = new WeakMap(); // Create New WeakMap
const currentAge = {}; // key must be an object
const currentCity = {}; // keys must be an object

aboutAuthor.set(currentAge, 30); // Set Key Values
aboutAuthor.set(currentCity, 'Denver'); // Key Values can be of different data types

console.log(aboutAuthor.has(currentCity)); // Test if WeakMap has a key

aboutAuthor.delete(currentAge); // Delete a key
*/



// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// ArrayBuffer Class (Built-in)

/*
const buffer = new ArrayBuffer(8);
*/

// //////////////////////////////////
// TypedArray Class (Built-in)
//    Int[8/16/32]Array - for interpreting buffers as arrays of integer numbers with the given number of bits for representing each;
//    Uint[8/16/32]Array - unsigned integer numbers with the given number of bits for each;
//    Float[8/16/32/64]Array - floating-point numbers with the given number of bits for each;
//    BigInt64Array - integer numbers (bigint) with 64 bits for each;
//    BigUint64Array - unsigned integer (bigint) numbers with 64 bits for each;

/*
const typedArr = new Uint8Array([0,1,2,3,4]);
const mapped = typedArr.map(num => num * 2); // Uint8Array [0,2,4,6,8]

const typedArr = new Uint8Array([0,1,2,3,4]);
typedArr.push(5) // Error! You must be kidding me!

const typedArr = new Uint8Array([0,1,2,3,4]);
for(const num of typedArr){
    // code
}
const arr = Array.from(typedArr); // [0,1,2,3,4]

const buff = new ArrayBuffer(32); // allocates 32 bytes of memory
buff.byteLength; // 32
buff[0] = 10;
buff[1] = 20;
buff[2] = buff[0] + buff[1]; // 30

// Floating point arrays.
var f64 = new Float64Array(8);
var f32 = new Float32Array(16);

// Signed integer arrays.
var i32 = new Int32Array(16);
var i16 = new Int16Array(32);
var i8 = new Int8Array(64);

// Unsigned integer arrays.
var u32 = new Uint32Array(16);
var u16 = new Uint16Array(32);
var u8 = new Uint8Array(64);
var pixels = new Uint8ClampedArray(64); // clamps input values between 0 and 255

*/

// /BUILT-IN DATA STRUCTURE CLASSES
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //


// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// CUSTOM DATA STRUCTURE CLASSES

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Queue class 

class Queue extends Class {
    // Array is used to implement a Queue 
    constructor() {
        this.items = [];
    }

    // Functions to be implemented 
    // enqueue(item) 
    // dequeue() 
    // front() 
    // isEmpty() 
    // printQueue() 



    // enqueue function 
    enqueue(element) {
        // adding element to the queue 
        this.items.push(element);
    }


    // dequeue function 
    dequeue() {
        // removing element from the queue 
        // returns underflow when called  
        // on empty queue 
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }



    // front function 
    front() {
        // returns the Front element of  
        // the queue without removing it. 
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }


    // isEmpty function 
    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0;
    }


    // printQueue function 
    printQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }

    /*

    // creating object for queue class 
    var queue = new Queue(); 
                
    
    // Testing dequeue and pop on an empty queue 
    // returns Underflow 
    console.log(queue.dequeue()); 
    
    // returns true 
    console.log(queue.isEmpty()); 
    
    // Adding elements to the queue 
    // queue contains [10, 20, 30, 40, 50] 
    queue.enqueue(10); 
    queue.enqueue(20); 
    queue.enqueue(30); 
    queue.enqueue(40); 
    queue.enqueue(50); 
    queue.enqueue(60); 
    
    // returns 10 
    console.log(queue.front()); 
    
    // removes 10 from the queue 
    // queue contains [20, 30, 40, 50, 60] 
    console.log(queue.dequeue()); 
    
    // returns 20 
    console.log(queue.front()); 
    
    // removes 20 
    // queue contains [30, 40, 50, 60] 
    console.log(queue.dequeue()); 
    
    // printing the elements of the queue 
    // prints [30, 40, 50, 60] 
    console.log(queue.printQueue()); 

    */

}


// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Stack class 
class Stack extends Class {

    // Array is used to implement stack 
    constructor() {
        this.items = [];
    }

    // Functions to be implemented 
    // push(item) 
    // pop() 
    // peek() 
    // isEmpty() 
    // printStack() 



    // push function 
    push(element) {
        // push element into the items 
        this.items.push(element);
    }


    // pop function 
    pop() {
        // return top most element in the stack 
        // and removes it from the stack 
        // Underflow if stack is empty 
        if (this.items.length == 0)
            return "Underflow";
        return this.items.pop();
    }


    // peek function 
    peek() {
        // return the top most element from the stack 
        // but does'nt delete it. 
        return this.items[this.items.length - 1];
    }


    // isEmpty function 
    isEmpty() {
        // return true if stack is empty 
        return this.items.length == 0;
    }


    // printStack function 
    printStack() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i] + " ";
        return str;
    }

    /*

    // creating object for stack class 
    var stack = new Stack(); 
    
    // testing isEmpty and pop on an empty stack 
    
    // returns false 
    console.log(stack.isEmpty());  
    
    // returns Underflow 
    console.log(stack.pop());  

    // Adding element to the stack 
    stack.push(10); 
    stack.push(20); 
    stack.push(30); 
    
    // Printing the stack element 
    // prints [10, 20, 30] 
    console.log(stack.printStack()); 
    
    // returns 30 
    console.log(stack.peek()); 
    
    // returns 30 and remove it from stack 
    console.log(stack.pop()); 
    
    // returns [10, 20] 
    console.log(stack.printStack());
    */


}

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// PriorityQueue

class PriorityQueueElement extends Class {
    constructor(element, priority) {
        this.element = element;
        this.priority = priority;
    }
}

// PriorityQueue class 
class PriorityQueue extends Class {

    // An array is used to implement priority 
    constructor() {
        this.items = [];
    }

    // functions to be implemented 
    // enqueue(item, priority) 
    // dequeue() 
    // front() 
    // isEmpty() 
    // printPQueue() 


    // enqueue function to add element 
    // to the queue as per priority 
    enqueue(element, priority) {
        // creating object from queue element 
        var qElement = new PriorityQueueElement(element, priority);
        var contain = false;

        // iterating through the entire 
        // item array to add element at the 
        // correct location of the Queue 
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is 
                // enqueued 
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }

        // if the element have the highest priority 
        // it is added at the end of the queue 
        if (!contain) {
            this.items.push(qElement);
        }
    }


    // dequeue method to remove 
    // element from the queue 
    dequeue() {
        // return the dequeued element 
        // and remove it. 
        // if the queue is empty 
        // returns Underflow 
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }


    // front function 
    front() {
        // returns the highest priority element 
        // in the Priority queue without removing it. 
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }


    // rear function 
    rear() {
        // returns the lowest priorty 
        // element of the queue 
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }


    // isEmpty function 
    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0;
    }


    // printQueue function 
    // prints all the element of the queue 
    printPQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }

    /*

    // creating object for queue classs 
    var priorityQueue = new PriorityQueue(); 
    
    // testing isEmpty and front on an empty queue 
    // return true 
    console.log(priorityQueue.isEmpty()); 
    
    // returns "No elements in Queue" 
    console.log(priorityQueue.front()); 
    
    // adding elements to the queue 
    priorityQueue.enqueue("Sumit", 2); 
    priorityQueue.enqueue("Gourav", 1); 
    priorityQueue.enqueue("Piyush", 1); 
    priorityQueue.enqueue("Sunny", 2); 
    priorityQueue.enqueue("Sheru", 3); 
    
    // prints [Gourav Piyush Sumit Sunny Sheru] 
    console.log(priorityQueue.printPQueue()); 
    
    // prints Gourav 
    console.log(priorityQueue.front().element); 
    
    // pritns Sheru 
    console.log(priorityQueue.rear().element); 
    
    // removes Gouurav 
    // priorityQueue contains 
    // [Piyush Sumit Sunny Sheru] 
    console.log(priorityQueue.dequeue().element); 
    
    // Adding another element to the queue 
    priorityQueue.enqueue("Sunil", 2); 
    
    // prints [Piyush Sumit Sunny Sunil Sheru] 
    console.log(priorityQueue.printPQueue()); 

    */


}


// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// BinarySearch

class BinarySearchNode extends Class {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

// Binary Search tree class 
class BinarySearchTree extends Class {
    constructor() {
        // root of a binary seach tree 
        this.root = null;
    }

    // function to be implemented 
    // insert(data) 
    // remove(data) 


    // Helper function 
    // findMinNode() 
    // getRootNode() 
    // inorder(node) 
    // preorder(node)			 
    // postorder(node) 
    // search(node, data) 

    // helper method which creates a new node to 
    // be inserted and calls insertNode 
    insert(data) {
        // Creating a node and initailising 
        // with data 
        var newNode = new Node(data);

        // root is null then node will 
        // be added to the tree and made root. 
        if (this.root === null)
            this.root = newNode;
        else

            // find the correct position in the 
            // tree and add the node 
            this.insertNode(this.root, newNode);
    }

    // Method to insert a node in a tree 
    // it moves over the tree to find the location 
    // to insert a node with a given data 
    insertNode(node, newNode) {
        // if the data is less than the node 
        // data move left of the tree 
        if (newNode.data < node.data) {
            // if left is null insert node here 
            if (node.left === null)
                node.left = newNode;
            else

                // if left is not null recur until 
                // null is found 
                this.insertNode(node.left, newNode);
        }

        // if the data is more than the node 
        // data move right of the tree 
        else {
            // if right is null insert node here 
            if (node.right === null)
                node.right = newNode;
            else

                // if right is not null recur until 
                // null is found 
                this.insertNode(node.right, newNode);
        }
    }

    // helper method that calls the 
    // removeNode with a given data 
    remove(data) {
        // root is re-initialized with 
        // root of a modified tree. 
        this.root = this.removeNode(this.root, data);
    }

    // Method to remove node with a 
    // given data 
    // it recur over the tree to find the 
    // data and removes it 
    removeNode(node, key) {

        // if the root is null then tree is 
        // empty 
        if (node === null)
            return null;

        // if data to be delete is less than 
        // roots data then move to left subtree 
        else if (key < node.data) {
            node.left = this.removeNode(node.left, key);
            return node;
        }

        // if data to be delete is greater than 
        // roots data then move to right subtree 
        else if (key > node.data) {
            node.right = this.removeNode(node.right, key);
            return node;
        }

        // if data is similar to the root's data 
        // then delete this node 
        else {
            // deleting node with no children 
            if (node.left === null && node.right === null) {
                node = null;
                return node;
            }

            // deleting node with one children 
            if (node.left === null) {
                node = node.right;
                return node;
            }

            else if (node.right === null) {
                node = node.left;
                return node;
            }

            // Deleting node with two children 
            // minumum node of the rigt subtree 
            // is stored in aux 
            var aux = this.findMinNode(node.right);
            node.data = aux.data;

            node.right = this.removeNode(node.right, aux.data);
            return node;
        }

    }

    // Performs inorder traversal of a tree 
    inorder(node) {
        if (node !== null) {
            this.inorder(node.left);
            console.log(node.data);
            this.inorder(node.right);
        }
    }

    // Performs preorder traversal of a tree	 
    preorder(node) {
        if (node !== null) {
            console.log(node.data);
            this.preorder(node.left);
            this.preorder(node.right);
        }
    }

    // Performs postorder traversal of a tree 
    postorder(node) {
        if (node !== null) {
            this.postorder(node.left);
            this.postorder(node.right);
            console.log(node.data);
        }
    }

    // finds the minimum node in tree 
    // searching starts from given node 
    findMinNode(node) {
        // if left of a node is null 
        // then it must be minimum node 
        if (node.left === null)
            return node;
        else
            return this.findMinNode(node.left);
    }

    // returns root of the tree 
    getRootNode() {
        return this.root;
    }

    // search for a node with given data 
    search(node, data) {
        // if trees is empty return null 
        if (node === null)
            return null;

        // if data is less than node's data 
        // move left 
        else if (data < node.data)
            return this.search(node.left, data);

        // if data is less than node's data 
        // move left 
        else if (data > node.data)
            return this.search(node.right, data);

        // if data is equal to the node data 
        // return node 
        else
            return node;
    }

    /*
    // create an object for the BinarySearchTree 
    var BST = new BinarySearchTree(); 

    // Inserting nodes to the BinarySearchTree 
    BST.insert(15); 
    BST.insert(25); 
    BST.insert(10); 
    BST.insert(7); 
    BST.insert(22); 
    BST.insert(17); 
    BST.insert(13); 
    BST.insert(5); 
    BST.insert(9); 
    BST.insert(27); 
                            
    //		 15 
    //		 / \ 
    //	 10 25 
    //	 / \ / \ 
    //	 7 13 22 27 
    //	 / \ / 
    // 5 9 17 

    var root = BST.getRootNode(); 
                
    // prints 5 7 9 10 13 15 17 22 25 27 
    BST.inorder(root); 
                
    // Removing node with no children 
    BST.remove(5); 
                
                
    //		 15 
    //		 / \ 
    //	 10 25 
    //	 / \ / \ 
    //	 7 13 22 27 
    //	 \ / 
    //	 9 17 
                
                            
    var root = BST.getRootNode(); 
                
    // prints 7 9 10 13 15 17 22 25 27 
    BST.inorder(root); 
                
    // Removing node with one child 
    BST.remove(7); 
                
    //		 15 
    //		 / \ 
    //	 10 25 
    //	 / \ / \ 
    //	 9 13 22 27 
    //		 / 
    //		 17 
                
                
    var root = BST.getRootNode(); 

    // prints 9 10 13 15 17 22 25 27 
    BST.inorder(root); 
                
    // Removing node with two children 
    BST.remove(15); 
        
    //		 17 
    //		 / \ 
    //	 10 25 
    //	 / \ / \ 
    //	 9 13 22 27 

    var root = BST.getRootNode(); 
    console.log("inorder traversal"); 

    // prints 9 10 13 17 22 25 27 
    BST.inorder(root); 
                
    console.log("postorder traversal"); 
    BST.postorder(root); 
    console.log("preorder traversal"); 
    BST.preorder(root); 

    */


}

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Graph

class Graph extends Class {
    // defining vertex array and 
    // adjacent list 
    constructor(noOfVertices) {
        this.noOfVertices = noOfVertices;
        this.AdjList = new Map();
    }

    // functions to be implemented 

    // addVertex(v) 
    // addEdge(v, w) 
    // printGraph() 

    // bfs(v) 
    // dfs(v) 

    // add vertex to the graph 
    addVertex(v) {
        // initialize the adjacent list with a 
        // null array 
        this.AdjList.set(v, []);
    }

    // add edge to the graph 
    addEdge(v, w) {
        // get the list for vertex v and put the 
        // vertex w denoting edge between v and w 
        this.AdjList.get(v).push(w);

        // Since graph is undirected, 
        // add an edge from w to v also 
        this.AdjList.get(w).push(v);
    }

    // Prints the vertex and adjacency list 
    printGraph() {
        // get all the vertices 
        var get_keys = this.AdjList.keys();

        // iterate over the vertices 
        for (var i of get_keys) {
            // great the corresponding adjacency list 
            // for the vertex 
            var get_values = this.AdjList.get(i);
            var conc = "";

            // iterate over the adjacency list 
            // concatenate the values into a string 
            for (var j of get_values)
                conc += j + " ";

            // print the vertex and its adjacency list 
            console.log(i + " -> " + conc);
        }
    }

    // function to performs BFS 
    bfs(startingNode) {

        // create a visited array 
        var visited = [];
        for (var i = 0; i < this.noOfVertices; i++)
            visited[i] = false;

        // Create an object for queue 
        var q = new Queue();

        // add the starting node to the queue 
        visited[startingNode] = true;
        q.enqueue(startingNode);

        // loop until queue is element 
        while (!q.isEmpty()) {
            // get the element from the queue 
            var getQueueElement = q.dequeue();

            // passing the current vertex to callback funtion 
            console.log(getQueueElement);

            // get the adjacent list for current vertex 
            var get_List = this.AdjList.get(getQueueElement);

            // loop through the list and add the element to the 
            // queue if it is not processed yet 
            for (var i in get_List) {
                var neigh = get_List[i];

                if (!visited[neigh]) {
                    visited[neigh] = true;
                    q.enqueue(neigh);
                }
            }
        }
    }

    // Main DFS method 
    dfs(startingNode) {

        var visited = [];
        for (var i = 0; i < this.noOfVertices; i++)
            visited[i] = false;

        this.DFSUtil(startingNode, visited);
    }

    // Recursive function which process and explore 
    // all the adjacent vertex of the vertex with which it is called 
    DfsUtil(vert, visited) {
        visited[vert] = true;
        console.log(vert);

        var get_neighbours = this.AdjList.get(vert);

        for (var i in get_neighbours) {
            var get_elem = get_neighbours[i];
            if (!visited[get_elem])
                this.DFSUtil(get_elem, visited);
        }
    }

    /*
    // Using the above implemented graph class 
    var g = new Graph(6); 
    var vertices = [ 'A', 'B', 'C', 'D', 'E', 'F' ]; 

    // adding vertices 
    for (var i = 0; i < vertices.length; i++) { 
        g.addVertex(vertices[i]); 
    } 

    // adding edges 
    g.addEdge('A', 'B'); 
    g.addEdge('A', 'D'); 
    g.addEdge('A', 'E'); 
    g.addEdge('B', 'C'); 
    g.addEdge('D', 'E'); 
    g.addEdge('E', 'F'); 
    g.addEdge('E', 'C'); 
    g.addEdge('C', 'F'); 

    // prints all vertex and 
    // its adjacency list 
    // A -> B D E 
    // B -> A C 
    // C -> B E F 
    // D -> A E 
    // E -> A D F C 
    // F -> E C 
    g.printGraph(); 


    // prints 
    // BFS 
    // A B D E C F 
    console.log("BFS"); 
    g.bfs('A'); 



    // prints 
    // DFS 
    // A B C E D F 
    console.log("DFS"); 
    g.dfs('A'); 

    */

}

// //////////////////////////////////////////////////////////////////////////////////////////////// //
// List

class List extends Class {
    constructor(dataStore = [], listSize = 0, pos = 0) {
        this.dataStore = dataStore;
        this.listSize = listSize;
        this.pos = pos;
    }

    clear() {
        this.dataStore = [];
        this.pos = 0;
        this.listSize = 0;
    }

    find(element) {
        return this.dataStore.findIndex(e => e === element);
    }

    insert(element, after) {
        const insertPos = this.find(after);
        if (insertPos != -1) {
            this.dataStore.splice(insertPos + 1, 0, element);
            this.listSize++;
            return true;
        }
        return false;
    }

    append(element) {
        this.dataStore = [...this.dataStore, element];
        this.listSize++;
    }

    remove(element) {
        const removePos = this.find(element);
        if (removePos != -1) {
            this.dataStore.splice(removePos, 1);
            this.listSize--;
            return true;
        }
        return false;
    }

    front() {
        this.pos = 0;
    }

    end() {
        this.pos = this.listSize - 1;
    }

    prev() {
        if (this.pos > 0) {
            --this.pos;
        }
    }

    next() {
        if (this.pos < this.listSize - 1) {
            ++this.pos;
        }
    }

    length() {
        return this.listSize;
    }

    currPos() {
        return this.pos;
    }

    moveTo(position) {
        this.pos = position
    }

    getElement() {
        return this.dataStore[this.pos];
    }

    contains(element) {
        return (this.dataStore.find(value => value === element) != undefined) ? true : false;
    }

    displayList() {
        this.dataStore.forEach((item, counter) => {
            console.log(`${counter + 1}.- ${item}`);
        })
    }

    toString() {
        return JSON.stringify(this.dataStore);
    }
}

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Generic List
class GenericList extends List {
    constructor(dataStore, listSize) {
        super(dataStore, listSize);
    }

    insertGraterThan(element) {
        let grater = false;
        let value = 0;
        for (const key in this.dataStore) {
            if (typeof element !== 'string' && typeof this.dataStore[key] === 'string' ||
                typeof element === 'string' && typeof this.dataStore[key] !== 'string') {
                continue;
            }
            value = (typeof element === 'string') ? this.dataStore[key] + '' : this.dataStore[key];
            grater = (element > value) ? true : false;
        }
        if (grater) {
            this.dataStore.push(element);
            console.log(`The element: ${element} is grater than elemnt's in the list`);
        } 
        else {
            console.log(`The element: ${element} is not grater than elemnt's in the list`);
        }
    }

    insertSmallerThan(element) {
        let smaller = false;
        let value = 0;
        for (const key in this.dataStore) {
            if (typeof element !== 'string' && typeof this.dataStore[key] === 'string' ||
                typeof element === 'string' && typeof this.dataStore[key] !== 'string') {
                continue;
            }
            value = (typeof element === 'string') ? this.dataStore[key] + '' : this.dataStore[key];
            smaller = (element < value) ? true : false;
        }
        if (smaller) {
            this.dataStore.push(element);
            console.log(`The element: ${element} is smaller than elemnt's in the list`);
        } 
        else {
            console.log(`The element: ${element} is not smaller than elemnt's in the list`);
        }
    }

}

// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
// HashTable

class HashTable extends Class {
    constructor() {
        this.table = new Array(137);
        this.values = [];
    }

    hash(string) {
        const H = 37;
        let total = 0;

        for (var i = 0; i < string.length; i++) {
            total += H * total + string.charCodeAt(i);
        }
        total %= this.table.length;
        if (total < 1) {
            this.table.length - 1
        }
        return parseInt(total);
    }

    showDistro() {
        for (const key in this.table) {
            if (this.table[key] !== undefined) {
                console.log(key, ' : ', this.table[key]);
            }
        }
    }

    put(data) {
        const pos = this.hash(data);
        this.table[pos] = data;
    }

    get(key) {
        return this.table[this.hash(key)];
    }
}

// HashTable with Build Chains technique class example for exercise 2
class HashTableChains extends HashTable {
    constructor() {
        super();
        this.buildChains();
    }
    buildChains() {
        for (var i = 0; i < this.table.length; i++) {
            this.table[i] = new Array();
        }
    }

    showDistro() {
        for (const key in this.table) {
            if (this.table[key][0] !== undefined) {
                console.log(key, ' : ', this.table[key]);
            }
        }
    }

    put(key, data) {
        const pos = this.hash(key);
        let index = 0;
        if (this.table[pos][index] === undefined) {
            this.table[pos][index] = data;
        } 
        else {
            ++index;
            while (this.table[pos][index] !== undefined) {
                index++;
            }
            this.table[pos][index] = data;
        }
    }

    get(key) {
        const pos = this.hash(key);
        let index = 0;
        while (this.table[pos][index] != key) {
            if (this.table[pos][index] !== undefined) {
                return this.table[pos][index]
            } 
            else {
                return undefined;
            }
            index++;
        }
    }
}

// HashTable with Linear Probing technique class example for exercise 1
class HashTableLinearP extends HashTable {
    constructor() {
        super();
        this.values = new Array();
    }

    put(key, data) {
        const pos = this.hash(key);
        if (this.table[pos] === undefined) {
            this.table[pos] = key;
            this.values[pos] = data;
        } 
        else {
            while (this.table[pos] !== undefined) {
                pos++;
            }
            this.table[pos] = key;
            this.values[pos] = data;
        }
    }

    get(key) {
        const hash = this.hash(key);
        if (hash > -1) {
            for (let i = hash; this.table[i] !== undefined; i++) {
                if (this.table[i] === key) {
                    return this.values[i];
                }
            }
        }
        return undefined;
    }

    showDistro() {
        for (const key in this.table) {
            if (this.table[key] !== undefined) {
                console.log(key, ' : ', this.values[key]);
            }
        }
    }
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////// //
// Linked List


// User defined class node 
class LinkedNode { 
    // constructor 
    constructor(element) 
    { 
        this.element = element; 
        this.next = null
    } 
} 

// linkedlist class 
class LinkedList { 
    constructor() 
    { 
        this.head = null; 
        this.size = 0; 
    } 
  
    // functions to be implemented 
    // add(element) 
    // insertAt(element, location) 
    // removeFrom(location) 
    // removeElement(element) 
  
    // Helper Methods 
    // isEmpty 
    // size_Of_List 
    // PrintList 


    // adds an element at the end 
    // of list 
    add(element) { 
        // creates a new node 
        var node = new LinkedNode(element); 
    
        // to store current node 
        var current; 
    
        // if list is Empty add the 
        // element and make it head 
        if (this.head == null) 
            this.head = node; 
        else { 
            current = this.head; 
    
            // iterate to the end of the 
            // list 
            while (current.next) { 
                current = current.next; 
            } 
    
            // add node 
            current.next = node; 
        } 
        this.size++; 
    } 


    // insert element at the position index 
    // of the list 
    insertAt(element, index) { 
        if (index > 0 && index > this.size) 
            return false; 
        else { 
            // creates a new node 
            var node = new LinkedNode(element); 
            var curr, prev; 
    
            curr = this.head; 
    
            // add the element to the 
            // first index 
            if (index == 0) { 
                node.next = this.head; 
                this.head = node; 
            } 
            else { 
                curr = this.head; 
                var it = 0; 
    
                // iterate over the list to find 
                // the position to insert 
                while (it < index) { 
                    it++; 
                    prev = curr; 
                    curr = curr.next; 
                } 
    
                // adding an element 
                node.next = curr; 
                prev.next = node; 
            } 
            this.size++; 
        } 
    } 


    // removes an element from the 
    // specified location 
    removeFrom(index) { 
        if (index > 0 && index > this.size) 
            return -1; 
        else { 
            var curr, prev, it = 0; 
            curr = this.head; 
            prev = curr; 
    
            // deleting first element 
            if (index === 0) { 
                this.head = curr.next; 
            } 
            else { 
                // iterate over the list to the 
                // position to removce an element 
                while (it < index) { 
                    it++; 
                    prev = curr; 
                    curr = curr.next; 
                } 
    
                // remove the element 
                prev.next = curr.next; 
            } 
            this.size--; 
    
            // return the remove element 
            return curr.element; 
        } 
    } 

    // removes a given element from the 
    // list 
    remove (element) { 
        var current = this.head; 
        var prev = null; 
    
        // iterate over the list 
        while (current != null) { 
            // comparing element with current 
            // element if found then remove the 
            // and return true 
            if (current.element === element) { 
                if (prev == null) { 
                    this.head = current.next; 
                } 
                else { 
                    prev.next = current.next; 
                } 
                this.size--; 
                return current.element; 
            } 
            prev = current; 
            current = current.next; 
        } 
        return -1; 
    } 


    // finds the index of element 
    indexOf(element) { 
        var count = 0; 
        var current = this.head; 
    
        // iterae over the list 
        while (current != null) { 
            // compare each element of the list 
            // with given element 
            if (current.element === element) 
                return count; 
            count++; 
            current = current.next; 
        } 
    
        // not found 
        return -1; 
    } 


    // checks the list for empty 
    isEmpty() { 
        return this.size == 0; 
    } 

    // traverse the list items 
    traverse(fn) { 
        var curr = this.head; 
        //var str = ""; 
        while (curr) { 
            //str += curr.element + " "; 
            
            fn (curr.element, curr.next.element);

            curr = curr.next; 
        } 
    } 

    /** TEST **
    // creating an object for the 
    // Linkedlist class 
    var ll = new LinkedList(); 
    
    // testing isEmpty on an empty list 
    // returns true 
    console.log(ll.isEmpty()); 
    
    // adding element to the list 
    ll.add(10); 
    
    // prints 10 
    ll.printList(); 
    
    // returns 1 
    console.log(ll.size_of_list()); 
    
    // adding more elements to the list 
    ll.add(20); 
    ll.add(30); 
    ll.add(40); 
    ll.add(50); 
    
    // returns 10 20 30 40 50 
    ll.printList(); 
    
    // prints 50 from the list 
    console.log("is element removed ?" + ll.removeElement(50)); 
    
    // prints 10 20 30 40 
    ll.printList(); 
    
    // returns 3 
    console.log("Index of 40 " + ll.indexOf(40)); 
    
    // insert 60 at second position 
    // ll contains 10 20 60 30 40 
    ll.insertAt(60, 2); 
    
    ll.printList(); 
    
    // returns false 
    console.log("is List Empty ? " + ll.isEmpty()); 
    
    // remove 3rd element from the list 
    console.log(ll.removeFrom(3)); 
    
    // prints 10 20 60 40 
    ll.printList(); 
    ** */
} 

// /Linked List
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //

// /CUSTOM DATA STRUCTURE CLASSES
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //


// /DATA STRUCTURE
// //////////////////////////////////////////////////////////////////////////////////////////////////////// //
