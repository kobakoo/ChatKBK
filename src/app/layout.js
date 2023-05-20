import './globals.css'

export const metadata = {
  title: 'ChatKBK',
  description: '中学生向けちゃっとwebアプリケーション｜登録不要！今すぐ始められる！',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
