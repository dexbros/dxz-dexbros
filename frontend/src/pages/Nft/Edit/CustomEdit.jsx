import React from "react";
import Slider from 'react-rangeslider';



const CustomFilter = ({ customFilter, setCustomFilter, customValue }) => {
  const { label, defaultValue, field } = customValue;
  const [value, setValue] = React.useState(customValue.defaultValue)

  const handleChange = (e) => {
    setValue(e.target.value);
  }

  React.useEffect(() => {
    setCustomFilter({ ...customFilter, [field]: value });
  }, [value]);

  return (
    <div>
      <div className="slider_comp">
        <label className="slider_label">{customValue.label}</label><br />
        <input
          id="typeinp"
          type="range"
          className="slider"
          min="0" max="100"
          value={value}
          onChange={handleChange}
          step="1" />
      </div>
    </div>
  )
};

export default CustomFilter