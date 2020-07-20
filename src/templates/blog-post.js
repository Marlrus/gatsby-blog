import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';

import SEO from '../components/seo';

export default ({ data }) => {
	const post = data.markdownRemark;
	const { title } = post.frontmatter;
	return (
		<Layout>
			<SEO title={title} />
			<div>
				<h1>{post.frontmatter.title}</h1>
				<div dangerouslySetInnerHTML={{ __html: post.html }} />
			</div>
		</Layout>
	);
};

export const query = graphql`
	query($slug: String!) {
		markdownRemark(fields: { slug: { eq: $slug } }) {
			html
			frontmatter {
				title
			}
		}
	}
`;
