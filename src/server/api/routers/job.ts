import axios from "axios";
import { JSDOM } from "jsdom";
import { OpenAI } from 'openai';
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const JobDataSchema = z.object({
  url: z.string(),
  companyName: z.string(),
  jobTitle: z.string(),
  jobIncome: z.string(),
  recruitmentReason: z.string(),
  jobDetail: z.string(),
  mustRequire: z.string(),
  optionalRequire: z.string(),
  employmentStatus: z.string(),
  position: z.string(),
  workingLocation: z.string(),
  workingHours: z.string(),
  textIncome: z.string(),
  benefit: z.string(),
  holiday: z.string(),
  selectionProcess: z.string(),
  companyDetail: z.string(),
});

type JobData = z.infer<typeof JobDataSchema>;


export const jobRouter = createTRPCRouter({
  fetchData: publicProcedure
    .input(z.object({ url: z.string() }))
    .query<JobData>(async ({ input }) => {
      console.log("Fetching URL:", input.url);
      const res = await axios.get(input.url);
      const dom = new JSDOM(res.data);
      const document = dom.window.document;

      const url = input.url;
      const companyName = document.querySelector("#descBase > div > div.descUnit.descUnit--main > div.jobTypeSet.width_650 > div.jobType > span")?.textContent || "";
      const jobTitle = document.querySelector("#descBase > div > div.descUnit.descUnit--main > div.mainArea > div > h1")?.textContent || "";
      const jobIncome = document.querySelector("#descBase > div > div.descUnit.descUnit--main > div.jobTypeSet.width_650 > div.jobIncome > span.data")?.textContent || "";
      const recruitmentReason = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(2)")?.textContent || "";
      const jobDetail = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(4)")?.textContent || "";
      const mustRequire = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(6) > div:nth-child(1) > span.text")?.textContent || "";
      const optionalRequire = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(6) > div:nth-child(2) > span.text")?.textContent || "";
      const employmentStatus = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(8)")?.textContent || "";
      const position = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(10)")?.textContent || "";
      const workingLocation = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(12)")?.textContent || "";
      const workingHours = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(14)")?.textContent || "";
      const textIncome = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(16)")?.textContent || "";
      const benefit = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(18)")?.textContent || "";
      const holiday = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(20)")?.textContent || "";
      const selectionProcess = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--job > div.content > dl > dd:nth-child(22)")?.textContent || "";
      const companyDetail = document.querySelector("#descBase > div > div.descUnit.descUnit--data > div.dataArea.dataArea--company > div.content.width_650 > dl:nth-child(2) > dd")?.textContent || "";

      return {
        url,
        companyName,
        jobTitle,
        jobIncome,
        recruitmentReason,
        jobDetail,
        mustRequire,
        optionalRequire,
        employmentStatus,
        position,
        workingLocation,
        workingHours,
        textIncome,
        benefit,
        holiday,
        selectionProcess,
        companyDetail,
      };
    }),

  createContent: publicProcedure
    .input(z.array(JobDataSchema))
    .mutation<string[]>(async ({ input }) => {
      const processedData: string[] = [];
      for (const job of input) {

        const gptJobNameResponse = await openai.chat.completions.create({
          messages: [
            {
              "role": "system",
              "content": "与えられたテキストの中から、職種のみを抜き出してください。\n\n## 制約\n- 名詞であること\n- 内容を変更しないこと\n- 抜き出すのは一つのみ\n\n\n"
            },
            {
              "role": "user",
              "content": "◇SNSマーケティング企画◇TOPARDS他カラコン有名ブランド◇７期連続増収増益◇"
            },
            {
              "role": "assistant",
              "content": "SNSマーケティング企画"
            },
            {
              "role": "user",
              "content": "SNS/インフルエンサーマーケティング・女性の感性を活かしたプランニングで課題解決【PRプランナー】"
            },
            {
              "role": "assistant",
              "content": "PRプランナー"
            },
            {
              "role": "user",
              "content": job.jobTitle
            },
          ],
          temperature: 0,
          model: 'gpt-3.5-turbo',
        });

        if (gptJobNameResponse.choices[0]?.message.content) {
          console.log(gptJobNameResponse.choices[0]?.message.content)
          const jobContent = "求人タイトル\n " + job.jobTitle + "\n\n" +
            "なぜ募集しているのか\n " + job.recruitmentReason + "\n\n" +
            "どんな仕事か\n " + job.jobDetail + "\n\n" +
            "求められるスキルは\n " + job.mustRequire + "\n\n" +
            "雇用形態は\n " + job.employmentStatus + "\n\n" +
            "どこで働くか\n " + job.workingLocation + "\n\n" +
            "勤務時間は\n " + job.workingHours + "\n\n" +
            "給与はどのくらい貰えるのか\n " + job.textIncome + "\n\n" +
            "待遇福利厚生は\n " + job.benefit + "\n\n" +
            "休日休暇は\n " + job.holiday + "\n\n" +
            "どんな選考プロセスか\n " + job.selectionProcess + "\n\n" +
            "事業内容と会社の特長\n " + job.companyDetail;

          // 求人データの中から訴求情報を抽出する（場合によっては複数）
          const attractiveContentResponse = await openai.chat.completions.create({
            messages: [
              {
                "role": "system",
                "content": "あなたは求職者の気持ちがよく分かるプロの転職エージェントです。求職者が最も魅力的に感じる文章を、与えられた求人内容から抜き出すことがゴールです。\n\n## 求職者ターゲット\n- 25~35歳\n- 社会人経験2~5年目がメイン\n- 前向きなキャリアに挑戦したい指向性\n\n## 魅力的な文言の要素\n- 未経験でも新しいキャリアに挑戦できるチャンスがある\n- 最先端の潮流に乗れる事業領域\n- 裁量権のあるチャンスを掴めるポジション\n- 社会的に意義のあるビジョンがある\n\n## 制約\n- 必ず文章は一言一句そのまま抜粋する\n- 抜き出すのは最大2つの文章のみ\n- 長い一文ではなく、該当箇所を句読点で区切って出力する\n\n## 出力形式\n{魅力的な文章_1}\n{魅力的な文章_2}"
              },
              {
                "role": "user",
                "content": "職種タイトル\nSNS/インフルエンサーマーケティング・女性の感性を活かしたキャスティングで課題解決【メディア担当】\n\nなぜ募集しているのか\nSNSマーケティングにおける、良質な企画であることの１番のポイントは“ユーザー視点”。\n\nプランナー自身がプライベートも楽しみ、それが自然とインプットに繋がることで、世間をワクワクさせる企画を生み出すと考えており、仕事とプライベートをグラデーションできる仲間を募集しています！！！\n\nトレンドセッターであれ！“新しい”を生み出す♡\n\n私たちは、自分の知らない世界を見る事、失敗する事、全ての“新しい”経験が世の中を動かす「トレンドセッター」になると信じています！\n\nどんな仕事か\n「女性の視覚的感性×独自のAIベース」最先端の”トレンド”や”可愛い”を創るクリエイターチーム\n\n【Instagram等のSNSを通じたプロモーション企画（インフルエンサーキャスティング）】\n◆大手メーカーのSNSプロモーション全般\n◆月次インセンティブで頑張りを還元\n◆ベンチャー企業ならではの最速で結果を出せる文化\n\n弊社ではInstagramを活用した提案が８割となっており、女性ならではの「カワイイ」「おしゃれ」のような感覚的なCVやユーザー視点での共感を生みだす企画立案、独自のインフルエンサーデータを活用したキャスティングを強みにしています。\n\n自社独自のキャスティングツールを使用して、プロモーションに最適なインフルエンサーの選定を行い、クライアント様の課題解決をお任せします。インフルエンサーと一緒にクライアントの商品やブランディングにおけるプロモーションを行なっていきます。フォロワー数だけではなく、ブランド・インフルエンサー・オーディエンスの価値観をいかにマッチさせられるか、どのように投稿をするとエンゲージメントが最大化するかを考えるお仕事です。\n\n≪具体的な実績≫\n◆「JM solution ハンドジェル」のPR企画\nお子さんから親御さんまで幅広い世代に人気のあるEXITさんを起用し、オリジナルソング・ダンスを制作。\nInstagramやTwitter、TikTokなどで多くのユーザーから反響があり、ブランディングの向上と同業他社との差別化を実現しました。\n\n◆「ディーマスク」の企業Instagramの開設から企画運用\nInstagramのアカウント運用とインフルエンサーを起用したPRを行い、「インスタで人気の小顔マスク」「不織布マスクでもオシャレ」と話題に！\n\n他にも様々な業界のInstagramアカウントの運用や、PRパーティーの企画・装飾、イメージモデルのキャスティング等SNSの可能性を活かしたプロモーションを行っています。\n\n求められるスキル\n必須\n-人とのコミュニケーションが得意\n-InstagramやTwitter/youtubeなどSNSが大好きな方\n-ベンチャー企業で様々な可能性にチャレンジしてみたい方\n-仕事とプライベートをグラデーションできるマルチタスクタイプ\n歓迎\n広告業界経験者\n\n雇用形態は\n正社員（入社半年は契約社員）\n※待遇に差異はございません\n\n#どんなポジション・役割か\n営業\n\nどこで働くか\n東京都\n\n勤務時間は\n10:00～19:00（実働8時間） フレックスタイム制有り　標準労働時間1日8時間 （コアタイム11:00~17:00)\n\n給与はどのくらい貰えるか\n年収400万円 ～\n月給30万～\n※賞与３か月に一度支給\n※月次インセンティブ支給\n\n待遇・福利厚生は\n◆健康保険\n◆雇用保険\n◆厚生年金\n◆交通費全額支給\n◆キャスティングイベントの参加\n◆プロモーション商品の試供\n◆音楽イベント等の参加&割引\n◆昇給随時\n◆インセンティブ毎月支給\n◆社員旅行\n◆ウォーターサーバー完備\n◆服装/髪型/ネイル自由\n◆プレミアムフライデー\n◆キレイのサポート制度\nヘアケア、ネイル、ジムなどの割引\n\n休日休暇は\n◆完全週休2日制（土・日）、祝日\n◆夏季休暇\n◆冬季休暇\n◆ゴールデンウィーク休暇\n◆有給休暇(まとめて取得可）\n◆慶弔休暇\n◆振休制度\n◆誕生日休暇（誕生月の好きな日に取得可）\n◆プレミアムフライデー（毎月末金曜日）\n◆産前産後休暇\n◆育児休暇\n\nどんな選考プロセスか\n一次面接：オンライン\n二次面接：対面\n　#入社時期は相談可能\n\n\n事業内容・会社の特長\n当事者であり、仕掛け役である”女性の感性”を大切にし、ユーザー・生活者視点で「愛される」企画立案で流行を生み出します！\n\n\"MISSION\"\n～create life of women.～\n世の中の女性が輝き続けられるLIFEを提供する\nすべての女性が生き方に自信と誇りを持ち、自らの生き方に関する意思決定に誇りを持って\n輝くことができる社会を創ります。\n\n”VISION”\n～MOST INFURUENCE GIRL'S COMMUNITY～\n最高にクリエイティブで影響力のある女性コミュニティを創る＝GIRLS CREATIVE TEAM\n自分たちがミッションを体現することで周りの女性達を巻き込み、\n女性の新しい働き方を女性全員で創っていきます。"
              },
              {
                "role": "assistant",
                "content": "インフルエンサーと一緒にクライアントの商品やブランディングにおけるプロモーションを行なっていきます。"
              },
              {
                "role": "user",
                "content": jobContent
              }
            ],
            temperature: 0,
            model: 'gpt-3.5-turbo-16k',
          });

          if (attractiveContentResponse.choices[0]?.message.content) {
            const attractiveContents = attractiveContentResponse.choices[0]?.message.content.split("\n")
            let validAttractiveContent = [];
            for (const content of attractiveContents) {
              if (jobContent.replace(/\n/g, '').replace(/\s/g, '').includes(content)) {
                console.log("✅魅力的な文章の抜粋: " + content);
                validAttractiveContent.push(content);
              }
            }
            //TODO: validAttractiveContentが存在しない場合、retry処理をする
            if (validAttractiveContent[0] && validAttractiveContent[0].length > 30) {
              validAttractiveContent = [validAttractiveContent[0]];
            } else {
              validAttractiveContent = validAttractiveContent.slice(0, 2);
            }

            const formatAttractiveContentResponse = await openai.chat.completions.create({
              messages: [
                {
                  "role": "system",
                  "content": "与えられたテキストの中から、職種のみを抜き出してください。\n\n## 制約\n- 名詞であること\n- 内容を変更しないこと\n- 抜き出すのは一つのみ\n\n\n"
                },
                {
                  "role": "user",
                  "content": "◇SNSマーケティング企画◇TOPARDS他カラコン有名ブランド◇７期連続増収増益◇"
                },
                {
                  "role": "assistant",
                  "content": "SNSマーケティング企画"
                },
                {
                  "role": "user",
                  "content": "SNS/インフルエンサーマーケティング・女性の感性を活かしたプランニングで課題解決【PRプランナー】"
                },
                {
                  "role": "assistant",
                  "content": "PRプランナー"
                },
                {
                  "role": "user",
                  "content": job.jobTitle
                },
              ],
              temperature: 0,
              model: 'gpt-3.5-turbo',
            });

          }
        }
      }
      return processedData;
    })
});