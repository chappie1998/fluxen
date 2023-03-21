import React, { useState } from "react";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import enIN from "date-fns/locale/en-IN";
import { addDays } from "date-fns";

export const Calendar = ({ onChange }) => {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    onChange(selection);
    setState([selection]);
  };

  return (
    <DateRangePicker
      onChange={handleOnChange}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      months={2}
      ranges={state}
      direction="horizontal"
      minDate={new Date()}
      locale={enIN}
      staticRanges={[]}
      inputRanges={[]}
    />
  );
};
