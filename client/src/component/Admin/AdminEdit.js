import React from 'react'
import {
  Edit,
  SimpleForm,
  TextInput,
  SimpleFormIterator,
  DateInput,
  ArrayInput,
  NumberInput,
  BooleanInput,
  DisabledInput,
  ReferenceInput,
  ChipField,
  SingleFieldList,
  EditButton
} from 'react-admin'

export const ProfileEdit = props => (
  <Edit {...props}>
    <SimpleForm>
        <DisabledInput source="id" />
      <TextInput source="id" />
      <TextInput source="affirmation" />
      <TextInput source="messages" />
      <TextInput source="events" />
      <TextInput source="progressPics" />
      <ArrayInput source="weighIns">
        <SimpleFormIterator>
          <DateInput source="weight" />
          <DateInput source="date" />
        </SimpleFormIterator>
      </ArrayInput>
      <NumberInput source="macros.fat" />
      <TextInput source="currentGoal.text" />
      <ArrayInput source="nutritionSchedule">
        <SimpleFormIterator>
          <ArrayInput source="items">
            <SimpleFormIterator>
              <TextInput source="name" />
              <TextInput source="serving_label" />
              <NumberInput source="serving" />
              <DateInput source="baseCal" />
              <TextInput source="baseFats" />
              <TextInput source="baseCarb" />
              <TextInput source="baseProtein" />
              <TextInput source="calories" />
              <TextInput source="fats" />
              <TextInput source="carb" />
              <TextInput source="protein" />
              <BooleanInput source="active" />
              <TextInput source="id" />
            </SimpleFormIterator>
          </ArrayInput>
          <TextInput source="time" />
        </SimpleFormIterator>
      </ArrayInput>
      <ArrayInput source="nutritionItems">
        <SimpleFormIterator>
          <TextInput source="name" />
          <TextInput source="serving_label" />
          <DateInput source="serving" />
          <DateInput source="baseCal" />
          <TextInput source="baseFats" />
          <TextInput source="baseCarb" />
          <TextInput source="baseProtein" />
          <TextInput source="calories" />
          <TextInput source="fats" />
          <TextInput source="carb" />
          <TextInput source="protein" />
          <BooleanInput source="active" />
          <TextInput source="id" />
        </SimpleFormIterator>
      </ArrayInput>
      <NumberInput source="nutritionCalories" />
      {/* <NumberInput source="__v" /> */}
      <NumberInput source="baseSomaType.macro.fat" />
      <BooleanInput source="isAdmin" />
      <DateInput source="calories" />
      <TextInput source="_user" />
      <TextInput source="email" />
      {/* <ReferenceInput source="_id" reference="s">
        <SelectInput optionText="id" />
      </ReferenceInput> */}
    </SimpleForm>
  </Edit>
)
