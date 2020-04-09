// @flow strict
import { useStaticQuery, graphql } from 'gatsby';

const useLanguaguesList = () => {
  const { allMarkdownRemark } = useStaticQuery(
    graphql`
      query LanguagesListQuery {
        allMarkdownRemark(
          filter: { frontmatter: { template: { eq: "post" }, draft: { ne: true } } }
        ) {
          group(field: frontmatter___language) {
            fieldValue
            totalCount
          }
        }
      }
    `
  );

  return allMarkdownRemark.group;
};

export default useLanguaguesList;
