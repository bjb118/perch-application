/**
 * Created by aksha on 7/22/2018.
 */
import React from 'react'
import * as helper from '../../../helper.js'
import './tests.css'


class UserTest extends React.Component {
    constructor() {

        super();

        this.state = {
            //getAllUsers_result: null,
            getUser_result: null,
            registerUser_result: null,
            updateUser_result: null,
            deleteUser_result: null,
            verifyLong_result: null,
            isLoggedIn_result: null,
            userId_result: null,
            isStudent_result: null,
            getAllStudents_result: null,
            getStudentFour_result: null,
            getStudentFourMil_result: null,
            getStudentSkills_result: null,
            getStudentTags_result: null,
            getAllFaculties_result: null,
            getFaculty_result: null,
            createFaculty_result: null,
        }
    }

    //R: func is a valid function and inputs is an array. Cannot be called on a function that returns null
    //E: Assigns the response of the called function to a variable with that function's name
    testFactory(func, inputs) {
        func(...inputs).then((resp) => {
            let toReturn = {}
            toReturn[func.name] = JSON.stringify(resp, undefined, 2);
            this.setState(toReturn);
        });
    }

    componentDidMount() {

        // All axios requests are asynchronous, so you need to use the ".then" method to catch the eventual
        // return of the data.
        // All code within the .then block will not be parsed until a response has been receive (success or failure).
        // So, code outside the block cannot rely on data that's supposed to be returned, since you can't guarantee
        // that the data will be back

        //So the tests don't mess up a logged-in user
        helper.logoutCurrentUser()
            .then(r => helper.loginUser('name@name.com','password'))
            .then(r => helper.deleteUser())
            .then(r => helper.loginUser('update_email', 'update_password'))
            .then(r => helper.deleteUser())

        //Student Tests
        this.testFactory(helper.getAllUsers, [])
        //Simple registering and loging in a user test.
        this.testFactory(helper.registerUser, ['email','name@name.com','password','password'])
        this.testFactory(helper.loginUser, ['name@name.com','password'])
        this.testFactory(helper.updateUser, ['update_name','update_email@name.com', 'password', true, false])
        this.testFactory(helper.verifyLogin, [])
        this.testFactory(helper.deleteUser, [])

        //These should throw errors, since no user should be logged in. Update, they throw the wrong kind of errors
        //this.testFactory(helper.getCurrentUserId, [])
        //this.testFactory(helper.isLoggedIn, [])

        this.testFactory(helper.getAllStudents, [])
        this.testFactory(helper.getStudent, [4])
        this.testFactory(helper.getStudentSkills, [4])
        this.testFactory(helper.getStudentTags, [4])

        //Faculty Tests
        this.testFactory(helper.getAllFaculties, [])
        this.testFactory(helper.getFaculty, [1])
        this.testFactory(helper.createFaculty, [10, 'Akshay', 'Rao', 'PhD', 'akshayro@umich.edu'])
        this.testFactory(helper.updateFaculty, [1, 'Akira', 'Nishii', 'MD, PhD', 'anishii@osu.edu'])

        //Lab Tests
        //this.testFactory(helper.getAllLabs, [])
        this.testFactory(helper.getLab, [5])
        //Should return no data with all parameters set to false
        //this.testFactory(helper.getAllLabData, [false, false, false, false, false, false])
        this.testFactory(helper.getLabData, [10, true, true, true, true, true, true])
        this.testFactory(helper.createLab, [1, 'Nishii Lab', '1800 Chemistry', 'We do cool stuff', 'N/A', 'perchresearch.com', null, 'anishii@umich.edu'])
        this.testFactory(helper.updateLab, ['Nishii Lab', '1800 Chemistry', 'We do cool stuff', 'perchresearch.com', 'phone', 'N/A', 'anishii@umich.edu'])
        this.testFactory(helper.getLabSkills, [10])
        this.testFactory(helper.getLabTags, [10])
        this.testFactory(helper.getLabMembers, [10])
        this.testFactory(helper.getAllLabPositions, [10])
        this.testFactory(helper.getLabPosition, [16])
        this.testFactory(helper.getApplicationFromPosition, [16])
        this.testFactory(helper.getLabPositionApplicants, [16])

        //Meta Data
        this.testFactory(helper.getAllSkills, [])
        this.testFactory(helper.getSkill, [1])
        this.testFactory(helper.createSkill, ['Typing', 'Fast and accurate keyboard wizardry'])
        this.testFactory(helper.searchMatchingSkills, ['Typ'])
        this.testFactory(helper.getAllTags, [])
        this.testFactory(helper.getTag, [1])
        this.testFactory(helper.createTag, ['Nuclear Physics', 'Actually, most of the explosions are on the particle scale'])
        this.testFactory(helper.searchMatchingTags, ['Nucl'])

        //Et al.
        this.testFactory(helper.submitUserFeedback, [1, 'perchresearch.com', 'Testing -Caleb'])
        this.testFactory(helper.getSearchData, [])
        this.testFactory(helper.labSearch, [ [], [], [], [], []])

    }

    render() {
        return(
            <div id='test'>
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

            </div>
        )
    }
}

export default UserTest