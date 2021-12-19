import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, LinkProps, useLocation } from "react-router-dom";
import moment from 'moment';

import {
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  Header,
  HeaderMenuButton,
  HeaderPanel,
  HeaderName,
  SideNav,
  SideNavItems, SideNavLink,
  SkipToContent,
  Column,
  DatePicker,
  DatePickerInput
} from "carbon-components-react";
import { DocumentAdd20, Temperature32, ChartTreemap32 } from "@carbon/icons-react";

import Import from "./import";
import { userSetDateAction } from "../actions-app";
import { RootState } from "../renderer";

export const AppHeader: React.FC = (): React.ReactElement => {
  const [headerPanelExpanded, setHeaderPanelExpanded] = useState(false);

  const dataFromStore = useSelector((state: RootState) => state.appState.data);
  const dateSetByUser = useSelector((state: RootState) => state.appState.dateSetByUser);
  const dateFromStore = useSelector((state: RootState) => state.appState.date);

  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <HeaderContainer
      render={({ isSideNavExpanded, onClickSideNavExpand }) => (
        <>
          <Header aria-label="Weather Data Center">
            <SkipToContent />
            <HeaderMenuButton
              aria-label="Open menu"
              isCollapsible
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
            />
            <HeaderName<LinkProps> element={Link} to="/" prefix="">
              Weather Data Center
            </HeaderName>
            {/*<HeaderNavigation>
              <HeaderMenuItem href="#">Link 1</HeaderMenuItem>
              <HeaderMenuItem href="#">Link 2</HeaderMenuItem>
              <HeaderMenuItem href="#">Link 3</HeaderMenuItem>
              <HeaderMenu aria-label="Link 4" menuLinkName={'test'}>
                <HeaderMenuItem href="#">Sub-link 1</HeaderMenuItem>
                <HeaderMenuItem href="#">Sub-link 2</HeaderMenuItem>
                <HeaderMenuItem href="#">Sub-link 3</HeaderMenuItem>
              </HeaderMenu>
            </HeaderNavigation>*/}
            {dateFromStore.start !== '0' && dateFromStore.end !== '0' &&
            <DatePicker
              dateFormat="d/m/Y"
              datePickerType="range"
              onChange={(values) => dispatch(userSetDateAction(values))}
              minDate={moment(dateFromStore.start, 'DD-MM-YYYY').format('DD-MM-YYYY')}
              maxDate={moment(dateFromStore.end, 'DD-MM-YYYY').format('DD-MM-YYYY')}
            >
              <DatePickerInput
                id="date-picker-range-start"
                placeholder="dd/mm/yyyy"
                labelText="Start date"
                type="text"
                size={"sm"}
                defaultValue={dateSetByUser.start}
              />
              <DatePickerInput
                id="date-picker-range-end"
                placeholder="dd/mm/yyyy"
                labelText="End date"
                type="text"
                size={"sm"}
                defaultValue={dateSetByUser.end}
              />
            </DatePicker>
            }

            <HeaderGlobalBar>
              <HeaderGlobalAction
                aria-label="Upload Data"
                isActive={true}
                onClick={() => setHeaderPanelExpanded(!headerPanelExpanded)}
              >
                <DocumentAdd20 />
              </HeaderGlobalAction>
            </HeaderGlobalBar>
            <SideNav
              aria-label="Side navigation"
              isRail
              expanded={isSideNavExpanded}>
              <SideNavItems>
                <SideNavLink<LinkProps>
                  aria-current={location.pathname === '/' ? 'page' : false}
                  renderIcon={ChartTreemap32}
                  to="/"
                  element={Link}
                >
                  Overview
                </SideNavLink>
                <SideNavLink<LinkProps>
                  aria-current={location.pathname === '/temperature' ? 'page' : false}
                  renderIcon={Temperature32}
                  to="/temperature"
                  element={Link}
                >
                  Temperature
                </SideNavLink>
              </SideNavItems>
            </SideNav>
            <HeaderPanel aria-label="Header Panel" expanded={headerPanelExpanded}>
              <Column>
                <Import />

                <div className="import-data">
                  {dataFromStore.length > 0 &&
                  <div>
                    {dataFromStore.length} records in DB
                  </div>
                  }
                </div>
              </Column>
            </HeaderPanel>
          </Header>
        </>
      )}
    />
  );
}