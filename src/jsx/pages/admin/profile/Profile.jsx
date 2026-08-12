import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../../../utils/api";
import { formatDate, formatDateTime, getDisplayValue } from "../../../../utils";
import PageTitle from "../../../layouts/PageTitle";
import Loading from "../../../components/utilComponents/Loading";
import { buildRecordDetails, dedupeGroups } from "../components/recordDetails";

const CONTACT_FIELDS = [
  { key: "email", label: "Email", icon: "fa fa-envelope" },
  { key: "phone", label: "Phone", icon: "fa fa-phone" },
  { key: "location", label: "Location", icon: "fa fa-map-marker" },
];

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const getProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const res = await request({
        url: "me",
        method: "GET",
      });
      const user = res?.data?.user ?? res?.data ?? null;
      setProfile(user);
    } catch (error) {
      console.error(error);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const user = profile || {};
  const account = user.account || {};
  const displayName = getDisplayValue(user.name);
  const role = getDisplayValue(user.role);
  const statusLabel = user.is_active ? "Active" : "Inactive";
  const contactValues = {
    email: getDisplayValue(user.email),
    phone: getDisplayValue(user.phone),
    location: getDisplayValue(account.address || account.domain),
  };

  const initials =
    String(user.name || "")
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "NA";

  // Everything the endpoint returns, minus what the hero and contact cards
  // already show, so the page never prints the same value twice.
  const autoDetails = buildRecordDetails(profile, {
    skipKeys: ["name", "role", "email", "phone", "is_active"],
    rootTitle: "Profile",
  });

  const detailGroups = dedupeGroups(autoDetails.groups, [
    `Name|${displayName}`,
    `Role|${role}`,
    `Email|${contactValues.email}`,
    `Phone|${contactValues.phone}`,
    `Address|${contactValues.location}`,
    `Domain|${contactValues.location}`,
    `Status|${statusLabel}`,
  ]);

  return (
    <>
      <PageTitle motherMenu="Profile" activeMenu="Admin Profile" />

      {/* Same hero pattern as the KYC, Cards and Invite pages. */}
      <div className="nova-page-hero is-profile mb-3">
        <div className="nova-page-hero-copy">
          <span className="nova-page-hero-eyebrow">Admin Account</span>
          <h2 className="nova-page-hero-title mb-2">
            {profileLoading ? "Loading profile..." : displayName}
          </h2>
          <p className="nova-page-hero-text mb-0">
            Your access level, contact details, and everything linked to this
            Nova admin account.
          </p>
        </div>

        <div className="nova-page-hero-metrics">
          <div className="nova-page-hero-metric is-highlight">
            <span>Role</span>
            <strong>{profileLoading ? "..." : role}</strong>
          </div>
          <div className="nova-page-hero-metric">
            <span>Member Since</span>
            <strong>
              {profileLoading ? "..." : formatDate(user.created_at)}
            </strong>
          </div>
        </div>
      </div>

      {profileLoading ? (
        <div className="card nova-panel">
          <div className="card-body d-flex justify-content-center py-5">
            <Loading />
          </div>
        </div>
      ) : (
        <div className="row g-3">
          <div className="col-xl-5">
            <div className="card nova-panel nova-profile-card h-100">
              <div className="card-body">
                <div className="nova-profile-hero">
                  <div className="nova-profile-meta">
                    <div className="nova-profile-avatar">{initials}</div>
                    <div className="nova-profile-identity">
                      <h3 className="mb-1">{displayName}</h3>
                      <div className="nova-profile-badges">
                        <span className="nova-profile-chip">{role}</span>
                        {account.name ? (
                          <span className="nova-profile-sub">
                            {account.name}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`nova-status-pill ${
                      user.is_active ? "is-active" : "is-inactive"
                    }`}
                  >
                    <span className="nova-status-dot" />
                    {statusLabel}
                  </span>
                </div>

                <div className="nova-profile-contact-grid">
                  {CONTACT_FIELDS.map((field) => (
                    <div className="nova-profile-contact" key={field.key}>
                      <span className="nova-profile-contact-icon">
                        <i className={field.icon} />
                      </span>
                      <div className="nova-profile-contact-info">
                        <span>{field.label}</span>
                        <p>{contactValues[field.key]}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {user.created_at ? (
                  <p className="nova-profile-footnote mb-0">
                    <i className="fa fa-clock-o me-2" />
                    Joined {formatDateTime(user.created_at)}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="col-xl-7">
            <div className="card nova-panel h-100">
              <div className="card-body">
                <div className="nova-section-head is-compact">
                  <div>
                    <h4 className="mb-1">Account Details</h4>
                    <p className="text-muted mb-0">
                      Everything linked to this admin account.
                    </p>
                  </div>
                </div>

                {detailGroups.length ? (
                  detailGroups.map((group) => (
                    <div className="nova-detail-group" key={group.title}>
                      <h6 className="nova-detail-group-title">{group.title}</h6>
                      <div className="nova-detail-grid">
                        {group.fields.map((field) => (
                          <div
                            className="nova-profile-list-row"
                            key={`${group.title}-${field.label}`}
                          >
                            <span>{field.label}</span>
                            <strong>{field.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="nova-table-empty-state">
                    <i className="pi pi-id-card" />
                    <h6>Nothing else to show</h6>
                    <p>This account has no extra details yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
