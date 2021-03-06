import React from 'react'
import { Admin, ListGuesser, Resource, fetchUtils, EditGuesser } from 'react-admin'
import simpleRestProvider from 'ra-data-simple-rest'
import { ExerciseList, ProfileList, UserList, WorkoutList, PlanList  } from './AdminFiles'
import { ProfileEdit } from './AdminEdit'
import { ProfileCreate} from './AdminCreate'
import jsonapiClient from "ra-jsonapi-client"
import jsonServerProvider from 'ra-data-json-server'




const App = () => <Admin dataProvider={jsonServerProvider('http://localhost:3000/api') }>
                     <Resource name="users" list={UserList} />
                     <Resource name="profiles" list={ProfileList} edit={ProfileEdit} create={ProfileCreate}/>
                     <Resource name="all_plans" list={PlanList} />
                     <Resource name="all_workouts" list={WorkoutList} />
                     <Resource name="admin_exercises" list={ExerciseList} />
                    </Admin>

export default App