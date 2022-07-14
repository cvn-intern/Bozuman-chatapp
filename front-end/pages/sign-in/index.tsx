import SignInPanel from 'components/SignInPanel'
import Image from 'next/image';
import React from 'react';

function SignIn() {
  return(
  <div className = "container">
    <div className='row mt-5'>
      <div className='col-0 mt-5 col-lg-7 d-flex justify-content-center'>
        <Image 
          src={'/homepage.png'}
          alt='homepage'
          width={560}
          height={640}
        />
      </div>
      <div className='col-12 col-lg-5 d-flex justify-content-center align-self-center'>
        <div className="signin">
          <SignInPanel /> 
        </div>
      </div>
    </div>
    <div className='row mt-5'>
    
    </div>
  </div>
  )
}

export default SignIn 