import { Queue } from "./linkedList";

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

    return root;
  }

  #orderLevelSearch(value: number, node: TreeNode, queue?: Queue<TreeNode>): TreeNode | undefined {
    if (node.data === value) return node;

    if (!queue) queue = new Queue();
    else queue.dequeue();
    
    if (node.left) queue.enqueue(node.left);
    if (node.right) queue.enqueue(node.right);

    return this.#orderLevelSearch(value, queue.first.data, queue);
  }

  #depthFirstSearch(value: number, kind: "preorder" | "inorder" | "postorder", node: TreeNode | undefined): TreeNode | undefined {
    if (!node) return undefined;

    switch (kind) {
      case "preorder": {
        if (node.data === value) return node;

        let left: TreeNode | undefined;
        if (node.left) left = this.#depthFirstSearch(value, kind, node.left);

        if (left) return left;

        let right: TreeNode | undefined;
        if (node.right) left = this.#depthFirstSearch(value, kind, node.right);

        if (right) return right;

        break;
      }
      case "inorder": {
        let left: TreeNode | undefined;
        if (node.left) left = this.#depthFirstSearch(value, kind, node.left);

        if (left) return left;

        if (node.data === value) return node;

        let right: TreeNode | undefined;
        if (node.right) left = this.#depthFirstSearch(value, kind, node.right);

        if (right) return right;

        break;
      }
      case "postorder": {
        let left: TreeNode | undefined;
        if (node.left) left = this.#depthFirstSearch(value, kind, node.left);

        if (left) return left;

        let right: TreeNode | undefined;
        if (node.right) left = this.#depthFirstSearch(value, kind, node.right);

        if (right) return right;

        if (node.data === value) return node;

        break;
      }
    }
  }

  #binarySearch(value: number, node: TreeNode | null | undefined): TreeNode | undefined {
    if (!node) return undefined;
    if (node.data === value) return node;

    return value < node.data ? this.#binarySearch(value, node.left) : this.#binarySearch(value, node.right);
  }

  #rootBinarySearch(value: number, node: TreeNode): TreeNode | undefined {
    if (node.data === value) return node;

    if ((value < node.data && !node.left) ||
        (value > node.data && !node.right)) return node;
    
    if (value < node.data && node.left) return this.#rootBinarySearch(value, node.left);
    if (value > node.data && node.right) return this.#rootBinarySearch(value, node.right);
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
    const parent = this.#rootBinarySearch(value, this.root) as TreeNode;

    if (parent.data === value) return;
    if (parent.data > value) parent.left = {data: value};
    if (parent.data < value) parent.right = {data: value};
  };

  remove(value: number): void {
    const target = this.#binarySearch(value, this.root);
    if (!target) return;

    const parent = target.root as TreeNode;
    if (parent.left === target) parent.left = null;
    if (parent.right === target) parent.right = null;
  }
}

const bst = new BinarySearchTree([3, 6, 7, 9, 10, 13, 14, 20]);

console.log(bst.find(14));
bst.insert(90);
bst.print();
