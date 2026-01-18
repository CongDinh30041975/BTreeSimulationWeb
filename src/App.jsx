import { useState } from 'react';
import useTreeStore from './store/BTreeStore';
import TreeVisualizer from './components/Visualization/TreeVisualizer';

function App() {
    const [inputValue, setInputValue] = useState('');
    const { treeData, insertKey, deleteKey, resetTree } = useTreeStore();

    const handleInsert = () => {
        if (inputValue !== '') {
        insertKey(inputValue);
        setInputValue('');
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
        {/* Header & Controls */}
        <header className="p-4 bg-white shadow-md flex gap-4 items-center">
            <h1 className="text-xl font-bold mr-4">B-Tree Visualizer</h1>
            <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="border p-2 rounded w-24"
            placeholder="Value"
            />
            <button onClick={handleInsert} className="bg-blue-600 text-white px-4 py-2 rounded">
            Insert
            </button>
            <button onClick={() => deleteKey(inputValue)} className="bg-red-500 text-white px-4 py-2 rounded">
            Delete
            </button>
            <button onClick={resetTree} className="bg-gray-400 text-white px-4 py-2 rounded">
            Reset
            </button>
        </header>

        {/* Visualization Area */}
        <main className="flex-1 overflow-hidden relative p-8">
            <TreeVisualizer data={treeData} />
        </main>
        </div>
    );
}

export default App;