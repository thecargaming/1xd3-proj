import React from "react";

export default function RootLayout({ children }: {children: React.ReactNode}) {
    return (
        <html>
            <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width" />
            <link rel="stylesheet" type="text/css" href="style.css" />
            </head>
            <body>
            {children}
            </body>
        </html>

    )
}
