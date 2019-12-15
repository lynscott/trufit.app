//TODO: Combine affirmation, date planning, and editing fitness goal

// affirmationChange = () => {
//     if (this.state.update === false) {
//         return (
//             <p
//                 className="lead affirmation"
//                 style={{fontSize: '1.2rem'}}
//                 onTouchStart={e =>
//                     DOUBLE_TAP_HACK_HANDLER(e, () =>
//                         this.setState({update: true})
//                     )
//                 }
//                 onDoubleClick={() => {
//                     this.setState({update: true})
//                 }}
//             >
//                 {this.props.profile
//                     ? this.props.profile.affirmation !== ''
//                         ? this.props.profile.affirmation
//                         : 'Tap to fill out'
//                     : ''}
//             </p>
//         )
//     } else {
//         return (
//             <React.Fragment>
//                 <Form className="row">
//                     <Input
//                         type="text"
//                         style={{
//                             marginBottom: '8px',
//                             backgroundColor: 'lightgrey'
//                         }}
//                         onChange={e => {
//                             this.setState({updateMessage: e.target.value})
//                         }}
//                         id="inputAF"
//                         placeholder={
//                             this.props.profile
//                                 ? this.props.profile.affirmation
//                                 : ''
//                         }
//                     />
//                 </Form>
//                 <Button
//                     className="m-3"
//                     color="info"
//                     onClick={async () => {
//                         await this.props.updateProfile({
//                             keys: ['affirmation'],
//                             affirmation: this.state.updateMessage
//                         })
//                         this.setState({update: false})
//                     }}
//                 >
//                     Update Affirmation
//                 </Button>{' '}
//                 <Button
//                     className="m-3"
//                     color="dark"
//                     onClick={() => this.setState({update: false})}
//                 >
//                     Cancel
//                 </Button>{' '}
//             </React.Fragment>
//         )
//     }
// }

import React, {useState, useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {useDispatch, useSelector} from 'react-redux'
import CardComponent from './OVCard'

//TODO: Move to const folder
const WL =
    'Focus primarily on weight loss, which will reduce muscle as well as fat.'
const WG =
    'Focus on gaining lean muscle mass. Body fat increases may be accumulated in the process but we will work to keep them minimal.'
const BR =
    'Body recomposition focuses on decreasing body fat while simultaneously increasing muscle mass.'
const MA = 'Maintenance'

//TODO: Add training tracker and workout viewer
const OVGoals = () => {
    return (
        <CardComponent headline="Goal" subheader="Date/Affirmation">
            TODO
        </CardComponent>
    )
}

export default OVGoals
