// src/components/Sidebar.tsx
import Link from "next/link";
import React from "react";

// モックデータ
const items = ["アイテム1", "アイテム2", "アイテム3", "アイテム4", "アイテム5"];

const Sidebar: React.FC = () => {
  return (
    <div className="h-screen w-60 overflow-y-auto bg-gray-800 text-white">
      <Link href="/">
        <button className="w-full border-b border-gray-700 p-4 text-left hover:bg-gray-700 focus:outline-none">
          💪 New Content
        </button>
      </Link>
      <div className="p-4">
        {items.map((item, index) => (
          <button
            key={index}
            className="my-1 w-full rounded p-2 text-left hover:bg-gray-700"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
