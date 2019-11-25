import React, {useState} from "react"
// import "./App.css";
import { Button, FormGroup, Label, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap"
import { Form, Field } from "react-final-form"
import { useDispatch, useSelector  } from 'react-redux'
import { contactForm } from '../actions'




const RequestForm = () => {

  const pending = useSelector(state => state.emails.pendingBetaRequest)
  const dispatch = useDispatch()
  

  return (
  <Form
    onSubmit={(values)=> dispatch(contactForm(values))}
    validate={values => {
      const errors = {};
      function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      }
      if (!values.email) {
        errors.email = "Required";
      }
      if (!values.affiliation) {
        errors.affiliation = "Required";
      }

      return errors;
    }}

    render={({ handleSubmit, values, submitting, validating, valid }) => (
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="email">Email</Label>
          <Field name="email">
            {({ input, meta }) => (
              <div>
                <Input
                  {...input}
                  type="text"
                  placeholder="Email"
                  invalid={meta.error && meta.touched}
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
        </FormGroup>

        <FormGroup>
          <Label for="affiliation">Affiliation</Label>
          <Field name="affiliation">
            {({ input, meta }) => (
              <div>
                <Input
                  {...input}
                  type="text"
                  placeholder="Affiliation"
                  invalid={meta.error && meta.touched}
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
        </FormGroup>

        <Button type="submit" color="primary" disabled={!valid || submitting || pending}>
          Submit
        </Button>
      </form>
    )}
  />)

}

const FormWithModal = () => {
    const [openForm, setForm] = useState(false)
    const success = useSelector(state => state.emails.successBetaRequest)
    return (
        <>
            <Button className='MainButton'  onClick={()=> setForm(!openForm)} 
                color="info" >Request Access To Our Private Beta</Button>
            <Modal isOpen={openForm} toggle={()=> setForm(!openForm)}>
                <ModalHeader toggle={()=> setForm(!openForm)}>Request Beta Access </ModalHeader>
                <ModalBody> { success ? 'Request Sent!' : <RequestForm/>} </ModalBody>
                <ModalFooter style={{padding:'0.5rem'}}>
                    <Button color="secondary" onClick={()=> setForm(!openForm)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default FormWithModal
