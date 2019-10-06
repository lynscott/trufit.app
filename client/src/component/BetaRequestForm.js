import React, {useState} from "react"
// import "./App.css";
import { Button, FormGroup, Label, Input, Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap"
import { Form, Field } from "react-final-form"
import { connect } from 'react-redux'
import { contactForm } from '../actions'
import axios from 'axios'

const onSubmit = async (values) => {
  console.log(values)
  await axios.post('/api/contactform', values)
}

const RequestForm = () => (
  <Form
    onSubmit={onSubmit}
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
    //   if (!values.email) {
    //     errors.email = "Required";
    //   } else if (!validateEmail(values.email)) {
    //     errors.email = "Not an email adress";
    //   }
    //   if (!values.password) {
    //     errors.password = "Required";
    //   }
    //   if (!values.tos) {
    //     errors.tos = "Required";
    //   }
    //   if (!values.confirmPassword) {
    //     errors.confirmPassword = "Required";
    //   } else if (values.confirmPassword !== values.password) {
    //     errors.confirmPassword = "Does not match";
    //   }
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
        
        {/* <FormGroup>
          <Label for="email">Email</Label>
          <Field name="email">
            {({ input, meta }) => (
              <div>
                <Input
                  {...input}
                  type="text"
                  placeholder="first name"
                  invalid={meta.error && meta.touched}
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
        </FormGroup> */}

        {/* <FormGroup>
          <Label for="password">Password</Label>
          <Field name="password">
            {({ input, meta }) => (
              <div>
                <Input
                  {...input}
                  type="password"
                  placeholder="password"
                  invalid={meta.error && meta.touched}
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
        </FormGroup>

        <FormGroup>
          <Label for="confirmPassword">Confirm Password</Label>
          <Field name="confirmPassword">
            {({ input, meta }) => (
              <div>
                <Input
                  {...input}
                  type="password"
                  placeholder="confirm password"
                  invalid={meta.error && meta.touched}
                />
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </div>
            )}
          </Field>
        </FormGroup>

        <FormGroup check>
          <Field name="tos" type="checkbox">
            {({ input, meta }) => (
              <Label>
                <Input
                  {...input}
                  type="checkbox"
                  invalid={meta.error && meta.touched}
                />{" "}
                Check Me
                {meta.error && meta.touched && <span>{meta.error}</span>}
              </Label>
            )}
          </Field>
        </FormGroup> */}

        <Button type="submit" color="primary" disabled={!valid}>
          Submit
        </Button>
      </form>
    )}
  />
)

const FormWithModal = () => {
    const [openForm, setForm] = useState(false);
    return (
        <>
            <Button className='MainButton'  onClick={()=> setForm(!openForm)} 
                color="info" >Request Access To Our Private Beta</Button>
            <Modal isOpen={openForm} toggle={()=> setForm(!openForm)}>
                <ModalHeader toggle={()=> setForm(!openForm)}>Request Beta Access </ModalHeader>
                <ModalBody> <RequestForm/> </ModalBody>
                <ModalFooter style={{padding:'0.5rem'}}>
                    <Button color="secondary" onClick={()=> setForm(!openForm)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </>
    )
}

export default (connect(null, { contactForm })(FormWithModal));
