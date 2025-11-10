type TrasverseReturnTypes = "index" | "value";

export class Queue<T> {
  last: Node<T>;
  first: Node<T>;
  #size: number = 0;

  constructor(...values: Node<T>[]) {
    this.last = values[0];
    for (let [i, value] of values.entries()) {
      if (values[i++]) value.next = values[i++];
      if (values[i--]) value.root = values[i--];
      this.#size++;
    }
    this.first = values[values.length - 1];
  }

  #search(compareTo: TrasverseReturnTypes,
          isEqual: (predicate: number | string) => boolean,
          returnType?: TrasverseReturnTypes,
          current: Node<T> | null = this.last, 
          i: number = 0, 
  ): Node<T> | string | number | undefined {
    if (!current) return;
    if (compareTo === "index" && isEqual(i)) {
      switch (returnType) {
        case "index":
          return i;
        default: 
          return current;
      }
    }
    const increment = i + 1;
    const next = current.next ?? null;
    return this.#search(compareTo, isEqual, returnType, next, increment);
  }

  get Size() {return this.#size;}

  enqueue(value: T): void {
    const newHead: Node<T> = {
      data: value,
      next: this.last
    };

    this.last = newHead;
    this.#size++;
  };

  dequeue(): void {
    const secondLast = this.first.root;
    if (!secondLast) return;
    secondLast.next = undefined;
    this.#size--;
  };

  toString(): string {
    let result = "last -> ";
    let current: Node<T> | undefined = this.last;

    while(current) {
      result += `[${current.data}] -> `
      current = current?.next;
    }

    result += "null"

    return result;
  };
}

interface Node<T> {
  root?: Node<T>,
  data: T,
  next?: Node<T>,
}