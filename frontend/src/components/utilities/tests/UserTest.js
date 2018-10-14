/**
 * Created by aksha on 7/22/2018.
 */
import React from 'react'
import * as H from '../../../helper.js'
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './tests.css'

var queued = 0;
var completed = 0;

class UserTest extends React.Component {
    constructor() {
        super();
        this.state = {
            errors: [],
            crop: {
                aspect: 1,
            }
        }
    }

    //R: func is a valid function and inputs is an array. Cannot be called on a function that returns null
    //E: Assigns the response of the called function to a variable with that function's name
    testFactory(func, inputs) {
        ++queued; // hopefully this is atomic - have we learned nothing from 482??
        this.setState({inputs})
        func(...inputs).then((resp) => {
            let toReturn = {}
            toReturn[func.name] = JSON.stringify(resp, undefined, 2);
            if (resp.status != 200)
                this.state.errors.push(<div style={{color: 'red', fontSize: '30px'}}>ERROR <b>{resp.status}</b> in <b>{func.name}</b></div>)

            ++completed;
            this.setState(toReturn);
        }).catch(e => {
            return e
        })
    }

    handleFile(e) {
        e.preventDefault()
        let input = document.getElementById('file-input').files[0]
        let f = new FormData()
        f.append('file', input)
        let to_return = {
            formData: f,
            type: 'profile_pic'
        }
        console.log(to_return)
        H.uploadUserFile(to_return).then(r=> console.log(r))
    }

    getFile() {
        H.getUserFile('profile_pic').then(r=> {
            console.log(r.data.file.url)
            this.setState({img: r.data.file.url})
        })  
    }

