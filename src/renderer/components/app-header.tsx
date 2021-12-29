import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import type { HashLinkProps } from 'react-router-hash-link';
import type { LinkProps } from "react-router-dom";
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
  DatePickerInput, SideNavMenu, SideNavMenuItem
} from "carbon-components-react";
import {
  DocumentAdd20,
  Temperature32,
  ChartTreemap32,
  Rain32,
  Windy32,
  UvIndexAlt32,
  Pressure32
} from "@carbon/icons-react";

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

  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.scrollY;
    const yOffset = -80;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  }

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
                <SideNavLink<HashLinkProps>
                  aria-current={location.pathname === '/' ? 'page' : false}
                  renderIcon={ChartTreemap32}
                  to="/#top"
                  element={HashLink}
                  scroll={el => scrollWithOffset(el)}
                >
                  Overview
                </SideNavLink>
                <SideNavMenu
                  title="Temperature"
                  renderIcon={Temperature32}
                  isSideNavExpanded={location.pathname === '/temperature'}
                  isActive={location.pathname === '/temperature'}
                >
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/temperature' && location.hash === '' ? 'page' : false}
                    to="/temperature#top"
                    element={HashLink}
                  >
                    Overview
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/temperature' && location.hash === '#temp-01-felt-dew' ? 'page' : false}
                    to="/temperature#temp-01-felt-dew"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Felt and Dew point
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/temperature' && location.hash === '#temp-02-min-max-felt' ? 'page' : false}
                    to="/temperature#temp-02-min-max-felt"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Felt Min/Max
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/temperature' && location.hash === '#temp-03-combined' ? 'page' : false}
                    to="/temperature#temp-03-combined"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Min/Max/Avg
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/temperature' && location.hash === '#temp-04-table' ? 'page' : false}
                    to="/temperature#temp-04-table"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    All data
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu
                  title="Precipitation"
                  renderIcon={Rain32}
                  isSideNavExpanded={location.pathname === '/precipitation'}
                  isActive={location.pathname === '/precipitation'}
                >
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/precipitation' && location.hash === '' ? 'page' : false}
                    to="/precipitation#top"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Overview
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/precipitation' && location.hash === '#rain-02-selectable' ? 'page' : false}
                    to="/precipitation#rain-02-selectable"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Daily/Weekly/Monthly/Yearly
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/precipitation' && location.hash === '#rain-03-humidity' ? 'page' : false}
                    to="/precipitation#rain-03-humidity"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Humidity
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu
                  title="Pressure"
                  renderIcon={Pressure32}
                  isSideNavExpanded={location.pathname === '/pressure'}
                  isActive={location.pathname === '/pressure'}
                >
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/pressure' && location.hash === '' ? 'page' : false}
                    to="/pressure#top"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Overview
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu
                  title="Wind"
                  renderIcon={Windy32}
                  isSideNavExpanded={location.pathname === '/wind'}
                  isActive={location.pathname === '/wind'}
                >
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/wind' && location.hash === '' ? 'page' : false}
                    to="/wind#top"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Overview
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/wind' && location.hash === '#wind-01-direction' ? 'page' : false}
                    to="/wind#wind-01-direction"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Wind direction
                  </SideNavMenuItem>
                </SideNavMenu>
                <SideNavMenu
                  title="Solar"
                  renderIcon={UvIndexAlt32}
                  isSideNavExpanded={location.pathname === '/solar'}
                  isActive={location.pathname === '/solar'}
                >
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/solar' && location.hash === '' ? 'page' : false}
                    to="/solar#top"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    Overview
                  </SideNavMenuItem>
                  <SideNavMenuItem<HashLinkProps>
                    aria-current={location.pathname === '/solar' && location.hash === '#solar-01-uvi' ? 'page' : false}
                    to="/solar#solar-01-uvi"
                    element={HashLink}
                    scroll={el => scrollWithOffset(el)}
                  >
                    UV Index
                  </SideNavMenuItem>
                </SideNavMenu>
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