import React, { useState } from 'react';
import useSWR, { Key, Fetcher } from 'swr';
import _CONF from 'config/config';
import axios from 'axios';
const cookie = require('cookie-cutter');
const fetcher = async (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => {
  const res = await fetch(input, init);
  return res.json();
};
function Hello() {
  // const { data, error } = useSWR('//localhost:3000/api/auth/get', fetcher)
  const [response, setResponse] = useState('');
  const fetchdata = async () => {
    const res = await axios.get('//localhost:3000/api/auth/get', {
      headers: {
        'x-access-token': cookie.get('access_token')
      }
    });
    console.log(res);
  };
  fetchdata();
  return <div className='wrapper'>{<p>{response}</p>}</div>;
}

export default Hello;
