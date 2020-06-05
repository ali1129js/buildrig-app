/**
 * @Author: Ali
 * @Date:   2020-06-02T11:00:57+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-05T09:56:17+02:00
 */
import React, { Component } from "react";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import Built from "./components/Built";
import "./app.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      view: "",
      myBuild: {
        cpu: { brand: "", cost: 0 },
        gpu: { brand: "", cost: 0 },
        ram: { brand: "", cost: 0 },
        mb: { brand: "", cost: 0 }
      }
    };
  }
  handleClick = e => {
    this.setState({ view: e.target.value });
  };
  updateBuild = item => {
    switch (this.state.view) {
      case "cpu":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, cpu: item }
        }));
        break;
      case "gpu":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, gpu: item }
        }));
        break;
      case "mother":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, mb: item }
        }));
        break;
      case "ram":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, ram: item }
        }));
        break;
      default:
        return;
    }
  };
  componentDidMount = () => {
    let myPc = localStorage.getItem("mypcbuild");
    if (myPc) {
      this.setState(JSON.parse(myPc));
    }
  };
  componentDidUpdate = () => {
    let myPc = JSON.stringify(this.state);
    localStorage.setItem("mypcbuild", myPc);
  };
  render() {
    return (
      <div className="container">
        <Built myBuild={this.state.myBuild} />
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
