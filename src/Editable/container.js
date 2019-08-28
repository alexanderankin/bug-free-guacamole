import React from 'react'
// import settings from '../settings.js'
import Field from './field.js'

export default class EditableContainer extends React.Component {
  constructor (props) {
    super(props)

    // init counter
    this.count = 0

    // init state
    this.state = {
      edit: false,
    }
  }

  componentWillUnmount () {
    // cancel click callback
    if (this.timeout) clearTimeout(this.timeout)
  }

  handleClick (e) {
    // cancel previous callback
    if (this.timeout) clearTimeout(this.timeout)

    // increment count
    this.count++

    // schedule new callback  [timeBetweenClicks] ms after last click
    this.timeout = setTimeout(() => {
      // listen for double clicks
      if (this.count === 2) {
        // turn on edit mode
        this.setState({
          edit: true,
        })
      }

      // reset count
      this.count = 0
    }, 250/*settings.timeBetweenClicks*/) // 250 ms
  }

  handleBlur (e) {
    // handle saving here
    // alert(e.target.value);
    var target = e.target;
    setTimeout(function() { this.props.save(target.value); }.bind(this));
    
    // close edit mode
    this.setState({
      edit: false,
    })
  }

  render () {
    const {children, save, defaultValue, ...rest} = this.props
    const {edit} = this.state

    if (edit) {
      // edit mode
      return (
        <Field
          autoFocus
          defaultValue={defaultValue}
          onBlur={this.handleBlur.bind(this)}
        />
      )
    } else {
      // view mode
      return (
        <span
          onClick={this.handleClick.bind(this)}
          {...rest}
        >
          {children}
        </span>
      )
    }
  }
}
