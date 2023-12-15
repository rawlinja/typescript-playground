import { TreeSelectNode } from './TreeSelectNode'

type TreeSelectNodeMap = Map<string, TreeSelectNode>

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
