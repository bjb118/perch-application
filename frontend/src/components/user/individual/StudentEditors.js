import React, { Component } from 'react'
import BasicButton from '../../utilities/buttons/BasicButton'
import AvatarEditor from 'react-avatar-editor'
import Dropzone from 'react-dropzone'
import Cleave from 'cleave.js/react'
import CleavePhone from 'cleave.js/dist/addons/cleave-phone.i18n';
import { deepCopy, validDateChange, validPhoneChange } from '../../../helper.js'
import './StudentEditors.css'

export class EditLinks extends Component {
  constructor (props) {
    super(props)
    var resume = ''
    var linkedin_link = ''
    var website_link = ''
    if (props.user) {
      if (props.user.website_link) {
        resume = props.user.website_link
        website_link = props.user.website_link
      } else if (props.user.resume) {
        resume = props.user.resume
      }
      if (props.user.linkedin_link) {
        linkedin_link = props.user.linkedin_link
      } else if (props.user.linkedin_link) {
        linkedin_link = props.user.linkedin_link
      }
    }
    this.state = { linkedin_link, resume, website_link }
  }

  componentWillReceiveProps (props) {
    var resume = ''
    var linkedin_link = ''
    var website_link = ''
    if (props.user) {
      if (props.user.website_link) {
        resume = props.user.website_link
        website_link = props.user.website_link
      } else if (props.user.resume) {
        resume = props.user.resume
      }
      if (props.user.linkedin_link) {
        linkedin_link = props.user.linkedin_link
      } else if (props.user.linkedin_link) {
        linkedin_link = props.user.linkedin_link
      }
    }
    this.setState({ linkedin_link, resume, website_link })
  }

  render () {
    return (
      <div>
        <div className='input-field'>
          <input
            type='text'
            id='linkedin_link'
            placeholder='Rodriguez@linkedin.com'
            value={this.state.linkedin_link}
            onChange={e => {
              if (this.props.updateUser) {
                this.props.updateUser('linkedin_link', e.target.value)
              }
              this.setState({ linkedin_link: e.target.value })
            }}
          />
          <label htmlFor='linkedin_link' className='active'>Linkedin</label>
        </div>
        {/* <div className='input-field'>
					<input type='text' id='resume' placeholder='super-cool-resume.pdf' value={this.state.resume}
					onChange={(e) => {
						if (this.props.updateUser) {
							this.props.updateUser("resume", e.target.value); }
						this.setState({resume: e.target.value})}}/>
					<label htmlFor='resume' className="active" >Resume</label>
				</div> */}
        {this.props.prof &&
          <div className='input-field'>
            <input
              type='text'
              id='lab-materials'
              placeholder='lab-materials.pdf'
              value={this.state.website_link}
              onChange={e => {
                if (this.props.updateUser) {
                  this.props.updateUser('lab_materials_link', e.target.value)
                }
                this.setState({ lab_materials_link: e.target.value })
              }}
            />
            <label htmlFor='lab-materials' className='active'>
              Lab Materials
            </label>
          </div>}
      </div>
    )
  }
}

// Example
export const Test = () => (
  <EditContainer title='Experience Info'><EditContact /></EditContainer>
)

// Generic container for when needed as standalone component
export let EditContainer = props => (
  <div id='edit-container'>
    <h1>Edit {props.title}</h1>
    {props.children}
    <BasicButton msg='return' />
  </div>
)

// Generic container for holding onboarding editors
export let EditContainerOnboarding = props => (
  <div id='edit-container'>
    <h1>Add {props.title}</h1>
    {props.children}
    {/* <BasicButton msg='next' superClick={props.redirect}/> */}
  </div>
)

