import { expect } from 'chai'
import { TreeSelectNode, TreeSelectState } from '../src/TreeSelectNode'

describe('TreeSelectNode', () => {
    describe('constructor', () => {
        it('should create a node with the given name', () => {
            const node = new TreeSelectNode('A')

            expect(node.name).to.equal('A')
            expect(node.getState()).to.equal(TreeSelectState.Unchecked)
            expect(node.parent).to.equal(undefined)
            expect(node.children).to.deep.equal([])
        })
    })

    describe('toggleState', () => {
        it('should toggle state to Checked', () => {
            const node = new TreeSelectNode('A')
            node.toggleState()

            expect(node.getState()).to.equal(TreeSelectState.Checked)

        })

        it('should toggle state to Unchecked', () => {
            const node = new TreeSelectNode('A', TreeSelectState.Checked)
            node.toggleState()

            expect(node.getState()).to.equal(TreeSelectState.Unchecked)
        })
    })

    describe('click', () => {

        it('leaf node should be Checked', () => {
            const leaf = new TreeSelectNode('A')
            leaf.click()

            expect(leaf.getState()).to.equal(TreeSelectState.Checked)
        })


        it('parent node should be Unchecked', () => {
            const parent = new TreeSelectNode('A', TreeSelectState.PartiallyChecked)
            const leafB = new TreeSelectNode('B')
            const leafC = new TreeSelectNode('C', TreeSelectState.Checked)

            parent.children.push(leafB, leafC)
            leafB.parent = parent
            leafC.parent = parent

            leafC.click()

            expect(leafB.getState()).to.equal(TreeSelectState.Unchecked)
            expect(leafC.getState()).to.equal(TreeSelectState.Unchecked)
            expect(parent.getState()).to.equal(TreeSelectState.Unchecked)
        })

        it('parent node should be Checked', () => {
            const parent = new TreeSelectNode('A')
            const leaf = new TreeSelectNode('B')

            parent.children.push(leaf)
            leaf.parent = parent

            leaf.click()

            expect(leaf.getState()).to.equal(TreeSelectState.Checked)
            expect(parent.getState()).to.equal(TreeSelectState.Checked)
        })

        it('parent node should be PartiallyChecked', () => {

            const parent = new TreeSelectNode('A')
            
            const leafB = new TreeSelectNode('B')
            const leafC = new TreeSelectNode('C')

            parent.children.push(leafB, leafC)
            leafB.parent = parent
            leafC.parent = parent
            

            leafC.click()
       
            expect(leafB.getState()).to.equal(TreeSelectState.Unchecked)
            expect(leafC.getState()).to.equal(TreeSelectState.Checked)
            expect(parent.getState()).to.equal(TreeSelectState.PartiallyChecked)


        })

        it('all nodes should be Unchecked', () => {

            const parent = new TreeSelectNode('A', TreeSelectState.Checked)
            const leafB = new TreeSelectNode('B', TreeSelectState.Checked)
            const leafC = new TreeSelectNode('C', TreeSelectState.Checked)

            parent.children.push(leafB, leafC)
            leafB.parent = parent
            leafC.parent = parent

            parent.click()

            expect(leafB.getState()).to.equal(TreeSelectState.Unchecked)
            expect(leafC.getState()).to.equal(TreeSelectState.Unchecked)
            expect(parent.getState()).to.equal(TreeSelectState.Unchecked)


        })

        it('all nodes should be Checked', () => {

            const parent = new TreeSelectNode('A', TreeSelectState.Unchecked)
            const leafB = new TreeSelectNode('B', TreeSelectState.Unchecked)
            const leafC = new TreeSelectNode('C', TreeSelectState.Unchecked)

            parent.children.push(leafB, leafC)
            leafB.parent = parent
            leafC.parent = parent

            parent.click()

            expect(leafB.getState()).to.equal(TreeSelectState.Checked)
            expect(leafC.getState()).to.equal(TreeSelectState.Checked)
            expect(parent.getState()).to.equal(TreeSelectState.Checked)


        })

        it('all nodes should be Checked', () => {

            const parent = new TreeSelectNode('A', TreeSelectState.PartiallyChecked)
            const leafB = new TreeSelectNode('B', TreeSelectState.Unchecked)
            const leafC = new TreeSelectNode('C', TreeSelectState.Checked)

            parent.children.push(leafB, leafC)
            leafB.parent = parent
            leafC.parent = parent

            parent.click()

            expect(leafB.getState()).to.equal(TreeSelectState.Checked)
            expect(leafC.getState()).to.equal(TreeSelectState.Checked)
            expect(parent.getState()).to.equal(TreeSelectState.Checked)

        })
    })
})