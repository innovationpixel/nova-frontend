import React from 'react';
import { Link } from 'react-router-dom';

const MainTitle = (props) => {
    return (
        <div className="page-titles">
            <nav>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item ps-0"><Link to={"#"}>{props.parent}</Link></li>
                    <li className="breadcrumb-item active">{props.children}</li>
                </ol>
            </nav>
        </div>
    );
};

export default MainTitle;
