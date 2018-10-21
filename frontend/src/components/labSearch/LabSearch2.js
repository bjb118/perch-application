import React, {Component} from 'react';
import './LabSearch2.css';
import ExpanderIcons from '../utilities/ExpanderIcons'
import DotLoader from '../utilities/animations/DotLoader'
import LabSearchItem from './LabSearchItem';

import '../user/individual/PickYourInterests.css';
import {isStudent, getAllLabs, getSearchResults, getLabTags, isLoggedIn, getCurrentUserId, getStudentFromUser, getAllSkills, getAllTags, getStudentSkills, getStudentTags, getUser, getSearchData, labSearch} from '../../helper.js'
import {getFilters} from '../../data/filterData';
const filterTypes = ['departments', 'researchAreas', 'minReqs', 'lab-skills'];
const filterFriendlyNames = ['Departments', 'Research Areas', 'Minimum Requirements', 'Lab Skills'];

class LabSearch extends Component {
	constructor(props) {
		super(props);
		this.handleFilterClick = this.handleFilterClick.bind(this);

		var filts = {};
		var parentFilts = {}
		filterTypes.map(type => {
			filts[type] = {};
			parentFilts[type] = [];
		})

		this.state = {
			filts,
			parentFilts,
			next: [],
			ids_to_show: [],
            all_labs: [],
            areas: [],
            departments: [],
            commitments: [],
            skills: [],
			s_id: '',
            search: '',
            lab_list: [],
			loading: true,
			limit: 5,
		}
	}

	moreLabs() {
		let positions = this.state.next,
    		limit = this.state.limit,
    		newState = {
    			all_labs: this.state.all_labs,
    		}

		if (positions.length > limit)
			newState.next = positions.slice(limit)

		let actual_positions = []
		positions.slice(0,limit).map(a=> {
			actual_positions = actual_positions.concat(a.projects)
		})
		console.log('more-labs',actual_positions)
    	getSearchResults(actual_positions).then(r => {
    		let all_labs = r.data.results
    		console.log('more results', all_labs)
    		for (var key in all_labs) {
                let lab = all_labs[key];
                newState.all_labs.push(<LabSearchItem key={lab.id} id={lab.id} saved_labs={this.state.lab_list} name={lab.name} dept='MISSING' rsrch='MISSING' img='/img/headshots/salektiar.jpg' description='NULL' positions={lab.positions}/>);
            }
        	newState.loading = false;
        	this.setState(newState);
    	})
	}

    componentWillMount() {
    	let newState = {
    		all_labs: [],
    	}

    	labSearch([],[],[],[],"")
	    	.then(r => {
	    		let positions = r.data.results
	    		let limit = this.state.limit
	    		if (positions.length > limit)
	    			newState.next = positions.slice(limit)

	    		let actual_positions = []
				positions.slice(0,limit).map(a=> {
					actual_positions = actual_positions.concat(a.projects)
				})
	    		return getSearchResults(actual_positions)
	    	})
	    	.then(r => {
	    		let all_labs = r.data.results
	    		for (var key in all_labs) {
	                let lab = all_labs[key];
	                newState.all_labs.push(<LabSearchItem key={lab.id} id={lab.id} saved_labs={this.state.lab_list} name={lab.name} dept='MISSING' rsrch='MISSING' img='/img/headshots/salektiar.jpg' description='NULL' positions={lab.positions}/>);
	            }
	        	newState.loading = false;
            	this.setState(newState);
	    	})


        getSearchData().then((resp) => {
            console.log(resp);
            let new_filts = this.state.filts;
            let new_parentFilts = this.state.parentFilts;

            resp.data.all_commitments.map((req) => {
                new_filts['minReqs'][req] = {friendlyName: req, slug: req};
                new_parentFilts['minReqs'].push({friendlyName: req, slug: req});
            });

            resp.data.available_skills.map((skill) => {
                new_filts['lab-skills'][skill] = {friendlyName: skill, slug: skill};
                new_parentFilts['lab-skills'].push({friendlyName: skill, slug: skill});
            });

            resp.data.available_areas.map((area) => {
                new_filts['researchAreas'][area] = {friendlyName: area, slug: area};
                new_parentFilts['researchAreas'].push({friendlyName: area, slug: area});
            });

            resp.data.available_departments.map((dept) => {
                new_filts['departments'][dept] = {friendlyName: dept, slug: dept};
                new_parentFilts['departments'].push({friendlyName: dept, slug: dept, clicked: true});
            });

            this.setState({filts: new_filts, parentFilts: new_parentFilts});

        });

    }

