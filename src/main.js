'use strict';

import React from 'react';
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
    this.props.searchSelect(this.state.searchFormBoard, this.state.limit); 
  }
  render() {
    return (
        <form onSubmit={this.handleSubmit}>
        <input
          className='error'
          type='text'
          name='searchFormBoard'
          placeholder='find on reddit board'
          value={this.state.searchFormBoard}
          onChange={this.handleSearchChange}/>
        
          <input
          className='error'
          type='number'
          name='limit'
          placeholder='find on reddit board'
          value={this.state.limit}
          onChange={this.handleLimitChange}/>
          <input type='submit' value='submit'/>
          </form>  
    
    );
  }
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      searchFormBoard: null,
      limit: null,
      errorResponse: null,
      searchError: false,
    };
  
    this.searchSelect = this.searchSelect.bind(this);
    this.renderSearchList = this.renderSearchList.bind(this);
  }

 
  searchSelect(searchFormBoard, limit) {
    return superagent.get(`${apiUrl}/${searchFormBoard}.json?limit=${limit}`)
      .then((response) => {
        this.setState({
          searchFormBoard: response.body,
        });
      });
  }
  renderSearchList(list) {
    if (list !== null) {
      return (
      <ul>
        {list.data.children.map((item, index) => {
          return (
            <li key={index}> 
            <p>{item.data.title}</p>
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
        <h1>Search the Reddit page </h1>
        <RedditSearchForm searchSelect={this.searchSelect}/>
        {
          this.state.errorResponse && this.state.searchError ?
            <div>
              <h2 className='error'>
              {`"${this.state.errorResponse}"`} does not exist. Please make another request.
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
