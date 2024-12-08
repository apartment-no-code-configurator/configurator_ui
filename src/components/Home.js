import React, { Component } from 'react';
import './../styling/Home.css';

class Home extends Component {
  render() {
    return (
      <div className="home-container">
        {/* Section 1: Welcome */}
        <div className='home1-container'>
          <div className='home1-para'>
          <h1>Welcome to <br />Apartix</h1>
          </div>
          <div className='home2-container'>
            <p>Welcome to Apartix, where managing your property-related tasks has never been easier. </p>
          </div>
        </div>

        {/* Section 2: Features */}
        <div className='home3-container'>
          <h2>What we do:</h2>
          <div className='home3-content'>
            <p>Our platform offers a wide range of features designed to help you manage your property effectively, including:</p>
            
          </div>
        </div>

        {/* Section 3: Contact Us */}
        <div className='home4-container'>
          <h2>Know more</h2>
          <div className='home4-content'>
            <p>Have any questions or need assistance? Get in touch with us:</p>
            <div className='cards'>
              <div className='card'>
                <h3>For Management committee</h3></div>
              <div className='card'>
                <h3>For Residents</h3></div>
              <div className='card'>
                <h3>For Vendor employees</h3></div>
              <div className='card'>
                <h3>For property owners</h3></div>
              </div>
              </div>
              </div>
              </div>
           
    );
  }
}

export default Home;
