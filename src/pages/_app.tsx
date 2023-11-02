// src/pages/_app.tsx
import { type AppType } from "next/app";
import Sidebar from "~/components/Sidebar"; // サイドバーをインポート
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-60 flex-grow">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
