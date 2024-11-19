import React, { useEffect, useState } from "react";
import { Dropdown, Checkbox, Form } from "semantic-ui-react";

const MultiSelectDropdown = (props) => {
  const [options, setOptions] = useState(props.options);

  useEffect(() => {
    setOptions(props.options);
  }, [props.options])

  const handleSelectionChange = (index, data) => {
    const prev = [...options];
    prev[index].selected = data.checked;
    setOptions(prev);
    props.onChange(prev);
  };

  return (
    <Dropdown text={props.label} fluid selection selectOnBlur={false} selectOnNavigation={false}>
      <Dropdown.Menu>
        {options?.map(({ key, text, selected }, index) => (
          <Dropdown.Item
            key={`ms_option_${key}`}
            className="msd-dropdown-item"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              label={text}
              checked={selected}
              onChange={(evt, data) => handleSelectionChange(index, data)}
            />
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MultiSelectDropdown;
