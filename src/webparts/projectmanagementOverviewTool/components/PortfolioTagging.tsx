import * as React from "react";
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import pnp, { Web, SearchQuery, SearchResults } from "sp-pnp-js";
import { Version } from '@microsoft/sp-core-library';
import * as moment from "moment";
import { sortBy } from "@microsoft/sp-lodash-subset";
import { FaAngleDown, FaAngleUp, FaPrint, FaFileExcel, FaPaintBrush, FaEdit, FaSearch } from 'react-icons/fa';
let serachTitle: any = '';
let selectedComponent:any=[];
const PortfolioTagging = (item: any) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [backupComponentsData, setBackupComponentsData] = React.useState([]);
    const [componentsData, setComponentsData] = React.useState([]);
    const [table, setTable] = React.useState(componentsData);
    const [CheckBoxdata, setcheckbox] = React.useState([]);
    const [maidataBackup, setmaidataBackup] = React.useState([])
    const [SubComponentsData, setSubComponentsData] = React.useState([])
    const [TotalTask, setTotalTask] = React.useState([])
    const [FeatureData, setFeatureData] = React.useState([])
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    // const [selectedComponent, selctedCompo] = React.useState([]);
    React.useEffect(() => {
         selectedComponent=[];
        if(item?.type == 'Service'){
            if (item?.props?.smartService!= undefined && item?.props?.smartService?.length > 0)
            selectedComponent=item.props.smartService;
        }else if(item?.type === "Component"){
            if (item?.props?.smartComponent!= undefined && item?.props?.smartComponent?.length > 0)
            selectedComponent=item.props.smartComponent;
        }
        

        GetComponents();
    },
        []);
    function Example(callBack: any, type: any) {

        item.Call(callBack?.props, type);

    }

    const setModalIsOpenToFalse = () => {
        Example(undefined, item?.type);
        setModalIsOpen(false)
    }
    const setModalIsOpenToOK = () => {
        if(item?.type == 'Service'){
            if(item?.props?.smartService!=undefined){
                item.props.smartService = selectedComponent;
            }
            
        }else{
            if(item?.props?.smartComponent!=undefined){
                item.props.smartComponent = selectedComponent;
            }
        }
        
        Example(item, item?.type);
        setModalIsOpen(false);
    }

    const sortByDng = () => {

        const copy = componentsData

        copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

        setTable(copy)

    }
    var stringToArray = function (input: any) {
        if (input) {
            return input.match(/\S+/g);
        } else {
            return [];
        }
    };
    var getHighlightdata = function (item: any, searchTerms: any) {
        var keywordList = [];
        if (serachTitle != undefined && serachTitle != '') {
            keywordList = stringToArray(serachTitle);
        } else {
            keywordList = stringToArray(serachTitle);
        }
        var pattern: any = getRegexPattern(keywordList);
        //let Title :any =(...item.Title)
        item.TitleNew = item.Title.replace(pattern, '<span class="highlighted">$2</span>');
        // item.Title = item.Title;
        keywordList = [];
        pattern = '';
    }
    var getRegexPattern = function (keywordArray: any) {
        var pattern = "(^|\\b)(" + keywordArray.join("|") + ")";
        return new RegExp(pattern, "gi");
    };
    var getSearchTermAvialable1 = function (searchTerms: any, item: any, Title: any) {
        var isSearchTermAvailable = true;
        $.each(searchTerms, function (index: any, val: any) {
            if (isSearchTermAvailable && (item[Title] != undefined && item[Title].toLowerCase().indexOf(val.toLowerCase()) > -1)) {
                isSearchTermAvailable = true;
                getHighlightdata(item, val.toLowerCase());

            } else
                isSearchTermAvailable = false;
        })
        return isSearchTermAvailable;
    }
    var isItemExistsNew = function (array: any, items: any) {
        var isExists = false;
        $.each(array, function (index: any, item: any) {
            if (item.Id === items.Id && items.siteType === item.siteType) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    var AllFilteredTagNews: any = [];
    var finalOthersData: any = []
    var ALllTAsk: any = []
    var childData: any = [];
    var subChild: any = [];
    var subChild2: any = [];
    let handleChange1 = (e: { target: { value: string; }; }, Title: any) => {
        setSearch(e.target.value.toLowerCase());
        serachTitle = e.target.value.toLowerCase();
    var filterglobal = e.target.value.toLowerCase();
        if (filterglobal != undefined && filterglobal.length >= 1) {
            var searchTerms = stringToArray(filterglobal);
            $.each(maidataBackup, function (pareIndex: any, item: any) {
                item.flag = false;
                item.isSearch = true;
                item.show = false;
                item.flag = (getSearchTermAvialable1(searchTerms, item, Title));
                if (item.flag == true) {
                    AllFilteredTagNews.push(item)
                }

                if (item.Child != undefined && item.Child.length > 0) {
                    $.each(item.Child, function (parentIndex: any, child1: any) {
                        child1.flag = false;
                        child1.show = false;
                        child1.isSearch = true;
                        child1.flag = (getSearchTermAvialable1(searchTerms, child1, Title));
                        if (child1.flag) {
                            item.Child[parentIndex].flag = true;
                            maidataBackup[pareIndex].flag = true;
                            item.Child[parentIndex].show = true;
                            maidataBackup[pareIndex].show = true;
                            if (!isItemExistsNew(AllFilteredTagNews, item)) {
                                AllFilteredTagNews.push(item)
                            }
                            childData.push(child1)
                            ALllTAsk.push(item)

                        }
                        if (child1.Child != undefined && child1.Child.length > 0) {
                            $.each(child1.Child, function (index: any, subchild: any) {
                                subchild.flag = false;
                                subchild.show = false;
                                subchild.flag = (getSearchTermAvialable1(searchTerms, subchild, Title));
                                if (subchild.flag) {
                                    item.Child[parentIndex].flag = true;
                                    child1.flag = true;
                                    child1.Child[index].flag = true;
                                    child1.Child[index].show = true;
                                    item.Child[parentIndex].show = true;
                                    maidataBackup[pareIndex].flag = true;
                                    maidataBackup[pareIndex].show = true;
                                    if (!isItemExistsNew(AllFilteredTagNews, item)) {
                                        AllFilteredTagNews.push(item)
                                    }
                                    if (!isItemExistsNew(childData, child1))
                                        childData.push(child1)
                                    subChild.push(subchild)

                                }
                                if (subchild.Child != undefined && subchild.Child.length > 0) {
                                    $.each(subchild.Child, function (childindex: any, subchilds: any) {
                                        subchilds.flag = false;
                                        // subchilds.Title = subchilds.newTitle;
                                        subchilds.flag = (getSearchTermAvialable1(searchTerms, subchilds, Title));
                                        if (subchilds.flag) {
                                            item.Child[parentIndex].flag = true;
                                            child1.flag = true;
                                            subchild.flag = true;
                                            subchild.Child[childindex].flag = true;
                                            child1.Child[index].flag = true;
                                            child1.Child[index].show = true;
                                            item.Child[parentIndex].show = true;
                                            maidataBackup[pareIndex].flag = true;
                                            maidataBackup[pareIndex].show = true;
                                            if (!isItemExistsNew(AllFilteredTagNews, item)) {
                                                AllFilteredTagNews.push(item)
                                            }
                                            if (!isItemExistsNew(childData, child1))
                                                childData.push(child1)
                                            if (!isItemExistsNew(subChild, subChild))
                                                subChild.push(subChild)
                                            subChild2.push(subchilds)

                                        }
                                    })
                                }
                            })
                        }

                    })
                }

            })
            const CData = AllFilteredTagNews.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            const AllDataTaskk = ALllTAsk.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            const SData = childData.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            const FData = subChild.filter((val: any, id: any, array: any) => {
                return array.indexOf(val) == id;
            })
            if (AllDataTaskk != undefined) {
                AllDataTaskk.forEach((newval: any) => {
                    if (newval.Title == 'Others' && newval.Child != undefined) {
                        newval.forEach((valllA: any) => {
                            finalOthersData.push(valllA)
                        })
                    }

                })
            }

            setTotalTask(finalOthersData)
            setSubComponentsData(SData);
            setFeatureData(FData);
            setComponentsData(CData);
        } else {
            //  ungetFilterLength();
            // setData(data => ([...maidataBackup]));
            setComponentsData(maidataBackup);
        }
        }
    const handleOpen = (item: any) => {

        item.show = item.show = item.show == true ? false : true;
        setComponentsData(componentsData => ([...componentsData]));

    };
    var Response: [] = [];
    const GetTaskUsers = async () => {
        if(item?.AllListId?.TaskUsertListID!=undefined){
            let web = new Web(item?.AllListId?.siteUrl);
            let taskUsers = [];
            taskUsers = await web.lists
                .getById(item?.AllListId?.TaskUsertListID)
                .items
                .get();
            Response = taskUsers;
        }else{
         alert("Task User List Id Not Available")
        }
        //console.log(this.taskUsers);

    }
    var isItemExist = function(search:any){
        let result =false;
        selectedComponent?.filter(function(comp:any){
           if(comp?.Id===search?.Id){
            result= true;
           }
        });
        return result
      }
    const GetComponents = async () => {
        var RootComponentsData: any[] = []; var ComponentsData: any[] = [];
        var SubComponentsData: any[] = [];
        var FeatureData: any[] = [];
        if (item?.type != undefined&&item?.AllListId?.MasterTaskListID!=undefined) {
            try {
                let web = new Web(item?.AllListId?.siteUrl);
                let componentDetails = [];
                componentDetails = await web.lists
                    //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
                    .getById(item?.AllListId?.MasterTaskListID)
                    .items
                    //.getById(this.state.itemID)
                    .select("ID", "Title", "DueDate", "Status", "ItemRank", "Item_x0020_Type", "Parent/Id", "Author/Id", "Author/Title", "Parent/Title", "TaskCategories/Id", "TaskCategories/Title", "AssignedTo/Id", "AssignedTo/Title", "TeamMembers/Id", "TeamMembers/Title", "ClientCategory/Id", "ClientCategory/Title")
                    .expand("TeamMembers", "Author", "ClientCategory", "Parent", "TaskCategories", "AssignedTo", "ClientCategory").filter("Portfolio_x0020_Type eq '" + item?.type + "'")
                    .top(4999)
                    .get()
    
                console.log(componentDetails);
                await GetTaskUsers();
                
                $.each(componentDetails, function (index: any, result: any) {
                    result.checked= isItemExist(result)
                    result.TitleNew = result.Title;
                    result.TeamLeaderUser = []
                    result.DueDate = moment(result.DueDate).format('DD/MM/YYYY')
    
                    if (result.DueDate == 'Invalid date' || '') {
                        result.DueDate = result.DueDate.replaceAll("Invalid date", "")
                    }
                    if (result.PercentComplete != undefined)
                        result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
    
                    if (result.Short_x0020_Description_x0020_On != undefined) {
                        result.Short_x0020_Description_x0020_On = result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/ig, '');
                    }
    
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
                    if (result.TeamMembers != undefined && result.TeamMembers.length > 0) {
                        $.each(result.TeamMembers, function (index: any, Assig: any) {
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
    
                    // if (result.ClientCategory != undefined && result.ClientCategory.length > 0) {
                    //     $.each(result.TeamMembers, function (index: any, catego: any) {
                    //         result.ClientCategory.push(catego);
                    //     })
                    // }
                    if (result.Item_x0020_Type == 'Root Component') {
                        result['Child'] = [];
                        RootComponentsData.push(result);
                    }
                    if (result.Item_x0020_Type == 'Component') {
                        result['Child'] = [];
                        ComponentsData.push(result);
    
    
                    }
    
                    if (result.Item_x0020_Type == 'SubComponent') {
                        result['Child'] = [];
                        SubComponentsData.push(result);
    
    
                    }
                    if (result.Item_x0020_Type == 'Feature') {
                        result['Child'] = [];
                        FeatureData.push(result);
                    }
                });
    
                $.each(SubComponentsData, function (index: any, subcomp: any) {
                    if (subcomp.Title != undefined) {
                        $.each(FeatureData, function (index: any, featurecomp: any) {
                            if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                                subcomp['Child'].push(featurecomp);;
                            }
                        })
                    }
                })
    
                $.each(ComponentsData, function (index: any, subcomp: any) {
                    if (subcomp.Title != undefined) {
                        $.each(SubComponentsData, function (index: any, featurecomp: any) {
                            if (featurecomp.Parent != undefined && subcomp.Id == featurecomp.Parent.Id) {
                                subcomp['Child'].push(featurecomp);;
                            }
                        })
                    }
                })
                //maidataBackup.push(ComponentsData)
                // setmaidataBackup(ComponentsData)
                setComponentsData(ComponentsData);
                setmaidataBackup(ComponentsData)
                setModalIsOpen(true)
            } catch (error) {
                console.log(error)
            }
        }
    }
    const selectPortfolio = (item: any) => {
        let itemAlreadySelect = false;
        let componentArray=selectedComponent;
        componentArray?.map((comp: any,index:any) => {
            if(comp?.Id==item.Id){
                componentArray.splice(index,1)
                itemAlreadySelect=true;
            }
        })
        if(itemAlreadySelect==false){
            componentArray.push(item)
        }
        selectedComponent=componentArray
        setComponentsData(ComponentsData => ([...ComponentsData]));
    }


    return (
        <Panel
            headerText={`Select ` + item?.type}
            type={PanelType.large}
            isOpen={modalIsOpen}
            onDismiss={setModalIsOpenToFalse}
            isBlocking={false}
        >
            <div>
                <div className={item?.type == 'Service' ? 'serviepannelgreena modal-body' : 'modal-body'}>
                    <div className="Alltable mt-10">
                        <div className="col-sm-12 p-0 smart">
                            <div className="section-event">
                                <div className="wrapper">
                                    <table className="mb-0 table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "2%" }}>
                                                    <div style={{ width: "2%" }}>
                                                        <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                            {item.Child != undefined &&
                                                                <a className='hreflink'
                                                                    title="Tap to expand the childs">
                                                                    <div className="sign">{item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                    </div>
                                                                </a>
                                                            }
                                                        </div>
                                                    </div>
                                                </th>
                                                <th style={{ width: "2%" }}>
                                                    <div></div>
                                                </th>
                                                <th style={{ width: "4%" }}>
                                                    <div></div>
                                                </th>
                                                <th style={{ width: "2%" }}>
                                                    <div></div>
                                                </th>
                                                <th style={{ width: "22%" }}>
                                                    <div style={{ width: "21%" }} className="smart-relative ">
                                                        <input type="search" placeholder="Title" className="full_width searchbox_height" onChange={event => handleChange1(event, 'Title')} />

                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>


                                                    </div>
                                                </th>
                                                <th style={{ width: "18%" }}>
                                                    <div style={{ width: "17%" }} className="smart-relative ">
                                                        <input id="searchClientCategory" onChange={event => handleChange1(event, 'TaskID')} type="search" placeholder="Client Category"
                                                            title="Client Category" className="full_width searchbox_height"
                                                        />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th style={{ width: "20%" }}>
                                                    <div style={{ width: "19%" }} className="smart-relative ">
                                                        <input id="searchClientCategory" type="search" placeholder="Team"
                                                            title="Client Category" className="full_width searchbox_height"
                                                        />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>

                                                    </div>
                                                </th>
                                                <th style={{ width: "10%" }}>
                                                    <div style={{ width: "9%" }} className="smart-relative">
                                                        <input id="searchClientCategory" type="search" placeholder="Status"
                                                            title="Client Category" className="full_width searchbox_height"
                                                        />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>

                                                    </div>
                                                </th>
                                                <th style={{ width: "10%" }}>
                                                    <div style={{ width: "9%" }} className="smart-relative corm-control">
                                                        <input id="searchClientCategory" type="search" placeholder="Item Rank"
                                                            title="Client Category" className="full_width searchbox_height"
                                                        />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th style={{ width: "10%" }}>
                                                    <div style={{ width: "9%" }} className="smart-relative ">
                                                        <input id="searchClientCategory" type="search" placeholder="Due"
                                                            title="Client Category" className="full_width searchbox_height"
                                                        />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>

                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <div id="SpfxProgressbar" style={{ display: "none" }}>
                                                <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                            </div>
                                            {componentsData && componentsData.map(function (item, index) {

                                                return (
                                                    <>
                                                        <tr >
                                                            <td className="p-0" colSpan={10}>
                                                                <table className="mb-0 table" style={{ width: "100%" }}>
                                                                    <tr className="bold for-c0l">

                                                                        <td style={{ width: "2%" }}>
                                                                            <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                                                {item.Child != undefined &&
                                                                                    <a className='hreflink'
                                                                                        title="Tap to expand the childs">
                                                                                        <div className="sign">{item.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                            : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                        </div>
                                                                                    </a>
                                                                                }
                                                                            </div>

                                                                        </td>
                                                                        <td style={{ width: "2%" }}>
                                                                            <input type="checkbox" name="Active" defaultChecked={item.checked} checked={item.checked} onClick={() => { item.checked = !item.checked; selectPortfolio(item) }} ></input>

                                                                        </td>

                                                                        <td style={{ width: "4%" }}>
                                                                            <div className="">
                                                                                <span>
                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                        <img className="icon-sites-img"
                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png" />
                                                                                    </a>
                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "2%" }}>
                                                                            <div className="">
                                                                                <span>
                                                                                    <div className="accordian-header" onClick={() => handleOpen(item)}>
                                                                                        {item.Child != undefined &&
                                                                                            <a className='hreflink'
                                                                                                title="Tap to expand the childs">
                                                                                                <div className="sign">{item.show ? <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png" />
                                                                                                    : <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png" />}
                                                                                                </div>
                                                                                            </a>
                                                                                        }
                                                                                    </div>

                                                                                </span>
                                                                            </div>
                                                                        </td>
                                                                        <td style={{ width: "22%" }}>
                                                                            {/* <a className="hreflink serviceColor_Active" target="_blank"
                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item.Id}
                                                                            >{item.Title}
                                                                            </a>
                                                                            {item.Child != undefined &&
                                                                                <span className="ms-1 siteColor">({item.Child.length})</span>
                                                                            }

                                                                            {item.Short_x0020_Description_x0020_On != null &&
                                                                                <span className="project-tool"><img
                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                        <span className="tooltiptext">
                                                                                            <div className="tooltip_Desc">
                                                                                                <span>{item.Short_x0020_Description_x0020_On}</span>
                                                                                            </div>
                                                                                        </span>
                                                                                    </span>
                                                                                </span>
                                                                            } */}
                                                                            <a data-interception="off" target="_blank" className="hreflink serviceColor_Active"
                                                                                href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + item?.Id}
                                                                            >
                                                                                <span dangerouslySetInnerHTML={{ __html: item?.TitleNew }}></span>
                                                                                {/* {item.Title} */}
                                                                            </a>





                                                                            {item?.childs != undefined &&
                                                                                <span className='ms-1'>({item?.childsLength})</span>
                                                                            }

                                                                            {item?.Short_x0020_Description_x0020_On != null &&
                                                                                <div className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                                                                    <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" />

                                                                                    <div className="popover__content">
                                                                                        {item?.Short_x0020_Description_x0020_On}
                                                                                    </div>
                                                                                </div>
                                                                            }

                                                                        </td>
                                                                        <td style={{ width: "18%" }}>
                                                                            <div>
                                                                                {item.ClientCategory.map(function (client: { Title: string; }) {
                                                                                    return (
                                                                                        <span className="ClientCategory-Usericon"
                                                                                            title={client.Title}>
                                                                                            <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                        </span>
                                                                                    )
                                                                                })}</div>
                                                                        </td>
                                                                        <td style={{ width: "20%" }}>
                                                                            <div>{item.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                return (
                                                                                    <span className="ClientCategory-Usericon"
                                                                                        title={client1.Title}>

                                                                                        <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                    </span>
                                                                                )
                                                                            })}</div></td>
                                                                        <td style={{ width: "10%" }}>{item.PercentComplete}</td>
                                                                        <td style={{ width: "10%" }}>{item.ItemRank}</td>
                                                                        <td style={{ width: "10%" }}>{item.DueDate}</td>
                                                                    </tr>
                                                                </table>
                                                            </td>


                                                        </tr>
                                                        {item.show && (
                                                            <>
                                                                {item.Child.map(function (childitem: any) {

                                                                    return (

                                                                        <>
                                                                            <tr >
                                                                                <td className="p-0" colSpan={10}>
                                                                                    <table className="mb-0 table" style={{ width: "100%" }}>
                                                                                        <tr className="for-c02">
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                    {childitem.Child.length > 0 &&
                                                                                                        <a className='hreflink'
                                                                                                            title="Tap to expand the childs">
                                                                                                            <div className="sign">{childitem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png" />
                                                                                                                : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png" />}
                                                                                                            </div>
                                                                                                        </a>
                                                                                                    }

                                                                                                </div>
                                                                                            </td>
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <input type="checkbox" name="Active" defaultChecked={childitem.checked} checked={childitem.checked} onClick={() => { childitem.checked = !childitem.checked; selectPortfolio(childitem) }} ></input>
                                                                                            </td>
                                                                                            <td style={{ width: "4%" }}> <div>

                                                                                                <span>

                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                        <img className="icon-sites-img"
                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png" />
                                                                                                    </a>

                                                                                                </span>
                                                                                            </div>
                                                                                            </td>
                                                                                            <td style={{ width: "2%" }}>
                                                                                                <div className="accordian-header" onClick={() => handleOpen(childitem)}>
                                                                                                    {childitem.Child.length > 0 &&
                                                                                                        <a className='hreflink'
                                                                                                            title="Tap to expand the childs">
                                                                                                            <div className="sign">{childitem.show ? <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Minus-Gray.png" />
                                                                                                                : <img style={{ width: "22px" }} src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Add-New-Grey.png" />}
                                                                                                            </div>
                                                                                                        </a>
                                                                                                    }

                                                                                                </div>

                                                                                            </td>
                                                                                            <td style={{ width: "22%" }}>
                                                                                                <a className="hreflink serviceColor_Active" target="_blank"
                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childitem.Id}
                                                                                                >
                                                                                                      <span dangerouslySetInnerHTML={{ __html: childitem?.TitleNew }}></span>
                                                                                                </a>
                                                                                                {childitem.Child.length > 0 &&
                                                                                                    <span className="ms-1 siteColor">({childitem.Child.length})</span>
                                                                                                }

                                                                                                {childitem.Short_x0020_Description_x0020_On != null &&
                                                                                                    <span className="project-tool"><img
                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                            <span className="tooltiptext">
                                                                                                                <div className="tooltip_Desc">
                                                                                                                    <span>{childitem.Short_x0020_Description_x0020_On}</span>
                                                                                                                </div>
                                                                                                            </span>
                                                                                                        </span>
                                                                                                    </span>
                                                                                                }
                                                                                            </td>
                                                                                            <td style={{ width: "18%" }}>
                                                                                                <div>
                                                                                                    {childitem.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                        return (
                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                title={client.Title}>
                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                            </span>
                                                                                                        )
                                                                                                    })}</div>
                                                                                            </td>
                                                                                            <td style={{ width: "20%" }}>
                                                                                                <div>{childitem.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                    return (
                                                                                                        <div className="ClientCategory-Usericon"
                                                                                                            title={client1.Title}>

                                                                                                            <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                        </div>
                                                                                                    )
                                                                                                })}</div></td>
                                                                                            <td style={{ width: "10%" }}>{childitem.PercentComplete}</td>
                                                                                            <td style={{ width: "10%" }}>{childitem.ItemRank}</td>
                                                                                            <td style={{ width: "10%" }}>{childitem.DueDate}</td>


                                                                                        </tr>
                                                                                    </table>
                                                                                </td>
                                                                            </tr>

                                                                            {childitem.show && (
                                                                                <>
                                                                                    {childitem.Child.map(function (childinew: any) {
                                                                                        return (
                                                                                            <tr >
                                                                                                <td className="p-0" colSpan={10}>
                                                                                                    <table className="mb-0 table" style={{ width: "100%" }}>
                                                                                                        <tr className="tdrow">
                                                                                                            <td style={{ width: "2%" }}>

                                                                                                            </td>

                                                                                                            <td style={{ width: "2%" }}><input type="checkbox" name="Active" defaultChecked={childinew.checked}  checked={childinew.checked} onClick={() => { childinew.checked = !childinew.checked; selectPortfolio(childinew) }}  ></input></td>
                                                                                                            <td style={{ width: "4%" }}> <div>
                                                                                                                <span>

                                                                                                                    <a className="hreflink" title="Show All Child" data-toggle="modal">
                                                                                                                        <img className="icon-sites-img"
                                                                                                                            src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png" />
                                                                                                                    </a>

                                                                                                                </span>
                                                                                                            </div>
                                                                                                            </td>
                                                                                                            <td style={{ width: "2%" }}></td>
                                                                                                            <td style={{ width: "22%" }}>

                                                                                                                <a className="hreflink serviceColor_Active" target="_blank"
                                                                                                                    href={"https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=" + childinew.Id}
                                                                                                                >
                                                                                                                    <span dangerouslySetInnerHTML={{ __html: childinew?.TitleNew }}></span>
                                                                                                                </a>
                                                                                                                {childinew.Child.length > 0 &&
                                                                                                                    <span className="ms-1 siteColor">({childinew.Child.length})</span>
                                                                                                                }

                                                                                                                {childinew.Short_x0020_Description_x0020_On != null &&
                                                                                                                    <span className="project-tool"><img
                                                                                                                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/infoIcon.png" /><span className="tooltipte">
                                                                                                                            <span className="tooltiptext">
                                                                                                                                <div className="tooltip_Desc">
                                                                                                                                    <span>{childinew.Short_x0020_Description_x0020_On}</span>
                                                                                                                                </div>
                                                                                                                            </span>
                                                                                                                        </span>
                                                                                                                    </span>
                                                                                                                }
                                                                                                            </td>
                                                                                                            <td style={{ width: "18%" }}>
                                                                                                                <div>
                                                                                                                    {childinew.ClientCategory.map(function (client: { Title: string; }) {
                                                                                                                        return (
                                                                                                                            <span className="ClientCategory-Usericon"
                                                                                                                                title={client.Title}>
                                                                                                                                <a>{client.Title.slice(0, 2).toUpperCase()}</a>
                                                                                                                            </span>
                                                                                                                        )
                                                                                                                    })}</div>
                                                                                                            </td>
                                                                                                            <td style={{ width: "20%" }}>
                                                                                                                <div>{childinew.TeamLeaderUser.map(function (client1: { Title: string; }) {
                                                                                                                    return (
                                                                                                                        <span className="ClientCategory-Usericon"
                                                                                                                            title={client1.Title}>

                                                                                                                            <a>{client1.Title.slice(0, 2).toUpperCase()}</a>

                                                                                                                        </span>
                                                                                                                    )
                                                                                                                })}</div></td>
                                                                                                            <td style={{ width: "10%" }}>{childinew.PercentComplete}</td>
                                                                                                            <td style={{ width: "10%" }}>{childinew.ItemRank}</td>
                                                                                                            <td style={{ width: "10%" }}>{childinew.DueDate}</td>
                                                                                                        </tr>
                                                                                                    </table>
                                                                                                </td>
                                                                                            </tr>
                                                                                        )
                                                                                    })}</>
                                                                            )}</>
                                                                    )
                                                                })}
                                                            </>
                                                        )}
                                                    </>


                                                )

                                            })}



                                        </tbody>



                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="float-end mt-2">
                    <button type="button" className="btn btn-primary" onClick={setModalIsOpenToOK}>OK</button>
                    <button type="button" className="btn btn-default ms-2" onClick={setModalIsOpenToFalse}>Cancel</button>
                </footer>
            </div >
        </Panel >
    )
}

export default PortfolioTagging