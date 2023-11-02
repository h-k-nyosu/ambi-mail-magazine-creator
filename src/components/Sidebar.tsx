// src/components/Sidebar.tsx
import Link from "next/link";
import React from "react";
import { api } from "~/utils/api";

const Sidebar: React.FC = () => {
  const { data } = api.magazine.fetchList.useQuery();

  return (
    <div className="fixed h-screen w-60 flex-shrink-0 overflow-y-auto bg-gray-800 text-white">
      <Link href="/">
        <button className="w-full border-b border-gray-700 p-4 text-left hover:bg-gray-700 focus:outline-none">
          💪 New Content
        </button>
      </Link>
      <div className="p-4">
        {data?.map((item) => (
          <Link href={`/content/${item.id}`}>
            <button
              key={item.id}
              className="my-1 w-full rounded p-2 text-left hover:bg-gray-700"
            >
              {item.companyName.slice(0, 12)}
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
