import React, { Component } from 'react';
import axios from 'axios';
import logo from '../logo.svg';
import TweetsColumn from './TweetsColumn';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { formatDate, parseDate } from 'react-day-picker/moment';
import moment from 'moment';

class App extends Component {
  constructor() {
    super();
    this.state = {
      makeschoolInit: [],
      newsycombinatorInit: [],
      ycombinatorInit: [],
      makeschoolDateFiltered: undefined,
      newsycombinatorDateFiltered: undefined,
      ycombinatorDateFiltered: undefined,
      makeschool: undefined,
      newsycombinator: undefined,
      ycombinator: undefined,
      activeTab: 'MakeSchool',
      errorMakeschool: false,
      errorNewsycombinator: false,
      errorYcombinator: false,
      canChangeLayout: false,
      canFilter: false,
      dateFrom: '',
      dateTo: ''
    };
    localStorage.setItem('colNames', JSON.stringify(['MakeSchool', 'Hacker News', 'Y Combinator']));
    localStorage.setItem('colSortedNames', JSON.stringify([]));
    localStorage.setItem('dateFrom', '');
    localStorage.setItem('dateTo', '');
  }

  handleChangeColumn = () => {
    const changeLayoutBtn = document.getElementsByClassName('btn-change-layout')[0];
    let selectValues = [];
    document.querySelectorAll('.form-control').forEach(select => selectValues.push(select.value));
    if (selectValues[0] === selectValues[1] || selectValues[0] === selectValues[2] || selectValues[1] === selectValues[2]) {
      this.setState({ canChangeLayout: false });
      changeLayoutBtn.classList.add('disabled');
    } else {
      localStorage.setItem('colSortedNames', JSON.stringify(selectValues));
      this.setState({ canChangeLayout: true });
      changeLayoutBtn.classList.remove('disabled');
    }
  }

  handleChangeLayout = () => {
    document.querySelectorAll('.col-tweets').forEach(
      col => {
        let name = col.getAttribute('data-name');
        let colIndex = JSON.parse(localStorage.getItem('colSortedNames')).indexOf(name) + 1;
        let orderClass = Array.from(col.classList).filter(name => name.indexOf('order') !== -1 && name).toString();
        
        orderClass && col.classList.remove(orderClass);
        col.classList.add('order-' + colIndex);
      }
    )
  }

  handleDateFromChange = (selectedDay) => {
    localStorage.setItem('dateFrom', selectedDay);

    let dateFrom = localStorage.getItem('dateFrom') ? new Date(localStorage.getItem('dateFrom')).getTime() : undefined;
    let dateTo = localStorage.getItem('dateTo') ? new Date(localStorage.getItem('dateTo')).getTime() : undefined;
    const filterBtn = document.getElementsByClassName('btn-filter-by-date-range')[0];

    if (typeof dateFrom !== undefined && typeof dateTo !== undefined && dateFrom <= dateTo) {
      this.setState({
        dateFrom: selectedDay,
        canFilter: true 
      });
      filterBtn.classList.remove('disabled');
    } else {
      this.setState({
        dateFrom: selectedDay,
        canFilter: false, 
      });
      filterBtn.classList.add('disabled');
    }
  }

  handleDateToChange = (selectedDay) => {
    localStorage.setItem('dateTo', selectedDay);

    let dateFrom = localStorage.getItem('dateFrom') ? new Date(localStorage.getItem('dateFrom')).getTime() : undefined;
    let dateTo = localStorage.getItem('dateTo') ? new Date(localStorage.getItem('dateTo')).getTime() : undefined;
    const filterBtn = document.getElementsByClassName('btn-filter-by-date-range')[0];

    if (typeof dateFrom !== undefined && typeof dateTo !== undefined && dateFrom <= dateTo) {
      this.setState({
        dateTo: selectedDay,
        canFilter: true 
      });
      filterBtn.classList.remove('disabled');
    } else {
      this.setState({
        dateTo: selectedDay,
        canFilter: false
      });
      filterBtn.classList.add('disabled');
    }
  }

  handleFilterByDateRange = () => {
    let dateFrom = new Date(localStorage.getItem('dateFrom'));
    let dateTo = new Date(localStorage.getItem('dateTo'));

    let makeschoolFiltered = this.state.makeschoolInit.filter(tweet => 
      moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').startOf('day').isSameOrAfter(moment(dateFrom).startOf('day')) && moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').startOf('day').isSameOrBefore(moment(dateTo).startOf('day')) 
    );

