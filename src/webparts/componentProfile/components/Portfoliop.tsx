import * as React from "react";
import * as $ from "jquery";
let TypeSite: string;

import { Web } from "sp-pnp-js";
import * as Moment from "moment";
import ReactPopperTooltipSingleLevel from "../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel";
import { FaHome, FaPencilAlt } from "react-icons/fa";
import { IoMdArrowDropright, IoMdArrowDropdown } from "react-icons/io";
import CommentCard from "../../../globalComponents/Comments/CommentCard";
import EditInstituton from "../../EditPopupFiles/EditComponent";
// import Sitecomposition from "../../../globalComponents/SiteComposition";
import SmartInformation from "../../taskprofile/components/SmartInformation";
import { spfi } from "@pnp/sp/presets/all";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import ReactDOM from "react-dom";
import AncTool from "../../../globalComponents/AncTool/AncTool";
import RelevantDocuments from "../../taskprofile/components/RelevantDocuments";
import RelevantEmail from "../../taskprofile/components/ReleventEmails";
import {
  myContextValue,
  GetServiceAndComponentAllData,
} from "../../../globalComponents/globalCommon";
import { IsAny } from "@tanstack/react-table";
import InlineEditingcolumns from "../../../globalComponents/inlineEditingcolumns";
import ServiceComponentPortfolioPopup from "../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup";
import { SlArrowDown, SlArrowRight } from "react-icons/sl";
import CentralizedSiteComposition from "../../../globalComponents/SiteCompositionComponents/CentralizedSiteComposition";
import KeyDocuments from "../../taskprofile/components/KeyDocument";
import RadimadeTable from "../../../globalComponents/RadimadeTable";
const sp = spfi();
let AllClientCategoryDataBackup: any = [];
// Work the Inline Editing
interface EditableFieldProps {
  listName: string;
  itemId: any;
  fieldName: string;
  value: any;
  onChange: (value: string) => void;
  TaskProfilePriorityCallback: any;
  type: string;
  web: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  listName,
  itemId,
  fieldName,
  value,
  onChange,
  TaskProfilePriorityCallback,
  type,
  web,
}) => {
  const [editing, setEditing] = React.useState(false);
  const [fieldValue, setFieldValue] = React.useState(value);
  const [key, setKey] = React.useState(0); // Add a key state
  const Call = React.useCallback((item1: any, type: any, functionType: any) => {
    console.log("call back from the categories");
  }, []);
  React.useEffect(() => {
    setFieldValue(value); // Update the state when the prop value changes
  }, [value]);
  const handleCancel = () => {
    setEditing(false);
    setFieldValue(value);
  };

  const handleEdit = () => {
    setEditing(true);
  };
  if (fieldName == "Priority") {
    const [selectedPriority, setSelectedPriority] = React.useState(value);
    const handlePriorityClick = (event: any) => {
      setSelectedPriority(event.target.value);
    };
    // setFieldValue((prevValue:any) => selectedPriority);

    const priorities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const handleSave = async () => {
      try {
        let priorityValue = selectedPriority;
        setFieldValue(priorityValue);

        // Use priorityValue to update your list
        let webs = new Web(web);
        await webs.lists.getByTitle(listName).items.getById(itemId).update({
          PriorityRank: priorityValue,
        });

        setEditing(false);
        TaskProfilePriorityCallback(priorityValue);
        setKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.log(error);
      }
    };

    if (editing) {
      return (
        <div className="editcolumn">
          <select value={selectedPriority} onChange={handlePriorityClick}>
            <option value="">Select Priority</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          <span className="saveBtn">
            <a onClick={handleSave}>
              <span className="svg__iconbox svg__icon--Save"></span>
            </a>
            <a onClick={handleCancel}>
              <span className="svg__iconbox svg__icon--cross"></span>
            </a>
          </span>
        </div>
      );
    }
  }
  if (fieldName == "ItemRank") {
    const [selectedRank, setSelectedRank] = React.useState(value);

    const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedRank(event.target.value);
    };
    const handleSave = async () => {
      try {
        setFieldValue((prevValue: any) => selectedRank);
        let webs = new Web(web);
        await webs.lists
          .getByTitle(listName)
          .items.getById(itemId)
          .update({
            [fieldName]: selectedRank,
          });

        setEditing(false);
        onChange(selectedRank);
      } catch (error) {
        console.log(error);
      }
    };

    // Rest of the component code...
    let TaskItemRank = [
      { rankTitle: "Select Item Rank", rank: null },
      { rankTitle: "(8) Top Highlights", rank: 8 },
      { rankTitle: "(7) Featured Item", rank: 7 },
      { rankTitle: "(6) Key Item", rank: 6 },
      { rankTitle: "(5) Relevant Item", rank: 5 },
      { rankTitle: "(4) Background Item", rank: 4 },
      { rankTitle: "(2) to be verified", rank: 2 },
      { rankTitle: "(1) Archive", rank: 1 },
      { rankTitle: "(0) No Show", rank: 0 },
    ];
    if (editing) {
      return (
        <div className="editcolumn">
          <select value={selectedRank} onChange={handleInputChange}>
            {TaskItemRank.map((item: any, index: any) => (
              <option key={index} value={item.rank}>
                {item.rankTitle}
              </option>
            ))}
          </select>
          <span>
            <a onClick={handleSave}>
              <span className="svg__iconbox svg__icon--Save"></span>
            </a>
            <a onClick={handleCancel}>
              <span className="svg__iconbox svg__icon--cross"></span>
            </a>
          </span>
        </div>
      );
    }

    // Rest of the component code...
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(event.target.value);
  };

  if (fieldName == "PercentComplete") {
    const [myfieldValue, setmyFieldValue] = React.useState(value);
    const handleInputChanges = (event: any) => {
      setmyFieldValue(event.target.value);
    };

    const handleSave = async () => {
      try {
        setmyFieldValue((prevValue: any) => parseInt(myfieldValue));

        // if(type == "Number"){
        //   setFieldValue(fieldValue/100);
        // }
        let valpercent = parseInt(myfieldValue);
        let webs = new Web(web);
        await webs.lists
          .getByTitle(listName)
          .items.getById(itemId)
          .update({
            [fieldName]: valpercent / 100,
          });

        setEditing(false);
        setKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.log(error);
      }
    };
    let statusDropDown = [
      { rankTitle: "Select Status", rank: 0 },
      { rankTitle: "Not Started", rank: 0 },
      { rankTitle: "In Progress", rank: 10 },
      { rankTitle: "Completed", rank: 100 },
    ];
    if (editing) {
      return (
        <div className="editcolumn">
           <select value={myfieldValue} onChange={handleInputChanges}>
          {statusDropDown.map((item: any, index: any) => (
          <option key={index} value={item.rank}>
             {item.rankTitle}
             </option>
              ))}
           </select>
          <span>
            <a onClick={handleSave}>
              <span className="svg__iconbox svg__icon--Save"></span>
            </a>
            <a onClick={handleCancel}>
              <span className="svg__iconbox svg__icon--cross"></span>
            </a>
          </span>
        </div>
      );
    }
    if (myfieldValue === 0) {
      type = "Not Started";
    } else if (myfieldValue > 0 && myfieldValue != 100) {
      type = "In Progress";
    } else if (myfieldValue === 100) {
      type = "Completed";
    }
    let mymergedStatus = `${type} - ${myfieldValue}% `;
    return (
      <div key={key}>
        <span title={mymergedStatus} style={{ fontSize: "smaller" }}>
          {mymergedStatus}
        </span>
        <a className="pancil-icons" onClick={handleEdit}>
          <span className="svg__iconbox svg__icon--editBox"></span>
        </a>
      </div>
    );
  }

  if (type == "Date") {
    const handleSave = async () => {
      try {
        setFieldValue((prevValue: any) => fieldValue ? Moment(fieldValue).format("DD/MM/YYYY"): '');

        // if(type == "Number"){
        //   setFieldValue(fieldValue/100);
        // }
        let webs = new Web(web);
        await webs.lists
          .getByTitle(listName)
          .items.getById(itemId)
          .update({
            [fieldName]: fieldValue != '' ? fieldValue : null,
          });

        setEditing(false);
        setKey((prevKey) => prevKey + 1);
      } catch (error) {
        console.log(error);
      }
    };

    if (editing) {
      return (
        <div className="editcolumn ">
          <span>
            {" "}
            <input
              type={type}
              defaultValue={
                fieldValue !== undefined
                  ? Moment(fieldValue, "DD/MM/YYYY").format("YYYY-MM-DD")
                  : ""
              }
              min={Moment(new Date()).format("YYYY-MM-DD")}
              style={{ fontSize: "11px" }}
              onChange={handleInputChange}
            />
          </span>
          <span>
            <a onClick={handleSave}>
              <span className="svg__iconbox svg__icon--Save "></span>
            </a>
            <a onClick={handleCancel}>
              <span className="svg__iconbox svg__icon--cross "></span>
            </a>
          </span>
        </div>
      );
    }

    return (
      <div>
        <span title={fieldValue}>{fieldValue}</span>
        <a className="pancil-icons" onClick={handleEdit}>
          <span className="svg__iconbox svg__icon--editBox"></span>
        </a>
      </div>
    );
  }
  const handleSave = async () => {
    try {
      setFieldValue((prevValue: any) => fieldValue);

      // if(type == "Number"){
      //   setFieldValue(fieldValue/100);
      // }
      let webs = new Web(web);
      await webs.lists
        .getByTitle(listName)
        .items.getById(itemId)
        .update({
          [fieldName]: fieldValue,
        });

      setEditing(false);
      setKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.log(error);
    }
  };

  if (editing) {
    return (
      <div className="editcolumn ">
        <span>
          {" "}
          <input type={type} value={fieldValue} onChange={handleInputChange} />
        </span>
        <span>
          <a onClick={handleSave}>
            <span className="svg__iconbox svg__icon--Save "></span>
          </a>
          <a onClick={handleCancel}>
            <span className="svg__iconbox svg__icon--cross "></span>
          </a>
        </span>
      </div>
    );
  }

  return (
    <div>
      <span title={fieldValue}>{fieldValue}</span>
      <a className="pancil-icons" onClick={handleEdit}>
        <span className="svg__iconbox svg__icon--editBox"></span>
      </a>
    </div>
  );
};

