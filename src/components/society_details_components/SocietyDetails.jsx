//please generate a skeleton component for societydetails component

import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SocietyBlocks from './society_blocks/SocietyBlocks';

class SocietyDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }

  handleTabChange = (e, { activeIndex }) => {
    this.setState({ activeIndex });
  };

  panes = () => [
    {
      menuItem: 'Society Blocks',
      render: () => (
        <Tab.Pane>
          <SocietyBlocks />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Row Houses',
      render: () => (
        <Tab.Pane>
          <div>Row Houses Content</div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Flats',
      render: () => (
        <Tab.Pane>
          <div>Flats Content</div>
        </Tab.Pane>
      ),
    }
  ];

  render() {
    const { activeIndex } = this.state;
    return (
      <div className="society-details" style={{ margin: '20px 40px' }}>
        <Tab
          panes={this.panes()}
          activeIndex={activeIndex}
          onTabChange={this.handleTabChange}
        />
      </div>
    );
  }
}

export default SocietyDetails;
