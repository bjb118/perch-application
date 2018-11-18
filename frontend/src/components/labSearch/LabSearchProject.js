import React, {Component} from 'react';
import Apply from '../user/Apply'
import EditModal from '../utilities/modals/EditModal'
import {addToStudentPositionList, removeFromStudentPositionList, getStudentApplicationResponse, createStudentApplicationResponse, getCurrentStudentId, submitStudentApplicationResponse} from '../../helper.js'
import './LabSearchProject.css';

class LabSearchProject extends Component {
    constructor(props) {
        super(props)
        this.state = {
            added: this.props.saved,
            position: this.props.position || {},
            question_resps: [],
            submitted: this.props.submitted,
        }
    }

    componentDidMount() {
        this.formatTitle()
    }

    componentWillReceiveProps(props) {
        if (props.submitted)
            this.setState({submitted: props.submitted})
    }

    openModal(id) {
  		if (document.getElementById(id)) {
  			document.getElementById(id).classList.add('activated');
        document.getElementById(`${id}-backdrop`).classList.add('activated');
  		}
  	}

    // updates application from question responses to be ready for submittal
    updateApplication = (question_resps) => {
      this.setState({question_resps});
    }

    submitApplication() {
		let question_resps = this.state.question_resps,
			resps = []

		if (question_resps) 
			resps = question_resps.map(q => { return {question: q.question, answer: q.answer}})

		let application = {
			position_id: this.props.position_id,
			responses: resps,
		}

		createStudentApplicationResponse(getCurrentStudentId(), this.state.position.id, application).then((resp) => {
			if (resp.data && resp.data.id) {
				submitStudentApplicationResponse(getCurrentStudentId(), this.state.position.id)
					.then(r => {
                        alert("Application Successfully Submitted!")
                        this.setState({submitted: true})
                        if (this.props.loadSubmitted)
                            this.props.loadSubmitted()
					})
					.catch(e=>alert('Error in create application response'))
			}
		})
	}

    saveProject = () => {
        addToStudentPositionList([this.props.position.id])
        this.toggleAdder()
    }

    removeProject = () => {
        removeFromStudentPositionList([this.props.position.id])
        this.toggleAdder()
        this.props.updateProjects(this.props.position.id)
    }

    toggleAdder = () => {
        this.setState({added: !this.state.added})
    }

    formatTitle = () => {
        let newPos = this.state.position;
        if (newPos.description && newPos.description.length > 270) {
            this.setState({overflowDescription: true})
            newPos.description = newPos.description.slice(0,270);
        }
        this.setState({position: newPos})
    }

    renderModals() {
        return (
            <EditModal id={`${this.state.position.id}-apply`} wide={true} actionName="submit" title={`Apply To ${this.state.position.title}`} modalAction={this.submitApplication.bind(this)}>
                <Apply updateQuestions={this.updateApplication} position={this.state.position} pos_id={this.state.position.id} lab_id={this.props.id} />
            </EditModal>
        )
    }

	render() {
    var applyButton =
      <div className='lab-srch-project-apply lab-srch-project-action-label'>
        <a onClick={() => this.openModal(`${this.state.position.id}-apply`)}>Apply</a>
      </div>

    var saveRemoveButton =
      <div>
        {!this.state.added && <div className='lab-srch-project-adder lab-srch-project-action-label' onClick={this.saveProject}>save</div>}
        {this.state.added && <div className='lab-srch-project-adder lab-srch-project-action-label' onClick={this.removeProject}>remove</div>}
      </div>

    // if the user is viewing this project on their lab dashboard page in the 'applied' section, don't show the 'apply' and 'save' buttons
    if (this.props.applied || this.state.submitted) {
      applyButton = <div className='group-project-application-submitted' >Application<br/>Submitted</div>;
      saveRemoveButton = null;
    }

		return (
            <div key={this.props.position_id} className='lab-srch-project'>

                {this.renderModals()}

                <div className='lab-srch-project-title-container'>
                    <a className='truncate lab-srch-project-title' href={`prof-page/${this.props.position.lab_id}`} target="_blank">{this.state.position.title}</a>
                    {this.props.urop && <span className='lab-srch-project-tag'>UROP</span>}
                </div>

                <div className='lab-srch-project-description'>{this.state.position.description} 
                    <span className={this.state.overflowDescription ? 'ellipsis' : 'hide'}>...</span>
                </div>

                <div className='lab-srch-project-openings'><b>{this.state.position.spots}</b> {this.state.position.spots - 1 ? "spots" : "spot"}</div>
                
                {applyButton}
                {saveRemoveButton}
                
            </div>

		);
	}
}

export default LabSearchProject;
