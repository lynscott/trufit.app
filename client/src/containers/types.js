import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectType } from '../actions/index'
import { bindActionCreators } from 'redux'

class TypeList extends Component {
  renderList() {
    return this.props.types.map(type => {
      return (
        <li
          key={type.type}
          onClick={() => this.props.selectType(type)}
          style={{backgroundColor: this.props.activeType.type === type.type ? '#42f4f1':'lightgrey', borderRadius: '10px'}}
          className="list-group-item list-group-item-action m-1"
        >
          {type.type}
        </li>
      )
    })
  }

  render() {
    // console.log(this.props.activeType)
    return (
      <div>
        <ul className="list-group ">{this.renderList()}</ul>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    types: state.types,
    activeType: state.activeType,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectType: selectType }, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TypeList)
