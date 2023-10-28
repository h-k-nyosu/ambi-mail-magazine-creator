import Link from "next/link";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Result() {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { data } = api.job.fetchNewsletterContent.useQuery(
    { id: Number(id) },
    { enabled: !!id },
  );

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      data?.contents.map((content) => content.content).join("\n")
        ? data.contents.map((content) => content.content).join("\n\n\n")
        : "",
    );
    alert("テキストがクリップボードにコピーされました");
  };

  return (
    <div className="min-h-full">
      <div className="shadow-offset-bottom-right w-full bg-white p-4 shadow-lg">
        <Link
          href="/"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        >
          ホームに戻る
        </Link>
      </div>
      <div className="flex">
        <div className="min-h-full w-1/2 bg-blue-100 ">
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
                __html: data?.contents
                  .map((content) => content.content)
                  .join("<br />")
                  ? data.contents
                      .map((content) => content.content)
                      .join("<br /><br /><br />")
                      .replace(/\n/g, "<br />")
                  : "",
              }}
            />
          </div>
        </div>
        <div className="min-h-full w-1/2 overflow-auto bg-green-100">
          <div className="flex h-36 items-center justify-center  p-4">
            <h2 className="text-center text-lg font-bold">
              以下に表示されている文言は、<br></br>
              求人原稿に書かれていることをシステムでチェックしてあります。
            </h2>
          </div>

          {data?.contents.map((contentObj, index) => (
            <div className="m-auto mx-5 mb-5 w-11/12 overflow-auto rounded-lg bg-white p-4 shadow">
              <div key={index} className="mx-10">
                <h3 className="text-left text-lg font-bold">会社名</h3>
                <div className="mb-4">✅ {contentObj.companyName}</div>
                <h3 className="text-lg font-bold">ここがポイント</h3>
                {contentObj.attractivePoints.map((excerpt, index) => (
                  <div key={index} className=" text-left">
                    ✅ {excerpt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
