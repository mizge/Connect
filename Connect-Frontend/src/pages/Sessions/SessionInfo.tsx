import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import Unauthorized from "../../global/Unauthorized";
import TherepuetInfo from '../Therepuets/TherepuetInfo';
import ClientSessionInfo from './Client/ClientSessionInfo';
import TherepuetSessionInfo from './Therepuet/TherepuetSessionInfo';

const SessionInfo = (props: any) => {
  const roleId:number  = useAppSelector((state) => state.user.roleId);
  const { sessionId } = useParams();

  if(roleId == 1){
    return <div>Forbide</div>
  }
  else if(roleId == 2){
    return <TherepuetSessionInfo sessionId={sessionId}/>
  }
  else if(roleId == 3){
    return <ClientSessionInfo sessionId={sessionId}/>
  }
  else{
    return <Unauthorized/>
  }
}

export default SessionInfo