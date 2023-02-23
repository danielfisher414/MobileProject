import React from 'react';

export const PasswordBox = () => {
  return (
    <div>
      <p>Password is not strong enough.</p>
      <ul>
        <li>Must have 8 or more characters</li>
        <li>Must have upper and lower case letters</li>
        <li>Must have digits and a special character</li>
      </ul>
    </div>
  );
};