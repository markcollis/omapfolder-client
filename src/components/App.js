import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { I18nProvider } from '@lingui/react';
import catalogCs from '../locales/cs/messages';
import catalogEn from '../locales/en/messages';
import './App.css';

const catalogs = { cs: catalogCs, en: catalogEn };
const App = ({ children, config }) => {
  const { language } = config;
  return (
    <I18nProvider language={language} catalogs={catalogs}>
      <div className="app ui container">
        {children}
      </div>
    </I18nProvider>
  );
};

App.propTypes = {
  children: PropTypes.node.isRequired,
  config: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapStateToProps = ({ config }) => {
  return { config };
};
export default connect(mapStateToProps)(App);
