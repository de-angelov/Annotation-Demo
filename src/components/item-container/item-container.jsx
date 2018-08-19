import React, { Component } from 'react';
import Item from '../item/item';
import uuidV4  from 'uuid/v4';

export default class ItemContainer extends Component {
  constructor (props){
    super(props);
    this.state ={
      draggedComponent:{},
      items: [],
      height: 0,
      width: 0,
      xMouse: 0,
      yMouse: 0,
    };

    this.endMoveComponent =  this.endMoveComponent.bind(this);
    this.startMoveComponent = this.startMoveComponent.bind(this);
    this.setMouseXY = this.setMouseXY.bind(this);
    this.getStorage = this.getStorage.bind(this);
    this.setStorage = this.setStorage.bind(this);
    this.deleteComponent = this.deleteComponent.bind(this);
    this.addComponent = this.addComponent.bind(this);
    this.changeComponent = this.changeComponent.bind(this);
  }

  componentDidUpdate(){
  this.setStorage()
  }

  componentDidMount(){
    this.getStorage();
  }

  setMouseXY(e){
    e.preventDefault();
    this.setState({ xMouse: e.pageX, yMouse: e.pageY });
  }

  getStorage(){
    const contents = Object.values(JSON.parse(localStorage.getItem('contents'))|| []);
    const id = Object.values(JSON.parse(localStorage.getItem('id')) || []);
    const xPos = Object.values(JSON.parse(localStorage.getItem('xPos')) || []);
    const yPos = Object.values(JSON.parse(localStorage.getItem('yPos')) || []);
    const storage = contents.map((x, i)=> ({ 
      id: id[i], 
      contents: contents[i] , 
      xPos: xPos[i], 
      yPos: yPos[i]
    }))
    this.setState({ items: storage });
  }

  setStorage(){
    const contents = JSON.stringify(Object.assign({}, this.state.items.map(x=>x.contents)));
    const id = JSON.stringify(Object.assign({}, this.state.items.map(x=>x.id)));
    const xPos = JSON.stringify(Object.assign({}, this.state.items.map(x=>x.xPos)));
    const yPos = JSON.stringify(Object.assign({}, this.state.items.map(x=>x.yPos)));
    localStorage.setItem('id', id);
    localStorage.setItem('contents', contents);
    localStorage.setItem('xPos', xPos);
    localStorage.setItem('yPos', yPos);
  }

  deleteComponent(component){
    const newItems = this.state.items.filter((item) => {
      return item.id !== component.id ? true : false;
    });
    this.setState({ items: newItems });

  }

  startMoveComponent(component){
    this.setState({ draggedComponent: component});
  }
  
  endMoveComponent() {
    const insertComponent = this.state.draggedComponent;
    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;
    const xPositionPercent = this.state.xMouse / ( width / 100 ) | 0;
    const yPositionPercent = this.state.yMouse / ( height / 100 ) | 0;
    const newItem = {
      id: uuidV4(),
      contents: insertComponent.contents,
      xPos: xPositionPercent,
      yPos: yPositionPercent,
    }
    let newItems = this.state.items.map((item) => {
        return item.id === insertComponent.id ? newItem : item;
    });
    this.setState({ items: newItems , draggedComponent: {} });
  }

  addComponent(){
    const height = this.divElement.clientHeight;
    const width = this.divElement.clientWidth;
    const xPositionPercent = this.state.xMouse / ( width / 100 ) | 0;
    const yPositionPercent = this.state.yMouse / ( height / 100 ) | 0;
    const id = uuidV4();
    const contents = 'Enter Your Text'; 
    const xPos = xPositionPercent;
    const yPos = yPositionPercent;
    const newItems = [...this.state.items, {id, contents, xPos, yPos }];
    this.setState({items: newItems});
  }

  changeComponent(component){
    const newItems = this.state.items.map((item) => {
     return item.id === component.id ? component : item;
    })
    this.setState({ items: newItems });
  }

  render() {
    const items =
      this.state.items.map((item, i) => <Item
        key = {item.id}
        id = {item.id}
        xPos = {item.xPos}
        yPos = {item.yPos}
        contents={item.contents}
        startMoveComponent={this.startMoveComponent}
        changeComponent={this.changeComponent}
        deleteComponent={this.deleteComponent} />)
    return (
      <div > 
      {items}
        <div
          ref={divElement => {this.divElement = divElement}}
          onClick={this.addComponent}
          onDrop={this.endMoveComponent}
          onMouseMove={this.setMouseXY}
          onDragOver={this.setMouseXY}
          className='background'>
          <div className='self-center'> Click To Add Annotation </div>
          <div className='self-center'> Double Click to Expand </div>
          <div className='self-center'> Drag To Move </div>
        </div>
      </div>
    )
  }
} 