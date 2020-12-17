import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Header from './components/Header.js'
import CoreSection from './components/CoreSection'
import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import './styles.css'
const App = () => {
    return (
        <div className="App">
            <Header/>
            <CoreSection/>
            <SignUpForm/>
            <SignInForm/>
        </div>
    );
}

export default App;