	expand(type) {
		document.getElementById(`${type}-filter`).classList.toggle('expand')
	}

	componentDidMount() {
		this.expand("departments");
		let search = document.getElementById('lab-srch-input')
		search.addEventListener('keyup', this.updateSearch.bind(this))
		if (isStudent()) {
			getStudentFromUser(getCurrentUserId()).then((resp) => {
				this.setState({lab_list: resp.data.position_list})
			})
		}

	}

	handleFilterClick(filterType, slug) {
		var newState = this.state;
		if (newState.filts[filterType][slug].clicked) {
			newState.filts[filterType][slug].clicked = false;

            switch(filterType) {
                case 'departments':
                    newState.departments.splice(newState.departments.indexOf(slug), 1);
                    break;
                case 'researchAreas':
                    newState.areas.splice(newState.areas.indexOf(slug), 1);
                    break;
                case 'minReqs':
                    newState.commitments.splice(newState.commitments.indexOf(slug), 1);
                    break;
                case 'lab-skills':
                    newState.skills.splice(newState.skills.indexOf(slug), 1);
                    break;
            }
		} else {
			newState.filts[filterType][slug].clicked = true;

            switch(filterType) {
                case 'departments':
                    newState.departments.push(slug);
                    break;
                case 'researchAreas':
                    newState.areas.push(slug);
                    break;
                case 'minReqs':
                    newState.commitments.push(slug);
                    break;
                case 'lab-skills':
                    newState.skills.push(slug);
                    break;
            }
		}
		this.setState(newState);
		this.executeSearch({key: 'Enter'})
	}

	closeModifiers() {
		document.getElementById('lab-search-box').classList.add('hide');
	}

  updateSearch(event) {
  	// event.preventDefault()
  	// if (event.keyCode == 13) {
  		//alert(event.keyCode)
      	this.setState({search: event.target.value})
      // }
  }



  /*
	
	Here's my search data, send to Akshay wiht labsearch

	Akshay sends back a list of objects, { which have a labid, and its relevant projets }

	Then I save everything after my slice

	And then I ask you for everything before that slice
	
	and then i save what i should as kfor later




	LabSearch

	[
		[proj1, proj2],     // lab 4
		[proj19, proj20],   // lab 20
	]


  */



  executeSearch(event) {
		if (event.key === 'Enter') {
			this.setState({loading: true}, () => {
				var newState = this.state;
	       		labSearch(this.state.areas, this.state.skills, this.state.commitments, this.state.departments, this.state.search)
	       			.then((r) => {
				        newState.all_labs = [];
			            let positions = r.data.results || r.data
			    		let limit = this.state.limit
			    		newState.next = positions.slice(limit)
			    		let actual_positions = []
			    		positions.slice(0,limit).map(a=> {
			    			actual_positions = actual_positions.concat(a.projects)
			    		})
			    		return getSearchResults(actual_positions)
      				})
      				.then((r) => {
      					console.log('getsearchresults', r)
      					var all_search_labs = r.data.results;
      					console.log(all_search_labs)
      					all_search_labs.map(lab => newState.all_labs.push(<LabSearchItem name={lab.name} saved_labs={this.state.lab_list} key={lab.id} id={lab.id} dept='MISSING' rsrch='MISSING' img='/img/headshots/salektiar.jpg' description='NULL' positions={lab.positions}/>))
      					newState.loading = false;
		          		this.setState(newState);
      				})
		})
	}
  }

