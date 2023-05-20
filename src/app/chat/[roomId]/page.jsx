/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import React from 'react'
import { useParams } from 'next/navigation';

function page() {
  const params = useParams();
  console.log(params.roomId);
  return (
    <div>{params.roomId}</div>
  )
}

export default page
