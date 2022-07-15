import React, { useState } from 'react';
import useSWR, { Key, Fetcher } from 'swr';
import _CONF from 'config/config';
import axios from 'axios';
import axiosClient from 'helper/axiosCliend'

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
   
    const res = await axiosClient.get('//localhost:3000/api/auth/get');
    console.log(res);
  };
  fetchdata();
  const testToken = async () => {
   
    const res = await axiosClient.get('//localhost:3000/');
    console.log(res);
  };
  testToken();
  return <div className='wrapper'>{<p>{response}</p>}</div>;
}

export default Hello;
