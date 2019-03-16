import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { THEME_VARIABLES } from '../config';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet();

    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App: any) => (props: any) =>
          sheet.collectStyles(<App {...props} />)
      });

    const initialProps: any = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [...initialProps.styles, ...sheet.getStyleElement()]
    };
  }

  render() {
    return (
      <html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:100,100italic,200,200italic,300,300italic,regular,italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic"
            rel="stylesheet"
          />
          <meta
            name="description"
            content="Place orders right from your phone now from LuncherBox!"
          />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="theme-color"
            content={THEME_VARIABLES['@primary-color']}
          />
          <link rel="apple-touch-icon" href="../static/icon.png" />
          <meta name="apple-mobile-web-app-title" content="LuncherBox" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <link rel="icon" type="image/x-icon" href="../static/favicon.ico" />
          <link rel="manifest" href="../static/manifest.json" />
          <link rel="shortcut icon" href="../static/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="../static/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="../static/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="../static/favicon-16x16.png"
          />
          <link rel="manifest" href="../static/site.webmanifest" />
          <link
            rel="mask-icon"
            href="../static/safari-pinned-tab.svg"
            color={THEME_VARIABLES['@primary-color']}
          />
          <meta name="apple-mobile-web-app-title" content="Luncher Box" />
          <meta name="application-name" content="Luncher Box" />
          <meta
            name="msapplication-TileColor"
            content={THEME_VARIABLES['@primary-color']}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
