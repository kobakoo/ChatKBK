import './globals.css'
import { logEvent } from "firebase/analytics";

export const metadata = {
  description: '中学生向けのチャットWebアプリケーションをご紹介します。このアプリケーションは、登録不要で簡単に利用することができます。中学生の皆さんは、このアプリを使って友達とリアルタイムでチャットを楽しむことができます！',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
