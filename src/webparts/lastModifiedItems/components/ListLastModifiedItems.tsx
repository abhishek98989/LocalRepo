import { ColumnActionsMode, ConstrainMode, ContextualMenu, DetailsList, DetailsListLayoutMode, DirectionalHint, IColumn, Icon, IContextualMenuItem, IContextualMenuProps, IPersonaProps, IStackTokens, ITooltipProps, Link, Persona, PersonaSize, SelectionMode, Stack, TooltipHost } from "@fluentui/react";
import * as _ from "lodash";
import * as React from "react";
import { Utils }  from "./../../../common/Utils";
import styles from "./CommonControl.module.scss";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";


export interface IListLastModifiedItemsProps {
    Items: any[];
    TabName: string;
    Site: string;
    ResetItems: boolean;
    OnDelete: (delItemId: number)=>void;
    OnFilter: (showFilter: boolean)=>void;
}

export interface IListLastModifiedItemsState {
    columns: IColumn[];
    sortedItems: any[];
    isOpenEditPopup: Boolean;
    DataItem: any[];
    contextualMenuProps: IContextualMenuProps;    
}

const SiteURL: string = "https://hhhhteams.sharepoint.com/sites/HHHH/SP";


class ListLastModifiedItems extends React.Component<IListLastModifiedItemsProps, IListLastModifiedItemsState> {
        
    constructor(props: IListLastModifiedItemsProps) {

        super(props);

        this._onColumnClick = this._onColumnClick.bind(this);
        this._onRenderTeamMembers = this._onRenderTeamMembers.bind(this);
        this._onRenderCreated = this._onRenderCreated.bind(this);
        this._onRenderModified = this._onRenderModified.bind(this);
        this._onRenderActionButtons = this._onRenderActionButtons.bind(this);

        this._onColumnContextMenu = this._onColumnContextMenu.bind(this);
        this._getContextualMenuProps = this._getContextualMenuProps.bind(this);
        this._onContextualMenuDismissed = this._onContextualMenuDismissed.bind(this);
        this._onSortColumn = this._onSortColumn.bind(this);
        this._onResetFiltersClicked = this._onResetFiltersClicked.bind(this);
        this.getFilterValues = this.getFilterValues.bind(this);
        this.ClickFilter = this.ClickFilter.bind(this);        

        const _columns: IColumn[] = [];    
        _columns.push({key: "TaskId", name: "Task ID", fieldName: "TaskId", minWidth: 75, maxWidth: 100, onColumnClick: this._onColumnClick, onColumnContextMenu: this._onColumnContextMenu, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
        _columns.push({key: "TaskName", name: "Task Name", fieldName: "TaskName", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String, onRender:(item, index, column) => {
            return <Link href={`${SiteURL}/SitePages/Task-Profile.aspx?taskId=${item.TaskId}&Site=${this.props.Site}`} target="_blank">{item.TaskName}</Link>
        } });
        _columns.push({key: "PortfolioType", name: "Component", fieldName: "PortfolioType", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String, onRender:(item, index, column) => {
            return (<div>
                {item.Components && item.Components.map((comp: any)=><Link href={`${SiteURL}/SitePages/Portfolio-Profile.aspx?taskId=${comp.Id}`}>{comp.Title}</Link>)}
                {item.Services && item.Services.map((service: any)=><Link href={`${SiteURL}/SitePages/Portfolio-Profile.aspx?taskId=${service.Id}`}>{service.Title}</Link>)}
                {item.Events && item.Events.map((event: any)=><Link href={`${SiteURL}/SitePages/Portfolio-Profile.aspx?taskId=${event.Id}`}>{event.Title}</Link>)}
            </div>)
        }});
        _columns.push({key: "DueDate", name: "Due Date", fieldName: "DueDate", minWidth: 75, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date});
        _columns.push({key: "PercentComplete", name: "%", fieldName: "PercentComplete", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
            if(item.PercentComplete == 0) return "";
            return `${item.PercentComplete}%`
        }});
        _columns.push({key: "Priority", name: "Priority", fieldName: "Priority", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
            if(item.Priority == 0) return "";
            return item.Priority;
        }});
        _columns.push({key: "TeamUsers", name: "Team Members", fieldName: "TeamUsers", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderTeamMembers, columnActionsMode:ColumnActionsMode.hasDropdown, data: Object});
        _columns.push({key: "Modified", name: "Modified", fieldName: "Modified", minWidth: 100, isSorted: true, isSortedDescending: true, onColumnClick: this._onColumnClick, onRender: this._onRenderModified, columnActionsMode:ColumnActionsMode.hasDropdown, data: Object});
        _columns.push({key: "Created", name: "Created", fieldName: "Created", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderCreated, columnActionsMode:ColumnActionsMode.hasDropdown, data: Object});
        _columns.push({key: "Id", name: "", fieldName: "Id", minWidth: 100, onRender: this._onRenderActionButtons });

        this.state = {
            columns: _columns,
            sortedItems: this.props.Items,
            isOpenEditPopup: false,
            DataItem:[],
            contextualMenuProps: null
        }         
        
    }

