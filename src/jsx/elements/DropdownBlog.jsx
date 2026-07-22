import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { SVGICON } from '../constant/theme';

const DropdownBlog = () => {
    return (
        <Dropdown className="dropdown custom-dropdown">
            <Dropdown.Toggle className="btn sharp btn-primary tp-btn i-false" as="div" >
                {SVGICON.DropdownIcon}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
                <Dropdown.Item>Option 1</Dropdown.Item>
                <Dropdown.Item>Option 2</Dropdown.Item>
                <Dropdown.Item>Option 3</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};
export default DropdownBlog;
