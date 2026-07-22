import React, { useCallback, useReducer, useContext, useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { ThemeContext } from "../../../context/ThemeContext";
import { MenuList } from "./Menu";

const normalizeRoute = (to) => {
  if (!to || to === "#") return null;
  return to.replace(/\/$/, "") || "/";
};

const reducer = (previousState, updatedState) => ({
  ...previousState,
  ...updatedState,
});

const initialState = {
  active: "",
  activeSubmenu: "",
};

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/$/, "") || "/";
  const isActiveRoute = useCallback((to) => {
    const route = normalizeRoute(to);
    return route !== null && route === currentPath;
  }, [currentPath]);

  const {
    iconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
    ChangeIconSidebar,
  } = useContext(ThemeContext);

  const [state, setState] = useReducer(reducer, initialState);

  const [hideOnScroll, setHideOnScroll] = useState(true);
  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isShow = currPos.y > prevPos.y;
      if (isShow !== hideOnScroll) setHideOnScroll(isShow);
    },
    [hideOnScroll],
  );

  const handleMenuActive = (status) => {
    setState({ active: status });
    if (state.active === status) {
      setState({ active: "" });
    }
  };
  const handleSubmenuActive = (status) => {
    setState({ activeSubmenu: status });
    if (state.activeSubmenu === status) {
      setState({ activeSubmenu: "" });
    }
  };

  const isMenuActive = (menu) => {
    if (menu.content?.length) {
      return menu.content.some(
        (item) =>
          isActiveRoute(item.to) ||
          item.content?.some((child) => isActiveRoute(child.to)),
      );
    }
    return isActiveRoute(menu.to);
  };

  useEffect(() => {
    let nextState = { active: "", activeSubmenu: "" };

    MenuList.forEach((menu) => {
      menu.content?.forEach((item) => {
        if (isActiveRoute(item.to)) {
          nextState = { active: menu.title, activeSubmenu: "" };
        }
        item.content?.forEach((child) => {
          if (isActiveRoute(child.to)) {
            nextState = { active: menu.title, activeSubmenu: item.title };
          }
        });
      });
    });

    setState(nextState);
  }, [isActiveRoute]);

  return (
    <div
      onMouseEnter={() => ChangeIconSidebar(true)}
      onMouseLeave={() => ChangeIconSidebar(false)}
      className={`deznav ${iconHover} ${
        sidebarposition.value === "fixed" &&
        sidebarLayout.value === "horizontal" &&
        headerposition.value === "static"
          ? hideOnScroll > 120
            ? "fixed"
            : ""
          : ""
      }`}
    >
      <div className="deznav-scroll">
        <ul className="metismenu" id="menu">
          {MenuList.map((data, index) => {
            let menuClass = data.classsChange;
            if (menuClass === "menu-title") {
              return (
                <li
                  className={`nav-label ${menuClass} ${data.extraclass}`}
                  key={index}
                >
                  {data.title}
                </li>
              );
            }

            return (
              <li
                className={isMenuActive(data) ? "mm-active" : ""}
                key={index}
              >
                {data.content && data.content.length > 0 ? (
                  <>
                    <Link
                      to={"#"}
                      className="has-arrow"
                      onClick={(event) => {
                        event.preventDefault();
                        handleMenuActive(data.title);
                      }}
                    >
                      <div className="menu-icon">{data.iconStyle}</div>
                      <span className="nav-text">{data.title}</span>
                      {data.update ? (
                        <span className="badge badge-xs style-1 badge-danger">
                          {data.update}
                        </span>
                      ) : null}
                    </Link>
                    <Collapse
                      in={state.active === data.title || isMenuActive(data)}
                    >
                      <ul
                        className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}
                      >
                        {data.content.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className={isActiveRoute(item.to) ? "mm-active" : ""}
                          >
                            {item.content && item.content.length > 0 ? (
                              <>
                                <Link
                                  to={item.to}
                                  className={item.hasMenu ? "has-arrow" : ""}
                                  onClick={() => {
                                    handleSubmenuActive(item.title);
                                  }}
                                >
                                  {item.title}
                                </Link>
                                <Collapse
                                  in={state.activeSubmenu === item.title}
                                >
                                  <ul
                                    className={`${menuClass === "mm-collapse" ? "mm-show" : ""}`}
                                  >
                                    {item.content.map((child, childIndex) => (
                                      <li key={childIndex}>
                                        <Link
                                          className={
                                            isActiveRoute(child.to)
                                              ? "mm-active"
                                              : ""
                                          }
                                          to={child.to}
                                        >
                                          {child.title}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </Collapse>
                              </>
                            ) : (
                              <Link
                                to={item.to}
                                className={
                                  isActiveRoute(item.to) ? "mm-active" : ""
                                }
                              >
                                {item.title}
                              </Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    </Collapse>
                  </>
                ) : (
                  <Link
                    to={data.to}
                    className={isActiveRoute(data.to) ? "mm-active" : ""}
                  >
                    {data.iconStyle}
                    <span className="nav-text">{data.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
