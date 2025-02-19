import Document, { Html, Head, Main, NextScript } from "next/document";
import BLOG from "@/blog.config";

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx);
		return { ...initialProps };
	}

	render() {
		return (
			<Html lang={BLOG.lang}>
				<Head>
					<link rel="icon" href="/favicon.ico" />
					<link rel="icon" href="/avatar.webp" type="image/webp" />
					<link
						rel="apple-touch-icon"
						sizes="192x192"
						href="/favicon.png"
					></link>
					<link
						rel="alternate"
						type="application/rss+xml"
						title="RSS 2.0"
						href="/feed"
					></link>
					{BLOG.appearance === "auto" ? (
						<>
							<meta
								name="theme-color"
								content={BLOG.lightBackground}
								media="(prefers-color-scheme: light)"
							/>
							<meta
								name="theme-color"
								content={BLOG.darkBackground}
								media="(prefers-color-scheme: dark)"
							/>
						</>
					) : (
						<meta
							name="theme-color"
							content={
								BLOG.appearance === "dark"
									? BLOG.darkBackground
									: BLOG.lightBackground
							}
						/>
					)}
					<script
						async
						src="https://www.googletagmanager.com/gtag/js?id=G-X24FHE7LJL"
					/>
					<script
						dangerouslySetInnerHTML={{
							__html: ` window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-X24FHE7LJL');`,
						}}
					/>
				</Head>
				<body className="bg-day dark:bg-night">
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
