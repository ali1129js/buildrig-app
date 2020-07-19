/**
 * @Author: Ali
 * @Date:   2020-06-02T11:00:57+02:00
 * @Last modified by:   Ali
 * @Last modified time: 2020-06-22T11:52:40+02:00
 */
import React, { Component } from "react";
import SideBar from "./components/SideBar";
import Main from "./components/Main";
import Built from "./components/Built";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.state = {
      view: "",
      savedBuilds: {},
      myBuild: {
        cpu: { brand: "", cost: 0 },
        gpu: { brand: "", cost: 0 },
        ram: { brand: "", cost: 0 },
        mb: { brand: "", cost: 0 },
        hdd: { brand: "", cost: 0 },
        hdd2: { brand: "", cost: 0 },
        ps: { brand: "", cost: 0 },
        fan: { brand: "", cost: 0 },
        cas: { brand: "", cost: 0 },
        monitor: { brand: "", cost: 0 },
        extr1: { brand: "", cost: 0 },
        extr2: { brand: "", cost: 0 }
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
      case "hdd":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, hdd: item }
        }));
        break;
      case "hdd2":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, hdd2: item }
        }));
        break;
      case "ps":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, ps: item }
        }));
        break;
      case "monitor":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, monitor: item }
        }));
        break;
      case "fan":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, fan: item }
        }));
        break;
      case "cas":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, cas: item }
        }));
        break;
      case "extr1":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, extr1: item }
        }));
        break;
      case "extr2":
        this.setState(prevState => ({
          myBuild: { ...prevState.myBuild, extr2: item }
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

  saveBuild = () => {
    let saveB1 = this.state.myBuild;
    this.setState({ savedBuilds: saveB1 });
  };

  loadBuild = () => {};

  render() {
    return (
      <div className="container">
        <div className="app">
          <SideBar handleClick={this.handleClick} />
          <div className="main">
            <Main view={this.state.view} updateBuild={this.updateBuild} />
            <Built
              myBuild={this.state.myBuild}
              saveBuild={this.saveBuild}
              savedBuilds={this.state.savedBuilds}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
