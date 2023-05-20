import './globals.css'
import { logEvent } from "firebase/analytics";
import {analytics} from "@/lib/FirebaseConfig";

export const metadata = {
  title: 'ChatKBK',
  description: '中学生向けちゃっとwebアプリケーション｜登録不要！今すぐ始められる！',
}

export default function RootLayout({ children }) {
  logEvent(analytics, 'notification_received');
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
