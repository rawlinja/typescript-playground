/** 
 * 
https://stackoverflow.com/questions/74044363/tree-select-ui-coding-challenge
 
A TreeSelect is a UI input component whose model is a tree where each node consists of a checkbox and a label.

A node's checkbox can be in 1 of 3 states reflecting the selected status of the sub-tree rooted at the node:

checked: ALL the leaf nodes in the sub-tree are selected.
partially-checked: SOME (but not ALL) of the leaf nodes in the sub-tree are selected.
unchecked: NONE of the leaf nodes in the sub-tree are selected.

Each node's checkbox can be clicked to change its status:

if a checkbox is checked, clicking on it would un-select all the leaf nodes in the sub-tree.
if a checkbox is partially-checked, clicking on it would select all the leaf nodes in the sub-tree.
if a checkbox is unchecked, clicking on it would select all the leaf nodes in the sub-tree.

The tree is provided as '/' separated paths to leaf nodes. Assume every node's name is unique in the tree.**

For example:

 [ 
    'A/B/D',
    'A/B/E', 
    'A/B/F', 
    'A/C', 
    'X/Y', 
    'X/Z',
]
It would result in the following tree:

-A
  -B
    -D
    -E
    -F
  -C
-X
  -Y
  -Z
A series of clicks on nodes is given as an array of node's names. For example, the clicks ['A', 'B', 'D', 'E'] would look like:

-A
  -B
    -D
    -E
    -F
  -C
-X
  -Y
  -Z
Your task is to create a renderTreeSelect function which takes paths and clicks as arguments and returns a rendering of the tree as a string. Render each node including the following: -for each level of indentation. -[v], [o], [ ] for the checkbox (representing checked, partially-checked, unchecked respectively) -The node's name

Child nodes of a parent should be sorted by name. Again, you can assume every node's name is unique in a tree.

Sample input:

The following input is provided with 6 paths and 4 click

 6 
 A/B/F 
 A/B/D 
 A/B/E 
 A/C 
 X/Y 
 X/Z 
 4
 A
 B
 D
 E
This will be parsed to the following values:

 paths = [ 
            'A/B/F',
            'A/B/D', 
            'A/B/E', 
            'A/C', 
            'X/Y', 
            'X/Z',
];
clicks = [
            'A', 
            'B', 
            'D', 
            'E'
        ];

The expected result of calling renderTreeSelect(paths, clicks) should be:

  [o]A
  .[o]B 
  ..[v]D 
  ..[v]E 
  ..[]F 
  .[v]C 
  []X 
  .[]Y 
  .[]Z
*/

enum TreeSelectState {
  Unchecked,
  Checked,
  PartiallyChecked,
}

const UNCHECKED = '[]'
const CHECKED = '[v]'
const PARTIALLY_CHECKED = '[o]'

type NullableTreeSelectNode = TreeSelectNode | undefined

class TreeSelectNode {
  constructor(
    readonly name: string,
    private state: TreeSelectState = TreeSelectState.Unchecked
  ) {}

  children: TreeSelectNode[] = []
  parent: NullableTreeSelectNode = undefined

  private setState(state: TreeSelectState) {
    this.state = state
    if (this.parent) {
      this.parent.bubbleState()
    }
  }

  /** 
    0) unchecked: NONE of the leaf nodes in the sub-tree are selected. 
    1) checked: ALL the leaf nodes in the sub-tree are selected.
    3) partially-checked: SOME (but not ALL) of the leaf nodes in the sub-tree are selected.
    */
  private bubbleState() {
    if (
      this.leaves().every((node) => node.state === TreeSelectState.Unchecked)
    ) {
      this.setState(TreeSelectState.Unchecked)
    } else if (
      this.leaves().every((node) => node.state === TreeSelectState.Checked)
    ) {
      this.setState(TreeSelectState.Checked)
    } else if (
      this.leaves().some((node) => node.state === TreeSelectState.Checked)
    ) {
      this.setState(TreeSelectState.PartiallyChecked)
    }
  }

  private subTree(): TreeSelectNode[] {
    const result: TreeSelectNode[] = []
    const stack: TreeSelectNode[] = [this]

    while (stack.length) {
      const node = stack.pop()
      if (node) {
        result.push(node)
        const children = node.children
        for (const child of children) {
          stack.push(child)
        }
      }
    }

    return result
  }

  private leaves(): TreeSelectNode[] {
    return this.subTree().filter((node) => !node.hasChildren())
  }

  private level(): number {
    return !this.parent ? 0 : 1 + this.parent.level()
  }

  getState(): TreeSelectState {
    return this.state
  }

  toggleState(): void {
    if (this.state === TreeSelectState.Checked) {
      this.setState(TreeSelectState.Unchecked)
    } else {
      this.setState(TreeSelectState.Checked)
    }
  }

  /**
     *  if a checkbox is partially check or unchecked, clicking on it would 
        select all the leaf nodes in the sub-tree.
  
        if a checkbox is checked, clicking on it would un-select 
        all the leaf nodes in the sub-tree
     */
  click(): void {
    const state = this.state

    if (!this.hasChildren()) {
      this.toggleState()
      return
    }

    if (
      state === TreeSelectState.Unchecked ||
      this.state === TreeSelectState.PartiallyChecked
    ) {
      this.leaves().forEach((node) => {
        node.setState(TreeSelectState.Checked)
      })
    } else if (state === TreeSelectState.Checked) {
      this.leaves().forEach((node) => {
        node.setState(TreeSelectState.Unchecked)
      })
    }
  }

  hasChildren(): boolean {
    return this.children.length > 0
  }

  print(): string {
    let result = ''

    for (let index = 0; index < this.level(); index++) {
      result += '.'
    }

    if (this.state === TreeSelectState.Checked) {
      result += `${CHECKED}${this.name}`
    } else if (this.state === TreeSelectState.Unchecked) {
      result += `${UNCHECKED}${this.name}`
    } else {
      result += `${PARTIALLY_CHECKED}${this.name}`
    }

    return result
  }
}

export { TreeSelectNode, TreeSelectState }
