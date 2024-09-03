import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc, collection, addDoc, getDoc } from 'firebase/firestore';
import './Auth.css';

function Auth({ onAuthStateChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyAction, setFamilyAction] = useState('');
  const [familyCode, setFamilyCode] = useState('');
  const [role, setRole] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [step, setStep] = useState(1);

  const handleAuth = async (event) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        if (step === 1) {
          setStep(2);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: firstName });

        let familyId;

        if (familyAction === 'create') {
          const familyRef = await addDoc(collection(db, 'families'), {
            name: familyName
          });
          familyId = familyRef.id;
        } else if (familyAction === 'join') {
          const familyRef = doc(db, 'families', familyCode);
          const familyDoc = await getDoc(familyRef);
          if (!familyDoc.exists()) {
            setError('Invalid family code. Would you like to create a new family instead?');
            setFamilyAction('create');
            return;
          }
          familyId = familyCode;
        } else {
          throw new Error('Please select whether to create or join a family');
        }

        await setDoc(doc(db, 'users', user.uid), {
          firstName,
          email,
          familyId,
          role
        });

        setMessage('Account created successfully!');
        onAuthStateChange(user);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          throw new Error('User not found in database');
        }
        
        onAuthStateChange(user);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.message === 'User not found in database') {
        setError("Your account is not fully set up. Please sign up again.");
        setIsSignUp(true);
        setStep(1);
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? (step === 1 ? 'Sign Up' : 'Family Details') : 'Sign In'}</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form onSubmit={handleAuth}>
        {isSignUp && step === 1 && (
          <>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
            <button type="submit">Next</button>
          </>
        )}
        {isSignUp && step === 2 && (
          <>
            <select value={familyAction} onChange={(e) => setFamilyAction(e.target.value)} required>
              <option value="">Select action</option>
              <option value="create">Create a new family</option>
              <option value="join">Join an existing family</option>
            </select>
            {familyAction === 'create' && (
              <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Family Name" required />
            )}
            {familyAction === 'join' && (
              <input type="text" value={familyCode} onChange={(e) => setFamilyCode(e.target.value)} placeholder="Family Code" required />
            )}
            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="guardian">Guardian</option>
            </select>
            <button type="submit">Create Account</button>
          </>
        )}
        {!isSignUp && (
          <>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Sign In</button>
          </>
        )}
      </form>
      <button onClick={() => {
        setIsSignUp(!isSignUp);
        setStep(1);
        setError(null);
        setMessage(null);
      }} className="toggle-auth">
        {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
      </button>
    </div>
  );
}

export default Auth;