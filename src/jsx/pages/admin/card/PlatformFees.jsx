import React, { useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { platformFeesSchema } from "../../../../utils/validate/validate";
import { Button } from "primereact/button";
import Loading from "../../../components/utilComponents/Loading";
const PlatformFees = () => {
  const [initialValues, setInitialValues] = useState({
    transfer: { value_type: "fixed", value: 0 },
    deposit: { value_type: "percent", value: 0 },
    withdrawal: { value_type: "fixed", value: 0 },
    card_topup: { value_type: "fixed", value: 0 },
  });
  const [feesLoading, setFeesLoading] = useState(true);
  const [feesSaved, setFeesSaved] = useState(false);

  const getPlatformFees = async () => {
    setFeesLoading(true);

    try {
      const res = await request({
        url: "platform-fees",
        method: "GET",
      });

      const data = res?.data;
      if (data) {
        setInitialValues(data);
      }
    } catch (error) {
      console.error("Error fetching platform fees:", error);
    } finally {
      setFeesLoading(false);
    }
  };

  const handleFeesSave = async (values) => {
    try {
      const payload = Object.keys(values).reduce((acc, key) => {
        acc[key] = {
          value_type: values[key]?.value_type || "fixed",
          value: Number(values[key]?.value || 0),
        };
        return acc;
      }, {});

      await request({
        url: "platform-fees",
        method: "PUT",
        data: payload,
      });

      setFeesSaved(true);
      setTimeout(() => setFeesSaved(false), 1500);

      await getPlatformFees();
    } catch (error) {
      console.error("Error saving platform fees:", error);
    }
  };

  useEffect(() => {
    getPlatformFees();
  }, []);

  const feeFields = [
    { key: "transfer", label: "Transfer Fee" },
    { key: "deposit", label: "Deposit Fee" },
    { key: "withdrawal", label: "Withdrawal Fee" },
    { key: "card_topup", label: "Card Topup Fee" },
  ];

  return (
    <div className="card nova-panel">
      <div className="card-body">
        <div className="nova-section-head is-compact">
          <div>
            <h4 className="mb-1">Platform Fees</h4>
            <p className="text-muted mb-0">
              Configure transfer, deposit, withdrawal, and top-up fees.
            </p>
          </div>
        </div>

          {feesLoading ? (
            <Loading />
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={platformFeesSchema}
              enableReinitialize
              onSubmit={handleFeesSave}
            >
              {({ isSubmitting }) => (
                <Form>
                  {feeFields.map(({ key, label }) => (
                    <div className="mb-3 row g-2" key={key}>
                      <div className="col-md-6">
                        <label className="form-label">{label} Type</label>

                        <Field
                          as="select"
                          name={`${key}.value_type`}
                          className="form-select"
                        >
                          <option value="fixed">Fixed</option>
                          <option value="percent">Percent</option>
                        </Field>

                        <ErrorMessage
                          name={`${key}.value_type`}
                          component="small"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">{label} Value</label>

                        <Field
                          type="number"
                          step="0.01"
                          name={`${key}.value`}
                          className="form-control"
                        />

                        <ErrorMessage
                          name={`${key}.value`}
                          component="small"
                          className="text-danger"
                        />
                      </div>
                    </div>


                  ))}
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                    type="submit"
                    className="btn btn-primary btn-sm"
                      label={isSubmitting ? "Saving..." : "Save Platform Fees"}
                      icon="pi pi-check"
                      disabled={isSubmitting}
                    />
                  </div>
                  {feesSaved && (
                    <p className="text-success mt-3 mb-0">
                      Platform fees saved successfully.
                    </p>
                  )}
                </Form>
              )}
            </Formik>
          )}
      </div>
    </div>
  );
};

export default PlatformFees;
