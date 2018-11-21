import React from 'react';

import withAuthorization from './withAuthorization';

const HomePage = () =>
  <div>
    <h1>Home Page</h1>
  </div>

const authCondition = (authUser) =>
  !!authUser;

export default withAuthorization(authCondition)(HomePage);
