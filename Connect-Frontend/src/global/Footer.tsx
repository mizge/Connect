import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { fontFamily } from "@mui/joy/styles/styleFunctionSx";
import GitHubIcon from "@mui/icons-material/GitHub";
const Footer = () => {
  return (
    <div
      style={{
        background: "#9b9bca ",
        width: "100%",
        position: "fixed",
        margin: "auto",
        bottom: "0px",
        height: "60px",
        color: "white",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ margin: "auto", display:"flex", alignItems:"center" }}>
        <VolunteerActivismIcon sx={{ mr: 1 }} />
        <Typography
          variant="body1"
          noWrap
          component="a"
          sx={{
            mr: 1,
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
          }}
        >
          Connect - provided by Ugnė Glinskytė
        </Typography>
        <IconButton
          href="https://github.com/mizge/Connect"
          sx={{ color: "inherit", mr: 1, margin:"auto" }}
        >
          <GitHubIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default Footer;