    componentDidMount() {
        let lab_id = 0

        // H.createLab({}).then(r => lab_id = )
        H.createLab({name: 'shlabaadaba'}).then(r => lab_id = r.data.id)
        .then(r => H.getLab(lab_id))
        .then(r => console.log(r))
        .then(r => H.getLabMembers(lab_id))
        .then(r=>console.log(r))
        .then(r=>H.getLab(lab_id))
        // .then(r=>console.log(r))
        // .then(r=>H.updateLab(140, {name: 'babab'}))
        // .then(r=>H.getLab(140))
        // .then(r=>console.log(r))
        // .then(r=>H.addMembersToLab(140, [145],[3]))
        // .then(r=>H.getLab(140))
        // .then(r=>console.log(r))
        // H.uploadUserFile(f).then(r=> console.log(r))
        // H.getUserFile('profile_pic').then(r => console.log(r))

        // All axios requests are asynchronous, so you need to use the ".then" method to catch the eventual
        // return of the data.
        // All code within the .then block will not be parsed until a response has been receive (success or failure).
        // So, code outside the block cannot rely on data that's supposed to be returned, since you can't guarantee
        // that the data will be back

        //So the tests don't mess up a logged-in user
        // H.logoutCurrentUser()
        //     .then(r => H.loginUser('name@name.com','password'))
        //     .then(r => H.deleteUser())
        //     .then(r => H.loginUser('update_email', 'update_password'))
        //     .then(r => H.deleteUser())

        // //Student Tests
        // this.testFactory(H.getAllUsers, [])
        // //Simple registering and loging in a user test.
        // this.testFactory(H.registerUser, ['email','name@name.com','password','password'])
        // this.testFactory(H.loginUser, ['name@name.com','password'])
        // this.testFactory(H.updateUser, ['update_name','update_email@name.com', 'password', true, false])
        // this.testFactory(H.verifyLogin, [])
        // this.testFactory(H.deleteUser, [])

        // //These should throw errors, since no user should be logged in. Update, they throw the wrong kind of errors
        // //this.testFactory(H.getCurrentUserId, [])
        // //this.testFactory(H.isLoggedIn, [])



        // this.testFactory(H.getAllStudents, [])
        // this.testFactory(H.getStudent, [1])
        // this.testFactory(H.getStudentSkills, [1])
        // this.testFactory(H.getStudentTags, [1])

        // // //Faculty Tests
        // this.testFactory(H.getAllFaculties, [])
        // this.testFactory(H.getFaculty, [1])
        // this.testFactory(H.createFaculty, [10, {
        //                                         first_name: 'Akira',
        //                                         last_name: 'Nishii',
        //                                         title: 'MD, PhD',
        //                                         contact_email: 'anishii@osu.edu'
        //                                     }])

        // this.testFactory(H.updateFaculty, [1, {
        //                                         first_name: 'Akira',
        //                                         last_name: 'Nishii',
        //                                         title: 'MD, PhD',
        //                                         contact_email: 'anishii@osu.edu'
        //                                     }])

        // // //Lab Tests
        // // //this.testFactory(H.getAllLabs, [])
        // this.testFactory(H.getLab, [5])
        // // //Should return no data with all parameters set to false
        // // this.testFactory(H.getAllLabData, [false, false, false, false, false, false])
        // this.testFactory(H.getLabData, [10, true, true, true, true, true, true])
        // this.testFactory(H.createLab, [1, {
        //                                     name: 'Nishii Lab',
        //                                     location: '1800 Chemistry',
        //                                     description: 'We do cool stuff',
        //                                     url: 'perchresearch.com',
        //                                     contact_email: 'anishii@umich.edu'
        //                                 }])
        // this.testFactory(H.updateLab, [1, {
        //                                     name: 'Nishii Lab',
        //                                     location: '1800 Chemistry',
        //                                     description: 'We do cool stuff',
        //                                     url: 'perchresearch.com',
        //                                     contact_phone: 'phone',
        //                                     contact_email: 'anishii@umich.edu'
        //                                 }])
        // this.testFactory(H.getLabSkills, [10])
        // this.testFactory(H.getLabTags, [10])
        // this.testFactory(H.getLabMembers, [10])
        // this.testFactory(H.getAllLabPositions, [10])
        // this.testFactory(H.getLabPosition, [1,1])
        // this.testFactory(H.getLabPositionApplicants, [16])

        // // Application Tests
        // this.testFactory(H.createApplicationResponse, [['good answer', 'extra good answer']])
        // this.testFactory(H.updateApplicationResponse, [1, ['gooder answer', 'extra gooder answer']])
        // this.testFactory(H.submitApplicationResponse, [1])
        // //this.testFactory(H.deleteApplicationResponse, [1])

        // // //Meta Data
        // this.testFactory(H.getAllSkills, [])
        // this.testFactory(H.getSkill, [1])
        // this.testFactory(H.createSkill, ['Typing', 'Fast and accurate keyboard wizardry'])
        // this.testFactory(H.searchMatchingSkills, ['Typ'])
        // this.testFactory(H.getAllTags, [])
        // this.testFactory(H.getTag, [1])
        // this.testFactory(H.createTag, ['Nuclear Physics', 'Actually, most of the explosions are on the particle scale'])
        // this.testFactory(H.searchMatchingTags, ['nucl'])

        // // //Et al.
        // this.testFactory(H.submitUserFeedback, [1, 'perchresearch.com', 'Testing -Caleb'])
        // this.testFactory(H.getSearchData, [])
        // this.testFactory(H.labSearch, [ [], [], [], [], []])
        // this.testFactory(H.getSearchResults, [[1,2,3,4]])


    }

    onChange(crop) {
        console.log(crop)
        this.setState({crop})
    }

