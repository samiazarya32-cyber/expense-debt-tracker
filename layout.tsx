import React from 'react';

export const metadata = {
  title: 'Expense & Debt Tracker',
  description: 'Simple Cash Tracking Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}