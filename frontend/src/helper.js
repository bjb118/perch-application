/**
 * Created by aksha on 2/28/2018.
 */

import React from "react";
import { Redirect } from "react-router-dom";
import axios from 'axios';
import FormData from 'form-data'

axios.defaults.headers.common = {};

axios.defaults.baseURL = 'https://perchresearch.com:3000/';          // Dev
//axios.defaults.baseURL = 'http://18.211.86.64:8000/';     // Production
//axios.defaults.baseURL = 'http://localhost:8000';         // Local

axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['Accept'] = 'application/json';

if (sessionStorage.token){
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
}

// HELPER HELPERS //

function respond(status, data) {
    return {'status': status, 'data': data.result, 'msg': data.message}
}

function error_respond(error) {
    return {'status': error.response.status, 'error': error.response.data.error.message, 'exception': error.response.data.error.exception}
}

// 0 is a made up error code for non-server-related issues
function error_handle(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        //return respond(error.response.status, error.response);
        if (error.response.data.error)
            throw error_respond(error);
        else
            throw error.response.data;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        //return respond(0, error.request)
        throw error;
    } else {
        // Something happened in setting up the request that triggered an Error
        //return respond(0, error.message)
        throw error;
    }
}

// AUTHENTICATION //

export function isLoggedIn() {
    if(sessionStorage.getItem('token') == null) {
        console.log('Not logged in');
        return false;
    }
    console.log('Logged in');
    return true;
}

export function verifyLogin() {
    return axios.post('api/verify')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch((error) => {
            return error_handle(error);
        })
}

export function registerUser(name, email, password, password_confirmation) {
    return axios.post('api/register', {
        name,
        email,
        password,
        password_confirmation
    })
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch((error) => {
            return error_handle(error);
        })
}

export function loginUser(email, password) {
    // // Clear all user cookies
    // cookie.remove('perch_api_key');
    // cookie.remove('perch_user_id');

    // Benji changed this
    sessionStorage.clear();

    // Login
    console.log('logging in ' + email);
    //console.log(password);

    return axios.post('api/login', {
        email, password
    })
        .then(response => {
            sessionStorage.setItem('token', response.data.result.token);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + sessionStorage.getItem('token');
            sessionStorage.setItem('user_id', response.data.result.user.id);
            if (response.data.result.user.is_student) {
                // Save student id
                sessionStorage.setItem('student_id', response.data.result.user.student.id);
                // sessionStorage.setItem('faculty_id', null);
            }
            if (response.data.result.user.is_faculty) {
                // sessionStorage.setItem('student_id', null);
                sessionStorage.setItem('faculty_id', response.data.result.user.faculty.id); // EMI HAS CHANGED THIS! FROM HERE TILL...
                //sessionStorage.setItem('lab_id', response.data.result.user.labs[0].id);
                // getUserLabs(response.data.result.user.id).then(resp => {
                //     console.log(resp);
                //     // sessionStorage.setItem('lab_id', somethin_good);
                // }); // ... HERE!
            }
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        });
}

export function loginUserIdp(email, idp, accessToken) {
    sessionStorage.clear();

    // Login
    console.log('logging in ' + email + ' via ' + idp);

    return axios.post('oauth/token', {
        "client_id": 1,
        "grant_type": "idp",
        "idp": idp,
        "idpToken": accessToken,
        "register": false,
    })
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        return error_handle(error);
    })
}

export function logoutCurrentUser() {
    // Clear all user cookies
    //   cookie.remove('perch_api_key');
    //   cookie.remove('perch_user_id');
    let oldToken = sessionStorage.getItem('token');
    // Benji changed this
    sessionStorage.clear();

    return axios.post('api/logout')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch((error) => {
            return error_handle(error);
        })
}

// Email password reset
// First call sendPasswordResetEmail
// User will get a link to /password/reset/{token}
// On that page, have user input email, password, pass confirmation
// Then class resetPasswordFromEmail with this info, along with the token in the url
export function sendPasswordResetEmail(email) {
    return axios.post('password/email', {email})
        .then(response=> {
            console.log(response.data);
            return response.data;
        })
        .catch(error=> {
            console.error(error);
            return false;
        });
}

