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

    toJSON() {
        return {
            id: this.id, // ID duy nhất để React/D3 quản lý animation
            keys: [...this.keys], // Copy mảng keys
            isLeaf: this.leaf,
            // Đệ quy: Chuyển đổi tất cả children thành JSON
            children: this.children.map(child => child.toJSON())
        };
    }
}

export default BTreeNode;