	render() {
		var filterContentArr = [];
		filterTypes.map(type => {
			var filterContent =
				<ul className = "search-filter-content">
					{this.state.parentFilts[type].map((filt) => {
						var subFiltSection = null;
						if (this.state.filts[type][filt.slug].clicked &&
								filt.subFilts && filt.subFilts.length > 0) {

							subFiltSection =
								<ul className="subfilter">
									{filt.subFilts.map((subFiltSlug) => {
										var subFilt = this.state.filts[type][subFiltSlug];
										return (
											<li key={subFilt.slug}>
												<input type="checkbox"
													className="checkbox-white filled-in"
                          onClick={() => this.handleFilterClick(type, filt.slug)}
													id={subFilt.slug}/>
												<label
													className="filter-checkbox-label"
													for={subFilt.slug}>
													{subFilt.friendlyName}
												</label>
											</li>)})}
								</ul>
						}
						var labelContent = null;
						if (filt.subFilts && filt.subFilts.length > 0) {
							var expandCSS = this.state.filts[type][filt.slug].clicked ?
								"search-expand-less" : "search-expand-more";
							labelContent =
								<li key={filt.slug}>
									<div className="filter-dropdown-container">
										<a className={expandCSS}
											 id={filt.slug}>
												<i className="material-icons">
													{this.state.filts[type][filt.slug].clicked ?
														"expand_less" : "expand_more"}
												</i>
											</a>
										<div className="filter-dropdown-label">{filt.friendlyName}</div>
									</div>
									{subFiltSection}
								</li>
						}
						else {
							labelContent =
								<li key={filt.slug}>
									<input type="checkbox"
										className="checkbox-white filled-in"
                                        onClick={() => this.handleFilterClick(type, filt.slug)}
										id={filt.slug}/>
									<label
										className="filter-checkbox-label"
										htmlFor={filt.slug}>{filt.friendlyName}</label>
								</li>
						}
						return (labelContent);
					})}
				</ul>

				filterContentArr.push(<div className="search-filter-content-wrapper">
					{filterContent}</div>);
		})

	var labSearchContent =
     <div id='lab-srch-results'>
          {this.state.all_labs}
     </div>

	var showMoreButton =
     <div id='lab-srch-more' onClick={this.moreLabs.bind(this)}>Mo' labs, mo' problems</div>

	if (this.state.loading) {
		labSearchContent = <DotLoader />
		showMoreButton = null;
	}

	var searchSideBar =
		<div className="search-sidebar">
			{filterTypes.map((type, idx) => {
				return (
					<div key={`${type}-filter`} id={`${type}-filter`} className="search-filter-container">
						<div className="search-filter-title">{filterFriendlyNames[idx]}</div>
						<ExpanderIcons id={`${type}-filter`} classBase='search-filter-container' action={() => {this.expand(type)}} preClick={type === "departments"} filterDropdown={true}/>
						<hr className="filter-hr"/>
						{filterContentArr[idx]}
					</div>
				)
			})}
		</div>
		return (
			<div className='lab-srch-2'>

               <div className='lab-srch-mods'>
                   {searchSideBar}
               </div>
               <div className='lab-srch-body'>
                   <input id='lab-srch-input' type='text' placeholder='keywords' onKeyPress={event => this.executeSearch(event)}/>
									 <div id='lab-srch-result-summary'>Groups 1-{this.state.all_labs.length} ({this.state.all_labs.length + this.state.next.length} total) {/*page 1 of 40*/} for <b>{this.state.search}</b></div>
                   	{labSearchContent}
					{this.state.next.length > 0 && showMoreButton}
               </div>
			</div>
		);
	}
}

export default LabSearch;
