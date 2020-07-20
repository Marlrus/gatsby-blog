module.exports = {
	siteMetadata: {
		title: `Julian's Blog`,
		description: `Testing Gatsby for a Blog`,
		author: `@Marlrus`,
		siteUrl: `http://localhost:8000/`,
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-robots-txt`,
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `images`,
				path: `${__dirname}/src/images`,
			},
		},
		{
			resolve: `gatsby-source-filesystem`,
			options: {
				name: `markdowns`,
				path: `${__dirname}/src/markdown-pages`,
			},
		},
		{
			resolve: `gatsby-transformer-remark`,
			options: {
				plugins: [`gatsby-remark-autolink-headers`],
			},
		},
		`gatsby-transformer-sharp`,
		`gatsby-plugin-styled-components`,
		`gatsby-plugin-sharp`,
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Julian's Blog`,
				short_name: `Julian's Blog`,
				description: `Julian's Gatsby PWA Test Blog`,
				start_url: `/`,
				background_color: `#663399`,
				theme_color: `#663399`,
				display: `standalone`,
				icon: `src/images/fs-icon.png`, // This path is relative to the root of the site.
				icon_options: {
					purpose: `maskable`,
				},
			},
		},
		// this (optional) plugin enables Progressive Web App + Offline functionality
		// To learn more, visit: https://gatsby.dev/offline
		`gatsby-plugin-offline`,
	],
};
