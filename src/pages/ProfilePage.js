import React, {Component} from 'react';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import {Paper, FlatButton, RaisedButton} from 'material-ui';
import ProfileForm from '../components/forms/ProfileForm';
import styles from '../styles';
import UserModel from '../models/UserModel';
import {updateUserProfile} from '../redux/ducks/session/data';
import {showDepositTimeModal} from '../redux/ducks/ui/modal';
import {requireTime} from '../redux/ducks/wallet/wallet';

const mapStateToProps = (state) => ({
    isEmpty: state.get('sessionData').profile.isEmpty()
});

const mapDispatchToProps = (dispatch) => ({
    handleClose: () => dispatch(push('/')),
    updateProfile: (profile: UserModel) => dispatch(updateUserProfile(profile, localStorage.getItem('chronoBankAccount'))),
    showDepositTimeModal: () => dispatch(showDepositTimeModal()),
    requireTime: () => dispatch(requireTime(localStorage.getItem('chronoBankAccount'))),
});

@connect(mapStateToProps, mapDispatchToProps)
class ProfilePage extends Component {
    handleSubmit = (values) => {
        this.props.updateProfile(new UserModel(values));
        this.props.handleClose();
    };

    handleSubmitClick = () => {
        this.refs.ProfileForm.getWrappedInstance().submit();
    };

    render() {
        return (
            <div>
                <span style={styles.navigation}>ChronoMint / Profile</span>
                <Paper style={styles.paper}>
                    <h3 style={styles.title}>Profile</h3>

                    {this.props.isEmpty ? <b>Your profile is empty. Please specify at least your name.</b> : ''}

                    <div>
                        <RaisedButton
                            label="Require TIME"
                            primary={true}
                            style={{marginTop: 33, marginBottom: 15}}
                            onTouchTap={this.props.requireTime}
                            buttonStyle={{...styles.raisedButton, }}
                            labelStyle={styles.raisedButtonLabel}
                        />

                        <RaisedButton
                            label="DEPOSIT TIME TOKENS"
                            primary={true}
                            style={{marginLeft: 22}}
                            onTouchTap={this.props.showDepositTimeModal}
                            buttonStyle={{...styles.raisedButton, }}
                            labelStyle={styles.raisedButtonLabel}
                        />
                    </div>

                    <ProfileForm ref="ProfileForm" onSubmit={this.handleSubmit}/>

                    <p>&nbsp;</p>
                    <RaisedButton
                        label={'Save'}
                        primary={true}
                        onTouchTap={this.handleSubmitClick}
                    />
                    <FlatButton
                        label="Cancel"
                        onTouchTap={this.props.handleClose}
                    />
                </Paper>
            </div>
        );
    }
}

export default ProfilePage;