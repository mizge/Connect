import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import { useAppSelector } from '../app/hooks';
import {AdminNav} from './Navigation/AdminNav'
import { TherepuetNav } from './Navigation/TherepuetNav';
import { UserNav } from './Navigation/UserNav';
import { UnauthorizedNav } from './Navigation/Unauthorized';

const UserPages = ['Sessions', 'Logout'];
const TherepuetPages = ['Sessions', 'Create session', 'Logout'];
const AdminPages = ['Qualifications', 'Create qualification', 'Logout'];
const SystemPages = ['Login', 'Register'];

const NavBar = (props:any) => {
  const roleId  = useAppSelector((state) => state.user).roleId;

 if(roleId == 1){
  return (
    <AppBar position="static" style={{background:'#9b9bca '}}>
      <Container maxWidth="xl" >
        <Toolbar disableGutters>
          <AdminNav pages={AdminPages}/>
        </Toolbar>
      </Container>
    </AppBar>
  );
 }
 else if(roleId == 2){
  return (
    <AppBar position="static" style={{background:'#9b9bca '}}>
      <Container maxWidth="xl" >
        <Toolbar disableGutters>
          <TherepuetNav pages={TherepuetPages}/>
        </Toolbar>
      </Container>
    </AppBar>
  );
 }
 else if(roleId == 3){
  return (
    <AppBar position="static" style={{background:'#9b9bca '}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <UserNav pages={UserPages}/>
        </Toolbar>
      </Container>
    </AppBar>
  );
 }
 else{
  return (
    <AppBar position="static" style={{background:'#9b9bca '}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <UnauthorizedNav pages={SystemPages}/>
        </Toolbar>
      </Container>
    </AppBar>
  );
 }

}
export default NavBar;