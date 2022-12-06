import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../app/hooks';
import { logOutUser } from '../../app/userSlice';

export const AdminNav = (props:any ) =>{
    const [anchorElNav, setAnchorElNav] = React.useState(null);
	const dispatch = useAppDispatch();
    const navigate = useNavigate()
    const handleOpenNavMenu = (event:any) => {
        setAnchorElNav(event.currentTarget);
      };
      const GoHome=(event:any) => {
        navigate(`/`)
      }
    
      const handleCloseNavMenu = (page:string) => {
        if (page == "Qualifications"){
            navigate(`qualifications`)
        }
        else if (page == "Create qualification"){
            navigate(`new-qualification`)
        }
        else if(page == "Logout"){
            dispatch(logOutUser());
            navigate(`/`)
        }
        setAnchorElNav(null);
      };
    return(
        <>
        <VolunteerActivismIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          onClick={GoHome}
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Connect
        </Typography>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, color:"white" }} color="white">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            style={{color:"white"}}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
            {props.pages.map((page:string) => (
              <MenuItem key={page} onClick={(event)=>{handleCloseNavMenu(page)}}>
                <Typography textAlign="center">{page}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <VolunteerActivismIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, background:"white"}} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          onClick={GoHome}
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'white',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          Connect
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {props.pages.map((page:string) => (
            <Button
              key={page}
              onClick={()=>handleCloseNavMenu(page)}
              sx={{ my: 2, color: 'white', display: 'block' }}
            >
              {page}
            </Button>
          ))}
        </Box>
        </>
    )
}