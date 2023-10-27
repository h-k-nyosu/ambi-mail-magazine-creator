import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Result() {
  const router = useRouter();
  const [data, setData] = useState<string | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(data || "");
    alert("テキストがクリップボードにコピーされました");
  };

  useEffect(() => {
    if (typeof router.query.data === "string") {
      setData(decodeURIComponent(router.query.data));
    } else {
      // サンプルデータを設定
      const data = `▼日本アイ・ビー・エム株式会社
戦略コンサルタント
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
AIやブロックチェーンといった自社の最新技術を活用したコンサルティング業務に携わることができます。

[年 収］600万円～2499万円
[勤務地］東京都
https://en-ambi.com/job/j-489391/?MMID=25657　


▼SAPジャパン株式会社
法人向け営業（未経験／第二新卒可）
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
次世代をリードする人財育成のプログラムからスタートします。ITセールスとしてのキャリアをスタートさせることのできる採用です。

[年 収］600万円～999万円
[勤務地］東京都／大阪府
https://en-ambi.com/job/j-5546742/?MMID=25657　


▼株式会社エヌ・ティ・ティ・データ
法人向け営業（業界未経験可）
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
同社の地図・空間情報クラウドサービスを中心としたソリューションを軸に、エンタープライズ向けへ業務効率化や、データドリブン経営を支援に向けた提案活動を実施する。

[年 収］450万円～1349万円
[勤務地］東京都
https://en-ambi.com/job/j-4463653/?MMID=25657　


▼日本郵船株式会社
総合職（未経験・第二新卒可）
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
海運事業の基本知識を身に着けながら、人材・物資・資金・情報といったあらゆる経営資源を活用しビジネスを推進していただきます。

[年 収］900万円～1499万円
[勤務地］国内／海外
https://en-ambi.com/job/j-4357096/?MMID=25657　


▼株式会社セールスフォース・ジャパン
　法人向け営業
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
同部署に置ける提案先のほとんどはCEOクラスとなり、経営に直結する提案スキルを身につけることができます。

[年　収］850万円～1149万円
[勤務地］東京都
https://en-ambi.com/job/j-78342/?MMID=25657　


▼M&Aキャピタルパートナーズ株式会社
M&Aアドバイザー（未経験可）
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
実際のM&Aアドバイザーが同社について語るイベントが開催されます。ご興味のある方のご応募を歓迎しています。

[年　収］400万円～9999万円
[勤務地］東京都
https://en-ambi.com/job/j-4997419/?MMID=25657　


▼エムスリー株式会社
事業企画（未経験可）
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
新規事業開発やプロジェクトの企画から運用まで総合的に推進いただきます。未経験であっても、「自分でサービスをつくってみたい」という方のご応募をお待ちしています。

[年 収］600万円～1999万円
[勤務地］東京都／大阪府
https://en-ambi.com/job/j-5337284/?MMID=25657　


▼UUUM株式会社
マネージャー（未経験可）
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
人気YouTuberの「東海オンエア」のバディとして動画制作等の活動に関わり、サポートしていただくポジションです。

[年　収］400万円～499万円
[勤務地］愛知県岡崎市
https://en-ambi.com/job/j-5651630/?MMID=25657　


▼株式会社集英社ゲームズ
マーケティング
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
集英社ゲームズで開発を進めるゲームプロジェクトのプロモーション施策のマネジメントをお任せいたします。

[年 収］500万円～749万円
[勤務地］東京都
https://en-ambi.com/job/j-4271109/?MMID=25657　


▼menu株式会社
事業開発（未経験可）
￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣￣
[ここがポイント］
「新しい当たり前を作り続け」、「世界一の企業へ」というビジョンを実現するために、ビジネスディベロップメント職として新規事業の立ち上げに関わっていただきます。

[年　収］600万円～1299万円
[勤務地］東京都新宿区
https://en-ambi.com/job/j-1805270/?MMID=25657　`;
      setData(data);
    }
  }, [router.query.data]);

  return (
    <div className="flex">
      <div className="w-1/2 bg-blue-100">
        <div className="flex h-36 items-center justify-center  p-4">
          <h2 className="text-center text-lg font-bold">
            メルマガ内容を生成しました。<br></br>
            右の内容を元に整えてますので、問題がなければコピーして利用してください。
          </h2>
        </div>
        <div className="m-auto w-11/12 overflow-auto rounded-lg bg-white p-4 shadow">
          <div className="mb-2 flex justify-end">
            <button
              onClick={handleCopy}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none active:bg-blue-800"
            >
              Copy
            </button>
          </div>
          <div
            className="h-full w-full overflow-auto border border-gray-200 bg-white p-4"
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={{
              __html: data ? data.replace(/\n/g, "<br />") : "",
            }}
          />
        </div>
      </div>
      <div className="w-1/2 overflow-auto bg-green-100">
        <div className="flex h-36 items-center justify-center  p-4">
          <h2 className="text-center text-lg font-bold">
            以下に表示されている文言は、<br></br>
            求人原稿に書かれていることをシステムでチェックしてあります。
          </h2>
        </div>
        <div className="m-auto w-11/12 overflow-auto rounded-lg bg-white p-4 shadow">
          {data}
        </div>
      </div>
    </div>
  );
}
