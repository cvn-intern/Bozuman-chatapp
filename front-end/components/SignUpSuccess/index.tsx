/* eslint-disable */
import AuthPanel from 'components/AuthPanel';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';



export default function SignUpSuccess() {

  const handleActivateAccount = async (postData: string) => {
    try {
      const res = await axios
        .get(process.env.NEXT_PUBLIC_DOMAIN + '/api/auth/activate_account/' + postData)
        .then((res) => {
            console.log(typeof res);
            if (!res) {
              setMessage('Wrong url');
            }
          }
        );
    } catch (error) {
      //TODO: handle error
    }
  }
  const [message, setMessage] = useState('Your account have been activate');
  const router = useRouter();
  const { user } = router.query;

  if (user) {
    handleActivateAccount(user.toString());
  }
  
  // useEffect(() => {
  //   setTimeout(4);
  //   if (!user) {
  //     router.push('/sign-in');
  //   }
  // }, [user])

  return (
    <AuthPanel>
      <div className="header d-flex justify-content-between align-item-center">
        <h4>{message}</h4>
      </div>
      <Link href="/sign-in">
        <button type="submit" className="button__signup">
          Click here to start sign-in
        </button>
      </Link>
    </AuthPanel>
  );
}
