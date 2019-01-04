import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Tooltip, Input, Button, Row, Col, Container } from 'reactstrap'
import BootstrapTable from 'react-bootstrap-table-next'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import { connect } from 'react-redux'
import * as actions from '../actions'
import ReactPDF from '@react-pdf/renderer'
 
// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
})

//Create table headers
const columns = [{
    dataField: 'name',
    text: 'Exercise'
},{
  dataField: 'sets',
  text: 'Sets'
}, {
  dataField: 'reps',
  text: 'Reps'
}, {
  dataField: 'note',
  text: 'Note'
}]
 
// Create Document Component
const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
    <View style={styles.section}>
        <Text>Title View</Text>
      </View>
      {/* { this.props.plans[3].map((week, index) => {
          return(
              <Text>
                  Week {index+1}
              </Text>
          )
      })} */}
      <View style={styles.section}>
        <Text>
            <BootstrapTable keyField='id' 
            striped={true} bordered={true} hover={true} condensed={true}
            bootstrap4 ={true} data={[]} 
            columns={ columns }
            />
        </Text>
      </View>
      <View style={styles.section}>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
)


class ViewPlan extends React.Component {
    

    planPdf = () => {
       

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <Text>Title View</Text>
                </View>
                <View style={styles.section}>
                { this.props.plans.length > 0 ? this.props.plans[7].template.weeks.map((week, index) => {
                    return(
                        <Container>
                        <Row className='justify-content-center'>
                        <Text
                            key={index}
                            >
                            Week {index+1}
                        </Text>
                        </Row>
                        <Row>
                            {this.props.plans.length > 0 ? this.props.plans[7].workouts.map((workout,index) => {
                                let workoutName = Object.keys(workout)
                                console.log(workoutName, 'workout obj')

                                return(
                                    <Row>
                                        <Text>{workout.title}</Text>
                                        <Text>
                                            <BootstrapTable keyField='id' 
                                            striped={true} bordered={true} hover={true} condensed={true}
                                            bootstrap4 ={true} data={workout.exercises} 
                                            columns={ columns }
                                            />
                                        </Text>
                                    </Row>
                                )
                            }):null}
                        </Row>
                        </Container>
                    )
                }):null}
                </View>
                <View style={styles.section}>
                    {/* <Text>
                        <BootstrapTable keyField='id' 
                        striped={true} bordered={true} hover={true} condensed={true}
                        bootstrap4 ={true} data={[]} 
                        columns={ columns }
                        />
                    </Text> */}
                </View>
                <View style={styles.section}>
                    <Text>Section #2</Text>
                </View>
                </Page>
            </Document>
        )
    }

    componentDidMount = () => {
        this.props.fetchPlanTemps()
    }
    
    render() {
        console.log(this.props.plans)
        return (
            <Row className='justify-content-center'>
                {this.planPdf()}
            </Row>
        )
    }
}

const mapStateToProps = state => {
    return {
        plans: state.plans.planTemps
    }
  }

export default connect(mapStateToProps,actions)(ViewPlan)