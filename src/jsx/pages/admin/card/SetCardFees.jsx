import { useMemo, useState } from "react";
import { request } from "../../../../utils/api";
import { Nav, Tab } from "react-bootstrap";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { normalizeCardType } from "../../../../utils";
import { Form, Formik, setIn } from "formik";
import { cardFeeSchema } from "../../../../utils/validate/validate";
import Loading from "../../../components/utilComponents/Loading";

const FieldError = ({ show, children }) =>
  show ? <small className="text-danger d-block mt-1">{children}</small> : null;

const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "available" },
  { label: "Paused", value: "paused" },
];

const getAvailabilityValue = (product) => {
  if (product?.is_active === false) return "paused";
  if (product?.is_active === true) return "available";

  const status = String(product?.status || "").toLowerCase();
  if (["inactive", "paused", "disabled"].includes(status)) return "paused";
  return "available";
};

const SetCardFees = ({ cardProducts }) => {
  const [feeSaved, setFeeSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [activeTab, setActiveTab] = useState("virtual");

  const virtualProduct = useMemo(
    () =>
      cardProducts?.find(
        (item) => normalizeCardType(item.card_type) === "Virtual",
      ),
    [cardProducts],
  );

  const physicalProduct = useMemo(
    () =>
      cardProducts?.find(
        (item) => normalizeCardType(item.card_type) === "Physical",
      ),
    [cardProducts],
  );

  const buildProductFormData = (product, overrides = {}) => {
    const formData = new FormData();
    formData.append("card_code", product.card_code);
    formData.append("name", overrides.name ?? product.name);
    formData.append(
      "description",
      overrides.description ?? product.description ?? "....",
    );
    formData.append(
      "currency",
      overrides.currency ?? product.currency ?? "USD",
    );
    if (overrides.image_file instanceof File) {
      formData.append("image", overrides.image_file);
    } else {
      const imageUrl =
        overrides.image_url ?? product.image_url ?? product.image ?? null;
      formData.append("image_url", imageUrl ?? "");
    }
    formData.append("card_type", product.card_type);
    formData.append("price", overrides.price ?? product.price);
    formData.append("discount", overrides.discount ?? product.discount);

    if (overrides.delivery !== undefined) {
      formData.append("delivery", overrides.delivery);
    }

    if (overrides.availability !== undefined) {
      formData.append("status", overrides.availability);
      formData.append(
        "is_active",
        overrides.availability === "available" ? "1" : "0",
      );
    }

    return formData;
  };

  const updateCardProduct = async (product, overrides = {}) => {
    if (!product?.id) return;
    const payload = buildProductFormData(product, overrides);

    await request({
      url: `card-products/${product.id}`,
      method: "POST",
      data: payload,
    });
  };

  const initialValues = {
    virtualDetails: {
      name: virtualProduct?.name ?? "",
      description: virtualProduct?.description ?? "",
      currency: virtualProduct?.currency ?? "USD",
      image_url: virtualProduct?.image_url ?? virtualProduct?.image ?? "",
      image_file: null,
    },
    physicalDetails: {
      name: physicalProduct?.name ?? "",
      description: physicalProduct?.description ?? "",
      currency: physicalProduct?.currency ?? "USD",
      image_url: physicalProduct?.image_url ?? physicalProduct?.image ?? "",
      image_file: null,
      delivery: physicalProduct?.delivery ?? "3-5 business days",
      availability: getAvailabilityValue(physicalProduct),
    },
    virtualFee: Number(virtualProduct?.price ?? 0),
    virtualDiscount: Number(virtualProduct?.discount ?? 0),
    physicalFee: Number(physicalProduct?.price ?? 0),
    physicalDiscount: Number(physicalProduct?.discount ?? 0),
  };

  const validateActiveTab = async (values) => {
    const fieldsToValidate =
      activeTab === "virtual"
        ? ["virtualDetails", "virtualFee", "virtualDiscount"]
        : ["physicalDetails", "physicalFee", "physicalDiscount"];

    let nextErrors = {};

    await Promise.all(
      fieldsToValidate.map(async (fieldPath) => {
        try {
          await cardFeeSchema.validateAt(fieldPath, values);
        } catch (error) {
          if (error?.path && error?.message) {
            nextErrors = setIn(nextErrors, error.path, error.message);
          }
        }
      }),
    );

    return nextErrors;
  };

  return (
    <div className="card nova-panel">
        <div className="card-body">
          <div className="nova-section-head is-compact">
            <div>
              <h4 className="mb-1">Set Card Inventory</h4>
              <p className="text-muted mb-0">
                Update pricing, delivery, and availability for card products.
              </p>
            </div>
          </div>

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validate={validateActiveTab}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                setSaveError("");
                console.log("dsds");
                

                if (activeTab === "virtual" && virtualProduct) {
                  await updateCardProduct(virtualProduct, {
                    price: values.virtualFee,
                    discount: values.virtualDiscount,
                    ...values.virtualDetails,
                  });
                }

                if (activeTab === "physical" && physicalProduct) {
                  await updateCardProduct(physicalProduct, {
                    price: values.physicalFee,
                    discount: values.physicalDiscount,
                    ...values.physicalDetails,
                  });
                }

                setFeeSaved(true);
                setTimeout(() => setFeeSaved(false), 1500);
              } catch (error) {
                console.error("Save error:", error);
                setSaveError(
                  error?.response?.data?.message ||
                    "Failed to save card inventory.",
                );
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
            }) => (
              <Form>
                <Tab.Container activeKey={activeTab}>
                  <Nav as="ul" className="nav nav-tabs mb-3">
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="virtual"
                        onClick={() => setActiveTab("virtual")}
                      >
                        Virtual Card
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="physical"
                        onClick={() => setActiveTab("physical")}
                      >
                        Physical Card
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  {cardProducts.length === 0 ? (
                    <Loading />
                  ) : (
                    <Tab.Content>
                      <Tab.Pane eventKey="virtual">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <InputText
                          value={values.virtualDetails.name}
                          onChange={(e) =>
                            setFieldValue("virtualDetails.name", e.target.value)
                          }
                          onBlur={() =>
                            setFieldTouched("virtualDetails.name", true)
                          }
                          className={`w-100 form-control${
                            touched.virtualDetails?.name &&
                            errors.virtualDetails?.name
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        <FieldError
                          show={
                            touched.virtualDetails?.name &&
                            errors.virtualDetails?.name
                          }
                        >
                          {errors.virtualDetails?.name}
                        </FieldError>

                        <label className="mt-3">
                          Description <span className="text-danger">*</span>
                        </label>
                        <InputText
                          value={values.virtualDetails.description}
                          onChange={(e) =>
                            setFieldValue(
                              "virtualDetails.description",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            setFieldTouched("virtualDetails.description", true)
                          }
                          className={`w-100 form-control ${
                            touched.virtualDetails?.description &&
                            errors.virtualDetails?.description
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        <FieldError
                          show={
                            touched.virtualDetails?.description &&
                            errors.virtualDetails?.description
                          }
                        >
                          {errors.virtualDetails?.description}
                        </FieldError>

                        <label className="mt-3">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <InputText
                          value={values.virtualDetails.currency}
                          onChange={(e) =>
                            setFieldValue(
                              "virtualDetails.currency",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            setFieldTouched("virtualDetails.currency", true)
                          }
                          className={`w-100 form-control ${
                            touched.virtualDetails?.currency &&
                            errors.virtualDetails?.currency
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        <FieldError
                          show={
                            touched.virtualDetails?.currency &&
                            errors.virtualDetails?.currency
                          }
                        >
                          {errors.virtualDetails?.currency}
                        </FieldError>

                        <label className="mt-3">Image</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.currentTarget.files?.[0] ?? null;
                            setFieldValue("virtualDetails.image_file", file);
                          }}
                          onBlur={() =>
                            setFieldTouched("virtualDetails.image_file", true)
                          }
                          className={`w-100 form-control ${
                            touched.virtualDetails?.image_file &&
                            errors.virtualDetails?.image_file
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        {values.virtualDetails.image_file ? (
                          <small className="text-muted d-block mt-1">
                            Selected: {values.virtualDetails.image_file.name}
                          </small>
                        ) : values.virtualDetails.image_url ? (
                          <small className="text-muted d-block mt-1">
                            Current image is already saved.
                          </small>
                        ) : null}
                        <FieldError
                          show={
                            touched.virtualDetails?.image_file &&
                            errors.virtualDetails?.image_file
                          }
                        >
                          {errors.virtualDetails?.image_file}
                        </FieldError>

                        <label className="mt-3">
                         Card Price (USD){" "}
                          <span className="text-danger">*</span>
                        </label>
                        <InputNumber
                          value={values.virtualFee}
                          onValueChange={(e) =>
                            setFieldValue("virtualFee", e.value ?? 0)
                          }
                          onBlur={() => setFieldTouched("virtualFee", true)}
                          className={`w-100 ${
                            touched.virtualFee && errors.virtualFee
                              ? "p-invalid"
                              : ""
                          }`}
                          inputClassName="form-control"
                        />
                        <FieldError
                          show={touched.virtualFee && errors.virtualFee}
                        >
                          {errors.virtualFee}
                        </FieldError>
                        <label className="mt-3">
                          Discounted Price (USD){" "}
                          <span className="text-danger">*</span>
                        </label>
                        <InputNumber
                          value={values.virtualDiscount}
                          onValueChange={(e) =>
                            setFieldValue("virtualDiscount", e.value ?? 0)
                          }
                          onBlur={() =>
                            setFieldTouched("virtualDiscount", true)
                          }
                          className={`w-100 ${
                            touched.virtualDiscount && errors.virtualDiscount
                              ? "p-invalid"
                              : ""
                          }`}
                          inputClassName="form-control"
                        />
                        <FieldError
                          show={
                            touched.virtualDiscount && errors.virtualDiscount
                          }
                        >
                          {errors.virtualDiscount}
                        </FieldError>
                      </Tab.Pane>

                      <Tab.Pane eventKey="physical">
                        <label>
                          Name <span className="text-danger">*</span>
                        </label>
                        <InputText
                          value={values.physicalDetails.name}
                          onChange={(e) =>
                            setFieldValue(
                              "physicalDetails.name",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            setFieldTouched("physicalDetails.name", true)
                          }
                          className={`w-100 form-control ${
                            touched.physicalDetails?.name &&
                            errors.physicalDetails?.name
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        <FieldError
                          show={
                            touched.physicalDetails?.name &&
                            errors.physicalDetails?.name
                          }
                        >
                          {errors.physicalDetails?.name}
                        </FieldError>

                        <label className="mt-3">
                          Description <span className="text-danger">*</span>
                        </label>
                        <InputText
                          value={values.physicalDetails.description}
                          onChange={(e) =>
                            setFieldValue(
                              "physicalDetails.description",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            setFieldTouched("physicalDetails.description", true)
                          }
                          className={`w-100 form-control ${
                            touched.physicalDetails?.description &&
                            errors.physicalDetails?.description
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        <FieldError
                          show={
                            touched.physicalDetails?.description &&
                            errors.physicalDetails?.description
                          }
                        >
                          {errors.physicalDetails?.description}
                        </FieldError>

                        <label className="mt-3">
                          Currency <span className="text-danger">*</span>
                        </label>
                        <InputText
                          value={values.physicalDetails.currency}
                          onChange={(e) =>
                            setFieldValue(
                              "physicalDetails.currency",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            setFieldTouched("physicalDetails.currency", true)
                          }
                          className={`w-100 form-control ${
                            touched.physicalDetails?.currency &&
                            errors.physicalDetails?.currency
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        <FieldError
                          show={
                            touched.physicalDetails?.currency &&
                            errors.physicalDetails?.currency
                          }
                        >
                          {errors.physicalDetails?.currency}
                        </FieldError>

                        <label className="mt-3">
                          Delivery <span className="text-danger">*</span>
                        </label>
                        <InputText
                          value={values.physicalDetails.delivery}
                          onChange={(e) =>
                            setFieldValue(
                              "physicalDetails.delivery",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            setFieldTouched("physicalDetails.delivery", true)
                          }
                          className={`w-100 form-control ${
                            touched.physicalDetails?.delivery &&
                            errors.physicalDetails?.delivery
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        <FieldError
                          show={
                            touched.physicalDetails?.delivery &&
                            errors.physicalDetails?.delivery
                          }
                        >
                          {errors.physicalDetails?.delivery}
                        </FieldError>

                        <label className="mt-3">
                          Availability <span className="text-danger">*</span>
                        </label>
                        <select
                          value={values.physicalDetails.availability}
                          onChange={(e) =>
                            setFieldValue(
                              "physicalDetails.availability",
                              e.target.value,
                            )
                          }
                          onBlur={() =>
                            setFieldTouched("physicalDetails.availability", true)
                          }
                          className={`w-100 form-select ${
                            touched.physicalDetails?.availability &&
                            errors.physicalDetails?.availability
                              ? "is-invalid"
                              : ""
                          }`}
                        >
                          {AVAILABILITY_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <FieldError
                          show={
                            touched.physicalDetails?.availability &&
                            errors.physicalDetails?.availability
                          }
                        >
                          {errors.physicalDetails?.availability}
                        </FieldError>

                        <label className="mt-3">
                          Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.currentTarget.files?.[0] ?? null;
                            setFieldValue("physicalDetails.image_file", file);
                          }}
                          onBlur={() =>
                            setFieldTouched("physicalDetails.image_file", true)
                          }
                          className={`w-100 form-control ${
                            touched.physicalDetails?.image_file &&
                            errors.physicalDetails?.image_file
                              ? "p-invalid"
                              : ""
                          }`}
                        />
                        {values.physicalDetails.image_file ? (
                          <small className="text-muted d-block mt-1">
                            Selected: {values.physicalDetails.image_file.name}
                          </small>
                        ) : values.physicalDetails.image_url ? (
                          <small className="text-muted d-block mt-1">
                            Current image is already saved.
                          </small>
                        ) : null}
                        <FieldError
                          show={
                            touched.physicalDetails?.image_file &&
                            errors.physicalDetails?.image_file
                          }
                        >
                          {errors.physicalDetails?.image_file}
                        </FieldError>

                        <label className="mt-3">
                          Card Price (USD){" "}
                          <span className="text-danger">*</span>
                        </label>
                        <InputNumber
                          value={values.physicalFee}
                          onValueChange={(e) =>
                            setFieldValue("physicalFee", e.value ?? 0)
                          }
                          onBlur={() => setFieldTouched("physicalFee", true)}
                          className={`w-100 ${
                            touched.physicalFee && errors.physicalFee
                              ? "p-invalid"
                              : ""
                          }`}
                          inputClassName="form-control"
                        />
                        <FieldError
                          show={touched.physicalFee && errors.physicalFee}
                        >
                          {errors.physicalFee}
                        </FieldError>
                        <label className="mt-3">
                          Discounted Price (USD){" "}
                          <span className="text-danger">*</span>
                        </label>
                        <InputNumber
                          value={values.physicalDiscount}
                          onValueChange={(e) =>
                            setFieldValue("physicalDiscount", e.value ?? 0)
                          }
                          onBlur={() =>
                            setFieldTouched("physicalDiscount", true)
                          }
                          className={`w-100 ${
                            touched.physicalDiscount && errors.physicalDiscount
                              ? "p-invalid"
                              : ""
                          }`}
                          inputClassName="form-control"
                        />
                        <FieldError
                          show={
                            touched.physicalDiscount && errors.physicalDiscount
                          }
                        >
                          {errors.physicalDiscount}
                        </FieldError>
                      </Tab.Pane>
                    </Tab.Content>
                  )}
                </Tab.Container>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={isSubmitting}
                  >
                    <i className="pi pi-check me-2" />
                    {isSubmitting ? "Saving..." : "Save Fees"}
                  </button>
                </div>

                {feeSaved && (
                  <p className="text-success mt-2 mb-0">Fees saved.</p>
                )}
                {saveError && (
                  <p className="text-danger mt-2 mb-0">{saveError}</p>
                )}
              </Form>
            )}
          </Formik>
        </div>
    </div>
  );
};

export default SetCardFees;
