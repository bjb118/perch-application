import React, {Component} from 'react';
import LabSearchProject from './LabSearchProject'
import ExpanderIcons from '../utilities/ExpanderIcons'
import './LabSearchItem.css';

class LabSearchItem extends Component {

    constructor(props) {
        super(props)
        this.expandProjects = this.expandProjects.bind(this);
        this.default_pics = ['batman','boba','spock','superman','wonder_woman','wonder_woman','yoda']
        this.pic = this.default_pics[Math.floor(Math.random()*this.default_pics.length)]
    }

    componentDidMount(){
        // console.log(this.props.saved_labs)
    }

    expandProjects() {
        let toggleExpanderIcons = () => {
            let lab_srch_item = document.getElementById(`lab_srch_item_${this.props.name}`)
            let expanderIcons = lab_srch_item.children[lab_srch_item.children.length - 1];
            
            expanderIcons.classList.toggle('active-blue')
        }

        let numProjects = document.getElementById(`lab-srch-item-num-projects_${this.props.name}`)
        numProjects.classList.toggle('active-blue-bg')

        let expansion = document.getElementById(`lab_srch_expansion_${this.props.name}`)
        expansion.classList.toggle('hide-projects')
        toggleExpanderIcons();
    }



	render() {
        var all_projects = [];
        this.props.positions.map((position) => {
            let urop = position.is_urop_project;
            let saved = false;
            for (var item in this.props.saved_labs) {
                if (position.id == this.props.saved_labs[item].id)
                    saved = true
            }
            all_projects.push(<LabSearchProject key={position.id} id={position.lab_id} saved={saved} title={position.title} spots='MISSING' description={position.description} urop/>)
        })
		return (
            <div className='lab-srch-item-container'>
                <div id={`lab_srch_item_${this.props.name}`} className='lab-srch-item'> 
                    <img src={`/img/default/${this.pic}.jpg`} className='lab-srch-item-pic' />
                    <div> <a className='lab-srch-item-name' href={`prof-page/${this.props.id}`}>{this.props.name}</a></div>
                    <div className='lab-srch-item-depts'><b>Departments:</b> {this.props.dept}</div>
                    <div className='lab-srch-item-rsrch'><b>Research Areas:</b> {this.props.rsrch}</div>
                    {this.props.description != 'NULL'  && <div className='lab-srch-item-description'><b>Description</b> {this.props.description}</div>}
                    <div id={`lab-srch-item-num-projects_${this.props.name}`} className='lab-srch-item-num-projects' onClick={this.expandProjects}><b>{this.props.positions.length}</b> {this.props.positions.length - 1 ? "Projects" : "Project"}</div>
                    <ExpanderIcons id={`lab-srch-item_${this.props.name}`} action={this.expandProjects}/>
                </div>

                <div id={`lab_srch_expansion_${this.props.name}`} className='lab-srch-item-expansion hide-projects'>
                    {all_projects}
                </div>
            </div>
		);
	}
}

export default LabSearchItem;