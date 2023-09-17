import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      チャットができるアプリだよ。　＊画像も貼れるけど保存期間が30日しかないから気をつけてね
      <br />
      チャットは
      <Link
        href="/chat"
        className="underline underline-offset-2 text-3xl font-bold"
      >
        こちら
      </Link>
    </>
  );
}
