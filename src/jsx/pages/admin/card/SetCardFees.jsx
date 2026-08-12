import { useEffect, useMemo, useState } from "react";
import { request } from "../../../../utils/api";
import { Nav, Tab } from "react-bootstrap";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { normalizeCardType, resolveImageSrc } from "../../../../utils";
import { Form, Formik, setIn } from "formik";
import { cardFeeSchema } from "../../../../utils/validate/validate";
import Loading from "../../../components/utilComponents/Loading";

const FieldError = ({ show, children }) =>
  show ? <small className="text-danger d-block mt-1">{children}</small> : null;

const AVAILABILITY_OPTIONS = [
  { label: "Available", value: "available" },
  { label: "Paused", value: "paused" },
];

// Field name the backend reads the upload from (`$request->file(...)`).
// Change this one place if the API expects a different key.
const IMAGE_UPLOAD_FIELD = "image";

const extractApiError = (error) => {
  const data = error?.response?.data;
  const firstFieldError = data?.errors
    ? Object.values(data.errors).flat()[0]
    : null;
  return firstFieldError || data?.message || "Failed to save card inventory.";
};

const getAvailabilityValue = (product) => {
  if (product?.is_active === false) return "paused";
  if (product?.is_active === true) return "available";

  const status = String(product?.status || "").toLowerCase();
  if (["inactive", "paused", "disabled"].includes(status)) return "paused";
  return "available";
};

const FormField = ({
  label,
  required,
  error,
  touched,
  className = "col-lg-3 col-md-6",
  children,
}) => (
  <div className={className}>
    <label className="form-label nova-form-label">
      {label}
      {required ? <span className="text-danger ms-1">*</span> : null}
    </label>
    {children}
    <FieldError show={Boolean(touched && error)}>{error}</FieldError>
  </div>
);

const ImageField = ({ className, file, imageUrl, onSelect, onBlur, error, touched }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!(file instanceof File)) {
      setPreviewUrl(null);
      return undefined;
    }

    const nextUrl = URL.createObjectURL(file);
    setPreviewUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [file]);

  const previewSrc = previewUrl || resolveImageSrc(imageUrl);

  return (
    <FormField
      label="Card Image"
      error={error}
      touched={touched}
      className={className}
    >
      <div className="nova-image-field">
        <div className="nova-image-field-preview">
          {previewSrc ? (
            <img src={previewSrc} alt="Card artwork preview" />
          ) : (
            <i className="pi pi-image" />
          )}
        </div>
        <div className="nova-image-field-body">
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={onSelect}
            onBlur={onBlur}
          />
          <small className="text-muted d-block mt-1">
            {file
              ? `Selected: ${file.name}`
              : imageUrl
                ? "Current image is already saved."
                : "PNG or JPG, shown on the card offering tile."}
          </small>
        </div>
      </div>
    </FormField>
  );
};

