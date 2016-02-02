'use strict';

import React from 'react';

class <%= cName %> extends React.Component {
  static propTypes = {
  };

  render() {
    return(<div className="<%= cName %>-Container">Hello from <%= cName %></div>);
  }
}

export default <%= cName %>;
