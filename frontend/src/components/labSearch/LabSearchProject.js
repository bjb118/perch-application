import React, {Component} from 'react';
import Apply from '../user/Apply'
import EditModal from '../utilities/modals/EditModal'
import {addToStudentPositionList, removeFromStudentPositionList, createApplicationResponse, getCurrentStudentId} from '../../helper.js'
import './LabSearchProject.css';

class LabSearchProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            added: this.props.saved,
            description: this.props.description,
            question_resps: [],
        }
    }

    componentDidMount() {
        this.formatTitle()
    }

    openModal(id) {
      console.log("CLICKING OPEN ?")
  		if (document.getElementById(id)) {
  			document.getElementById(id).classList.add('activated');
        document.getElementById(`${id}-backdrop`).classList.add('activated');
  		}
  	}

    // updates application from question responses to be ready for submittal
    updateApplication = (question_resps) => {
      this.setState({question_resps});
    }

    // Update this function with backend functionality to save application
    // You can access the response under 'this.state.question_resps'
    submitApplication = () => {
        console.log("SUBMIT !!!", this.state.question_resps)
        let resps = []
        if (this.state.question_resps) 
            this.state.question_resps.map(q => resps.push(q.response))
        let application = {
            student_id: getCurrentStudentId(),
            position_id: this.props.id,
            responses: resps,
        }

		createApplicationResponse(application).then(resp => {
			if (resp.data) {
				// get some info from resp when working
				console.log(
					"resp!!!!!", resp
				)
			}
		});
    }

    saveProject = () => {
        addToStudentPositionList([this.props.id])
        this.toggleAdder()
    }

    removeProject = () => {
        removeFromStudentPositionList([this.props.id])
        this.toggleAdder()
    }

    toggleAdder = () => {
        this.setState({added: !this.state.added})
    }

    formatTitle = () => {
        if (this.props.description.length > 270) {
            this.setState({overflowDescription: true})
        }
        this.setState({description: this.props.description.slice(0,270)})
    }

	render() {
    var applyButton =
      <div className='lab-srch-project-apply lab-srch-project-action-label'><a onClick={() => this.openModal(`${this.props.id}-apply`)}>Apply</a></div>

    var saveRemoveButton =
      <div>
        {!this.state.added && <div className='lab-srch-project-adder lab-srch-project-action-label' onClick={this.saveProject}>save</div>}
        {this.state.added && <div className='lab-srch-project-adder lab-srch-project-action-label' onClick={this.removeProject}>remove</div>}
      </div>

    // if the user is viewing this project on their lab dashboard page in the 'applied' section, don't show the 'apply' and 'save' buttons
    if (this.props.applied) {
      applyButton = null;
      saveRemoveButton = null;
    }

		return (
            <div className='lab-srch-project'>
                <EditModal id={`${this.props.id}-apply`} wide={true} actionName="submit"
                  title={`Apply To ${this.props.title}`} modalAction={this.submitApplication}>
                  <Apply updateQuestions={this.updateApplication} description={this.state.description}/>
                </EditModal>
                <div className='lab-srch-project-title-container'>
                    <a className='truncate lab-srch-project-title' href={`prof-page/${this.props.id}`}>{this.props.title}</a>
                    {this.props.urop && <span className='lab-srch-project-tag'>UROP</span>}
                </div>
                <div className='lab-srch-project-description'>{this.state.description} <span className={this.state.overflowDescription ? 'ellipsis' : 'hide'}>...</span></div>
                {applyButton}
                <div className='lab-srch-project-openings'><b>{this.props.spots}</b> {this.props.spots - 1 ? "spots" : "spot"}</div>
                {saveRemoveButton}
            </div>

		);
	}
}

export default LabSearchProject;