const CardTabFields = ({
  variant,
  values,
  errors,
  touched,
  setFieldValue,
  setFieldTouched,
}) => {
  const detailsKey = `${variant}Details`;
  const feeKey = `${variant}Fee`;
  const discountKey = `${variant}Discount`;
  const details = values[detailsKey];
  const detailErrors = errors[detailsKey] || {};
  const detailTouched = touched[detailsKey] || {};
  const isPhysical = variant === "physical";

  const detailProps = (name, extraClass = "form-control") => ({
    onBlur: () => setFieldTouched(`${detailsKey}.${name}`, true),
    className: `w-100 ${extraClass} ${
      detailTouched[name] && detailErrors[name] ? "is-invalid" : ""
    }`,
  });

  return (
    <div className="row g-3">
      <FormField
        label="Name"
        required
        error={detailErrors.name}
        touched={detailTouched.name}
        className="col-lg-4 col-md-6"
      >
        <InputText
          value={details.name}
          onChange={(e) => setFieldValue(`${detailsKey}.name`, e.target.value)}
          {...detailProps("name")}
        />
      </FormField>

      <FormField
        label="Currency"
        required
        error={detailErrors.currency}
        touched={detailTouched.currency}
        className="col-lg-2 col-md-6"
      >
        <InputText
          value={details.currency}
          onChange={(e) =>
            setFieldValue(`${detailsKey}.currency`, e.target.value)
          }
          {...detailProps("currency")}
        />
      </FormField>

      <FormField
        label="Description"
        required
        error={detailErrors.description}
        touched={detailTouched.description}
        className="col-lg-6"
      >
        <InputText
          value={details.description}
          onChange={(e) =>
            setFieldValue(`${detailsKey}.description`, e.target.value)
          }
          {...detailProps("description")}
        />
      </FormField>

      {isPhysical && (
        <FormField
          label="Delivery"
          required
          error={detailErrors.delivery}
          touched={detailTouched.delivery}
        >
          <InputText
            value={details.delivery}
            onChange={(e) =>
              setFieldValue(`${detailsKey}.delivery`, e.target.value)
            }
            {...detailProps("delivery")}
          />
        </FormField>
      )}

      {isPhysical && (
        <FormField
          label="Availability"
          required
          error={detailErrors.availability}
          touched={detailTouched.availability}
        >
          <select
            value={details.availability}
            onChange={(e) =>
              setFieldValue(`${detailsKey}.availability`, e.target.value)
            }
            {...detailProps("availability", "form-select")}
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <FormField
        label={`Card Price (${details.currency || "USD"})`}
        required
        error={errors[feeKey]}
        touched={touched[feeKey]}
      >
        <InputNumber
          value={values[feeKey]}
          onValueChange={(e) => setFieldValue(feeKey, e.value ?? 0)}
          onBlur={() => setFieldTouched(feeKey, true)}
          mode="decimal"
          minFractionDigits={0}
          maxFractionDigits={2}
          className={`w-100 ${
            touched[feeKey] && errors[feeKey] ? "p-invalid" : ""
          }`}
          inputClassName="form-control"
        />
      </FormField>

      <FormField
        label={`Discounted Price (${details.currency || "USD"})`}
        required
        error={errors[discountKey]}
        touched={touched[discountKey]}
      >
        <InputNumber
          value={values[discountKey]}
          onValueChange={(e) => setFieldValue(discountKey, e.value ?? 0)}
          onBlur={() => setFieldTouched(discountKey, true)}
          mode="decimal"
          minFractionDigits={0}
          maxFractionDigits={2}
          className={`w-100 ${
            touched[discountKey] && errors[discountKey] ? "p-invalid" : ""
          }`}
          inputClassName="form-control"
        />
      </FormField>

      <ImageField
        className={isPhysical ? "col-12" : "col-lg-6"}
        file={details.image_file}
        imageUrl={details.image_url}
        error={detailErrors.image_file}
        touched={detailTouched.image_file}
        onSelect={(e) =>
          setFieldValue(
            `${detailsKey}.image_file`,
            e.currentTarget.files?.[0] ?? null,
          )
        }
        onBlur={() => setFieldTouched(`${detailsKey}.image_file`, true)}
      />
    </div>
  );
};

const SetCardFees = ({ cardProducts, onSaved }) => {
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
    // The endpoint is PUT /card-products/{id}, but PHP does not parse multipart
    // bodies on a real PUT, so the file upload goes as POST + method spoofing.
    formData.append("_method", "PUT");
    formData.append("card_code", product.card_code);
    formData.append("name", overrides.name ?? product.name);
    formData.append(
      "description",
      overrides.description ?? product.description ?? "",
    );
    formData.append(
      "currency",
      overrides.currency ?? product.currency ?? "USD",
    );
    if (overrides.image_file instanceof File) {
      formData.append(IMAGE_UPLOAD_FIELD, overrides.image_file);
    } else {
      // No new file picked: send the stored value back, or omit the field
      // entirely. Sending "" here made the backend wipe the saved image.
      const imageUrl = overrides.image_url || product.image_url || product.image;
      if (imageUrl) {
        formData.append("image_url", imageUrl);
      }
    }
    formData.append("card_type", product.card_type);
    formData.append("price", overrides.price ?? product.price);
    formData.append("discount", overrides.discount ?? product.discount);

    if (product.stock !== undefined && product.stock !== null) {
      formData.append("stock", product.stock);
    }

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
    <div className="card nova-panel nova-inventory-panel">
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

              // Pull the saved record back so the image and the offerings
              // panel show the stored values instead of stale state.
              await onSaved?.();

              setFeeSaved(true);
              setTimeout(() => setFeeSaved(false), 1500);
            } catch (error) {
              console.error("Save error:", error);
              setSaveError(extractApiError(error));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {(formik) => (
            <Form>
              <Tab.Container activeKey={activeTab}>
                <div className="nova-inventory-tabs">
                  <Nav as="ul" className="nav nav-tabs">
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="virtual"
                        onClick={() => setActiveTab("virtual")}
                      >
                        <i className="pi pi-credit-card me-2" />
                        Virtual Card
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item as="li">
                      <Nav.Link
                        eventKey="physical"
                        onClick={() => setActiveTab("physical")}
                      >
                        <i className="pi pi-id-card me-2" />
                        Physical Card
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </div>

                {cardProducts.length === 0 ? (
                  <Loading />
                ) : (
                  <Tab.Content>
                    <Tab.Pane eventKey="virtual">
                      <CardTabFields variant="virtual" {...formik} />
                    </Tab.Pane>

                    <Tab.Pane eventKey="physical">
                      <CardTabFields variant="physical" {...formik} />
                    </Tab.Pane>
                  </Tab.Content>
                )}
              </Tab.Container>

              <div className="nova-form-actions">
                <div className="nova-form-actions-status">
                  {feeSaved && (
                    <span className="text-success">
                      <i className="pi pi-check-circle me-1" />
                      Card inventory saved.
                    </span>
                  )}
                  {saveError && (
                    <span className="text-danger">
                      <i className="pi pi-exclamation-circle me-1" />
                      {saveError}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={formik.isSubmitting}
                >
                  <i className="pi pi-check me-2" />
                  {formik.isSubmitting ? "Saving..." : "Save Inventory"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SetCardFees;
