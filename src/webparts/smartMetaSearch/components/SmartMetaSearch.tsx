import * as React from 'react';
// import styles from './SmartMetaSearch.module.scss';
import { ISmartMetaSearchProps } from './ISmartMetaSearchProps';
import SmartSearchTable from './SmartMetaSearchTable'
import SmartFilterSearchGlobal from '../../../globalComponents/SmartFilter/SmartSearchFilter';
// import { escape } from '@microsoft/sp-lodash-subset';
export default class SmartMetaSearch extends React.Component<ISmartMetaSearchProps, {}> {
  public render(): React.ReactElement<ISmartMetaSearchProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      ContextValue,
      userDisplayName,
      SmartMetadataListId,
      TaskUserListId,     
    } = this.props;

    return (    
      <>
         <div>
          <SmartFilterSearchGlobal selectedArray={this.props}/>
          {/* <SmartSearchTable />*/}
         </div>
      </>
    )
  }
}