export function resetPasswordFromEmail(email, password, password_confirmation, token) {
    return axios.post('password/reset', {email, password, password_confirmation, token})
        .then(response=> {
            console.log(response.data);
            return response.data;
        })
        .catch(error=> {
            console.error(error);
            return false;
        });
}

// CHANGED BY BENJI (Most of these getId's)

export function getCurrentUserId() {
    return sessionStorage.getItem('user_id');
}

export function getCurrentStudentId() {
    return sessionStorage.getItem('student_id');
}

export function getCurrentLabId() {
    return sessionStorage.getItem('lab_id');
}

export function getCurrentFacultyId() {
    return sessionStorage.getItem('faculty_id');
}

export function isStudent() {
    return sessionStorage.getItem('student_id') != null;
}

export function isLab() {
    return sessionStorage.getItem('lab_id') != null;
}

export function isFaculty() {
    return sessionStorage.getItem('faculty_id') != null; // changed by benji
}

// USERS //

// Users
// Base user type on website
// user:
// name - (string) username
// email - (string) sign up email
// password - (string)
// is_student - (bool)
// is_faculty - (bool)

export function getAllUsers() {
    console.log('Getting users');
    return axios.get('api/users')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch((error) => {
            return error_handle(error);
        })
}

export function getUser(user_id) {
    console.log('Getting user');
    return axios.get('api/users/' + user_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: user_id
export function deleteUser() {
    console.log('Deleting user');
    let user_id = sessionStorage.getItem('user_id');
    sessionStorage.clear();
    return axios.delete('api/users/' + user_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: user_id
export function updateUser(user) {
    console.log('Updating user');

    let user_id = sessionStorage.getItem('user_id');
    user._method = 'PUT';

    return axios.post('api/users/' + user_id, user)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getStudentFromUser(user_id) {
    console.log('Getting student');
    return axios.get('api/users/' + user_id + '/student')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getFacultyFromUser(user_id) {
    console.log('Getting faculty');
    return axios.get('api/users/' + user_id + '/faculty')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Get all labs that this user is a member of, along with their role id
export function getUserLabs(user_id) {
    console.log('Getting user labs');

    return axios.get('api/users/' + user_id + '/labs')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// USER FILES //

// file:
// formData - (formData object)
// type - (string)

// RESTRICTED: user_id
// Possible types:
// 'resume'
// 'profile_pic'
// NOTE: you should pass in a FormData object with the file appended, for example
// let formData = new FormData();
// formData.append('file', fileInputElement.files[0])
// uploadUserFile(formData, 'resume');

// Can currently only hold one of each file type per account
// Uploading a new file overwrites the old one of same type
export function uploadUserFile(file) {
    if (file.type !== 'resume' && file.type !== 'profile_pic') {
        console.log('Error: invalid type parameter');
        return;
    }

    let user_id = sessionStorage.getItem('user_id');

    return axios.post('api/users/' + user_id + '/' + file.type,
        file.formData,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getUserFile(type, user_id) {
    if (type !== 'resume' && type !== 'profile_pic') {
        console.log('Error: invalid type parameter');
        return;
    }

    if (!user_id){
        console.log('getting default user')
        user_id = sessionStorage.getItem('user_id');
    }
    else {
        console.log(`getting user id ${user_id}`)
    }
    let payload = {
        _method: 'PUT',
        user_id: user_id
    }
    return axios.post('api/users/' + user_id + '/' + type, payload)
        .then(response => {
            console.log(response)
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


// STUDENTS //

// Students
// Student profile

// student:
// first_name - (string)
// last_name - (string)
// contact_email - (string)
// contact_phone - (string)
// bio - (string)
// linkedin_link - (string)
// website_link - (string)
// is_urop_student - (bool)
// skill_ids - (array of ints)
// tag_ids - (array of ints)

export function getAllStudents() {
    console.log('Getting students');
    return axios.get('api/students')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getStudent(student_id) {
    console.log('Getting student');
    return axios.get('api/students/' + student_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function createStudent(user_id, student) {
    console.log('Creating student');
    student.user_id = user_id;
    return axios.post('api/students', student)
        .then(response => {
            sessionStorage.setItem('student_id', response.data.result.id); // CHANGED BY BENJI
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
// NOTE: skill_ids and tag_ids must be an array of integer ids
export function updateStudent(updated_student) {
    console.log('Updating student');

    let student_id = sessionStorage.getItem('student_id');
    updated_student._method = 'PUT';
    return axios.post('api/students/' + student_id, updated_student)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function deleteStudent() {
    console.log('Deleting student');

    let student_id = sessionStorage.getItem('student_id');
    return axios.delete('api/students/' + student_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


export function getStudentSkills(student_id) {
    console.log('Getting student skills');
    return axios.get('api/students/' + student_id + '/skills')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function addSkillsToStudent(skill_ids) {
    console.log('Adding skills to student');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        skill_ids: skill_ids
    };
    return axios.post('api/students/' + student_id + '/skills', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function syncSkillsToStudent(skill_ids) {
    console.log('Syncing skills to student');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        skill_ids: skill_ids
    };
    return axios.post('api/students/' + student_id + '/skills/sync', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function removeSkillsFromStudent(skill_ids) {
    console.log('Removing skills from student');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        skill_ids: skill_ids,
        _method: 'PUT'
    };
    return axios.post('api/students/' + student_id + '/skills', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


export function getStudentTags(student_id) {
    console.log('Getting student tags');
    return axios.get('api/students/' + student_id + '/tags')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function addTagsToStudent(tag_ids) {
    console.log('Adding tags to student');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        tag_ids: tag_ids
    };
    return axios.post('api/students/' + student_id + '/tags', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function syncTagsToStudent(tag_ids) {
    console.log('Syncing tags to student');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        tag_ids: tag_ids
    };
    return axios.post('api/students/' + student_id + '/tags/sync', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function removeTagsFromStudent(tag_ids) {
    console.log('Removing tags from student');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        tag_ids: tag_ids,
        _method: 'PUT'
    };
    return axios.post('api/students/' + student_id + '/tags', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


// Lab list
// RESTRICTED: student_id
// NOTE: lab_ids must be an array of integer ids
export function addToStudentPositionList(position_ids) {
    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        position_ids: position_ids
    };
    return axios.post('api/students/' + student_id + '/position_list', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function removeFromStudentPositionList(position_ids) {
    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        position_ids: position_ids,
        _method: 'PUT'
    };
    return axios.post('api/students/' + student_id + '/position_list', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Edu Experiences
// Description of education at a school/university

// edu_experience:
// university_name - (string) name of university
// start_date - (string)
// end_date - (string)
// current - (bool) student is currently at this university
// class_experience_names - (array of strings) names of classes student took (are taking) at this uni
// major_names - (array of strings) names of subjects they majored (are majoring) in

// RESTRICTED: student_id
export function addEduExperienceToStudent(edu_experience) {
    console.log('Adding edu experiences to student');

    let student_id = sessionStorage.getItem('student_id');
    return axios.post('api/students/' + student_id + '/edu_experiences', edu_experience)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function updateEduExperienceOfStudent(edu_experience_id, updated_edu_experience) {
    console.log('Adding edu experiences to student');

    let student_id = sessionStorage.getItem('student_id');
    updated_edu_experience.edu_experience_id = edu_experience_id;
    updated_edu_experience._method = 'PUT';

    return axios.post('api/students/' + student_id + '/edu_experiences', updated_edu_experience)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
// NOTE: edu_experience_ids must be an array of integer ids
export function removeEduExperiencesFromStudent(edu_experience_ids) {
    console.log('Removing edu experiences from student');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        edu_experience_ids: edu_experience_ids,
    };
    return axios.post('api/students/' + student_id + '/edu_experiences/delete', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Work Experiences
// Student work experience
//  title - (string)
//  description - (string)
//  start_date - (string)
//  end_date - (string)

// RESTRICTED: student_id
// NOTE: Input should be an object formatted like
// {title: 'string',description: 'string',start_date: 'string',end_date: 'string'}
export function addWorkExperienceToStudent(work_experience) {
    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        work_experience: work_experience,
    };
    return axios.post('api/students/' + student_id + '/work_experiences', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function updateWorkExperienceOfStudent(work_experience_id, updated_work_experience) {
    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        work_experience_id: work_experience_id,
        updated_work_experience: updated_work_experience,
        _method: 'PUT'
    };
    return axios.post('api/students/' + student_id + '/work_experiences', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
// NOTE: work_experience_ids must be an array of integer ids
export function removeWorkExperiencesFromStudent(work_experience_ids) {
    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        work_experience_ids: work_experience_ids
    };
    return axios.post('api/students/' + student_id + '/work_experiences/delete', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


// FACULTY //

// Faculties
// Faculty profile

// faculty:
// first_name - (string)
// last_name - (string)
// contact_email - (string) contact email address
// title - (string) title of position in university (e.g. PI, assistant prof, grad student)

export function getAllFaculties() {
    console.log('Getting all faculty');
    return axios.get('api/faculties')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getFaculty(faculty_id) {
    console.log('Getting faculty');
    return axios.get('api/faculties/' + faculty_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function createFaculty(user_id, faculty) {
    console.log('Creating faculty');

    faculty.user_id = user_id;
    return axios.post('api/faculties', faculty)
        .then(response => {
            sessionStorage.setItem('faculty_id', response.data.result.id)
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function updateFaculty(faculty_id, updated_faculty) {
    console.log('Updating faculty');
    updated_faculty._method = 'PUT';
    return axios.post('api/faculties/' + faculty_id, updated_faculty)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function deleteFaculty(faculty_id) {
    console.log('Deleting faculty');
    return axios.delete('api/faculties/' + faculty_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// LABS //

// Labs
// Lab page

// lab:
// name - (string)
// description - (string)
// publications - (string)
// url - (string)
// location - (string)
// contact_phone - (string)
// contact_email - (string)
// labpic_path - (string)

export function getAllLabs() {
    console.log('Getting all labs');
    return axios.get('api/labs')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getLab(lab_id) {
    console.log('Getting lab');
    return axios.get('api/labs/' + lab_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// SPECIAL GETTERS
// Along with the base lab object data, specify what other data you need by setting these to true or false:
// skilltag_data, preferences_data, position_data, application_data, student_data, faculty_data
export function getAllLabData(skilltag_data, preferences_data, position_data, application_data, student_data, faculty_data) {
    console.log('Getting all lab data');
    return axios.post('api/labs/all', {skilltag_data, preferences_data, position_data, application_data, student_data, faculty_data})
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getLabData(lab_id, skilltag_data, preferences_data, position_data, application_data, student_data, faculty_data) {
    console.log('Getting lab data');
    return axios.post('api/labs/' + lab_id, {skilltag_data, preferences_data, position_data, application_data, student_data, faculty_data})
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}
//

// RESTRICTED: authenticated faculty member
export function createLab(lab) {
    console.log('Creating lab');
    return axios.post('api/labs', lab)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function updateLab(lab_id, updated_lab) {
    console.log('Updating lab');
    let _method = 'PUT';
    updated_lab._method = 'PUT';
    return axios.post('api/labs/' + lab_id, updated_lab)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function deleteLab(lab_id) {
    console.log('Deleting lab');

    return axios.delete('api/labs/' + lab_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


// NOTE: skill/tags are now added directly to positions; grabbing lab skills/tags compiles across all its positions

export function getLabSkills(lab_id) {
    console.log('Getting lab skills');
    return axios.get('api/labs/' + lab_id + '/skills')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function addSkillsToLab(lab_id, skill_ids, position_id) {
    console.log('Adding skills to lab');

    let payload = {
        skill_ids: skill_ids,
        position_id: position_id
    };
    return axios.post('api/labs/' + lab_id + '/skills', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function syncSkillsToLab(lab_id, skill_ids, position_id) {
    console.log('Syncing skills to lab');

    let payload = {
        skill_ids: skill_ids,
        position_id: position_id
    };
    return axios.post('api/labs/' + lab_id + '/skills/sync', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function removeSkillsFromLab(lab_id, skill_ids, position_id) {
    console.log('Removing skills from lab');

    let payload = {
        skill_ids: skill_ids,
        position_id: position_id,
        _method: 'PUT'
    };
    return axios.post('api/labs/' + lab_id + '/skills', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


export function getLabTags(lab_id) {
    console.log('Getting lab tags');
    return axios.get('api/labs/' + lab_id + '/tags')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function addTagsToLab(lab_id, tag_ids, position_id) {
    console.log('Adding tags to lab');

    let payload = {
        tag_ids: tag_ids,
        position_id: position_id
    };
    return axios.post('api/labs/' + lab_id + '/tags', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function syncTagsToLab(lab_id, tag_ids, position_id) {
    console.log('Syncing tags to lab');

    let payload = {
        tag_ids: tag_ids,
        position_id: position_id
    };
    return axios.post('api/labs/' + lab_id + '/tags/sync', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function removeTagsFromLab(lab_id, tag_ids, position_id) {
    console.log('Removing tag from lab');

    let payload = {
        tag_ids: tag_ids,
        position_id: position_id,
        _method: 'PUT'
    };
    return axios.post('api/labs/' + lab_id + '/tags', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// export function getLabPreferences(lab_id) {
//     console.log('Getting lab preferences');
//     return axios.get('api/labs/' + lab_id + '/preferences')
//         .then(response => {
//             console.log(response.data.message);
//             return response.data.result;
//         })
//         .catch(function (error) {
//             console.log(error);
//             return [];
//         })
// }
//
// // RESTRICTED: lab_id
// export function addPreferencesToLab(preference_ids) {
//     console.log('Adding preferences to lab');
//
//     let lab_id = sessionStorage.getItem('lab_id');
//     let payload = {
//         tag_ids: preference_ids
//     };
//     return axios.post('api/labs/' + lab_id + '/preferences', payload)
//         .then(response => {
//             console.log(response.data.message);
//             return response.data.result;
//         })
//         .catch(function (error) {
//             console.log(error);
//             return [];
//         })
// }
//
// // RESTRICTED: lab_id
// export function removePreferencesFromLab(preference_ids) {
//     console.log('Removing preferences from lab');
//
//     let lab_id = sessionStorage.getItem('lab_id');
//     let payload = {
//         tag_ids: preference_ids,
//         _method: 'PUT'
//     };
//     return axios.post('api/labs/' + lab_id + '/preferences', payload)
//         .then(response => {
//             console.log(response.data.message);
//             return response.data.result;
//         })
//         .catch(function (error) {
//             console.log(error);
//             return [];
//         })
// }


// Lab members
// Note: members are users
// Roles:
//  1: PI - creator of lab; only person who may delete the lab page
//  2: Admin - admin of lab; may edit lab page, create/accept applications, add/remove members, etc.
//  3: Member - normal lab member

// Gets groups that a user is a part of
// PUBLIC
export function getGroupMemberships(user_id) {
    return axios.get('users/' + user_id + '/labs')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Gets members that belong to a group
// PUBLIC
export function getLabMembers(lab_id) {
    console.log('Getting lab members');
    return axios.get('api/labs/' + lab_id + '/members')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Order of role_ids should correspond with order of user_ids (same size)
// RESTRICTED: authenticated faculty member + lab admin
export function addMembersToLab(lab_id, user_ids, role_ids) {
    console.log('Adding members to lab');

    let payload = {
        user_ids: user_ids,
        role_ids: role_ids
    };

    return axios.post('api/labs/' + lab_id + '/members', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab admin
export function updateLabMember(lab_id, user_id, role_id) {

    let payload = {
        user_ids: user_id,
        role_ids: role_id
    }
    return axios.post('api/labs/' + lab_id + '/members/update', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab admin
export function removeMembersFromLab(lab_id, user_ids) {
    console.log('Removing members from lab');

    let payload = {
        _method: 'PUT',
        user_ids: user_ids
    };

    return axios.post('api/labs/' + lab_id + '/members', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// METADATA //

// Skills
// Laboratory skills
// name - (string)
// description - (string)

// PUBLIC
export function getAllSkills() {
    console.log('Getting all skills');
    return axios.get('api/skills')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getSkill(skill_id) {
    console.log('Getting skill');
    return axios.get('api/skills/' + skill_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function createSkill(name, description) {
    let payload = {
        name: name,
        description: description
    };

    return axios.post('api/skills/', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function searchMatchingSkills(query) {
    return axios.post('api/skills/match', query)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


// Tags
// Academic subjects/disciplines, areas of study, etc.
// name - (string)
// description - (string)
export function getAllTags() {
    console.log('Getting all tags');
    return axios.get('api/tags')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getTag(tag_id) {
    console.log('Getting tag');
    return axios.get('api/tags/' + tag_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function createTag(name, description) {
    let payload = {
        name: name,
        description: description
    };

    return axios.post('api/skills/', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function searchMatchingTags(query) {
    return axios.post('api/tags/match', query)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


// LAB POSITIONS //
// OBSOLETE FOR NOW SINCE WE'RE PRELOADING UROP POSITIONS

// Positions
// Open projects/positions in a lab
//  title - (string)
//  description -(text)
//  duties - (text)
//  min_qual - (text)
//  min_time_commitment - (int) should be either 6,8,10,12 hours
//  contact_email - (string)
//  contact_phone - (string)
//  location - (string)

export function getAllLabPositions(lab_id) {
    console.log('Getting all lab positions');
    return axios.get('api/labs/' + lab_id + '/positions')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function getLabPosition(lab_id, position_id) {
    console.log('Getting position');

    return axios.get('api/labs/' + lab_id + '/position/' + position_id)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab admin
export function createLabPosition(lab_id, position) {
    console.log('Creating position for lab');

    return axios.post('api/labs/' + lab_id + '/positions', position)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab admin
export function updateLabPosition(lab_id, position_id, position) {
    console.log('Updating position');

    position.position_id = position_id;

    return axios.post('api/labs/' + lab_id + '/positions/update', position)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab admin
export function deleteLabPosition(lab_id, position_ids) {
    console.log('Deleting positions');
    
    let payload = {
        position_ids: position_ids
    };

    return axios.post('api/labs/' + lab_id + '/positions/delete', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Applications
// Application of questions attached to an open lab position
// Object which contains:
// position_id - (integer)
// questions - (array of strings)

// export function getApplicationFromPosition(position_id) {
//     console.log('Getting application');
//
//     return axios.get('api/positions/' + position_id + '/application')
//         .then(response => {
//             return respond(response.status, response.data);
//         })
//         .catch(error => {
//             return error_handle(error);
//         })
// }

// RESTRICTED: authenticated faculty member + lab owner
export function createApplication(lab_id, application) {
    console.log('Creating application');

    // let lab_id = sessionStorage.getItem('lab_id');

    // let payload = {
    //     position_id: position_id,
    //     questions: questions
    // };

    return axios.post('api/labs/' + lab_id + '/applications', application)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: authenticated faculty member + lab owner
export function updateApplication(lab_id, application) {
    console.log('Creating application');

    // let lab_id = sessionStorage.getItem('lab_id');

    // let payload = {
    //     position_id: position_id,
    //     questions: questions
    // };

    return axios.post('api/labs/' + lab_id + '/applications/update', application)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Gets ApplicationResponses to a particular position
// RESTRICTED: lab_id
export function getLabPositionApplicants(lab_id, position_id) {

    // let lab_id = sessionStorage.getItem('lab_id');

    console.log('Getting application responses');
    return axios.post('api/labs/' + lab_id + '/positions/responses', {position_id})
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Application Responses
// Response to an application for a position, created by a student
// Object with contains:
// position_id
// responses - (array of strings)
// NOTE: 'create' allows a student to start an application, but it must be 'submitted' for the lab to see

// RESTRICTED: student_id
export function createApplicationResponse(application_response) {
    console.log('Creating application response');

    let student_id = sessionStorage.getItem('student_id');

    // let payload = {
    //     student_id: student_id,
    //     position_id: position_id,
    //     responses: responses
    // };

    return axios.post('api/students/' + student_id + '/responses', application_response)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function updateApplicationResponse(application_response_id, application_response) {
    console.log('Updating application response');

    let student_id = sessionStorage.getItem('student_id');

    let payload = {
        application_response_id: application_response_id,
        application_response: application_response
    };

    return axios.post('api/students/' + student_id + '/responses/update', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function submitApplicationResponse(application_response_id) {
    console.log('Submitting application response');

    let student_id = sessionStorage.getItem('student_id');

    let payload = {
        student_id: student_id,
        application_response_id: application_response_id
    };

    return axios.post('api/students/' + student_id + '/responses/update', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// RESTRICTED: student_id
export function deleteApplicationResponse(application_response_id) {
    console.log('Deleting application response');

    let student_id = sessionStorage.getItem('student_id');

    let payload = {
        student_id: student_id,
        application_response_id: application_response_id
    };

    return axios.post('api/students/' + student_id + '/responses/delete', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Gets responses that haven't yet been submitted (in progress)
// RESTRICTED: student_id
export function getStudentPendingResponses() {
    console.log('Getting application response');

    let student_id = sessionStorage.getItem('student_id');
    let payload = {
        student_id: student_id
    };

    return axios.get('api/students/' + student_id + '/responses', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// MISC //

// Feedback
// User feedback
//  user_id - (int)
//  url - (string) url of the page that user is on at time of submission
//  feedback - (text)
export function submitUserFeedback(user_id, url, feedback) {
    console.log('Submitting feedback');

    return axios.post('api/feedback', {user_id, url, feedback})
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}


// Returns all data necessary for student lab search
export function getSearchData() {
    console.log('Retrieving search data');
    return axios.get('api/search_data')
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Does backend lab search based on parameters
// Each parameters should be an array
// Areas, Skills, Commitments, Departments: use getSearchData to obtain possible queries, and use those queries exactly (case sensitive)
// Keywords: can be any string, will search for exact match

// Returns array of ids of matching projects
export function labSearch(areas, skills, commitments, departments, keyword) {
    console.log('Performing search');

    let payload = {
        areas: areas,
        skills: skills,
        commitments: commitments,
        departments: departments,
        keyword: keyword
    };

    return axios.post('api/search', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

// Retrieves position data based on ids from labSearch
export function getSearchResults(position_ids) {
    let payload = {
        position_ids: position_ids
    };

    return axios.post('api/search/results', payload)
        .then(response => {
            return respond(response.status, response.data);
        })
        .catch(error => {
            return error_handle(error);
        })
}

export function permissionCheck() {
    let page_id = window.location.pathname.split('/')[2]
    let page_type = window.location.pathname.split('/')[1]
    let checkLab = getCurrentLabId() === page_id && page_type === 'prof-page'
    let checkStudent = getCurrentUserId() === page_id && page_type === 'student-profile'
    return checkLab || checkStudent;
}

//// CHANGED BY BENJI

export function returnToProfile() {
    if (isStudent())
        window.location = `/student-profile/${getCurrentUserId()}`;
    else if (isLab())
        window.location = `/prof-page/${getCurrentLabId()}`;
}

// export function exists(item) {
//     return item ? true : false;
// }

/// CHANGED BY EMI

// Create a deep copy of any array/object
export function deepCopy(object) {
    var output, value, key;
    output = Array.isArray(object) ? [] : {};
    for (key in object) {
        value = object[key];
        output[key] = (typeof value === "object") ? deepCopy(value) : value;
    }
    return output;
}

// Check if external link contains 'http:' or 'https:'; if not, add.
export function primeExternalLink(url) {
    if (url && typeof url === 'string') {
        if (url.includes('http:') || url.includes('https:')) {
            return url;
        }
        return('http://' + url);
    }
}

// TODO ADDED BY BENJI
export function exists(input) {
    let type = typeof input
    if (!input)
        return false
    if (type == 'object' && !input.length)
        return false
    return true
}
