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
    { key: "transfer", label: "Transfer", icon: "pi-send" },
    { key: "deposit", label: "Deposit", icon: "pi-download" },
    { key: "withdrawal", label: "Withdrawal", icon: "pi-upload" },
    { key: "card_topup", label: "Card Topup", icon: "pi-credit-card" },
  ];

  return (
    <div className="card nova-panel nova-fees-panel">
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
                  <div className="row g-3">
                    {feeFields.map(({ key, label, icon }) => (
                      <div className="col-xl-3 col-md-6" key={key}>
                        <div className="nova-fee-tile">
                          <span className="nova-fee-tile-head">
                            <i className={`pi ${icon}`} />
                            {label} Fee
                          </span>

                          <div className="row g-2">
                            <div className="col-6">
                              <label className="form-label nova-form-label">
                                Type
                              </label>

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
                                className="text-danger d-block mt-1"
                              />
                            </div>

                            <div className="col-6">
                              <label className="form-label nova-form-label">
                                Value
                              </label>

                              <Field
                                type="number"
                                step="0.01"
                                name={`${key}.value`}
                                className="form-control"
                              />

                              <ErrorMessage
                                name={`${key}.value`}
                                component="small"
                                className="text-danger d-block mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="nova-form-actions">
                    <div className="nova-form-actions-status">
                      {feesSaved && (
                        <span className="text-success">
                          <i className="pi pi-check-circle me-1" />
                          Platform fees saved successfully.
                        </span>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="btn btn-primary btn-sm"
                      label={isSubmitting ? "Saving..." : "Save Platform Fees"}
                      icon="pi pi-check"
                      disabled={isSubmitting}
                    />
                  </div>
                </Form>
              )}
            </Formik>
          )}
      </div>
    </div>
  );
};

export default PlatformFees;
