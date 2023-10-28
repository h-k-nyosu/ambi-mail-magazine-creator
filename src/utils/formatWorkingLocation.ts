import { Prefecture, populationOrder, prefectures } from "~/utils/prefectures";

export const formatWorkingLocation = (workingLocation: string): string => {
    const foundPrefectures: Prefecture[] = [];
    let isRemote = false;
    let isOverseas = false;

    console.log("workingLocation: " + workingLocation);

    // リモートワークの表現
    const remoteExpressions = ["リモートワーク", "リモート", "テレワーク", "在宅勤務"];
    if (remoteExpressions.some(expression => workingLocation.includes(expression))) {
        isRemote = true;
    }

    // 海外の表現
    const overseasExpressions = ["アメリカ", "ロンドン", "パリ", "北京", "ベルリン", "シドニー", "モスクワ", "ソウル", "バンコク", "イスタンブール", "カイロ", "ニューヨーク", "トロント", "サンパウロ", "メキシコシティ", "モントリオール", "バンクーバー", "ダラス", "シカゴ", "ロサンゼルス", "ワシントンD.C.", "シアトル", "ヒューストン", "ボストン", "マイアミ", "アトランタ", "デンバー", "フィラデルフィア", "フェニックス", "デトロイト", "ミネアポリス", "セントルイス", "シャーロット", "ポートランド", "ピッツバーグ", "シンシナティ", "オーランド", "タンパ", "ニューオーリンズ", "インディアナポリス", "クリーブランド", "カンザスシティ", "ラスベガス", "ナッシュビル", "オースティン", "ローリー", "ミルウォーキー", "バーミンガム", "ハートフォード", "プロビデンス", "リッチモンド", "バッファロー", "オマハ", "ノックスビル", "チャールストン", "グリーンズボロ", "ジャクソンビル", "サンディエゴ", "サンフランシスコ", "オークランド", "サクラメント", "サンノゼ", "ハワイ", "グアム", "サイパン", "バリ", "バンコク", "シンガポール", "クアラルンプール", "ジャカルタ", "マニラ", "ホーチミン", "ハノイ", "ソウル", "上海", "北京", "香港", "台北"];
    if (overseasExpressions.some(expression => workingLocation.includes(expression))) {
        isOverseas = true;
    }

    // 都道府県が含まれているかチェックする
    for (const prefecture of prefectures) {
        if (workingLocation.includes(prefecture.name) || workingLocation.includes(prefecture.shortName) || workingLocation.includes(prefecture.englishName)) {
            foundPrefectures.push(prefecture);
        }
    }

    // 全ての都道府県が存在する場合、または"全国"と表記されている場合は全国とする
    if (foundPrefectures.length === 47 || workingLocation.includes("全国")) {
        return isRemote ? "在宅勤務／全国" : "全国";
    }

    // 人口が多い順に並び替える
    foundPrefectures.sort((a, b) => {
        const aPopulation = populationOrder[a.name] ?? 48;
        const bPopulation = populationOrder[b.name] ?? 48;
        return aPopulation - bPopulation;
    });

    // 全角スラッシュで区切って整形する
    let result = foundPrefectures.map(prefecture => prefecture.name).join("／");

    // リモートワークがある場合は最初に追加
    if (isRemote) {
        result = "在宅勤務／" + result;
    }

    // 海外が含まれている場合は最後に追加
    if (isOverseas) {
        result += "／海外";
    }

    return result;
};