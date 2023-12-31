import * as React from 'react';
import * as $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
// import { Modal } from 'office-ui-fabric-react';
import "bootstrap/dist/css/bootstrap.min.css";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch, FaFilter, FaRegTimesCircle } from 'react-icons/fa';
import { MdAdd } from 'react-icons/Md';
import Tooltip from '../../../globalComponents/Tooltip';
import Dropdown from 'react-bootstrap/Dropdown';
import EditInstituton from '../../EditPopupFiles/EditComponent'
import { create } from 'lodash';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
// import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryPopup';
import TimeEntryPopup from '../../../globalComponents/TimeEntry/TimeEntryComponent';

export default function ComponentTable({ props }: any) {
    const [maiArrayBackup, setmaiArrayBackup] = React.useState([])
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [show, setShow] = React.useState(false);
    const [child, setChild] = React.useState(false);
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [data, setData] = React.useState([])
    const [Title, setTitle] = React.useState()
    const [itemType, setitemType] = React.useState()
    const [ComponentsData, setComponentsData] = React.useState([])
    const [SubComponentsData, setSubComponentsData] = React.useState([])
    const [FeatureData, setFeatureData] = React.useState([])
    const [table, setTable] = React.useState(data);
    const [AllUsers, setTaskUser] = React.useState([])
    const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
    const [Editpopup, setEditpopup] = React.useState(false);
    const [addModalOpen, setAddModalOpen] = React.useState(false);
    const [showItem, setshowItem] = React.useState(false);
    const [state, setState] = React.useState([]);
    const [filterGroups, setFilterGroups] = React.useState([])
    const [filterItems, setfilterItems] = React.useState([])
    const [Editdata, setEditdata] = React.useState([]);
    const [AllMetadata, setMetadata] = React.useState([])
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([])
    const [collapseItem, setcollapseItem] = React.useState(true);
    const [EditTaskItemitle, setEditItem] = React.useState('');
    const [popupStatus, setPopupItem] = React.useState(false);
    const [itemData, setItemData] = React.useState([])
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [SmartmodalIsOpen, setSmartModalIsOpen] = React.useState(false);
    const [CreatedmodalIsOpen, setCreatedmodalIsOpen] = React.useState(false);
    const [AddActivityIsOpen, setAddActivityIsOpen] = React.useState(false);
    const [DuemodalIsOpen, setDuemodalIsOpen] = React.useState(false);
    const [TeamMembermodalIsOpen, setTeamMembermodalIsOpen] = React.useState(false);
    const [ItemRankmodalIsOpen, setItemRankmodalIsOpen] = React.useState(false);
    const [StatusmodalIsOpen, setStatusmodalIsOpen] = React.useState(false);
    const [IsComponent, setIsComponent] = React.useState(false);
    const [SharewebComponent, setSharewebComponent] = React.useState('');
    const [SharewebTask, setSharewebTask] = React.useState('');
    const [IsTask, setIsTask] = React.useState(false);
    const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
    const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([])
    const [isOpenEditPopup, setisOpenEditPopup] = React.useState(false)
    const [passdata, setpassdata] = React.useState('');
    //    Array For Status
    const AllItems = [{ 'Title': 0, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 5, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 10, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 50, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 70, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 80, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 90, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 93, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 96, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 99, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }, { 'Title': 100, 'Group': 'PercentComplete', 'TaxType': 'PercentComplete', "Selected": false }];
    // Array of Rank
    const AllItemRank = [{ 'Title': 1, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 2, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 3, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 4, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 5, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 6, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 7, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 8, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 9, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }, { 'Title': 10, 'Group': 'ItemRank', 'TaxType': 'ItemRank', 'Selected': false }];
    // Array of SmartTime
    const SmartTime = [{ 'Title': '', 'Group': 'SmartTime', 'TaxType': 'SmartTime', 'Selected': false }];
    //    Get query string id
    function getQueryVariable(variable: any) {
        var query = window.location.search.substring(1);
        console.log(query)//"app=article&act=news_content&aid=160990"
        var vars = query.split("&");
        console.log(vars)
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }
    const EditComponentPopup = (item: any) => {
        item['siteUrl'] = 'https://hhhhteams.sharepoint.com/sites/HHHH/SP';
        item['listName'] = 'Master Tasks';
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsComponent(true);
        setSharewebComponent(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const EditPopup = React.useCallback((item: any) => {
        setisOpenEditPopup(true)
        setpassdata(item)
    }, [])
    const CallBack = React.useCallback(() => {
        setisOpenEditPopup(false)
    }, [])
    const editProfile = (itemData: any) => {
        console.log('test')
        setPopupItem(true);
        setItemData(['']);
        setItemData(itemData);// => ([...itemData]));
    }
    const SingleLookDatatest = (e: any, item: any, value: any) => {
        const { checked } = e.target;
        if (checked) {
            state.push(item);
        }
        else {
            $.each(state, function (index: any, newite: any) {
                // if (newite.Title != undefined) {
                //     if (newite.Title == item.Title)
                //         state.splice(index, 1);
                // }
                if (newite.Id == item.Id) {
                    state.splice(index, 1);
                }
            })
        }
        setState(state)
    }
    const Clearitem = () => {
        // setData(maini...[maidataBackup])
        setData(maidataBackup)
        // const { checked } = e.target;
    }
    const setAddActivityIsOpenToTrue = () => {
        setAddActivityIsOpen(true)
    }
    const setAddActivityIsOpenFalse = () => {
        setAddActivityIsOpen(false)
    }
    const setModalSmartIsOpenToTrue = () => {
        setSmartModalIsOpen(true)
    }
    const setModalSmartIsOpenToFalse = () => {
        setSmartModalIsOpen(false)
    }
    const setCreatedmodalIsOpenToTrue = () => {
        setCreatedmodalIsOpen(true)
    }
    const setCreatedmodalIsOpenToFalse = () => {
        setCreatedmodalIsOpen(false)
    }
    const setDuemodalIsOpenToTrue = () => {
        setDuemodalIsOpen(true)
    }
    const setDuemodalIsOpenToFalse = () => {
        setDuemodalIsOpen(false)
    }
    const setTeamMembermodalIsOpenToTrue = () => {
        setTeamMembermodalIsOpen(true)
    }
    const setTeamMembermodalIsOpenToFalse = () => {
        setTeamMembermodalIsOpen(false)
    }
    const setItemRankmodalIsOpenToTrue = () => {
        setItemRankmodalIsOpen(true)
    }
    const setItemRankmodalIsOpenToFalse = () => {
        setItemRankmodalIsOpen(false)
    }
    const setStatusmodalIsOpenToTrue = () => {
        setStatusmodalIsOpen(true)
    }
    const setStatusmodalIsOpenToFalse = () => {
        setStatusmodalIsOpen(false)
    }
    const Updateitem = () => {
        var filters: any[] = []
        if (state.length == 0) {
            setData(maidataBackup)
        }
        else {
            $.each(maidataBackup, function (index: any, item) {
                $.each(state, function (index: any, select) {
                    if (item.Id == select.Id) {
                        filters.push(item);
                    }
                    $.each(item.TeamLeaderUser, function (index: any, team) {
                        if (select.Title == team.Title) {
                            filters.push(item);
                        }
                    })
                    $.each(item.Child, function (index: any, childitem) {
                        if (childitem.Id == select.Id) {
                            filters.push(childitem);
                        }
                    })
                    $.each(item.Child.TeamLeaderUser, function (index: any, childteam) {
                        if (select.Title == childteam.Title) {
                            filters.push(childteam);
                        }
                    })
                })
            })
        }
        setData(filters)
    }
    const handleOpen2 = (item: any) => {
        item.show = item.show = item.show == true ? false : true;
        setfilterItems(filterItems => ([...filterItems]));
    };
    const handleOpen = (item: any) => {
        item.show = item.show = item.show == true ? false : true;
        setData(maidataBackup => ([...maidataBackup]));
    }; const handleEditPopup = (item: any) => {
        //    item.Isclick = item.Isclick = item.Isclick == true ? false : true;
        //    setData(data => ([...data]));
        // item.Isclick = item.Isclick = item.Isclick == true ? false : true;
        //setData(data => ([...data]));
    };
    const handleTimeOpen = (item: any) => {
        item.show = item.show = item.show == true ? false : true;
        setTimeSheet(TaskTimeSheetCategoriesGrouping => ([...TaskTimeSheetCategoriesGrouping]));
        // setData(data => ([...data]));
    };
    const addModal = () => {
        setAddModalOpen(true)
    }
    const setModalIsOpenToTrue = () => {
        setModalIsOpen(true)
    }
    const setModalIsTimeOpenToTrue = () => {
        setTimeModalIsOpen(true)
    }
    const sortBy = () => {
        const copy = data
        copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);
        setTable(copy)
    }
    const sortByDng = () => {
        const copy = data
        copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);
        setTable(copy)
    }
    let handleChange = (e: { target: { value: string; }; }, titleName: any) => {
        setSearch(e.target.value.toLowerCase());
        var Title = titleName;
    };
    var stringToArray = function (input: any) {
        if (input) {
            return input.match(/\S+/g);
        } else {
            return [];
        }
    };
    const EditItemTaskPopup = (item: any) => {
        // <ComponentPortPolioPopup ></ComponentPortPolioPopup>
        setIsTask(true);
        setSharewebTask(item);
        // <ComponentPortPolioPopup props={item}></ComponentPortPolioPopup>
    }
    const EditDataopen = (e: any, item: any) => {
        setIsTimeEntry(true);
        setSharewebTimeComponent(item);
    }
    const TimeEntryCallBack = React.useCallback((item1) => {
        setIsTimeEntry(false);
    }, []);
    const Call = React.useCallback((item1) => {
        setIsComponent(false);
        setIsTask(false);
    }, []);
    var getSearchTermAvialable1 = function (searchTerms: any, item: any, Title: any) {
        var isSearchTermAvailable = true;
        $.each(searchTerms, function (index: any, val: any) {
            if (isSearchTermAvailable && (item[Title] != undefined && item[Title].toLowerCase().indexOf(val.toLowerCase()) > -1)) {
                isSearchTermAvailable = true;
            } else
                isSearchTermAvailable = false;
        })
        return isSearchTermAvailable;
    }
    let handleChange1 = (e: { target: { value: string; }; }, titleName: any) => {
        setSearch(e.target.value.toLowerCase());
        var Title = titleName;
        var AllFilteredTagNews = [];
        var filterglobal = e.target.value.toLowerCase();
        if (filterglobal != undefined && filterglobal.length >= 1) {
            var searchTerms = stringToArray(filterglobal);
            $.each(data, function (pareIndex: any, item: any) {
                item.flag = false;
                item.isSearch = true;
                item.show = false;
                item.flag = (getSearchTermAvialable1(searchTerms, item, Title));
                if (item.childs != undefined && item.childs.length > 0) {
                    $.each(item.childs, function (parentIndex: any, child1: any) {
                        child1.flag = false;
                        child1.isSearch = true;
                        child1.flag = (getSearchTermAvialable1(searchTerms, child1, Title));
                        if (child1.flag) {
                            item.childs[parentIndex].flag = true;
                            data[pareIndex].flag = true;
                            item.childs[parentIndex].show = true;
                            data[pareIndex].show = true;
                        }
                        if (child1.childs != undefined && child1.childs.length > 0) {
                            $.each(child1.childs, function (index: any, subchild: any) {
                                subchild.flag = false;
                                subchild.flag = (getSearchTermAvialable1(searchTerms, subchild, Title));
                                if (subchild.flag) {
                                    item.childs[parentIndex].flag = true;
                                    child1.flag = true;
                                    child1.childs[index].flag = true;
                                    child1.childs[index].show = true;
                                    item.childs[parentIndex].show = true;
                                    data[pareIndex].flag = true;
                                    data[pareIndex].show = true;
                                }
                                if (subchild.childs != undefined && subchild.childs.length > 0) {
                                    $.each(subchild.childs, function (childindex: any, subchilds: any) {
                                        subchilds.flag = false;
                                        subchilds.Title = subchilds.newTitle;
                                        subchilds.flag = (getSearchTermAvialable1(searchTerms, subchilds, Title));
                                        if (subchilds.flag) {
                                            item.childs[parentIndex].flag = true;
                                            subchild.flag = true;
                                            subchild.childs[index].show = true;
                                            subchild.childs[childindex].flag = true;
                                            item.childs[parentIndex].show = true;
                                            subchild.childs[childindex].show = true;
                                            data[pareIndex].flag = true;
                                            data[pareIndex].show = true;
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
            //   getFilterLength();
        } else {
            //  ungetFilterLength();
            // setData(data => ([...maidataBackup]));
            setData(maidataBackup);
            //setData(ComponentsData)= SharewebCommonFactoryService.ArrayCopy($scope.CopyData);
        }
        // console.log($scope.ComponetsData['allComponentItemWithStructure']);
    };
    var siteConfig: any = [];
    var TaxonomyItems: any = [];
    var AllComponetsData: any = [];
    var TaskUsers: any = [];
    var RootComponentsData: any = [];
    var MetaData: any = []
    var showProgressBar = () => {
        $(' #SpfxProgressbar').show();
    }
    var showProgressHide = () => {
        $(' #SpfxProgressbar').hide();
    }
    React.useEffect(() => {
        console.log("Use effect is running")
        showProgressBar();
        function RetrieveSPData() {
            //--------------------------task user--------------------------------------------------------------------------------------------------
            var Response: any = []
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('b318ba84-e21d-4876-8851-88b94b9dc300')/items?$top=1000";
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    Response = Response.concat(data.d.results);
                    TaskUsers = Response;
                    console.log(Response);
                    setTaskUser(Response);
                    //   if (data.d.__next) {
                    //   url = data.d.__next;
                    // }
                    //  else setTaskUser(Response);
                },
                error: function (error) {
                }
            });
            //-----------------------------------end taskuser data--------------------------------------------------------------------------------------------
            //----------------------------------------LoadSmartMetaData---------------------------------------------------------------------------------------------------------------------------
            var metadatItem: any = []
            var filterItems: any = [];
            // siteConfig =[];
            // var filterGroups: any = [];
            filterGroups.push("Portfolio");
            filterGroups.push("Sites");
            filterGroups.push("Type");
            filterGroups.push("Team Members");
            // setFilterGroups(filterGroups);
            var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('01a34938-8c7e-4ea6-a003-cee649e8c67a')/items?$select=Id,Title,IsVisible,ParentID,SmartSuggestions,TaxType,Description1,Item_x005F_x0020_Cover,listId,siteName,siteUrl,SortOrder,SmartFilters,Selectable,Parent/Id,Parent/Title&$expand=Parent&$orderby=SortOrder&$top=4999";
            $.ajax({
                url: url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    MetaData = MetaData.concat(data.d.results);
                    setMetadata(MetaData);
                    $.each(MetaData, function (item: any, newtest) {
                        if (newtest.ParentID == 0 && newtest.TaxType == 'Client Category') {
                            TaxonomyItems.push(newtest);
                        }
                        if (newtest.TaxType == 'Sites') {
                            siteConfig.push(newtest)
                        }
                    });
                    LoadAllSiteTasks();
                    $.each(siteConfig, function (index: any, newsite) {
                        /*-- Code for default Load Task Data---*/
                        if (newsite.Title == "DRR" && newsite.Title == "Small Projects" && newsite.Title == "Gruene" && newsite.Title == "Offshore Tasks" && newsite.Title == "Health" && newsite.Title == "Shareweb Old") {
                            newsite.Selected = false;
                        }
                        else {
                            newsite.Selected = true;
                        }
                        if (newsite.Title != "Master Tasks" || newsite.Title != "Foundation")
                            siteConfig.push(newsite);
                    })
                    $.each(MetaData, function (newitem: any, item) {
                        if (item.TaxType != 'Status' && item.TaxType != 'Admin Status' && item.TaxType != 'Task Type' && item.TaxType != 'Time' && item.Id != 300 && item.TaxType != 'Portfolio Type' && item.TaxType != 'Task Types') {
                            if (item.TaxType == 'Sites') {
                                item.DataLoad = false;
                                /*-- Code for default Load Task Data---*/
                                if (item.Title == "DRR" || item.Title == "Small Projects" || item.Title == "Offshore Tasks" || item.Title == "Health") {
                                    item.Selected = false;
                                }
                                else {
                                    item.Selected = true;
                                }
                            }
                            else if (item.TaxType == 'Sites Old') {
                                /*-- Code for default Load Task Data---*/
                                item.Selected = true;
                            }
                            metadatItem.push(item);
                            //setFilterGroups(metadatItem)
                        }
                    })
                    $.each(Response, function (index: any, user) {
                        user.TaxType = 'Team Members';
                        user.SmartFilters = {};
                        user.SmartFilters.results = [];
                        user.SmartFilters.results.push('Portfolio');
                        if (user.UserGroupId == undefined)
                            user.ParentID = 0;
                        if (user.UserGroupId != undefined)
                            user.ParentID = user.UserGroupId;
                        metadatItem.push(user);
                    });
                    $.each(metadatItem, function (newi: any, item) {
                        if (item.Title == 'Shareweb Old') {
                            item.TaxType = 'Sites';
                        }
                    })
                    $.each(metadatItem, function (newitem: any, filterItem) {
                        if (filterItem.SmartFilters != undefined && filterItem.SmartFilters.results != undefined && filterItem.SmartFilters.results.indexOf('Portfolio') > -1) {
                            var item: any = [];
                            item.ID = item.Id = filterItem.Id;
                            item.Title = filterItem.Title;
                            item.Group = filterItem.TaxType;
                            item.TaxType = filterItem.TaxType;
                            if (item.Title == "Activities" || item.Title == "Workstream" || item.Title == "Task") {
                                item.Selected = true;
                            }
                            if (filterItem.ParentID == 0 || (filterItem.Parent != undefined && filterItem.Parent.Id == undefined)) {
                                if (item.TaxType == 'Team Members') {
                                    getChildsBasedonId(item, Response);
                                } else {
                                    getChildsBasedOn(item, MetaData);
                                }
                                filterItems.push(item);
                                if (filterItem.TaxType != "Type" && filterItem.TaxType != "Sites Old" && (filterGroups.length == 0 || filterGroups.indexOf(filterItem.TaxType) == -1)) {
                                    filterGroups.push(filterItem.TaxType);
                                }
                                setFilterGroups(filterGroups)
                            }
                        }
                    });
                    filterItems.push({ "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Component", "Selected": true, "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "SubComponent", "Selected": true, "childs": [] }, { "Group": "Portfolio", "TaxType": "Portfolio", "Title": "Feature", "Selected": true, "childs": [] });
                    $.each(filterItems, function (neww: any, item) {
                        if (item.TaxType == "Sites" && item.Title == 'SDC Sites' || item.Title == 'Tasks') {
                            item.Selected = true;
                        }
                    })
                    setfilterItems(filterItems)
                    function getChildsBasedonId(item: { childs: any[]; Id: any; }, items: any) {
                        item.childs = [];
                        $.each(items, function (child: any, childItem) {
                            if (childItem.UserGroupId != undefined && childItem.UserGroupId == item.Id) {
                                item.childs.push(childItem);
                                getChildsBasedonId(childItem, items);
                            }
                        });
                    }
                    function getChildsBasedOn(item: { childs: any[]; ID: number; }, items: any) {
                        item.childs = [];
                        $.each(MetaData, function (news: any, childItem) {
                            if (childItem.Parent != undefined && childItem.Parent.Id != undefined && parseInt(childItem.Parent.Id) == item.ID) {
                                item.childs.push(childItem);
                                getChildsBasedOn(childItem, items);
                            }
                        });
                    }
                },
                error: function (error) {
                }
            });
            //---------------------------------------End SmartMetaData-------------------------------------------------------------------------------------------------------------------------------------
            var spRequest = new XMLHttpRequest();
            var query = "Id,Mileage,TaskListId,TaskListName,WorkspaceType,PortfolioLevel,PortfolioStructureID,component_x0020_link,Package,Comments,DueDate,Sitestagging,Body,Deliverables,SiteCompositionSettings,StartDate,Created,Item_x0020_Type,Help_x0020_Information,Background,Categories,TechnicalExplanations,Idea,ValueAdded,Synonyms,Package,Short_x0020_Description_x0020_On,Admin_x0020_Notes,AdminStatus,CategoryItem,Priority_x0020_Rank,Priority,TaskDueDate,DueDate,PercentComplete,Modified,CompletedDate,ItemRank,Title,Portfolio_x0020_Type,Parent/Id,Parent/Title,Component/Id,Component/Title,Component/ItemType,Services/Id,Services/Title,Services/ItemType,Events/Id,Events/Title,Events/ItemType,SharewebCategories/Id,SharewebCategories/Title,AssignedTo/Id,AssignedTo/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,ClientCategory/Id,ClientCategory/Title&$expand=SharewebCategories,ClientCategory,Parent,Component,Services,Events,AssignedTo,Team_x0020_Members&$filter=((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) or (Portfolio_x0020_Type eq 'Component')or (Portfolio_x0020_Type eq 'Services')&$top=4999";
            spRequest.open('GET', "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items?$select=" + query);
            spRequest.setRequestHeader("Accept", "application/json");
            spRequest.onreadystatechange = function () {
                //  var RootComponentsData: any[] = [];
                // var ComponentsData: any = [];
                // var SubComponentsData: any = [];
                // var FeatureData: any = [];
                var maiArrayBackup: any = []
                if (spRequest.readyState === 4 && spRequest.status === 200) {
                    var results = JSON.parse(spRequest.responseText);
                    maiArrayBackup.push(results.value)
                    setmaiArrayBackup(maiArrayBackup)
                    AllComponetsData = maiArrayBackup[0];
                    //  setData(AllComponetsData);
                    ComponetsData['allComponets'] = AllComponetsData;
                }
                else if (spRequest.readyState === 4 && spRequest.status !== 200) {
                    console.log('Error Occurred !');
                }
            },
                spRequest.send();
        }
        RetrieveSPData();
        $.each(data, function (index: any, item) {
            $.each(state, function (index: any, select) {
                if (item.Portfolio_x0020_Type == select.Title) {
                    select.Selected = true;
                }
                if (item.Id == select.Id) {
                    select.Selected = true;
                }
            })
        })
    }, [])
    // common services
    const countOfWord = function (text: any) {
        var s = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
        return s ? s.length : '';
    };
    var parseJSON = function (jsonItem: any) {
        var json = [];
        try {
            json = JSON.parse(jsonItem);
        } catch (err) {
            console.log(err);
        }
        return json;
    };
    var getSharewebId = function (item: any) {
        var Shareweb_x0020_ID = undefined;
        if (item != undefined && item.SharewebTaskType != undefined && item.SharewebTaskType.Title == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No == undefined && item.SharewebTaskLevel2No == undefined) {
            Shareweb_x0020_ID = 'T' + item.Id;
            if (item.SharewebTaskType.Title == 'MileStone')
                Shareweb_x0020_ID = 'M' + item.Id;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Activities' || item.SharewebTaskType.Title == 'Project') && item.SharewebTaskLevel1No != undefined) {
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No;
                }
            }
            if (item.Component != undefined && item.Events != undefined && item.Services != undefined)
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            //}
            if (item.Component == undefined && item.Events == undefined && item.Services == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No;
            }
            if (item.SharewebTaskType.Title == 'Project')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Workstream' || item.SharewebTaskType.Title == 'Step') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No;
            }
            if (item.SharewebTaskType.Title == 'Step')
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No;
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No != undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                // if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                //  }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-W' + item.SharewebTaskLevel2No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-S' + item.SharewebTaskLevel2No + '-M' + item.Id;
            }
        }
        else if (item.SharewebTaskType != undefined && (item.SharewebTaskType.Title == 'Task' || item.SharewebTaskType.Title == 'MileStone') && item.SharewebTaskLevel1No != undefined && item.SharewebTaskLevel2No == undefined) {
            if (item.Component != undefined && item.Services != undefined && item.Events != undefined) {
                //  if (!item.Events.results.length > 0 && !item.Services.results.length > 0 && !item.Component.results.length > 0) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
                // }
            }
            if (item.Component != undefined) {
                if (item.Component.results != undefined && item.Component.results.length > 0) {
                    Shareweb_x0020_ID = 'CA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Services != undefined) {
                if (item.Services.results != undefined && item.Services.results.length > 0) {
                    Shareweb_x0020_ID = 'SA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Events != undefined) {
                if (item.Events.results != undefined && item.Events.results.length > 0) {
                    Shareweb_x0020_ID = 'EA' + item.SharewebTaskLevel1No + '-T' + item.Id;
                }
            }
            if (item.Component == undefined && item.Services == undefined && item.Events == undefined) {
                Shareweb_x0020_ID = 'A' + item.SharewebTaskLevel1No + '-T' + item.Id;
            }
            if (item.SharewebTaskType.Title == 'MileStone') {
                Shareweb_x0020_ID = 'P' + item.SharewebTaskLevel1No + '-M' + item.Id;
            }
        }
        return Shareweb_x0020_ID;
    }
    var ArrayCopy = function (array: any) {
        let MainArray = [];
        if (array != undefined && array.length != undefined) {
            MainArray = parseJSON(JSON.stringify(array));
        }
        return MainArray;
    }
    var stringToArray1 = function (input: any) {
        if (input) {
            return input.split('>');
        } else {
            return [];
        }
    };
    var getRegexPattern = function (keywordArray: any) {
        var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
        return new RegExp(pattern, "gi");
    };
    const makeFullStructureOfPortfolioTaskDatabase = function (task: any, AllTaskItems: any) {
        var CompleteStructure = "";
        if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Activities' || task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Smart Case') {
            CompleteStructure = task.Title;
        } else if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Workstream') {
            //var temp = $.grep(AllTaskItems, item => { return item.Id == task.ParentTask.Id })[0];
            var temp = $.grep(AllTaskItems, function (item: any) { return (task.ParentTask != undefined && task.ParentTask.Id != undefined && item.Id == task.ParentTask.Id) })[0];
            if (temp != undefined)
                CompleteStructure = temp.Title + " >" + task.Title;
            else
                CompleteStructure = task.Title;
        } else if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title == 'Task') {
            //  var temp = $.grep(AllTaskItems, item => { return item.Id == task.ParentTask.Id })[0];
            var temp = $.grep(AllTaskItems, function (item: any) { return (task.ParentTask != undefined && task.ParentTask.Id != undefined && item.Id == task.ParentTask.Id) })[0];
            if (temp == undefined || temp == null)
                CompleteStructure = task.Title;
            else {
                if (temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Activities' || temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Smart Case') {
                    CompleteStructure = temp.Title + " >" + task.Title;
                } else if (temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Workstream') {
                    //var temp1 = $.grep(AllTaskItems, item => { return item.Id == temp.ParentTask.Id })[0];
                    var temp1 = $.grep(AllTaskItems, function (item: any) { return (task.ParentTask != undefined && task.ParentTask.Id != undefined && item.Id == task.ParentTask.Id) })[0];
                    if (temp1 == undefined) {
                        CompleteStructure = temp.Title + " >" + task.Title;
                    } else {
                        CompleteStructure = temp1.Title + " >" + temp.Title + " >" + task.Title;
                    }
                } else if (temp.SharewebTaskType != undefined && temp.SharewebTaskType.Title == 'Task') {
                    CompleteStructure = task.ParentTask.Title;
                }
            }
        }
        var MainComponent: any = [];
        if (task.PortfolioItemsId != undefined) {
            MainComponent = ArrayCopy($.grep(AllComponetsData, function (index: any, type: any) { return type.Id == task.PortfolioItemsId }));
        }
        if (task.Item_x0020_Type != undefined && task.Item_x0020_Type == 'Component' || task.Item_x0020_Type == 'SubComponent' || task.Item_x0020_Type == 'Feature') {
            MainComponent = ArrayCopy($.grep(AllComponetsData, function (type: any) { return type.Id == task.Id }));
        }
        var OtherStructure = "";
        if (MainComponent.length > 0) {
            if (MainComponent[0].Item_x0020_Type == 'Component') {
                OtherStructure = MainComponent[0].Title;
            } else if (MainComponent[0].Item_x0020_Type == 'SubComponent') {
                // var temp = $.grep($scope.AllComponetsData, item => { return item.Id == MainComponent[0].Parent.Id })[0];
                var temp = $.grep(AllComponetsData, function (item: any) { return (MainComponent[0].Parent != undefined && MainComponent[0].Parent.Id != undefined && item.Id == MainComponent[0].Parent.Id) })[0];
                if (temp != undefined)
                    OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                else
                    OtherStructure = MainComponent[0].Title;
            } else if (MainComponent[0].Item_x0020_Type == 'Feature') {
                // var temp = $.grep($scope.AllComponetsData, item => { return item.Id == MainComponent[0].Parent.Id })[0];
                var temp = $.grep(AllComponetsData, function (item: any) { return (MainComponent[0].Parent != undefined && MainComponent[0].Parent.Id != undefined && item.Id == MainComponent[0].Parent.Id) })[0];
                if (temp == undefined || temp == null)
                    OtherStructure = MainComponent[0].Title;
                else {
                    if (temp.Item_x0020_Type != undefined && temp.Item_x0020_Type == 'Component') {
                        OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                    } else if (temp.Item_x0020_Type == 'SubComponent') {
                        //var temp1 = $.grep($scope.AllComponetsData, item => { return item.Id == temp.Parent.Id })[0];
                        var temp1 = $.grep(AllComponetsData, function (item: any) { return (temp.Parent != undefined && temp.Parent.Id != undefined && item.Id == temp.Parent.Id) })[0];
                        if (temp1 == undefined) {
                            OtherStructure = temp.Title + " >" + MainComponent[0].Title;
                        } else {
                            OtherStructure = temp1.Title + " >" + temp.Title + " >" + MainComponent[0].Title;
                        }
                    } else if (temp.Item_x0020_Type == 'Task') {
                        OtherStructure = MainComponent[0].Parent.Title;
                    }
                }
            }
            if (CompleteStructure == '') {
                var keywordList = [];
                keywordList = stringToArray1(OtherStructure);
                var pattern = getRegexPattern(keywordList);
                CompleteStructure = OtherStructure.replace(pattern, '<span className="siteColor bold">$2</span>');;
            }
            else {
                var keywordList = [];
                keywordList = stringToArray1(OtherStructure);
                var pattern = getRegexPattern(keywordList);
                CompleteStructure = OtherStructure.replace(pattern, '<span className="siteColor bold">$2</span>') + ' >' + CompleteStructure;
            }
            // CompleteStructure = OtherStructure + ' >' + CompleteStructure;
        }
        return CompleteStructure;
    }
    var LIST_CONFIGURATIONS_TASKS = '[{"Title":"Gruene","listId":"2302E0CD-F41A-4855-A518-A2B1FD855E4C","siteName":"Gruene","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.gruene-washington.de","MetadataName":"SP.Data.GrueneListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/logo-gruene.png"},{"Title":"DE","listId":"3204D169-62FD-4240-831F-BCDDA77F5028","siteName":"DE","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Development-Effectiveness","MetadataName":"SP.Data.DEListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_de.png"},{"Title":"DRR","listId":"CCBCBAFE-292E-4384-A800-7FE0AAB1F70A","siteName":"DRR","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.DRRListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_drr.png"},{"Title":"Education","listId":"CF45B0AD-7BFF-4778-AF7A-7131DAD2FD7D","siteName":"Education","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/education","MetadataName":"SP.Data.EducationListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_education.png"},{"Title":"EI","listId":"E0E1FC6E-0E3E-47F5-8D4B-2FBCDC3A5BB7","siteName":"EI","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei","MetadataName":"SP.Data.EIListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_ei.png"},{"Title":"EPS","listId":"EC6F0AE9-4D2C-4943-9E79-067EC77AA613","siteName":"EPS","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/eps","MetadataName":"SP.Data.EPSListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_eps.png"},{"Title":"Gender","listId":"F8FD0ADA-0F3C-40B7-9914-674F63F72ABA","siteName":"Gender","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.GenderListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_gender.png"},{"Title":"Health","listId":"E75C6AA9-E987-43F1-84F7-D1818A862076","siteName":"Health","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Health","MetadataName":"SP.Data.HealthListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_health.png"},{"Title":"HHHH","listId":"091889BD-5339-4D11-960E-A8FF38DF414B","siteName":"HHHH","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.HHHHListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/icon_hhhh.png"},{"Title":"KathaBeck","listId":"beb3d9d7-daf3-4c0f-9e6b-fd36d9290fb9","siteName":null,"siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://kathabeck.sharepoint.com/sites/TeamK4Bundestag","MetadataName":"SP.Data.KathaBeckListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Foundation/Icon_Kathabeck.png"},{"Title":"QA","listId":"61B71DBD-7463-4B6C-AF10-6609A23AE650","siteName":"QA","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/qa","MetadataName":"SP.Data.QAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_qa.png"},{"Title":"ALAKDigital","listId":"d70271ae-3325-4fac-9893-147ee0ba9b4d","siteName":"ALAKDigital","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/ei/digitaladministration","MetadataName":"SP.Data.ALAKDigitalListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_DA.png"},{"Title":"Shareweb","listId":"B7198F49-D58B-4D0A-ADAD-11995F6FADE0","siteName":"Shareweb","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/joint","MetadataName":"SP.Data.SharewebListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_shareweb.png"},{"Title":"Small Projects","listId":"3AFC4CEE-1AC8-4186-B139-531EBCEEA0DE","siteName":"Small Projects","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Small_x0020_ProjectsListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/small_project.png"},{"Title":"Offshore Tasks","listId":"BEB90492-2D17-4F0C-B332-790BA9E0D5D4","siteName":"Offshore Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://hhhhteams.sharepoint.com/sites/HHHH","MetadataName":"SP.Data.SharewebQAListItem","TimesheetListName":"TaskTimeSheetListNew","TimesheetListId":"464FB776-E4B3-404C-8261-7D3C50FF343F","TimesheetListmetadata":"SP.Data.TaskTimeSheetListNewListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/offshore_Tasks.png"},{"Title":"Migration","listId":"D1A5AC25-3DC2-4939-9291-1513FE5AC17E","siteName":"Migration","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"https://www.shareweb.ch/site/Migration","MetadataName":"SP.Data.MigrationListItem","TimesheetListName":"TasksTimesheet2","TimesheetListId":"9ED5C649-3B4E-42DB-A186-778BA43C5C93","TimesheetListmetadata":"SP.Data.TasksTimesheet2ListItem","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/site_migration.png"},{"Title":"Master Tasks","listId":"EC34B38F-0669-480A-910C-F84E92E58ADF","siteName":"Master Tasks","siteUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SP","TaxType":"Sites","DomainUrl":"","MetadataName":"SP.Data.Master_x0020_TasksListItem","ImageUrl":"","ImageInformation":[{"ItemType":"Component","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Component","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Service","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"},{"ItemType":"Component","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/component_icon.png"},{"ItemType":"SubComponent","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/SubComponent_icon.png"},{"ItemType":"Feature","PortfolioType":"Events","ImageUrl":"https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Event_Icons/feature_icon.png"}]}]'
    var GetIconImageUrl = function (listName: any, listUrl: any, Item: any) {
        var IconUrl = '';
        if (listName != undefined) {
            let TaskListsConfiguration = parseJSON(LIST_CONFIGURATIONS_TASKS);
            let TaskListItem = TaskListsConfiguration.filter(function (filterItem: any) {
                let SiteRelativeUrl = filterItem.siteUrl;
                return (filterItem.Title.toLowerCase() == listName.toLowerCase() && SiteRelativeUrl.toLowerCase() == (listUrl).toLowerCase());
            });
            if (TaskListItem.length > 0) {
                if (Item == undefined) {
                    IconUrl = TaskListItem[0].ImageUrl;
                }
                else if (TaskListItem[0].ImageInformation != undefined) {
                    var IconUrlItem = (TaskListItem[0].ImageInformation.filter(function (index: any, filterItem: any) { return filterItem.ItemType == Item.Item_x0020_Type && filterItem.PortfolioType == Item.Portfolio_x0020_Type }));
                    if (IconUrlItem != undefined && IconUrlItem.length > 0) {
                        IconUrl = IconUrlItem[0].ImageUrl;
                    }
                }
            }
        }
        return IconUrl;
    }
    const getTeamLeadersName = function (Items: any, Item: any) {
        if (Items != undefined) {
            $.each(Items.results, function (index: any, user: any) {
                $.each(AllUsers, function (index: any, item: any) {
                    if (user.Id == item.AssingedToUserId) {
                        Item.AllTeamName = Item.AllTeamName + item.Title + ' ';
                    }
                });
            })
        }
    }
    var Mainarray: any = []
    var AllTasks: any = [];
    var CopyTaskData: any = [];
    var isItemExistsNew = function (array: any, items: any) {
        var isExists = false;
        $.each(array, function (index: any, item: any) {
            if (item.Id == items.Id && items.siteType == item.siteType) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const findTaggedComponents = function (task: any) {
        task.Portfolio_x0020_Type = 'Component';
        task.isService = false;
        if (pageType == 'Component-Portfolio') {
            $.each(task['Component']['results'], function (index: any, componentItem: any) {
                for (var i = 0; i < ComponetsData['allComponets'].length; i++) {
                    let crntItem = ComponetsData['allComponets'][i];
                    if (componentItem.Id == crntItem.Id) {
                        if (crntItem.PortfolioStructureID != undefined && crntItem.PortfolioStructureID != '') {
                            task.PortfolioStructureID = crntItem.PortfolioStructureID;
                            task.ShowTooltipSharewebId = crntItem.PortfolioStructureID + '-' + task.Shareweb_x0020_ID;
                        }
                        if (crntItem.Portfolio_x0020_Type == 'Service') {
                            task.isService = true;
                            task.Portfolio_x0020_Type = 'Service';
                        }
                        if (ComponetsData['allComponets'][i]['childs'] == undefined)
                            ComponetsData['allComponets'][i]['childs'] = [];
                        if (!isItemExistsNew(ComponetsData['allComponets'][i]['childs'], task))
                            ComponetsData['allComponets'][i]['childs'].push(task);
                        break;
                    }
                }
            });
        }
    }
    var pageType = 'Component-Portfolio';
    var ComponetsData: any = {};
    ComponetsData.allUntaggedTasks = []
    const bindData = function () {
        $.each(ComponetsData['allComponets'], function (index: any, result: any) {
            result.TeamLeaderUser = []
            result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')
            result.flag = true;
            if (result.DueDate == 'Invalid date' || '') {
                result.DueDate = result.DueDate.replaceAll("Invalid date", "")
            }
            result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
            if (result.Short_x0020_Description_x0020_On != undefined) {
                result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
            }
            result['siteType'] = 'Master Tasks';
            result['SiteIcon'] = GetIconImageUrl(result.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
            if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                $.each(result.AssignedTo, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(Response, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                            }
                        })
                    }
                })
            }
            if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.results != undefined && result.Team_x0020_Members.results.length > 0) {
                $.each(result.Team_x0020_Members.results, function (index: any, Assig: any) {
                    if (Assig.Id != undefined) {
                        $.each(TaskUsers, function (index: any, users: any) {
                            if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                users.ItemCover = users.Item_x0020_Cover;
                                result.TeamLeaderUser.push(users);
                            }
                        })
                    }
                })
            }
            if (result.PortfolioStructureID != null && result.PortfolioStructureID != undefined) {
                result['Shareweb_x0020_ID'] = result.PortfolioStructureID;
            }
            else {
                result['Shareweb_x0020_ID'] = '';
            }
            if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                    result.ClientCategory.push(catego);
                })
            }
            if (result.Item_x0020_Type == 'Root Component') {
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                RootComponentsData.push(result);
            }
            if (result.Item_x0020_Type == 'Component') {
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                result.SiteIcon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png'
                ComponentsData.push(result);
            }
            if (result.Item_x0020_Type == 'SubComponent') {
                result.SiteIcon = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                SubComponentsData.push(result);
            }
            if (result.Item_x0020_Type == 'Feature') {
                result.SiteIcon = "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"
                result['childs'] = result['childs'] != undefined ? result['childs'] : [];
                FeatureData.push(result);
            }
        });
        $.each(SubComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(FeatureData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp['childs'].push(featurecomp);;
                    }
                })
            }
        })
        $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Title != undefined) {
                $.each(SubComponentsData, function (index: any, featurecomp: any) {
                    if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                        subcomp['childs'].push(featurecomp);;
                    }
                })
            }
        })
        var id = getQueryVariable('taskId');
        var arrys: any = [];
        $.each(ComponentsData, function (index: any, subcomp: any) {
            if (subcomp.Id == id)
                arrys.push(subcomp.childs)
            if (subcomp.childs != undefined && subcomp.childs.length > 0) {
                $.each(subcomp.childs, function (index: any, Nextcomp: any) {
                    if (Nextcomp.childs.Id == id)
                        arrys.push(Nextcomp.childs)
                    if (Nextcomp.childs != undefined && Nextcomp.childs.length > 0) {
                        $.each(Nextcomp.childs, function (index: any, Nextnextcomp: any) {
                            if (Nextnextcomp.Id == id)
                                arrys.push(Nextnextcomp.childs);
                        })
                    }
                })
            }
        })
        $.each(arrys, function (index: any, item: any) {
            if (item.childs != undefined) {
                $.each(item.childs, function (index: any, childItem: any) {
                    if (item.PortfolioStructureID == childItem.PortfolioStructureID) {
                        Mainarray.push(childItem)
                    }
                })
            }
        })
        //maidataBackup.push(ComponentsData)
        arrys.map((item: any) => {
            if (item.length > 0) {
                setmaidataBackup(item)
                setData(item);
            }
        })
        showProgressHide();
    }
    var makeFinalgrouping = function () {
        var AllTaskData1: any = [];
        AllTaskData1 = AllTaskData1.concat(TasksItem);
        $.each(AllTaskData1, function (index: any, task: any) {
            task.Portfolio_x0020_Type = 'Component';
            if (pageType == 'Component-Portfolio') {
                if (task['Component'] != undefined && task['Component']['results'].length > 0) {
                    task.Portfolio_x0020_Type = 'Component';
                    findTaggedComponents(task);
                }
                // Services
                else if (task['Services'] != undefined && task['Services']['results'].length == 0 && task['Events'] != undefined && task['Events']['results'].length == 0) {
                    ComponetsData['allUntaggedTasks'].push(task);
                }
            }
        })
        bindData();
    }
    const filterDataBasedOnList = function () {
        //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
        //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTaskData));
        //$scope.AllTaskData = $scope.CopyTaskData.map(function (value) { value = Object.create(value); return value });
        var AllTaskData1: any = [];
        AllTaskData1 = AllTaskData1.concat(CopyTaskData);
        // CountOfAWTStructuredData();
        var SelectedList: any = [];
        $.each(filterItems, function (index: any, config: any) {
            if (config.Selected && config.TaxType == 'Sites') {
                SelectedList.push(config);
            }
            if (config.childs != undefined && config.childs.length > 0) {
                $.each(config.childs, function (index: any, child: any) {
                    if (child.Selected && child.TaxType == 'Sites') {
                        SelectedList.push(child);
                    }
                })
            }
        })
        var AllTaggedTask: any = [];
        $.each(SelectedList, function (index: any, item: any) {
            $.each(AllTaskData1, function (index: any, task: any) {
                if ((item.Title).toLowerCase() == (task.siteType).toLowerCase()) {
                    AllTaggedTask.push(task);
                }
            })
        })
        if (AllTaggedTask != undefined) {
            //$scope.AllTaskData = $scope.AllTaggedTask.map(function (value) { value = Object.create(value); return value });
            AllTaskData1 = AllTaggedTask;
        }
        makeFinalgrouping();
        //  makeGroupingBasedOnLevel();
    }
    var TasksItem: any = [];
    const LoadAllSiteTasks = function () {
        var query = "&$filter=Status ne 'Completed'&$orderby=Created desc&$top=4999";
        var Counter = 0;
        $.each(siteConfig, function (index: any, config: any) {
            if (config.Title != 'SDC Sites') {
                //     $.each($scope.filterItems, function (filter) {
                //         if (config.Title == filter.Title) {
                //             filter.DataLoad = true;
                //         }
                //         if (filter.childs != undefined && filter.childs.length > 0) {
                //             angular.forEach(filter.childs, function (child) {
                //                 if (config.Title == child.Title) {
                //                     child.DataLoad = true;
                //                 }
                //             })
                //         }
                //     })
                config.DataLoad = true;
                var Response: any = []
                var select = "ParentTask/Title,ParentTask/Id,Services/Title,ClientTime,Services/Id,Events/Id,Events/Title,ItemRank,Portfolio_x0020_Type,SiteCompositionSettings,SharewebTaskLevel1No,SharewebTaskLevel2No,TimeSpent,BasicImageInfo,OffshoreComments,OffshoreImageUrl,CompletedDate,Shareweb_x0020_ID,Responsible_x0020_Team/Id,Responsible_x0020_Team/Title,SharewebCategories/Id,SharewebCategories/Title,ParentTask/Shareweb_x0020_ID,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,ClientCategory/Id,ClientCategory/Title,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,ClientCategory,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=ParentTask,Events,Services,SharewebTaskType,AssignedTo,Component,ClientCategory,Author,Editor,Team_x0020_Members,Responsible_x0020_Team,SharewebCategories";
                if (config.Title == 'Master Tasks') {
                    select = "ComponentCategory/Id,ComponentCategory/Title,Services/Title,Services/Id,Events/Id,Events/Title,SiteCompositionSettings,ShortDescriptionVerified,Portfolio_x0020_Type,BackgroundVerified,descriptionVerified,Synonyms,BasicImageInfo,OffshoreComments,OffshoreImageUrl,HelpInformationVerified,IdeaVerified,TechnicalExplanationsVerified,Deliverables,DeliverablesVerified,ValueAddedVerified,CompletedDate,SharewebTaskType/Id,SharewebTaskType/Title,SharewebTaskType/Level,Idea,ValueAdded,TechnicalExplanations,Item_x0020_Type,Sitestagging,Package,Parent/Id,Parent/Title,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,SharewebComponent/Id,SharewebCategories/Id,SharewebCategories/Title,Priority_x0020_Rank,Reference_x0020_Item_x0020_Json,Team_x0020_Members/Title,Team_x0020_Members/Name,Component/Id,Component/Title,Component/ItemType,Team_x0020_Members/Id,Item_x002d_Image,component_x0020_link,IsTodaysTask,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,AttachmentFiles/FileName,FileLeafRef,FeedBack,Title,Id,PercentComplete,Company,StartDate,DueDate,Comments,Categories,Status,WebpartId,Body,Mileage,PercentComplete,Attachments,Priority,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title&$expand=SharewebTaskType,ComponentCategory,AssignedTo,Component,Events,Services,AttachmentFiles,Author,Editor,Team_x0020_Members,SharewebComponent,SharewebCategories,Parent";
                }
                var url = "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('" + config.listId + "')/items?$select=" + select + '&$' + query;
                $.ajax({
                    url: url,
                    method: "GET",
                    headers: {
                        "Accept": "application/json; odata=verbose"
                    },
                    success: function (data) {
                        Counter++;
                        $.each(data.d.results, function (index: any, item: any) {
                            item.isDrafted = false;
                            item.flag = true;
                            item.siteType = config.Title;
                            item.childs = [];
                            item.TeamLeaderUser = []
                            item.CreatedDateImg = []
                            if (item.SharewebCategories.results != undefined) {
                                if (item.SharewebCategories.results.length > 0) {
                                    $.each(item.SharewebCategories.results, function (ind: any, value: any) {
                                        if (value.Title.toLowerCase() == 'draft') {
                                            item.isDrafted = true;
                                        }
                                    });
                                }
                            }
                        })
                        AllTasks = AllTasks.concat(data.d.results);
                        AllTasks = $.grep(AllTasks, function (type: any) { return type.isDrafted == false });
                        // var result = $.grep(AllTasks, function (mPho, index) {
                        //     {return mPho.isDrafted == false};
                        // });
                        // $.each(AllTasks,function(index:any,item:any){
                        //     item.TeamLeaderUser=[]
                        // })
                        if (Counter == 18) {
                            $.each(AllTasks, function (index: any, result: any) {
                                //result.TeamLeaderUser = []
                                result.DueDate = Moment(result.DueDate).format('DD/MM/YYYY')
                                if (result.DueDate == 'Invalid date' || '') {
                                    result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                                }
                                result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
                                if (result.Short_x0020_Description_x0020_On != undefined) {
                                    result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                                }
                                if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
                                    $.each(result.AssignedTo, function (index: any, Assig: any) {
                                        if (Assig.Id != undefined) {
                                            $.each(TaskUsers, function (index: any, users: any) {
                                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                                    users.ItemCover = users.Item_x0020_Cover;
                                                    result.TeamLeaderUser.push(users);
                                                }
                                            })
                                        }
                                    })
                                }
                                if (result.Team_x0020_Members != undefined && result.Team_x0020_Members.results != undefined && result.Team_x0020_Members.results.length > 0) {
                                    $.each(result.Team_x0020_Members.results, function (index: any, Assig: any) {
                                        if (Assig.Id != undefined) {
                                            $.each(TaskUsers, function (index: any, users: any) {
                                                if (Assig.Id != undefined && users.AssingedToUserId != undefined && Assig.Id == users.AssingedToUserId) {
                                                    users.ItemCover = users.Item_x0020_Cover;
                                                    result.TeamLeaderUser.push(users);
                                                }
                                            })
                                        }
                                    })
                                }
                                if (result.Author != undefined) {
                                    if (result.Author.Id != undefined) {
                                        $.each(TaskUsers, function (index: any, users: any) {
                                            if (result.Author.Id != undefined && users.AssingedToUserId != undefined && result.Author.Id == users.AssingedToUserId) {
                                                users.ItemCover = users.Item_x0020_Cover;
                                                result.CreatedDateImg.push(users);
                                            }
                                        })
                                    }
                                }
                                result['SiteIcon'] = GetIconImageUrl(result.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP', undefined);
                                if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                                    $.each(result.Team_x0020_Members, function (index: any, catego: any) {
                                        result.ClientCategory.push(catego);
                                    })
                                }
                                result['Shareweb_x0020_ID'] = getSharewebId(result);
                                if (result['Shareweb_x0020_ID'] == undefined) {
                                    result['Shareweb_x0020_ID'] = "";
                                }
                                TasksItem.push(result);
                                if (result.ClientCategory != undefined && result.ClientCategory.results != undefined && result.ClientCategory.results.length > 0) {
                                    $.each(result.ClientCategory.results, function (index: any, clientcategory: any) {
                                        result.ClientCategoryTitle = result.ClientCategoryTitle + ';' + clientcategory.Title;
                                    })
                                    $.each(TaxonomyItems, function (newindex: any, firstLevel: any) {
                                        $.each(result.ClientCategory.results, function (index: any, clientcategory: any) {
                                            if (clientcategory.ParentClientCategoryStructure == undefined)
                                                clientcategory.ParentClientCategoryStructure = '';
                                            if (firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title != undefined) {
                                                clientcategory.ParentClientCategoryStructure = firstLevel.Parent.Title + '>' + firstLevel.Title;
                                            }
                                            else if (firstLevel.Id == clientcategory.Id && firstLevel.Parent.Title == undefined) {
                                                clientcategory.ParentClientCategoryStructure = firstLevel.Title;
                                            }
                                        })
                                        if (firstLevel.childs != undefined && firstLevel.childs.length > 0) {
                                            $.each(firstLevel.childs, function (index: any, SecondLevel: any) {
                                                $.each(result.ClientCategory.results, function (index: any, clientcategory: any) {
                                                    if (clientcategory.ParentClientCategoryStructure == undefined)
                                                        clientcategory.ParentClientCategoryStructure = '';
                                                    if (SecondLevel.Id == clientcategory.Id && SecondLevel.Parent.Title != undefined) {
                                                        clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + SecondLevel.Title;
                                                    }
                                                })
                                                if (SecondLevel.childs != undefined && SecondLevel.childs.length > 0) {
                                                    $.each(SecondLevel.childs, function (index: any, ThirdLevel: any) {
                                                        $.each(result.ClientCategory.results, function (index: any, clientcategory: any) {
                                                            if (clientcategory.ParentClientCategoryStructure == undefined)
                                                                clientcategory.ParentClientCategoryStructure = '';
                                                            if (ThirdLevel.Id == clientcategory.Id && ThirdLevel.Parent.Title != undefined) {
                                                                clientcategory.ParentClientCategoryStructure = SecondLevel.Parent.Title + '>' + ThirdLevel.Parent.Title + '>' + ThirdLevel.Title;
                                                            }
                                                        })
                                                    })
                                                }
                                            })
                                        }
                                    })
                                } else result.ClientCategory = [];
                                // task['Item_x0020_Type'] = 'Task';
                                // task['flag'] = true;
                                // task['newTitle'] = task.Title;
                                // task['childsLength'] = 0;
                                // task['childs'] = [];
                                // task['select'] = false;
                                // task['isShifted'] = false;
                                // task['mailcomments'] = '';
                                // if (task['Body'] != "") {
                                //     task['WordCount'] = countOfWord(task['Body']);
                                // }
                                // task.Short_x0020_Description_x0020_On = []
                                // if (task.FeedBack != undefined && task.FeedBack[0] != '' && parseJSON(task.FeedBack) != undefined && parseJSON(task.FeedBack)[0] != undefined && parseJSON(task.FeedBack)[0] != '') {
                                //     task.Short_x0020_Description_x0020_On = parseJSON(task.FeedBack)[0].FeedBackDescriptions
                                //     if (task.Short_x0020_Description_x0020_On[0] != undefined && task.Short_x0020_Description_x0020_On[0] != '' && task.Short_x0020_Description_x0020_On[0].Title != '' && task.Short_x0020_Description_x0020_On[0].Title != undefined)
                                //         task['searchSortDescription'] = task.Short_x0020_Description_x0020_On[0].Title.replace(/<\/?.+?>/ig, '');
                                // }
                                // $.each(task.Short_x0020_Description_x0020_On, function (index: any, item: any) {
                                //     $.each(item.Comments, function (index: any, com: any) {
                                //         task['searchSortDescription'] = com.Title;
                                //     })
                                // })
                                // if (task.Comments != undefined && task.Comments != '' && task.Comments != null && task.Comments != 'Done')
                                //     task.mailComment = parseJSON(task.Comments)
                                // $.each(task.mailComment, function (index: any, item: any) {
                                //     task['mailcomments'] += item.Description
                                // })
                                // task['PortfolioItemsId'] = undefined
                                // if (task.Component.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Component.results[0].Id;
                                // }
                                // else if (task.Services.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Services.results[0].Id;
                                // }
                                // else if (task.Events.results.length > 0) {
                                //     task['PortfolioItemsId'] = task.Events.results[0].Id;
                                // }
                                // if (task.SharewebTaskType.Title == undefined) {
                                //     task.SharewebTaskType.Title = 'Task';
                                // }
                                // task['Shareweb_x0020_ID'] = getSharewebId(index, task);
                                // if (task['Shareweb_x0020_ID'] == undefined) {
                                //     task['Shareweb_x0020_ID'] = "";
                                // }
                                // if (task['DateModified'] != undefined) task['Modified'] = Moment(task['DateModified']).format('DD/MM/YYYY'); //new Date(task['DateModified']).format('dd/MM/yyyy');
                                // if (task['Created'] != undefined) task['Created'] = Moment(task['Created']).format('DD/MM/YYYY'); //new Date(task['Created']).format('dd/MM/yyyy');
                                // if (task['CompletedDate'] != undefined) task['DateTaskDueDate'] = Moment(task['CompletedDate']).format('DD/MM/YYYY'); //new Date(task['CompletedDate']);
                                // if (task['CompletedDate'] != undefined) task['CompletedDate'] = Moment(task['CompletedDate']).format('DD/MM/YYYY'); //new Date(task['CompletedDate']).format('dd/MM/yyyy');
                                // if (task['StartDate'] != undefined) task['StartDate'] = Moment(task['StartDate']).format('DD/MM/YYYY'); //new Date(task['StartDate']).format('dd/MM/yyyy');
                                // if (task['DueDate'] != undefined) {
                                //     task['MainDueDate'] = (task.DueDate);
                                //     var dateE = (new Date(task.DueDate));
                                //     task.NewestDueDate = dateE.setDate(dateE.getDate());
                                // }
                                // task['SiteIcon'] = GetIconImageUrl(task.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP', '');
                                // if (task['DueDate'] != undefined) task['DueDate'] = Moment(task['DueDate']).format('DD/MM/YYYY'); //new Date(task['DueDate']).toString('dd/MM/yyyy');
                                // task.AssignedUser = [];
                                // task.TeamMemberUser = [];
                                // task.AllTeamName = '';
                                // task['AdditionalTeam'] = [];
                                // task['CompleteStructure'] = makeFullStructureOfPortfolioTaskDatabase(task, AllTasks);
                                // task.TeamLeaderUser = []
                                // getTeamLeadersName(task.Responsible_x0020_Team, task);
                                // getTeamLeadersName(task.Team_x0020_Members, task);
                                // // getTeamLeadersShowImage(task.Responsible_x0020_Team, task.AssignedUser, task['AdditionalTeam']);
                                // // getTeamLeadersShowImage(task.Team_x0020_Members, task.TeamMemberUser, task['AdditionalTeam']);
                                // TasksItem.push(task);
                                // task['AdditionalTeamName'] = '';
                                // $.each(task['AdditionalTeam'], function (index: any, team: any) {
                                //     task['AdditionalTeamName'] += "<div>" + (index + 1) + ". " + team.Title + "</div>";
                                // });
                            })
                            TasksItem = TasksItem.concat(AllTasks);
                            console.log(Response);
                            $.each(TasksItem, function (index: any, task: any) {
                                if (!isItemExistsNew(CopyTaskData, task)) {
                                    CopyTaskData.push(task);
                                }
                            })
                            filterDataBasedOnList();
                            // $scope.Advancefilter();
                        }
                        // if (data.d.__next) {
                        //     url = data.d.__next;
                        // }
                        // else setTask(Response);
                    },
                    error: function (error) {
                        Counter++;
                    }
                });
            } else Counter++;
        })
    }
    function Buttonclick(e: any) {
        e.preventDefault();
        this.setState({ callchildcomponent: true });
    }
    const setModalIsOpenToFalse = () => {
        setModalIsOpen(false)
    }
    const setModalTimmeIsOpenToFalse = () => {
        setTimeModalIsOpen(false)
    }
    const closeModal = () => {
        setAddModalOpen(false)
    }
    const Prints = () => {
        window.print();
    }
    // ---------------------Export to Excel-------------------------------------------------------------------------------------
    const getCsvData = () => {
        const csvData = [['Title']];
        let i;
        for (i = 0; i < data.length; i += 1) {
            csvData.push([`${data[i].Title}`]);
        }
        return csvData;
    };
    const clearSearch = () => {
        setSearch('')
    }
    // const openEditPopup = () => {
    //     setEditpopup(true)
    // }
    // const EditpopupClose = () => {
    //     setEditpopup(false)
    // }
    const openexpendTime = () => {
        setcollapseItem(true)
    }
    const collapseTime = () => {
        setcollapseItem(false)
    }
    //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------
    const getStructurefTimesheetCategories = function () {
        $.each(TaskTimeSheetCategories, function (index: any, item: any) {
            $.each(TaskTimeSheetCategories, function (index: any, val: any) {
                if (item.ParentID == 0 && item.Id == val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
            $.each(TaskTimeSheetCategoriesGrouping, function (index: any, val: any) {
                if (item.ParentID == 0 && item.Id == val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        $.each(metadataItems, function (index: any, taxItem: any) {
            if (taxItem.TaxType == taxType)
                Items.push(taxItem);
        });
        return Items;
    }
    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];
    var AllTimeSpentDetails: any = [];
    var isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        $.each(arr, function (index: any, item: any) {
            if (item.Id == Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const checkCategory = function (item: any, category: any) {
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
            if (categoryTitle.Id == category) {
                // item.isShow = true;
                if (categoryTitle.Childs.length == 0) {
                    categoryTitle.Childs = [];
                }
                if (!isItemExists(categoryTitle.Childs, item.Id)) {
                    item.show = true;
                    categoryTitle.Childs.push(item);
                }
            }
        })
    }
    const getStructureData = function () {
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.TimesheetTitle.Id == undefined) {
                item.Expanded = true;
                item.isAvailableToDelete = false;
                $.each(AllTimeSpentDetails, function (index: any, val: any) {
                    if (val.TimesheetTitle.Id != undefined && val.TimesheetTitle.Id == item.Id) {
                        val.isShifted = true;
                        val.show = true;
                        $.each(val.AdditionalTime, function (index: any, value: any) {
                            value.ParentID = val.Id;
                            value.siteListName = val.__metadata.type;
                            value.MainParentId = item.Id;
                            value.AuthorTitle = val.Author.Title;
                            value.EditorTitle = val.Editor.Title;
                            value.show = true;
                            if (val.Created != undefined)
                                //  value.TaskTimeCreatedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Created, 'DD/MM/YYYY HH:mm');
                                if (val.Modified != undefined)
                                    // value.TaskTimeModifiedDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(val.Modified, 'DD/MM/YYYY HH:mm');
                                    item.AdditionalTime.push(value);
                        })
                    }
                })
            }
        })
        AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) { return type.isShifted == false });
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.AdditionalTime.length == 0) {
                item.isAvailableToDelete = true;
            }
            // if (item.AdditionalTime != undefined && item.AdditionalTime.length > 0) {
            //    // var sortArray = sortArray.conct(item.AdditionalTime);
            //     // SharewebCommonFactoryService.DynamicSortitems(sortArray, 'ID', 'Number', 'Descending');
            //     var TimeTaskId = sortArray[0].ID;
            //     var TimeTaskId = TimeTaskId + 1;
            //     $.each(sortArray, function (index: any, first: any) {
            //         var count = 0;
            //         $.each(item.AdditionalTime, function (index2: any, second: any) {
            //             if (second.ID != 0 && second.ID == undefined) {
            //                 second.ID = TimeTaskId;
            //                 TimeTaskId = TimeTaskId + 1;
            //             }
            //             else if (second.ID != undefined && first.ID == second.ID) {
            //                 if (count != 0) {
            //                     second.ID = TimeTaskId;
            //                     TimeTaskId = TimeTaskId + 1;
            //                 }
            //                 count++;
            //             }
            //         })
            //     })
            // }
            if (item.AdditionalTime != undefined && item.AdditionalTime.length > 0) {
                $.each(item.AdditionalTime, function (index: any, type: any) {
                    if (type.Id != undefined)
                        type.Id = type.ID;
                })
            }
        });
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.AdditionalTime.length > 0) {
                $.each(item.AdditionalTime, function (index: any, val: any) {
                    var NewDate = val.TaskDate;
                    try {
                        getDateForTimeEntry(NewDate, val);
                    } catch (e) { }
                })
            }
        })
        $.each(AllTimeSpentDetails, function (index: any, item: any) {
            if (item.Category.Title == undefined)
                checkCategory(item, 319);
            else
                checkCategory(item, item.Category.Id);
        })
        var IsTimeSheetAvailable = false;
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
            if (item.Childs.length > 0) {
                IsTimeSheetAvailable = true;
            }
        });
        setTimeSheet(TaskTimeSheetCategoriesGrouping);
        setModalIsTimeOpenToTrue();
    }
    const getDateForTimeEntry = function (newDate: any, items: any) {
        var LatestDate = [];
        var getMonth = '';
        var combinedDate = '';
        LatestDate = newDate.split('/');
        switch (LatestDate[1]) {
            case "01":
                getMonth = 'January ';
                break;
            case "02":
                getMonth = 'Febuary ';
                break;
            case "03":
                getMonth = 'March ';
                break;
            case "04":
                getMonth = 'April ';
                break;
            case "05":
                getMonth = 'May ';
                break;
            case "06":
                getMonth = 'June ';
                break;
            case "07":
                getMonth = 'July ';
                break;
            case "08":
                getMonth = 'August ';
                break;
            case "09":
                getMonth = 'September'
                break;
            case "10":
                getMonth = 'October ';
                break;
            case "11":
                getMonth = 'November ';
                break;
            case "12":
                getMonth = 'December ';
                break;
        }
        combinedDate = LatestDate[0] + ' ' + getMonth + ' ' + LatestDate[2];
        var dateE = new Date(combinedDate);
        items.NewestCreated = dateE.setDate(dateE.getDate());
    }
    var AllTimeSpentDetails: any = [];
    const EditData = (e: any, item: any) => {
        TaskTimeSheetCategories = getSmartMetadataItemsByTaxType(AllMetadata, 'TimesheetCategories');
        TaskTimeSheetCategoriesGrouping = TaskTimeSheetCategoriesGrouping.concat(TaskTimeSheetCategories);
        TaskTimeSheetCategoriesGrouping.push({ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(319)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 319, "Title": "Others", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": null, "TaxType": "TimesheetCategories", "Selectable": true, "ParentID": "ParentID", "SmartSuggestions": false, "ID": 319 });
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
            categoryTitle.Childs = [];
            categoryTitle.Expanded = true;
            categoryTitle.flag = true;
            // categoryTitle.AdditionalTime = [];
            categoryTitle.isAlreadyExist = false;
            categoryTitle.AdditionalTimeEntry = undefined;
            categoryTitle.Author = {};
            categoryTitle.AuthorId = 0;
            categoryTitle.Category = {};
            categoryTitle.Created = undefined;
            categoryTitle.Editor = {};
            categoryTitle.Modified = undefined
            categoryTitle.TaskDate = undefined
            categoryTitle.TaskTime = undefined
            categoryTitle.TimesheetTitle = [];
        });
        getStructurefTimesheetCategories();
        setEditItem(item.Title);
        var filteres = "Task" + item.siteType + "/Id eq " + item.Id;
        var select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres + "";
        var count = 0;
        var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },
        // { 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select + "" },
        { 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('11d52f95-4231-4852-afde-884d548c7f1b')/items?$select=" + select + "" }]
        $.each(allurls, function (index: any, item: any) {
            $.ajax({
                url: item.Url,
                method: "GET",
                headers: {
                    "Accept": "application/json; odata=verbose"
                },
                success: function (data) {
                    count++;
                    if (data.d.results != undefined && data.d.results.length > 0) {
                        AllTimeSpentDetails = AllTimeSpentDetails.concat(data.d.results);
                    }
                    if (allurls.length == count) {
                        //  var AllTimeSpentDetails = data.d.results;
                        let TotalPercentage = 0
                        let TotalHours = 0;
                        let totletimeparentcount = 0;
                        //  let totletimeparentcount = 0;
                        let AllAvailableTitle = [];
                        $.each(AllTimeSpentDetails, function (index: any, item: any) {
                            item.IsVisible = false;
                            item.Item_x005F_x0020_Cover = undefined;
                            item.Parent = {};
                            item.ParentID = 0;
                            item.ParentId = 0;
                            item.ParentType = undefined
                            item.Selectable = undefined;
                            item.SmartFilters = undefined;
                            item.SmartSuggestions = undefined;
                            item.isAlreadyExist = false
                            item.listId = null;
                            item.siteName = null
                            item.siteUrl = null;
                            if (item.TimesheetTitle.Id != undefined) {
                                if (item.AdditionalTimeEntry != undefined && item.AdditionalTimeEntry != '') {
                                    try {
                                        item.AdditionalTime = JSON.parse(item.AdditionalTimeEntry);
                                        if (item.AdditionalTime.length > 0) {
                                            $.each(item.AdditionalTime, function (index: any, additionalTime: any) {
                                                var time = parseFloat(additionalTime.TaskTime)
                                                if (!isNaN(time)) {
                                                    totletimeparentcount += time;
                                                    // $scope.totletimeparentcount += time;;
                                                }
                                            });
                                        }
                                        //$scope.AdditionalTimeSpent.push(item.AdditionalTime[0]);
                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                                $.each(AllUsers, function (index: any, taskUser: any) {
                                    if (taskUser.AssingedToUserId == item.AuthorId) {
                                        item.AuthorName = taskUser.Title;
                                        item.AuthorImage = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
                                    }
                                });
                                if (item.TaskTime != undefined) {
                                    var TimeInHours = item.TaskTime / 60;
                                    // item.IntegerTaskTime = item.TaskTime / 60;
                                    item.TaskTime = TimeInHours.toFixed(2);
                                }
                            } else {
                                AllAvailableTitle.push(item);
                            }
                            if (item.AdditionalTime == undefined) {
                                item.AdditionalTime = [];
                            }
                            // item.ServerTaskDate = angular.copy(item.TaskDate);
                            // item.TaskDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.TaskDate, 'DD/MM/YYYY');
                            item.isShifted = false;
                        })
                        getStructureData();
                    }
                },
                error: function (error) {
                    count++;
                    if (allurls.length == count)
                        getStructureData();
                }
            })
        })
        // spRequest.onreadystatechange = function () {
        //     if (spRequest.readyState === 4 && spRequest.status === 200) {
        //         var result = JSON.parse(spRequest.responseText);
        //         if (result.value.ItemType == "Group") {
        //             result.value.UserType = "Group"
        //         }
        //         else {
        //             setEditdata(result.value)
        //         }
        //     }
        //     else if (spRequest.readyState === 4 && spRequest.status !== 200) {
        //         console.log('Error Occurred !');
        //     }
        //     setModalIsTimeOpenToTrue();
        // };
        // spRequest.send();
    }
    const handleTitle = (e: any) => {
        setTitle(e.target.value)
    };
    function AddItem() {
        var MyData = JSON.stringify({
            '__metadata': {
                'type': 'SP.Data.Master_x0020_TasksListItem'
            },
            "Title": Title,
            "Item_x0020_Type": itemType,
            "Portfolio_x0020_Type": 'Component'
        })
        $.ajax({
            url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/contextinfo",
            type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose"
            },
            success: function (contextData: any) {
                $.ajax({
                    url: "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('ec34b38f-0669-480a-910c-f84e92e58adf')/items",
                    method: "POST",
                    contentType: "application/json;odata=verbose",
                    data: MyData,
                    async: false,
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": contextData.d.GetContextWebInformation.FormDigestValue,
                        "IF-MATCH": "*",
                        "X-HTTP-Method": "POST"
                    },
                    success: function (data: any) {
                        alert('success');
                        setModalIsOpenToFalse();
                        window.location.reload();
                    },
                    error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                        alert('error');
                    }
                });
            },
            error: function (jqXHR: any, textStatus: any, errorThrown: any) {
                alert('error');
            }
        });
    }
    // React.useEffect(()=>{
    //     eventBus.on("Successful", (data:any) =>
    //     setPassData({data:selected2)
    //   );
    // },[])
    var myarray: any = [];
    var myarray1: any = [];
    var myarray2: any = [];
    if (props.Sitestagging != null) {
        myarray.push(JSON.parse(props.Sitestagging));
    }
    if (myarray.length != 0) {
        myarray[0].map((items: any) => {
            if (items.SiteImages != undefined && items.SiteImages != '') {
                items.SiteImages = items.SiteImages.replace('https://www.hochhuth-consulting.de', 'https://hhhhteams.sharepoint.com/sites/HHHH')
                myarray1.push(items)
            }
            // console.log(myarray1);
            // if (items.ClienTimeDescription != undefined) {
            //     items.ClienTimeDescription = parseFloat(item.ClienTimeDescription);
            //     myarray1.push(items)
            // }
        })
        if (props.ClientCategory.results.length != 0) {
            props.ClientCategory.results.map((terms: any) => {
                //     if(myarray2.length!=0 && myarray2[0].title==terms.title){
                //                ""
                //     }else{
                //    myarray2.push(terms);
                // }
                myarray2.push(terms);
            })
        }
        //    const letters = new Set([myarray2]);
        // console.log(myarray2)
        // myarray.push();
    }
    const [lgShow, setLgShow] = React.useState(false);
    const handleClose = () => setLgShow(false);
    const [lgNextShow, setLgNextShow] = React.useState(false);
    const handleCloseNext = () => setLgNextShow(false);
    const [CreateacShow, setCreateacShow] = React.useState(false);
    const handleCreateac = () => setCreateacShow(false);
    // Add activity popup array
    var SomeMetaData1 = [{ "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 15, "Title": "MileStone", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": [] }, "SortOrder": 2, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": null, "ID": 15 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(105)", "etag": "\"4\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 105, "Title": "Development", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png" }, "SmartFilters": null, "SortOrder": 3, "TaxType": "Category", "Selectable": true, "ParentID": 0, "SmartSuggestions": null, "ID": 105 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(282)", "etag": "\"1\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 282, "Title": "Implementation", "siteName": null, "siteUrl": null, "listId": null, "Description1": "This should be tagged if a task is for applying an already developed component/subcomponent/feature.", "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "/SiteCollectionImages/ICONS/Shareweb/Implementation.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png" }, "SmartFilters": null, "SortOrder": 4, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": false, "ID": 282 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/;Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(11)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 11, "Title": "Bug", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png" }, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": ["MetaSearch", "Dashboard"] }, "SortOrder": 2, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": null, "ID": 11 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(96)", "etag": "\"5\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 96, "Title": "Feedback", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png" }, "SmartFilters": null, "SortOrder": 2, "TaxType": null, "Selectable": true, "ParentID": 0, "SmartSuggestions": false, "ID": 96 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(191)", "etag": "\"3\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 191, "Title": "Improvement", "siteName": null, "siteUrl": null, "listId": null, "Description1": "Use this task category for any improvements of EXISTING features", "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" }, "SmartFilters": null, "SortOrder": 12, "TaxType": "Categories", "Selectable": true, "ParentID": 24, "SmartSuggestions": false, "ID": 191 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(12)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 12, "Title": "Design", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": { "__metadata": { "type": "SP.FieldUrlValue" }, "Description": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png", "Url": "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" }, "SmartFilters": { "__metadata": { "type": "Collection(Edm.String)" }, "results": ["MetaSearch", "Dashboard"] }, "SortOrder": 4, "TaxType": "Categories", "Selectable": true, "ParentID": 165, "SmartSuggestions": null, "ID": 12 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(100)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 100, "Title": "Activity", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": 4, "TaxType": null, "Selectable": true, "ParentID": null, "SmartSuggestions": null, "ID": 100 }, { "__metadata": { "id": "Web/Lists(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)", "uri": "https://hhhhteams.sharepoint.com/sites/HHHH/_api/Web/Lists;(guid'5ea288be-344d-4c69-9fb3-5d01b23dda25')/Items(281)", "etag": "\"13\"", "type": "SP.Data.SmartMetadataListItem" }, "Id": 281, "Title": "Task", "siteName": null, "siteUrl": null, "listId": null, "Description1": null, "IsVisible": true, "Item_x005F_x0020_Cover": null, "SmartFilters": null, "SortOrder": 4, "TaxType": null, "Selectable": true, "ParentID": null, "SmartSuggestions": null, "ID": 281 }] as unknown as { siteName: any, siteUrl: any, listId: any, Description1: any, results: any[], SmartSuggestions: any, SmartFilters: any }[];
    console.log(siteConfig)
    return (
        <div className={props.Portfolio_x0020_Type == 'Service' ? 'serviepannelgreena' : ""}>
            {/* Add activity task */}
            <Modal
                show={lgShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Select Client Category</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleClose}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Please select any one Client Category.
                    </span>
                    <div>
                        {myarray2.map((item: any) => {
                            return (
                                <div>  {item.Title}</div>
                            )
                        })}
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setLgNextShow(true)}>
                        Ok
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End of Add activity task */}
            {/* After Add activity task */}
            <Modal
                show={lgNextShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Create Task</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleCloseNext}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Clear Selection
                    </span>
                    <div>
                        {SomeMetaData1.map((item: any) => {
                            return (
                                <span>
                                    {item.Item_x005F_x0020_Cover != null &&
                                        <img src={item.Item_x005F_x0020_Cover.Url} />
                                    }
                                    <p onClick={() => setCreateacShow(true)}>{item.Title}</p>
                                </span>
                            )
                        })}
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseNext}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* After Add activity task End */}
            {/* Create task activity popup  */}
            <Modal
                show={CreateacShow}
                aria-labelledby="example-modal-sizes-title-lg">
                <Modal.Header>
                    <Modal.Title>
                        <h6>Create Quick Option</h6>
                    </Modal.Title>
                    <button type="button" className='Close-button' onClick={handleCreateac}></button>
                </Modal.Header>
                <Modal.Body className='p-2'>
                    <span className="bold">
                        Clear Selection
                    </span>
                    <div>
                        {siteConfig!=null &&
                        <>
                        {siteConfig.map((site: any) => {
                            return (
                                <span>
                                    {(site.Title != undefined && site.Title != 'Foundation' && site.Title != 'Master Tasks' && site.Title != 'Gender' && site.Title != 'Health' && site.Title != 'SDC Sites' && site.Title != 'Offshore Tasks') &&
                                        <>
                                            <img src={site.Item_x005F_x0020_Cover.Url} />
                                            <p>{site.Title}</p>
                                        </>
                                    }
                                </span>
                            )
                        })}
                        </>
                    }
                    </div>
                </Modal.Body >
                <Modal.Footer>
                    <Button variant="primary"  >
                        Ok
                    </Button>
                    <Button variant="secondary" onClick={handleCreateac}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* End Create task activity popup  */}
            {/* Smart Time Popup */}
            {/* <Modal
                isOpen={SmartmodalIsOpen}
                onDismiss={setModalSmartIsOpenToFalse}
                isBlocking={true}
                isModeless={true}
            >
                <span >
                    <div id="myDropdown1" className="col-sm-12 pad0 dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Smart Time <span title="Close popup" className="pull-right hreflink"
                                onClick={setModalSmartIsOpenToFalse}>
                                <i className="fa fa-times-circle"  ><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select className="form-control"
                          >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                            </select>
                        </div>
                        <div className="col-md-12 mb-10 mt-10">
                            <input type="text" placeholder="Effort"  className="form-control full-width ng-pristine ng-untouched ng-valid ng-empty" id="txtSmartTime" />
                        </div>
                        <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                               >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Smart Time popup end here */}
            {/* Created Date Popup */}
            {/* <Modal
                isOpen={CreatedmodalIsOpen}
                onDismiss={setModalSmartIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
                <div >
                    <div id="myDropdown4" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Created Date <span title="Close popup" className="pull-right hreflink"
                             onClick={setCreatedmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select id="selectCreatedValue" className="form-control"
                            >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                                <option value="In Between">In Between</option>
                                <option value="Presets">Presets</option>
                            </select>
                        </div>
                        <div
                            className="col-md-12 mb-10 mt-10 has-feedback has-feedback">
                            <input type="date" placeholder="dd/mm/yyyy"
                                className="form-control date-picker" id="txtDate4"
                            />
                            <i className="fa fa-calendar form-control-feedback mt-10"
                                style={{ marginRight: "10px" }}></i>
                        </div>
                        <div className="col-md-12 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                                >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
            {/* Created Date popup end here */}
            {/* Due Date Popup */}
            {/* <Modal
                isOpen={DuemodalIsOpen}
                onDismiss={setDuemodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}
            >
                <div >
                    <div id="myDropdown4" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Due Date <span title="Close popup" className="pull-right hreflink"
                               onClick={setDuemodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-md-12 mb-10 mt-10">
                            <select id="selectCreatedValue" className="form-control"
                             >
                                <option value="">Select</option>
                                <option value="Equal to">Equal to</option>
                                <option value="Greater than">Greater than</option>
                                <option value="Less than">Less than</option>
                                <option value="Not equal to">Not equal to</option>
                                <option value="In Between">In Between</option>
                                <option value="Presets">Presets</option>
                            </select>
                        </div>
                        <div
                            className="col-md-12 mb-10 mt-10 has-feedback has-feedback">
                            <input type="date" placeholder="dd/mm/yyyy"
                                className="form-control date-picker" id="txtDate4"
                              />
                            <i className="fa fa-calendar form-control-feedback mt-10"
                                style={{ marginRight: "10px" }}></i>
                        </div>
                        <div className="col-md-12 text-center PadR0 mb-10 mt-10">
                            <button type="button"
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </Modal> */}
            {/* Due Date popup end here */}
            {/* Team Member Popup */}
            {/* <Modal
                isOpen={TeamMembermodalIsOpen}
                onDismiss={setTeamMembermodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true} >
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Team Members <span title="Close popup" className="pull-right hreflink"
                               onClick={setTeamMembermodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5">
                            <div className="checkbox mb0 ml15">
                                <input  type="checkbox"
                                    name="Responsibility1"
                                    /><span className=" f-500">
                                    Select All
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 PadR0 ml5">
                            {filterGroups.map(function (item) {
                                return (
                                    <>
                                        {item == 'Team Members' &&
                                            <td valign="top">
                                                <fieldset>
                                                    <legend>{item == 'Team Members' && <span>{item}</span>}</legend>
                                                    <legend>{item == 'teamSites' && <span>Sites</span>}</legend>
                                                </fieldset>
                                                {filterItems.map(function (ItemType, index) {
                                                    return (
                                                        <>
                                                            <div style={{ display: "block" }}> {ItemType.Group == item &&
                                                                <>
                                                                    <span className="plus-icon hreflink" onClick={() => handleOpen2(ItemType)}>
                                                                        {ItemType.childs.length > 0 &&
                                                                            <a className='hreflink'
                                                                                title="Tap to expand the childs">
                                                                                {ItemType.showItem ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                    : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                            </a>}
                                                                    </span>
                                                                    {ItemType.TaxType != 'Status' &&
                                                                        <span className="ml-1">
                                                                            <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                            <span className="ml-2">
                                                                                {ItemType.Title}
                                                                            </span>
                                                                        </span>
                                                                    }
                                                                    {ItemType.TaxType == 'Status' &&
                                                                        <span className="ml-2">
                                                                            <input type="checkbox" className="mr0 icon-input" value={ItemType.Title} onChange={(e) => SingleLookDatatest(e, ItemType, index)} />
                                                                            <span className="ml-2">
                                                                                {ItemType.Title}
                                                                            </span>
                                                                        </span>
                                                                    }
                                                                    <ul id="id_{ItemType.Id}"
                                                                        className="subfilter width-85">
                                                                        <span>
                                                                            {ItemType.show && (
                                                                                <>
                                                                                    {ItemType.childs.map(function (child1: any, index: any) {
                                                                                        return (
                                                                                            <>
                                                                                                <div style={{ display: "block" }}>
                                                                                                    {child1.childs.length > 0 && !child1.expanded &&
                                                                                                        <span className="plus-icon hreflink"
                                                                                                         >
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />
                                                                                                        </span>
                                                                                                    }
                                                                                                    {child1.childs.length > 0 && child1.expanded &&
                                                                                                        <span className="plus-icon hreflink"
                                                                                                         >
                                                                                                            <img
                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                        </span>
                                                                                                    }
                                                                                                    <input type="checkbox" className="icon-input mr0" 
                                                                                                        onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child1.Title}
                                                                                                    <ul id="id_{{child1.Id}}" style={{ display: "none" }} className="subfilter"
                                                                                                    >
                                                                                                        {child1.childs.map(function (child2: any) {
                                                                                                            <li>
                                                                                                                <input type="checkbox"
                                                                                                                    onChange={(e) => SingleLookDatatest(e, child1, index)} /> {child2.Title}
                                                                                                            </li>
                                                                                                        })}
                                                                                                    </ul>
                                                                                                </div>
                                                                                            </>
                                                                                        )
                                                                                    })}
                                                                                </>
                                                                            )}
                                                                        </span>
                                                                    </ul>
                                                                </>
                                                            }
                                                            </div>
                                                        </>
                                                    )
                                                })}
                                            </td>
                                        }
                                    </>
                                )
                            })}
                        </div>
                        <div className="col-md-12 text-center padL-0 PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                          >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Team Member popup end here */}
            {/* Item Rank Popup */}
            {/* <Modal
                isOpen={ItemRankmodalIsOpen}
                onDismiss={setItemRankmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}>
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Item Rank <span title="Close popup" className="pull-right hreflink"
                                onClick={setItemRankmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5" >
                            <div className="checkbox mb0 ml15">
                                <input  type="checkbox" name="ItemRank1"
                                   /><span className="f-500">Select All</span>
                            </div>
                        </div>
                        {AllItemRank.map(item => {
                            return (
                                <div className="col-sm-12 PadR0 ml5">
                                    <div className="col-sm-12 padL-0 PadR0 checkbox mb0 ml15"
                                  >
                                        <input type="checkbox"
                                            name="ItemRank" /><span className="">
                                            {item.Title}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                        <div className="col-md-12 padL-0 text-center PadR0 mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Item Rank popup end here */}
            {/* Status Popup */}
            {/* <Modal
                isOpen={StatusmodalIsOpen}
                onDismiss={setStatusmodalIsOpenToFalse}
                isBlocking={false}
                isModeless={true}
            >
                <span >
                    <div id="myDropdown1" className="dropdown-content">
                        <h4 className="col-sm-12 siteColor quickheader">
                            Status <span title="Close popup" className="pull-right hreflink"
                                onClick={setStatusmodalIsOpenToFalse}>
                                <i className="fa fa-times-circle" aria-hidden="true"><FaRegTimesCircle /></i>
                            </span>
                        </h4>
                        <div className="col-sm-12 padL-0 ml5">
                            <div className="checkbox mb0 ml15 f-500">
                                <span className="">
                                    <input  type="checkbox"
                                        name="PercentComplete1"
                                    />
                                    Select All
                                </span>
                            </div>
                        </div>
                        <div className="col-sm-12 PadR0 ml5">
                            {AllItems.map(items => {
                                return (
                                    <div className="col-sm-12 padL-0 PadR0 checkbox mb0 ml15"
                                  >
                                        <input type="checkbox"
                                            name="PercentComplete" /><span className="">
                                            {items.Title}%
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="col-md-12 padL-0 PadR0 text-center mb-10 mt-10">
                            <button type="button" 
                                className="btn btn-primary">
                                Apply
                            </button>
                            <button type="button" className="btn btn-default blocks"
                           >
                                Clear
                            </button>
                        </div>
                    </div>
                </span>
            </Modal> */}
            {/* Status popup end here */}
            <div className="Alltable mt-10">
                <div className="tbl-headings">
                    <span className="leftsec">
                        <span className=''>
                            {props.Portfolio_x0020_Type == 'Component' &&
                                <>
                                    <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />    <a>{props.Title}</a>
                                </>
                            }
                            {props.Portfolio_x0020_Type == 'Service' &&
                                <>
                                    <img className='client-icons' src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png" />  <a>{props.Title}</a>
                                </>}
                        </span>
                         <span className="g-search">
                            <input type="text" className="searchbox_height full_width" id="globalSearch" placeholder="search all"
                                ng-model="SearchComponent.GlobalSearch"/>
                            <span className="gsearch-btn" ng-click="SearchAll_Item()"><i className="fa fa-search"></i></span>
                        </span>
                    </span>
                    <span className="toolbox mx-auto">
                        <button type="button" className="btn btn-primary"
                            onClick={addModal} title=" Add Structure">
                            Add Structure
                        </button>
                        <button type="button"
                            className="btn btn-primary"
                            onClick={() => setLgShow(true)}>
                            <MdAdd />
                            Add Activity-Task
                        </button>
                        <button type="button"
                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                            disabled={true}>
                            Restructure
                        </button>
                        <button type="button"
                            className="btn {{(compareComponents.length==0 && SelectedTasks.length==0)?'btn-grey':'btn-primary'}}"
                            disabled={true}>
                            Compare
                        </button>
                        <a>
                            <Tooltip />
                        </a>
                    </span>
                </div>
                <div className="col-sm-12 pad0 smart">
                    <div className="section-event">
                        <div className="wrapper">
                            <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th style={{ width: "2%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                        <th style={{ width: "6%" }}>
                                            <div style={{ width: "6%" }}></div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input type="search" placeholder="TaskId" className="full_width searchbox_height"
                                                // onChange={(e)=>SearchVale(e,"TaskId")} 
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "23%" }}>
                                            <div style={{ width: "22%" }} className="smart-relative">
                                                <input type="search" placeholder="Title" className="full_width searchbox_height"
                                                //  onChange={(e)=>SearchAll(e)}
                                                />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Client Category"
                                                    title="Client Category" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange(e, "ClientCategory")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="%"
                                                    title="Percentage Complete" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange(e, "ClientCategory")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setStatusmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setStatusmodalIsOpenToTrue} /></i>
                                                                    </span></span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="ItemRank"
                                                    title="Item Rank" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange(e, "ClientCategory")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setItemRankmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setItemRankmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "10%" }}>
                                            <div style={{ width: "9%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Team"
                                                    title="Team" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange(e, "Team")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setTeamMembermodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setTeamMembermodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "9%" }}>
                                            <div style={{ width: "8%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Due Date"
                                                    title="Due Date" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange(e, "Status")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        onClick={setDuemodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setDuemodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "9%" }}>
                                            <div style={{ width: "8%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Created Date"
                                                    title="Created Date" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange(e, "ItemRank")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setCreatedmodalIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setCreatedmodalIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "7%" }}>
                                            <div style={{ width: "6%" }} className="smart-relative">
                                                <input id="searchClientCategory" type="search" placeholder="Smart Time"
                                                    title="Smart Time" className="full_width searchbox_height"
                                                    onChange={(e) => handleChange(e, "Due")} />
                                                <span className="sorticon">
                                                    <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                    <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                </span>
                                                {/* <Dropdown className='dropdown-fliter'>
                                                    <Dropdown.Toggle className='iconsbutton' variant="success" id="dropdown-basic">
                                                        <FaFilter />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                {/* <span className="dropdown filer-icons">
                                                                    <span className="filter-iconfil"
                                                                        //  href="#myDropdown1"
                                                                        onClick={setModalSmartIsOpenToTrue}
                                                                    >
                                                                        <i ><FaFilter onClick={setModalSmartIsOpenToTrue} /></i>
                                                                    </span>
                                                                </span> */}
                                            </div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                        <th style={{ width: "3%" }}>
                                            <div style={{ width: "2%" }}></div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <div id="SpfxProgressbar" style={{ display: "none" }}>
                                        <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                    </div>
                                    {data.length > 0 && data && data.map(function (item, index) {
                                        item.ClientCategory != undefined
                                        if (item.flag == true) {
                                            return (
                                                <>
                                                    <tr >
                                                        <td className="p-0" colSpan={13}>
                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                <tr className="bold for-c0l">
                                                                    <td style={{ width: "2%" }}>
                                                                        {item.childs != undefined && item.childs.length > 0 &&
                                                                            <div className="accordian-header" >
                                                                                <a className='hreflink'
                                                                                    title="Tap to expand the childs">
                                                                                    <div onClick={() => handleOpen(item)} className="sign">{item.childs.length > 0 && item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                    </div>
                                                                                </a>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td style={{ width: "6%" }}>
                                                                        <div className="d-flex">
                                                                            <span className='pe-2'><input type="checkbox" /></span>
                                                                            <span>
                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                    <img className="icon-sites-img ml20" src={item.SiteIcon}></img>
                                                                                </a>
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "7%" }}><span className="ml-2">{item.Shareweb_x0020_ID}</span></td>
                                                                    <td style={{ width: "23%" }}>
                                                                        {item.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" onClick={() => window.open(`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId= + ${item.Id}`, '_blank')}
                                                                        >
                                                                            {item.Title}
                                                                        </a>}
                                                                        {item.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-SPFx.aspx?taskId=" + item.Id + '&Site=' + item.siteType}
                                                                        >{item.Title}
                                                                        </a>}
                                                                        {item.childs != undefined &&
                                                                            <span>{item.childs.length == 0 ? "" : <span className='ms-1'>({item.childs.length})</span>}</span>
                                                                        }
                                                                        {item.Short_x0020_Description_x0020_On != null &&
                                                                            // <span className="project-tool"><img
                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                            //         <span className="tooltiptext">
                                                                            //             <div className="tooltip_Desc">
                                                                            //                 <span>{item.Short_x0020_Description_x0020_On}</span>
                                                                            //             </div>
                                                                            //         </span>
                                                                            //     </span>
                                                                            // </span>
                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                <div className="popover__content">
                                                                                    {item.Short_x0020_Description_x0020_On}
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </td>
                                                                    <td style={{ width: "7%" }}>
                                                                        <div>
                                                                            {(item.ClientCategory.length > 0 && item.ClientCategory != undefined)
                                                                                &&
                                                                                item.ClientCategory.map(function (client: any) {
                                                                                    return (
                                                                                        <span className="ClientCategory-Usericon"
                                                                                            title={client.Title}>
                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                        </span>
                                                                                    )
                                                                                })}
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "7%" }}>{item.PercentComplete}</td>
                                                                    <td style={{ width: "7%" }}>
                                                                        <div>
                                                                            {item.TeamLeaderUser != undefined && item.TeamLeaderUser.map(function (client1: any) {
                                                                                return (
                                                                                    <span
                                                                                        title={client1.Title}>
                                                                                        {/* <a>{client1.Title.slice(0, 2).toUpperCase()}</a> */}
                                                                                        <img className="AssignUserPhoto" src={client1.ItemCover.Url} />
                                                                                    </span>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "10%" }}>{item.ItemRank}</td>
                                                                    <td style={{ width: "9%" }}>{item.DueDate}</td>
                                                                    <td style={{ width: "9%" }}>
                                                                        {item.CreatedDateImg != null ? item.CreatedDateImg.map((Creates: any) => {
                                                                            return (
                                                                                <span>
                                                                                    {Creates.Created != null ? Moment(item.Created).format('DD/MM/YYYY') : ""}
                                                                                    <img className='AssignUserPhoto' title={Creates.Title} src={Creates.Item_x0020_Cover.Description} />
                                                                                </span>
                                                                            )
                                                                        }) : ""}
                                                                    </td>
                                                                    <td style={{ width: "7%" }}>
                                                                        <div>
                                                                            
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ width: "3%" }}>{item.siteType != "Master Tasks" && <a onClick={(e) => EditDataopen(e, item)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                    <td style={{ width: "3%" }}><a>{item.siteType == "Master Tasks" && <img width={25} src={require('../../../Assets/ICON/edit_page.svg')} onClick={(e) => EditComponentPopup(item)} />}
                                                                        {item.siteType != "Master Tasks" && <img src={require('../../../Assets/ICON/edit_page.svg')} width={25} onClick={(e) => EditPopup(item)} />}</a></td>
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                    {item.show && item.childs.length > 0 && (
                                                        <>
                                                            {item.childs.map(function (childitem: any) {
                                                                if (childitem.flag == true) {
                                                                    return (
                                                                        <>
                                                                            <tr >
                                                                                <td className="p-0" colSpan={13}>
                                                                                    <table className="table m-0" style={{ width: "100%" }}>
                                                                                        <tr className="for-c02">
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                    {childitem.childs.length > 0 &&
                                                                                                        <a className='hreflink'
                                                                                                            title="Tap to expand the childs">
                                                                                                            <div className="sign">{childitem.childs != undefined && childitem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                                : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                                            </div>
                                                                                                        </a>
                                                                                                    }
                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ width: "6%" }}>
                                                                        
                                                                                             </td>
                                                                                            <td style={{ width: "7%" }}>  <div className="d-flex">
                                                                                                <span>
                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                        <img className="icon-sites-img ml20" src={childitem.SiteIcon}></img>
                                                                                                        {/* <img className="icon-sites-img"
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" /> */}
                                                                                                    </a>
                                                                                                </span>
                                                                                                <span className="ml-2">{childitem.Shareweb_x0020_ID}</span>
                                                                                            </div>
                                                                                            </td>
                                                                                            <td style={{ width: "23%" }}>
                                                                                                {childitem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childitem.Id}
                                                                                                >{childitem.Title}
                                                                                                </a>}
                                                                                                {childitem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-Spfx.aspx?taskId=" + childitem.Id + '&Site=' + childitem.siteType}
                                                                                                >{childitem.Title}
                                                                                                </a>}
                                                                                                {childitem.childs != undefined &&
                                                                                                    <span className='ms-1'>({childitem.childs.length})</span>
                                                                                                }
                                                                                                {childitem.Short_x0020_Description_x0020_On != null &&
                                                                                                    // <span className="project-tool"><img
                                                                                                    //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                    //         <span className="tooltiptext">
                                                                                                    //             <div className="tooltip_Desc">
                                                                                                    //                 <span>{childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                    //             </div>
                                                                                                    //         </span>
                                                                                                    //     </span>
                                                                                                    // </span>
                                                                                                    <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                        <div className="popover__content">
                                                                                                        {childitem.Short_x0020_Description_x0020_On}
                                                                                                        </div>
                                                                                                    </div>
                                                                                                }
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>
                                                                                                <div>
                                                                                                    {childitem.ClientCategory != undefined && childitem.ClientCategory.length > 0 && childitem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                        return (
                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                title={client.Title}>
                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                            </span>
                                                                                                        )
                                                                                                    })}</div>
                                                                                            </td>
                                                                                            <td style={{ width: "7%" }}>
                                                                                                <div>{childitem.TeamLeaderUser != undefined && childitem.TeamLeaderUser != undefined && childitem.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                    return (
                                                                                                        <div className="AssignUserPhoto"
                                                                                                            title={client1.Title}>
                                                                                                            <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                        </div>
                                                                                                    )
                                                                                                })}</div></td>
                                                                                            <td style={{ width: "7%" }}>{childitem.PercentComplete}</td>
                                                                                            <td style={{ width: "10%" }}>{childitem.ItemRank}</td>
                                                                                            <td style={{ width: "9%" }}>{childitem.DueDate}</td>
                                                                                            <td style={{ width: "9%" }}>{childitem.Created != null ? Moment(item.Created).format('DD/MM/YYYY') : ""}</td>
                                                                                            <td style={{ width: "7%" }}>
                                                                                                <div></div>
                                                                                            </td>
                                                                                            <td style={{ width: "3%" }}>{childitem.siteType != "Master Tasks" && <a onClick={(e) => EditDataopen(e, childitem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                            <td style={{ width: "3%" }}><a>{childitem.siteType == "Master Tasks" && <img width={25} src={require('../../../Assets/ICON/edit_page.svg')} onClick={(e) => EditComponentPopup(childitem)} />}
                                                                                                {childitem.siteType != "Master Tasks" && <img width={25} src={require('../../../Assets/ICON/edit_page.svg')} onClick={(e) => EditPopup(childitem)} />}</a></td>
                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>
                                                                            {childitem.show && childitem.childs.length > 0 && (
                                                                                <>
                                                                                    {childitem.childs.map(function (childinew: any) {
                                                                                        if (childinew.flag == true) {
                                                                                            return (
                                                                                                <>
                                                                                                    <tr >
                                                                                                        <td className="p-0" colSpan={13}>
                                                                                                            <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                <tr className="tdrow">
                                                                                                                    <td style={{ width: "2%" }}>
                                                                                                                        {childinew.childs.length > 0 &&
                                                                                                                            <div className="accordian-header" onClick={() => handleOpen(childinew)}>
                                                                                                                                <a className='hreflink' onClick={(e) => this.EditDatas(e, item)}
                                                                                                                                    title="Tap to expand the childs">
                                                                                                                                    <div className="sign">{childinew.childs != undefined && childinew.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                                                                    </div>
                                                                                                                                </a>
                                                                                                                            </div>
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "6%" }}>
                                                                                                                        <div>
                                                                                                                        </div>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}> <div className="d-flex">
                                                                                                                        <span>
                                                                                                                            <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                <img className="icon-sites-img ml20" src={childinew.SiteIcon}></img>
                                                                                                                                {/* <img  className="icon-sites-img" 
                                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png" /> */}
                                                                                                                            </a>
                                                                                                                        </span>
                                                                                                                        <span className="ml-2">{childinew.Shareweb_x0020_ID}</span>
                                                                                                                    </div>
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "23%" }}>
                                                                                                                        {childinew.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childinew.Id}
                                                                                                                        >{childinew.Title}
                                                                                                                        </a>}
                                                                                                                        {childinew.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                            href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-Spfx.aspx?taskId=" + childinew.Id + '&Site=' + childinew.siteType}
                                                                                                                        >{childinew.Title}
                                                                                                                        </a>}
                                                                                                                        {childinew.childs != undefined &&
                                                                                                                            <span className='ms-1'>({childinew.childs.length})</span>
                                                                                                                        }
                                                                                                                        {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                            // <span className="project-tool"><img
                                                                                                                            //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                            //         <span className="tooltiptext">
                                                                                                                            //             <div className="tooltip_Desc">
                                                                                                                            //                 <span>{childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                            //             </div>
                                                                                                                            //         </span>
                                                                                                                            //     </span>
                                                                                                                            // </span>
                                                                                                                            <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                                <div className="popover__content">
                                                                                                                                {childinew.Short_x0020_Description_x0020_On}
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        }
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}>
                                                                                                                        {/* <div>
                                                                                                                                            {childinew.ClientCategory != undefined  && childinew.ClientCategory.map(function (client: any) {
                                                                                                                                                return (
                                                                                                                                                    <span className="ClientCategory-Usericon"
                                                                                                                                                        title={client.Title}>
                                                                                                                                                        <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                    </span>
                                                                                                                                                )
                                                                                                                                            })}</div> */}
                                                                                                                    </td>
                                                                                                                    <td style={{ width: "7%" }}>
                                                                                                                        <div>{childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser != undefined && childinew.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                            return (
                                                                                                                                <span className="AssignUserPhoto"
                                                                                                                                    title={client1.Title}>
                                                                                                                                    <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                </span>
                                                                                                                            )
                                                                                                                        })}</div></td>
                                                                                                                    <td style={{ width: "7%" }}>{childinew.PercentComplete}</td>
                                                                                                                    <td style={{ width: "10%" }}>{childinew.ItemRank}</td>
                                                                                                                    <td style={{ width: "9%" }}>{childinew.DueDate}</td>
                                                                                                                    <td style={{ width: "9%" }}>{childinew.Created != null ? Moment(childinew.Created).format('DD/MM/YYYY') : ""}</td>
                                                                                                                    <td style={{ width: "7%" }}></td>
                                                                                                                    <td style={{ width: "3%" }}>{childinew.siteType != "Master Tasks" && <a onClick={(e) => EditDataopen(e, childinew)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                    <td style={{ width: "3%" }}><a>{childinew.siteType == "Master Tasks" && <img width={25} src="{require('../../../Assets/ICON/edit_page.svg')}" onClick={(e) => EditComponentPopup(childinew)} />}
                                                                                                                        {childinew.siteType != "Master Tasks" && <img width={25} src={require('../../../Assets/ICON/edit_page.svg')} onClick={(e) => EditItemTaskPopup(childinew)} />}</a></td>
                                                                                                                </tr>
                                                                                                            </table>
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                    {childinew.show && childinew.childs.length > 0 && (
                                                                                                        <>
                                                                                                            {childinew.childs.map(function (subchilditem: any) {
                                                                                                                return (
                                                                                                                    <>
                                                                                                                        <tr >
                                                                                                                            <td className="p-0" colSpan={13}>
                                                                                                                                <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                                    <tr className="for-c02">
                                                                                                                                        <td style={{ width: "2%" }}>
                                                                                                                                            <div className="accordian-header" onClick={() => handleOpen(subchilditem)}>
                                                                                                                                                {subchilditem.childs.length > 0 &&
                                                                                                                                                    <a className='hreflink'
                                                                                                                                                        title="Tap to expand the childs">
                                                                                                                                                        {/* <div className="sign">{subchilditem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                                                                                    : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                                                                                </div> */}
                                                                                                                                                    </a>
                                                                                                                                                }
                                                                                                                                            </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "6%" }}></td>
                                                                                                                                        <td style={{ width: "7%" }}>  <div className="d-flex">
                                                                                                                                            <span>
                                                                                                                                                <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                                                    <img className="icon-sites-img ml20" src={subchilditem.SiteIcon}></img>
                                                                                                                                                    {/* <img className="icon-sites-img"
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png" /> */}
                                                                                                                                                </a>
                                                                                                                                            </span>
                                                                                                                                            <span className="ml-2">{subchilditem.Shareweb_x0020_ID}</span>
                                                                                                                                        </div>
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "23%" }}>
                                                                                                                                            {subchilditem.siteType == "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile-SPFx.aspx?taskId=" + childitem.Id}
                                                                                                                                            >{subchilditem.Title}
                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.siteType != "Master Tasks" && <a className="hreflink serviceColor_Active" target='_blank' data-interception="off"
                                                                                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Task-Profile-Spfx.aspx?taskId=" + subchilditem.Id + '&Site=' + subchilditem.siteType}
                                                                                                                                            >{subchilditem.Title}
                                                                                                                                            </a>}
                                                                                                                                            {subchilditem.childs != undefined &&
                                                                                                                                                <span className='ms-1'>({subchilditem.childs.length})</span>
                                                                                                                                            }
                                                                                                                                            {subchilditem.Short_x0020_Description_x0020_On != null &&
                                                                                                                                                // <span className="project-tool"><img
                                                                                                                                                //     src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                                                //         <span className="tooltiptext">
                                                                                                                                                //             <div className="tooltip_Desc">
                                                                                                                                                //                 <span>{subchilditem.Short_x0020_Description_x0020_On}</span>
                                                                                                                                                //             </div>
                                                                                                                                                //         </span>
                                                                                                                                                //     </span>
                                                                                                                                                // </span>
                                                                                                                                                <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />
                                                                                                                                                    <div className="popover__content">
                                                                                                                                                    {subchilditem.Short_x0020_Description_x0020_On}
                                                                                                                                                    </div>
                                                                                                                                                </div>
                                                                                                                                            }
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>
                                                                                                                                            {/* <div>
                                                                                                                                                                {subchilditem.ClientCategory != undefined && subchilditem.ClientCategory.length > 0 && subchilditem.ClientCategory.map(function (client: any) {
                                                                                                                                                                    return (
                                                                                                                                                                        <span className="AssignUserPhoto"
                                                                                                                                                                            title={client.Title}>
                                                                                                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                                        </span>
                                                                                                                                                                    )
                                                                                                                                                                })}</div> */}
                                                                                                                                        </td>
                                                                                                                                        <td style={{ width: "7%" }}>
                                                                                                                                            <div>{subchilditem.TeamLeaderUser != undefined && subchilditem.TeamLeaderUser.map(function (client1: any) {
                                                                                                                                                return (
                                                                                                                                                    <div className="AssignUserPhoto"
                                                                                                                                                        title={client1.Title}>
                                                                                                                                                        <a>{client1.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                                                    </div>
                                                                                                                                                )
                                                                                                                                            })}</div></td>
                                                                                                                                        <td style={{ width: "7%" }}>{subchilditem.PercentComplete}</td>
                                                                                                                                        <td style={{ width: "10%" }}>{subchilditem.ItemRank}</td>
                                                                                                                                        <td style={{ width: "9%" }}>{subchilditem.DueDate}</td>
                                                                                                                                        <td style={{ width: "9%" }}>{subchilditem.Created != null ? Moment(subchilditem.Created).format('DD/MM/YYYY') : ""}</td>
                                                                                                                                        <td style={{ width: "7%" }}></td>
                                                                                                                                        <td style={{ width: "3%" }}>{subchilditem.siteType != "Master Tasks" && <a onClick={(e) => EditDataopen(e, subchilditem)}><img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/clock-gray.png"></img></a>}</td>
                                                                                                                                        <td style={{ width: "3%" }}></td>
                                                                                                                                    </tr>
                                                                                                                                </table>
                                                                                                                            </td>
                                                                                                                        </tr>
                                                                                                                    </>
                                                                                                                )
                                                                                                            })}
                                                                                                        </>
                                                                                                    )}
                                                                                                </>
                                                                                            )
                                                                                        }
                                                                                    })}</>
                                                                            )}</>
                                                                    )
                                                                }
                                                            })}
                                                        </>
                                                    )}
                                                </>
                                            )
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {isOpenEditPopup ? <EditTaskPopup Items={passdata} Call={CallBack} /> : ''}
            {IsComponent && <EditInstituton props={SharewebComponent} Call={Call}></EditInstituton>}
            {IsTimeEntry && <TimeEntryPopup props={SharewebTimeComponent} CallBackTimeEntry={TimeEntryCallBack}></TimeEntryPopup>}
            {/* {popupStatus ? <EditInstitution props={itemData} /> : null} */}
        </div>
    );
}