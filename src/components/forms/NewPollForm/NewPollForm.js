// TODO new voting
/* eslint-disable */
import React, { Component } from 'react'
import { Field, reduxForm } from 'redux-form/immutable'
import { connect } from 'react-redux'
import { DatePicker, TimePicker, TextField } from 'redux-form-material-ui'
import validate from './validate'
import PollModel from '../../../models/PollModel'
import optionsArray from './optionsArray'
import filesArray from './filesArray'
import 'react-widgets/dist/css/react-widgets.css'
import './styles.scss'

const mapStateToProps = state => {
  let initialValues = new PollModel().toJS()
  initialValues.deadline = new Date(initialValues.deadline)
  initialValues.deadlineTime = new Date(initialValues.deadline)
  return ({initialValues})
}

const options = {withRef: true}

@connect(mapStateToProps, null, null, options)
@reduxForm({
  form: 'NewPollForm',
  validate
})
class NewPollForm extends Component {
  render () {
    const {
      handleSubmit
    } = this.props

    return (
      <form onSubmit={handleSubmit} name='NewPollForm___Name'>
        <div className='row'>
          <div className='col-xs-12 col-md-6'>
            <Field
              component={TextField}
              name='pollTitle'
              floatingLabelText='Poll Title'
              maxLength={32}
              fullWidth
            />

            <Field
              component={DatePicker}
              name='deadline'
              hintText='Deadline date'
              floatingLabelText='Deadline date'
              fullWidth

            />

            <Field
              component={TimePicker}
              name='deadlineTime'
              hintText='Deadline time'
              floatingLabelText='Deadline time'
              fullWidth
            />

            <Field
              component={TextField}
              name='voteLimit'
              type='number'
              floatingLabelText='Vote Limit'
              fullWidth
            />
            {optionsArray}
          </div>
          <div className='col-xs-12 col-md-6'>
            {filesArray}
          </div>
        </div>
      </form>
    )
  }
}

export default NewPollForm
