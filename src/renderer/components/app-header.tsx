import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
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
import { DocumentAdd20, ChartTreemap20, Fade20 } from "@carbon/icons-react";

import Import from "./Import";
import { userSetDateAction } from "../actions-app";

const mapStateToProps = (appState: any) =>  appState;

// @todo This should be required, but produces an error, refactor and follow
//   documentation.
// @see https://react-redux.js.org/using-react-redux/usage-with-typescript
type Props = {
  dispatch?: (action: any) => void,
  appState?: any
};

type State = {
  headerPanelExpanded: boolean
};

class AppHeader extends React.Component<Props, State> {
  state: State = {
    headerPanelExpanded: false
  };

  render() {
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
              <HeaderName href="/main_window" prefix="">
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
              <DatePicker
                dateFormat="d/m/Y"
                datePickerType="range"
                onChange={(values) => this.props.dispatch(userSetDateAction(values))}
                minDate={this.props.appState.date.start}
                maxDate={this.props.appState.date.end}
              >
                <DatePickerInput
                  id="date-picker-range-start"
                  placeholder="dd/mm/yyyy"
                  labelText="Start date"
                  type="text"
                  size={"sm"}
                  defaultValue={this.props.appState.dateSetByUser.start}
                />
                <DatePickerInput
                  id="date-picker-range-end"
                  placeholder="dd/mm/yyyy"
                  labelText="End date"
                  type="text"
                  size={"sm"}
                  defaultValue={this.props.appState.dateSetByUser.end}
                />
              </DatePicker>
              <HeaderGlobalBar>
                <HeaderGlobalAction
                  aria-label="Upload Data"
                  isActive={true}
                  onClick={() => this.setState({ headerPanelExpanded: !this.state.headerPanelExpanded })}
                >
                  <DocumentAdd20 />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
              <SideNav
                aria-label="Side navigation"
                isRail
                expanded={isSideNavExpanded}>
                <SideNavItems>
                  <SideNavLink aria-current="page" renderIcon={ChartTreemap20} href="#overview">
                    Overview
                  </SideNavLink>
                  <SideNavLink renderIcon={Fade20} href="#overview">
                    TODO
                  </SideNavLink>
                </SideNavItems>
              </SideNav>
              <HeaderPanel aria-label="Header Panel" expanded={this.state.headerPanelExpanded}>
                <Column>
                  <Import />

                  <div className="import-data">
                    {this.props.appState.hasData &&
                    <div>
                      {this.props.appState.numberOfDocuments} records in DB
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
}

export default connect(mapStateToProps)(AppHeader);