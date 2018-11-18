import React, { Component } from 'react'
import './PerchStory.css'
import story from '../../../../data/perchStoryData'

class PerchStory extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    let text = story.map(item => {
      return (
        <div className='perch-story-block'>
          <img src={item.img} />
          <div dangerouslySetInnerHTML={{ __html: item.text }} />
        </div>
      )
    })
    let custom_images = (
      <div className='perch-story-container'>
        <div className='perch-story-row'>
          <img src='/assets/research.svg' className='perch-story-row-img' />
          <div className='perch-story-text perch-story-row-text'>
            Getting
            {' '}
            <b>research experience</b>
            {' '}
            is important in academia and industry. Research,
            {' '}
            <b>heck yeah!</b>
          </div>
        </div>
        <div className='perch-story-row'>
          <div className='perch-story-text perch-story-row-text long'>
            {' '}
            However,
            {' '}
            <b>finding a lab can stink</b>
            , with lab pages scattered across the deep, dark abyss of University department web pages, leading to
            {' '}
            <b>poor matches, confused students, & frustrated PIs.</b>
          </div>

          <img src='/assets/search.svg' className='perch-story-row-img' />
        </div>
        <div className='perch-story-text centered'>
          <b>That's where Perch comes in!</b>
          {' '}
          Perch puts all the information you want into
          {' '}
          <b>one awesome system</b>
          , linking heckin' cool labs with equally cool and interested students.
        </div>
        <img src='/assets/perch_page.svg' className='perch-match-img' />
        <div className='perch-story-text centered'>
          Let's
          {' '}
          <b>de-awkwardize</b>
          {' '}
          creating strong research teams.
          <br />
          {' '}
          <a href='/home'>Sign up</a>
          {' '}
          for Perch as a lab or student.
        </div>
        <br /><br />
      </div>
    )
    return (
      <div className='perch-story'>
        {this.props.page !== 'main' &&
          <div className='perch-story-header'>The Perch Story</div>}
        {custom_images}
      </div>
    )
  }
}

export default PerchStory
