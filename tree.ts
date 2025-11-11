import { Queue } from "./queue";

export interface TreeNode {
  root?: TreeNode | null,
  data: number,
  left?: TreeNode | null,
  right?: TreeNode | null
}

export class BinarySearchTree {
  root: TreeNode;

  constructor(sortedValues: number[]) {
    this.root = this.#generateTree(sortedValues, 0, sortedValues.length - 1) as TreeNode;
  }

  #generateTree(sortedArray: number[], start_i: number, end_i: number) {
    if (start_i > end_i) return null;

    const mid_i = start_i + Math.floor((end_i - start_i) / 2)
    const root: TreeNode = {data: sortedArray[mid_i]};

    root.left = this.#generateTree(sortedArray, start_i, mid_i - 1);
    root.right = this.#generateTree(sortedArray, mid_i + 1, end_i);

    if (root.left) root.left.root = root;
    if (root.right) root.right.root = root;

    return root;
  }

  #orderLevelSearch(node: TreeNode | undefined, queue?: Queue<TreeNode>, value?: number, callback?: (node: TreeNode) => void): TreeNode | undefined {
    if (!node) return undefined;

    if (value && node.data === value) {
      if (callback) callback(node);
      return node
    };

    if (callback) callback(node);

    if (!queue) queue = new Queue();
    else if (queue.Size > 0) queue.dequeue();
    
    if (node.left) queue.enqueue(node.left);
    if (node.right) queue.enqueue(node.right);

    if (!queue.first) return;

    return this.#orderLevelSearch(queue.first.data, queue, value, callback);
  }

  #depthFirstSearch(kind: "preorder" | "inorder" | "postorder", node: TreeNode | undefined, value?: number, callback?: (node: TreeNode) => void): TreeNode | undefined {
    if (!node) return undefined;

    switch (kind) {
      case "preorder": {
        if (value && node.data === value) {
          if (callback) callback(node);
          return node;
        };

        if (callback) callback(node);

        let left: TreeNode | undefined;
        if (node.left) left = this.#depthFirstSearch(kind, node.left, value, callback);

        if (left) return left

        let right: TreeNode | undefined;
        if (node.right) left = this.#depthFirstSearch(kind, node.right, value, callback);

        if (right) return right;

        break;
      }
      case "inorder": {
        let left: TreeNode | undefined;
        if (node.left) left = this.#depthFirstSearch(kind, node.left, value, callback);

        if (left) return left;

        if (value && node.data === value) {
          if (callback) callback(node);
          return node;
        };

        if (callback) callback(node);

        let right: TreeNode | undefined;
        if (node.right) left = this.#depthFirstSearch(kind, node.right, value, callback);

        if (right) return right;

        break;
      }
      case "postorder": {
        let left: TreeNode | undefined;
        if (node.left) left = this.#depthFirstSearch(kind, node.left, value, callback);

        if (left) return left;

        let right: TreeNode | undefined;
        if (node.right) left = this.#depthFirstSearch(kind, node.right, value, callback);

        if (right) return right;

        if (value && node.data === value) {
          if (callback) callback(node);
          return node;
        };

        if (callback) callback(node);

        break;
      }
    }
  }

  orderLevelForEeach(callback: (node: TreeNode) => void): void {
    this.#orderLevelSearch(this.root, undefined, undefined, callback);
  }

  depthFirstForEach(callback: (node: TreeNode) => void, dfsKind: "preorder" | "inorder" | "postorder"): void {
    this.#depthFirstSearch(dfsKind, this.root, undefined, callback);
  }

  #binarySearch(value: number, node: TreeNode | null | undefined, callback?: (node: TreeNode) => void): TreeNode | undefined {
    if (!node) return undefined;
    if (node.data === value) {
      if (callback) callback(node);
      return node
    };

    return value < node.data ? this.#binarySearch(value, node.left) : this.#binarySearch(value, node.right);
  }

  #parentBinarySearch(value: number, node: TreeNode): TreeNode | undefined {
    if (node.data === value) return node;

    if ((value < node.data && !node.left) ||
        (value > node.data && !node.right)) return node;
    
    if (value < node.data && node.left) return this.#parentBinarySearch(value, node.left);
    if (value > node.data && node.right) return this.#parentBinarySearch(value, node.right);
  }

  find(value: number): TreeNode | undefined {
    return this.#binarySearch(value, this.root);
  };

  print(): void {
    const prettyPrint = (node = this.root, prefix = '', isLeft = true) => {
      if (!node) return;
      
      if (node.right) prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
      
      console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);

      if (node.left) prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    };

    prettyPrint();
  };

  insert(value: number): void {
    const parent = this.#parentBinarySearch(value, this.root) as TreeNode;

    if (parent.data === value) return;
    if (parent.data > value) parent.left = {
      root: parent,
      data: value
    };
    if (parent.data < value) parent.right = {
      root: parent,
      data: value
    };
  };

  remove(value: number): void {
    const target = this.#binarySearch(value, this.root);
    if (!target) return;

    if (!target.left && !target.right && target.root) {
      if (target.root.left === target) target.root.left = null;
      if (target.root.right === target) target.root.right = null;
      return;
    }

    if (target.left && !target.right && target.root) {
      if (target.root.left === target) target.root.left = target.left;
      if (target.root.right === target) target.root.right = target.left;
      return;
    }

    if (target.right && !target.left && target.root) {
      if (target.root.left === target) target.root.left = target.right;
      if (target.root.right === target) target.root.right = target.right;
      return;
    }

    const successor = this.min(target.right as TreeNode);
    (successor.root as TreeNode).left = null;

    successor.left = target.left;
    successor.right = target.right;
    successor.root = target.root;

    (target.left as TreeNode).root = successor;
    (target.right as TreeNode).root = successor;

    this.root = successor;

    target.left = null;
    target.right = null;
    target.left = null;
  }

  min(node: TreeNode): TreeNode {
    if (!node.left) return node;
    return this.min(node.left);
  }

  max(node: TreeNode): TreeNode {
    if (!node.right) return node;
    return this.max(node.right);
  }
}

const bst = new BinarySearchTree([3, 6, 7, 9, 10, 13, 14, 20, 22, 23, 25, 30, 32, 35, 36]);

bst.print();
bst.remove(20);
bst.print();
bst.depthFirstForEach((node: TreeNode) => console.log(node.data), "inorder");
bst.orderLevelForEeach((node: TreeNode) => console.log(node.data));