/**
 * https://stackoverflow.com/questions/74044363/tree-select-ui-coding-challenge
 */

enum TreeSelectState {
  UnChecked,
  Checked,
  PartiallyChecked,
}

const UNCHECKED = '[]'
const CHECKED = '[v]'
const PARTIALLY_CHECKED = '[o]'

type NullableTreeSelectNode = TreeSelectNode | undefined
type TreeSelectNodeMap = Map<string, TreeSelectNode>

class TreeSelectNode {
  constructor(
    readonly name: string,
    private state: TreeSelectState = TreeSelectState.UnChecked
  ) {}

  children: TreeSelectNode[] = []
  parent: NullableTreeSelectNode = undefined

  setState(state: TreeSelectState) {
    this.state = state
    if (this.parent) {
      this.parent.bubbleState()
    }
  }

  toggleState(state: TreeSelectState): void {
    if (state === TreeSelectState.Checked) {
      this.setState(TreeSelectState.UnChecked)
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
      this.toggleState(state)
      return
    }

    if (
      state === TreeSelectState.UnChecked ||
      this.state === TreeSelectState.PartiallyChecked
    ) {
      this.leaves().forEach((node) => {
        node.setState(TreeSelectState.Checked)
      })
    } else if (state === TreeSelectState.Checked) {
      this.leaves().forEach((node) => {
        node.setState(TreeSelectState.UnChecked)
      })
    }
  }

  /** 
    0) unchecked: NONE of the leaf nodes in the sub-tree are selected. 
    1) checked: ALL the leaf nodes in the sub-tree are selected.
    3) partially-checked: SOME (but not ALL) of the leaf nodes in the sub-tree are selected.
  */
  bubbleState() {
    if (
      this.leaves().every((node) => node.state === TreeSelectState.UnChecked)
    ) {
      this.setState(TreeSelectState.UnChecked)
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

  level(): number {
    return !this.parent ? 0 : 1 + this.parent.level()
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
    } else if (this.state === TreeSelectState.UnChecked) {
      result += `${UNCHECKED}${this.name}`
    } else {
      result += `${PARTIALLY_CHECKED}${this.name}`
    }

    return result
  }

  leaves(): TreeSelectNode[] {
    return this.subTree().filter((node) => !node.hasChildren())
  }

  subTree(): TreeSelectNode[] {
    const result: TreeSelectNode[] = []
    const stack: TreeSelectNode[] = [this]

    while (stack.length > 0) {
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
}

function buildTreeSelect(paths: string[]) {
  const tree: TreeSelectNodeMap = new Map<string, TreeSelectNode>()

  for (const path of paths) {
    const labels = [...path]

    let start = 0
    let end = 2

    while (start < end && end < labels.length) {
      const parent: string = labels[start]
      const child: string = labels[end]

      let parentNode = tree.get(parent)

      if (!parentNode) {
        parentNode = new TreeSelectNode(parent)
        tree.set(parent, parentNode)
      }

      let childNode = tree.get(child)

      if (!childNode) {
        childNode = new TreeSelectNode(child)
        tree.set(child, childNode)
      }

      if (childNode && parentNode && !parentNode.children.includes(childNode)) {
        childNode.parent = parentNode
        parentNode.children.push(childNode)
        parentNode.children.sort((a, b) => a.name.localeCompare(b.name, 'en'))
      }

      start = start + 2
      end = end + 2
    }
  }

  return tree
}

function render(tree: Map<string, TreeSelectNode>): string[] {
  const visited = new Set<TreeSelectNode>()
  const results: string[] = []

  for (const [_, node] of tree) {
    traverse(node, visited)
  }

  function traverse(node: TreeSelectNode, visited: Set<TreeSelectNode>) {
    if (visited.has(node)) return

    results.push(node.print())
    visited.add(node)

    const children = node.children

    for (const child of children) {
      traverse(child, visited)
    }
  }

  return results
}

const renderTreeSelect = (paths: string[], clicks: string[]) => {
  const tree = buildTreeSelect(paths)

  for (const select of clicks) {
    tree.get(select)?.click()
  }

  const result = render(tree)

  for (const line of result) {
    console.log(line)
  }
}

const paths = ['A/B/F', 'A/B/D', 'A/B/E', 'A/C', 'X/Y', 'X/Z']
const clicks: string[] = ['A', 'B', 'D', 'E']

console.time('debug')
renderTreeSelect(paths, clicks)
console.timeEnd('debug')