// Content, flexible to other containres
export class EditContact extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contact_email: props.user && props.user.contact_email
        ? props.user.contact_email
        : '',
      contact_phone: props.user && props.user.contact_phone
        ? props.user.contact_phone
        : ''
    }
  }

  componentWillReceiveProps (props) {
    if (props.user) {
      if (props.user.contact_email) {
        this.setState({ contact_email: props.user.contact_email })
      }
      if (props.user.contact_phone) {
        this.setState({ contact_phone: props.user.contact_phone })
      }
    }
  }

  render () {
    var emailSection = (
      <div className='input-field'>
        {/* <input
          id='email'
          type='email'
          placeholder='bearb@umich.edu'
          value={this.state.contact_email}
          onChange={e => {
            if (this.props.updateUser) {
              this.props.updateUser('contact_email', e.target.value)
            }
            this.setState({ contact_email: e.target.value })
          }}
        /> */}
        <Cleave
          placeholder='john-doe@umich.edu'
          options={{email: true}}
          value={this.state.contact_email}
          onChange={e => {
            if (this.props.updateUser) {
              this.props.updateUser('contact_email', e.target.value)
            }
            this.setState({ contact_email: e.target.value })
          }}
        />
        <label htmlFor='email' className='active'>Email</label>
      </div>
    )

    if (this.props.noEmail) {
      emailSection = null
    }

    return (
      <form id='edit-contact-info'>
        {emailSection}
        <div className='input-field'>
          <Cleave
          placeholder='1 234 456 8989'
          options={{phone: true, phoneRegionCode: 'US'}}
          value={this.state.contact_phone}
          onChange={e => {
              if (this.props.updateUser) {
                this.props.updateUser('contact_phone', e.target.value)
              }
              this.setState({ contact_phone: e.target.value })
            }
          }
          
          // onChange={e => alert(e.target.value)}
        />
          <label htmlFor='phone-number' className='active'>Phone</label>
        </div>
      </form>
    )
  }
}

export class EditBio extends Component {
  constructor (props) {
    super(props)
    this.state = {
      placeholder: 'Short description of background, experience, and interests',
      bio: props.user && props.user.bio ? props.user.bio : ''
    }
  }

  componentWillReceiveProps (props) {
    if (props.user && props.user.bio) {
      this.setState({ bio: props.user.bio })
    }
  }

  render () {
    return (
      <form id='edit-bio'>
        <div className='input-field'>
          <textarea
            id='textArea'
            value={this.state.bio}
            placeholder='Short description of background, experience, and interests'
            onChange={e => {
              if (this.props.updateUser) {
                this.props.updateUser('bio', e.target.value)
              }
              this.setState({ bio: e.target.value })
            }}
          />
        </div>
      </form>
    )
  }
}

export class EditClasses extends Component {
  constructor (props) {
    super(props)
    this.addClass = this.addClass.bind(this)
    this.alterClass = this.alterClass.bind(this)
    this.removeClass = this.removeClass.bind(this)
    var class_arr = props.user &&
      props.user.classes &&
      props.user.classes.length
      ? props.user.classes
      : [{ id: 'c_0', name: '' }]
    this.state = {
      class_arr
    }
    this.state.c_index = this.state.class_arr.length
  }

  addClass (event) {
    var newClassID = 'c_' + this.state.c_index
    var newClassText = ''
    var newClass = {
      id: newClassID,
      name: newClassText
    }
    var newCIndex = this.state.c_index + 1
    var updated_classes = this.state.class_arr.concat([newClass])
    this.setState({
      class_arr: updated_classes,
      c_index: newCIndex
    })
    if (this.props.updateUser) {
      this.props.updateUser('classes', updated_classes)
    }
  }

  alterClass (event, class_id) {
    var temp_classes = this.state.class_arr
    var index = temp_classes.findIndex(item => item.id === class_id)
    temp_classes[index].name = event.target.value
    this.setState({
      class_arr: temp_classes
    })
    if (this.props.updateUser) {
      this.props.updateUser('classes', temp_classes)
    }
  }

  removeClass (class_id) {
    this.setState(prevState => {
      var temp_classes = prevState.class_arr
      var removeIndex = temp_classes
        .map(function (item) {
          return item.id
        })
        .indexOf(class_id)
      temp_classes.splice(removeIndex, 1)
      return {
        class_arr: temp_classes
      }
      if (this.props.updateUser) {
        this.props.updateUser('classes', temp_classes)
      }
    })
  }

  render () {
    return (
      <form id='edit-classes'>
        {this.state.class_arr.map(c => {
          return (
            <div className='row' key={c.id}>
              <div className='input-field col s11'>
                <input
                  id='title'
                  type='text'
                  name='title'
                  placeholder='Class Name (e.g. EECS 281)'
                  value={c.name}
                  onChange={e => this.alterClass(e, c.id)}
                />
              </div>
              <div className='col s1'>
                <a id={c.id} onClick={() => this.removeClass(c.id)}>
                  <i className='material-icons remove-class'>clear</i>
                </a>
              </div>
            </div>
          )
        })} <br />
        <div className='add-obj-icon-container'>
          <a onClick={this.addClass.bind(this)}>
            <i className='material-icons add-obj-icon'>add</i>
          </a>
        </div>
      </form>
    )
  }
}

