import { create } from 'zustand';
import BTree from '../btree-logic/BTree';

const useTreeStore = create((set, get) => ({
    // Khởi tạo B-Tree với bậc t = 3 (tùy chọn)
    btree: new BTree(3),
    // Dữ liệu thô để React Render
    treeData: null,

    insertKey: (key) => {
        const { btree } = get();
        btree.insert(Number(key));
        // Cập nhật treeData bằng cách clone để React nhận diện thay đổi
        set({ treeData: btree.treeData });
    },

    deleteKey: (key) => {
        const { btree } = get();
        btree.delete(Number(key));
        set({ treeData: btree.treeData });
    },

    resetTree: () => {
        const newTree = new BTree(3);
        set({ btree: newTree, treeData: null });
    }
}));

export default useTreeStore;