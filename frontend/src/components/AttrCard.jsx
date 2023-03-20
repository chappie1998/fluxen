import React from "react";

export const AttrCard = (props) => {
  return (
    <div className="attr-card">
      <span className="textMuted text-uppercase letter-spacing-1 fs-11">
        {props.attrName}
      </span>
      <h5 className="mt-3">{props.attrValue}</h5>
    </div>
  );
};
