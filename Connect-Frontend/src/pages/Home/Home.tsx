import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import Qualifications from '../Qualifications/Qualifications';
import TherepuetSessions from '../Sessions/Sessions'
import ClientHome from './ClientHome';

const Home = () => {
  const roleId:number  = Number(useAppSelector((state) => state.user.roleId));
  console.log(roleId)
  if(roleId == 1){
    return <Qualifications/>
  }
  else if(roleId == 2){
    return <TherepuetSessions/>
  }
  else{
    return <ClientHome/>
  }
}

export default Home