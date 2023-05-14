import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
        <link
            rel="stylesheet"
            href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
            />
            <script
            src="https://unpkg.com/react@16/umd/react.development.js"
            crossOrigin
            ></script>
            <script
            src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
            crossOrigin
            ></script>
            <script src="https://unpkg.com/react-quill@1.3.3/dist/react-quill.js"></script>
            <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@500&display=swap" rel="stylesheet" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@500&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
