export async function GET({ url }) {
    return new Response(
        `
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset
			xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
			xmlns:xhtml="https://www.w3.org/1999/xhtml"
			xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
			xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
			xmlns:image="https://www.google.com/schemas/sitemap-images/1.1"
			xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
		>
			<url>
				<loc>${url.origin}/</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
				<changefreq>monthly</changefreq>
				<priority>1.0</priority>
			</url>
			<url>
				<loc>${url.origin}/docs</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
				<changefreq>monthly</changefreq>
				<priority>0.5</priority>
			</url>
			<url>
				<loc>${url.origin}/privacy</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
				<changefreq>monthly</changefreq>
				<priority>0.3</priority>
			</url>
			<url>
				<loc>${url.origin}/terms</loc>
				<lastmod>${new Date().toISOString()}</lastmod>
				<changefreq>monthly</changefreq>
				<priority>0.3</priority>
			</url>
		</urlset>`.trim(),
        {
            headers: {
                'Content-Type': 'application/xml'
            }
        }
    );
}
