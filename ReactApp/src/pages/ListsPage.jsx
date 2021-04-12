import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Modal,
} from "react-bootstrap";
import UserContext from "../contexts/userContext";
import Movies from "../components/movies";
import SideBar from "../components/sideBar";
import TopBar from "../components/topBar";
import AddList, { ListDialogue } from "../components/addList";
import RatingDialogue from "../components/ratingDialogue";
import { EntryDialogue } from "../components/list";
import { withRouter } from "react-router";
import Lists from "../components/lists";

class ListsPage extends Component {
  state = {
    showList: false,
    showEntry: false,
    showRating: false,
    lists: [{ list_id: 0, list_name: "", is_private: 0 }],
    selected_list: {},
    refreshEntries: true,
    selected_all: true,
  };

  constructor(props) {
    super(props);
    console.log(props.location);
  }

  showListDialogue = () => {
    this.setState({ showList: true });
  };
  closeListDialogue = () => {
    this.setState({ showList: false });
  };
  showEntryDialogue = (list) => {
    console.log(list);
    this.setState({ selected_list: list, showEntry: true });
  };
  closeEntryDialogue = () => {
    this.setState({ showEntry: false });
  };
  showRatingDialogue = () => {
    this.setState({ showRating: true });
  };
  closeRatingDialogue = () => {
    this.setState({ showRating: false });
  };

  reloadEntries = () => {
    this.state.refreshEntries
      ? this.setState({ refreshEntries: false, selected_all: false })
      : this.setState({ refreshEntries: true, selected_all: false });
  };
  reloadLists = () => {
    this.fetchLists();
  };

  componentDidMount = () => {
    this.fetchLists();
  };

  fetchLists = () => {
    fetch(`http://localhost:5000/users/${this.props.match.params.id}/lists`, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => {
        console.log(response);
        if (response.status != 200) {
          localStorage.setItem("lastLoc", `${this.props.location.pathname}`);
          this.props.history.push("/login");
        }
        return response.json();
      })
      .then((json) => {
        console.log(json);
        if (json.msg != undefined) {
          localStorage.setItem("lastLoc", `${this.props.location.pathname}`);
          this.props.history.push("/login");
        } else {
          if (
            Object.keys(this.state.selected_list).length === 0 &&
            json.length
          ) {
            console.log(Object.keys(this.state.selected_list).length);
            console.log("1");
            console.log(json);
            this.setState({ lists: json, selected_list: json[0] });
          } else {
            console.log(Object.keys(this.state.selected_list).length);
            this.setState({ lists: json });
          }
        }
      })
      .then(() => {
        if (this.props.location.state)
          this.setState({
            selected_list: this.props.location.state.selected_list,
            selected_all: false,
          });
      });
  };
  render() {
    console.log(this.state);
    return (
      <>
        <Container fluid>
          <TopBar />
          <br></br>
          <Row>
            <Col xs={2} id="sidebar-wrapper">
              <SideBar />
            </Col>
            <Col xs={10} id="page-content-wrapper">
              <Container>
                <Lists
                  key={
                    this.state.lists.toString() +
                    " " +
                    this.state.refreshEntries.toString() +
                    " " +
                    this.state.selected_list.toString() +
                    " " +
                    this.state.selected_all.toString()
                  }
                  lists={this.state.lists}
                  selected_list={this.state.selected_list}
                  changeSelected={(list) => {
                    this.setState({ selected_list: list });
                  }}
                  setSelectedAll={(bool)=>this.setState({selected_all: bool})}
                  selected_all={this.state.selected_all}
                  showListDialogue={this.showListDialogue}
                  showEntryDialogue={this.showEntryDialogue}
                  showRatingDialogue={this.showRatingDialogue}
                />
              </Container>
            </Col>
          </Row>
          <ListDialogue
            selected_list={this.state.selected_list}
            show={this.state.showList}
            closeDialogue={this.closeListDialogue}
            reloadPage={this.reloadLists}
          />
          <EntryDialogue
            list={this.state.selected_list}
            show={this.state.showEntry}
            closeDialogue={this.closeEntryDialogue}
            reloadPage={this.reloadEntries}
          />
          <RatingDialogue
            show={this.state.showRating}
            closeDialogue={this.closeRatingDialogue}
            reloadPage={this.reloadEntries}
          />
        </Container>
      </>
    );
  }
}

export default withRouter(ListsPage);
