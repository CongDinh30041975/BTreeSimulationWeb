import BTreeNode from './BTreeNode';

class BTree {
    constructor(t) {
        this.root = null;
        this.t = t; // Bậc tối thiểu (Minimum degree)
    }

    // --- CHỨC NĂNG TÌM KIẾm ---
    search(k, node = this.root) {
        if (!node) return null;

        let i = 0;
        while (i < node.keys.length && k > node.keys[i]) {
            i++;
        }

        if (node.keys[i] === k) return node;
        if (node.leaf) return null;

        return this.search(k, node.children[i]);
    }

    // --- CHỨC NĂNG THÊM (INSERT) ---
    insert(k) {
        if (!this.root) {
            this.root = new BTreeNode(this.t, true);
            this.root.keys[0] = k;
            return;
        }

        // Nếu root đầy, cây sẽ tăng chiều cao
        if (this.root.keys.length === 2 * this.t - 1) {
        let s = new BTreeNode(this.t, false);
        s.children[0] = this.root;
        this.splitChild(s, 0, this.root);

        let i = 0;
        if (s.keys[0] < k) i++;
        this.insertNonFull(s.children[i], k);
        this.root = s;
        } else {
        this.insertNonFull(this.root, k);
        }
    }

    insertNonFull(node, k) {
        let i = node.keys.length - 1;

        if (node.leaf) {
        // Chèn vào node lá
        while (i >= 0 && node.keys[i] > k) {
            i--;
        }
        node.keys.splice(i + 1, 0, k);
        } else {
        // Tìm node con để xuống
        while (i >= 0 && node.keys[i] > k) {
            i--;
        }
        i++;
        if (node.children[i].keys.length === 2 * this.t - 1) {
            this.splitChild(node, i, node.children[i]);
            if (node.keys[i] < k) i++;
        }
        this.insertNonFull(node.children[i], k);
        }
    }

    splitChild(parent, i, fullNode) {
        let t = this.t;
        let newNode = new BTreeNode(t, fullNode.leaf);
        
        // Copy nửa sau của keys sang node mới
        // (Copy the latter half of the keys to the new node)
        newNode.keys = fullNode.keys.splice(t, t - 1);

        // Nếu không phải lá, copy cả con trỏ con
        // (If it's not a leaf, copy the entire child pointer)
        if (!fullNode.leaf) {
        newNode.children = fullNode.children.splice(t, t);
        }

        // Đưa khóa giữa lên node cha
        // (Pass the middle key to the parent node)
        const midKey = fullNode.keys.pop();
        parent.keys.splice(i, 0, midKey);
        parent.children.splice(i + 1, 0, newNode);
    }

    // --- CHỨC NĂNG XÓA (DELETE) ---
    delete(k) {
        if (!this.root) return;
        this._delete(this.root, k);

        if (this.root.keys.length === 0) {
        if (!this.root.leaf) this.root = this.root.children[0];
        else this.root = null;
        }
    }

    _delete(node, k) {
        let idx = node.findKey(k);

        // Trường hợp 1: Khóa k nằm tại node hiện tại
        if (idx < node.keys.length && node.keys[idx] === k) {
            if (node.leaf) {
                // 1a: Node hiện tại là lá -> Xóa trực tiếp
                node.keys.splice(idx, 1);
            } else {
                // 1b: Node hiện tại là node nội bộ
                this.deleteFromNonLeaf(node, idx);
            }
        }  else {
            // Trường hợp 2: Khóa k không nằm ở node hiện tại
            if (node.leaf) {
                return;
            }

            // Kiểm tra xem khóa có nằm ở node con cuối cùng không
            let flag = (idx === node.keys.length);

            // Nếu node con định xuống có ít hơn t khóa, hãy lấp đầy nó
            if (node.children[idx].keys.length < this.t) {
                this.fill(node, idx);
            }

            // Nếu sau khi fill, node con cuối cùng bị gộp, ta xuống node idx-1
            if (flag && idx > node.keys.length) {
                this._delete(node.children[idx - 1], k);
            } else {
                this._delete(node.children[idx], k);
            }
        }
    }

    // Lấy khóa lớn nhất của cây con bên trái
    getPredecessor(node, idx) {
        let cur = node.children[idx];
        while (!cur.leaf) 
            cur = cur.children[cur.children.length - 1];
        return cur.keys[cur.keys.length - 1];
    }

    // Lấy khóa nhỏ nhất của cây con bên phải
    getSuccessor(node, idx) {
        let cur = node.children[idx + 1];
        while (!cur.leaf) 
            cur = cur.children[0];
        return cur.keys[0];
    }

    fill(node, idx) {
        // Mượn từ node anh em bên trái
        if (idx !== 0 && node.children[idx - 1].keys.length >= this.t) {
            this.borrowFromPrev(node, idx);
        }
        // Mượn từ node anh em bên phải
        else if (idx !== node.keys.length && 
            node.children[idx + 1].keys.length >= this.t) {
            this.borrowFromNext(node, idx);
        }
        // Nếu không mượn được thì gộp
        else {
            if (idx !== node.keys.length) this.merge(node, idx);
            else this.merge(node, idx - 1);
        }
    }

    borrowFromPrev(node, idx) {
        let child = node.children[idx];
        let sibling = node.children[idx - 1];

        // Đẩy khóa từ cha xuống đầu node hiện tại
        child.keys.unshift(node.keys[idx - 1]);
        if (!child.leaf) {
            child.children.unshift(sibling.children.pop());
        }

        // Đẩy khóa cuối của anh em lên cha
        node.keys[idx - 1] = sibling.keys.pop();
    }

    borrowFromNext(node, idx) {
        let child = node.children[idx];
        let sibling = node.children[idx + 1];

        child.keys.push(node.keys[idx]);
        if (!child.leaf) {
            child.children.push(sibling.children.shift());
        }

        node.keys[idx] = sibling.keys.shift();
    }

    merge(node, idx) {
        let child = node.children[idx];
        let sibling = node.children[idx + 1];

        // Đưa khóa từ cha vào node trái
        child.keys.push(node.keys[idx]);

        // Gộp tất cả khóa của node phải vào node trái
        child.keys = child.keys.concat(sibling.keys);

        // Gộp tất cả con trỏ con
        if (!child.leaf) {
            child.children = child.children.concat(sibling.children);
        }

        // Xóa khóa và con trỏ dư thừa ở node cha
        node.keys.splice(idx, 1);
        node.children.splice(idx + 1, 1);
    }

    get treeData() {
        if (!this.root) return null;
        return this.root.toJSON();
    }
}

export default BTree;