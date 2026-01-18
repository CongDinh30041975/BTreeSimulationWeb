class BTreeNode {
    constructor(t, leaf) {
        this.t = t;          // Minimum degree
        this.leaf = leaf;    // Boolean
        this.keys = [];
        this.children = [];  
    }

    // Find key >= k
    findKey(k) {
        let idx = 0;
        while (idx < this.keys.length && this.keys[idx] < k) {
            idx++;
        }
        return idx;
    }
}

export default BTreeNode;