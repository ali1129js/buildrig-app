/**
 * @Author: Ali
 * @Date:   2020-06-02T11:00:57+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T11:45:40+02:00
 */
import React, { Component } from "react";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import "./app.css";

class App extends Component {
  state = {
    view: "",
    myBuild: {
      cpu: "",
      mb: "",
      ram: "",
      gpu: ""
    },
    cost: {}
  };
  handleClick = e => {
    this.setState({ view: e.target.value });
  };
  updateBuild = item => {
    this.setState({ myBuild: { cpu: item } });
  };
  componentDidMount = () => {
    let data = localStorage.getItem("mypcbuild");
    if (data) {
      let myBuild = JSON.parse(data);
      this.setState({ myBuild });
    }
  };
  componentDidUpdate = () => {
    let data = JSON.stringify(this.state.myBuild);
    localStorage.setItem("mypcbuild", data);
  };
  render() {
    return (
      <div className="container">
        <div className="app">
          <SideBar handleClick={this.handleClick} />
          <Main view={this.state.view} updateBuild={this.updateBuild} />
        </div>
      </div>
    );
  }
}

export default App;
