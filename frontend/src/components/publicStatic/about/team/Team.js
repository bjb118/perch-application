import React, { Component } from 'react'
import './Team.css'
import Card from './Card.js'
import TableCard from '../../../utilities/TableCard.js'
import { getMemberData, getAdvisorData } from '../../../../data/memberData'

// initialize member mapping
var memberBySlug = {}

getMemberData().map(member => {
  memberBySlug[member.slug] = member
})

const subteams = [
  'Mascot Division',
  'Administration',
  'Web Development',
  'Graphics',
  'Chemical Engineering',
  'Psychology/Sociology',
  'Chemistry',
  'Biology',
  'Business',
  'Perch Blog',
  'Advisors'
]

// Mascot
const t0 = ['rodriguez']

// Administration
const t1 = ['anishii', 'nkataoka', 'mpatel', 'hpark']

// Web Development
const t2 = ['bbear', 'ejackson', 'arao', 'ckaczmarek', 'hwang', 'rnayak']

// Graphics
const t3 = ['kjohnson']

// Chemical Engineering
const t4 = [
  'ikopyeva',
  'sbutrus',
  'vraman',
  'amin',
  'adesai',
  'abanka',
  'cpalaciosrolston',
  'eprantzalos',
  'ekhera',
  'jtan',
  'kgreenman',
  'lchen'
]

// Psychology/Sociology
const t5 = ['kglozier', 'kniles', 'kmartin']

// Chemistry
const t6 = ['salektiar', 'jzhang', 'jmanske', 'mkuang', 'smccarthy', 'wni']

// Biology
const t7 = [
  'sbalijepalli',
  'agirgis',
  'kmckernan',
  'njasti',
  'nbidthanapally',
  'rkathawate'
]

// Business
const t8 = ['vdoddipatla', 'aappukutty', 'rvaishnav', 'asatyavarapu']

// Perch Blog
const t9 = ['rtarnopol']

const t10 = getAdvisorData().map(advisor => {
  return advisor.slug
})

const teamsMap = { t0, t1, t2, t3, t4, t5, t6, t7, t8, t9, t10 }
var teamMemIdx = {
  t0: 0,
  t1: 0,
  t2: 0,
  t3: 0,
  t4: 0,
  t5: 0,
  t6: 0,
  t7: 0,
  t8: 0,
  t9: 0
}

// rows [0   1   2   3   4   5   6   7   8   9  10  11]
const r0 = [0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 8]
const r1 = [1, 2, -1, -1, -1, -1, -1, -1, 6, 7, 7, 8]
const r2 = [1, 2, 2, 4, 4, 4, 4, 5, 6, 7, 7, 8]
const r3 = [1, 2, 2, 4, 4, 4, 4, 5, 6, 6, 7, 8]
const r4 = [1, 2, 3, 4, 4, 4, 4, 5, 6, 6, 7, 9]

const kr0 = [0, -1, 6]
const kr1 = [1, 4, 7]
const kr2 = [2, 5, 8]
const kr3 = [3, 10, 9]

const tableBones = [r0, r1, r2, r3, r4]
const keyBones = [kr0, kr1, kr2, kr3]

var cardTable = [[], [], [], [], []]

for (var i = 0; i < 5; ++i) {
  for (var j = 0; j < 12; ++j) {
    var teamNum = tableBones[i][j]
    var key = `${i}_${j}`
    var colSplit = !!(j === 2 || j === 7)

    if (teamNum !== -1) {
      var curIdx = teamMemIdx[`t${teamNum}`]
      var member = memberBySlug[teamsMap[`t${teamNum}`][curIdx]]
      teamMemIdx[`t${teamNum}`] += 1
      cardTable[i].push(
        <TableCard
          colSplit={colSplit}
          key={key}
          member={member}
          team={`t${teamNum}`}
        />
      )
    } else {
      var placeholdCSS = 'card-placehold'
      placeholdCSS += colSplit ? ' table-split' : ''
      cardTable[i].push(<div key={key} className={placeholdCSS} />)
    }
  }
}

class Team extends Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  mouseActionKeyItem (name, enter) {
    let key = `t${subteams.indexOf(name)}`
    let memberIds = teamsMap[key]
    memberIds.map(memId => {
      if (enter) document.getElementById(memId).classList.add('activated')
      else document.getElementById(memId).classList.remove('activated')
    })
  }

  render () {
    var mainTableBody = cardTable.map((cardRow, idx1) => {
      return (
        <div key={`${idx1}hm`} className='table-row'>
          {cardRow.map((card, idx2) => {
            return (
              <div key={`${idx1}_${idx2}`} className='table-card-container'>
                {card}
              </div>
            )
          })}
        </div>
      )
    })

    var advisors = (
      <div key={`10hm`} className='table-row advisors'>
        {' '}{getAdvisorData().map(advisor => {
          return (
            <div key={advisor.slug} className='table-card-container'>
              <TableCard member={advisor} team={`t10`} />
            </div>
          )
        })}
        <div key='one-blank-for-offset' className='table-card-container'>
          <div className='card-placehold' />
        </div>
      </div>
    )

    var perchiodicTable = (
      <div>
        {mainTableBody}
        {advisors}
      </div>
    )

    var key = keyBones.map(keyRow => {
      return keyRow.map(idx => {
        if (idx === -1) {
          return <div key={idx} className='key-item' />
        }
        var subteamName = subteams[idx]
        var tileCSS = `key-tile t${idx}-tccbg`
        return (
          <div
            key={idx}
            className='key-item'
            onMouseEnter={() => this.mouseActionKeyItem(subteamName, true)}
            onMouseLeave={() => this.mouseActionKeyItem(subteamName, false)}
          >
            <div className={tileCSS} />
            <div className='key-item-text'>{subteamName}</div>
          </div>
        )
      })
    })
    
    return (
      <div>
        <div className='periodic-table-container'>
          <div className='perchiodic-table-key'>
            <div className='perch-story-header key-title'>
              The Per
              <span style={{ color: 'var(--active)' }}>{'{ch}'}</span>
              iodic Table
            </div>
            <div className='key-col'>
              {key}
            </div>
          </div>
          {perchiodicTable}
          <br /><br />
        </div>
      </div>
    )
  }
}

export default Team
