import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500&display=swap"
            rel="stylesheet"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500&display=swap"
            rel="stylesheet"
          />
          {
            <link
              href="/manifest.json"
              //@ts-ignore
              crossorigin="use-credentials"
              rel="manifest"
            />
          }
          <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async />
          <meta
            name="Q真相引擎"
            content="习近平，蔡英文，拜登和精英政要，演员们最讨厌的地方."
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
