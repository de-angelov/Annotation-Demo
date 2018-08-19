import React, { Component } from 'react';
import ContentEditable from "react-sane-contenteditable";
import ReactDOM from 'react-dom';
export default class Item extends Component {
 
  constructor(props){
    super(props);
    this.state = {
      id: props.id,
      contents: props.contents,
      xPos: props.xPos,
      yPos: props.yPos,
      edit: false,
      isSmall:true,
    }

    this.openLargeComponent = this.openLargeComponent.bind(this);
    this.closeLargeComponent = this.closeLargeComponent.bind(this);
    this.startDrag = this.startDrag.bind(this);
    this.startEditingComponent = this.startEditingComponent.bind(this);
    this.stopEditingComponent = this.stopEditingComponent.bind(this);
    this.updateEditingComponent = this.updateEditingComponent.bind(this);
    this.deleteEditingComponent = this.deleteEditingComponent.bind(this);
  }

  openLargeComponent(){
    this.setState({ isSmall: false, edit: false });
  }

  closeLargeComponent(){
    this.setState({ isSmall: true, edit: false })
  }

  startEditingComponent(){
    this.setState({ isSmall: false, edit: true});
    console.log(this.refs.contents)
    // ReactDOM.findDOMNode(this.refs.contents).focus();
  }

  stopEditingComponent(){
    this.setState( { edit: false } );
    const component  = { 
      id: this.state.id, 
      contents: this.state.contents,
      xPos: this.state.xPos,
      yPos: this.state.yPos,
    }
    this.props.changeComponent(component);
  }

  updateEditingComponent(e, value){
    this.setState({ contents: value });
  }

  deleteEditingComponent(){
    this.props.deleteComponent({ id: this.state.id, contents: this.state.contents });
  }

  startDrag(e){
    e.dataTransfer.setData("text", e.target.id);
    this.props.startMoveComponent({ id: this.state.id, contents: this.state.contents });
  }
  render() {
    const stylePosition = {
      position: 'fixed',
      top: `${this.state.yPos}%`,
      left: `${this.state.xPos}%`,
    }

    const smallContent = <div 
    className='mark' 
    onDoubleClick={this.openLargeComponent}
    draggable='true'
    onDragStart = {this.startDrag}
    style={stylePosition} />

    const  nonEditableContent =
    <div 
    className='item'
    style={stylePosition} >
    <div className='contents'> { this.state.contents } </div>
    <div className='edit-buttons'>
          <button onClick={this.closeLargeComponent }>Close</button>
          <button onClick={ this.startEditingComponent }>Edit</button>
          <button onClick={ this.deleteEditingComponent}>Delete</button>
    </div>
    </div>

    const  editableContent = 
      <div
       className='edited-item'
       style={stylePosition}>
          <ContentEditable 
          ref='contents'
          tagName='div'
          content={this.state.contents}
          className='contents'
          editable={true}
          maxLength={200}
          multiLine={true}
          onChange={this.updateEditingComponent}
          />
        <div className='edit-buttons'>
          <button onClick={ this.stopEditingComponent }>Accept</button>
        </div>
      </div>;

    const result =
    this.state.isSmall ?
    smallContent :
    this.state.edit ?
    editableContent :
    nonEditableContent;
    return result;
 
  }
}
