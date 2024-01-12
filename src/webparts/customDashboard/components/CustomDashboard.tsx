import * as React from 'react';
import styles from './CustomDashboard.module.scss';
import { ICustomDashboardProps } from './ICustomDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { DashboardSetting } from './DashboardSetting';
export default class CustomDashboard extends React.Component<ICustomDashboardProps, {}> {
  public render(): React.ReactElement<ICustomDashboardProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
      siteUrl,
      MasterTaskListID,
      TaskUsertListID,
      SmartMetadataListID,
      SmartInformationListID,
      DocumentsListID,
      TaskTimeSheetListID,
      TimeEntry,
      SiteCompostion,
      SmalsusLeaveCalendar,
      TaskTypeID
    } = this.props;

    return (
      <DashboardSetting props={this.props}></DashboardSetting>
    );
  }
}
