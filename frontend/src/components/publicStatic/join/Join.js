import React, { Component } from 'react'
import BasicButton from '../../utilities/buttons/BasicButton'
import './Join.css'

class Join extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div className='join-content'>
        <div className='join-header'>Join the Perch Team!</div>
        <div className='join-sub-header'>
          Perch is looking for motivated students to help as we expand our service at all levels.
          {' '}
          <br />
          <b>
            We accept applications year round and review them as they come in
          </b>
          <br />
          {' '}
          and you can
          {' '}
          <a dest='mailto:info@perchresearch.com'>Contact Us</a>
          {' '}
          for any questions
        </div>
        <div className='join-position'>
          <div className='join-position-title'>
            Software Developers (Frontend/Backend)
          </div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Work under advisement from Microsoft product lead and UM computer science faculty to design and implement Perch website and blog
            </div>
          </div>
          <div className='join-position-sub-title'>Desired Skills:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              React/PHP/Javascript knowledge, or enough programming background to pick up these technologies quickly
            </div>
            <div className='join-position-list-item'>Web app experience</div>
          </div>
          <br />
          <BasicButton msg='Take our challenge' dest='/challenge' />
        </div>
        <div className='join-position'>
          <div className='join-position-title'>Undergraduate Instructors</div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Work in collaboration with UM faculty from the biology department, the chemistry department, the chemical engineering department, the medical school, and the UM library to design and implement Perch teaching curriculum and/or Perch online modules
            </div>
          </div>
          <div className='join-position-sub-title'>Desired Skills:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              At least two years of research experience in a molecular biology or chemistry lab OR have experience in MATLAB, Python, R, or any other programming languages extensively used in research laboratories OR have extensive teaching experience in a discipline
            </div>
            <div className='join-position-list-item'>
              Prior teaching experience is preferable
            </div>
          </div>
          <br />
          <BasicButton
            msg='Apply'
            dest='https://goo.gl/forms/4wfjNAb9B8Y56mEI2'
          />
        </div>
        <div className='join-position'>
          <div className='join-position-title'>Science Writers</div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Collaborate with other Perch science writers to discuss/write/edit articles relevant to research and education for Perch blogs
            </div>
          </div>
          <div className='join-position-sub-title'>Desired Skills:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Seasoned writers who have some experience working in a scientific laboratory OR is interested in writing on the topic of education
            </div>
          </div>
          <br />
          <BasicButton
            msg='Apply'
            dest='https://goo.gl/forms/os1l2fi6R1fXMyss1'
          />
        </div>
        <div className='join-position'>
          <div className='join-position-title'>Videographer</div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Develop videos for...
              <div className='join-position-list'>
                <div className='join-position-list-item'>Perch advisement</div>
                <div className='join-position-list-item'>
                  Lab and research modules to be used in classes
                </div>
                <div className='join-position-list-item'>
                  Perch website tutorial videos
                </div>
              </div>
            </div>
          </div>
          <br />
          <BasicButton
            msg='Apply'
            dest='https://goo.gl/forms/aund1WJgb9OsR1nr2'
          />
        </div>
        <div className='join-position'>
          <div className='join-position-title'>Business Manager</div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Contact and communicate with corporate partners, as well as manage financials of the organization
            </div>
          </div>
          <div className='join-position-sub-title'>Desired Skills:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Effective communication skills
            </div>
            <div className='join-position-list-item'>
              Previous experience collecting and managing funds for an organization
            </div>
          </div>
          <br />
          <BasicButton
            msg='Apply'
            dest='https://goo.gl/forms/eB8oionOTl4d58HW2'
          />
        </div>
        <div className='join-position'>
          <div className='join-position-title'>
            UX Designer/Graphic Designer
          </div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Provide insight on design of Perch website to ensure quality user experience
            </div>
            <div className='join-position-list-item'>
              Build wireframe of new website implementations
            </div>
            <div className='join-position-list-item'>
              Logo and advertiesment design
            </div>
          </div>
          <br />
          <BasicButton
            msg='Apply'
            dest='https://goo.gl/forms/aund1WJgb9OsR1nr2'
          />
        </div>
        <div className='join-position'>
          <div className='join-position-title'>Marketing</div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Generate awareness for the Perch platform and Perch classes using various promotional strategies, such as merchandise
            </div>
            <div className='join-position-list-item'>
              Improve Perch social media presence (e.g. Twitter, LinkedIn, Facebook)
            </div>
            <div className='join-position-list-item'>
              Work in collaboration with the graphic design team
            </div>
            <div className='join-position-list-item'>
              Use WordPress to maintain wesite for the Perch classes
            </div>
          </div>
          <br />
          <BasicButton
            msg='Apply'
            dest='https://goo.gl/forms/eB8oionOTl4d58HW2'
          />
        </div>
        <div className='join-position'>
          <div className='join-position-title'>Finance</div>
          <div className='join-position-sub-title'>Description:</div>
          <div className='join-position-list'>
            <div className='join-position-list-item'>
              Allocation of funding to various subteams of the organization
            </div>
            <div className='join-position-list-item'>
              Apply to grants from the university and other startup funding opportunities
            </div>
          </div>
          <br />
          <BasicButton
            msg='Apply'
            dest='https://goo.gl/forms/eB8oionOTl4d58HW2'
          />
        </div>

      </div>
    )
  }
}

export default Join
