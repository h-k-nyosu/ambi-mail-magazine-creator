// src/pages/_app.tsx
import { type AppType } from "next/app";
import Sidebar from "~/components/Sidebar"; // サイドバーをインポート
import "~/styles/globals.css";
import { api } from "~/utils/api";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className="flex h-screen">
      <Sidebar /> {/* サイドバーを追加 */}
      <div className="flex-grow">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

export default api.withTRPC(MyApp);
