import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import DashBoard from './Dashboard'

import Sidebar from "react-sidebar";

const mql = window.matchMedia(`(min-width: 800px)`);
 
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false
    };
 
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }
 
  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }
 
  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged);
  }
 
  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }
 
  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }
 
  render() {
    return (
      <Sidebar
        sidebar={<b>Welcome</b>}
        open={this.state.sidebarOpen}
        docked={this.state.sidebarDocked}
        onSetOpen={this.onSetSidebarOpen}
        styles={{marginTop:'90px'}}
      >
        {/* <DashBoard/> */}
        <p>Lots os stuff</p>
      </Sidebar>
    );
  }
}
 
export default SideBar;