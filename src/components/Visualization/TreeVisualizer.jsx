import React, { useMemo } from 'react';
import * as d3 from 'd3';
import { motion } from 'framer-motion';

const TreeVisualizer = ({ data }) => {
    const dimensions = { 
        width: 800, 
        height: 500, 
        nodeWidth: 80, 
        nodeHeight: 40 
    };

    const nodes = useMemo(() => {
        if (!data) return [];
        // 1. Khởi tạo cấu trúc hierarchy
        const root = d3.hierarchy(data);

        // 2. Định nghĩa kích thước vùng vẽ cây
        const treeLayout = d3.tree().nodeSize([dimensions.nodeWidth + 20, 100]);
        treeLayout(root);

        // 3. Trả về mảng các node đã có tọa độ x, y
        return root.descendants();
    }, [data]);

    return (
        <svg width="100%" height={dimensions.height} viewBox="-400 0 800 500">
        <g>
            {nodes.map((node) => (
            <motion.g
                key={node.data.id}
                initial={false}
                animate={{ x: node.x, y: node.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
                {/* Vẽ hình chữ nhật cho Node */}
                <rect
                width={dimensions.nodeWidth}
                height={dimensions.nodeHeight}
                x={-dimensions.nodeWidth / 2}
                fill="#2563eb"
                rx={5}
                />
                {/* Hiển thị các Keys bên trong Node */}
                <text fill="white" textAnchor="middle" dy="25">
                {node.data.keys.join(' | ')}
                </text>
            </motion.g>
            ))}
        </g>
        </svg>
    );
}