    render() {
        return(
            <div id='test'>
                <h1>Tests Completed/Total: {completed}/{queued}</h1>
                <h1>Bad Status Codes</h1>
                {this.state.errors.map(item => item)}
                <form onSubmit={this.handleFile.bind(this)}>
                    <input type='file' id='file-input'/>
                    <input type='submit'/>
                </form>
                <div onClick={this.getFile.bind(this)}>getFile</div>
                <ReactCrop src={this.state.img} crop={this.state.crop} onChange={this.onChange.bind(this)}/>
                
                <h1>Student Tests</h1>
                <h2>getAllUsers</h2>
                <pre>{this.state.getAllUsers}</pre>
                <h2>registerUser</h2>
                <pre>{this.state.registerUser}</pre>
                <h2>loginUser</h2>
                <pre>{this.state.loginUser}</pre>
                <h2>updateUser</h2>
                <pre>{this.state.updateUser}</pre>
                <h2>verifyLogin</h2>
                <pre>{this.state.verifyLogin}</pre>
                <h2>deleteUser</h2>
                <pre>{this.state.deleteUser}</pre>
                <h2>getAllStudents</h2>
                <pre>{this.state.getAllStudents}</pre>
                <h2>getStudent(4)</h2>
                <pre>{this.state.getStudent}</pre>
                <h2>getStudentSkills</h2>
                <pre>{this.state.getStudentSkills}</pre>
                <h2>getStudentTags</h2>
                <pre>{this.state.getStudentTags}</pre>

                <h1>Faculty Tests</h1>
                <h2>getAllFaculties</h2>
                <pre>{this.state.getAllFaculties}</pre>
                <h2>getFaculty(1)</h2>
                <pre>{this.state.getFaculty}</pre>
                <h2>createFaculty</h2>
                <pre>{this.state.createFaculty}</pre>
                <h2>updateFaculty</h2>
                <pre>{this.state.updateFaculty}</pre>
                <h2>getAllLabs</h2>
                <pre>Commented out to save time</pre>
                <pre>{this.state.getAllLabs}</pre>
                <h2>getLab</h2>
                <pre>{this.state.getLab}</pre>
                <h2>getAllLabData</h2>
                <pre>Commented out to save time</pre>
                <pre>{this.state.getAllLabData}</pre>
                <h2>getLabData</h2>
                <pre>{this.state.getLabData}</pre>
                <h2>createLab</h2>
                <pre>{this.state.createLab}</pre>
                <h2>updateLab</h2>
                <pre>{this.state.updateLab}</pre>
                <h2>getLabSkills</h2>
                <pre>{this.state.getLabSkills}</pre>
                <h2>getLabTags</h2>
                <pre>{this.state.getLabTags}</pre>
                <h2>getLabMembers</h2>
                <pre>{this.state.getLabMembers}</pre>
                <h2>getAllLabPositions</h2>
                <pre>{this.state.getAllLabPositions}</pre>
                <h2>getLabPosition</h2>
                <pre>{this.state.getLabPosition}</pre>
                <h2>getApplicationFromPosition</h2>
                <pre>{this.state.getApplicationFromPosition}</pre>
                <h2>getLabPositionApplicants</h2>
                <pre>{this.state.getLabPositionApplicants}</pre>

                <h1>Application Tests</h1>
                <h2>createApplicationResponse</h2>
                <pre>{this.state.createApplicationResponse}</pre>
                <h2>updateApplicationResponse</h2>
                <pre>{this.state.updateApplicationResponse}</pre>
                <h2>submitApplicationResponse</h2>
                <pre>{this.state.submitApplicationResponse}</pre>
                <h2>deleteApplicationResponse</h2>
                <pre>{this.state.deleteApplicationResponse}</pre>

                <h1>Meta Tests</h1>
                <h2>getAllSkills</h2>
                <pre>{this.state.getAllSkills}</pre>
                <h2>getSkill</h2>
                <pre>{this.state.getSkill}</pre>
                <h2>createSkill</h2>
                <pre>{this.state.createSkill}</pre>
                <h2>searchMatchingSkills</h2>
                <pre>{this.state.searchMatchingSkills}</pre>
                <h2>getAllTags</h2>
                <pre>{this.state.getAllTags}</pre>
                <h2>getTag</h2>
                <pre>{this.state.getTag}</pre>
                <h2>createTag</h2>
                <pre>{this.state.createTag}</pre>
                <h2>searchMatchingTags</h2>
                <pre>{this.state.searchMatchingTags}</pre>

                <h1>Et al.</h1>
                <h2>submitUserFeedback</h2>
                <pre>{this.state.submitUserFeedback}</pre>
                <h2>getSearchData</h2>
                <pre>{this.state.getSearchData}</pre>
                <h2>labSearch</h2>
                <pre>{this.state.labSearch}</pre>
                <h2>getSearchResults</h2>
                <pre>{this.state.getSearchResults}</pre>

            </div>
        )
    }
}

export default UserTest
