'use strict';

import React from 'react';
// import ReactDom from 'react-dom'; this can be done like below
import { render as reactDomRender } from 'react-dom'; 
import superagent from 'superagent';
import '../style/main.scss';

const apiUrl = 'http://www.reddit.com/r';

class RedditSearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: '',
      limit: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleLimitChange = this.handleLimitChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);    
  }

  handleSearchChange(event) {
    this.setState({ searchFormBoard: event.target.value });
  }
  handleLimitChange(event) {
    this.setState({ limit: event.target.value });
  }
  handleSubmit(event) { // on click
    event.preventDefault();
    this.props.searchSelect(this.state.searchFormBoard); 
    // this is a function passed later, htis call for a function, real arguments gets passed in render()
  }
  render() {
    return (
        <form onSubmit={this.handleSubmit}>
        <input
          className='error'
          type='text'
          name='searchFormBoard'
          placeholder='searching for results'
          value={this.state.searchFormBoard}
          onChange={this.handleSearchChange}/>
          {/* <input
          type='number'
          name='limit'
          placeholder='number limit'
          value={this.state.limit}
          onChange={this.handleLimitChange}/> */}
          </form>  
    
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchFormBoard: null,
      limit: null,
      errorResponse: null,
      searchError: false,
    };
  
    this.searchSelect = this.searchSelect.bind(this);
    this.renderSearchList = this.renderSearchList.bind(this);
  }

 
  searchSelect(searchFormBoard) {
    return superagent.get(`http://www.reddit.com/r/${searchFormBoard}.json?limit=5`)
      .then((response) => {
        this.setState({
          searchFormBoard: response.body,

        });
        // console.log(this.state.searchFormBoard);
      })
      .catch(() => {
        this.setState({
          errorResponse: ' no results',
        });
      });
  }
// this is the one to extract: you'll access the argument via this.props.listProperty
  renderSearchList(list) {
    console.log(list);
    if (list !== null) {
      return (
      <ul>
        {list.data.children.map((item, index) => {
          return (
            <li key={index}> 
            <a href={item.data.url}>{item.data.title}
            <p>{item.data.ups}</p>
            </a>
            
            </li>
          );
        })}
      </ul>
      );
    }
    return undefined;
  }

  render() {
    return (
      <section>
        <h1>Search the topic </h1>
        <RedditSearchForm searchSelect={this.searchSelect}/>
        {/* <listComponent listProperty = this.state.searchFormBoard /> */}
        {
          this.state.searchError ?
            <div>
              <h2 className='error'>
              {`"${this.state.searchError}"`} does not exist. Please make another request.
              </h2>
            </div> :
            <div>
                  <h2>Search result for title: </h2>
                   { this.renderSearchList(this.state.searchFormBoard)}
            </div>
        }
        </section>
      
    );
  }
}

const container = document.createElement('div');
document.body.appendChild(container);
reactDomRender(<App/>, container);
