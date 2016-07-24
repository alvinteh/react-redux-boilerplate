import React from 'react';

import 'scss/components/app';

const App = ({ children }) => (
  <div id="wrapper">
    {children}
  </div>
);

App.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default App;