// Work end the Inline Editing

let AllQuestion: any[] = [];
let AllHelp: any[] = [];
let AllTeamMember: any = [];
let Folderdatas: any = [];
let ContextValue: any = {};

let Iconpps: any = [];
let componentDetails: any = [];
let filterdata: any = [];
let imageArray: any = [];
let AllTaskuser: any = [];
let hoveroverstructureId: any;
let combinedArray: any = [];
let mydata: any[] = [];
function getQueryVariable(variable: any) {
  let query = window.location.search.substring(1);
  console.log(query); //"app=article&act=news_content&aid=160990"
  let vars = query.split("&");

  console.log(vars);
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split("=");
    console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}
let ID: any = "";
let web: any = "";
let count = 0;
let ParentData: any[] = [];

let AllMasterTaskData: any = [];
let keyDocRef: any;
let relevantDocRef: any;
let smartInfoRef: any;
function Portfolio({ SelectedProp, TaskUser }: any) {
  AllTaskuser = TaskUser;
  keyDocRef = React.useRef();

  relevantDocRef = React.createRef();
  smartInfoRef = React.createRef();
  const [data, setTaskData] = React.useState<any>([]);
  const [FolderData, SetFolderData] = React.useState([]);
  const [keydoc, Setkeydoc] = React.useState([]);
  const [FileDirRef, SetFileDirRef] = React.useState("");
  const [IsComponent, setIsComponent] = React.useState(false);
  const [CMSToolComponent, setCMSToolComponent] = React.useState("");
  const [showBlock, setShowBlock] = React.useState(false);
  const [IsTask, setIsTask] = React.useState(false);
  const [enable, setenable] = React.useState(true);
  const [questionandhelp, setquestionandhelp] = React.useState([]);
  const [ImagePopover, SetImagePopover] = React.useState({
    isModalOpen: false,

    imageInfo: { ImageName: "", ImageUrl: "" },

    showPopup: "none",
  });

  // For the image over
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [currentImage, setCurrentImage] = React.useState(null);
  const [filterdata, setfilterdata] = React.useState([]);
  const [isopenProjectpopup, setisopenProjectpopup] = React.useState(false);
  const [composition, setComposition] = React.useState(true);
  const [SiteCompositionShow, setSiteCompositionShow] = React.useState(false);

  const openImageInNewTab = (imageUrl: any) => {
    window.open(imageUrl, "_blank");
  };

  const handleMouseOver = (image: any) => {
    setCurrentImage(image);
    setShowOverlay(true);
  };

  const handleMouseOut = () => {
    setShowOverlay(false);
  };

  const [portfolioTyped, setPortfolioTypeData] = React.useState([]);
  const [myparentData, setParentData] = React.useState([]);
  const [hoveredId, setHoveredId] = React.useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  // PortfolioType

  const getPortFolioType = async () => {
    let web = new Web(SelectedProp.siteUrl);
    let PortFolioType = [];
    PortFolioType = await web.lists
      .getById(SelectedProp.PortFolioTypeID)
      .items.select("Id", "Title", "Color", "IdRange")
      .get();
    setPortfolioTypeData(PortFolioType);
  };
  ID = getQueryVariable("taskId");
  const loadAllMasterTask = async () => {
    let result = await GetServiceAndComponentAllData(SelectedProp);
    AllMasterTaskData = result.AllData;
  };
  React.useEffect(() => {
    getSmartMetaDataListAllItems();
  }, [count]);

  const getSmartMetaDataListAllItems = async () => {
    let AllSmartDataListData: any = [];
    let TempAllSiteData: any = [];
    let TempAllClientCategories: any = [];
    let web = new Web(SelectedProp?.siteUrl);
    try {
      AllSmartDataListData = await web.lists
        .getById(SelectedProp?.SmartMetadataListID)
        .items.select(
          "Id,Title,listId,siteUrl,siteName,Item_x005F_x0020_Cover,ParentID,Configurations,EncodedAbsUrl,Color_x0020_Tag,IsVisible,Created,Modified,Description1,SortOrder,Selectable,TaxType,Created,Modified,Author/Name,Author/Title,Editor/Name,Editor/Title,IsSendAttentionEmail/Id,IsSendAttentionEmail/Title,IsSendAttentionEmail/EMail,Parent/Id,Parent/Title"
        )
        .expand("Author,Editor,IsSendAttentionEmail,Parent")
        .getAll();
      if (AllSmartDataListData?.length > 0) {
        TempAllClientCategories = getSmartMetadataItemsByTaxType(
          AllSmartDataListData,
          "Client Category"
        );
        let TempArray: any = [];
        TempAllClientCategories?.map((AllCCItem: any) => {
          if (AllCCItem.TaxType == "Client Category") {
            if (AllCCItem.Title == "e+i") {
              AllCCItem.Title = "EI";
            }
            if (AllCCItem.Title == "PSE") {
              AllCCItem.Title = "EPS";
            }
            TempArray.push(AllCCItem);
          }
        });
        if (TempArray?.length > 0) {
          AllClientCategoryDataBackup = TempArray;
          parentFunctionCall();
        } else {
          parentFunctionCall();
        }
      }
    } catch (error) {
      console.log("Error :", error.message);
    }
  };

  function removeHtmlAndNewline(text: any) {
    if (text) {
      return text
        .replace(/(<([^>]+)>)/gi, "")
        .replace(/\n/g, "")
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/&#160;/g, "");
    } else {
      return ""; // or any other default value you prefer
    }
  }

  // Common Function for filtering the Data According to Tax Type

  const getSmartMetadataItemsByTaxType = function (
    metadataItems: any,
    taxType: any
  ) {
    var Items: any = [];
    metadataItems.map((taxItem: any) => {
      if (taxItem.TaxType === taxType) Items.push(taxItem);
    });
    Items.sort((a: any, b: any) => {
      return a.SortOrder - b.SortOrder;
    });
    return Items;
  };

  const parentFunctionCall = async () => {
    let folderId: any = "";
    let ParentId: any = "";
    try {
      var isShowTimeEntry =
        SelectedProp.TimeEntry != "" ? JSON.parse(SelectedProp.TimeEntry) : "";

      var isShowSiteCompostion =
        SelectedProp.SiteCompostion != ""
          ? JSON.parse(SelectedProp.SiteCompostion)
          : "";
    } catch (error: any) {
      console.log(error);
    }
    if (SelectedProp != undefined) {
      SelectedProp.isShowSiteCompostion = isShowSiteCompostion;
      SelectedProp.isShowTimeEntry = isShowTimeEntry;
    }
    ContextValue = SelectedProp;

    loadAllMasterTask();
    let web = ContextValue.siteUrl;
    let url = `${web}/_api/lists/getbyid('${ContextValue.MasterTaskListID}')/items?$select=ItemRank,Item_x0020_Type,Portfolios/Id,Portfolios/Title,PortfolioType/Id,PortfolioType/Title,PortfolioType/Color,PortfolioType/IdRange,Site,FolderID,PortfolioStructureID,ValueAdded,Idea,TaskListName,TaskListId,WorkspaceType,CompletedDate,ClientActivityJson,ClientSite,Item_x002d_Image,Sitestagging,SiteCompositionSettings,TechnicalExplanations,Deliverables,Author/Id,Author/Title,Editor/Id,Editor/Title,Package,Short_x0020_Description_x0020_On,Short_x0020_Description_x0020__x,Short_x0020_description_x0020__x0,AdminNotes,AdminStatus,Background,Help_x0020_Information,BasicImageInfo,Item_x0020_Type,AssignedTo/Title,AssignedTo/Name,AssignedTo/Id,Categories,FeedBack,ComponentLink,FileLeafRef,Title,Id,Comments,StartDate,DueDate,Status,Body,Company,Mileage,PercentComplete,FeedBack,Attachments,Priority,PriorityRank,Created,Modified,TeamMembers/Id,TeamMembers/Title,Parent/Id,Parent/Title,Parent/ItemType,TaskCategories/Id,TaskCategories/Title,ClientCategory/Id,ClientCategory/Title,FeatureType/Title,FeatureType/Id&$expand=Author,Editor,ClientCategory,Parent,AssignedTo,TeamMembers,PortfolioType,Portfolios,FeatureType,TaskCategories&$filter=Id eq ${ID}&$top=4999`;
    let response: any = [];
    let responsen: any = []; // this variable is used for storing list items
    let SiteCompositionTemp: any = [];
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
            item.AssignedTo =
              item.AssignedTo.results === undefined
                ? []
                : item.AssignedTo.results;

            item.TeamMembers =
              item.TeamMembers.results === undefined
                ? []
                : item.TeamMembers.results;

            item.siteUrl = ContextValue.siteUrl;
            item.FeatureTypeTitle = "";
            if (item?.FeatureType?.Id != undefined) {
              item.FeatureTypeTitle = item?.FeatureType?.Title;
            }

            if (item.Sitestagging?.length > 0) {
              SiteCompositionTemp = JSON.parse(item.Sitestagging);
            } else {
              SiteCompositionTemp = [];
            }
            if (item.ClientCategory?.results?.length > 0) {
              let TempCCItems: any = [];
              AllClientCategoryDataBackup?.map((AllCCItem: any) => {
                item.ClientCategory?.results?.map((SelectedCCItem: any) => {
                  if (SelectedCCItem?.Id == AllCCItem?.Id) {
                    TempCCItems.push(AllCCItem);
                  }
                });
              });
              if (TempCCItems?.length > 0) {
                SiteCompositionTemp?.map((TaggedSC: any) => {
                  TempCCItems?.map((TaggedCC: any) => {
                    if (TaggedSC.Title == TaggedCC.siteName) {
                      if (TaggedSC?.ClientCategory?.length > 0) {
                        TaggedSC.ClientCategory?.push(TaggedCC);
                      } else {
                        TaggedSC.ClientCategory = [TaggedCC];
                      }
                    }
                  });
                });
              }
            }

            item.siteCompositionData = SiteCompositionTemp;
            item.listId = ContextValue.MasterTaskListID;
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
                  responsen = [];
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
              item?.Parent?.Id != undefined &&
              item.Item_x0020_Type == "Feature"
            ) {
              ParentId = item?.Parent?.Id;
              let urln = `${SelectedProp.siteUrl}/_api/lists/getbyid('${ContextValue.MasterTaskListID}')/items?$select=Id,Parent/Id,Title,Parent/Title,Parent/ItemType&$expand=Parent&$filter=Id eq ${ParentId}`;
              $.ajax({
                url: urln,
                method: "GET",
                headers: {
                  Accept: "application/json; odata=verbose",
                },
                success: function (mydata) {
                  ParentData = [];
                  ParentData.push(mydata?.d?.results[0]);
                  combinedArray = [
                    { ...data },
                    { ...ParentData },
                    { ...ParentData[0]?.Parent },
                  ];
                  setParentData(ParentData);
                  if (mydata.d.__next) {
                    urln = mydata.d.__next;
                  } else {
                    console.log(ParentData);
                  }
                },
                error: function (error) {
                  console.log(error);
                  // error handler code goes here
                },
              });
            }
            if (item?.PortfolioType?.Title != undefined) {
              let filter = "";
              if (item?.PortfolioType?.Title == "Component") {
                filter += "(Components / Id eq " + ID + ")";
              } else if (item?.PortfolioType?.Title == "Service") {
                filter += "(Service / Id eq " + ID + ")";
              }

              let urln = `${web}/_api/lists/getbyid('${ContextValue.SmartHelpListID}')/items?$select=Id,Title,ItemRank,PercentComplete,Categories,AssignedTo/Id,AssignedTo/Title,Body,DueDate,ItemType,Priority,StartDate,Status&$expand=AssignedTo&$filter=${filter}`;
              $.ajax({
                url: urln,
                method: "GET",
                headers: {
                  Accept: "application/json; odata=verbose",
                },
                success: function (data) {
                  if (data != undefined) {
                    AllHelp = [];
                    AllQuestion = [];
                    data.d.results.forEach(function (item: any) {
                      item.AssignedTo =
                        item?.AssignedTo?.results === undefined
                          ? []
                          : item?.AssignedTo?.results;

                      item.TeamMembers =
                        item?.TeamMembers?.results === undefined
                          ? []
                          : item?.TeamMembers?.results;

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
          if (
            response?.length > 0 &&
            response[0]?.PortfolioType?.Color != undefined
          ) {
            document?.documentElement?.style?.setProperty(
              "--SiteBlue",
              response[0]?.PortfolioType?.Color
            );
          }

          console.log(response);
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
    // Get Project Data
    GetListItems();
    getMasterTaskListTasks();
    getPortFolioType();
  };

  let getMasterTaskListTasks = async function () {
    let web = new Web(ContextValue?.siteUrl);

    componentDetails = await web.lists
      .getById(ContextValue.MasterTaskListID)
      .items.select(
        "Item_x0020_Type",
        "Title",
        "PortfolioStructureID",
        "Id",
        "PercentComplete",
        "Portfolios/Id",
        "Portfolios/Title"
      )
      .expand("Portfolios")
      .filter("(Item_x0020_Type eq 'Project' or Item_x0020_Type eq 'Sprint') and Portfolios/Id eq " + ID)
      .top(4000)
      .get();

    // Project Data for HHHH Project Management

    setfilterdata(componentDetails);
  };
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

  data.map((item: any) => {
    if (item?.PortfolioType?.Title != undefined) {
      TypeSite = item?.PortfolioType?.Title;
    }
    var inputString = item?.Parent?.Title;
    item.limitedString = inputString?.substring(0, 13) + "...";
    item.mergedStatus = `${item?.Status} - ${(
      item?.PercentComplete * 100
    ).toFixed(0)}% `;
    item.TaskID = item?.PortfolioStructureID;
    // Prepare Show task Teammember data

    if (item.AssignedTo != undefined && item.AssignedTo.length > 0) {
      $.map(item.AssignedTo, (Assig: any) => {
        if (Assig.Id != undefined) {
          $.map(AllTaskuser, (users: any) => {
            if (
              Assig.Id != undefined &&
              users.AssingedToUser != undefined &&
              Assig.Id == users.AssingedToUser.Id
            ) {
              users.ItemCover = users.Item_x0020_Cover;
              item?.TeamLeaderUser?.push(users);
            }
          });
        }
      });
    }
    if (item.ResponsibleTeam != undefined && item.ResponsibleTeam.length > 0) {
      $.map(item.ResponsibleTeam, (Assig: any) => {
        if (Assig.Id != undefined) {
          $.map(AllTaskuser, (users: any) => {
            if (
              Assig.Id != undefined &&
              users.AssingedToUser != undefined &&
              Assig.Id == users.AssingedToUser.Id
            ) {
              users.ItemCover = users.Item_x0020_Cover;
              item?.TeamLeaderUser?.push(users);
            }
          });
        }
      });
    }
    if (item.TeamMembers != undefined && item.TeamMembers.length > 0) {
      $.map(item.TeamMembers, (Assig: any) => {
        if (Assig.Id != undefined) {
          $.map(AllTaskuser, (users: any) => {
            if (
              Assig.Id != undefined &&
              users.AssingedToUser != undefined &&
              Assig.Id == users.AssingedToUser.Id
            ) {
              users.ItemCover = users.Item_x0020_Cover;
              item?.TeamLeaderUser?.push(users);
            }
          });
        }
      });
    }

    // Set the page titile
    document.title = `${item?.PortfolioType?.Title}-${item.Title}`;
  });
  //    Get Folder data

  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = web;
    item["listName"] = ContextValue.MasterTaskListID;
    setIsComponent(true);
    setCMSToolComponent(item);
  };
  const Call = React.useCallback((item1) => {
    count++;
    setIsComponent(false);
    setIsTask(false);
  }, []);

  //  Remove duplicate values

  // For the On Click icons on the Table
  if (
    ParentData != undefined &&
    ParentData[0]?.Parent?.ItemType == "Component" &&
    data[0].Item_x0020_Type == "Feature"
  ) {
    Iconpps = [
      {
        ItemType: "Component",
        Id: ParentData[0]?.Parent?.Id,
        Title: ParentData[0]?.Parent?.Title,
        Icon: "C",
        nextIcon: ">",
      },
      {
        ItemType: "SubComponent",
        Id: ParentData[0]?.Id,
        Title: ParentData[0]?.Title,
        Icon: "S",
        nextIcon: ">",
      },
      {
        ItemType: "Feature",
        Id: data[0]?.Id,
        Title: data[0]?.Title,
        Icon: "F",
      },
    ];
  }
  if (
    data[0]?.Parent?.ItemType == "Component" &&
    data[0].Item_x0020_Type == "SubComponent"
  ) {
    Iconpps = [
      {
        ItemType: "Component",
        Id: data[0]?.Parent.Id,
        Title: data[0]?.Parent.Title,
        Icon: "C",
        nextIcon: ">",
      },
      {
        ItemType: "SubComponent",
        Id: data[0]?.Id,
        Title: data[0]?.Title,
        Icon: "S",
      },
    ];
  }
  if (data[0]?.Item_x0020_Type == "Component") {
    Iconpps = [
      {
        ItemType: "Component",
        Id: data[0]?.Id,
        Title: data[0]?.Title,
        Icon: "C",
      },
    ];
  }

  // End Here

  // Basic Image
  if ((data?.length != 0 && data[0]?.BasicImageInfo != undefined) || null) {
    imageArray = JSON.parse(data[0]?.BasicImageInfo);
  }

  //  basic image End
  // ImagePopover
  const OpenModal = (e: any, item: any) => {
    if (item.Url != undefined) {
      item.ImageUrl = item?.Url;
    }
    //debugger;
    e.preventDefault();
    // console.log(item);
    SetImagePopover({
      isModalOpen: true,
      imageInfo: item,
      showPopup: "block",
    });
  };

  //close the model

  const CloseModal = (e: any) => {
    e.preventDefault();
    SetImagePopover({
      isModalOpen: false,
      imageInfo: { ImageName: "", ImageUrl: "" },
      showPopup: "none",
    });
  };
  // Inline editing
  const [Item, setItem] = React.useState("");
  const handleFieldChange = (fieldName: any) => (e: any) => {
    const updatedItem = { ...data[0], [fieldName]: e.target.value };
    setItem(updatedItem);
  };

  // ********* anc calll back ****************
  const AncCallback = (type: any) => {
    switch (type) {
      case "anc": {
        relevantDocRef?.current?.loadAllSitesDocuments();
        break;
      }
      case "smartInfo": {
        smartInfoRef?.current?.GetResult();
        break;
      }
      default: {
        relevantDocRef?.current?.loadAllSitesDocuments();
        smartInfoRef?.current?.GetResult();
        keyDocRef?.current?.loadAllSitesDocumentsEmail();
        break;
      }
    }
  };

  const contextCall = React.useCallback(
    (data: any, path: any, releventKey: any) => {
      if (data != null && path != null && path != "") {
        Setkeydoc(data);
        SetFileDirRef(path);
      }
      if (releventKey) {
        relevantDocRef?.current?.loadAllSitesDocuments();
      } else if (data == null && path == null && releventKey == false) {
        keyDocRef?.current?.loadAllSitesDocumentsEmail();
        relevantDocRef?.current?.loadAllSitesDocuments();
      }
    },
    []
  );

  //  inline editing callback
  const inlineCallBack = React.useCallback((item: any) => {
    let updatedTasks = data;
    updatedTasks[0].Categories = item?.Categories;
    updatedTasks[0].TaskCategories = item?.TaskCategories;
    setTaskData(updatedTasks);
    count++;
  }, []);

  if (data[0]?.Item_x0020_Type == "SubComponent") {
    combinedArray.push(data[0].Parent);
  } else if (data[0]?.Item_x0020_Type == "Component") {
    combinedArray.push(data[0]);
  }

  // ProjectInline Editing
  const openPortfolioPopupFunction = (change: any) => {
    setisopenProjectpopup(true);
    mydata.push(data[0]);
  };

  const callServiceComponent = React.useCallback(
    (item1: any, type: any, functionType: any) => {
      if (functionType === "Close") {
        if (type === "Multi") {
          setisopenProjectpopup(false);
        } else {
          setisopenProjectpopup(false);
        }
      } else {
        if (type === "Multi" || type === "Single") {
          let mydataid: any = [mydata[0]?.Id];
          let filteredIds = item1
            .filter((item: { Id: null }) => item.Id !== null)
            .map((item: { Id: any }) => item.Id);

          updateMultiLookupField(filteredIds, mydataid, SelectedProp);
          setisopenProjectpopup(false);
        }
      }
    },
    []
  );

  // this is used for site compositipon component callback

  const ClosePopupCallBack = (FnType: any) => {
    if ((FnType = "Close")) {
      setSiteCompositionShow(false);
    }
    if ((FnType = "Save")) {
      setSiteCompositionShow(false);
      setTimeout(() => {
        parentFunctionCall();
      }, 1000);
    }
  };

  async function updateMultiLookupField(
    itemIds: number[],
    lookupIds: number[],
    AllListId: any
  ) {
    try {
      let web = new Web(AllListId?.siteUrl);
      for (const itemId of itemIds) {
        // Update the multi-lookup field for each item
        await web.lists
          .getById(AllListId?.MasterTaskListID)
          .items.getById(itemId)
          .update({
            PortfoliosId: {
              results:
                lookupIds !== undefined && lookupIds?.length > 0
                  ? lookupIds
                  : [],
            },
          })
          .then((res: any) => {
            getMasterTaskListTasks();
            count++;
            console.log(res);
          });
      }
    } catch (error) {
      console.error("Error updating multi-lookup field:", error);
    }
  }

  return (
    <myContextValue.Provider
      value={{
        ...myContextValue,
        user: AllTaskuser,
        FunctionCall: contextCall,
        keyDoc: keydoc,
        FileDirRef: FileDirRef,
        ColorCode: data[0]?.PortfolioType?.Color,
      }}
    >
      <div>
        {/* breadcrumb & title */}
        <section className="ContentSection">
          <section>
            <div className="col">
              <div className="d-flex justify-content-between p-0">
                <ul className="spfxbreadcrumb mb-0 mt-16 p-0">
                  <li>
                    <a href="#">
                      <FaHome />{" "}
                    </a>
                  </li>
                  {data.map((item: any) => {
                    return (
                      <>
                        <li>
                          {/* if="Task.PortfolioType=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                          {item?.PortfolioType?.Title != undefined && (
                            <a
                              target="_blank"
                              data-interception="off"
                              href={
                                SelectedProp.siteUrl +
                                "/SitePages/Team-Portfolio.aspx"
                              }
                            >
                              Team-Portfolio
                            </a>
                          )}
                        </li>
                        {/* Changes done by Robin Start*/}
                        <li>
                          {/* if="Task.PortfolioType=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                          {item?.PortfolioType?.Title != undefined && (
                            <a
                              target="_blank"
                              data-interception="off"
                              href={
                                SelectedProp.siteUrl +
                                "/SitePages/Team-Portfolio.aspx?PortfolioType=" +
                                item?.PortfolioType?.Title
                              }
                            >
                              {item?.PortfolioType?.Title} - Portfolio
                            </a>
                          )}
                        </li>
                        {/* Changes done by Robin End*/}
                        {(item?.Item_x0020_Type == "SubComponent" ||
                          item?.Item_x0020_Type == "Feature") && (
                          <>
                            <li>
                              {/* if="Task.PortfolioType=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                              {ParentData != undefined &&
                                ParentData[0]?.Parent?.Id != undefined &&
                                ParentData?.map((ParentD: any) => {
                                  return (
                                    <>
                                      {ParentD?.Parent != undefined && (
                                        <a
                                          target="_blank"
                                          data-interception="off"
                                          href={`${SelectedProp.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${ParentD?.Parent?.Id}`}
                                        >
                                          {ParentD?.Parent?.Title}
                                        </a>
                                      )}
                                    </>
                                  );
                                })}
                            </li>
                            <li>
                              {/* if="Task.PortfolioType=='Component'  (Task.Item_x0020_Type=='Component Category')" */}
                              {item?.Parent != undefined && (
                                <a
                                  target="_blank"
                                  data-interception="off"
                                  href={`${SelectedProp.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${item?.Parent?.Id}`}
                                >
                                  {item?.Parent?.Title}
                                </a>
                              )}
                            </li>
                          </>
                        )}

                        <li>
                          <a>{item?.Title}</a>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="col">
              <div className="p-0" style={{ verticalAlign: "top" }}>
                {data.map((item: any) => (
                  <>
                    <h2 className="heading d-flex justify-content-between align-items-center">
                      <span className="alignCenter">
                        {(item?.PortfolioType?.Id === 1 ||
                          item?.PortfolioType?.Id === 2 ||
                          item?.PortfolioType?.Id === 3) &&
                          item?.Item_x0020_Type == "SubComponent" && (
                            <>
                              <span className="Dyicons mt-1">S</span>{" "}
                              <a className="mx-1">{item?.Title}</a>{" "}
                              <span onClick={(e) => EditComponentPopup(item)}>
                                {" "}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="25"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z"
                                    fill="#333333"
                                  />
                                </svg>
                                {/* <img
                                src={require("../../../Assets/ICON/edit_page.svg")}
                                width="30"
                                height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              /> */}
                              </span>
                            </>
                          )}

                        {(item?.PortfolioType?.Id === 1 ||
                          item?.PortfolioType?.Id === 2 ||
                          item?.PortfolioType?.Id === 3) &&
                          item?.Item_x0020_Type == "Feature" && (
                            <>
                              <span className="Dyicons mt-1">F</span>{" "}
                              <a className="mx-1">{item?.Title}</a>{" "}
                              <span onClick={(e) => EditComponentPopup(item)}>
                                {" "}
                                {/* <img
                                src={require("../../../Assets/ICON/edit_page.svg")}
                                width="30"
                                height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              /> */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="25"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </span>
                            </>
                          )}
                        {(item?.PortfolioType?.Id === 1 ||
                          item?.PortfolioType?.Id === 2 ||
                          item?.PortfolioType?.Id === 3) &&
                          item?.Item_x0020_Type != "SubComponent" &&
                          item?.Item_x0020_Type != "Feature" && (
                            <>
                              <span className="Dyicons mt-1">C</span>{" "}
                              <a className="mx-1">{item?.Title}</a>{" "}
                              <span onClick={(e) => EditComponentPopup(item)}>
                                {" "}
                                {/* <img
                                src={require("../../../Assets/ICON/edit_page.svg")}
                                width="30"
                                height="25"
                                onClick={(e) => EditComponentPopup(item)}
                              /> */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="30"
                                  height="25"
                                  viewBox="0 0 48 48"
                                  fill="none"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </span>
                            </>
                          )}
                      </span>
                      {SelectedProp?.Context?._pageContext?._web?.title ===
                        "SP" && (
                        <span className="text-end fs-6">
                          <a
                            target="_blank"
                            data-interception="off"
                            href={
                              SelectedProp.siteUrl +
                              "/SitePages/Portfolio-Profile-Old.aspx?taskId=" +
                              ID
                            }
                          >
                            Old Portfolio profile page
                          </a>
                        </span>
                      )}
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
                          <dt className="bg-fxdark" title="Structure ID ">
                            ID
                          </dt>
                          <dd className="bg-light">
                            <span>
                              {data.map((item: any, index: any) => (
                                <ReactPopperTooltipSingleLevel
                                  CMSToolId={item?.PortfolioStructureID}
                                  row={item}
                                  singleLevel={true}
                                  masterTaskData={AllMasterTaskData}
                                  AllSitesTaskData={[]}
                                  AllListId={SelectedProp}
                                />
                              ))}
                            </span>
                            {hoveredId && <span>{hoveredId}</span>}
                          </dd>
                        </dl>
                        <dl>
                          <dt className="bg-fxdark" title="Start Date">
                            Start Date
                          </dt>
                          <dd className="bg-light">
                            {data.map((item: any, index: any) => (
                              <a>
                                <EditableField
                                  key={index}
                                  listName="Master Tasks"
                                  itemId={item?.Id}
                                  fieldName="StartDate"
                                  value={
                                    item?.StartDate != undefined
                                      ? Moment(item?.StartDate).format(
                                          "DD/MM/YYYY"
                                        )
                                      : ""
                                  }
                                  TaskProfilePriorityCallback={null}
                                  onChange={handleFieldChange("StartDate")}
                                  type="Date"
                                  web={ContextValue?.siteUrl}
                                />
                              </a>
                            ))}
                          </dd>
                        </dl>

                        <dl>
                          <dt className="bg-fxdark" title="Status">
                            Status
                          </dt>
                          <dd className="bg-light">
                            {data.map((item: any, index: any) => (
                              <EditableField
                                key={index}
                                listName="Master Tasks"
                                itemId={item.Id}
                                fieldName="PercentComplete"
                                value={
                                  item?.PercentComplete != undefined
                                    ? (item?.PercentComplete * 100).toFixed(0)
                                    : ""
                                }
                                TaskProfilePriorityCallback={null}
                                onChange={handleFieldChange("PercentComplete")}
                                type={item.Status}
                                web={ContextValue?.siteUrl}
                              />
                            ))}
                          </dd>
                        </dl>
                        <dl>
                          <dt className="bg-fxdark" title="Assigned Person">
                            Team Members
                          </dt>
                          <dd className="bg-light d-flex">
                            {AllTaskuser?.length > 0 && (
                              // <InlineEditingcolumns AllListId={SelectedProp} callBack={inlineCallBack} columnName='Team' item={data[0]} TaskUsers={AllTaskuser} pageName={'portfolioprofile'} />

                              <ShowTaskTeamMembers
                                key={data[0]?.Id}
                                props={data[0]}
                                TaskUsers={AllTaskuser}
                                Context={SelectedProp}
                              />
                            )}
                          </dd>
                        </dl>
                      </div>
                      <div className="col-md-6 p-0">
                        {data.map((item: any) => {
                          return (
                            <>
                              <dl>
                                <dt className="bg-fxdark" title="Tagged Parent">
                                  Parent
                                </dt>
                                <dd className="bg-light">
                                  {item?.Parent?.Title != undefined && (
                                    <>
                                      <a
                                        target="_blank"
                                        data-interception="off"
                                        href={
                                          SelectedProp.siteUrl +
                                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                                          item?.Parent?.Id
                                        }
                                        title={item?.Parent?.Title}
                                      >
                                        {item?.limitedString}
                                      </a>
                                      <span className="pull-right">
                                        <span className="pencil_icon">
                                          <span className="hreflink">
                                            {item?.PortfolioType?.Title ==
                                              "Component" && (
                                              <>
                                                <a
                                                  target="_blank"
                                                  data-interception="off"
                                                  href={
                                                    SelectedProp.siteUrl +
                                                    "/SitePages/Team-Portfolio.aspx?ComponentID=" +
                                                    item?.Parent?.Id
                                                  }
                                                >
                                                  <img
                                                    src={require("../../../Assets/ICON/edit_page.svg")}
                                                    width="20"
                                                    height="25"
                                                  />{" "}
                                                </a>
                                              </>
                                            )}
                                            {item?.PortfolioType?.Title ==
                                              "Service" && (
                                              <>
                                                <a
                                                  target="_blank"
                                                  data-interception="off"
                                                  href={
                                                    SelectedProp.siteUrl +
                                                    "/SitePages/Team-Portfolio.aspx?ComponentID=" +
                                                    item?.Parent?.Id
                                                  }
                                                >
                                                  {" "}
                                                  <img
                                                    src={require("../../../Assets/ICON/edit_page.svg")}
                                                    width="30"
                                                    height="25"
                                                  />{" "}
                                                </a>
                                              </>
                                            )}
                                          </span>
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </dd>
                              </dl>
                            </>
                          );
                        })}
                        <dl>
                          <dt className="bg-fxdark" title="Due date">
                            Due Date
                          </dt>
                          <dd className="bg-light">
                            <span>
                              {data.map((item: any, index: any) => (
                                <a>
                                  <EditableField
                                    key={index}
                                    listName="Master Tasks"
                                    itemId={item?.Id}
                                    fieldName="DueDate"
                                    value={
                                      item?.DueDate != undefined
                                        ? Moment(item?.DueDate).format(
                                            "DD/MM/YYYY"
                                          )
                                        : ""
                                    }
                                    TaskProfilePriorityCallback={null}
                                    onChange={handleFieldChange("DueDate")}
                                    type="Date"
                                    web={ContextValue?.siteUrl}
                                  />
                                </a>
                              ))}
                            </span>
                          </dd>
                        </dl>
                        <dl>
                          <dt className="bg-fxdark" title="Item Rank">
                            Item Rank
                          </dt>
                          <dd className="bg-light">
                            {data.map((item: any, index: any) => (
                              <EditableField
                                key={index}
                                listName="Master Tasks"
                                itemId={item?.Id}
                                fieldName="ItemRank"
                                value={
                                  item?.ItemRank != undefined
                                    ? item?.ItemRank
                                    : ""
                                }
                                TaskProfilePriorityCallback={null}
                                onChange={handleFieldChange("ItemRank")}
                                type=""
                                web={ContextValue?.siteUrl}
                              />
                            ))}
                          </dd>
                        </dl>
                        <dl>
                          <dt className="bg-fxdark" title="TaggedProject">
                            Project
                          </dt>
                          <dd className="bg-light">
                            <div>
                              {filterdata?.map((item: any, Index: any) => (
                                <span
                                  className="accordion-body pt-1"
                                  id="testDiv1"
                                  key={Index}
                                >
                                  <a
                                    href={
                                      SelectedProp.siteUrl +
                                      "/SitePages/PX-Profile.aspx?ProjectId=" +
                                      item?.Id
                                    }
                                    data-interception="off"
                                    target="_blank"
                                  >
                                    {item?.PortfolioStructureID}{" "}
                                  </a>{" "}
                                  {Index !== filterdata.length - 1 ? ", " : ""}
                                </span>
                              ))}
                              <a
                                className="pancil-icons"
                                onClick={() =>
                                  openPortfolioPopupFunction("Project")
                                }
                              >
                                <span className="svg__iconbox svg__icon--editBox"></span>
                              </a>
                            </div>
                          </dd>
                        </dl>
                        {/* {data.map((item: any) => {
                    return (
                      <>
                        {item?.PortfolioType?.Title && (
                          <dl>
                            <dt className="bg-fxdark" title="Tagged Component">Portfolio Item</dt>
                            <dd className={`bg-light `}>
                              <div
                                className="ps-1"
                                style={{
                                  backgroundColor: `${item?.PortfolioType?.Color}`,
                                  boxSizing: "border-box"
                                }}
                              >
                                <a
                                  className="text-light"
                                  style={{ border: "0px" }}
                                  target="_blank"
                                  data-interception="off"
                                  href={
                                    SelectedProp.siteUrl +
                                    `/SitePages/Portfolio-Profile.aspx?taskId=${item?.Portfolios?.results === undefined
                                      ? item?.Portfolios?.Id
                                      : item?.Portfolios?.results[0]?.Id
                                    }`
                                  }
                                >
                                  {item?.Portfolios?.results === undefined
                                    ? item?.Portfolios?.Title
                                    : item?.Portfolios?.results[0]?.Title}
                                </a>
                              </div>
                            </dd>
                          </dl>
                        )}
                      </>
                    );
                  })} */}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 p-0">
                    <dl>
                      <dt className="bg-fxdark" title="Priority of Task">
                        Priority
                      </dt>
                      <dd className="bg-light">
                        {data.map((item: any, index: any) => (
                          <EditableField
                            key={index}
                            listName="Master Tasks"
                            itemId={item?.Id}
                            fieldName="Priority"
                            value={
                              item?.PriorityRank != undefined
                                ? item?.PriorityRank
                                : ""
                            }
                            TaskProfilePriorityCallback={null}
                            onChange={handleFieldChange("Priority")}
                            type=""
                            web={ContextValue?.siteUrl}
                          />
                        ))}
                      </dd>
                    </dl>
                    <dl>
                      <dt className="bg-fxdark" title="Completion Date">
                        Completion Date
                      </dt>
                      <dd className="bg-light">
                        {data.map((item: any, index: any) => (
                          <a>
                            <EditableField
                              key={index}
                              listName="Master Tasks"
                              itemId={item?.Id}
                              fieldName="CompletedDate"
                              value={
                                item?.CompletedDate != undefined
                                  ? Moment(item?.CompletedDate).format(
                                      "DD/MM/YYYY"
                                    )
                                  : ""
                              }
                              TaskProfilePriorityCallback={null}
                              onChange={handleFieldChange("CompletedDate")}
                              type="Date"
                              web={ContextValue?.siteUrl}
                            />
                          </a>
                        ))}
                      </dd>
                    </dl>
                    <dl>
                      <dt className="bg-fxdark" title="Task Category">
                        Categories
                      </dt>
                      <dd className="bg-light text-break">
                        {data?.length > 0 && (
                          <>
                            <InlineEditingcolumns
                              AllListId={ContextValue}
                              callBack={inlineCallBack}
                              columnName="TaskCategories"
                              item={data[0]}
                              TaskUsers={AllTaskuser}
                              pageName={"portfolioprofile"}
                            />
                          </>
                        )}
                        {/* {data.map((item,index) => (
                            
                            <a>{item?.Categories}
                             <EditableField
                                key={index}
                                listName="Master Tasks"
                                itemId={item?.Id}
                                fieldName="Categories"
                                value={
                                  item?.Categories
                                }
                                onChange={handleFieldChange("Categories")}
                                type="Categories"
                                web={ContextValue}
                              />
                            </a>
                          ))} */}
                      </dd>
                    </dl>
                    <dl>
                      <dt className="bg-fxdark" title="Feature Type">
                        Feature Type
                      </dt>
                      <dd className="bg-light text-break">
                        {data?.length > 0 && (
                          <span>{data[0]?.FeatureType?.Title}</span>
                        )}
                      </dd>
                    </dl>
                  </div>
                  <div className="col-md-12">
                    <section className="row  accordionbox">
                      {data.length != 0 && data[0]?.ComponentLink != null && (
                        <div className="d-flex mb-1">
                          <div className="bg-fxdark p-2">
                            <label>Url</label>
                          </div>
                          <div className="bg-light p-2 text-break full-width">
                            <a
                              target="_blank"
                              data-interception="off"
                              href={data[0].ComponentLink?.Url}
                            >
                              {data[0]?.ComponentLink?.Url}
                            </a>
                          </div>
                        </div>
                      )}
                      <div className="accordion  pe-1 overflow-hidden">
                        {/* Project Management Box */}
                        {filterdata?.length !== 0 && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                HHHH Project Management
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              {filterdata?.map((item: any) => (
                                <div
                                  className="accordion-body pt-1"
                                  id="testDiv1"
                                >
                                  <a
                                    href={
                                      SelectedProp.siteUrl +
                                      "/SitePages/PX-Profile.aspx?ProjectId=" +
                                      item?.Id
                                    }
                                    data-interception="off"
                                    target="_blank"
                                  >
                                    {item?.Title}{" "}
                                  </a>{" "}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                        {/* Project Management Box End */}
                        {/* Description */}
                        {data[0]?.Body !== null &&
                          removeHtmlAndNewline(data[0]?.Body).trim() !== "" && (
                            <details open>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  Description
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <p
                                  className="m-0"
                                  dangerouslySetInnerHTML={{
                                    __html: data[0]?.Body,
                                  }}
                                ></p>
                              </div>
                            </details>
                          )}

                        {/* Short description */}

                        {data[0]?.Short_x0020_Description_x0020_On != null &&
                          removeHtmlAndNewline(
                            data[0]?.Short_x0020_Description_x0020_On
                          ).trim() !== "" && (
                            <details open>
                              <summary className="alignCenter">
                                <label className="toggler full_width">
                                  Short Description
                                </label>
                              </summary>
                              <div className="border border-top-0 p-2">
                                <p
                                  className="m-0"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      data[0]?.Short_x0020_Description_x0020_On,
                                  }}
                                ></p>
                              </div>
                            </details>
                          )}

                        {/* Question description */}
                        {AllQuestion?.length != 0 && (
                          <details>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                Question Description{" "}
                                <span>({AllQuestion?.length})</span>
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              {AllQuestion.map((item) => (
                              <p
                                        className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item?.Body,
                                        }}
                                      ></p>
                              ))}
                            </div>
                          </details>
                        )}

                        {/* Help description */}
                        {AllHelp?.length != 0 && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                Help Description
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              
                                  {AllHelp.map((item) => (
                                      <p className="m-0"
                                        dangerouslySetInnerHTML={{
                                          __html: item?.Body,
                                        }}
                                      ></p>
                                  ))}
                            </div>
                          </details>
                        )}

                        {/* Background */}

                        {data[0]?.Background != null && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                Background
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              <p
                                className="m-0"
                                dangerouslySetInnerHTML={{
                                  __html: data[0]?.Background,
                                }}
                              ></p>
                            </div>
                          </details>
                        )}

                        {/* Idea */}
                        {data[0]?.Idea != null && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">Idea</label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              <p
                                className="m-0"
                                dangerouslySetInnerHTML={{
                                  __html: data[0]?.Idea,
                                }}
                              ></p>
                            </div>
                          </details>
                        )}

                        {/* Value Added */}
                        {data[0]?.ValueAdded != null && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                Value Added
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              <p
                                className="m-0"
                                dangerouslySetInnerHTML={{
                                  __html: data[0]?.ValueAdded,
                                }}
                              ></p>
                            </div>
                          </details>
                        )}

                        {/* Help Information Help_x0020_Information */}
                        {data[0]?.Help_x0020_Information != null && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                Help Information
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              <p
                                className="m-0"
                                dangerouslySetInnerHTML={{
                                  __html: data[0]?.Help_x0020_Information,
                                }}
                              ></p>
                            </div>
                          </details>
                        )}

                        {/* Technical Explanation */}
                        {data[0]?.TechnicalExplanations !== null && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                Technical Explanation
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              <p
                                className="m-0"
                                dangerouslySetInnerHTML={{
                                  __html: data[0]?.TechnicalExplanations,
                                }}
                              ></p>
                            </div>
                          </details>
                        )}

                        {/* Deliverables */}
                        {data[0]?.Deliverables !== null && (
                          <details open>
                            <summary className="alignCenter">
                              <label className="toggler full_width">
                                Deliverables
                              </label>
                            </summary>
                            <div className="border border-top-0 p-2">
                              <p
                                className="m-0"
                                dangerouslySetInnerHTML={{
                                  __html: data[0]?.Deliverables,
                                }}
                              ></p>
                            </div>
                          </details>
                        )}
                        {
                          <KeyDocuments
                            ref={relevantDocRef}
                            AllListId={SelectedProp}
                            Context={SelectedProp?.Context}
                            siteUrl={SelectedProp?.siteUrl}
                            DocumentsListID={SelectedProp.DocumentsListID}
                            siteName={"Master Tasks"}
                            folderName={data[0]?.Title}
                            keyDoc={true}
                          ></KeyDocuments>
                        }
                      </div>
                    </section>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <aside>
                  {data.map((item: any, index: any) => (
                    <div key={index}>
                      {item?.Item_x002d_Image !== null && (
                        <div>
                          <img
                            alt={item?.Item_x002d_Image?.Url}
                            style={{ width: "280px", height: "145px" }}
                            src={item?.Item_x002d_Image?.Url}
                            onClick={() =>
                              openImageInNewTab(item?.Item_x002d_Image?.Url)
                            }
                            onMouseOver={() =>
                              handleMouseOver(item?.Item_x002d_Image?.Url)
                            }
                            onMouseOut={handleMouseOut}
                          />
                        </div>
                      )}

                      {showOverlay &&
                        currentImage &&
                        currentImage === item?.Item_x002d_Image?.Url && (
                          <div className="imghover ">
                            <div
                              className="popup"
                              style={{ left: "400px", top: "118px" }}
                            >
                              <div className="parentDiv">
                                <span style={{ color: "white" }}>
                                  {currentImage}
                                </span>
                                <img
                                  style={{ maxWidth: "100%" }}
                                  src={currentImage}
                                  alt={currentImage}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  ))}

                  <div className="mb-3 mt-1">
                    {SelectedProp?.isShowSiteCompostion ? (
                      <div className="Sitecomposition mb-2">
                        <div className="dropdown">
                          <a className="sitebutton bg-fxdark alignCenter justify-content-between">
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() =>
                                setComposition(composition ? false : true)
                              }
                            >
                              <span>
                                {composition ? (
                                  <SlArrowDown />
                                ) : (
                                  <SlArrowRight />
                                )}
                              </span>
                              <span className="mx-2">Site Composition</span>
                            </div>
                            <span
                              className="svg__iconbox svg__icon--editBox hreflink"
                              title="Edit Site Composition"
                              onClick={() => setSiteCompositionShow(true)}
                            ></span>
                          </a>
                          {composition &&
                          data?.length > 0 &&
                          data[0]?.siteCompositionData?.length > 0 ? (
                            <div className="spxdropdown-menu">
                              <ul>
                                {data[0]?.siteCompositionData != undefined &&
                                data[0]?.siteCompositionData?.length > 0 ? (
                                  <>
                                    {data[0]?.siteCompositionData?.map(
                                      (SiteDtls: any, i: any) => {
                                        return (
                                          <li className="Sitelist">
                                            <span
                                              className="ms-2"
                                              title={SiteDtls.Title}
                                            >
                                              <img
                                                style={{ width: "22px" }}
                                                src={SiteDtls.SiteImages}
                                              />
                                            </span>

                                            {SiteDtls.ClienTimeDescription !=
                                              undefined && (
                                              <span className="mx-2">
                                                {Number(
                                                  SiteDtls.ClienTimeDescription
                                                ).toFixed(1)}
                                                %
                                              </span>
                                            )}

                                            <span className="d-inline">
                                              {SiteDtls.ClientCategory !=
                                                undefined &&
                                              SiteDtls.ClientCategory.length > 0
                                                ? SiteDtls.ClientCategory?.map(
                                                    (
                                                      clientcat: any,
                                                      Index: any
                                                    ) => {
                                                      return (
                                                        <div
                                                          className={
                                                            Index ==
                                                            SiteDtls
                                                              .ClientCategory
                                                              ?.length -
                                                              1
                                                              ? "mb-0"
                                                              : "mb-0 border-bottom"
                                                          }
                                                        >
                                                          {clientcat.Title}
                                                        </div>
                                                      );
                                                    }
                                                  )
                                                : null}
                                            </span>
                                          </li>
                                        );
                                      }
                                    )}
                                  </>
                                ) : null}
                              </ul>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <>
                    {data?.map((item: any) => (
                      <AncTool
                        item={item}
                        callBack={AncCallback}
                        AllListId={SelectedProp}
                        Context={SelectedProp?.Context}
                        listName={"Master Tasks"}
                      />
                    ))}
                  </>
                  <>
                    {data?.map((item: any) => (
                      <SmartInformation
                        ref={smartInfoRef}
                        Id={item?.Id}
                        AllListId={SelectedProp}
                        Context={SelectedProp?.Context}
                        taskTitle={item?.Title}
                        listName={"Master Tasks"}
                      />
                    ))}
                  </>
                  <>
                    {data?.map((item: any) => {
                      return (
                        <>
                          <RelevantDocuments
                            ref={relevantDocRef}
                            AllListId={SelectedProp}
                            Context={SelectedProp?.Context}
                            siteUrl={SelectedProp?.siteUrl}
                            DocumentsListID={ContextValue?.DocumentsListID}
                            ID={item?.Id}
                            siteName={"Master Tasks"}
                            folderName={item?.Title}
                          ></RelevantDocuments>
                          <RelevantEmail
                            ref={keyDocRef}
                            AllListId={SelectedProp}
                            Context={SelectedProp?.Context}
                            siteUrl={SelectedProp?.siteUrl}
                            DocumentsListID={ContextValue?.DocumentsListID}
                            ID={item?.Id}
                            siteName={"Master Tasks"}
                            folderName={item?.Title}
                          ></RelevantEmail>
                        </>
                      );
                    })}
                  </>
                  <>
                    {data?.map((item: any) => (
                      <CommentCard
                        siteUrl={SelectedProp.siteUrl}
                        AllListId={SelectedProp}
                        userDisplayName={item?.userDisplayName}
                        itemID={item?.Id}
                        listName={"Master Tasks"}
                        Context={SelectedProp.Context}
                      ></CommentCard>
                    ))}
                  </>
                </aside>
              </div>
            </div>
          </section>
        </section>

        {/* table secation artical */}
        {data?.length>0 && <RadimadeTable   tableId="PortfolioProfile"  AllListId={ContextValue} configration={"CSFAWT"} SelectedItem={data[0]}  ComponentFilter={data[0]?.PortfolioType?.Title} TaskFilter={ "PercentComplete lt '0.90' or PercentComplete eq null "}></RadimadeTable>}
        {/* {data.map((item: any) => (
          <ComponentTable
            props={item}
            NextProp={ContextValue}
            Iconssc={Iconpps}
          />
        ))} */}

        <footer className="float-start full_width mt-2 ">
          <div className="d-flex justify-content-between me-3 p-2">
            {data.map((item: any) => {
              return (
                <div>
                  <div>
                    Created{" "}
                    <span>
                      {Moment(item?.Created).format("DD/MM/YYYY hh:mm")}
                    </span>{" "}
                    by <span className="hyperlink">{item?.Author?.Title}</span>
                  </div>
                  <div>
                    Last modified{" "}
                    <span>
                      {Moment(item?.Modified).format("DD/MM/YYYY hh:mm")}
                    </span>{" "}
                    by <span className="hyperlink">{item?.Editor?.Title}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </footer>

        {IsComponent && (
          <EditInstituton
            item={CMSToolComponent}
            SelectD={SelectedProp}
            Calls={Call}
            portfolioTypeData={portfolioTyped}
          ></EditInstituton>
        )}
        {isopenProjectpopup && (
          <ServiceComponentPortfolioPopup
            props={filterdata}
            Dynamic={SelectedProp}
            ComponentType={"Component"}
            selectionType={"Multi"}
            Call={(DataItem: any, Type: any, functionType: any) => {
              callServiceComponent(DataItem, Type, functionType);
            }}
            showProject={isopenProjectpopup}
          />
        )}
        {SiteCompositionShow && (
          <CentralizedSiteComposition
            ItemDetails={data[0]}
            RequiredListIds={SelectedProp}
            closePopupCallBack={ClosePopupCallBack}
            usedFor={"CSF"}
          />
        )}
      </div>
    </myContextValue.Provider>
  );
}
export default Portfolio;
export { myContextValue };
