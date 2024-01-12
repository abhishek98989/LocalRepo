import * as React from 'react';
import PageLoader from '../../../globalComponents/pageLoader';
import "bootstrap/dist/css/bootstrap.min.css"; import { Button, Table, Row, Col, Pagination, PaginationLink, PaginationItem, Input } from "reactstrap";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaCaretDown, FaCaretRight, FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import {
    ColumnDef,
} from "@tanstack/react-table";
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import { FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaInfoCircle, FaChevronRight, FaChevronDown } from 'react-icons/fa';
import GlobalCommanTable, { IndeterminateCheckbox } from "../../../globalComponents/GroupByReactTableComponents/GlobalCommanTable";
import HighlightableCell from "../../../globalComponents/GroupByReactTableComponents/highlight";
import { Web } from "sp-pnp-js";
import { SPFI, spfi, SPFx as spSPFx } from "@pnp/sp";
import * as Moment from 'moment';
import AddProject from './AddProject'
import EditProjectPopup from './EditProjectPopup';
import InlineEditingcolumns from './inlineEditingcolumns';
import * as globalCommon from "../../../globalComponents/globalCommon";
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import ShowTeamMembers from '../../../globalComponents/ShowTeamMember';
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import InfoIconsToolTip from '../../../globalComponents/InfoIconsToolTip/InfoIconsToolTip';
var siteConfig: any = []
var AllTaskUsers: any = [];
let MyAllData: any = []
var Idd: number;
var allSitesTasks: any = [];
let timeSheetConfig: any = {};
var AllListId: any = {};
var currentUserId: '';
var currentUser: any = [];
let headerOptions: any = {
    openTab: true,
    teamsIcon: true
}
let AllSitesAllTasks: any = [];
let AllLeaves: any = [];
var isShowTimeEntry: any = "";
var isShowSiteCompostion: any = "";
export default function ProjectOverview(props: any) {
    const [TableProperty, setTableProperty] = React.useState([]);
    const [openTimeEntryPopup, setOpenTimeEntryPopup] = React.useState(false);
    const [currentUserData, setCurrentUserData]: any = React.useState({});
    const [onLeaveEmployees, setOnLeaveEmployees] = React.useState([]);
    const [CheckBoxData, setCheckBoxData] = React.useState([]);
    const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
    const [checkData, setcheckData] = React.useState([])
    const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false);
    const [isAddStructureOpen, setIsAddStructureOpen] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [categoryGroup, setCategoryGroup] = React.useState([]);
    const [data, setData] = React.useState([]);
    const [flatData, setFlatData] = React.useState([]);
    const [AllTasks, setAllTasks]: any = React.useState([]);
    const [topCompoIcon, setTopCompoIcon]: any = React.useState(false);
    const [passdata, setpassdata] = React.useState("");
    const [selectedView, setSelectedView] = React.useState("Projects");
    const [AllSiteTasks, setAllSiteTasks]: any = React.useState([]);
    const [pageLoaderActive, setPageLoader] = React.useState(false)
    const [taskTimeDetails, setTaskTimeDetails] = React.useState([]);
    const childRef = React.useRef<any>();

    React.useEffect(() => {
        try {
            $("#spPageCanvasContent").removeClass();
            $("#spPageCanvasContent").addClass("hundred");
            $("#workbenchPageContent").removeClass();
            $("#workbenchPageContent").addClass("hundred");
            isShowTimeEntry = props?.props?.TimeEntry != "" ? JSON.parse(props?.props?.TimeEntry) : "";
            isShowSiteCompostion = props?.props?.SiteCompostion != "" ? JSON.parse(props?.props?.SiteCompostion) : ""
            const params = new URLSearchParams(window.location.search);
            let query = params.get("SelectedView");
            if (query == 'ProjectsTask') {
                setSelectedView('grouped')
            }
            if (query == 'TodaysTask') {
                setSelectedView('flat')
            }
        } catch (error: any) {
            console.log(error)
        }
        AllListId = {
            MasterTaskListID: props?.props?.MasterTaskListID,
            TaskUsertListID: props?.props?.TaskUsertListID,
            SmartMetadataListID: props?.props?.SmartMetadataListID,
            //SiteTaskListID:this.props?.props?.SiteTaskListID,
            TaskTimeSheetListID: props?.props?.TaskTimeSheetListID,
            DocumentsListID: props?.props?.DocumentsListID,
            SmartInformationListID: props?.props?.SmartInformationListID,
            AdminConfigrationListID: props?.props?.AdminConfigrationListID,
            siteUrl: props?.props?.siteUrl,
            isShowTimeEntry: isShowTimeEntry,
            isShowSiteCompostion: isShowSiteCompostion,
            SmalsusLeaveCalendar: props?.props?.SmalsusLeaveCalendar,
            TaskTypeID: props?.props?.TaskTypeID
        }
        TaskUser()
        loadTodaysLeave();
        setPageLoader(true);
        LoadAllSiteAllTasks()

        GetMetaData()

    }, [])
    const TimeEntryCallBack = React.useCallback((item1) => {
        setOpenTimeEntryPopup(false);
    }, []);
    const EditDataTimeEntry = (e: any, item: any) => {

        setTaskTimeDetails(item);
        setOpenTimeEntryPopup(true);
    };

    const Call = React.useCallback((item1) => {
        GetMasterData();
        setIsComponent(false);
        showProgressHide();
    }, []);
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }

    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    const TaskUser = async () => {
        if (AllListId?.TaskUsertListID != undefined) {
            let web = new Web(AllListId?.siteUrl);
            let taskUser = [];
            taskUser = await web.lists
                .getById(AllListId?.TaskUsertListID)
                .items
                .select("Id,UserGroupId,Suffix,Title,technicalGroup,Email,SortOrder,Role,IsShowTeamLeader,Company,ParentID1,Status,Item_x0020_Cover,AssingedToUserId,isDeleted,AssingedToUser/Title,AssingedToUser/Id,AssingedToUser/EMail,UserGroup/Id,ItemType,Approver/Id,Approver/Title,Approver/Name")
                .top(5000)
                .expand("AssingedToUser,Approver, UserGroup")
                .get();
            setAllTaskUser(taskUser);
            try {
                currentUserId = props?.props?.pageContext?.legacyPageContext?.userId
                taskUser?.map((item: any) => {
                    if (currentUserId == item?.AssingedToUser?.Id) {
                        currentUser = item;
                        setCurrentUserData(item);
                    }
                })
            } catch (error) {
                console.log(error)
            }

            AllTaskUsers = taskUser;
        } else {
            alert('Task User List Id not available')
        }
        // console.log("all task user =====", taskUser)
    }

    const editTaskCallBack = React.useCallback((item: any) => {
        setisOpenEditPopup(false);
    }, []);
    const loadAllComponent = async () => {
        MyAllData = [];
        let web = new Web(AllListId?.siteUrl);
        MyAllData = await web.lists
            .getById(AllListId?.MasterTaskListID)
            .items.select("ComponentCategory/Id", "ComponentCategory/Title", "DueDate", "SiteCompositionSettings", "PortfolioStructureID", "ItemRank", "ShortDescriptionVerified", "Portfolio_x0020_Type", "BackgroundVerified", "descriptionVerified", "Synonyms", "BasicImageInfo", "DeliverableSynonyms", "OffshoreComments", "OffshoreImageUrl", "HelpInformationVerified", "IdeaVerified", "TechnicalExplanationsVerified", "Deliverables", "DeliverablesVerified", "ValueAddedVerified", "CompletedDate", "Idea", "ValueAdded", "TechnicalExplanations", "Item_x0020_Type", "Sitestagging", "Package", "Parent/Id", "Parent/Title", "Short_x0020_Description_x0020_On", "Short_x0020_Description_x0020__x", "Short_x0020_description_x0020__x0", "AdminNotes", "AdminStatus", "Background", "Help_x0020_Information", "TaskCategories/Id", "TaskCategories/Title", "PriorityRank", "Reference_x0020_Item_x0020_Json", "TeamMembers/Title", "TeamMembers/Name", "TeamMembers/Id", "Item_x002d_Image", "ComponentLink", "IsTodaysTask", "AssignedTo/Title", "AssignedTo/Name", "AssignedTo/Id", "AttachmentFiles/FileName", "FileLeafRef", "FeedBack", "Title", "Id", "PercentComplete", "Company", "StartDate", "DueDate", "Comments", "Categories", "Status", "WebpartId", "Body", "Mileage", "PercentComplete", "Attachments", "Priority", "Created", "Modified", "Author/Id", "Author/Title", "Editor/Id", "Editor/Title", "ClientCategory/Id", "ClientCategory/Title")
            .expand("ClientCategory", "ComponentCategory", "AssignedTo", "AttachmentFiles", "Author", "Editor", "TeamMembers", "TaskCategories", "Parent")
            .top(4999)
            .get()


    }
    const LoadAllSiteAllTasks = async function () {
        await loadAllComponent()
        let AllSiteTasks: any = [];
        let query =
            "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        let web = new Web(AllListId?.siteUrl);
        let arraycount = 0;
        try {
            if (siteConfig?.length > 0) {

                siteConfig.map(async (config: any) => {
                    if (config.Title != "SDC Sites") {
                        let smartmeta = [];
                        await web.lists
                            .getById(config.listId)
                            .items.select("ID", "Title", "ClientCategory/Id", "ClientCategory/Title", 'ClientCategory', "Comments", "DueDate", "ClientActivityJson", "EstimatedTime", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Body", "PriorityRank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Portfolio/Id", "Portfolio/Title", "Modified")
                            .expand("TeamMembers", "Approver", "ParentTask", "ClientCategory", "AssignedTo", "TaskCategories", "Author", "ResponsibleTeam", "TaskType", "Portfolio")
                            .getAll().then((data: any) => {
                                smartmeta = data;
                                smartmeta.map((task: any) => {
                                    task.AllTeamMember = [];
                                    task.HierarchyData = [];
                                    task.siteType = config.Title;
                                    task.bodys = task.Body != null && task.Body.split('<p><br></p>').join('');
                                    task.listId = config.listId;
                                    task.siteUrl = config.siteUrl.Url;
                                    task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
                                    task.DisplayDueDate =
                                        task.DueDate != null
                                            ? Moment(task.DueDate).format("DD/MM/YYYY")
                                            : "";
                                    task.portfolio = {};
                                    if (task?.Portfolio?.Id != undefined) {
                                        task.portfolio = task?.Portfolio;
                                        task.PortfolioTitle = task?.Portfolio?.Title;
                                        //task["Portfoliotype"] = "Component";
                                    }

                                    task["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                                    task.TeamMembersSearch = "";
                                    task.TaskID = globalCommon.getTaskId(task);


                                    AllSiteTasks.push(task)
                                });
                                arraycount++;
                            });
                        let currentCount = siteConfig?.length;
                        if (arraycount === currentCount) {
                            AllSitesAllTasks = AllSiteTasks;

                        }
                    } else {
                        arraycount++;
                    }
                });
            }
        } catch (e) {
            console.log(e)
        }
    };
    const GetMetaData = async () => {
        if (AllListId?.SmartMetadataListID != undefined) {
            try {
                let web = new Web(AllListId?.siteUrl);
                let smartmeta = [];
                let TaxonomyItems = [];
                smartmeta = await web.lists
                    .getById(AllListId?.SmartMetadataListID)
                    .items.select("Id", "IsVisible", "ParentID", "Title", "SmartSuggestions", "Configurations", "Description", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                    .top(5000)
                    .expand("Parent")
                    .get();
                if (smartmeta.length > 0) {
                    smartmeta?.map((site: any) => {
                        if (site?.Title != "Master Tasks" && site?.Title != "SDC Sites" && site?.TaxType == 'Sites') {
                            siteConfig.push(site)
                        }
                        if (site?.TaxType == 'timesheetListConfigrations') {
                            timeSheetConfig = site;
                        }
                    })
                } else {
                    siteConfig = smartmeta;
                }
                LoadAllSiteTasks();
            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Smart Metadata List Id not present')
            siteConfig = [];
        }
    };
    const findUserByName = (name: any) => {
        const user = AllTaskUsers.filter(
            (user: any) => user?.AssingedToUser?.Id === name
        );
        let Image: any;
        if (user[0]?.Item_x0020_Cover != undefined) {
            Image = user[0].Item_x0020_Cover.Url;
        } else {
            Image =
                "https://hhhhteams.sharepoint.com/sites/HHHH/PublishingImages/Portraits/icon_user.jpg";
        }
        return user ? Image : null;
    };



    const callChildFunction = (items: any) => {
        if (childRef.current) {
            childRef.current.callChildFunction(items);
        }
    };


    const projectTopIcon = (items: any) => {
        if (childRef.current) {
            childRef.current.projectTopIcon(items);
        }
    };

    const columns = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: false,
                hasCustomExpanded: false,
                hasExpanded: false,
                size: 1,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                id: 'TaskID',
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,
                cell: ({ row }) => (
                    <div>
                        <>
                            {row?.original?.siteType != "Project" ? <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} /> : <span>{row?.original?.TaskID}</span>}
                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <span>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </span> : row?.original?.Item_x0020_Type == "Sprint"  ?
                            <div title={row?.original?.Item_x0020_Type}  style={{ backgroundColor: '#000066' }} className={"Dyicons me-1"}>
                            X
                          </div>:''
                    }</>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <div className='alignCenter'>
                        {row?.original?.siteType === "Project" ? <>
                            <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a>
                            {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.Body} row={row?.original} /></span>}
                        </> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <>
                            <a className='hreflink'
                                href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>
                            {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /></span>}


                        </> : ''}

                    </div>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (

                    <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />


                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PercentComplete == filterValue
                },
                resetSorting: false,
                size: 55,
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (

                    <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />


                ),
                id: 'PriorityRank',
                placeholder: "Priority",
                isColumnDefultSortingDesc: true,
                resetColumnFilters: false,
                sortDescFirst: true,
                resetSorting: false,
                header: "",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PriorityRank == filterValue
                },
                size: 100,
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <div >
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUsers} pageName={'ProjectOverView'} />
                    </div>


                ),
                id: 'TeamMembersSearch',
                placeholder: "Team",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 155,
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName="DueDate"
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                    />
                ),
                id: 'DisplayDueDate',
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.DisplayDueDate?.includes(filterValue)
                },
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.Item_x0020_Type === "tasks" ?
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={CallBack}
                                columnName="EstimatedTime"
                                item={row?.original}
                                TaskUsers={AllTaskUsers} /> : ''
                    }</>
                ),
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.TaskCategories,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.TaskCategories && row?.original?.TaskCategories.length > 0
                            ? row?.original?.TaskCategories.map((category: any, index: any) => (
                                <div key={index}>{category.Title}</div>
                            ))
                            : ''}
                    </span>
                ),
                id: 'TaskCategories',
                placeholder: "Task Categories",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 100
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 125
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
          
            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <>
                            <span onClick={(e) => EditDataTimeEntry(e, row.original)}
                                className="svg__iconbox svg__icon--clock"
                                title="Click To Edit Timesheet"  ></span>
                            <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span>
                        </> : ''}
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 50,
            }
        ],
        [data]
    );
    const groupedUsers = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                size: 55,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                id: 'TaskID',
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,
                cell: ({ row, getValue }) => (
                    <div>
                        <>
                            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} />

                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <span>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </span> : ''
                    }</>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <div className='alignCenter'>
                        {row?.original?.type == 'Category' && row?.original?.Title != undefined ? row?.original?.Title : ''}
                        {row?.original?.Item_x0020_Type == "tasks" ?
                            <span>
                                <a className='hreflink'
                                    href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                    data-interception="off"
                                    target="_blank"
                                >
                                    {row?.original?.Title}
                                </a>
                                {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /></span>}
                            </span> : ''}
                    </div>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.ProjectTitle,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != undefined ? <span>
                            <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Project?.Id}`} data-interception="off" target="_blank">
                                {row?.original?.ProjectTitle}
                            </a>


                        </span> : ''}
                    </>

                ),
                id: "Project Title",
                placeholder: "Project Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.ProjectPriority,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.ProjectPriority != 0 ? row?.original?.ProjectPriority : ''}
                    </span>
                ),
                id: 'projectPriority_x0020_Rank',
                placeholder: "Project Priority",
                resetColumnFilters: false,
                enableMultiSort: true,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.ProjectPriority == filterValue
                },
                isColumnDefultSortingDesc: true,
                resetSorting: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>

                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PercentComplete == filterValue
                },
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />

                    </span>
                ),
                id: 'PriorityRank',
                placeholder: "Priority",
                resetColumnFilters: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PriorityRank == filterValue
                },
                isColumnDefultSortingDesc: true,
                enableMultiSort: true,
                header: "",
                size: 100,
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUsers} pageName={'ProjectOverView'} />
                        {/* <ShowTaskTeamMembers  props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers> */}
                    </span>
                ),
                id: 'TeamMembersSearch',
                placeholder: "Team",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 155,
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName="DueDate"
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                    />
                ),
                id: 'DisplayDueDate',
                placeholder: "Due Date",
                header: "",
                resetColumnFilters: false,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.DisplayDueDate?.includes(filterValue)
                },
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.Item_x0020_Type === "tasks" ?
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={CallBack}
                                columnName="EstimatedTime"
                                item={row?.original}
                                TaskUsers={AllTaskUser} /> : ''
                    }</>
                ),
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.TaskCategories,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.TaskCategories && row?.original?.TaskCategories.length > 0
                            ? row?.original?.TaskCategories.map((category: any, index: any) => (
                                <div key={index}>{category.Title}</div>
                            ))
                            : ''}
                    </span>
                ),
                id: 'TaskCategories',
                placeholder: "Task Categories",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 100
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 125
            },
            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span> : ''}
                        {row?.original?.Item_x0020_Type === "tasks" ? <>
                            <span onClick={(e) => EditDataTimeEntry(e, row.original)}
                                className="svg__iconbox svg__icon--clock"
                                title="Click To Edit Timesheet"  ></span>
                            <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span>
                        </> : ''}
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 50,
            }
        ],
        [data]
    );

    function IndeterminateCheckbox({
        indeterminate,
        className = "",
        ...rest
    }: { indeterminate?: boolean } & React.HTMLProps<HTMLInputElement>) {
        const ref = React.useRef<HTMLInputElement>(null!);
        React.useEffect(() => {
            if (typeof indeterminate === "boolean") {
                ref.current.indeterminate = !rest.checked && indeterminate;
            }
        }, [ref, indeterminate]);
        return (
            <input
                type="checkbox"
                ref={ref}
                className={className + "  cursor-pointer form-check-input rounded-0"}
                {...rest}
            />
        );
    }

    const column2 = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                hasCustomExpanded: true,
                hasExpanded: true,
                size: 20,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                id: 'TaskID',
                resetColumnFilters: false,
                resetSorting: false,
                size: 80,
                cell: ({ row }) => (
                    <>
                        <span className='ms-1'>{row?.original?.TaskID}</span>


                    </>
                ),
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <div className='alignCenter'>
                        <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Id}`} data-interception="off" target="_blank">{row?.original?.Title}</a>
                        {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5'><InfoIconsToolTip Discription={row?.original?.Body} row={row?.original} /></span>}
                    </div>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                Cell: ({ row }: any) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>
                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetSorting: false,
                resetColumnFilters: false,
                size: 55,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PercentComplete == filterValue
                },
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectManagment'} />

                    </span>
                ),
                id: "PriorityRank",
                placeholder: "Priority",
                resetColumnFilters: false,
                size: 100,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PriorityRank == filterValue
                },
                isColumnDefultSortingDesc: true,
                resetSorting: false,
                header: ""
            },
            {
                accessorFn: (row) => row?.TeamMembers?.map((elem: any) => elem.Title).join('-'),
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns
                            AllListId={AllListId}
                            callBack={CallBack}
                            columnName='Team'
                            item={row?.original}
                            TaskUsers={AllTaskUsers}
                            pageName={'ProjectManagment'}
                        />
                    </span>
                ),
                id: 'TeamMembers',
                canSort: false,
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "TeamMembers",
                header: "",
                size: 152,
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName='DueDate'
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                        pageName={'ProjectManagment'}
                    />
                ),
                id: 'DueDate',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Due Date",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.DisplayDueDate?.includes(filterValue)
                },
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.TaskCategories,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.TaskCategories && row?.original?.TaskCategories.length > 0
                            ? row?.original?.TaskCategories.map((category: any, index: any) => (
                                <div key={index}>{category.Title}</div>
                            ))
                            : ''}
                    </span>
                ),
                id: 'TaskCategories',
                placeholder: "Task Categories",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 100
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 125
            },
            {
                header: ({ table }: any) => (
                    <>{
                        topCompoIcon ?
                            <span style={{ backgroundColor: `${''}` }} title="Restructure" className="Dyicons mb-1 mx-1 p-1" onClick={() => projectTopIcon(true)}>
                                <span className="svg__iconbox svg__icon--re-structure"></span>
                            </span>
                            : ''
                    }
                    </>
                ),
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.isRestructureActive && row?.original?.Title != "Others" && (
                            <span className="Dyicons p-1" title="Restructure" style={{ backgroundColor: `${row?.original?.PortfolioType?.Color}` }} onClick={() => callChildFunction(row?.original)}>
                                <span className="svg__iconbox svg__icon--re-structure"> </span>
                            </span>
                        )}
                        {getValue()}
                    </>
                ),
                id: "row?.original.Id",
                canSort: false,
                placeholder: "",
                size: 1,
            },
            {

                cell: ({ row }) => (
                    <>
                        {row?.original?.siteType === "Project" ? <span title="Edit Project" onClick={(e) => EditComponentPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span> : ''}

                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 35,
            }
        ],
        [data]
    );

    const flatView = React.useMemo<ColumnDef<any, unknown>[]>(
        () => [
            {
                accessorKey: "",
                placeholder: "",
                hasCheckbox: true,
                size: 20,
                id: 'Id',
            },
            {
                accessorKey: "TaskID",
                placeholder: "Id",
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
                cell: ({ row }) => (
                    <div>
                        <>
                            <ReactPopperTooltipSingleLevel ShareWebId={row?.original?.TaskID} row={row?.original} singleLevel={true} masterTaskData={MyAllData} AllSitesTaskData={AllSitesAllTasks} />
                        </>
                    </div>
                ),
            },
            {
                accessorFn: (row) => row?.siteType,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.siteType !== "Master Tasks" ?
                            <span>
                                {row?.original?.SiteIcon != undefined ?
                                    <img title={row?.original?.siteType} className="workmember" src={row?.original?.SiteIcon} /> : ''}
                            </span> : ''
                    }</>
                ),
                id: "siteType",
                placeholder: "Site",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.Title,
                cell: ({ row, getValue }) => (
                    <div className='alignCenter'>
                        <span>
                            <a className='hreflink'
                                href={`${AllListId?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${row?.original?.Id}&Site=${row?.original?.siteType}`}
                                data-interception="off"
                                target="_blank"
                            >
                                {row?.original?.Title}
                            </a>
                            {row?.original?.descriptionsSearch?.length > 0 && <span className='alignIcon  mt--5 '><InfoIconsToolTip Discription={row?.original?.bodys} row={row?.original} /></span>}

                        </span>
                    </div>

                ),
                id: "Title",
                placeholder: "Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorFn: (row) => row?.ProjectTitle,
                cell: ({ row, getValue }) => (
                    <>
                        {row?.original?.ProjectTitle != undefined ? <span>
                            <a className='hreflink' href={`${AllListId?.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${row?.original?.Project?.Id}`} data-interception="off" target="_blank">
                                {row?.original?.ProjectTitle}
                            </a>


                        </span> : ''}
                    </>

                ),
                id: "Project Title",
                placeholder: "Project Title",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
            },
            {
                accessorKey: "descriptionsSearch",
                placeholder: "descriptionsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "descriptionsSearch",
            },
            {
                accessorKey: "commentsSearch",
                placeholder: "commentsSearch",
                header: "",
                resetColumnFilters: false,
                size: 100,
                id: "commentsSearch",
            },
            {
                accessorFn: (row) => row?.ProjectPriority,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.ProjectPriority != 0 ? row?.original?.ProjectPriority : ''}
                    </span>
                ),
                id: 'projectPriority_x0020_Rank',
                placeholder: "Project Priority",
                resetColumnFilters: false,
                enableMultiSort: true,
                isColumnDefultSortingDesc: true,
                resetSorting: false,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.PercentComplete,
                cell: ({ row, getValue }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='PercentComplete' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />
                    </span>

                ),
                id: "PercentComplete",
                placeholder: "% Complete",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 55,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PercentComplete == filterValue
                },
            },
            {
                accessorFn: (row) => row?.PriorityRank,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Priority' TaskUsers={AllTaskUser} item={row?.original} pageName={'ProjectOverView'} />

                    </span>
                ),
                id: 'PriorityRank',
                placeholder: "Priority",
                resetColumnFilters: false,
                resetSorting: false,
                isColumnDefultSortingDesc: true,
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.PriorityRank == filterValue
                },
                sortDescFirst: true,
                header: "",
                size: 100,
            },
            {
                accessorFn: (row) => row?.TeamMembersSearch,
                cell: ({ row }) => (
                    <span>
                        <InlineEditingcolumns AllListId={AllListId} callBack={CallBack} columnName='Team' item={row?.original} TaskUsers={AllTaskUsers} pageName={'ProjectOverView'} />
                        {/* <ShowTaskTeamMembers  props={row?.original} TaskUsers={AllTaskUser}></ShowTaskTeamMembers> */}
                    </span>
                ),
                id: 'TeamMembersSearch',
                placeholder: "Team",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 155,
            },
            {
                accessorFn: (row) => row?.DueDate,
                cell: ({ row }) => (
                    <InlineEditingcolumns
                        AllListId={AllListId}
                        callBack={CallBack}
                        columnName="DueDate"
                        item={row?.original}
                        TaskUsers={AllTaskUser}
                    />
                ),
                id: 'DisplayDueDate',
                placeholder: "Due Date",
                header: "",
                filterFn: (row: any, columnId: any, filterValue: any) => {
                    return row?.original?.DisplayDueDate?.includes(filterValue)
                },
                resetColumnFilters: false,
                resetSorting: false,
                size: 100,
            },
            {
                accessorFn: (row) => row?.EstimatedTime,
                cell: ({ row, getValue }) => (
                    <>{
                        row?.original?.Item_x0020_Type === "tasks" ?
                            <InlineEditingcolumns
                                AllListId={AllListId}
                                callBack={CallBack}
                                columnName="EstimatedTime"
                                item={row?.original}
                                TaskUsers={AllTaskUser} /> : ''
                    }</>
                ),
                id: "EstimatedTime",
                placeholder: "Estimated Time",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 60,
            },
            {
                accessorFn: (row) => row?.TaskCategories,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.TaskCategories && row?.original?.TaskCategories.length > 0
                            ? row?.original?.TaskCategories.map((category: any, index: any) => (
                                <div key={index}>{category.Title}</div>
                            ))
                            : ''}
                    </span>
                ),
                id: 'TaskCategories',
                placeholder: "Task Categories",
                resetColumnFilters: false,
                resetSorting: false,
                header: "",
                size: 100
            },
            {
                accessorFn: (row) => row?.Created,
                cell: ({ row }) => (
                    <span>
                        {row?.original?.Created == null ? (
                            ""
                        ) : (
                            <>
                                <span className='ms-1'>{row?.original?.DisplayCreateDate} </span>

                                {row?.original?.Author != undefined ? (
                                    <>
                                        <a
                                            href={`${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${row?.original?.Author?.Id}&Name=${row?.original?.Author?.Title}`}
                                            target="_blank"
                                            data-interception="off"
                                        >
                                            <img title={row?.original?.Author?.Title} className="workmember ms-1" src={findUserByName(row?.original?.Author?.Id)} />
                                        </a>
                                    </>
                                ) : (
                                    <span className='svg__iconbox svg__icon--defaultUser grey' title={row?.original?.Author?.Title}></span>
                                )}
                            </>
                        )}
                    </span>
                ),
                id: 'Created',
                resetColumnFilters: false,
                resetSorting: false,
                placeholder: "Created",
                filterFn: (row: any, columnName: any, filterValue: any) => {
                    if (row?.original?.Author?.Title?.toLowerCase()?.includes(filterValue?.toLowerCase()) || row?.original?.DisplayCreateDate?.includes(filterValue)) {
                        return true
                    } else {
                        return false
                    }
                },
                header: "",
                size: 125
            },
            {
                cell: ({ row }) => (
                    <>
                        <span onClick={(e) => EditDataTimeEntry(e, row.original)}
                            className="svg__iconbox svg__icon--clock"
                            title="Click To Edit Timesheet"  ></span>
                        <span title="Edit Task" onClick={(e) => EditPopup(row?.original)} className="alignIcon svg__iconbox svg__icon--edit hreflink" ></span>
                    </>
                ),
                id: 'Id',
                canSort: false,
                placeholder: "",
                header: "",
                resetColumnFilters: false,
                resetSorting: false,
                size: 50,
            }
        ],
        [data]
    );

    const sendAllWorkingTodayTasks = async () => {
        setPageLoader(true);
        let AllTimeEntries: any = [];
        if (timeSheetConfig?.Id != undefined) {
            AllTimeEntries = await globalCommon.loadAllTimeEntry(timeSheetConfig);
        }


        let to: any = ["ranu.trivedi@hochhuth-consulting.de", "prashant.kumar@hochhuth-consulting.de", "abhishek.tiwari@hochhuth-consulting.de", "deepak@hochhuth-consulting.de"];
        //let to: any = ["abhishek.tiwari@hochhuth-consulting.de", "ranu.trivedi@hochhuth-consulting.de"];
        let finalBody: any = [];
        let userApprover = '';
        let groupedData = data;
        let body: any = '';
        let confirmation = confirm("Are you sure you want to share the working today task of all team members?")
        if (confirmation) {
            var subject = "Today's Working Tasks Under Projects";
            const GroupedPromises = await groupedData?.map(async (group: any) => {

                let projectLeaderTitle = '';
                let projectLeaderId: any = '';

                if (group?.ResponsibleTeam?.lemgth > 0) {
                    projectLeaderTitle = group?.ResponsibleTeam[0]?.Title
                    projectLeaderId = group?.ResponsibleTeam[0]?.Id
                }
                let tasksCopy: any = [];
                let text = '';
                tasksCopy = group?.subRows
                if (tasksCopy?.length > 0) {
                    let taskCount = 0;

                    tasksCopy?.map(async (item: any) => {
                        try {

                            item.smartTime = 0;

                            let EstimatedDesc: any = []

                            item.showDesc = '';
                            try {
                                AllTimeEntries?.map((entry: any) => {
                                    if (entry[`Task${item?.siteType}`] != undefined && entry[`Task${item?.siteType}`].Id == item.Id) {
                                        let AdditionalTimeEntry = JSON.parse(entry?.AdditionalTimeEntry)
                                        AdditionalTimeEntry?.map((time: any) => {
                                            item.smartTime += parseFloat(time?.TaskTime);
                                        })
                                    }
                                })
                                let parser = new DOMParser();
                                let shortDesc = parser.parseFromString(item?.bodys, "text/html");
                                EstimatedDesc = JSON.parse(item?.EstimatedTimeDescription)
                                item?.bodys?.split(' ').map((des: any, index: any) => {
                                    if (index <= 10) {
                                        item.showDesc += ' ' + des;
                                    }
                                })
                            } catch (error) {
                                console.log(error)
                            }

                            let memberOnLeave = false;
                            item?.AssignedTo?.map((user: any) => {
                                memberOnLeave = AllLeaves.some((emp: any) => emp == user?.Id)
                            });
                            if (!memberOnLeave) {
                                taskCount++;
                                let teamUsers: any = [];
                                if (item?.AssignedTo?.length > 0) {
                                    item.AssignedTitle = item?.AssignedTo?.map((elem: any) => elem?.Title).join(" ")
                                } else {
                                    item.AssignedTitle = ''
                                }
                                if (item.DueDate != undefined) {
                                    item.TaskDueDatenew = Moment(item.DueDate).format("DD/MM/YYYY");
                                }
                                if (item.TaskDueDatenew == undefined || item.TaskDueDatenew == '')
                                    item.TaskDueDatenew = '';
                                if (item.Categories == undefined || item.Categories == '')
                                    item.Categories = '';

                                if (item.EstimatedTime == undefined || item.EstimatedTime == '' || item.EstimatedTime == null) {
                                    item.EstimatedTime = ''
                                }
                                let estimatedDescription = ''
                                if (EstimatedDesc?.length > 0) {
                                    EstimatedDesc?.map((time: any, index: any) => {
                                        if (index == 0) {
                                            estimatedDescription += time?.EstimatedTimeDescription
                                        } else {
                                            estimatedDescription += ', ' + time?.EstimatedTimeDescription
                                        }

                                    })
                                }
                                text +=
                                    `<tr>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item?.siteType} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.TaskID} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"><p style="margin:0px; color:#333;"><a style="text-decoration: none;" href =${item?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.Id}&Site=${item?.siteType}> ${item?.Title} </a></p></td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item?.showDesc} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.Categories} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.PercentComplete} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${item.PriorityRank} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px"> ${(item?.AssignedTo?.length > 0 ? item?.AssignedTo?.map((AssignedUser: any) => {
                                        return (
                                            '<p style="margin:0px;">' + '<a style="text-decoration: none;" href =' + AllListId.siteUrl + '/SitePages/UserTimeEntry.aspx?userId=' + AssignedUser?.Id + '><span>' + AssignedUser?.Title + '</span></a>' + '</p>'
                                        )
                                    }) : '')} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item.TaskDueDatenew} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px">${item.smartTime} </td>
                                    <td height="10" align="left" valign="middle" style="border-left: 0px; border-top: 0px; padding: 5px 0px; padding-left:5px; border-right:0px"> ${item.EstimatedTime} </td>
                                    </tr>`
                                    ;
                            }

                        } catch (error) {
                            setPageLoader(false);
                            console.log(error)
                        }
                    })
                    if (taskCount > 0) {
                        body +=
                            `<table cellpadding="0" cellspacing="0" align="center" style="margin-top:10px" width="100%" border="0">
                            <tr>
                            <td width="20%" height="30" align="left" valign="middle"bgcolor="#a2d1ff" style="padding-left:10px;border-bottom: 1px solid #a19f9f;border-right: 1px solid #a19f9f;border-left: 1px solid #a19f9f;color:#000;"><strong>Title</strong></td>
                            <td height="30" colspan="6" bgcolor="#eee" style="padding-left: 10px; color: #eee;border: 1px solid #a19f9f;"><strong><a style="text-decoration: none;" href =${AllListId.siteUrl}/SitePages/Project-Management.aspx?ProjectId=${group?.Id}> ${group?.Title}</a></strong></td>
                            </tr>
                            <tr>
                            <td width="10%" height="30" align="left" valign="middle" bgcolor="#a2d1ff" style="padding-left:10px;border-bottom: 1px solid #a19f9f;border-right: 1px solid #a19f9f;border-left: 1px solid #a19f9f;color:#000;"><strong>Project Priority</strong></td>
                            <td  width="20%" height="30" bgcolor="#eee" style="padding-left:10px;border-bottom: 1px solid #a19f9f;border-right: 1px solid #a19f9f;border-left: 1px solid #a19f9f;">${group?.PriorityRank}</td>
                            <td width="10%" align="left" valign="middle" bgcolor="#a2d1ff" style="padding-left:10px;border-bottom: 1px solid #a19f9f;border-right: 1px solid #a19f9f;border-left: 1px solid #a19f9f;color:#000;"><strong>Due Date</strong></td>
                            <td width="20%" height="30" bgcolor="#eee" style="padding-left:10px;border-bottom: 1px solid #a19f9f;border-right: 1px solid #a19f9f;border-left: 1px solid #a19f9f;"> ${group?.DisplayDueDate} </td>
                            <td width="10%" align="left" valign="middle" bgcolor="#a2d1ff" style="padding-left:10px;border-bottom: 1px solid #a19f9f;border-right: 1px solid #a19f9f;border-left: 1px solid #a19f9f;color:#000;"><strong>Team Leader</strong></td>
                            <td width="20%" height="30" bgcolor="#eee" style="padding-left:10px;border-bottom: 1px solid #a19f9f;border-right: 1px solid #a19f9f;border-left: 1px solid #a19f9f;"><a style="text-decoration: none;" href = ${AllListId?.siteUrl}/SitePages/TaskDashboard.aspx?UserId=${projectLeaderId} >${projectLeaderTitle} </a></td>
                            </tr>
                            <tr><td colspan="4" height="10"></td></tr>
                            </table >
                            <table cellpadding="0" cellspacing="0" align="left" width="100%" border="1" style=" border-color: #444;margin-bottom:10px">
                            <thead>
                            <tr>
                            <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Site</th>
                            <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;x">Task ID</th>
                            <th width="500" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Title</th>
                            <th width="140" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;" >Desc.</th>
                            <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Category</th>
                            <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">% </th>
                            <th width="40" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Priority</th>
                            <th width="130" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Team</th>
                            <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Duedate</th>
                            <th width="80" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px;">Smart Time</th>
                            <th width="70" height="12" align="center" valign="middle" bgcolor="#eeeeee" style="padding:10px 5px;border-top: 0px;border-left: 0px; border-right:0px" >Est</th>
                            </tr>
                            </thead>
                            <tbody>
                            ${text}
                            </tbody>
                            </table>`
                    }
                }




            })
            let sendAllTasks =
                `<span style="font-size: 18px;margin-bottom: 10px;">
                Hi there, <br><br>
                Below is the working today task of all the team members <strong>(Project Wise):</strong>
                <p><a href =${AllListId?.siteUrl}/SitePages/Project-Management-Overview.aspx?SelectedView=ProjectsTask>Click here for flat overview of the today's tasks</a></p>
                </span>
                ${body}
                <h3>
                Thanks.
                </h3>`
            setPageLoader(false);
            SendEmailFinal(to, subject, sendAllTasks);

        }


    }

    const SendEmailFinal = async (to: any, subject: any, body: any) => {
        let sp = spfi().using(spSPFx(props?.props?.Context));
        sp.utility.sendEmail({
            //Body of Email  
            Body: body,
            //Subject of Email  
            Subject: subject,
            //Array of string for To of Email  
            To: to,
            AdditionalHeaders: {
                "content-type": "text/html",
                'Reply-To': 'abhishek.tiwari@smalsus.com'
            },
        }).then(() => {
            console.log("Email Sent!");
            setPageLoader(false);

        }).catch((err) => {
            setPageLoader(false);
            console.log(err.message);
        });



    }


    //Inline Editing Callback
    const inlineEditingCall = (item: any) => {
        // page?.map((tasks: any) => {
        //     if (tasks.Id == item.Id) {
        //         tasks = item;
        //     }
        // })
    }
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true);
        setpassdata(item);
    }, []);
    const generateSortingIndicator = (column: any) => {
        return column.isSorted ? (column.isSortedDesc ? <FaSortDown /> : <FaSortUp />) : (column.showSortIcon ? <FaSort /> : '');
    };

    const EditComponentPopup = (item: any) => {
        item['siteUrl'] = `${props?.props?.siteUrl}`;
        item['siteUrl'] = `${AllListId?.siteUrl}`;
        item['listName'] = 'Master Tasks';
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }

    const GetMasterData = async () => {
        if (AllListId?.MasterTaskListID != undefined) {
            let web = new Web(`${AllListId?.siteUrl}`);
            let taskUsers: any = [];
            let Alltask: any = [];
            // var AllUsers: any = []
            Alltask = await web.lists.getById(AllListId?.MasterTaskListID).items
                .select("Deliverables,TechnicalExplanations,ResponsibleTeam/Id,ResponsibleTeam/Title,PortfolioLevel,PortfolioStructureID,ValueAdded,Categories,Idea,Short_x0020_Description_x0020_On,Background,Help_x0020_Information,Short_x0020_Description_x0020__x,ComponentCategory/Id,ComponentCategory/Title,Comments,HelpDescription,FeedBack,Body,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,AdminNotes,AdminStatus,Background,Help_x0020_Information,TaskCategories/Id,TaskCategories/Title,PriorityRank,Reference_x0020_Item_x0020_Json,TeamMembers/Title,TeamMembers/Name,TeamMembers/Id,Item_x002d_Image,ComponentLink,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title")
                .expand("ComponentCategory,AssignedTo,AttachmentFiles,ResponsibleTeam,Author,Editor,TeamMembers,TaskCategories,Parent")
                .top(4999).filter("(Item_x0020_Type eq 'Project') or (Item_x0020_Type eq 'Sprint')")
                .getAll();

            // if(taskUsers.ItemType=="Project"){
            // taskUsers.map((item: any) => {
            //     if (item.Item_x0020_Type != null && item.Item_x0020_Type == "Project") {
            //         Alltask.push(item)
            //     }

            Alltask.map((items: any) => {
                items.descriptionsSearch = '';
                items.ShowTeamsIcon = false
                items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                items.siteUrl = AllListId?.siteUrl;
                items.listId = AllListId?.MasterTaskListID;
                items.AssignedUser = []
                items.siteType = "Project"
                items.TeamMembersSearch = '';
                if (items.AssignedTo != undefined) {
                    items.AssignedTo.map((taskUser: any) => {
                        AllTaskUsers.map((user: any) => {
                            if (user.AssingedToUserId == taskUser.Id) {
                                if (user?.Title != undefined) {
                                    items.TeamMembersSearch = items.TeamMembersSearch + ' ' + user?.Title
                                }
                            }
                        })
                    })
                }
                items.subRows = Alltask?.filter((child: any) => child?.Item_x0020_Type == "Sprint" && child?.Parent?.Id == items?.Id)
                // items?.subRows?.map((sprint: any) => {
                //     sprint.subRows = allSitesTasks?.filter((child: any) => child?.Project?.Id == sprint?.Id && child?.IsTodaysTask == true)
                // })
                items.descriptionsSearch = globalCommon.portfolioSearchData(items)
                items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
                items['TaskID'] = items?.PortfolioStructureID
                items.DisplayDueDate = items.DueDate != null ? Moment(items.DueDate).format('DD/MM/YYYY') : ""
                items.DisplayCreateDate = items.Created != null ? Moment(items.Created).format("DD/MM/YYYY") : "";
            })
            let AllProject = Alltask?.filter((item: any) => item?.Item_x0020_Type == "Project")

            AllProject = sortOnPriority(AllProject)
            let flatDataProjects = JSON.parse(JSON.stringify(AllProject))
            setFlatData(flatDataProjects);
            AllProject.map((items: any) => {
                items?.subRows?.map((sprint: any) => {
                    sprint.subRows = allSitesTasks?.filter((child: any) => child?.Project?.Id == sprint?.Id && child?.IsTodaysTask == true)
                })
                allSitesTasks?.map((task: any) => {
                    if (task?.IsTodaysTask == true && task?.Project?.Id == items?.Id) {
                        items['subRows'].push(task);
                    }
                })
            })
            // })
            setAllTasks(AllProject);
            setPageLoader(false);
            setData(AllProject);
        } else {
            alert('Master Task List Id Not Available')
        }

    }
    //    Save data in master task list
    const [title, settitle] = React.useState('')
    const tableStyle = {
        display: "block",
        height: "600px",
        overflow: "auto"
    };
    //Just Check 
    // AssignedUser: '',

    // const page = React.useMemo(() => data, [data]);
    const [ShowingAllData, setShowingData] = React.useState([])

    const callBackData = React.useCallback((elem: any, getSelectedRowModel: any, ShowingData: any) => {
        if (elem != undefined) {
            let selectedItem:any=[]
            elem?.map((Project:any)=>{
                selectedItem?.push(Project?.original)
              //  Project = Project?.original
            })
            setCheckBoxData(selectedItem)
            setTableProperty(getSelectedRowModel?.getSelectedRowModel()?.flatRows)
        } else {
            setCheckBoxData([])
            setTableProperty([])
        }
        if (ShowingData != undefined) {
            setShowingData([ShowingData])
        }
    }, []);

    React.useEffect(() => {
        if (CheckBoxData.length > 0) {
            setcheckData(TableProperty)
            setShowTeamMemberOnCheck(true)
        } else {
            setcheckData([])
            setShowTeamMemberOnCheck(false)
        }
    }, [CheckBoxData])

    const ShowTeamFunc = () => {
        setShowTeamPopup(true)
    }

    const showTaskTeamCAllBack = React.useCallback(() => {
        setShowTeamPopup(false)

    }, []);

    const restructureCallback = React.useCallback((getData: any, topCompoIcon: any,callback:any) => {
        setTopCompoIcon(topCompoIcon);
       setData(getData);
       if(callback == true){
        GetMasterData();
       }

    }, []);

    const CallBack = React.useCallback((item:any, type:any) => {
        setIsAddStructureOpen(false)
        if(type=='Save'){
            GetMasterData()
        }
    }, [])


    const LoadAllSiteTasks = function () {
        if (siteConfig?.length > 0) {
            try {
                var AllTask: any = [];
                let web = new Web(AllListId?.siteUrl);
                var arraycount = 0;
                siteConfig.map(async (config: any) => {

                    let smartmeta = [];
                    smartmeta = await web.lists
                        .getById(config.listId)
                        .items
                        .select("Id,Title,PriorityRank,Portfolio/Id,Portfolio/Title,Portfolio/PortfolioStructureID,ParentTask/TaskID,ParentTask/Title,ParentTask/Id,EstimatedTime,EstimatedTimeDescription,Project/PriorityRank,Project/Id,Project/Title,workingThisWeek,EstimatedTime,TaskLevel,TaskLevel,OffshoreImageUrl,OffshoreComments,ClientTime,Priority,Status,ItemRank,IsTodaysTask,Body,PercentComplete,Categories,StartDate,PriorityRank,DueDate,TaskType/Id,TaskType/Title,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,TaskCategories/Id,TaskCategories/Title,AssignedTo/Id,AssignedTo/Title,TeamMembers/Id,TeamMembers/Title,ResponsibleTeam/Id,ResponsibleTeam/Title,ClientCategory/Id,ClientCategory/Title")
                        .expand('AssignedTo,Project,Author,Editor,Portfolio,TaskType,ParentTask,TeamMembers,ResponsibleTeam,TaskCategories,ClientCategory')
                        .filter("IsTodaysTask eq 1")
                        .top(4999)
                        .get();
                    arraycount++;
                    smartmeta.map((items: any) => {
                        let EstimatedDesc = JSON.parse(items?.EstimatedTimeDescription)
                        items.Item_x0020_Type = 'tasks';
                        items.ShowTeamsIcon = false
                        items.descriptionsSearch = '';
                        items.AllTeamMember = [];
                        items.siteType = config.Title;
                        items.siteUrl = config.siteUrl.Url;
                        items.EstimatedTime = 0
                        let estimatedDescription = ''
                        if (EstimatedDesc?.length > 0) {
                            EstimatedDesc?.map((time: any) => {
                                items.EstimatedTime += Number(time?.EstimatedTime)
                                estimatedDescription += ', ' + time?.EstimatedTimeDescription
                            })
                        }
                        if (items?.FeedBack != undefined) {

                            items.descriptionsSearch = globalCommon?.descriptionSearchData(items)
                        }
                        items.commentsSearch = items?.Comments != null && items?.Comments != undefined ? items.Comments.replace(/(<([^>]+)>)/gi, "").replace(/\n/g, '') : '';
                        items.listId = config.listId;

                        items.PercentComplete = (items.PercentComplete * 100).toFixed(0);
                        items.DisplayDueDate =
                            items.DueDate != null
                                ? Moment(items.DueDate).format("DD/MM/YYYY")
                                : "";
                        items.DisplayCreateDate =
                            items.Created != null
                                ? Moment(items.Created).format("DD/MM/YYYY")
                                : "";
                        items.portfolio = {};
                        if (items?.Portfolio?.Id != undefined) {
                            items.portfolio = items?.Portfolio;
                            items.PortfolioTitle = items?.Portfolio?.Title;
                            //  items["Portfoliotype"] = "Component";
                        }

                        items["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url;
                        if (items?.Project?.Title != undefined) {
                            items["ProjectTitle"] = items?.Project?.Title;
                            items["ProjectPriority"] = items?.Project?.PriorityRank;
                        } else {
                            items["ProjectTitle"] = '';
                            items["ProjectPriority"] = 0;
                        }



                        items.TeamMembersSearch = "";
                        items.AssignedToIds = [];
                        if (items.AssignedTo != undefined) {
                            items?.AssignedTo?.map((taskUser: any) => {
                                items.AssignedToIds.push(taskUser?.Id)
                                AllTaskUsers.map((user: any) => {
                                    if (user.AssingedToUserId == taskUser.Id) {
                                        if (user?.Title != undefined) {
                                            items.TeamMembersSearch =
                                                items.TeamMembersSearch + " " + user?.Title;
                                        }
                                    }
                                });
                            });
                        }

                        items.TaskID = globalCommon.getTaskId(items);
                        AllTaskUsers?.map((user: any) => {
                            if (user.AssingedToUserId == items.Author.Id) {
                                items.createdImg = user?.Item_x0020_Cover?.Url;
                            }
                            if (items.TeamMembers != undefined) {
                                items.TeamMembers.map((taskUser: any) => {
                                    var newuserdata: any = {};
                                    if (user.AssingedToUserId == taskUser.Id) {
                                        newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                                        newuserdata["Suffix"] = user?.Suffix;
                                        newuserdata["Title"] = user?.Title;
                                        newuserdata["UserId"] = user?.AssingedToUserId;
                                        items["Usertitlename"] = user?.Title;
                                        items.AllTeamMember.push(newuserdata);
                                    }

                                });
                            }
                        });
                        AllTask.push(items);
                    });
                    let setCount = siteConfig?.length
                    if (arraycount === setCount) {
                        AllTask.sort((a: any, b: any) => {
                            return b?.PriorityRank - a?.PriorityRank;
                        })
                        AllTask.sort((a: any, b: any) => {
                            return b?.ProjectPriority - a?.ProjectPriority;
                        })
                        setAllSiteTasks(AllTask);
                        const categorizedUsers: any = [];

                        // Iterate over the users
                        for (const user of AllTaskUsers) {
                            const category = user?.technicalGroup;
                            let categoryObject = categorizedUsers?.find((obj: any) => obj?.Title === category);
                            // If the category doesn't exist, create a new category object
                            if (!categoryObject) {
                                categoryObject = { Title: category, users: [], subRows: [], type: 'Category' };
                                categorizedUsers.push(categoryObject);
                            }
                            // const userTasks = AllTask?.filter((task:any) => 
                            // if(){
                            //     task?.AssignedTo?.filter((assigned:any)=>assigned?.Id=== user?.AssingedToUserId)
                            // });
                            const userTasks = AllTask?.filter((task: any) => task?.AssignedToIds?.includes(user?.AssingedToUserId));
                            categoryObject.users.push({ user, tasks: userTasks });
                        }
                        console.log(categorizedUsers);
                        for (const category of categorizedUsers) {
                            category?.users?.map((teamMember: any) => {
                                category.subRows = [...category?.subRows, ...teamMember?.tasks]
                            })
                        }

                        setCategoryGroup(categorizedUsers?.filter((item: any) => item?.Title != undefined))
                        console.log(categorizedUsers);
                        allSitesTasks = AllTask;
                        GetMasterData();
                    }

                });
            } catch (error) {
                console.log(error)

            }
        } else {
            alert('Site Config Length less than 0')
        }
    };
    const sortOnPriority = (Array: any) => {
        return Array.sort((a: any, b: any) => {
            return b?.PriorityRank - a?.PriorityRank;
        })
    }
    // People on Leave Today //
    const loadTodaysLeave = async () => {
        if (AllListId?.SmalsusLeaveCalendar?.length > 0) {
            let startDate: any = new Date();
            startDate = startDate.setHours(0, 0, 0, 0);
            const web = new Web(AllListId?.siteUrl);
            const results = await web.lists
                .getById(AllListId?.SmalsusLeaveCalendar)
                .items.select(
                    "RecurrenceData,Duration,Author/Title,Editor/Title,Name,Employee/Id,Employee/Title,Category,Description,ID,EndDate,EventDate,Location,Title,fAllDayEvent,EventType,UID,fRecurrence,Event_x002d_Type"
                )
                .expand("Author,Editor,Employee")
                .top(5000)
                .getAll();
            let peopleOnLeave: any = [];
            results?.map((emp: any) => {
                emp.leaveStart = new Date(emp.EventDate).setHours(0, 0, 0, 0);
                emp.leaveEnd = new Date(emp.EndDate).setHours(0, 0, 0, 0);
                if (startDate >= emp.leaveStart && startDate <= emp.leaveEnd) {
                    peopleOnLeave.push(emp?.Employee?.Id);
                }
            })
            AllLeaves = peopleOnLeave;
            setOnLeaveEmployees(peopleOnLeave)
            console.log(peopleOnLeave);
        }
    }
    const OpenAddStructureModal = () => {
        setIsAddStructureOpen(true);
      }
    //End


    return (
        <>
            <div>
                <div className="col-sm-12 pad0 smart">
                    <div className="section-event project-overview-Table">
                        <div >
                            <div className='align-items-center d-flex justify-content-between'>
                                <h2 className='heading'>Project Management Overview</h2>

                                {/* {showTeamMemberOnCheck === true ? <span><a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" className="svg__iconbox svg__icon--team teamIcon"></span></a></span> : ''} */}

                            </div>
                            <>
                                <div className='ProjectOverViewRadioFlat  d-flex justify-content-between SpfxCheckRadio mb-2 mt-1'>
                                    <dl className='alignCenter gap-2 mb-0'>
                                        <dt>
                                            <input className='radio' type="radio" value="Projects" name="date" checked={selectedView == 'Projects'} onClick={() => setSelectedView('Projects')} /> Projects
                                        </dt>
                                        <dt>
                                            <input className='radio' type="radio" value="flat" name="date" checked={selectedView == 'flat'} onClick={() => setSelectedView('flat')} /> Today's Tasks
                                        </dt>
                                        <dt>
                                            <input className='radio' type="radio" value="grouped" name="date" checked={selectedView == 'grouped'} onClick={() => setSelectedView('grouped')} /> Grouped View
                                        </dt>
                                        <dt>
                                            <input className='radio' type="radio" value="teamWise" name="date" checked={selectedView == 'teamWise'} onClick={() => setSelectedView('teamWise')} /> Team View
                                        </dt>

                                    </dl>
                                    <div className="m-0 text-end">
                                     
                                        {currentUserData?.Title == "Deepak Trivedi" || currentUserData?.Title == "Ranu Trivedi" || currentUserData?.Title == "Abhishek Tiwari" || currentUserData?.Title == "Prashant Kumar" ?
                                            <>
                                                <a className="hreflink  ms-1" onClick={() => { sendAllWorkingTodayTasks() }}>Share Working Todays's Task</a></>
                                            : ''}
                                    </div>
                                </div>
                                <div className="TableSection"><div className="Alltable">
                                    <div className='wrapper'>
                                        {selectedView == 'grouped' ? <GlobalCommanTable expandIcon={true}   headerOptions={headerOptions} AllListId={AllListId} columns={columns} multiSelect={true} data={data} paginatedTable={false} callBackData={callBackData} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                        {selectedView == 'flat' ? <GlobalCommanTable expandIcon={true}   headerOptions={headerOptions} AllListId={AllListId} columns={flatView} paginatedTable={true} data={AllSiteTasks} callBackData={callBackData} pageName={"ProjectOverview"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                        {selectedView == 'teamWise' ? <GlobalCommanTable expandIcon={true}   headerOptions={headerOptions} AllListId={AllListId} columns={groupedUsers} paginatedTable={true} data={categoryGroup} callBackData={callBackData} pageName={"ProjectOverviewGrouped"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                        {selectedView == 'Projects' ? <GlobalCommanTable expandIcon={true} hideAddActivityBtn={true} ref={childRef} callChildFunction={callChildFunction} restructurebtn={true} restructureCallBack={restructureCallback}  AllListId={AllListId} headerOptions={headerOptions} paginatedTable={false}  showCreationAllButton={true}
                                  OpenAddStructureModal={OpenAddStructureModal} AllSitesTaskData={AllSitesAllTasks} masterTaskData={MyAllData} multiSelect={true} columns={column2} data={flatData} callBackData={callBackData} pageName={"ProjectOverview"} TaskUsers={AllTaskUser} showHeader={true} /> : ''}
                                    </div>
                                </div>
                                </div>

                            </>
                        </div>
                    </div>
                </div>
                {isOpenEditPopup ? (
                    <EditTaskPopup AllListId={AllListId} context={props?.props?.Context} Items={passdata} pageName="TaskDashBoard" Call={editTaskCallBack} />
                ) : (
                    ""
                )}
                {IsComponent && <EditProjectPopup props={SharewebComponent} AllListId={AllListId} Call={Call} showProgressBar={showProgressBar}> </EditProjectPopup>}
                {ShowTeamPopup === true ? <ShowTeamMembers props={checkData} callBack={showTaskTeamCAllBack} TaskUsers={AllTaskUser} /> : ''}
                {openTimeEntryPopup && <TimeEntryPopup props={taskTimeDetails} CallBackTimeEntry={TimeEntryCallBack} Context={props?.props?.Context} />}
                {isAddStructureOpen && <AddProject CallBack={CallBack} items={CheckBoxData} PageName={"ProjectOverview"} AllListId={AllListId} data={data}/>}
            </div>
            {pageLoaderActive ? <PageLoader /> : ''}
        </>
    )
}