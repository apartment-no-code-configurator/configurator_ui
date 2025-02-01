//please generate a skeleton component for societydetails component

import React, { Component } from 'react';
import { Tab } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import SocietyBlocks from './society_blocks/SocietyBlocks';
import Flats from './flats/Flats';
import RowHouseBuildings from './row_house_buildings/RowHouseBuildings';
import Units from './units/Units';

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
          <RowHouseBuildings />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Flats',
      render: () => (
        <Tab.Pane>
          <Flats />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Units',
      render: () => (
        <Tab.Pane>
          <Units />
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
