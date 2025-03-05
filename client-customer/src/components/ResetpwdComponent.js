import React, { useState } from 'react';
import SendEmail from './SendEmail';
import VerifyToken from './VerifyToken';
import ResetPassword from './ResetPassword';

const ResetPasswordFlow = () => {
    const [step, setStep] = useState(1);  // Start with email step
    const [userID, setUserID] = useState('');
    const [token, setToken] = useState('');

    const handleNextStep = () => {
        setStep(2);  // Move to the verify token step
    };

    const handleVerify = (id, token) => {
        setUserID(id);
        setToken(token);
        setStep(3);  // Move to the reset password step
    };

    return (
        <div>
            {step === 1 && <SendEmail onNext={handleNextStep} />}   {/* Pass the onNext function */}
            {step === 2 && <VerifyToken onVerify={handleVerify} />}
            {step === 3 && <ResetPassword id={userID} token={token} />}
        </div>
    );
};

export default ResetPasswordFlow;
