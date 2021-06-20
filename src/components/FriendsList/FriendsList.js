import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import ListCard from '../ListCard/ListCard';
import {data} from '../../utils/mockData';

class FriendsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            friendsList: data,
            filteredList: data,
            offset: 0,
            perPage: 4,
            currentPage: 0,
            hasError: false,
        }
    }
    componentDidMount() {
        this.handleUpdateListData();
    }
    componentDidUpdate(prevProps, prevState) {
        const { friendsList } = this.state;
        if(friendsList.length !== prevState.friendsList.length) {
            this.handleUpdateListData();
        }
    }
    // Handler for adding friends to a friends list
    onEnterHandler = (e) => {
        const { friendsList, hasError } = this.state;
        const list = [...friendsList];
        if(e.key === 'Enter' && !hasError) {
            list.push({"name": e.target.value, id: (new Date()).getTime()+1});
            e.target.value = '';
            this.setState({friendsList: list, filteredList: list});
        }
    }
    // Handler for adding validation to a friend input
    onChangeHandler = (e) => {
        if(!e.target.value.match(/^[a-z][a-z\s]*$/i)){
            this.setState({hasError: true});
        } else {
            this.setState({hasError: false});
        }
    }
    // Handler for removing friends from a friends list
    removeHandler = (fId) => {
        const { friendsList } = this.state;
        const list = [...friendsList];
        const action = window.confirm("Are you sure want to delete?");
        if(action) {
            const index = list.findIndex(item => item?.id === fId);
            list.splice(index, 1);
            this.setState({
                friendsList: list,
                filteredList: list,
            });
        }
    }
    // Handler for adding a friend to a favourite and sort the list
    favClickHandler = (fId) => {
        const { friendsList } = this.state;
        const list = [...friendsList];
        let hasFavList = list.map((item) => {
            if(item?.id === fId) {
                if(!item?.hasOwnProperty('hasFav')) {
                    item['hasFav'] = true;
                } else {
                    item['hasFav'] = !item['hasFav'];
                }
            }
            return item;
        });
        hasFavList.sort((a,b) => (a?.hasFav === b?.hasFav) ? 0 : a?.hasFav ? -1 : 1);
        this.setState({
            friendsList: hasFavList, 
            filteredList: hasFavList
        }, () => {this.handleUpdateListData()});
    }
    // Handler for searching the friends in a friends list
    onSearchHandler = (e) => {
        const { friendsList } = this.state;
        const list = [...friendsList];
        const {value} = e.target;
        if(value.trim() !== '') {
            const searchList = list.filter((item) => item?.name.toLowerCase().includes(value.toLowerCase()));
            this.setState({filteredList: searchList});
        } else {
            this.setState({filteredList: list});
        }
        if(value.length === 0) {
            this.handleUpdateListData();
        }
    }
    // Handler to update the friends list based on friends legth, pagination
    handleUpdateListData = () => {
        const { friendsList } = this.state;
        const slice = friendsList.slice(this.state.offset, this.state.offset + this.state.perPage);
        this.setState({ filteredList: slice, pageCount: Math.ceil(friendsList.length / this.state.perPage)});
    }
    // Handler to update the friends list based on pagination item click
    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.handleUpdateListData();
        });
    }

    render() {
        const { filteredList, pageCount, hasError } = this.state;
        return (
            <div>
                <div className="search-box">
                    <div className="search-input">
                        <input type="text" name="fSearch" className="form-control" placeholder="Search your friend's name..." onChange={this.onSearchHandler}/>
                    </div>
                </div>
                <div className="friend-list-wrapper">
                    <h2>Friends List</h2>
                    <input type="text" name="fName" className="form-control" placeholder="Enter your friend's name..." onChange={this.onChangeHandler} onKeyDown={this.onEnterHandler}/>
                    { hasError && <p className="no-record">Please enter characters only! </p>}
                    <div className="cards-list-wrap">
                        {filteredList.length > 0 ? filteredList.map((friend) => 
                            <ListCard 
                                key = {friend?.id} 
                                friend = {friend} 
                                removeHandler = {() => this.removeHandler(friend?.id)} 
                                favHandler = {() => this.favClickHandler(friend?.id)} 
                            />
                        ) : <p className="no-record">No records found!</p>}
                    </div>
                </div>
                <div className="pagination-wrap">
                    <ReactPaginate
                        previousLabel={"prev"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={4}
                        onPageChange={this.handlePageClick}
                        disableInitialCallback= {true}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </div>
            </div>
        )
    }
}

export default FriendsList;
