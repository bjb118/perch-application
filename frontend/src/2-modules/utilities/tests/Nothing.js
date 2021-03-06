/**
 * Created by aksha on 7/22/2018.
 */
import React, { Component } from 'react'
import './Nothing.scss'
import Axios from 'axios'
import { projectSearch } from '../../../backend/Project'
import FormData from 'form-data'
import { 
  getUser,
  uploadUserResumeDocument,
  deleteUserFile,
  updateUserProfile,
  getUserGroups,
  getUserProfile,
  inviteMembersToGroup, 
  getGroupUsersAll,
  addSavedProject,
  getSavedProjects,
  uploadResumeFile, uploadProfilePictureFile} from '../../../backend';

class Nothing extends Component {
  constructor () {
    super()
  }

  render () {  
    // // getSavedProjects().then(r=>console.log('projects back', r))
    // // addSavedProject({projectId: 32}).then(r=>console.log('added proj', r))
    // updateUserProfile({
    //   experiences: [
    //     {
    //       type: "work",
    //       title: "Ethanol Shot shenanigan",
    //       description: "Mixing alochol with water off the clock",
    //     }, 
    //     {
    //       type: "work",
    //       title: "Ethanol Shot woah",
    //       description: "Mixing alochol with water off the clock",
    //     }
    // ]
    // }).then(r=>console.log('hi', r)).catch(e=>console.log(e))
    // return <div id='test'>hi</div>

    function upload() {
      let file = document.getElementById('fileToUpload').files[0];
      uploadProfilePictureFile({file: file}).then(r => console.log("file", r))
    }

    return (
      <div>
        <input type="file" name="fileToUpload" id="fileToUpload"></input>
        <button onClick={upload.bind(this)}>Upload</button>
      </div>
    )
  }
}

export default Nothing
