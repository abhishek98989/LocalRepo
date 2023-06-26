import * as React from "react";
import * as $ from "jquery";
let TypeSite: string;

import { Web } from "sp-pnp-js";
import * as Moment from "moment";
import Tooltip from "../../../globalComponents/Tooltip";

import { FaHome } from "react-icons/fa";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import CommentCard from "../../../globalComponents/Comments/CommentCard";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import ComponentTable from "./Taskwebparts";
import Sitecomposition from "../../../globalComponents/SiteComposition";
import SmartInformation from "../../taskprofile/components/SmartInformation";
import { spfi } from "@pnp/sp/presets/all";
const sp = spfi();

let TeamMembers: any = [];
let AssigntoMembers: any = [];
let AllQuestion: any[] = [];
let AllHelp: any[] = [];
let AllTeamMember: any = [];
let Folderdatas: any = [];
let AssignTeamMember: any = [];
let ContextValue: any = {};

let Iconpps:any = []
let componentDetails:any = [];
let filterdata:any=[];
let  imageArray:any=[];
function getQueryVariable(variable:any)
{
        let query = window.location.search.substring(1);
        console.log(query)//"app=article&act=news_content&aid=160990"
        let vars = query.split("&");
       
        console.log(vars) 
        for (let i=0;i<vars.length;i++) {
                    let pair = vars[i].split("=");
                    console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
        if(pair[0] == variable){ return pair[1];}
         }
         return(false);
         
         
}
let ID:any='';
let web:any=''

