import React, { Fragment } from "react";
import Products from "./Products";

/// Data
import productData from "../productData";
import { Col } from "rsuite";
import MainTitle from "../../../elements/MainTitle";

const ProductGrid = () => {
   return (
      <Fragment>
         <div className="row">
            <Col xl={12}>
               <MainTitle parent="Shop" children="Product Grid"/>
            </Col>
         </div>
         <div className="row">           
            {productData.map((product) => (
               <Products key={product.key} product={product} />
            ))}
         </div>
      </Fragment>
   );
};

export default ProductGrid;