// Experience Editor, for both Work Experience and Education editing.
// Pass in 'work' or 'educ' to 'type' prop to set proper text.
export class EditExperience extends Component {
  constructor (props) {
    super(props)
    var titleText = props.type === 'work' ? 'Title' : 'School Name'
    var titlePlacehold = props.type === 'work'
      ? "Dr. Labby's Lab"
      : 'University of Michigan'
    var textPlacehold = props.type === 'work'
      ? 'Decribe your role'
      : 'Undergraduate Degree in Biology ...'
    var initObjs = [
      {
        id: 'o_0',
        title: '',
        start_date: '',
        end_date: '',
        description: ''
      }
    ]
    if (
      props.type === 'work' &&
      props.user &&
      props.user.work_experiences &&
      props.user.work_experiences.length
    ) {
      initObjs = deepCopy(props.user.work_experiences)
    }
    if (
      props.type === 'educ' &&
      props.user &&
      props.user.education &&
      props.user.education.length
    ) {
      initObjs = deepCopy(props.user.education)
    }
    this.state = {
      objs: initObjs,
      titleText,
      titlePlacehold,
      textPlacehold
    }
    this.state.index = this.state.objs.length
  }

  componentWillReceiveProps (nextProps) {
    if (
      nextProps.user &&
      (nextProps.user.work_experiences || nextProps.user.education)
    ) {
      if (
        nextProps.user.work_experiences &&
        nextProps.user.work_experiences.length
      ) {
        this.setState({ objs: deepCopy(nextProps.user.work_experiences) })
      }
    }
  }

  addObj (event) {
    var newObj = {
      id: 'o_' + this.state.index,
      title: '',
      start_date: '',
      end_date: '',
      description: ''
    }
    var newIndex = this.state.index + 1
    var updated_objs = this.state.objs
    updated_objs.push(newObj)
    this.setState({
      objs: updated_objs,
      index: newIndex
    })
    if (this.props.updateUser) {
      if (this.props.type === 'work') {
        this.props.updateUser('work_experiences', updated_objs)
      } else {
        this.props.updateUser('education', updated_objs)
      }
    }
  }

  alterObj (event, id) {
    var temp_objs = this.state.objs
    var index = temp_objs.findIndex(item => item.id === id)
    var new_val = event.target.value
    if ((event.target.name == 'start_date' || event.target.name == 'end_date')
        && (temp_objs[index][event.target.name].length < event.target.value.length)) {
        let ret_obj = validDateChange(new_val)
        if (!ret_obj.success)
          return
        new_val = ret_obj.new_val
    }
    temp_objs[index][event.target.name] = new_val
    this.setState({
      objs: temp_objs
    })
    if (this.props.updateUser) {
      if (this.props.type === 'work') {
        this.props.updateUser('work_experiences', temp_objs)
      } else {
        this.props.updateUser('education', temp_objs)
      }
    }
  }

  removeObj (id) {
    this.setState(prevState => {
      var temp_objs = prevState.objs
      var removeIndex = temp_objs
        .map(function (item) {
          return item.id
        })
        .indexOf(id)
      temp_objs.splice(removeIndex, 1)
      if (this.props.updateUser) {
        if (this.props.type === 'work') {
          this.props.updateUser('work_experiences', temp_objs)
        } else {
          this.props.updateUser('education', temp_objs)
        }
      }
      return {
        objs: temp_objs
      }
    })
  }

  render () {
    var experiences = []
    this.state.objs.map(obj => {
      experiences.push(
        <div key={obj.id}>
          <div className='row'>
            <div className='col s11'>
              <div className='input-field'>
                <input
                  id='title'
                  type='text'
                  name='title'
                  placeholder={this.state.titlePlacehold}
                  value={obj.title}
                  onChange={e => this.alterObj(e, obj.id)}
                />
                <label htmlFor='title' className='active'>
                  {this.state.titleText}
                </label>
              </div>
              <div className='input-field col s5'>
                <input
                  id='start_date'
                  type='text'
                  name='start_date'
                  placeholder='08/17'
                  value={obj.start_date}
                  onChange={e => this.alterObj(e, obj.id)}
                />
                <label htmlFor='start_date' className='active'>
                  Start Date <i>[mm/yy]</i>
                </label>
              </div>
              <div className='input-field col s5'>
                <input
                  id='end_date'
                  type='text'
                  name='end_date'
                  placeholder='06/18'
                  value={obj.end_date}
                  onChange={e => this.alterObj(e, obj.id)}
                />
                <label htmlFor='end_date' className='active'>End Date <i>[mm/yy]</i></label>
              </div>
              <textarea
                id={obj.id}
                type='text'
                placeholder={this.state.textPlacehold}
                className='textarea-experience'
                name='description'
                value={obj.description}
                onChange={e => this.alterObj(e, obj.id)}
                required
              />
            </div>
            <div className='col s1'>
              <a id={obj.id} onClick={() => this.removeObj(obj.id)}>
                <i className='material-icons remove-obj experience-remove'>
                  clear
                </i>
              </a>
            </div>
          </div>
          <div className='edit-experience-hr' />
        </div>
      )
    })

    return (
      <form id='edit-experience'>
        {experiences}
        <div className='add-obj-icon-container'>
          <a onClick={this.addObj.bind(this)}>
            <i className='material-icons add-obj-icon'>add</i>
          </a>
        </div>
      </form>
    )
  }
}