    private OpenEditPopUp(item:any) {
        this.setState({
          isOpenEditPopup: true,
          DataItem:item
        })
      }
    private CallBack() {
        this.setState({
          isOpenEditPopup: false
        })
      }

    private _onRenderTeamMembers(item: any, index: number, column: IColumn) {

        let respTeam = item.TeamUsers?.ResponsibleTeam;
        let teamMembers: any[] = [];
        let combinedTeamMembers = [...item.TeamUsers.AssignedUsers, ...item.TeamUsers.TeamMembers];

        combinedTeamMembers.forEach(cTeamMember => {
            let collUniqueTeamMemberId = teamMembers.map((tMember: { UserId: number; })=>tMember.UserId);
            if(collUniqueTeamMemberId.indexOf(cTeamMember.UserId)==-1) {
                teamMembers.push(cTeamMember); 
            }
        });

        if(respTeam.length==0 && teamMembers.length==0) return;

        const stackTokens: IStackTokens = {
            childrenGap: 5
        };
        const divStyle = {
            fontSize: "24px",
            margin: "0 2px",
            lineHeight: "24px",
            color: "#858586"
        }

        let elemRespTeam = null;
        let elemDivider = null;
        elemDivider = (respTeam.length>0 && teamMembers.length>0) && (<Stack.Item><div style={divStyle}>|</div></Stack.Item>);
        
        if(respTeam.length>0) {
            respTeam = respTeam[0];
            let personaRespTeamUser = this.getUserPersona(respTeam);
            elemRespTeam = (<Stack.Item>{personaRespTeamUser}</Stack.Item>);
        }

        let elemMemberOne = null;
        let elemMemberTwo = null;
        if(teamMembers.length>0) {            
            const firstMember = teamMembers[0];
            elemMemberOne = (<Stack.Item>{this.getUserPersona(firstMember)}</Stack.Item>);
            if(teamMembers.length==2) {
                let secondMember = teamMembers[1];
                elemMemberTwo = (<Stack.Item>{this.getUserPersona(secondMember)}</Stack.Item>);
            }
            else if(teamMembers.length>2) {
                let restOfMembers = teamMembers.slice(1);                
                elemMemberTwo = (<Stack.Item>{this.getAdditionalMembers(restOfMembers)}</Stack.Item>);
            }
        }        
               
        return (
            <Stack horizontal tokens={stackTokens}>
                { elemRespTeam }
                { elemDivider }
                { elemMemberOne }
                { elemMemberTwo }
            </Stack>
        );
    }
    
    private _onRenderModified(item: any, index: number, column: IColumn) {
        const modifiedInfo = item.Modified;        
        const modifiedDate = modifiedInfo.Date;
        
        const stackTokens: IStackTokens = {
            childrenGap: 5
        };
        const personaUserModified = this.getUserPersona(modifiedInfo);
        return (
            <Stack horizontal tokens={stackTokens}>
                <Stack.Item><div style={{fontSize: "12px", fontWeight: 400}}>{modifiedDate}</div></Stack.Item>
                <Stack.Item>{personaUserModified}</Stack.Item>
            </Stack>
        );
    }

    private _onRenderCreated(item: any, index: number, column: IColumn) {
        const createdInfo = item.Created;
        const createdDate = createdInfo.Date;
        
        const stackTokens: IStackTokens = {
            childrenGap: 5
        };

        const personaUserCreated = this.getUserPersona(createdInfo)
        return (
            <Stack horizontal tokens={stackTokens}>
                <Stack.Item><div style={{fontSize: "12px", fontWeight: 400}}>{createdDate}</div></Stack.Item>
                <Stack.Item>{personaUserCreated}</Stack.Item>
            </Stack>
        );
    }

