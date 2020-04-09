// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import Layout from '../components/Layout';
import Sidebar from '../components/Sidebar';
import Page from '../components/Page';
import { useSiteMetadata, useLanguagesList } from '../hooks';

const LanguagesListTemplate = () => {
  const { title, subtitle } = useSiteMetadata();
  const languages = useLanguagesList();

  return (
    <Layout title={`Languages - ${title}`} description={subtitle}>
      <Sidebar />
      <Page title="Languages">
        <ul>
          {languages.map((language) => (
            <li key={language.fieldValue}>
              <Link to={`/language/${kebabCase(language.fieldValue)}/`}>
                {language.fieldValue} ({language.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </Page>
    </Layout>
  );
};

export default LanguagesListTemplate;