    let newsycombinatorFiltered = this.state.newsycombinatorInit.filter(tweet => 
      moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').startOf('day').isSameOrAfter(moment(dateFrom).startOf('day')) && moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').startOf('day').isSameOrBefore(moment(dateTo).startOf('day')) 
    );

    let ycombinatorFiltered = this.state.ycombinatorInit.filter(tweet => 
      moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').startOf('day').isSameOrAfter(moment(dateFrom).startOf('day')) && moment(tweet.created_at, 'ddd MMM DD HH:mm:ss Z YYYY').startOf('day').isSameOrBefore(moment(dateTo).startOf('day')) 
    );

    this.setState({ 
      makeschoolDateFiltered: makeschoolFiltered,
      newsycombinatorDateFiltered: newsycombinatorFiltered,
      ycombinatorDateFiltered: ycombinatorFiltered,
      makeschool: makeschoolFiltered,
      newsycombinator: newsycombinatorFiltered,
      ycombinator: ycombinatorFiltered
    });

    document.querySelectorAll('.tweets-number').forEach(input => input.value = '');
  }

  handleChangeTweetsNumber = (e) => {
    console.log(this.state);
    let number = e.target.value;
    if (number < 0) e.target.value = 0;
    if (number > 30) e.target.value = 30;
    if (e.target.getAttribute('data-col-name') === 'MakeSchool') {
      if (typeof this.state.makeschool !== 'undefined' && typeof this.state.makeschoolDateFiltered !== 'undefined') {
        this.setState({ makeschool: this.state.makeschoolDateFiltered.slice(0, number) });
      } else {
        this.setState({ makeschool: this.state.makeschoolInit.slice(0, number) });
      }
    } else if (e.target.getAttribute('data-col-name') === 'Hacker News') {
      if (typeof this.state.newsycombinator !== 'undefined' && typeof this.state.newsycombinatorDateFiltered !== 'undefined') {
        this.setState({ newsycombinator: this.state.newsycombinatorDateFiltered.slice(0, number) });
      } else {
        this.setState({ newsycombinator: this.state.newsycombinatorInit.slice(0, number) });
      }
    } else if (e.target.getAttribute('data-col-name') === 'Y Combinator') {
      if (typeof this.state.ycombinator !== 'undefined' && typeof this.state.ycombinatorDateFiltered !== 'undefined') {
        this.setState({ ycombinator: this.state.ycombinatorDateFiltered.slice(0, number) });
      } else {
        this.setState({ ycombinator: this.state.ycombinatorInit.slice(0, number) });
      }
    }
  }

  handleResetFilters = () => {
    document.querySelectorAll('.col-tweets').forEach(
      col => {
        let name = col.getAttribute('data-name');
        let colIndex = JSON.parse(localStorage.getItem('colNames')).indexOf(name) + 1;
        let orderClass = Array.from(col.classList).filter(name => name.indexOf('order') !== -1 && name).toString();
        
        orderClass && col.classList.remove(orderClass);
        col.classList.add('order-' + colIndex);
      }
    )
    document.querySelectorAll('.tweets-number').forEach( input => input.value = '' );
    localStorage.setItem('dateFrom', '');
    localStorage.setItem('dateTo', '');
    document.getElementsByClassName('btn-filter-by-date-range')[0].classList.add('disabled');
    this.setState({
      makeschool: undefined,
      newsycombinator: undefined,
      ycombinator: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      canFilter: false
    });
  }

  handleActiveColumn = (e) => {
    let colName = e.target.getAttribute('data-col-name');
    if (this.state.activeTab !== colName) {
      this.setState({ activeTab: colName })
    }
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:7890/1.1/statuses/user_timeline.json?count=30&screen_name=makeschool');
      const json = await response;
      this.setState({ makeschoolInit: json.data });
    } catch (error) {
      this.setState({ errorMakeschool: error.message });
    }

    try {
      const response = await axios.get('http://localhost:7890/1.1/statuses/user_timeline.json?count=30&screen_name=newsycombinator');
      const json = await response;
      this.setState({ newsycombinatorInit: json.data });
    } catch (error) {
      this.setState({ errorNewsycombinator: error.message });
    }

    try {
      const response = await axios.get('http://localhost:7890/1.1/statuses/user_timeline.json?count=30&screen_name=ycombinator');
      const json = await response;
      this.setState({ ycombinatorInit: json.data });
    } catch (error) {
      this.setState({ errorYcombinator: error.message });
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <nav className="navbar navbar-light bg-light justify-content-center">
            <a className="navbar-brand" href="/">
              <img src={logo} width="32" height="32" alt="logo" />
            </a>
          </nav>
        </header>
        <main className="container mt-4 mb-2">
          <div className="row layout-editor d-none d-md-flex">
            <div className="col">
              <div className="form-group">
                <select className="form-control" onChange={this.handleChangeColumn}>
                  {
                    JSON.parse(localStorage.getItem('colNames')).map((name, key) => (
                      <option key={key}>{name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <select className="form-control" onChange={this.handleChangeColumn}>
                  {
                    JSON.parse(localStorage.getItem('colNames')).map((name, key) => (
                      <option key={key}>{name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <select className="form-control" onChange={this.handleChangeColumn}>
                  {
                    JSON.parse(localStorage.getItem('colNames')).map((name, key) => (
                      <option key={key}>{name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
            <div className="col">
              <button className="btn btn-primary btn-block mb-2 btn-change-layout disabled" onClick={this.handleChangeLayout} disabled={!this.state.canChangeLayout}>Change layout</button>
            </div>
          </div>

          <div className="row date-filter">
            <div className="col-12 col-sm-12">
              <p className="text-muted text-left text-md-right mt-1 mb-2">Filter by date range</p>
            </div>
            <div className="col-6 col-sm-4">
              <div className="form-group">
                <DayPickerInput
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="DD-MM-YYYY"
                  placeholder={`${formatDate(new Date(), 'DD-MM-YYYY')}`}
                  onDayChange={this.handleDateFromChange}
                  value={this.state.dateFrom}
                />
              </div>
            </div>
            <div className="col-6 col-sm-4">
              <div className="form-group">
                <DayPickerInput
                  formatDate={formatDate}
                  parseDate={parseDate}
                  format="DD-MM-YYYY"
                  placeholder={`${formatDate(new Date(), 'DD-MM-YYYY')}`}
                  onDayChange={this.handleDateToChange}
                  value={this.state.dateTo}
                />
              </div>
            </div>
            <div className="col-6 offset-6 col-sm-4 offset-sm-0">
              <button className="btn btn-primary btn-block mb-3 mb-sm-2 btn-filter-by-date-range disabled" onClick={this.handleFilterByDateRange} disabled={!this.state.canFilter}>Filter</button>
            </div>
          </div>

          <div className="row">
            <div className="col-6 offset-6 col-sm-4 offset-sm-8">
              <button type="button" className="btn btn-outline-danger btn-block mb-2" onClick={this.handleResetFilters}>Reset all</button>
            </div>
          </div>

          <div className="row d-md-none">
            <div className="col-12">
              <p className="text-muted text-left mt-1 mb-2">Active column panel</p>
            </div>
            <div className="col-12 col-sm-4 mb-2 mb-sm-0">
              <button type="button" className={this.state.activeTab === 'MakeSchool' ? 'btn btn-primary btn-block' : 'btn btn-outline-primary btn-block'} data-col-name="MakeSchool" onClick={this.handleActiveColumn}>MakeSchool</button>
            </div>
            <div className="col-12 col-sm-4 mb-2 mb-sm-0">
              <button type="button" className={this.state.activeTab === 'Hacker News' ? 'btn btn-primary btn-block' : 'btn btn-outline-primary btn-block'} data-col-name="Hacker News" onClick={this.handleActiveColumn}>Hacker News</button>
            </div>
            <div className="col-12 col-sm-4 mb-2 mb-sm-0">
              <button type="button" className={this.state.activeTab === 'Y Combinator' ? 'btn btn-primary btn-block' : 'btn btn-outline-primary btn-block'} data-col-name="Y Combinator" onClick={this.handleActiveColumn}>Y Combinator</button>
            </div>
          </div>

          <div className="row">

            <TweetsColumn name={'MakeSchool'} activeName={this.state.activeTab} tweets={this.state.makeschool ? this.state.makeschool : this.state.makeschoolInit} error={this.state.errorMakeschool} changeTweetsNumber={this.handleChangeTweetsNumber} />
            <TweetsColumn name={'Hacker News'} activeName={this.state.activeTab} tweets={this.state.newsycombinator ? this.state.newsycombinator : this.state.newsycombinatorInit} error={this.state.errorNewsycombinator} changeTweetsNumber={this.handleChangeTweetsNumber} />
            <TweetsColumn name={'Y Combinator'} activeName={this.state.activeTab} tweets={this.state.ycombinator ? this.state.ycombinator : this.state.ycombinatorInit} error={this.state.errorYcombinator} changeTweetsNumber={this.handleChangeTweetsNumber} />

          </div>
        </main>
      </div>
    );
  }
}

export default App;