    private _onRenderActionButtons(item: any, index: number, column: IColumn) {
        return (
            <div>
                <Link href="#"><Icon iconName="Edit" style={{color:"black", paddingLeft:"10px"}} onClick={() => this.OpenEditPopUp(item) }/></Link>
                <Link href="#"><Icon iconName="Delete" style={{color:"black", paddingLeft:"10px"}} onClick={
                    ()=>this.props.OnDelete(item.Id)
                } /></Link>
            </div>
        );
    }

    private getUserPersona(userInfo: any) {
        const personaProps: IPersonaProps = {
            size: PersonaSize.size24,
        }
        const userImage = userInfo.ImageUrl;
        const userName = userInfo.UserName;
        if(userImage) {
            personaProps.imageUrl = userImage;
        }
        else {
            personaProps.imageInitials = userName.split(" ").map((i: string)=>i.indexOf("+")>-1?i:i.charAt(0)).join("");
        }
        const elemPersona = <Persona {...personaProps} styles={{details:{padding:"0px"}}} />
        return (            
            <TooltipHost content={userName}>
                <Link href={this.getUserRedirectUrl(userInfo)} target="_blank">
                    { elemPersona }
                </Link>
            </TooltipHost>            
        );
    }

    private getAdditionalMembers(memberItems:any[]) {

        const personaProps: IPersonaProps = {
            size: PersonaSize.size24,
            imageInitials: `+${memberItems.length}`
        }
        const stackTokens: IStackTokens = {
            childrenGap: 5
        };
        let userName; let memberPersonaProps: IPersonaProps; let userImage;
        const tooltipProps: ITooltipProps = {
            onRenderContent: () => (
                <Stack tokens={stackTokens}>
                    {                         
                        memberItems.map( memberItem => {
                            userName =  memberItem.UserName;
                            userImage = memberItem.UserImage;
                            memberPersonaProps = {
                                size: PersonaSize.size24,
                                text: userName
                            };
                            if(userImage) {
                                memberPersonaProps.imageUrl = userImage;
                            }
                            else {
                                memberPersonaProps.imageInitials = userName.split(" ").map((i: string)=>i.charAt(0)).join("");
                            }
                            return (
                                <Stack.Item>
                                    <Link href={this.getUserRedirectUrl(memberItem)} target="_blank">
                                        <Persona {...memberPersonaProps} />
                                    </Link>
                                </Stack.Item>
                            ); 
                        })
                    }
                </Stack>                
            )
        };
        
        const elemPersona = <Persona {...personaProps} styles={{details:{padding:"0px"}}} />
        return (
            <TooltipHost tooltipProps={tooltipProps} directionalHint={DirectionalHint.rightCenter}>
                <Link href="#">
                    {elemPersona}
                </Link>
            </TooltipHost>
        );
    }

    private getUserRedirectUrl(userItem: any) {
        return `${SiteURL}/SitePages/TeamLeader-Dashboard.aspx?UserId=${userItem.UserId}&Name=${userItem.UserName}`;
    }

