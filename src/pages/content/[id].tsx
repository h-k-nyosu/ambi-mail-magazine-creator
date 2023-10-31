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
            {/* <div className="mb-2 flex justify-end">
              <button
                onClick={handleCopy}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none active:bg-blue-800"
              >
                Copy
              </button>
            </div> */}
            <div
              className="h-full w-full overflow-auto border border-gray-200 bg-white p-4"
              contentEditable
              suppressContentEditableWarning
              dangerouslySetInnerHTML={{
                __html: data?.mailContent
                  ? data.mailContent.replace(/\n/g, "<br />")
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
            <div
              key={index}
              className="m-auto mx-5 mb-5 w-11/12 overflow-auto rounded-lg bg-white p-6 shadow-xl"
            >
              <div className="mx-10">
                {contentObj.jobEvidence.map((evidence, index) => (
                  <div key={index}>
                    <div className="mb-2 font-bold">
                      ✅ {evidence.companyName}
                    </div>
                    <div className="mb-2">✅ {evidence.jobName}</div>
                    <hr className="my-2" />
                    <h3 className="font-bold">ここがポイント</h3>
                    {contentObj.attractivePoints.map((point, index) => (
                      <div key={index} className="mb-2 text-left">
                        ✅ {point}
                      </div>
                    ))}
                    <hr className="my-2" />
                    <div className="mb-2">[年　収] ✅ {evidence.income}</div>
                    <div className="mb-2 text-left">
                      [勤務地] ✅ {contentObj.jobLocationEvidence.join("／✅")}
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <a
                    href={contentObj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 text-gray-500 underline "
                  >
                    求人を確認する
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
