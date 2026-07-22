import React, { Component } from 'react';
import CkEditorBlog from './CkEditorBlog';
import MainTitle from '../../../elements/MainTitle';
import { Col } from 'react-bootstrap';

class CkEditor extends Component {
    render() {
        return (
            <>
                
                <div className="row">
                    <Col xl={12}>
                        <MainTitle parent="Form" children="CkEditor" />
                    </Col>
                    <div className="col-xl-12 col-xxl-12">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Form CkEditor</h4>
                            </div>
                            <div className="card-body custom-ekeditor">
                               <CkEditorBlog />
                            </div>
                        </div>
                    </div>        
                </div>        
            </>
        );
    }
}

export default CkEditor;