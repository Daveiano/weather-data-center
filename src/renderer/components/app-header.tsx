import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  Header,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderPanel,
  HeaderName,
  HeaderNavigation,
  SideNav,
  SideNavItems, SideNavLink,
  SideNavMenu,
  SideNavMenuItem,
  SkipToContent,
  Column,
  DatePicker,
  DatePickerInput
} from "carbon-components-react";
import {
  AppSwitcher20,
  Fade16,
  Notification20,
  Search20,
  DocumentAdd20,
  ChartTreemap20, Fade20
} from "@carbon/icons-react";

import Import from "./Import";

const mapStateToProps = (state: any) =>  state;

class AppHeader extends React.Component<{ appState?: any }> {
  state = {
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
                // TODO: onChange dispatch date.
                onChange={(values) => {console.log(values);}}
                minDate={this.props.appState.userDataDate.start}
                maxDate={this.props.appState.userDataDate.end}
              >
                <DatePickerInput
                  id="date-picker-range-start"
                  placeholder="dd/mm/yyyy"
                  labelText="Start date"
                  type="text"
                  size={"sm"}
                  defaultValue={this.props.appState.userDataDate.start}
                />
                <DatePickerInput
                  id="date-picker-range-end"
                  placeholder="dd/mm/yyyy"
                  labelText="End date"
                  type="text"
                  size={"sm"}
                  defaultValue={this.props.appState.userDataDate.end}
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

                  <div>
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