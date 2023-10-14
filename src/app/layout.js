import './globals.css'

import { Kalam } from 'next/font/google'
 
const kalam = Kalam({
  subsets: ['latin'],
  variable: '--font-kalam',
  weight: '400'
})

export const metadata = {
  title: 'Todo React App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={kalam.className}>{children}</body>
    </html>
  )
}