export function createMockReply(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (message.includes("3万") || message.includes("30000")) {
    return "毎月3万円なら、まずは生活防衛資金を確保した上で、長期積立を中心に考えるのが分かりやすいです。今日やることは、毎月3万円を自動で分ける口座を決めることです。";
  }

  if (message.includes("副業") || message.includes("収入")) {
    return "副業収入は、生活費に混ぜずに別管理するのがおすすめです。まずは副業収入の50%を資産形成、30%を自己投資、20%を自由費に分けるルールから始めましょう。";
  }

  if (message.includes("リスク") || message.includes("怖い")) {
    return "リスクを抑えたい場合は、いきなり大きく投資するより、少額で慣れることが大切です。今日やることは、無理なく続けられる月額を決めることです。";
  }

  if (normalizedMessage.includes("ai")) {
    return "AIは、銘柄を当てる道具ではなく、行動を整理する伴走者として使うのが現実的です。まずは収入アップ、支出整理、積立継続の3つに分けて考えましょう。";
  }

  return "まずは現在地を整理しましょう。資産形成では、1. 生活防衛資金、2. 毎月の積立額、3. 継続できる仕組みの順番で考えると迷いにくくなります。今日やることは、毎月いくらなら無理なく続けられるかを決めることです。";
}
