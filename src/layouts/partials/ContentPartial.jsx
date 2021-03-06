import React from 'react'

import { Paper } from 'material-ui'

import { SendTokens, DepositTokens, Rewards, Voting } from '@/components'

import styles from './styles'
import './ContentPartial.scss'

export default class ContentPartial extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName='root'>
        <div styleName='inner'>
          <div className='grid'>
            <div className='row'>
              <div className='col-md-3 col-lg-2' styleName='head-light'>
                <Paper style={styles.content.paper.style}>
                  <SendTokens title='Send tokens' />
                </Paper>
              </div>
              <div className='col-md-3 col-lg-2' styleName='head-dark'>
                <Paper style={styles.content.paper.style}>
                  <SendTokens title='Send tokens' />
                </Paper>
              </div>
              <div className='col-md-3 col-lg-2' styleName='head-dark'>
                <Paper style={styles.content.paper.style}>
                  <DepositTokens title='Deposit time' />
                </Paper>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Rewards period={3} progress={70} />
                </Paper>
              </div>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Rewards period={2} progress={100} />
                </Paper>
              </div>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Rewards period={1} progress={30} />
                </Paper>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-6'>
                <Paper style={styles.content.paper.style}>
                  <Voting />
                </Paper>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
