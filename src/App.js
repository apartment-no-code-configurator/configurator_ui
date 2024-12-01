import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import { CiMenuFries } from "react-icons/ci";
import Sidebar from 'react-sidebar';
import Home from './components/Home.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import ChatbotList from './components/chatbot_components/ChatbotList.js';
import WorkflowList from './components/workflow_components/WorkflowList.js';
import WorkflowForm from './components/workflow_components/WorkflowForm.js'
import 'devextreme/dist/css/dx.light.css';
import Button from 'devextreme-react/button';
import './App.css';  // Import the CSS for global styles and the App component
import 'beautiful-react-diagrams/styles.css';
import { NAV_ITEMS, MENU_ITEMS, sessionId } from './utils/Constants.jsx';
import FlashMessages from "./components/FlashMessages";
import PageNotFound from "./utils/PageNotFound.jsx";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: false,
    };
  }

  componentDidMount() {
    // Select the dx-license element
    const licenseElement = document.querySelector('dx-license');
    if (licenseElement) {
      // Hide the element
      licenseElement.style.display = 'none';
    }
  }

  onSetSidebarOpen = (open) => {
    this.setState({ sidebarOpen: open });
  };

  renderMenuButton = () => {
    const localStorageToken = localStorage.getItem('apartix_session_id')
    return (localStorageToken && (
      <a className='nav-item menu'>
        <CiMenuFries color='#fff' size={"24px"} onClick={() => this.onSetSidebarOpen(true)} />
      </a>
    ))
  }

  render() {
    const sidebarContent = (
      <div className="sidebar-menu">
        {MENU_ITEMS.map((item) => {
          return (
            <NavLink to={item.link} key={`menu-item_${item.label}`} className="sidebar-menu-item">
              {item.label}
            </NavLink>
          );
        })}
      </div>)
    return (
      <Router>
        <Sidebar
          sidebar={sidebarContent}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "#fff", width: "250px" } }}
        >
          <div className="app-container">
            <FlashMessages errorId="cont-error-message" successId="cont-success-message" />
            <nav className="navbar">
              {this.renderMenuButton()}
              <div className='nav-items'>
                {NAV_ITEMS.map((item) => {
                  return item.link ? (
                    <NavLink to={item.link} key={`nav-item_${item.label}`} className="nav-item">
                      {item.label}
                    </NavLink>
                  ) : (item.action ? (
                    <a href="/" className="nav-item" key={`nav-item_${item.label}`} onClick={item.action} title={item.label}>{item.content}</a>
                  ) : "")
                })}
              </div>
            </nav>
            <div className='page-content'>
              <Routes>
                <Route path="/" element={<Home />} />
                {
                  !sessionId ? (
                    <>
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                    </>
                  ) : ""
                }
                <Route path="/home" element={<Home />} />
                <Route path="/chatbots" element={<ChatbotList />} />
                <Route path="/workflows/:workflowId" element={
                  <WorkflowForm />
                } />
                <Route path="/workflows" element={<WorkflowList />} />
                <Route path="*" element={<PageNotFound />} />
                {/* <Route path="/user_management" element={<UserManagement />} /> */}
                {/* <Route path="/society_details" element={<SocietyDetails />} /> */}
              </Routes>
            </div>
          </div>
        </Sidebar>
      </Router>
    );
  }
}

export default App;
