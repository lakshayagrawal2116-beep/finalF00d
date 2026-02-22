import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
    return (
        <div className='privacy-policy'>
            <h1>Privacy Policy</h1>
            <p>Last updated: {new Date().toLocaleDateString()}</p>

            <div className='policy-content'>
                <h2>1. Information We Collect</h2>
                <p>We collect information that you provide directly to us, such as when you create an account, update your profile, use the interactive features of our services, participate in contests, promotions or surveys, request customer support or otherwise communicate with us.</p>

                <h2>2. How We Use and Share Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect us and our users. We do not share your personal information with third parties without your consent, except as necessary to provide our services or as required by law.</p>

                <h2>3. Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

                <h2>4. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at contact@tasterunners.com.</p>
            </div>
        </div>
    );
}

export default PrivacyPolicy;
