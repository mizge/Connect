import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import Unauthorized from "../../global/Unauthorized";
import ClientSessions from './Client/ClientSessions';
import TherepuetSessions from './Therepuet/TherepuetSessions';

const Sessions = () => {
  const roleId:number  = useAppSelector((state) => state.user.roleId);
  if(roleId == 1){
    return <div>Forbide</div>
  }
  else if(roleId == 2){
    return <TherepuetSessions/>
  }
  else if(roleId == 3){
    return <ClientSessions/>
  }
  else{
    return <Unauthorized/>
  }
}

export default Sessions