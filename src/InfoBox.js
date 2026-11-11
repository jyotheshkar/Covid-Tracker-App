


import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./InfoBox.css";

function InfoBox({ title, cases, total, active, isRed, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent className="box">
        <Typography  className="title" gutterBottom>
          {title}
        </Typography>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>

        <Typography className="infoBox__total title">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;