    componentDidUpdate(prevProps: IListLastModifiedItemsProps): void {
        if(prevProps.Items !== this.props.Items) {
            this.setState({
                sortedItems: this.props.Items
            });
        }
        if(prevProps.TabName !== this.props.TabName) {
            const _columns: IColumn[] = [];
            if(this.props.TabName=="DOCUMENTS") {
                _columns.push({key: "DocumentName", name: "Document Name", fieldName: "DocumentName", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "DocumentLink", name: "Document Link", fieldName: "DocumentLink", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "Created", name: "Created", fieldName: "Created", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderCreated, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date });
                _columns.push({key: "Modified", name: "Modified", fieldName: "Modified", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderModified, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date });
                _columns.push({key: "Id", name: "", fieldName: "Id", minWidth: 100, onRender: this._onRenderActionButtons});
            }
            else if(this.props.TabName=="FOLDERS") {
                _columns.push({key: "FolderName", name: "Folder Name", fieldName: "FolderName", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "FolderLink", name: "Folder Link", fieldName: "FolderLink", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "Created", name: "Created", fieldName: "Created", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderCreated, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date });
                _columns.push({key: "Modified", name: "Modified", fieldName: "Modified", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderModified, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date });
                _columns.push({key: "Id", name: "", fieldName: "Id", minWidth: 100, onRender: this._onRenderActionButtons});
            }
            else if(this.props.TabName=="COMPONENTS") {
                _columns.push({key: "ComponentId", name: "ID", fieldName: "ComponentId", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "Title", name: "Component Name", fieldName: "Title", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "DueDate", name: "Due Date", fieldName: "DueDate", minWidth: 75, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String});
                _columns.push({key: "PercentComplete", name: "%", fieldName: "PercentComplete", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
                    if(item.PercentComplete == 0) return "";
                    return `${item.PercentComplete}%`
                }});
                _columns.push({key: "Priority", name: "Priority", fieldName: "Priority", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
                    if(item.Priority == 0) return "";
                    return item.Priority;
                }});
                _columns.push({key: "Modified", name: "Modified", fieldName: "Modified", minWidth: 75, isSorted: true, isSortedDescending: true, onColumnClick: this._onColumnClick, onRender: this._onRenderModified, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date});
                _columns.push({key: "Created", name: "Created", fieldName: "Created", minWidth: 75, onColumnClick: this._onColumnClick, onRender: this._onRenderCreated, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date});
                _columns.push({key: "Id", name: "", fieldName: "Id", minWidth: 100, onRender: this._onRenderActionButtons});
            }
            else if(this.props.TabName=="SERVICES") {
                _columns.push({key: "ServiceId", name: "ID", fieldName: "ServiceId", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "Title", name: "Service Name", fieldName: "Title", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "DueDate", name: "Due Date", fieldName: "DueDate", minWidth: 75, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "PercentComplete", name: "%", fieldName: "PercentComplete", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
                    if(item.PercentComplete == 0) return "";
                    return `${item.PercentComplete}%`
                } });
                _columns.push({key: "Priority", name: "Priority", fieldName: "Priority", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
                    if(item.Priority == 0) return "";
                    return item.Priority;
                } });
                _columns.push({key: "Modified", name: "Modified", fieldName: "Modified", minWidth: 75, isSorted: true, isSortedDescending: true, onColumnClick: this._onColumnClick, onRender: this._onRenderModified, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date });
                _columns.push({key: "Created", name: "Created", fieldName: "Created", minWidth: 75, onColumnClick: this._onColumnClick, onRender: this._onRenderCreated, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date });
                _columns.push({key: "Id", name: "", fieldName: "Id", minWidth: 100, onRender: this._onRenderActionButtons});
            }
            else {
                _columns.push({key: "TaskId", name: "Task ID", fieldName: "TaskId", minWidth: 50, onColumnClick: this._onColumnClick, onColumnContextMenu: this._onColumnContextMenu, columnActionsMode:ColumnActionsMode.hasDropdown, data: String });
                _columns.push({key: "TaskName", name: "Task Name", fieldName: "TaskName", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String, onRender:(item, index, column) => {
                    return <Link href={`${SiteURL}/SitePages/Task-Profile.aspx?taskId=${item.TaskId}&Site=${this.props.Site}`} target="_blank">{item.TaskName}</Link>
                } });
                _columns.push({key: "PortfolioType", name: "Component", fieldName: "PortfolioType", minWidth: 100, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: String, onRender:(item, index, column) => {
                    return (<div>
                        {item.Components && item.Components.map((comp: any)=><Link href={`${SiteURL}/SitePages/Portfolio-Profile.aspx?taskId=${comp.Id}`}>{comp.Title}</Link>)}
                        {item.Services && item.Services.map((service: any)=><Link href={`${SiteURL}/SitePages/Portfolio-Profile.aspx?taskId=${service.Id}`}>{service.Title}</Link>)}
                        {item.Events && item.Events.map((event: any)=><Link href={`${SiteURL}/SitePages/Portfolio-Profile.aspx?taskId=${event.Id}`}>{event.Title}</Link>)}
                    </div>)
                }});
                _columns.push({key: "DueDate", name: "Due Date", fieldName: "DueDate", minWidth: 75, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date});
                _columns.push({key: "PercentComplete", name: "%", fieldName: "PercentComplete", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
                    if(item.PercentComplete == 0) return "";
                    return `${item.PercentComplete}%`
                }});
                _columns.push({key: "Priority", name: "Priority", fieldName: "Priority", minWidth: 50, onColumnClick: this._onColumnClick, columnActionsMode:ColumnActionsMode.hasDropdown, data: Number, onRender:(item, index, column) => {
                    if(item.Priority == 0) return "";
                    return item.Priority;
                }});
                _columns.push({key: "TeamUsers", name: "Team Members", fieldName: "TeamUsers", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderTeamMembers, columnActionsMode:ColumnActionsMode.hasDropdown, data: Object});
                _columns.push({key: "Modified", name: "Modified", fieldName: "Modified", minWidth: 100, isSorted: true, isSortedDescending: true, onColumnClick: this._onColumnClick, onRender: this._onRenderModified, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date});
                _columns.push({key: "Created", name: "Created", fieldName: "Created", minWidth: 100, onColumnClick: this._onColumnClick, onRender: this._onRenderCreated, columnActionsMode:ColumnActionsMode.hasDropdown, data: Date});
                _columns.push({key: "Id", name: "", fieldName: "Id", minWidth: 100, onRender: this._onRenderActionButtons});
            }

            this.setState({
                columns: _columns
            })
        }
        if(prevProps.ResetItems != this.props.ResetItems) {
            let columns = this.state.columns;
            //reset the columns
            _.map(columns, (c: IColumn) => {

            c.isSorted = false;
            c.isSortedDescending = false;
            c.isFiltered = false;

            });
            //update the state, this will force the control to refresh
            this.setState({
                sortedItems: this.props.Items,
                columns: columns
            });
            this.props.OnFilter(false);            
        }
    }

    private _onColumnClick(event: React.MouseEvent<HTMLElement>, column: IColumn) {
        debugger;
        if(column.key=="TaskId" || column.key=="DueDate" || column.key=="Created" || column.key=="Modified" || column.key=="TaskName" || column.key=="PortfolioType" || column.key=="Priority" || column.key=="PercentComplete" || column.key=="TeamUsers" || column.key=="DocumentName" || column.key=="DocumentLink" || column.key=="FolderName" || column.key=="FolderLink" || column.key=="ComponentId" || column.key=="Title" || column.key=="ServiceId") {
            this._onColumnContextMenu(column,event);
            return;
        }
        const columns = this.state.columns;
        let sortedItems  = this.state.sortedItems
        let isSortedDescending = column.isSortedDescending;
    
        // If we've sorted this column, flip it.
        if (column.isSorted) {
          isSortedDescending = !isSortedDescending;
        }
    
        // Sort the items.
        sortedItems = _copyAndSort(sortedItems, column.fieldName!, isSortedDescending);
    
        // Reset the items and columns to match the state.

        this.setState({
            sortedItems: sortedItems,
            columns: columns.map((col: IColumn) => {
                col.isSorted = col.key === column.key;
        
                if (col.isSorted) {
                  col.isSortedDescending = isSortedDescending;
                }
        
                return col;
            })
        });        
    };

    private _onSortColumn(column: IColumn, isSortedDescending: boolean) {

        column = _.find(this.state.columns, c => c.fieldName === column.fieldName);
        column.isSortedDescending = isSortedDescending;
        column.isSorted = true;
    
        //reset the other columns
        let modifeidColumns: IColumn[] = this.state.columns;
        _.map(modifeidColumns, (c: IColumn) => {
          if (c.fieldName != column.fieldName) {
            c.isSorted = false;
            c.isSortedDescending = false;
          }
        });
    
        let modifiedItems: any = this.state.sortedItems;
    
        modifiedItems = _.orderBy(
            modifiedItems,
          [(modifiedItem) => {
            console.log(modifiedItem[column.fieldName]);
            console.log(typeof (modifiedItem[column.fieldName]));
    
            if (column.data == Number) {
              if (modifiedItem[column.fieldName]) {
                return parseInt(modifiedItem[column.fieldName]);
              }
              return 0;
            }
            if (column.data == Date) {
              if (modifiedItem[column.fieldName]) {
    
                return new Date(modifiedItem[column.fieldName]);
              }
              return new Date(0);
            }
    
            return modifiedItem[column.fieldName];
          }],
          [column.isSortedDescending ? "desc" : "asc"]);
    
        this.setState({
          sortedItems: modifiedItems,
          columns: modifeidColumns
        });

        this.props.OnFilter(true);
      }

    private _onColumnContextMenu(column: IColumn, ev: React.MouseEvent<HTMLElement>) {
        debugger;
        if (column.columnActionsMode !== ColumnActionsMode.disabled) {
            this.setState({
              contextualMenuProps: this._getContextualMenuProps(ev, column)
            });
          }
    }

    private _getContextualMenuProps(ev: React.MouseEvent<HTMLElement>, column: IColumn) {
        debugger;
        let utility = new Utils();
        
        let items: IContextualMenuItem[] = utility.GetSortingMenuItems(column, this._onSortColumn);
        if(true) {
            items.push({
                key: "filterBy",
                text: "Filter By",
                subMenuProps: {
                    items: this.getFilterValues(column)
                }
            });
        }
        return {
            items: items,
            target: ev.currentTarget as HTMLElement,
            directionalHint: DirectionalHint.bottomLeftEdge,
            gapSpace: 10,
            isBeakVisible: true,
            onDismiss: this._onContextualMenuDismissed
        };
    }

    private _onContextualMenuDismissed() {
        this.setState({
            contextualMenuProps: null
        });
    }

    private getFilterValues(column: IColumn): IContextualMenuItem[] {        
        debugger;
        let utility = new Utils();
        let filters = utility.GetFilterValues(column, this.state.sortedItems, this.ClickFilter);
        return filters;
    }

    public ClickFilter(ev?: React.MouseEvent<HTMLElement>, item?: IContextualMenuItem): void {
        debugger;
        if (item) {
            let columns = this.state.columns;
    
            columns.filter(matchColumn => matchColumn.key === item.data)
            .forEach((filteredColumn: IColumn) => {
              filteredColumn.isFiltered = true;
            });
    
            let modifiedItems = this.state.sortedItems;
            let newModifiedItems = [];
            if(item.data == "Modified" || item.data == "Created") {
                newModifiedItems = modifiedItems.filter(modifiedItem => modifiedItem[item.data]["Date"] === item.key);
            }
            else if(item.data == "TeamUsers") {
                newModifiedItems = modifiedItems.filter(modifiedItem => {
                    return    (
                        modifiedItem[item.data]["AssignedUsers"].map((i: { UserName: string; })=>i.UserName).indexOf(item.key)>-1 
                        || modifiedItem[item.data]["ResponsibleTeam"].map((i: { UserName: string; })=>i.UserName).indexOf(item.key)>-1 
                        || modifiedItem[item.data]["TeamMembers"].map((i: { UserName: string; })=>i.UserName).indexOf(item.key)>-1
                    )
            });
            }
            else if (item.data != "Tags") {
                newModifiedItems = modifiedItems.filter(modifiedItem => modifiedItem[item.data] === item.key);
            }
            else {
                for (let i = 0; i < modifiedItems.length; i++) {
                    let itemValue: string = modifiedItems[i][item.data];
                    if (itemValue.indexOf(item.key) > -1) {
                        newModifiedItems.push(modifiedItems[i]);
                    }
                }    
            }
            this.setState({
                sortedItems: newModifiedItems
            });
            this.props.OnFilter(true);
        }
    }

    private _onResetFiltersClicked() {

        let columns = this.state.columns;
        //reset the columns
        _.map(columns, (c: IColumn) => {
    
          c.isSorted = false;
          c.isSortedDescending = false;
          c.isFiltered = false;
    
        });
        //update the state, this will force the control to refresh
        this.setState({
          sortedItems: this.state.sortedItems,
          //showResetFilters: false,
          columns: columns
        });
    
      }

    render() {
        const elemContextualMenu = (this.state.contextualMenuProps && <ContextualMenu {...this.state.contextualMenuProps} />)
        return (
            <div className={styles.dataList}>
                    <DetailsList
                        items = {this.state.sortedItems}
                        setKey = "set"
                        columns = {this.state.columns}
                        compact = {true}
                        layoutMode = {DetailsListLayoutMode.justified}
                        constrainMode = {ConstrainMode.unconstrained}
                        isHeaderVisible = {true}
                        selectionMode = {SelectionMode.none} 
                    />
                { elemContextualMenu }
                {this.state.isOpenEditPopup ? <EditTaskPopup Items={this.state.DataItem} Call={() => { this.CallBack() }} /> : ''}           
            </div>
        );
    }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
    const key = columnKey as keyof T;
    return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}

export default ListLastModifiedItems;