import React from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import FormData from 'form-data'
import { 
  getModelHasMany, 
  respond,  
  error_handle, 
  simpleGet,
  simplePost,
  simplePatch,
  formDataPost,
  hasManyDelete,
  simpleDelete,
} from './BackendHelpers'


// Check a user's role
export function getUserRole() {
  return sessionStorage.getItem('user_role')
}

export function getCurrentUserId () {
  return sessionStorage.getItem('user_id')
}

export function isStudent() {
  return getUserRole() === "student"
}

export function isFaculty() {
  return getUserRole() === "faculty"
}

export function hasApprovalPower() {
  return sessionStorage.getItem('user_has_approval_power')
}

export function getUser({user_id}) {
  return simpleGet({ path: 'users/' + user_id })
}

// Gets the user profile without additional info
export function getUserProfile({user_id}) {
  return simpleGet({path: 'users/' + user_id + '/profile'})
}

// Gets a user with all profile information
export function getUserProfileFull({user_id}) {
  return axios
  .get('users/' + user_id)
  .then(response => {
    let user = response.data
    return axios
    .get('users/' + user_id + '/profiles')
    .then(response2 => {
      let profile = response2.data
      return getModelHasMany({
        path: '/profiles/' + profile.id,
        fields: [
          'experiences',
          'degrees',
          'links',
          'certifications',
          'honors',
        ]
      })
      .then(response => {
        user.profile = response
        return user
      })
    })
  })
}

// RESTRICTED: user_id
export function deleteUser() {
  let user_id = sessionStorage.getItem('user_id')
  return axios
    .delete('users/' + user_id)
    .then(response => {
      sessionStorage.clear()
      return respond(response.status, response.data)
    })
    .catch(error => {
      return error_handle(error)
    })
}

// RESTRICTED: user_id
export function updateUser({user}) {
  let user_id = sessionStorage.getItem('user_id')
  // user._method = 'PUT'
  return simplePatch({ 
    path: 'users/' + user_id,
    data: user,
  })
}

export function updateUserProfile({profile}) {
  let profile_id = profile.id
  delete profile.id
  return simplePatch({
    path: 'profiles/' + profile_id, 
    data: profile,
  })
}

export function getUserGroups() {
  let user_id = sessionStorage.getItem('user_id')
  return simpleGet({ path: 'users/' + user_id + '/groups' })
}

// Profile component functions require the profileId
// to be supplied in the data object

// File functions (images and documents)

/* 
Gets all file models of the document type from user
Returns array of models with url to AWS location of file, along with
extra file releated metadata
*/ 
export function getUserDocumentFiles() {
  let user_id = sessionStorage.getItem('user_id')
  return simpleGet({ path: 'users/' + user_id + '/files/document' })
}

/* 
Gets all file models of the document type from user
Returns array of models with url to AWS location of file, along with
extra file releated metadata
*/ 
export function getUserImageFiles() {
  let user_id = sessionStorage.getItem('user_id')
  return simpleGet({ path: 'users/' + user_id + '/files/image' })
}

export function uploadUserDocumentFile({file}) {
  let user_id = sessionStorage.getItem('user_id')
  return formDataPost({ 
    path: 'users/' + user_id + '/files/document', 
    data: file 
  })
}

export function uploadUserImageFile({file}) {
  let user_id = sessionStorage.getItem('user_id')
  return formDataPost({ 
    path: 'users/' + user_id + '/files/image', 
    data: file 
  })
}

/*
deletes the File model and the associated fileType model
*/
export function deleteUserFile({file_id}) {
  let user_id = sessionStorage.getItem('user_id')
  return simpleDelete({ 
    path: 'users/' + user_id + '/files/' + file_id
  })
}

// Certification functions



// Experience functions

export function addExperienceToStudent({experience}) {
  let profile_id = experience.profileId
  delete experience.profileId
  experience.type = 'education'
  return simplePost({
    path: 'profiles/' + profile_id + '/experiences', 
    data: experience,
  })
}

export function updateExperienceOfStudent({experience}) {
  let experience_id = experience.id
  delete experience.id
  return simplePatch({
    path: 'experiences/' + experience_id,
    data: experience,
  })
}

export function removeExperiencesFromStudent({profile_id, experience_ids}) {
  return hasManyDelete({
    path: 'profiles/' + profile_id + '/experiences', 
    id_array: experience_ids,
  })
}

// Degree functions



// Honor functions


// Link functions