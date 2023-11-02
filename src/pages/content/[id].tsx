import { useRouter } from "next/router";
import { api } from "~/utils/api";

export default function Result() {
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { data } = api.magazine.fetchContent.useQuery(
    { id: Number(id) },
    { enabled: !!id },
  );

  return (
    <div className="ml-auto w-auto">
      <div className="flex">
        <div className="w-1/2 bg-blue-100 ">
          <div className="flex h-36 items-center justify-center  p-4">
            <h2 className="text-center text-lg font-bold">
              メルマガ内容を生成しました。<br></br>
              右の内容を元に整えてますので、問題がなければコピーして利用してください。
            </h2>
          </div>
          <div className="m-auto w-11/12 overflow-auto rounded-lg bg-white p-4 shadow">
            <div
              className=" overflow-auto border border-gray-200 bg-white p-4"
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
        <div className="w-1/2 overflow-auto bg-green-100">
          <div className="flex h-36  items-center justify-center  p-4">
            <h2 className="text-center text-lg font-bold">
              以下に表示されている文言は、<br></br>
              求人原稿に書かれていることをシステムでチェックしてあります。
            </h2>
          </div>

          {data?.contents.map((contentObj, index) => (
            <div
              key={index}
              className="m-auto mb-5 w-11/12 overflow-auto rounded-lg bg-white p-6 px-5 shadow-xl"
            >
              <div className="px-10">
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