function Portfolio({SelectedProp}:any) {
  const [data, setTaskData] = React.useState([]);
  const [isActive, setIsActive] = React.useState(false);
  const [array, setArray] = React.useState([]);
  const [datas, setdatas] = React.useState([]);
  const [datam, setdatam] = React.useState([]);
  const [datak, setdatak] = React.useState([]);
  const [dataj, setdataj] = React.useState([]);
  const [datams, setdatams] = React.useState([]);
  const [datamb, setdatamb] = React.useState([]);
  const [datahelp, setdatahelp] = React.useState([]);
  const [datatech, setdatatech] = React.useState([]);
  const [dataQues, setdataQues] = React.useState([]);
  const [dataHelp, setdataHelp] = React.useState([]);
  const [Projecto, setProjecto] = React.useState(true);
  const [FolderData, SetFolderData] = React.useState([]);
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [showBlock, setShowBlock] = React.useState(false);
  const [IsTask, setIsTask] = React.useState(false);
  const [AllTaskuser, setAllTaskuser] = React.useState([]);
  const [questionandhelp, setquestionandhelp] = React.useState([]);

  const [ParentData, SetParentData] = React.useState([]);
  const [ImagePopover, SetImagePopover] = React.useState({
    isModalOpen: false,

      imageInfo: {ImageName:"",ImageUrl:""},

      showPopup: 'none'

  });
  ID=getQueryVariable('taskId');
  const handleOpen = (item:any) => {
    setIsActive((current) => !current);
    item.show = !item.show;
    setArray((array) => [...array]);
  };
  
  const handleOpen1 = (item: any) => {
    item.showl = !item.showl ;
    setdatam((datam) => [...datam]);
  };
  const handleOpen2 = (item: any) => {
    item.shows = !item.shows; 
    setdatas((datas) => [...datas]);
  };

  const handleOpen4 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showj = !item.showj;
    setdataj((dataj) => [...dataj]);
  };
  const handleOpen5 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showm = !item.showm ;
    setdatams((datams) => [...datams]);
  };
  const handleOpen6 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showb = !item.showb;
    setdatamb((datamb) => [...datamb]);
  };
  const handleOpen7 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showhelp = !item.showhelp;
    setdatahelp((datahelp) => [...datahelp]);
  };
  const handleOpen8 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showQues = !item.showQues;
    setdataQues((dataQues) => [...dataQues]);
  };
  const handleOpen9 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showtech = !item.showtech;
    setdatatech((datatech) => [...datatech]);
  };
  const handleOpen10 = (item: any) => {
    setIsActive((current) => !current);
    setIsActive(true);
    item.showHelp = !item.showHelp;
    setdataHelp((dataHelp) => [...dataHelp]);
  };
  const  showhideprojects = () =>{

    if (Projecto) {
     setProjecto(false)
    } else {

      setProjecto(true)

    }

  }
  React.useEffect(() => {
    let folderId: any = "";
    
    let ParentId: any = "";
     try {

   var  isShowTimeEntry = SelectedProp.TimeEntry != "" ? JSON.parse(SelectedProp.TimeEntry) : "";
      
     var  isShowSiteCompostion = SelectedProp.SiteCompostion != "" ? JSON.parse(SelectedProp.SiteCompostion) : ""
      
      } catch (error: any) {
      
       console.log(error)
      
      }
    if(SelectedProp != undefined){
      SelectedProp.isShowSiteCompostion = isShowSiteCompostion
      SelectedProp.isShowTimeEntry = isShowTimeEntry
    }
    ContextValue = SelectedProp;
    let web = ContextValue.siteUrl;
    let url = `${web}/_api/lists/getbyid('${ContextValue.MasterTaskListID}')/items?$select=ItemRank,Item_x0020_Type,Portfolio_x0020_Type,Site,FolderID,PortfolioLevel,PortfolioStructureID,ValueAdded,Idea,TaskListName,TaskListId,WorkspaceType,CompletedDate,ClientActivityJson,ClientSite,Item_x002d_Image,Sitestagging,SiteCompositionSettings,TechnicalExplanations,Deliverables,ComponentPortfolio/Id,ComponentPortfolio/Title,ServicePortfolio/Id,Author/Id,Author/Title,Editor/Id,Editor/Title,ServicePortfolio/Title,Package,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,Admin_x0020_Notes,AdminStatus,Background,Help_x0020_Information,BasicImageInfo,Item_x0020_Type,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,Component/Id,Component/Title,Component/ItemType,Component/ItemType,Categories,FeedBack,component_x0020_link,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,Created,Modified,PermissionGroup/Id,PermissionGroup/Title,Team_x0020_Members/Id,Team_x0020_Members/Title,Services/Id,Services/Title,Services/ItemType,Parent/Id,Parent/Title,Parent/ItemType,SharewebCategories/Id,SharewebCategories/Title,ClientCategory/Id,ClientCategory/Title&$expand=Author,Editor,ClientCategory,ComponentPortfolio,ServicePortfolio,Parent,AssignedTo,Services,Team_x0020_Members,Component,PermissionGroup,SharewebCategories&$filter=Id eq ${ID}&$top=4999`;
    let response: any = [];
    let responsen: any = []; // this variable is used for storing list items
    function GetListItems() {
      $.ajax({
        url: url,
        method: "GET",
        headers: {
          Accept: "application/json; odata=verbose",
        },
        success: function (data) {
          response = response.concat(data.d.results);
          response.map((item: any) => {
            item.AssignedTo = item.AssignedTo.results === undefined ? [] : item.AssignedTo.results;

            item.Team_x0020_Members = item.Team_x0020_Members.results === undefined ? [] : item.Team_x0020_Members.results;

            item.siteUrl = ContextValue.siteUrl;;

            item.listId = ContextValue.MasterTaskListID;
            item.show= true
            item.showl=true
            item.shows=true
            item.showj=true
            item.showm=true
            item.showb=true
            item.showhelp=true
            item.showQues=true
            item.showtech = true
            item.showHelp=true
            item.showk = true
            if (item.FolderID != undefined) {
              folderId = item.FolderID;
              let urln = `${web}/_api/lists/getbyid('${ContextValue.DocumentsListID}')/items?$select=Id,Title,FileDirRef,FileLeafRef,ServerUrl,FSObjType,EncodedAbsUrl&$filter=Id eq ${folderId}`;
              $.ajax({
                url: urln,
                method: "GET",
                headers: {
                  Accept: "application/json; odata=verbose",
                },
                success: function (data) {
                  responsen = responsen.concat(data.d.results);
                  if (data.d.__next) {
                    urln = data.d.__next;
                  } else SetFolderData(responsen);
                  // console.log(responsen);
                },
                error: function (error) {
                  console.log(error);
                  // error handler code goes here
                },
              });
            }
            if (
              item?.Parent != undefined &&
              item.Parent.Id != undefined &&
              item.Item_x0020_Type == "Feature"
            ) {
              ParentId = item.Parent.Id;
              let urln = `https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/lists/getbyid('${ContextValue.MasterTaskListID}')/items?$select=Id,Parent/Id,Title,Parent/Title,Parent/ItemType&$expand=Parent&$filter=Id eq ${ParentId}`;
              $.ajax({
                url: urln,
                method: "GET",
                headers: {
                  Accept: "application/json; odata=verbose",
                },
                success: function (data) {
                  let PaData = ParentData.concat(data.d.results);
                  if (data.d.__next) {
                    urln = data.d.__next;
                  } else SetParentData(PaData);
                  // console.log(responsen);
                },
                error: function (error) {
                  console.log(error);
                  // error handler code goes here
                },
              });
            }
            if (item.Portfolio_x0020_Type != undefined) {
              let filter = "";
              if (item.Portfolio_x0020_Type == "Component") {
                filter += "(Components / Id eq " + ID + ")";
              } else if (item.Portfolio_x0020_Type == "Service") {
                filter += "(Service / Id eq " + ID + ")";
              }

              let urln = `${web}/_api/lists/getbyid('${ContextValue.SmartHelptListID}')/items?$select=Id,Title,ItemRank,PercentComplete,Categories,AssignedTo/Id,AssignedTo/Title,Body,Components/Id,Components/Title,Components/ItemType,Service/Id,Service/Title,Service/ItemType,DueDate,ItemType,Priority,StartDate,Status&$expand=AssignedTo,Components,Service&$filter=${filter}`;
              $.ajax({
                url: urln,
                method: "GET",
                headers: {
                  Accept: "application/json; odata=verbose",
                },
                success: function (data) {
                  if (data != undefined) {
                    data.d.results.forEach(function (item: any) {
                      item.AssignedTo = item.AssignedTo.results === undefined ? [] : item.AssignedTo.results;

                      item.Team_x0020_Members = item.Team_x0020_Members.results === undefined ? [] : item.Team_x0020_Members.results;
          
                      if (item.ItemType == "Question")
                        AllQuestion.unshift(item);
                      else if (item.ItemType == "Help") AllHelp.unshift(item);
                    });
                  }
                  responsen = responsen.concat(data.d.results);
                  if (data.d.__next) {
                    urln = data.d.__next;
                  } else setquestionandhelp(responsen);
                },
                error: function (error) {
                  console.log(error);
                },
              });
            }

          });
          if (data.d.__next) {
            url = data.d.__next;
            GetListItems();
          } else setTaskData(response);
          console.log(response);
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
  // Get Project Data 
  let getMasterTaskListTasks = async function () {
    let web =new Web(ContextValue?.siteUrl);
   
    componentDetails = await web.lists
      .getById(ContextValue.MasterTaskListID)
      .items.select(
        "ComponentPortfolio/Id",
        "ComponentPortfolio/Title",
        "ServicePortfolio/Id",
        "ServicePortfolio/Title",
        "SiteCompositionSettings",
        "PortfolioStructureID",
        "ItemRank",
        "ShortDescriptionVerified",
        "Portfolio_x0020_Type",
        "BackgroundVerified",
        "descriptionVerified",
        "Synonyms",
        "BasicImageInfo",
        "Deliverable_x002d_Synonyms",
        "OffshoreComments",
        "OffshoreImageUrl",
        "HelpInformationVerified",
        "IdeaVerified",
        "TechnicalExplanationsVerified",
        "Deliverables",
        "DeliverablesVerified",
        "ValueAddedVerified",
        "CompletedDate",
        "Idea",
        "ValueAdded",
        "TechnicalExplanations",
        "Item_x0020_Type",
        "Sitestagging",
        "Package",
        "Short_x0020_Description_x0020_On",
        "Short_x0020_Description_x0020__x",
        "Short_x0020_description_x0020__x0",
        "Admin_x0020_Notes",
        "AdminStatus",
        "Background",
        "Help_x0020_Information",
        "SharewebComponent/Id",
        "SharewebCategories/Id",
        "SharewebCategories/Title",
        "Priority_x0020_Rank",
        "Reference_x0020_Item_x0020_Json",
        "Team_x0020_Members/Title",
        "Team_x0020_Members/Name",
        "Component/Id",
        "Component/Title",
        "Component/ItemType",
        "Team_x0020_Members/Id",
        "Item_x002d_Image",
        "component_x0020_link",
        "IsTodaysTask",
        "AssignedTo/Title",
        "AssignedTo/Name",
        "AssignedTo/Id",
        "AttachmentFiles/FileName",
        "FileLeafRef",
        "FeedBack",
        "Title",
        "Id",
        "PercentComplete",
        "Company",
        "StartDate",
        "DueDate",
        "Comments",
        "Categories",
        "Status",
        "WebpartId",
        "Body",
        "Mileage",
        "PercentComplete",
        "Attachments",
        "Priority",
        "Created",
        "Modified",
        "Author/Id",
        "Author/Title",
        "Editor/Id",
        "Editor/Title",
        "ClientCategory/Id",
        "ClientCategory/Title",
        "Responsible_x0020_Team/Id",
        "Responsible_x0020_Team/Title",
        "Parent/Id",
        "Parent/Title",
        "Parent/ItemType"
      )

      .expand(
        "ClientCategory",
        "AssignedTo",
        "Component",
        "ComponentPortfolio",
        "ServicePortfolio",
        "AttachmentFiles",
        "Author",
        "Editor",
        "Team_x0020_Members",
        "SharewebComponent",
        "SharewebCategories",
        "Responsible_x0020_Team",
        "Parent"
      )
      .filter("Item_x0020_Type  eq 'Project'").top(4000)
      .get();

// Project Data for HHHH Project Management
componentDetails.map((num:any)=> {

let num2;
if(num.Component != undefined){
  num.Component.map((compID:any)=>{
                               if(compID.Id == ID){
                                
                               num2=num;
                               filterdata.push(num2)
                               }
                             
});  
}} );
  };
    GetListItems();
    getTaskUser();
    getMasterTaskListTasks();
    open();
    
  }, []);

  // Make Folder data unique

  Folderdatas = FolderData.reduce(function (previous: any, current: any) {
    let alredyExists =
      previous.filter(function (item: any) {
        return item.Id === current.Id;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  }, []);
  // Get All User

  const getTaskUser = async () => {
    let web = new Web(ContextValue.siteUrl);
    await web.lists
      .getById(ContextValue.TaskUsertListID)
      .items.orderBy("Created", true)
      .get()
      .then((Data: any[]) => {
        console.log(Data);

        setAllTaskuser(Data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  function open() {
    data.map((item: any) => {
      handleOpen(item);
      handleOpen1(item);
      handleOpen2(item);

      handleOpen4(item);
    });
  }

 
  data.map((item) => {
    if (item.Portfolio_x0020_Type != undefined) {
      TypeSite = item.Portfolio_x0020_Type;
    }
    // Set the page titile
    document.title = `${item.Portfolio_x0020_Type}-${item.Title}`;
    if (item.Team_x0020_Members != undefined) {
      AllTaskuser.map((users) => {
        item.Team_x0020_Members.map((members: any) => {
          if (members.Id != undefined) {
            if (users.AssingedToUserId == members.Id) {
              TeamMembers.push(users);
            }
          }
        });
      });
      
    }
    if (item.AssignedTo != undefined) {
      AllTaskuser.map((users) => {
        item.AssignedTo.map((members: any) => {
          if (users.AssingedToUserId == members.Id) {
            AssigntoMembers.push(users);
          }
        });
      });
      
    }
  });
  //    Get Folder data


  const EditComponentPopup = (item: any) => {
   
    item["siteUrl"] = web;
    item["listName"] = ContextValue.MasterTaskListID;
    setIsComponent(true);
    setSharewebComponent(item);
    
  };
  const Call = React.useCallback((item1) => {
    setIsComponent(false);
    setIsTask(false);
   
    
  }, []);

  //  Remove duplicate values

  AllTeamMember = TeamMembers.reduce(function (previous: any, current: any) {
    let alredyExists =
      previous.filter(function (item: any) {
        return item.Id === current.Id;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  }, []);

  AssignTeamMember = AssigntoMembers.reduce(function (
    previous: any,
    current: any
  ) {
    let alredyExists =
      previous.filter(function (item: any) {
        return item.Id === current.Id;
      }).length > 0;
    if (!alredyExists) {
      previous.push(current);
    }
    return previous;
  },
  []);

  console.log(AllTeamMember);

  function handleSuffixHover() {
    setShowBlock(true);
  }

  function handleuffixLeave() {
    setShowBlock(false);
  }

  if(ParentData[0]?.Parent?.ItemType == 'Component' && data[0].Item_x0020_Type == 'Feature'){
    Iconpps = [
    {
      ItemType : 'Component',
      Id : ParentData[0]?.Parent?.Id,
      Title:ParentData[0]?.Parent?.Title,
      Icon : 'C',
      nextIcon:'>'
    },{
      ItemType : 'SubComponent',
      Id : ParentData[0]?.Id,
      Title:ParentData[0]?.Title,
      Icon : 'S',
      nextIcon: '>'
    },{
      ItemType : 'Feature',
      Id : data[0]?.Id,
      Title:data[0]?.Title,
      Icon : 'F'
    }
   ]
}
if(data[0]?.Parent?.ItemType == 'Component' && data[0].Item_x0020_Type == 'SubComponent'){
 Iconpps = [
  {
    ItemType : 'Component',
    Id : data[0]?.Parent.Id,
    Title:data[0]?.Parent.Title,
    Icon : 'C',
    nextIcon:'>'
  },{
    ItemType : 'SubComponent',
    Id : data[0]?.Id,
    Title:data[0]?.Title,
    Icon : 'S'
  }
 ]
}
if(data[0]?.Item_x0020_Type == 'Component'){
Iconpps = [
 {
   ItemType : 'Component',
   Id : data[0]?.Id,
   Title:data[0]?.Title,
   Icon : 'C',
   
 }
]
}

// Basic Image
if(data?.length != 0 && data[0]?.BasicImageInfo != undefined||null){
  imageArray = JSON.parse(data[0]?.BasicImageInfo);
 
 }
  
//  basic image End

  // ImagePopover 
  const OpenModal=(e: any, item: any)=> {

    if (item.Url != undefined) {

      item.ImageUrl = item?.Url;

    }

    //debugger;

    e.preventDefault();

    // console.log(item);

    SetImagePopover({

      isModalOpen: true,

      imageInfo: item,

      showPopup: 'block'

    });

  }




  //close the model

  const  CloseModal=(e: any)=> {

    e.preventDefault();

    SetImagePopover({

      isModalOpen: false,

      imageInfo: {ImageName:"",ImageUrl:""},

      showPopup: 'none'

    });

  }




  return (
    <div className={TypeSite == "Service" ? "serviepannelgreena" : ""}>
      {/* breadcrumb & title */}
      <section className="ContentSection">
        <section>
          <div className="col">
            <div className="d-flex justify-content-between p-0">
              <ul className="spfxbreadcrumb m-0 p-0">
                <li>
                  <a href="#">
                    <FaHome />{" "}
                  </a>
                </li>
                {data.map((item: any) => {
                  return (
                    <>
                      <li>
                        {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                        {item.Portfolio_x0020_Type != undefined && (
                          <a
                            target="_blank"
                            data-interception="off"
                            href={SelectedProp.siteUrl+"/SitePages/"+item.Portfolio_x0020_Type+"-Portfolio.aspx"}
                          >
                            {item.Portfolio_x0020_Type}-Portfolio
                          </a>
                        )}
                      </li>
                      {(item.Item_x0020_Type == "SubComponent" ||
                        item.Item_x0020_Type == "Feature") && (
                        <>
                          <li>
                            {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                            {ParentData != undefined &&
                              ParentData.map((ParentD: any) => {
                                return (
                                  <>
                                    {ParentD.Parent != undefined && (
                                      <a
                                        target="_blank"
                                        data-interception="off"
                                        href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${ParentD.Parent.Id}`}
                                      >
                                        {ParentD.Parent.Title}
                                      </a>
                                    )}
                                  </>
                                );
                              })}
                          </li>
                          <li>
                            {/* if="Task.Portfolio_x0020_Type=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                            {item.Parent != undefined && (
                              <a
                                target="_blank"
                                data-interception="off"
                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${item.Parent.Id}`}
                              >
                                {item.Parent.Title}
                              </a>
                            )}
                          </li>
                        </>
                      )}


                      <li>
                        <a>{item.Title}</a>
                      </li>
                    </>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="col">
            <div className="p-0" style={{ verticalAlign: "top" }}>
              {data.map((item) => (
                <>
                  <h2 className="heading d-flex justify-content-between align-items-center">
                    <span>
                      {item.Portfolio_x0020_Type == "Component" &&
                        item.Item_x0020_Type == "SubComponent" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/subComponent_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Service" &&
                        item.Item_x0020_Type == "SubComponent" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/subcomponent_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                                src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}

                      {item.Portfolio_x0020_Type == "Component" &&
                        item.Item_x0020_Type == "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feature_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span >
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Service" &&
                        item.Item_x0020_Type == "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Component" &&
                        item.Item_x0020_Type != "SubComponent" &&
                        item.Item_x0020_Type != "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/component_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                      {item.Portfolio_x0020_Type == "Service" &&
                        item.Item_x0020_Type != "SubComponent" &&
                        item.Item_x0020_Type != "Feature" && (
                          <>
                            <img
                              className="client-icons"
                              src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png"
                            />{" "}
                            <a>{item.Title}</a>{" "}
                            <span>
                              {" "}
                              <img
                               src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              />
                            </span>
                          </>
                        )}
                    </span>
                    <span className="text-end fs-6">
                      <a
                        target="_blank"
                        data-interception="off"
                        href={SelectedProp.siteUrl+"/SitePages/Portfolio-Profile-Old.aspx?taskId="+ID}
                      >
                        Old Portfolio profile page
                      </a>
                    </span>
                  </h2>
                </>
              ))}
            </div>
          </div>
        </section>
        {/* left bar  & right bar */}
        <section>
          <div className="row">
            <div className="col-md-9 bg-white">
              <div className="team_member row  py-2">
                <div className="col-md-8">
                  <div className="row mb-2">
                    <div className="col-md-6 pe-0">
                      <dl>
                        <dt className="bg-fxdark">Due Date</dt>
                        <dd className="bg-light">
                          <span>
                         
                            {data.map((item) => (
                              <a>
                                {item.DueDate != null
                                  ? Moment(item.DueDate).format("DD/MM/YYYY")
                                  : ""}
                              </a>
                            ))}
                        
                          </span>
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Start Date</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>
                              {item.StartDate != null
                                ? Moment(item.StartDate).format("DD/MM/YYYY")
                                : ""}
                            </a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Status</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{item.Status}</a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Team Members</dt>
                        <dd className='bg-light d-flex'>
                                            {AssignTeamMember.length!=0?AssignTeamMember.map((item:any)=>
                                        <>
                                                <a  target='_blank' data-interception="off" href={SelectedProp.siteUrl+`/SitePages/TaskDashboard.aspx?UserId=${item.AssingedToUserId}&Name=${item.Title}`}>
                                                <img className='workmember' src={item.Item_x0020_Cover?.Url} title={item.Title} />
                                                </a>
                                            
                                                </>
                                        ):""}
                                       
                                                {AllTeamMember != null && AllTeamMember.length > 0 &&
                                                <>
                                                <span>|</span>
                    <div className="user_Member_img"><a href={SelectedProp.siteUrl+`/SitePages/TaskDashboard.aspx?UserId=${AllTeamMember[0].Id}&Name=${AllTeamMember[0].Title}`} target="_blank" data-interception="off"><img className="workmember" src={AllTeamMember[0].Item_x0020_Cover?.Url} title={AllTeamMember[0].Title}></img></a></div>                        
                    </>}
                    {AllTeamMember != null && AllTeamMember.length > 1 &&
                    <div className="position-relative user_Member_img_suffix2 multimember fs13" style={{paddingTop: '2px'}} onMouseOver={(e) =>handleSuffixHover()} onMouseLeave={(e) =>handleuffixLeave()}>+{AllTeamMember.length - 1}
                    {showBlock &&
                        <span className="tooltiptext">
                        <div className='bg-white border p-2'>                        
                            { AllTeamMember.slice(1).map( (rcData:any,i:any)=> {
                                
                                return  <div className="team_Members_Item p-1">
                                <div><a href={SelectedProp.siteUrl+"/SitePages/TaskDashboard.aspx?UserId="+rcData.Id+"&Name="+rcData.Title} target="_blank" data-interception="off">
                                    <img className="workmember" src={rcData.Item_x0020_Cover?.Url}></img></a></div>
                                <div className='m-1'>{rcData.Title}</div>
                                </div>
                                                        
                            })
                            }
                        
                        </div>
                        </span>
                        }
                    </div>                        
                    }   
                                   </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Item Rank</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{item.ItemRank}</a>
                          ))}
                        </dd>
                      </dl>
                    </div>
                    <div className="col-md-6 p-0">
                      <dl>
                        <dt className="bg-fxdark">Priority</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{item.Priority != null ? item.Priority : ""}</a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Completion Date</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>
                              {item.CompletedDate != null
                                ? Moment(item.CompletedDate).format(
                                    "DD/MM/YYYY"
                                  )
                                : ""}
                            </a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">Categories</dt>
                        <dd className="bg-light text-break">
                          {data.map((item) => (
                            <a>{item.Categories}</a>
                          ))}
                        </dd>
                      </dl>
                      <dl>
                        <dt className="bg-fxdark">% Complete</dt>
                        <dd className="bg-light">
                          {data.map((item) => (
                            <a>{(item.PercentComplete * 100).toFixed(0)}</a>
                          ))}
                        </dd>
                      </dl>
                      {data.map((item: any) => {
                        return (
                          <>
                            {item.Parent.Title != undefined && (
                              <dl>
                                <dt className="bg-fxdark">Parent</dt>
                                <dd className="bg-light" style={{width: "auto"}}>
                                  <a
                                    target="_blank"
                                    data-interception="off"
                                    href={SelectedProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId="+item.Parent.Id}
                                  >
                                    {item.Parent.Title}
                                  </a>
                                  <span className="pull-right">
                                    <span className="pencil_icon">
                                      <span className="hreflink">
                                        {item.Portfolio_x0020_Type ==
                                          "Component" && (
                                          <>
                                            <a
                                              target="_blank"
                                              data-interception="off"
                                              href={SelectedProp.siteUrl+"/SitePages/Component-Portfolio.aspx?ComponentID="+item.Parent.Id}
                                            >
                                              <span className="svg__iconbox svg__icon--editBox border"></span>
                                              {/* <img src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25" /> */}
                                {" "}
                                            </a>
                                          </>
                                        )}
                                        {item.Portfolio_x0020_Type ==
                                          "Service" && (
                                          <>
                                            <a
                                              target="_blank"
                                              data-interception="off"
                                              href={SelectedProp.siteUrl+"/SitePages/Service-Portfolio.aspx?ComponentID="+item.Parent.Id}
                                            >
                                              {" "}
                                              <img src={require('../../../Assets/ICON/edit_page.svg')}
                                width="30" height="25" />{" "}
                                            </a>
                                          </>
                                        )}
                                      </span>
                                    </span>
                                  </span>
                                </dd>
                              </dl>
                            )}
                          </>
                        );
                      })}
                    </div>
                  </div>
                  <section className="row  accordionbox">
                    <div className="accordion  pe-1 overflow-hidden">
                   
 {/* Project Management Box */}
                   
                      
 {filterdata?.length !== 0 && (
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => showhideprojects()}
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="fw-medium font-sans-serif text-900">
                                      <span className="sign">
                                      {Projecto ? <IoMdArrowDropdown /> : <IoMdArrowDropright />}
                                      </span>{" "}
                                      HHHH Project Management
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show" style={{ display: Projecto ? 'block' : 'none' }}>
                                  {Projecto && (
                                    <>                                
                                         {filterdata?.map((item:any) => (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                            
                                     <a href={SelectedProp.siteUrl + "/SitePages/Project-Management.aspx?ProjectId=" +item?.Id }  data-interception="off"
                      target="_blank">{item?.Title}</a>
                      
                                    </div>
                                    ))}
                                    </>

                                  )}
                                </div>
                              </div>
                            </div>
                          )}{" "}
                       
                      {/* Project Management Box End */}
                   {/* Description */}
                      {data.map((item) => (
                        <>
                          {item.Body !== null && (
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen6(item)}
                                >
                                  <button
                                    className="accordion-button btn btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="fw-medium font-sans-serif text-900">
                                      <span className="sign">
                                        {item.showb ? (
                                          <IoMdArrowDropdown />
                                        ) : (
                                          <IoMdArrowDropright />
                                        )}
                                      </span>{" "}
                                      Description
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showb && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                             
                                      {data.map((item) => (
                                        <p
                                          className="m-0"
                                          dangerouslySetInnerHTML={{
                                            __html: item.Body,
                                          }}
                                        >
                                        
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}{" "}
                        </>
                      ))}

                      {/* Short description */}
                      {data.map((item) => (
                        <>
                          {item.Short_x0020_Description_x0020_On !== null && (
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="fw-medium font-sans-serif text-900">
                                      <span className="sign">
                                        {item.show ? (
                                          <IoMdArrowDropdown />
                                        ) : (
                                          <IoMdArrowDropright />
                                        )}
                                      </span>{" "}
                                      Short Description
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.show && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                    
                                      {data.map((item) => (
                                        <p
                                          className="m-0"
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              item.Short_x0020_Description_x0020_On,
                                          }}
                                        >
                                          
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}{" "}
                        </>
                      ))}

                      {/* Question description */}
                      {AllQuestion != undefined &&
                        AllQuestion.length != 0 &&
                        data.map((item) => (
                          <>
                            <div className="card shadow-none Qapannel  mb-2">
                              <div
                                className="card-header p-0 border-bottom-0 "
                                onClick={() => handleOpen8(item)}
                              >
                                <button
                                  className="accordion-button btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                  data-bs-toggle="collapse"
                                >
                                  <span className="fw-medium font-sans-serif text-900">
                                    <span className="sign">
                                      {item.showQues ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>{" "}
                                    Question Description
                                  </span>
                                </button>
                              </div>

                              {item.showQues && (
                                <>
                                  <div className="px-2 my-2">
                                    {AllQuestion.map((item) => (
                                      <div id="t_draggable1" className="mb-2">
                                        <div
                                          className="card-header p-0 border-bottom-0 "
                                          onClick={() => handleOpen8(item)}
                                        >
                                          <button
                                            className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                            data-bs-toggle="collapse"
                                          >
                                            <span className="fw-medium font-sans-serif text-900">
                                              <span className="sign">
                                                {item.showQues ? (
                                                  <IoMdArrowDropdown />
                                                ) : (
                                                  <IoMdArrowDropright />
                                                )}
                                              </span>{" "}
                                              {item.Title}
                                            </span>
                                          </button>
                                        </div>
                                        <div className="accordion-collapse collapse show">
                                          {item.showQues && (
                                            <div
                                              className="accordion-body pt-1"
                                              id="testDiv1"
                                            >
                                 

                                              <p
                                                className="m-0"
                                                dangerouslySetInnerHTML={{
                                                  __html: item.Body,
                                                }}
                                              >
                                                
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        ))}
                      {/* Help description */}
                      {AllHelp != undefined &&
                        AllHelp.length != 0 &&
                        data.map((item) => (
                          <>
                            <div className="card shadow-none Qapannel  mb-2">
                              <div
                                className="card-header p-0 border-bottom-0 "
                                onClick={() => handleOpen10(item)}
                              >
                                <button
                                  className="accordion-button btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                  data-bs-toggle="collapse"
                                >
                                  <span className="fw-medium font-sans-serif text-900">
                                    <span className="sign">
                                      {item.showHelp ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>{" "}
                                    Help Description
                                  </span>
                                </button>
                              </div>

                              {item.showHelp && (
                                <>
                                  <div className="px-2 my-2">
                                    {AllHelp.map((item) => (
                                      <div id="t_draggable1" className="mb-2">
                                        <div
                                          className="card-header p-0 border-bottom-0 "
                                          onClick={() => handleOpen10(item)}
                                        >
                                          <button
                                            className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                            data-bs-toggle="collapse"
                                          >
                                            <span className="fw-medium font-sans-serif text-900">
                                              <span className="sign">
                                                {item.showHelp ? (
                                                  <IoMdArrowDropdown />
                                                ) : (
                                                  <IoMdArrowDropright />
                                                )}
                                              </span>{" "}
                                              {item.Title}
                                            </span>
                                          </button>
                                        </div>
                                        <div className="accordion-collapse collapse show">
                                          {item.showHelp && (
                                            <div
                                              className="accordion-body pt-1"
                                              id="testDiv1"
                                            >
                                             

                                              <p
                                                className="m-0"
                                                dangerouslySetInnerHTML={{
                                                  __html: item.Body,
                                                }}
                                              >
                                                
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          </>
                        ))}

                      {/* Background */}
                      {data.map((item) => (
                        <>
                          {item.Background !== null && (
                            <div className="card shadow-none  mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen1(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showl ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Background
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showl && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p className="m-0">
                                        {data.map((item) => (
                                          <>{item.Background}</>
                                        ))}
                                      </p>
                                    </div>
                                  )}
                                   
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Idea */}
                      {data.map((item) => (
                        <>
                          {item.Idea !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen2(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.shows ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Idea
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.shows && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.Idea,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Value Added */}
                      {data.map((item) => (
                        <>
                          {item.ValueAdded !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen4(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showj ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Value Added
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showj && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.ValueAdded,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Help Information Help_x0020_Information */}
                      {data.map((item) => (
                        <>
                          {item.Help_x0020_Information !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen7(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showhelp ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Help Information
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showhelp && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.Help_x0020_Information,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}

                      {/* Technical Explanation */}
                      {data.map((item) => (
                        <>
                          {item.TechnicalExplanations !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen9(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showtech ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      Technical Explanation
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showtech && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.TechnicalExplanations,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                      {/* Deliverables */}
                      {data.map((item) => (
                        <>
                          {item.Deliverables !== null && (
                            <div className="card shadow-none mb-2">
                              <div
                                className="accordion-item border-0"
                                id="t_draggable1"
                              >
                                <div
                                  className="card-header p-0 border-bottom-0 "
                                  onClick={() => handleOpen5(item)}
                                >
                                  <button
                                    className="accordion-button  btn-link text-decoration-none d-block w-100 py-2 px-1 border-0 text-start rounded-0 shadow-none"
                                    data-bs-toggle="collapse"
                                  >
                                    <span className="sign">
                                      {item.showm ? (
                                        <IoMdArrowDropdown />
                                      ) : (
                                        <IoMdArrowDropright />
                                      )}
                                    </span>
                                    <span className="fw-medium font-sans-serif text-900">
                                      {" "}
                                      Deliverables
                                    </span>
                                  </button>
                                </div>
                                <div className="accordion-collapse collapse show">
                                  {item.showm && (
                                    <div
                                      className="accordion-body pt-1"
                                      id="testDiv1"
                                    >
                                      <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item.Deliverables,
                                        }}
                                      ></p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ))}
                    </div>
                  </section>
                </div>
                <div className="col-md-4 p-0">
                  {data.map((item: any) => {
                    return (
                      <>
                        {item.Portfolio_x0020_Type == "Component" && (
                          <dl>
                            <dt className="bg-fxdark">Service Portfolio</dt>
                            <dd className="bg-light serviepannelgreena">
                              <div className="block">
                                <a
                                  className="service"
                                  style={{ border: "0px" }}
                                  target="_blank"
                                  data-interception="off"
                                  href={SelectedProp.siteUrl+"/SitePages/Portfolio-Profile.aspx?taskId="+item?.ComponentPortfolio?.Id}
                                >
                                  {item?.ComponentPortfolio?.Title}
                                </a>
                              </div>
                            </dd>
                          </dl>
                        )}
                        {item.Portfolio_x0020_Type == "Service" && (
                          <dl>
                            <dt className="bg-fxdark">Component Portfolio</dt>
                            <dd className="bg-light">
                              <div className="block">
                                <a
                                  className="service"
                                  style={{ border: "0px" }}
                                  target="_blank"
                                  data-interception="off"
                                  href={SelectedProp.siteUrl+`/SitePages/Portfolio-Profile.aspx?taskId=${item?.ServicePortfolio?.Id}`}
                                >
                                  {item?.ServicePortfolio?.Title}
                                </a>
                              </div>
                            </dd>
                          </dl>
                        )}
                      </>
                    );
                  })}
                 {data.map((item: any) => {
                    return <Sitecomposition props={item} sitedata={SelectedProp} />;
                  })}
                </div>
              </div>
            </div>
            <div className="col-md-3">
            <aside>
                {data.map((item) => {
                  return (
                    <>
                      {item.Item_x002d_Image != null && (
                        <div>
                          <img
                            alt={item.Item_x002d_Image.Url}
                            style={{ width: "280px", height: "145px" }}
                            src={item.Item_x002d_Image.Url}
                          />
                        </div>
                      )
                     
                      
                      }
                       {(imageArray != undefined && imageArray[0]?.ImageName && item?.BasicImageInfo != undefined ) && (
                       <div className="col">
                        

<div className="Taskaddcommentrow mb-2">

 
    <div className="taskimage border mb-3">

      {/*  <BannerImageCard imgData={imgData}></BannerImageCard> */}




      <a className='images' target="_blank" data-interception="off" href={imageArray[0]?.ImageUrl}>

        <img alt={imageArray[0]?.ImageName} src={imageArray[0]?.ImageUrl}

          onMouseOver={(e) => OpenModal(e, imageArray[0])}

          onMouseOut={(e) => CloseModal(e)} ></img>

      </a>





      <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-2 ">

        <div className='usericons'>

          <span>

            <span >{imageArray[0]?.UploadeDate}</span>

            <span className='round px-1'>


                <img className='align-self-start' title={imageArray[0]?.UserName} src={imageArray[0]?.UserImage} />

              

            </span>




          </span>

        </div>

        <div>

          <a className='images' target="_blank" data-interception="off" href={imageArray[0]?.ImageUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>

          <span >

            {imageArray[0]?.ImageName?.length > 15 ? imageArray[0]?.ImageName.substring(0, 15) + '...' : imageArray[0]?.ImageName}

          </span>

          <span>|</span>

        </div>




      </div>




    </div>


</div>
<div className='imghover' style={{ display: ImagePopover.showPopup }}>

          <div className="popup">

            <div className="parentDiv">

              <span style={{ color: 'white' }}>{ImagePopover.imageInfo.ImageName}</span>

              <img style={{ maxWidth: '100%' }} src={ImagePopover.imageInfo["ImageUrl"]}></img>

            </div>

          </div>

        </div>


                          {/* <img
                            alt={imageArray[0]?.ImageName}
                            style={{ width: "280px", height: "145px" }}
                            src={imageArray[0]?.ImageUrl}
                          />
                          <p>{imageArray[0]?.UploadeDate} {imageArray[0]?.UserName}</p> */}
                        </div>
                         )
                     
                      
                        }
                    </>
                  );
                })}
                <div className="mb-3 card">
                  {data.map((item) => {
                    return (
                       <SmartInformation
                         Id={item.Id}
                         siteurl={
                          "${web}"
                        }
                         spPageContext={"/sites/HHHH/SP"}
                         AllListId={SelectedProp} Context={SelectedProp?.Context} taskTitle={item.Title} listName={'Master Tasks'}
                      />
                    
                    );
                  })}
                </div>
                {/* <div className='mb-3 card' ng-if="isOwner==true">
                                        <div className='card-header'>
                                            <div className='card-actions float-end'>  <Tooltip ComponentId='324'/></div>
                                            <div className="mb-0 card-title h5">Add & Connect Tool</div>
                                        </div> 
                                        <div className='card-body'>
                                            <div className="border-bottom pb-2"> <a ng-click="TagItems();">
                                                Click here to add more content
                                            </a></div>
                                        </div>
                                    </div> */}
                {Folderdatas != undefined && (
                  <>
                    {Folderdatas.map((item: any) => {
                      return (
                        <div className="mb-3 card">
                          <div className="card-header">
                            <div className="card-actions float-end">
                              {" "}
                              <Tooltip ComponentId="1748" />
                            </div>
                            <div className="mb-0 card-title h5">
                              Main Folder
                            </div>
                          </div>
                          <div className="card-body">
                            <div className="border-bottom pb-2">
                              <div>
                                <img
                                  data-themekey="#"
                                  src="/_layouts/15/images/folder.gif?rev=23"
                                />
                                <a
                                  target="_blank"
                                  data-interception="off"
                                  href={item?.EncodedAbsUrl}
                                >
                                  {item?.FileLeafRef}
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}{" "}
                  </>
                )}
                <div className="mb-3 card">
                  <>
                    {data.map((item) => (
                     <CommentCard
                     siteUrl={
                       SelectedProp.siteUrl
                     }
                     AllListId={SelectedProp}
                     userDisplayName={item.userDisplayName}
                     itemID={item.Id}
                     listName={"Master Tasks"}
                     Context={SelectedProp.Context}
                   ></CommentCard>
                      
                    ))}
                  </>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </section>
      {/* table secation artical */}
      <section className="TableContentSection taskprofilepagegreen">
        <div className="container-fluid">
          <section className="TableSection">
           
            {data.map((item) => (
              <ComponentTable props={item} NextProp={ContextValue} Iconssc= {Iconpps}/>
            ))}
          </section>
        </div>
      </section>
      <div className="col-sm-12 pad0">
        {data.map((item: any) => {
          return (
            <div
              className="col-sm-6 padL-0 ItemInfo mb-20"
              style={{ paddingTop: "15px" }}
            >
              <div>
                Created{" "}
                <span>{Moment(item.Created).format("DD/MM/YYYY hh:mm")}</span>{" "}
                by <span className="footerUsercolor">{item.Author.Title}</span>
              </div>
              <div>
                Last modified{" "}
                <span>{Moment(item.Modified).format("DD/MM/YYYY hh:mm")}</span>{" "}
                by <span className="footerUsercolor">{item.Editor.Title}</span>
               
              </div>
            </div>
          );
        })}
      </div>
      {IsComponent && (
        <EditInstituton item={SharewebComponent} SelectD={SelectedProp} Calls={Call}></EditInstituton>
      )}
    </div>
  );
}
export default Portfolio;
