import React, { Fragment } from "react";
import { Col } from "react-bootstrap";

import BasicDatatable from "./BasicDatatable";
import SimpleDataTable from "./SimpleDataTable";
import ProfileDatatable from "./ProfileDatatable";
import FeesCollection from "./FeesCollection";
import PatientTable from "./PatientTable";
import MainTitle from "../../elements/MainTitle";

const DataTable = () => {
  return (
    <Fragment>      
      <div className='row'>
				<Col xl={12}>
					<MainTitle parent="Table" children="Datatable" />
				</Col>
			</div>
      <div className="row">
        <BasicDatatable />
        <SimpleDataTable />
        <ProfileDatatable />
        <FeesCollection />
        <PatientTable />
      </div>
    </Fragment>
  );
};

export default DataTable;
