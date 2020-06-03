/**
 * @Author: Ali
 * @Date:   2020-06-02T11:00:57+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-03T19:48:34+02:00
 */
import React, { Component } from "react";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import Built from "./components/Built";
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
    cost: { cpu: 0, mb: 0, ram: 0, gpu: 0 }
  };
  handleClick = e => {
    this.setState({ view: e.target.value });
  };
  updateBuild = (item, cost) => {
    console.log("Item is =", item);
    console.log("Price is =", cost);
    switch (this.state.view) {
      case "cpu":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, cpu: item },
          cost: { ...prevState.cost, cpu: cost }
        }));
        break;
      case "gpu":
        this.setState(prevState => ({
          cost: { ...prevState.cost, gpu: cost },
          myBuild: { ...prevState.myBuild, gpu: item }
        }));
        break;
      case "mother":
        this.setState(prevState => ({
          cost: { ...prevState.cost, mb: cost },
          myBuild: { ...prevState.myBuild, mb: item }
        }));
        break;
      case "ram":
        this.setState(prevState => ({
          cost: { ...prevState.cost, ram: cost },
          myBuild: { ...prevState.myBuild, ram: item }
        }));
        break;
      default:
        return;
    }
  };
  componentDidMount = () => {
    let data = localStorage.getItem("mypcbuild");
    if (data) {
      let myBuild = JSON.parse(data);
      this.setState({ myBuild });
    }
  };
  componentDidUpdate = () => {
    let data = JSON.stringify(this.state);
    localStorage.setItem("mypcbuild", data);
  };
  render() {
    return (
      <div className="container">
        <Built />
        <div className="app">
          <SideBar handleClick={this.handleClick} />
          <div className="main">
            <Main view={this.state.view} updateBuild={this.updateBuild} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