export class EditQuickview extends Component {
  constructor (props) {
    super(props)

    this.state = {
      image: props.img,
      rotate: 0,
      scale: 1.0,
      name: '',
      university: props.user && props.user.university
        ? props.user.university
        : '',
      x: 0.5,
      y: 0.5,
      rotate: 0
    }
  }

  componentWillReceiveProps (props) {
    var name = ''

    if (props.user) {
      this.setState({
        name: props.user.name,
        university: props.user.university,
        image: props.user.img || props.img
      })
    }
  }

  componentDidMount () {
    if (this.props.updateUser) {
      this.props.updateUser('crop', {
        x: this.state.x,
        y: this.state.y,
        rotate: this.state.rotate,
        scale: this.state.scale
      })
    }
  }

  handleDrop = dropped => {
    this.setState({ image: dropped[0] })
    if (this.props.updateUser) {
      this.props.updateUser('img', dropped[0])
    }
  }

  handleSlider = e => {
    this.setState({
      scale: parseFloat(e.target.value, 10)
    })

    if (this.props.updateUser) {
      this.props.updateUser('crop', {
        x: this.state.x,
        y: this.state.y,
        rotate: this.state.rotate,
        scale: e.target.value
      })
    }
  }

  handleRotate = () => {
    this.setState({ rotate: this.state.rotate - 90 }, () => {
      if (this.props.updateUser) {
        this.props.updateUser('img_rotate', this.state.rotate)
      }
    })
  }

  handleMove = crop => {
    this.setState(crop)
    this.props.updateUser('crop', {
      x: this.state.x,
      y: this.state.y,
      rotate: this.state.rotate,
      scale: this.state.scale
    })
  }

  render () {
    var schoolSection = (
      <div className='input-field'>
        <input
          id='profile-school'
          type='text'
          placeholder='Hogwarts'
          value={this.state.university}
          onChange={e => {
            if (this.props.updateUser) {
              this.props.updateUser('university', e.target.value)
            }
            this.setState({ university: e.target.value })
          }}
        />
        <label htmlFor='profile-school' className='active'>School</label>
      </div>
    )

    var nameSection = (
      <div className='input-field'>
        <input
          id='profile-name'
          type='text'
          placeholder='Rodriguez Happypants'
          value={this.state.name}
          onChange={e => {
            this.setState({ name: e.target.value })
            if (this.props.updateUser) {
              this.props.updateUser('name', e.target.value)
            }
          }}
        />
        <label htmlFor='profile-name' className='active'>Name</label>
      </div>
    )

    if (this.props.showNoSchool) {
      schoolSection = null
      nameSection = (
        <div className='onboarding-text'>
          Add a profile photo and edit using the slider and rotate tool below.
          <br /><br />Or, by default, stick with our friendly mascot, Rodriguez!
        </div>
      )
    }

    return (
      <div className='quickview-editor-container'>
        <div id='quickview-editor-L'>
          <Dropzone
            onDrop={this.handleDrop}
            disableClick
            style={{ width: '250px', height: '250px' }}
          >
            <AvatarEditor
              image={this.state.image}
              width={200}
              height={200}
              border={20}
              color={[0, 0, 0, 0.2]}
              scale={this.state.scale}
              rotate={this.state.rotate}
              borderRadius={100}
              className='grabbable'
              onPositionChange={this.handleMove}
            />

          </Dropzone>
          <i>Drag and drop image</i>
          <div id='prof-pic-editors'>
            <div className='range-field'>
              <input
                type='range'
                id='profile-pic-range'
                min='1'
                max='5'
                step='0.1'
                defaultValue='1'
                onChange={this.handleSlider}
              />
            </div>
            {/*<i
              id='rotate-icon'
              className='material-icons'
              onClick={this.handleRotate}
            >
              rotate_90_degrees_ccw
            </i>*/}
          </div>
          <br /><br />
        </div>
        <div id='quickview-editor-R'>
          {nameSection}
          {/* schoolSection */}
        </div>
      </div>
    )
  }
}
