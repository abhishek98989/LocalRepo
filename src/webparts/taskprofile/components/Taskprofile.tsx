import * as React from 'react';
import * as moment from 'moment';
import { ITaskprofileProps } from './ITaskprofileProps';
import {
  mergeStyleSets,
  FocusTrapCallout,
  FocusZone,
  FocusZoneTabbableElements,
  FontWeights,
  Stack,
  Text,
} from '@fluentui/react';
import { LuBellPlus } from "react-icons/lu";
import { Web } from "sp-pnp-js";
import CommentCard from '../../../globalComponents/Comments/CommentCard';
import EditTaskPopup from '../../../globalComponents/EditTaskPopup/EditTaskPopup';
import * as globalCommon from '../../../globalComponents/globalCommon'
import { BiInfoCircle } from 'react-icons/bi'
import SmartTimeTotal from './SmartTimeTotal';
import RelevantEmail from './ReleventEmails'
import { IoMdArrowDropright, IoMdArrowDropdown } from 'react-icons/io';
import { SlArrowDown, SlArrowRight } from 'react-icons/sl';
import RelevantDocuments from './RelevantDocuments';
import SmartInformation from './SmartInformation';
import VersionHistoryPopup from '../../../globalComponents/VersionHistroy/VersionHistory';
import RadimadeTable from '../../../globalComponents/RadimadeTable'
import EmailComponenet from './emailComponent';
import AncTool from '../../../globalComponents/AncTool/AncTool'
import { myContextValue } from '../../../globalComponents/globalCommon'
import Tooltip from '../../../globalComponents/Tooltip'
import ApprovalHistoryPopup from '../../../globalComponents/EditTaskPopup/ApprovalHistoryPopup';
import { Modal, Panel, PanelType } from 'office-ui-fabric-react';
import { ImReply } from 'react-icons/im';
import KeyDocuments from './KeyDocument';
// import EODReportComponent from '../../../globalComponents/EOD Report Component/EODReportComponent';
import ShowTaskTeamMembers from '../../../globalComponents/ShowTaskTeamMembers';
import ReactPopperTooltipSingleLevel from '../../../globalComponents/Hierarchy-Popper-tooltipSilgleLevel/Hierarchy-Popper-tooltipSingleLevel';
import { EditableField } from "../../componentProfile/components/Portfoliop";

import ServiceComponentPortfolioPopup from '../../../globalComponents/EditTaskPopup/ServiceComponentPortfolioPopup';
import CentralizedSiteComposition from '../../../globalComponents/SiteCompositionComponents/CentralizedSiteComposition';
import { IoHandRightOutline } from 'react-icons/io5';
import InlineEditingcolumns from '../../../globalComponents/inlineEditingcolumns';
import * as GlobalFunctionForUpdateItems from '../../../globalComponents/GlobalFunctionForUpdateItems'
import SmartPriorityHover from '../../../globalComponents/EditTaskPopup/SmartPriorityHover';
var ClientTimeArray: any = [];

var AllListId: any;
var isShowTimeEntry: any;
var isShowSiteCompostion: any;
var subchildcomment: any;
let countemailbutton: number;
var changespercentage = false;
var buttonId: any;
let truncatedTitle: any
let comments: any = []
let AllClientCategories: any;
let ProjectData: any = {}
export interface ITaskprofileState {
  Result: any;
  TagConceptPaper: any;
  listName: string;
  itemID: number;
  isModalOpen: boolean;
  isEditModalOpen: boolean
  isEditReplyModalOpen: boolean
  ReplyCommenttoUpdate: string;
  imageInfo: any;
  Display: string;
  showcomment: string;
  showcomment_subtext: string,
  subchildcomment: any,
  updateComment: boolean;
  showComposition: boolean;
  ShowEstimatedTimeDescription: boolean;
  isOpenEditPopup: boolean;
  TaskDeletedStatus: boolean;
  isTimeEntry: boolean,
  emailStatus: String,
  countfeedback: any,
  subchildParentIndex: any
  sendMail: boolean,
  showPopup: any;
  emailcomponentopen: boolean,

  showhideCommentBoxIndex: any
  ApprovalCommentcheckbox: boolean;
  CommenttoPost: string;
  maincollection: any;
  TotalTimeEntry: any;
  breadCrumData: any;
  cmsTimeComponent: any;
  isopenversionHistory: boolean;
  smarttimefunction: boolean;
  ApprovalStatus: boolean;
  EditSiteCompositionStatus: any
  CommenttoUpdate: string;
  keydoc: any;
  FileDirRef: any;
  updateCommentText: any;
  updateReplyCommentText: any
  emailComponentstatus: any;
  ApprovalHistoryPopup: boolean;
  ApprovalPointUserData: any;
  ApprovalPointCurrentParentIndex: number;
  currentArraySubTextIndex: number;
  isCalloutVisible: boolean;
  isopencomonentservicepopup: boolean;
  isopenProjectpopup: boolean;
  currentDataIndex: any
  buttonIdCounter: number
  replyTextComment: any;
  showOnHoldComment: boolean;
  counter: any;
}

class Taskprofile extends React.Component<ITaskprofileProps, ITaskprofileState> {
  private relevantDocRef: any;
  private smartInfoRef: any;
  private keyDocRef: any
  private taskUsers: any = [];
  private smartMetaDataIcon: any;
  private masterTaskData: any = [];
  private masterForHierarchy: any = [];
  private currentUser: any;
  private oldTaskLink: any;
  private site: any;

  count: number = 0;

  countemailbutton: number = 0;
  backGroundComment = true;
  this: any;
  public constructor(props: ITaskprofileProps, state: ITaskprofileState) {
    super(props);
    this.relevantDocRef = React.createRef();
    this.smartInfoRef = React.createRef();
    this.keyDocRef = React.createRef()
    const params = new URLSearchParams(window.location.search);
    console.log(params.get('taskId'));
    console.log(params.get('Site'));
    this.site = params.get('Site');

    this.oldTaskLink = `${props.siteUrl}/SitePages/Task-Profile-Old.aspx?taskId=` + params.get('taskId') + "&Site=" + params.get('Site');
    this.state = {
      Result: {},
      TagConceptPaper: [],
      isEditReplyModalOpen: false,
      replyTextComment: "",
      keydoc: [],
      FileDirRef: '',
      currentDataIndex: 0,
      buttonIdCounter: null,
      isCalloutVisible: false,
      isopencomonentservicepopup: false,
      isopenProjectpopup: false,
      currentArraySubTextIndex: null,
      ApprovalPointUserData: null,
      ApprovalPointCurrentParentIndex: null,
      ApprovalHistoryPopup: false,
      emailcomponentopen: false,

      emailComponentstatus: null,
      subchildParentIndex: null,
      showcomment_subtext: 'none',
      subchildcomment: null,
      TotalTimeEntry: "",
      showhideCommentBoxIndex: null,
      CommenttoUpdate: '',
      ReplyCommenttoUpdate: '',
      ApprovalCommentcheckbox: false,
      CommenttoPost: '',
      updateCommentText: {},
      updateReplyCommentText: {},
      listName: params.get('Site'),
      itemID: Number(params.get('taskId')),
      isModalOpen: false,
      isEditModalOpen: false,
      imageInfo: {},
      Display: 'none',
      showcomment: 'none',
      updateComment: false,
      showComposition: true,
      ShowEstimatedTimeDescription: false,
      isOpenEditPopup: false,
      TaskDeletedStatus: false,
      isopenversionHistory: false,
      isTimeEntry: false,
      emailStatus: "",
      countfeedback: 0,
      // TaskIdHover:"",
      sendMail: false,
      showPopup: 'none',
      maincollection: [],
      breadCrumData: [],
      cmsTimeComponent: [],
      smarttimefunction: false,
      ApprovalStatus: false,
      EditSiteCompositionStatus: false,
      showOnHoldComment: false,
      counter: 1
    }
    this.GetAllComponentAndServiceData('Component')
  }

  private GetAllComponentAndServiceData = async (ComponentType: any) => {
    let PropsObject: any = {
      MasterTaskListID: this.props?.MasterTaskListID,
      siteUrl: this.props?.siteUrl,
      ComponentType: ComponentType,
      TaskUserListId: this.props?.TaskUsertListID,
    };
    let CallBackData = await globalCommon.GetServiceAndComponentAllData(PropsObject)
    if (CallBackData?.AllData != undefined && CallBackData?.AllData?.length > 0) {
      this.masterTaskData = this.masterTaskData?.concat([...CallBackData?.FlatProjectData, ...CallBackData?.AllData])
      this.masterForHierarchy = this.masterForHierarchy?.concat([...CallBackData?.FlatProjectData, ...CallBackData?.AllData])
      this.GetResult();
    } else {
      this.GetResult();
    }
  }
  private taskResult: any;

  private generateButtonId = () => {

    return `callout-button`;
  };

  private getsmartmetadataIcon = async () => {
    let web = new Web(this.props?.siteUrl);
    await web.lists
      // .getByTitle('SmartMetadata')
      .getById(this.props.SmartMetadataListID)
      .items
      .select('Id', 'Title', 'Item_x0020_Cover', 'TaxType', 'siteName', 'siteUrl', 'Item_x005F_x0020_Cover')

      .filter("TaxType eq 'Sites'").top(4000)
      .get().then((data: any) => {

        this.smartMetaDataIcon = data;

      }).catch((error: any) => {
        console.log(error)
      });
  }

  private async GetResult() {
    await this.getsmartmetadataIcon();
    try {
      isShowTimeEntry = this.props?.TimeEntry != "" ? JSON.parse(this.props?.TimeEntry) : "";
      isShowSiteCompostion = this.props?.SiteCompostion != "" ? JSON.parse(this.props?.SiteCompostion) : ""
    } catch (error: any) {
      console.log(error)
    }

    let web = new Web(this.props.siteUrl);
    let taskDetails: any = [];
    let listInfo = await web.lists.getByTitle(this.state?.listName).get();
    // console.log(listInfo);

    taskDetails = await web.lists
      // .getById(this.props.SiteTaskListID)
      .getByTitle(this.state?.listName)
      .items
      .getById(this.state?.itemID)
      .select("ID", "Title", "Comments", "WorkingAction", "Sitestagging", "ApproverHistory", "Approvee/Id", "Approvee/Title", "EstimatedTime", "SiteCompositionSettings", "TaskID", "Portfolio/Id", "Portfolio/Title", "Portfolio/PortfolioStructureID", "DueDate", "IsTodaysTask", 'EstimatedTimeDescription', "Approver/Id", "PriorityRank", "Approver/Title", "ParentTask/Id", "ParentTask/TaskID", "Project/Id", "Project/Title", "Project/PriorityRank", "Project/PortfolioStructureID", "ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Id", "TaskType/Title", "ClientTime", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
      .expand("TeamMembers", "Project", "Approver", "Approvee", "ParentTask", "Portfolio", "SmartInformation", "AssignedTo", "TaskCategories", "Author", "ClientCategory", "ResponsibleTeam", "TaskType", "Editor", "AttachmentFiles")
      .get()
    AllListId = {
      MasterTaskListID: this.props.MasterTaskListID,
      TaskUsertListID: this.props.TaskUsertListID,
      SmartMetadataListID: this.props.SmartMetadataListID,
      //SiteTaskListID:this.props.SiteTaskListID,
      TaskTimeSheetListID: this.props.TaskTimeSheetListID,
      DocumentsListID: this.props.DocumentsListID,
      SmartInformationListID: this.props.SmartInformationListID,
      PortFolioTypeID: this.props.PortFolioTypeID,
      siteUrl: this.props.siteUrl,
      Context: this.props.Context,
      TaskTypeID: this.props.TaskTypeID,
      isShowTimeEntry: isShowTimeEntry,
      isShowSiteCompostion: isShowSiteCompostion
    }
    taskDetails["listName"] = this.state?.listName;
    taskDetails["siteType"] = this.state?.listName;
    taskDetails["siteUrl"] = this.props?.siteUrl;

    taskDetails.TaskId = globalCommon.GetTaskId(taskDetails);
    var category = ""
    if (taskDetails["TaskCategories"] != undefined && taskDetails["TaskCategories"].length > 0) {
      taskDetails["TaskCategories"]?.map((item: any, index: any) => {
        category = category + item?.Title + ";"
        let ApprovalCheck = category?.search("Approval");
        if (ApprovalCheck >= 0) {
          this.setState({
            ApprovalStatus: true
          })
        } else {
          this.setState({
            ApprovalStatus: false
          })
        }

      });
    }
    var OffshoreComments: any = [];
    if (taskDetails["OffshoreComments"] != null) {
      let myarray: any = []
      myarray = JSON.parse(taskDetails["OffshoreComments"])
      if (myarray.length != 0) {
        myarray.map((items: any) => {
          if (items.AuthorImage != undefined && items.AuthorImage != "") {
            items.AuthorImage = items.AuthorImage.replace(
              "https://www.hochhuth-consulting.de",
              "https://hhhhteams.sharepoint.com/sites/HHHH"
            );
            OffshoreComments.push(items);
          }
        });
      }

    }

    taskDetails["Categories"] = category;
    this.taskResult = taskDetails;
    await this.GetTaskUsers(taskDetails);
    await this.GetSmartMetaData(taskDetails?.ClientCategory, taskDetails?.Sitestagging);

    this.currentUser = this.GetUserObject(this.props?.userDisplayName);
    if (taskDetails["Comments"] != null && taskDetails["Comments"] != undefined) {
      try { comments = JSON.parse(taskDetails["Comments"]) }
      catch (e: any) {
        console.log(e)
      }
    }
    let tempEstimatedArrayData: any;
    let TotalEstimatedTime: any = 0;
    if (taskDetails['EstimatedTimeDescription']?.length > 0) {
      tempEstimatedArrayData = JSON.parse(taskDetails['EstimatedTimeDescription']);
      if (tempEstimatedArrayData?.length > 0) {
        tempEstimatedArrayData?.map((TimeDetails: any) => {
          TotalEstimatedTime = TotalEstimatedTime + Number(TimeDetails.EstimatedTime);
        })
      }
    } else {
      tempEstimatedArrayData = [];
    }
    const maxTitleLength: number = 75;


    if (taskDetails["Title"].length > maxTitleLength) {
      truncatedTitle = taskDetails["Title"].substring(0, maxTitleLength - 3) + "...";
    }

    let portfolio: any = [];
    if (taskDetails?.Portfolio != undefined) {
      portfolio = this.masterTaskData.filter((item: any) => item.Id == taskDetails?.Portfolio?.Id)
      if (portfolio?.length > 0 && portfolio[0]?.PortfolioType?.Color != undefined) {
        document?.documentElement?.style?.setProperty('--SiteBlue', portfolio[0]?.PortfolioType?.Color);
      }
      this.loadTaggedConceptPaperDocument(portfolio[0])
    }

    if (taskDetails?.Project != undefined) {
      ProjectData = this.masterTaskData?.find((items: any) => items?.Id == taskDetails?.Project?.Id)
    }
    let feedBackData: any = JSON.parse(taskDetails["FeedBack"]);
    console.log(this.masterTaskData)
    let WorkingAction = taskDetails["WorkingAction"] != null ? JSON.parse(taskDetails["WorkingAction"]) : [];
    let Bottleneck: any = [];
    let Attention: any = [];
    if (WorkingAction?.length > 0) {
      WorkingAction?.map((Action: any) => {
        if (Action?.Title == "Bottleneck") {
          Bottleneck = Action?.InformationData;
        }
        if (Action?.Title == "Attention") {
          Attention = Action?.InformationData;
        }
      })
    }
    let tempTask = {
      SiteIcon: this.GetSiteIcon(this.state?.listName),
      sitePage: this.props.Context?._pageContext?._web?.title,
      Comments: comments != null && comments != undefined ? comments : "",
      Id: taskDetails["ID"],
      ID: taskDetails["ID"],
      Bottleneck: Bottleneck,
      Attention: Attention,
      SmartPriority: globalCommon.calculateSmartPriority(taskDetails),
      TaskTypeValue: '',
      projectPriorityOnHover: '',
      taskPriorityOnHover: taskDetails?.PriorityRank != undefined ? taskDetails?.PriorityRank : undefined,
      showFormulaOnHover: taskDetails?.showFormulaOnHover != undefined ? taskDetails?.showFormulaOnHover : undefined,

      Approvee: taskDetails?.Approvee != undefined ? this.taskUsers.find((userData: any) => userData?.AssingedToUser?.Id == taskDetails?.Approvee?.Id) : undefined,
      TaskCategories: taskDetails["TaskCategories"],
      Project: taskDetails["Project"],
      IsTodaysTask: taskDetails["IsTodaysTask"],
      PriorityRank: taskDetails["PriorityRank"],
      EstimatedTime: taskDetails["EstimatedTime"],
      Sitestagging: taskDetails["Sitestagging"] != null ? JSON.parse(taskDetails["Sitestagging"]) : [],
      ClientTime: taskDetails["ClientTime"] != null && JSON.parse(taskDetails["ClientTime"]),
      ApproverHistory: taskDetails["ApproverHistory"] != null ? JSON.parse(taskDetails["ApproverHistory"]) : "",
      OffshoreComments: OffshoreComments.length > 0 ? OffshoreComments.reverse() : null,
      OffshoreImageUrl: taskDetails["OffshoreImageUrl"] != null && JSON.parse(taskDetails["OffshoreImageUrl"]),

      ClientCategory: taskDetails["ClientCategory"],
      siteType: taskDetails["siteType"],
      listName: taskDetails["listName"],
      siteUrl: taskDetails["siteUrl"],
      TaskId: taskDetails["TaskId"],
      TaskID: taskDetails["TaskID"],
      Title: taskDetails["Title"],
      Item_x0020_Type: 'Task',
      DueDate: taskDetails["DueDate"] != null ? moment(taskDetails["DueDate"]).format("DD/MM/YYYY") : null,
      Categories: taskDetails["Categories"],
      Status: taskDetails["Status"],
      StartDate: taskDetails["StartDate"] != null ? moment(taskDetails["StartDate"]).format("DD/MM/YYYY") : "",
      CompletedDate: taskDetails["CompletedDate"] != null ? moment(taskDetails["CompletedDate"])?.format("DD/MM/YYYY") : "",
      TeamLeader: taskDetails["ResponsibleTeam"] != null ? taskDetails["ResponsibleTeam"] : null,
      ResponsibleTeam: taskDetails["ResponsibleTeam"] != null ? taskDetails["ResponsibleTeam"] : null,
      TeamMembers: taskDetails.TeamMembers != null ? taskDetails.TeamMembers : null,
      AssignedTo: taskDetails["AssignedTo"] != null ? taskDetails["AssignedTo"] : null,
      ItemRank: taskDetails["ItemRank"],
      PercentComplete: (taskDetails["PercentComplete"] * 100),
      Priority: taskDetails["Priority"],
      Created: taskDetails["Created"],
      Author: this.GetUserObject(taskDetails["Author"]?.Title),
      component_url: taskDetails["ComponentLink"],
      BasicImageInfo: this.GetAllImages(JSON.parse(taskDetails["BasicImageInfo"]), taskDetails["AttachmentFiles"], taskDetails["Attachments"]),
      FeedBack: JSON.parse(taskDetails["FeedBack"]),
      FeedBackBackup: JSON.parse(taskDetails["FeedBack"]),
      FeedBackArray: feedBackData != undefined && feedBackData?.length > 0 ? feedBackData[0]?.FeedBackDescriptions : [],
      TaskType: taskDetails["TaskType"] != null ? taskDetails["TaskType"] : '',
      TaskTypeTitle: taskDetails["TaskType"] != null ? taskDetails["TaskType"]?.Title : '',
      EstimatedTimeDescriptionArray: tempEstimatedArrayData,
      TotalEstimatedTime: TotalEstimatedTime,

      Portfolio: portfolio != undefined && portfolio.length > 0 ? portfolio[0] : undefined,
      PortfolioType: portfolio != undefined && portfolio.length > 0 ? portfolio[0]?.PortfolioType : undefined,
      Creation: taskDetails["Created"],
      Modified: taskDetails["Modified"],
      ModifiedBy: taskDetails["Editor"],
      listId: listInfo.Id,
      TaskLevel: taskDetails["TaskLevel"],
      Attachments: taskDetails["Attachments"],
      AttachmentFiles: taskDetails["AttachmentFiles"],
      SmartInformationId: taskDetails["SmartInformation"],
      Approver: taskDetails?.Approver != undefined ? this.taskUsers.find((userData: any) => userData?.AssingedToUser?.Id == taskDetails?.Approver[0]?.Id) : "",
      ParentTask: taskDetails?.ParentTask,
    };

    if (tempTask?.FeedBack != null && tempTask?.FeedBack.length > 0) {
      tempTask?.FeedBack[0]?.FeedBackDescriptions?.map((items: any) => {
        if (items?.Comments?.length > 0) {
          items?.Comments?.map((comment: any) => {
            comment.AuthorImage = comment?.AuthorImage?.replace(
              "https://www.hochhuth-consulting.de",
              "https://hhhhteams.sharepoint.com/sites/HHHH"
            );
          })
        }
      })
    }

    console.log(tempTask);

    this.setState({
      Result: tempTask,


    }, async () => {
      this.getSmartTime();
      if (tempTask.Portfolio != undefined) {
        let AllItems: any = [];
        let breadCrumData1WithSubRow: any = await globalCommon?.getBreadCrumbHierarchyAllData(this.state.Result, AllListId, AllItems)
        console.log(breadCrumData1WithSubRow?.flatdata)
        let breadCrumData1 = breadCrumData1WithSubRow?.flatdata.reverse()
        this.setState({
          breadCrumData: breadCrumData1
        })
        this.getAllTaskData();
      }




    });
  }

  private showOnHoldReason = () => {
    this.setState({
      showOnHoldComment: true,
    });
  };

  private hideOnHoldReason = () => {
    this.setState({
      showOnHoldComment: false,
    });
  };

  private sortAlphaNumericAscending = (a: any, b: any) => a.FileName.localeCompare(b.FileName, 'en', { numeric: true });
  private AncCallback = (type: any) => {
    switch (type) {
      case 'anc': {
        this?.relevantDocRef?.current?.loadAllSitesDocuments()
        break
      }
      case 'smartInfo': {
        this?.smartInfoRef?.current?.GetResult();
        break
      }
      default: {
        this?.relevantDocRef?.current?.loadAllSitesDocuments()
        this?.smartInfoRef?.current?.GetResult();
        this?.keyDocRef?.current?.loadAllSitesDocumentsEmail()
        break
      }
    }
  }
  private GetAllImages(BasicImageInfo: any, AttachmentFiles: any, Attachments: any) {
    if (BasicImageInfo?.length > 0) {
      BasicImageInfo?.forEach(function (item: any) {
        if (item?.ImageUrl != undefined && item?.ImageUrl != "") {
          item.ImageUrl = item?.ImageUrl?.replace(
            "https://www.hochhuth-consulting.de",
            "https://hhhhteams.sharepoint.com/sites/HHHH"
          );
        }
      })
      return BasicImageInfo
    }
  }

  private async GetTaskUsers(taskDetails: any) {
    let web = new Web(this.props?.siteUrl);
    let taskUsers: any = [];
    var taskDeatails = this.state.Result;
    taskUsers = await web.lists
      // .getByTitle("Task Users")
      .getById(this.props.TaskUsertListID)
      .items
      .select('Id', 'Email', 'Approver/Id', 'Approver/Title', 'Approver/Name', 'Suffix', 'UserGroup/Id', 'UserGroup/Title', 'Team', 'Title', 'Item_x0020_Cover', 'Company', 'AssingedToUser/Title', 'AssingedToUser/Id',)
      .filter("ItemType eq 'User'")
      .expand('AssingedToUser,UserGroup,Approver')
      .get();

    taskUsers?.map((item: any) => {
      if (this.props?.Context?.pageContext?._legacyPageContext?.userId === (item?.AssingedToUser?.Id) && item?.Company === "HHHH") {
        this.backGroundComment = false;
      }



    })
    this.setState({
      Result: taskDeatails,
    })
    this.taskUsers = taskUsers;


  }

  private async GetSmartMetaData(ClientCategory: any, Sitestagging: any) {
    let array2: any = [];
    ClientTimeArray = []
    if (((Sitestagging == null) && ClientTimeArray?.length == 0)) {
      var siteComp: any = {};
      siteComp.SiteName = this.state?.listName,
        siteComp.ClienTimeDescription = 100,
        siteComp.SiteImages = this.GetSiteIcon(this.state?.listName),
        ClientTimeArray.push(siteComp);
    }

    else if (Sitestagging != null) {
      ClientTimeArray = JSON.parse(Sitestagging);

    }
    let web = new Web(this.props?.siteUrl);
    var smartMetaData = await web.lists

      .getById(this.props.SmartMetadataListID)
      .items
      .select('Id', 'Title', 'IsVisible', 'TaxType', 'Parent/Id', 'Parent/Title', 'siteName', 'siteUrl', 'SmartSuggestions', "SmartFilters",)

      .expand('Parent').filter("TaxType eq 'Client Category'").top(4000)
      .get();
    if (smartMetaData?.length > 0) {
      AllClientCategories = smartMetaData;
    }

    if (ClientCategory?.length > 0) {
      ClientCategory?.map((item: any, index: any) => {
        smartMetaData?.map((items: any, index: any) => {
          if (item?.Id == items?.Id) {
            item.SiteName = items?.siteName;
            array2.push(item)
          }
        })
      })
      console.log(ClientCategory);
    }

    if (ClientTimeArray != undefined && ClientTimeArray.length > 0 && array2?.length > 0) {
      ClientTimeArray?.map((item: any) => {
        array2?.map((items: any) => {
          if ((item?.SiteName == items?.SiteName) || (item?.Title == items?.SiteName)) {
            item.SiteImages = this?.GetSiteIcon(items?.SiteName)
            if (item.ClientCategory == undefined) {
              item.ClientCategory = [];
              item.ClientCategory.push(items);
            } else {
              item.ClientCategory.push(items)
            }

          }

        })
      })
    } else {
      ClientTimeArray?.map((item: any) => {
        item.SiteImages = this?.GetSiteIcon(item?.SiteName != undefined ? item?.SiteName : item?.Title)
      })

    }
  }
  private GetSiteIcon(listName: string) {
    console.log(this.state.Result)
    if (listName != undefined) {
      let siteicon = '';
      this.smartMetaDataIcon?.map((icondata: any) => {
        if (icondata.Title != undefined) {
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x0020_Cover != undefined) {
            siteicon = icondata.Item_x0020_Cover.Url
          }
          if (icondata.Title.toLowerCase() == listName?.toLowerCase() && icondata.Item_x005F_x0020_Cover != undefined) {
            siteicon = icondata.Item_x005F_x0020_Cover.Url
          }
        }
      })

      return siteicon;
    }

  }


  private GetUserObject(username: any) {

    let userDeatails = [];
    if (username != undefined) {
      let senderObject = this.taskUsers.filter(function (user: any, i: any) {
        if (user?.AssingedToUser != undefined) {
          return user?.AssingedToUser['Title'] == username
        }
      });
      if (senderObject?.length > 0) {
        userDeatails.push({
          'Id': senderObject[0]?.AssingedToUser.Id,
          'Name': senderObject[0]?.Email,
          'Suffix': senderObject[0]?.Suffix,
          'Title': senderObject[0]?.Title,
          'userImage': senderObject[0]?.Item_x0020_Cover != null ? senderObject[0]?.Item_x0020_Cover.Url : ""
        })
      } if (senderObject.length == 0) {
        userDeatails.push({
          'Title': username,
          'userImage': ""
        })

      }
      return userDeatails;
    }

  }
  //open the model
  private OpenModal(e: any, item: any) {
    if (item.Url != undefined) {
      item.ImageUrl = item?.Url;
    }

    e.preventDefault();

    this.setState({
      isModalOpen: true,
      imageInfo: item,
      showPopup: 'block'
    });
  }


  private CloseModal(e: any) {
    e.preventDefault();
    this.setState({
      isModalOpen: false,
      isEditModalOpen: false,
      isEditReplyModalOpen: false,
      imageInfo: {},

      showPopup: 'none'
    });
  }
  private Closecommentpopup = () => {
    this.setState({
      isModalOpen: false,
      isEditModalOpen: false,
      isEditReplyModalOpen: false,
      imageInfo: {},

      showPopup: 'none'
    });
  }



  private showhideComposition() {
    if (this.state.showComposition) {
      this.setState({
        showComposition: false
      });
    } else {
      this.setState({
        showComposition: true
      });
    }

  }
  private showhideEstimatedTime() {
    if (this.state.ShowEstimatedTimeDescription) {
      this.setState({
        ShowEstimatedTimeDescription: false
      });
    } else {
      this.setState({
        ShowEstimatedTimeDescription: true
      });
    }

  }

  private async onPost() {


    let web = new Web(this.props.siteUrl);
    const i = await web.lists
      .getByTitle(this.state?.listName)
      .items
      .getById(this.state?.itemID)
      .update({
        FeedBack: JSON.stringify(this.state?.Result?.FeedBack),
        Status: this?.state?.Result?.Status
      });

    this.setState({
      updateComment: true
    });

  }
  private openVersionHistory() {

    this.setState({
      isopenversionHistory: true
    })
  }
  private OpenEditPopUp() {
    this.setState({
      isOpenEditPopup: true
    })
  }

  private CallBack(FunctionType: any) {

    if (FunctionType == "Save") {
      this.setState({
        isOpenEditPopup: false,
        EditSiteCompositionStatus: false,
        counter: this.state.counter + 1
      })
      setTimeout(() => {
        this.GetResult();
      }, 1000);
    }
    if (FunctionType == "Delete") {
      this.setState({
        isOpenEditPopup: false,
        TaskDeletedStatus: true,
      })
      window.location.href = `${this.props?.siteUrl}/SitePages/TaskDashboard.aspx`;;
    }
    if (FunctionType == "Close") {
      this.setState({
        isOpenEditPopup: false,
        EditSiteCompositionStatus: false,
      })
    }
  }

  private async approvalcallback() {
    this.setState({
      sendMail: false,
      emailStatus: ""
    })
    this.GetResult();
  }


  private allDataOfTask: any = [];
  private maincollection: any = [];

  private async getAllTaskData() {
    let breadCrumData1: any = [];
    let web = new Web(this.props.siteUrl);
    let results = [];
    results = await web.lists
      .getByTitle(this.state?.listName)
      // .getById(this.props.SiteTaskListID)
      .items
      .select("ID", "Title", "Comments", "ApproverHistory", "TaskID", "EstimatedTime", "Portfolio/Id", "Portfolio/Title", "Portfolio/PortfolioStructureID", "DueDate", "IsTodaysTask", 'EstimatedTimeDescription', "ParentTask/Id", "Project/Id", "Project/Title", "ParentTask/Title", "SmartInformation/Id", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "ClientCategory/Id", "ClientCategory/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "Created", "Author/Title", "Author/EMail", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Editor/Title", "Modified", "Attachments", "AttachmentFiles")
      .expand("TeamMembers", "Project", "ParentTask", "Portfolio", "SmartInformation", "AssignedTo", "TaskCategories", "Author", "ClientCategory", "ResponsibleTeam", "TaskType", "Editor", "AttachmentFiles")
      .getAll(4000);

    for (let index = 0; index < results.length; index++) {
      let item = results[index];
      item.siteType = this.state?.listName;
      item.SiteIcon = this.state.Result?.SiteIcon;
      item.isLastNode = false;
      this.allDataOfTask.push(item);

    }



  }
  private getSmartTime = () => {
    this.setState({
      smarttimefunction: true
    })

  }

  private sendEmail(item: any) {
    var data = this.state.Result;
    if (item == "Approved") {
      // data.PercentComplete = 3
      // var data = this.state.Result;
      // this.setState({
      //   Result: data,
      // }),
      let TeamMembers: any = []
      TeamMembers.push(this.state.Result.TeamMembers[0]?.Id)
      let changeData: any = {
        TeamMembers: TeamMembers,
        AssignedTo: []
      }
      this.ChangeApprovalMember(changeData).then((data: any) => {
        var data = this.state.Result;
        this.setState({
          Result: data,
        }),
          console.log(item);
        this.setState({
          sendMail: true,
        });
        this.setState({
          emailStatus: item,
        });
      }).catch((error) => {
        console.log(error)
      });
      // this.setState({
      //   sendMail: true,
      // });
      // this.setState({
      //   emailStatus: item,
      // });
    }
    else {

      let TeamMembers: any = []
      TeamMembers.push(this.state.Result.TeamMembers[0]?.Id)
      TeamMembers.push(this?.state.Result?.Approvee != undefined ? this?.state.Result?.Approvee?.AssingedToUser?.Id : this.state.Result?.Author[0]?.Id)
      let changeData: any = {

        TeamMembers: TeamMembers,
        AssignedTo: [this?.state.Result?.Approvee != undefined ? this?.state.Result?.Approvee?.AssingedToUser?.Id : this.state.Result?.Author[0]?.Id]
      }


      this.ChangeApprovalMember(changeData).then((data: any) => {
        var data = this.state.Result;
        this.setState({
          Result: data,
        }),
          console.log(item);
        this.setState({
          sendMail: true,
        });
        this.setState({
          emailStatus: item,
        });
      }).catch((error) => {
        console.log(error)
      });
    }


  }
  //================================ taskfeedbackcard===============
  private showhideCommentBox(index: any) {
    if (this.state.showcomment == 'none') {
      this.setState({
        showcomment: 'block',
        showhideCommentBoxIndex: index,
        showcomment_subtext: 'none',
        subchildcomment: null,
      });
    }
    else {
      this.setState({
        showcomment: 'block',
        showhideCommentBoxIndex: index,
        showcomment_subtext: 'none',
        subchildcomment: null,
      });
    }
  }
  private handleInputChange(e: any) {
    this.setState({ CommenttoPost: e.target.value });
  }
  private PostButtonClick(fbData: any, i: any) {

    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {

      var temp: any = {
        AuthorImage: this.currentUser != null && this.currentUser?.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser?.length > 0 ? this.currentUser[0]['Title'] : "",

        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,

      };
      if (this.state.ApprovalCommentcheckbox) {
        temp.isApprovalComment = this.state.ApprovalCommentcheckbox
        temp.isShowLight = fbData?.isShowLight ? fbData?.isShowLight : "";
        var approvalDataHistory = {
          ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
          Id: this.currentUser[0].Id,
          ImageUrl: this.currentUser[0].userImage,
          Title: this.currentUser[0].Title,
          isShowLight: fbData?.isShowLight ? fbData?.isShowLight : ""
        }

        if (temp.ApproverData != undefined) {
          temp.ApproverData.push(approvalDataHistory)
        } else {
          temp.ApproverData = [];
          temp.ApproverData.push(approvalDataHistory);
        }
      }
      //Add object in feedback

      if (fbData["Comments"] != undefined) {
        fbData["Comments"].unshift(temp);
      }
      else {
        fbData["Comments"] = [temp];
      }
      (document.getElementById('txtComment') as HTMLTextAreaElement).value = '';
      this.setState({
        showcomment: 'none',
        CommenttoPost: '',
      });
      this.onPost();
      this.setState({
        ApprovalCommentcheckbox: false,
        showhideCommentBoxIndex: null
      })
    } else {
      alert('Please input some text.')
    }

  }
  private openEditModal(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any) {
    this.setState({
      isEditModalOpen: true,
      CommenttoUpdate: comment?.Title,
      updateCommentText: {
        'comment': comment?.Title,
        'indexOfUpdateElement': indexOfUpdateElement,
        'indexOfSubtext': indexOfSubtext,
        'isSubtextComment': isSubtextComment,
        "data": comment,
        "parentIndexOpeneditModal": parentIndex
      }
    })
  }

  private clearComment(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any) {
    if (confirm("Are you sure, you want to delete this?")) {
      if (isSubtextComment) {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Subtext"][indexOfSubtext]?.Comments?.splice(indexOfDeleteElement, 1)
      } else {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Comments"]?.splice(indexOfDeleteElement, 1);
      }
      this.onPost();
    }

  }
  private handleUpdateComment(e: any) {
    this.setState({ CommenttoUpdate: e.target.value });
  }
  private updateComment() {
    let txtComment = this.state.CommenttoUpdate

    if (txtComment != '') {
      let temp: any = {
        AuthorImage: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['Title'] : "",
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment
      };

      if (this?.state?.isEditReplyModalOpen) {
        var EditReplyData = this?.state?.updateReplyCommentText;
        if (EditReplyData?.isSubtextComment) {
          let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Subtext[EditReplyData?.indexOfSubtext].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
          feedback.Title = this.state?.CommenttoUpdate;
        } else {
          let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[EditReplyData?.parentIndexOpeneditModal].Comments[EditReplyData?.indexOfUpdateElement].ReplyMessages[EditReplyData?.replyIndex];
          feedback.Title = this.state?.CommenttoUpdate;
        }
      } else {
        if (this.state?.updateCommentText?.data?.isApprovalComment) {
          temp.isApprovalComment = this.state?.updateCommentText?.data?.isApprovalComment;
          temp.isShowLight = this.state?.updateCommentText?.data?.isShowLight
          temp.ApproverData = this.state?.updateCommentText?.data?.ApproverData;
        }
        if (this.state?.updateCommentText?.isSubtextComment) {

          this.state.Result["FeedBack"][0].FeedBackDescriptions[this.state?.updateCommentText?.parentIndexOpeneditModal].Subtext[this.state.updateCommentText['indexOfSubtext']]['Comments'][this.state.updateCommentText['indexOfUpdateElement']].Title = temp.Title

        }
        else {

          this.state.Result["FeedBack"][0].FeedBackDescriptions[this.state?.updateCommentText?.parentIndexOpeneditModal]["Comments"][this.state?.updateCommentText['indexOfUpdateElement']].Title = temp.Title
        }
      }
      this.onPost();
    }
    this.setState({
      isEditModalOpen: false,
      updateCommentText: {},
      CommenttoUpdate: '',
      isEditReplyModalOpen: false,
      currentDataIndex: 0,
      replyTextComment: '',
      updateReplyCommentText: {}
    });
  }

  private SubtextPostButtonClick(j: any, parentIndex: any) {
    let txtComment = this.state.CommenttoPost;
    if (txtComment != '') {
      let temp: any = {
        AuthorImage: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['Title'] : "",

        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,

      };
      if (this.state.ApprovalCommentcheckbox) {
        temp.isApprovalComment = this.state.ApprovalCommentcheckbox
        temp.isShowLight = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight != undefined ? this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight : ""
        var approvalDataHistory = {
          ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
          Id: this.currentUser[0].Id,
          ImageUrl: this.currentUser[0].userImage,
          Title: this.currentUser[0].Title,
          isShowLight: this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight != undefined ? this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]?.Subtext[j].isShowLight : ""
        }

        if (temp.ApproverData != undefined) {
          temp.ApproverData.push(approvalDataHistory)
        } else {
          temp.ApproverData = [];
          temp.ApproverData.push(approvalDataHistory);
        }

      }
      //Add object in feedback

      if (this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]["Subtext"][j].Comments != undefined) {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex]["Subtext"][j].Comments.unshift(temp);
      }
      else {
        this.state.Result["FeedBack"][0].FeedBackDescriptions[parentIndex]["Subtext"][j]['Comments'] = [temp];
      }
      (document.getElementById('txtCommentSubtext') as HTMLTextAreaElement).value = '';
      this.setState({
        showcomment_subtext: 'none',
        CommenttoPost: '',
      });
      this.onPost();
      this.setState({
        ApprovalCommentcheckbox: false,
        subchildcomment: null,
        subchildParentIndex: null

      })
    } else {
      alert('Please input some text.')
    }

  }
  private showhideCommentBoxOfSubText(j: any, parentIndex: any) {
    if (this.state.showcomment_subtext == 'none') {
      this.setState({
        showcomment_subtext: 'block',
        subchildcomment: j,
        subchildParentIndex: parentIndex,
        showcomment: 'none',
        showhideCommentBoxIndex: null

      });
    }
    else {
      this.setState({
        showcomment_subtext: 'block',
        subchildcomment: j,
        subchildParentIndex: parentIndex,
        showcomment: 'none',
        showhideCommentBoxIndex: null

      });
    }
  }

  //===============traffic light function==================
  private async changeTrafficLigth(index: any, item: any) {
    console.log(index);
    console.log(item);
    if ((this.state.Result["Approver"]?.AssingedToUser?.Id == this?.currentUser[0]?.Id) || (this.state.Result["Approver"]?.Approver[0]?.Id == this?.currentUser[0]?.Id)) {
      let tempData: any = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[index];
      var approvalDataHistory = {
        ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Id: this.currentUser[0].Id,
        ImageUrl: this.currentUser[0].userImage,
        Title: this.currentUser[0].Title,
        isShowLight: item
      }
      tempData.isShowLight = item;
      if (tempData.ApproverData != undefined && tempData.ApproverData.length > 0) {

        tempData.ApproverData.push(approvalDataHistory);
      } else {
        tempData.ApproverData = [];
        tempData.ApproverData.push(approvalDataHistory)
      }

      var data: any = this.state.Result;

      if (tempData?.ApproverData != undefined && tempData?.ApproverData?.length > 0) {
        tempData?.ApproverData?.forEach((ba: any) => {
          if (ba.isShowLight == 'Reject') {

            data.Status = "Follow Up",
              ba.Status = 'Rejected by'
          }
          if (ba.isShowLight == 'Approve') {
            ba.Status = 'Approved by'
            data.Status = "Approved"
          }
          if (ba.isShowLight == 'Maybe') {
            data.Status = "Follow Up",
              ba.Status = 'For discussion with'
          }


        })
      }
      this.setState({
        Result: data,
      }),
        console.log(tempData);
      console.log(this.state.Result["FeedBack"][0]?.FeedBackDescriptions);
      await this.onPost();
      if (this.state.Result["FeedBack"] != undefined) {
        await this.checkforMail(this.state.Result["FeedBack"][0].FeedBackDescriptions, item, tempData);

      }
    }
  }


  private async changeTrafficLigthsubtext(parentindex: any, subchileindex: any, status: any) {
    console.log(parentindex);
    console.log(subchileindex);
    console.log(status);
    if ((this.state.Result["Approver"]?.AssingedToUser?.Id == this?.currentUser[0]?.Id) || (this.state.Result["Approver"]?.Approver[0]?.Id == this?.currentUser[0]?.Id)) {
      let tempData: any = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex];
      var approvalDataHistory = {
        ApprovalDate: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Id: this.currentUser[0].Id,
        ImageUrl: this.currentUser[0].userImage,
        Title: this.currentUser[0].Title,
        isShowLight: status
      }
      tempData.Subtext[subchileindex].isShowLight = status;
      if (tempData?.Subtext[subchileindex]?.ApproverData != undefined && tempData?.Subtext[subchileindex]?.ApproverData?.length > 0) {

        tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory);
      } else {
        tempData.Subtext[subchileindex].ApproverData = [];
        tempData.Subtext[subchileindex].ApproverData.push(approvalDataHistory)
      }
      var data: any = this.state.Result;
      if (tempData?.Subtext[subchileindex] != undefined && tempData?.Subtext[subchileindex]?.ApproverData != undefined) {
        tempData?.Subtext[subchileindex]?.ApproverData?.forEach((ba: any) => {
          if (ba.isShowLight == 'Reject') {
            data.Status = "Follow Up",
              ba.Status = 'Rejected by'
          }
          if (ba.isShowLight == 'Approve') {
            data.Status = "Approved"
            ba.Status = 'Approved by '
          }
          if (ba.isShowLight == 'Maybe') {
            data.Status = "Follow Up",
              ba.Status = 'For discussion with'
          }


        })
      }
      this.setState({
        Result: data,
      }),
        console.log(tempData);
      console.log(this.state.Result["FeedBack"][0]?.FeedBackDescriptions);
      console.log(this.state?.emailcomponentopen)
      await this.onPost();

      if (this.state.Result["FeedBack"] != undefined) {
        await this.checkforMail(this.state.Result["FeedBack"][0].FeedBackDescriptions, status, tempData?.Subtext[subchileindex]);
      }
    }
  }
  //========================= mail functionality==============
  private async checkforMail(allfeedback: any, item: any, tempData: any) {
    var countApprove = 0;
    var countreject = 0;
    console.log(allfeedback);
    if (allfeedback != null && allfeedback != undefined) {
      var isShowLight = 0;
      let ApproveCount = 0;
      let RejectCount = 0;
      var NotisShowLight = 0
      if (allfeedback != undefined) {
        allfeedback?.map((items: any) => {

          if (items?.isShowLight != undefined && items?.isShowLight != "") {
            isShowLight = isShowLight + 1;
            if (items.isShowLight == "Approve") {
              ApproveCount += 1;
              changespercentage = true;
              countApprove = countApprove + 1;
            }
            else {
              countreject = countreject + 1;
            }
            if (items?.isShowLight == "Reject") {
              RejectCount += 1;
            }

          }
          if (items?.Subtext != undefined && items?.Subtext?.length > 0) {
            items?.Subtext?.map((subtextItems: any) => {
              if (subtextItems?.isShowLight != undefined && subtextItems?.isShowLight != "") {
                isShowLight = isShowLight + 1;
                if (subtextItems?.isShowLight == "Approve") {
                  ApproveCount += 1;
                  changespercentage = true;
                  countApprove = countApprove + 1;
                } else {
                  countreject = countreject + 1;
                }
                if (subtextItems?.isShowLight == "Reject") {
                  RejectCount += 1;
                }

              }
            })
          }
        })
      }
      if (this.state.Result.PercentComplete < 5) {
        await this.changepercentageStatus(item, tempData, countApprove,);
      }

      if (isShowLight > NotisShowLight) {
        if (RejectCount == 1 && item == "Reject") {
          countemailbutton = 0;
          this.setState({
            emailcomponentopen: true,
            emailComponentstatus: item
          }

          )
        }
        if (countApprove == 0) {
          let TeamMembers: any = []
          TeamMembers.push(this.state.Result.TeamMembers[0]?.Id)
          TeamMembers.push(this?.state.Result?.Approvee != undefined ? this?.state.Result?.Approvee?.AssingedToUser?.Id : this.state.Result?.Author[0]?.Id)
          let changeData: any = {

            TeamMembers: TeamMembers,
            AssignedTo: [this?.state.Result?.Approvee != undefined ? this?.state.Result?.Approvee?.AssingedToUser?.Id : this.state.Result?.Author[0]?.Id]
          }
          this.ChangeApprovalMember(changeData);


        }
        if (countApprove == 1) {
          let TeamMembers: any = []
          TeamMembers.push(this.currentUser?.[0]?.Id)

          let changeData: any = {

            TeamMembers: TeamMembers,
            AssignedTo: []
          }
          this.ChangeApprovalMember(changeData).then((data: any) => {
            this.GetResult();
          }).catch((error: any) => {
            console.log(error)
          });


        }
        if (ApproveCount == 1 && item == "Approve") {
          countemailbutton = 0;
          this.setState({
            emailcomponentopen: true,
            emailComponentstatus: item
          })
        } else {
          countemailbutton = 1;
          this.setState({
            emailcomponentopen: false,

          })

        }

      }
    }
  }

  private ChangeApprovalMember = (changeData: any) => {
    return new Promise<void>((resolve, reject) => {
      const web = new Web(this.props.siteUrl);
      web.lists.getByTitle(this.state.Result.listName)

        .items.getById(this.state.Result.Id).update({
          TeamMembersId: {
            results: changeData?.TeamMembers

          },
          AssignedToId: {
            results: changeData?.AssignedTo

          },

        }).then((res: any) => {
          resolve(res)
          console.log("team membersetsucessfully", res);
        })
        .catch((err: any) => {
          reject(err)
          console.log(err.message);
        });
    })


  }
  //================percentage changes ==========================
  private async changepercentageStatus(percentageStatus: any, pervious: any, countApprove: any) {
    console.log(percentageStatus)
    console.log(pervious)
    console.log(countApprove)
    let percentageComplete;
    let changespercentage1;
    if ((countApprove == 1 && percentageStatus == "Approve" && (pervious?.isShowLight == "Approve" || pervious?.isShowLight != undefined))) {
      changespercentage = true;
    }
    if ((countApprove == 0 && (percentageStatus == "Reject" || percentageStatus == "Maybe") && (pervious?.isShowLight == "Reject" && pervious?.isShowLight != undefined))) {
      changespercentage = false;
    }
    if ((countApprove == 0 && percentageStatus == "Approve" && (pervious.isShowLight == "Reject" || pervious.isShowLight == "Maybe") && pervious.isShowLight != undefined)) {
      changespercentage = true;
    }


    let taskStatus = "";
    if (changespercentage == true) {
      percentageComplete = 0.03;
      changespercentage1 = 3
      taskStatus = "Approved"

    }
    if (changespercentage == false) {
      percentageComplete = 0.02;
      changespercentage1 = 2
      taskStatus = "Follow Up"
    }
    this.state.Result.PercentComplete = changespercentage1
    const web = new Web(this.props.siteUrl);
    await web.lists.getByTitle(this.state.Result.listName)

      .items.getById(this.state.Result.Id).update({
        PercentComplete: percentageComplete,
        Status: taskStatus,
      }).then((res: any) => {
        console.log(res);



      })
      .catch((err: any) => {
        console.log(err.message);
      });


  }
  // ========approval history popup =================
  private ShowApprovalHistory(items: any, parentIndex: any, subChildIndex: any) {
    console.log("this is a Approval function cxall ", items)
    this.setState({
      ApprovalHistoryPopup: true,
      ApprovalPointUserData: items,
      ApprovalPointCurrentParentIndex: parentIndex + 1,
      currentArraySubTextIndex: subChildIndex != null ? subChildIndex + 1 : null

    })

  }
  //  ===========Appproval history popup call back ==================
  private ApprovalHistoryPopupCallBack() {
    this.setState({
      ApprovalHistoryPopup: false,
      ApprovalPointUserData: '',
      ApprovalPointCurrentParentIndex: null,
      currentArraySubTextIndex: null

    })
  }
  /// ==============reply comment function ====================
  private updateReplyMessagesFunction = (e: any) => {
    console.log(e.target.value)
    this.setState({
      replyTextComment: e.target.value
    })

  }
  private openReplycommentPopup = (i: any, k: any) => {
    this.setState({
      currentDataIndex: i + "" + k,
      isCalloutVisible: true
    })
  }
  private openReplySubcommentPopup = (i: any, j: any, k: any) => {
    this.setState({
      currentDataIndex: +i + '' + j + k,
      isCalloutVisible: true
    })
  }
  ///// ==========save reeply comment=======================
  private SaveReplyMessageFunction = () => {
    let txt: any = this.state.replyTextComment;
    console.log(this.state.currentDataIndex)
    let txtComment: any = this.state.replyTextComment;
    if (txtComment != '') {

      var temp: any =
      {
        AuthorImage: this.currentUser != null && this.currentUser?.length > 0 ? this.currentUser[0]['userImage'] : "",
        AuthorName: this.currentUser != null && this.currentUser.length > 0 ? this.currentUser[0]['Title'] : "",
        Created: moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
        Title: txtComment,

      };
      let index: any = this.state.currentDataIndex.split('');

      if (index.length == 2) {
        let parentIndex = parseInt(index[0])
        let commentIndex = parseInt(index[1])
        let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex].Comments[commentIndex];

        if (feedback.ReplyMessages == undefined) {
          feedback.ReplyMessages = []
          feedback.ReplyMessages.push(temp)
        } else {
          feedback.ReplyMessages.push(temp)
        }

      }
      if (index.length == 3) {
        let parentIndex = parseInt(index[0])
        let subcomentIndex = parseInt(index[1])
        let commentIndex = parseInt(index[2])
        let feedback = this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentIndex].Subtext[subcomentIndex].Comments[commentIndex];

        if (feedback.ReplyMessages == undefined) {
          feedback.ReplyMessages = []
          feedback.ReplyMessages.push(temp)
        } else {
          feedback.ReplyMessages.push(temp)
        }

      }
      console.log(temp)
      this.onPost();

      this.setState({
        isCalloutVisible: false,
        replyTextComment: "",
        currentDataIndex: 0
      })


    } else {
      alert('Please input some text.')
    }

  }
  // =========clearReplycomment===========
  private clearReplycomment(isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any, parentindex: any, replyIndex: any) {
    if (confirm("Are you sure, you want to delete this?")) {
      if (isSubtextComment) {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Subtext"][indexOfSubtext]?.Comments[indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1)
      } else {
        this.state.Result["FeedBack"][0]?.FeedBackDescriptions[parentindex]["Comments"][indexOfDeleteElement]?.ReplyMessages?.splice(replyIndex, 1);
      }
      this.onPost();
    }

  }
  //===========EditReplyComment===============

  private EditReplyComment(comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any, parentIndex: any, replyIndex: any) {
    this.setState({
      isEditReplyModalOpen: true,
      CommenttoUpdate: comment?.Title,
      // replyTextComment:comment?.Title,
      updateReplyCommentText: {
        'comment': comment?.Title,
        'indexOfUpdateElement': indexOfUpdateElement,
        'indexOfSubtext': indexOfSubtext,
        'isSubtextComment': isSubtextComment,
        'replyIndex': replyIndex,
        "data": comment,
        "parentIndexOpeneditModal": parentIndex
      }
    })
  }
  private onRenderCustomHeadereditcomment = () => {
    return (
      <>
        <div className='subheading' >
          Update Comment
        </div>
        <Tooltip ComponentId='1683' />
      </>
    );
  };
  private contextCall = (data: any, path: any, releventKey: any) => {
    if (data != null && path != null) {
      this.setState({
        keydoc: data,
        FileDirRef: path
      })
    }
    if (releventKey) {
      this?.relevantDocRef?.current?.loadAllSitesDocuments()
    }
    else if (data == null && path == null && releventKey == false) {
      this?.keyDocRef?.current?.loadAllSitesDocumentsEmail()
      this?.relevantDocRef?.current?.loadAllSitesDocuments()
    }
  };

  //****** remove extra space in folora editor  */

  private cleanHTML = (html: any, folora: any, index: any) => {
    if (html != undefined) {
      html = globalCommon?.replaceURLsWithAnchorTags(html)
      const div = document.createElement('div');
      div.innerHTML = html;
      const paragraphs = div.querySelectorAll('p');
      // Filter out empty <p> tags
      paragraphs.forEach((p) => {
        if (p.innerText.trim() === '') {
          p.parentNode.removeChild(p); // Remove empty <p> tags
        }
      });
      div.innerHTML = div.innerHTML.replace(/\n/g, '<br>')  // Convert newlines to <br> tags first
      div.innerHTML = div.innerHTML.replace(/(?:<br\s*\/?>\s*)+(?=<\/?[a-z][^>]*>)/gi, '');


      return div.innerHTML;
    }

  };

  //******* End ****************************/
  private callbackTotalTime = ((Time: any) => {
    this.setState(({
      TotalTimeEntry: Time
    }))

  })
  //********** */ Inline editing start************
  private handleFieldChange = (fieldName: any) => (e: any) => {
    let Priority: any;

    this.setState((prevState) => ({
      Result: {
        ...prevState.Result,
        [fieldName]: fieldName == "ItemRank" ? e : e.target.value,

      }
    }));
  };
  private TaskProfilePriorityCallback = (priorityValue: any) => {
    console.log("TaskProfilePriorityCallback")
    let resultData = this.state.Result;
    resultData.PriorityRank = Number(priorityValue);
    resultData.SmartPriority = ""

    this.setState((prevState) => ({
      Result: {
        ...prevState.Result,
        PriorityRank: Number(priorityValue),
        ["SmartPriority"]: globalCommon?.calculateSmartPriority(resultData),
      }
    }));

  }

  private inlineCallBack = (item: any) => {
    let resultData = this.state.Result;
    resultData.Categories = item?.Categories;
    resultData.SmartPriority = ""
    resultData.TaskCategories = item?.TaskCategories
    this.setState((prevState) => ({
      Result: {
        ...prevState.Result,
        Categories: item?.Categories,
        ["SmartPriority"]: globalCommon?.calculateSmartPriority(resultData),

      }
    }));
    console.log(item)
  }

  private openPortfolioPopupFunction = (change: any) => {
    if (change == "Portfolio") {
      this.setState({
        isopencomonentservicepopup: true
      })
    } else {
      this.setState({
        isopenProjectpopup: true
      })
    }
  }
  private loadTaggedConceptPaperDocument = async (Documents: any) => {
    let web = new Web(AllListId?.siteUrl);
    try {
      let query = "Id,Title,PriorityRank,DocumentType,Year,Body,Item_x0020_Cover,Portfolios/Id,Portfolios/Title,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl&$expand=Author,Editor,Portfolios"
      await web.lists.getById(AllListId?.DocumentsListID)
        .items.select(query)
        .filter(`(Portfolios/Id eq ${Documents?.ID})`)
        .getAll()
        .then((Data: any[]) => {
          var tagdoc: any = Data.filter((item: any) => item.DocumentType === "Concept Paper")
          this.setState({
            TagConceptPaper: tagdoc
          })
        })

    } catch (e: any) {
      console.log(e)
    }
  }
  private ComponentServicePopupCallBack = async (DataItem: any, Type: any, functionType: any) => {
    console.log(DataItem)
    console.log(Type)
    console.log(functionType)
    if (DataItem.length > 0) {
      this.loadTaggedConceptPaperDocument(DataItem[0])
    }
    let dataUpdate: any;
    let selectedCC: any = [];
    let Sitestagging: any
    let cctag: any = []
    let TeamMembersId: any = []
    let AssignedToId: any = [];
    let ResponsibleTeamId: any = [];
    if (functionType == "Save") {
      if (this?.state?.isopencomonentservicepopup) {
        // DataItem[0]?.ClientCategory?.map((cc: any) => {
        //   if (cc.Id != undefined) {
        //     let foundCC = AllClientCategories?.find((allCC: any) => allCC?.Id == cc.Id)
        //     if (this?.state?.Result?.siteType?.toLowerCase() == 'shareweb') {
        //       selectedCC.push(cc.Id)
        //       cctag.push(foundCC)
        //     } else if (this?.state?.Result?.siteType?.toLowerCase() == foundCC?.siteName?.toLowerCase()) {
        //       selectedCC.push(cc.Id)
        //       cctag.push(foundCC)
        //     }
        //   }
        // })
        if (DataItem[0]?.Sitestagging != undefined) {
          if (this?.state?.Result?.siteType?.toLowerCase() == "shareweb") {
            var sitetag = JSON.parse(DataItem[0]?.Sitestagging)
            sitetag?.map((sitecomp: any) => {
              if (sitecomp.Title != undefined && sitecomp.Title != "" && sitecomp.SiteName == undefined) {
                sitecomp.SiteName = sitecomp.Title
                let ClientCategory = cctag?.filter((data: any) => data?.siteName == sitecomp.Title)
                if (ClientCategory.length > 0) {
                  sitecomp.ClientCategory = ClientCategory
                }

              }

            })
            Sitestagging = JSON.stringify(sitetag)
            ClientTimeArray = [];

            ClientTimeArray = sitetag;
          }
          else {
            var siteComp: any = {};
            siteComp.SiteName = this?.state?.Result?.siteType,
              siteComp.SiteImages = this.GetSiteIcon(this.state?.listName),
              siteComp.localSiteComposition = true
            siteComp.ClienTimeDescription = 100,
              siteComp.Date = moment(new Date().toLocaleString()).format("DD-MM-YYYY");

            Sitestagging = JSON?.stringify([siteComp]);
            ClientTimeArray = [];
            siteComp.ClientCategory = cctag
            ClientTimeArray = [siteComp]
          }


        }
        DataItem?.map((portfolio: any) => {
          portfolio?.ClientCategory?.map((cc: any) => {
            if (cc.Id != undefined) {
              let foundCC = AllClientCategories?.find((allCC: any) => allCC?.Id == cc.Id)
              if (this?.state?.Result?.siteType?.toLowerCase() == 'shareweb') {
                selectedCC.push(cc.Id)
                cctag.push(foundCC)
              } else if (this?.state?.Result?.siteType?.toLowerCase() == foundCC?.siteName?.toLowerCase()) {
                selectedCC.push(cc.Id)
                cctag.push(foundCC)
              }
            }
          })
          if (portfolio?.AssignedTo?.length > 0) {
            portfolio?.AssignedTo?.map((assignData: any) => {
              AssignedToId.push(assignData.Id)
            })
            if (portfolio?.ResponsibleTeam?.length > 0) {
              portfolio?.ResponsibleTeam?.map((resp: any) => {
                ResponsibleTeamId.push(resp.Id)
              })
            }
            if (portfolio?.TeamMembers?.length > 0) {
              portfolio?.TeamMembers?.map((teamMemb: any) => {
                TeamMembersId.push(teamMemb.Id)
              })
            }
          }
        })


        this.setState((prevState) => ({
          Result: {
            ...prevState.Result,
            Portfolio: DataItem[0],
            ResponsibleTeam: DataItem[0]?.ResponsibleTeam,
            TeamMembers: DataItem[0]?.TeamMembers,
            AssignedTo: DataItem[0]?.AssignedTo,

          }
        }))
        dataUpdate = {
          PortfolioId: DataItem[0]?.Id,
          ClientCategoryId: { results: selectedCC },
          Sitestagging: Sitestagging,

          TeamMembersId: {
            results: TeamMembersId

          },
          AssignedToId: {
            results: AssignedToId

          },
          ResponsibleTeamId: {
            results: ResponsibleTeamId

          },

        }
        this?.updateProjectComponentServices(dataUpdate)
      } else {

        ProjectData = DataItem[0];
        if (DataItem[0]?.Item_x0020_Type == "Project" || DataItem[0]?.Item_x0020_Type == "Sprint") {
          dataUpdate = {
            ProjectId: DataItem[0]?.Id
          }
          let resultData = this.state.Result;
          resultData.Project = DataItem[0]
          resultData.SmartPriority = ""
          this.setState((prevState) => ({
            Result: {
              ...prevState.Result,
              ["SmartPriority"]: globalCommon?.calculateSmartPriority(resultData),

            }
          }));

          // console.log(childData)
          this?.updateProjectComponentServices(dataUpdate)
          if (this.state.Result?.TaskType?.Title != "Task") {
            await globalCommon?.AwtGroupingAndUpdatePrarticularColumn(this.state.Result, this.allDataOfTask, dataUpdate)
          }

        }
      }

    }
    this.setState({
      isopencomonentservicepopup: false,
      isopenProjectpopup: false
    })
  }
  private async updateProjectComponentServices(dataUpdate: any) {


    let web = new Web(this.props.siteUrl);
    await web.lists
      .getByTitle(this.state?.listName)
      // .getById(this.props.SiteTaskListID)
      .items
      .getById(this.state?.itemID)
      .update(dataUpdate).then(async (data: any) => {
        console.log(data)

      }).catch((error: any) => {
        console.log(error)
      });


  }
  private SendRemindernotifications = (InfoData: any, ActionType: any) => {
    if (InfoData?.NotificationSend == true) {
      let RequiredData: any = {
        ReceiverName: InfoData.TaggedUsers?.Title,
        sendUserEmail: [InfoData.TaggedUsers?.Email],
        Context: this.props?.Context,
        ActionType: ActionType,
        ReasonStatement: InfoData.Comment,
        UpdatedDataObject: this.state.Result,
      }
      GlobalFunctionForUpdateItems.MSTeamsReminderMessage(RequiredData);
      alert("The reminder has been sent to the user.");
    } else {
      alert(`This user has not been tagged as a ${ActionType} yet, so you cannot send a reminder now.`);
    }
  }



  //********** */ Inline editing End************
  public render(): React.ReactElement<ITaskprofileProps> {
    buttonId = this.generateButtonId();
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;
    if (this.state.Result["TaskId"] != undefined && this.state.Result['Title'] != undefined) {
      document.title = `${this.state.Result["TaskId"]}-${this.state.Result['Title']}`
    } else {
      document.title = "Task Profile"
    }




    return (
      <myContextValue.Provider value={{ ...myContextValue, FunctionCall: this.contextCall, keyDoc: this.state.keydoc, FileDirRef: this.state.FileDirRef, user: this?.taskUsers, ColorCode: this.state.Result["Portfolio"]?.PortfolioType?.Color }}>
        <div>
          <section className='ContentSection'> {this.state.breadCrumData != undefined &&
            <div className='row'>
              <div className="col-sm-12 p-0 ">

                <ul className="spfxbreadcrumb mb-0 mt-16 p-0">
                  {this.state?.Result["Portfolio"] == undefined && this.state.breadCrumData?.length == 0 && this.state.Result.Title != undefined ?
                    <>
                      <li  >
                        <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Dashboard.aspx`}> <span>Dashboard</span> </a>
                      </li>


                      <li>
                        <a  >
                          <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                            <span title={this.state.Result['Title']}>{truncatedTitle?.length > 0 ? truncatedTitle : this.state.Result['Title']}</span>
                            {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                              {this.state.Result['Title']}
                            </span>}
                          </span>

                        </a>
                      </li></> : <>

                      {this.state.Result["Portfolio"] != null && this.state.breadCrumData.length > 0 &&
                        <li >
                          {this.state.Result["Portfolio"] != null &&
                            <a className="fw-bold" style={{ color: this.state.Result["Portfolio"]?.PortfolioType?.Color }} target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Team-Portfolio.aspx`}>Team Portfolio</a>
                          }

                        </li>
                      }
                      {this.state.breadCrumData?.map((breadcrumbitem: any, index: any) => {
                        return <>
                          {breadcrumbitem?.siteType == "Master Tasks" && <li>
                            <a style={{ color: breadcrumbitem?.PortfolioType?.Color }} className="fw-bold" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${breadcrumbitem?.Id}`}>{breadcrumbitem?.Title}</a>
                          </li>}
                          {breadcrumbitem?.siteType !== "Master Tasks" && <li>

                            <a target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Task-Profile.aspx?taskId=${breadcrumbitem?.Id}&Site=${breadcrumbitem?.siteType} `}>{breadcrumbitem?.Title}</a>
                          </li>}
                          {this.state.breadCrumData.length == index &&
                            <li>
                              <a  >
                                <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                                  <span>{truncatedTitle?.length > 0 ? truncatedTitle : this.state.Result['Title']}</span>
                                  {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                                    {this.state.Result['Title']}
                                  </span>}
                                </span>

                              </a>
                            </li>
                          }
                        </>
                      })
                      }</>}
                </ul>
              </div>
            </div>
          }
            <section className='row p-0'>
              <h2 className="heading d-flex ps-0 justify-content-between align-items-center">
                <span className='alignCenter'>
                  {this.state.Result["SiteIcon"] != "" && <img className="imgWid29 pe-1 " title={this?.state?.Result?.siteType} src={this.state.Result["SiteIcon"]} />}
                  {this.state.Result["SiteIcon"] === "" && <img className="imgWid29 pe-1 " src="" />}
                  <span className='popover__wrapper ms-1' data-bs-toggle="tooltip" data-bs-placement="auto">
                    <span >{truncatedTitle?.length > 0 ? truncatedTitle : this.state.Result['Title']}</span>
                    {truncatedTitle?.length > 0 && <span className="f-13 popover__content" >
                      {this.state.Result['Title']}
                    </span>}
                  </span>
                  <a className="hreflink" title='Edit' onClick={() => this.OpenEditPopUp()}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="25" viewBox="0 0 48 48" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 21.9323V35.8647H13.3613H19.7226V34.7589V33.6532H14.3458H8.96915L9.0264 25.0837L9.08387 16.5142H24H38.9161L38.983 17.5647L39.0499 18.6151H40.025H41V13.3076V8H24H7V21.9323ZM38.9789 12.2586L39.0418 14.4164L24.0627 14.3596L9.08387 14.3027L9.0196 12.4415C8.98428 11.4178 9.006 10.4468 9.06808 10.2838C9.1613 10.0392 11.7819 9.99719 24.0485 10.0441L38.9161 10.1009L38.9789 12.2586ZM36.5162 21.1565C35.8618 21.3916 34.1728 22.9571 29.569 27.5964L23.4863 33.7259L22.7413 36.8408C22.3316 38.554 22.0056 39.9751 22.017 39.9988C22.0287 40.0225 23.4172 39.6938 25.1029 39.2686L28.1677 38.4952L34.1678 32.4806C41.2825 25.3484 41.5773 24.8948 40.5639 22.6435C40.2384 21.9204 39.9151 21.5944 39.1978 21.2662C38.0876 20.7583 37.6719 20.7414 36.5162 21.1565ZM38.5261 23.3145C39.2381 24.2422 39.2362 24.2447 32.9848 30.562C27.3783 36.2276 26.8521 36.6999 25.9031 36.9189C25.3394 37.0489 24.8467 37.1239 24.8085 37.0852C24.7702 37.0467 24.8511 36.5821 24.9884 36.0529C25.2067 35.2105 25.9797 34.3405 31.1979 29.0644C35.9869 24.2225 37.2718 23.0381 37.7362 23.0381C38.0541 23.0381 38.4094 23.1626 38.5261 23.3145Z" fill="#333333" /></svg>

                  </a>
                  {this.state.Result["Approver"] != undefined && this.state.Result["Approver"] != "" && this.state.Result["Categories"]?.includes("Approval") && ((this.currentUser != undefined && this?.currentUser?.length > 0 && this.state.Result?.Approver?.AssingedToUser?.Id == this.currentUser[0]?.Id) || (this.currentUser != undefined && this?.currentUser?.length > 0 && this.state.Result["Approver"]?.Approver?.length > 0 && this.state.Result["Approver"]?.Approver[0]?.Id == this?.currentUser[0]?.Id)) && this.state.Result["Status"] == "For Approval" &&
                    this.state.Result["PercentComplete"] == 1 ? <span><button onClick={() => this.sendEmail("Approved")} className="btn btn-success ms-3 mx-2">Approve</button><span><button className="btn btn-danger" onClick={() => this.sendEmail("Rejected")}>Reject</button></span></span> : null
                  }
                  {this.currentUser != undefined && this.state.sendMail && this.state.emailStatus != "" && <EmailComponenet approvalcallback={() => { this.approvalcallback() }} Context={this.props.Context} emailStatus={this.state.emailStatus} currentUser={this.currentUser} items={this.state.Result} />}
                </span>
                {!(this?.state?.Result["siteUrl"]?.includes('GrueneWeltweit')) ? (
                  <span className="text-end fs-6">
                    <a className='oldtitle' target='_blank' data-interception="off" href={this.oldTaskLink} style={{ cursor: "pointer", fontSize: "14px" }}>Old Task Profile</a>
                  </span>
                ) : null}

              </h2>
            </section>
            <section>
              <div className='row'>
                <div className="col-9 bg-white">
                  <div className="team_member row">
                    <div className='col-md-4 p-0'>
                      <dl>
                        <dt className='bg-Fa'>Task Id</dt>
                        <dd className='bg-Ff position-relative'>
                          <ReactPopperTooltipSingleLevel CMSToolId={this.state.Result['TaskId']} row={this.state.Result} singleLevel={true} masterTaskData={this.masterForHierarchy} AllSitesTaskData={this.allDataOfTask} AllListId={AllListId} />

                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Due Date</dt>
                        <dd className='bg-Ff'>
                          <EditableField
                            listName={this?.state?.Result?.listName}
                            itemId={this?.state?.Result?.Id}
                            fieldName="DueDate"
                            value={
                              this?.state?.Result?.DueDate != undefined
                                ? this?.state?.Result?.DueDate
                                : ""
                            }
                            TaskProfilePriorityCallback={null}
                            onChange={this.handleFieldChange("DueDate")}
                            type="Date"
                            web={AllListId?.siteUrl}
                          />

                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Start Date</dt>
                        <dd className='bg-Ff'>{this.state.Result["StartDate"] != undefined ? this.state.Result["StartDate"] : ""}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Completion Date</dt>
                        <dd className='bg-Ff'> {this.state.Result["CompletedDate"] != undefined ? this.state.Result["CompletedDate"] : ""}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa' title="Task Id">Categories</dt>

                        <dd className='bg-Ff text-break'>
                          <div className='alignCenter'>
                            <InlineEditingcolumns
                              AllListId={AllListId}
                              callBack={this?.inlineCallBack}
                              columnName='TaskCategories'
                              item={this?.state?.Result}
                              TaskUsers={this?.taskUsers}
                              pageName={'portfolioprofile'}
                            />

                          </div>


                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Item Rank</dt>
                        <dd className='bg-Ff'>
                          <EditableField
                            listName={this?.state?.Result?.listName}
                            itemId={this?.state?.Result?.Id}
                            fieldName="ItemRank"
                            value={
                              this?.state?.Result?.ItemRank != undefined
                                ? this?.state?.Result?.ItemRank
                                : ""
                            }
                            TaskProfilePriorityCallback={null}
                            onChange={this.handleFieldChange("ItemRank")}
                            type=""
                            web={AllListId?.siteUrl}
                          />

                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Bottleneck</dt>
                        <dd className='bg-Ff'>
                          {this.state?.Result?.Bottleneck?.length > 0 && this.state?.Result?.Bottleneck?.map((BottleneckData: any) => {
                            return (
                              <div className="align-content-center alignCenter justify-content-between py-1">
                                <div className="alignCenter">
                                  <img
                                    className="ProirityAssignedUserPhoto m-0"
                                    title={BottleneckData.TaggedUsers?.Title}
                                    src={
                                      BottleneckData.TaggedUsers.userImage !=
                                        undefined &&
                                        BottleneckData.TaggedUsers.userImage.length >
                                        0
                                        ? BottleneckData.TaggedUsers.userImage
                                        : ""
                                    }
                                  />
                                  <span className="ms-1">{BottleneckData?.TaggedUsers?.Title}</span>
                                </div>

                                <div className="alignCenter">
                                  <span
                                    className="hover-text me-1"
                                    onClick={() =>
                                      this.SendRemindernotifications(BottleneckData, "Bottleneck")}
                                  >
                                    <LuBellPlus />
                                    <span className="tooltip-text pop-left">
                                      Send reminder notifications
                                    </span>
                                  </span>
                                  {BottleneckData.Comment != undefined &&
                                    BottleneckData.Comment?.length > 1 && <span
                                      className="m-0 img-info hover-text"

                                    >
                                      <span className="svg__iconbox svg__icon--comment"></span>
                                      <span className="tooltip-text pop-left">
                                        {BottleneckData.Comment}
                                      </span>
                                    </span>}

                                </div>
                              </div>
                            )

                          })}

                        </dd>
                      </dl>

                      {isShowTimeEntry && <dl>
                        <dt className='bg-Fa'>SmartTime Total</dt>
                        <dd className='bg-Ff'>
                          <span className="me-1 alignCenter  pull-left"> {this.state.smarttimefunction ? <SmartTimeTotal AllListId={AllListId} callbackTotalTime={(data: any) => this.callbackTotalTime(data)} props={this.state.Result} Context={this.props.Context} allTaskUsers={this?.taskUsers} /> : null}</span>
                        </dd>

                      </dl>}

                    </div>

                    <div className='col-md-4 p-0'>
                      <dl>
                        <dt className='bg-Fa'>Team Members</dt>

                        <dd className='bg-Ff'>
                          <ShowTaskTeamMembers
                            props={this.state.Result}
                            TaskUsers={this?.taskUsers}
                          />


                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Status</dt>
                        <dd className='bg-Ff'>{this.state.Result["PercentComplete"] != undefined ? this.state.Result["PercentComplete"]?.toFixed(0) : 0} <span className='me-2'>%</span> {this.state.Result["Status"]}<br></br>
                          {this.state.Result["ApproverHistory"] != undefined && this.state.Result["ApproverHistory"].length > 1 && this.state.Result["Categories"].includes("Approval") ?
                            <span style={{ fontSize: "smaller" }}>Approved by
                              <img className="workmember" title={this.state.Result["ApproverHistory"][this.state.Result?.ApproverHistory.length - 2]?.ApproverName} src={(this.state.Result?.ApproverHistory[this.state.Result?.ApproverHistory?.length - 2]?.ApproverImage != null) ? (this.state.Result.ApproverHistory[this.state.Result.ApproverHistory.length - 2]?.ApproverImage) : (this.state.Result?.ApproverHistory[this.state.Result.ApproverHistory.length - 2]?.ApproverSuffix)}></img></span>

                            : null}</dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Working Today</dt>
                        <dd className='bg-Ff position-relative' ><span className='tooltipbox'>{this.state.Result["IsTodaysTask"] ? "Yes" : "No"} </span>
                        </dd>
                      </dl>

                      {/* <dl>
                        <dt className='bg-Fa'>% Complete</dt>

                        <dd className='bg-Ff'>{this.state.Result["PercentComplete"] != undefined ? this.state.Result["PercentComplete"]?.toFixed(0) : 0}</dd>


                      </dl> */}
                      <dl>
                        <dt className='bg-Fa'>Priority</dt>
                        <dd className='bg-Ff'>

                          {this.state.Result.Categories != undefined && this.state.Result?.Categories?.indexOf('On-Hold') >= 0 ? (
                            <div className="hover-text">
                              <IoHandRightOutline
                                onMouseEnter={this.showOnHoldReason}
                                onMouseLeave={this.hideOnHoldReason}
                              />
                              {this.state.showOnHoldComment && (
                                <span className="tooltip-text tooltipboxs  pop-right">
                                  {comments.map((item: any, index: any) =>
                                    item.CommentFor !== undefined &&
                                      item.CommentFor === "On-Hold" ? (
                                      <div key={index}>
                                        <span className="siteColor H-overTitle">
                                          Task On-Hold by{" "}
                                          <span>
                                            {
                                              item.AuthorName
                                            }
                                          </span>{" "}
                                          <span>
                                            {
                                              moment(item.Created).format('DD/MM/YY')
                                            }
                                          </span>
                                        </span>
                                        {item.CommentFor !== undefined &&
                                          item.CommentFor !== "" ? (
                                          <div key={index}>
                                            <span dangerouslySetInnerHTML={{ __html: this.cleanHTML(item?.Description, "folora", index) }}>
                                            </span>
                                          </div>
                                        ) : null}
                                      </div>
                                    ) : null
                                  )}
                                </span>)}
                            </div>
                          ) : null}
                          <EditableField
                            // key={index}
                            listName={this?.state?.Result?.listName}
                            itemId={this.state.Result?.Id}
                            fieldName="Priority"
                            value={
                              this.state.Result?.PriorityRank != undefined
                                ? this.state.Result?.PriorityRank
                                : ""
                            }
                            TaskProfilePriorityCallback={(priorityValue: any) => this.TaskProfilePriorityCallback(priorityValue)}
                            onChange={this.handleFieldChange("Priority")}
                            type=""
                            web={AllListId?.siteUrl}
                          />

                        </dd>
                      </dl>

                      <dl>
                        <dt className='bg-Fa'>SmartPriority</dt>

                        <dd className='bg-Ff'>
                          <div className="boldClable" >
                            <span className={this?.state?.Result["SmartPriority"] != undefined ? "hover-text hreflink m-0 r sxsvc" : "hover-text hreflink m-0 cssc"}>
                              <>{this.state.Result["SmartPriority"] != undefined ? this?.state?.Result["SmartPriority"] : 0}</>
                              <span className="tooltip-text pop-right">
                                {this.state?.Result?.showFormulaOnHover != undefined ?
                                  <SmartPriorityHover editValue={this.state.Result} /> : ""}
                              </span>
                            </span>
                          </div>

                        </dd>
                      </dl>

                      <dl>
                        <dt className='bg-Fa'>Created</dt>
                        <dd className='bg-Ff alignCenter'>
                          {this.state.Result["Created"] != undefined && this.state.Result["Created"] != null ? moment(this.state.Result["Created"]).format("DD/MMM/YYYY") : ""}
                          {this.state.Result["Author"] != null && this.state.Result["Author"].length > 0 &&
                            <a title={this.state.Result["Author"][0].Title} className='alignCenter ms-1'>
                              {this.state.Result["Author"][0].userImage !== "" && <img className="workmember hreflink " src={this.state.Result["Author"][0].userImage} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, this.state.Result["Author"][0]?.Id)} ></img>

                              }
                              {this.state.Result["Author"][0].userImage === "" && <span title="Default user icons" className="alignIcon svg__iconbox svg__icon--defaultUser "></span>}
                            </a>

                          }

                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Attention</dt>
                        <dd className='bg-Ff'>
                          {this.state?.Result?.Attention?.length > 0 && this.state?.Result?.Attention?.map((AttentionData: any) => {
                            return (
                              <div className="align-content-center alignCenter justify-content-between py-1">
                                <div className="alignCenter">
                                  <img
                                    className="ProirityAssignedUserPhoto m-0"
                                    title={AttentionData.TaggedUsers?.Title}
                                    src={
                                      AttentionData.TaggedUsers.userImage !=
                                        undefined &&
                                        AttentionData.TaggedUsers.userImage.length >
                                        0
                                        ? AttentionData.TaggedUsers.userImage
                                        : ""
                                    }
                                  />
                                  <span className="ms-1">{AttentionData?.TaggedUsers?.Title}</span>
                                </div>

                                <div className="alignCenter">
                                  <span
                                    className="hover-text me-1"
                                    onClick={() =>
                                      this.SendRemindernotifications(AttentionData, "Attention")}
                                  >
                                    <LuBellPlus />
                                    <span className="tooltip-text pop-left">
                                      Send reminder notifications
                                    </span>
                                  </span>
                                  {AttentionData.Comment != undefined &&
                                    AttentionData.Comment?.length > 1 && <span
                                      className="m-0 img-info hover-text"

                                    >
                                      <span className="svg__iconbox svg__icon--comment"></span>
                                      <span className="tooltip-text pop-left">
                                        {AttentionData.Comment}
                                      </span>
                                    </span>}

                                </div>
                              </div>
                            )

                          })}

                        </dd>
                      </dl>
                    </div>
                    <div className='col-md-4 p-0'>

                      <dl>

                        <dt className='bg-Fa'>Portfolio Item</dt>
                        <dd className='bg-Ff full-width'>
                          {this.state?.TagConceptPaper?.length > 0 &&
                            <a href={this.state?.TagConceptPaper[0].EncodedAbsUrl}>
                              <span className={`alignIcon svg__iconbox svg__icon--${this.state?.TagConceptPaper[0]?.File_x0020_Type}`} title={this.state?.TagConceptPaper[0]?.File_x0020_Type}></span>
                            </a>
                          }
                          {this.state?.Result["Portfolio"] != null &&

                            <a className="hreflink" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/Portfolio-Profile.aspx?taskId=${this.state?.Result["Portfolio"].Id}`}>

                              {this.state?.Result["Portfolio"]?.Title}

                            </a>



                          } <span className="pull-right svg__icon--editBox svg__iconbox" onClick={() => this?.openPortfolioPopupFunction("Portfolio")}></span>

                        </dd>
                      </dl>
                      <dl>
                        <dt className='bg-Fa'>Project</dt>
                        <dd className='bg-Ff full-width'>
                          <div>
                            {ProjectData?.Title != undefined ? <a className="hreflink" target="_blank" data-interception="off" href={`${this.state.Result["siteUrl"]}/SitePages/PX-Profile.aspx?ProjectId=${ProjectData?.Id}`}><span className='d-flex'>
                              <ReactPopperTooltipSingleLevel CMSToolId={`${ProjectData?.PortfolioStructureID} - ${ProjectData?.Title}`} row={ProjectData} singleLevel={true} masterTaskData={this.masterTaskData} AllSitesTaskData={this.allDataOfTask} AllListId={AllListId} /></span></a> : null}
                            <span className="pull-right svg__icon--editBox svg__iconbox" onClick={() => this?.openPortfolioPopupFunction("Project")}></span>
                          </div>
                        </dd>
                      </dl>
                      {isShowSiteCompostion && <dl className="Sitecomposition">
                        {ClientTimeArray != null && ClientTimeArray?.length > 0 &&
                          <div className='dropdown'>
                            <a className="sitebutton bg-fxdark d-flex">
                              <span className="arrowicons" onClick={() => this.showhideComposition()}>{this.state.showComposition ? <SlArrowDown /> : <SlArrowRight />}</span>
                              <div className="d-flex justify-content-between full-width">
                                <p className="pb-0 mb-0">Site Composition</p>
                                <p className="input-group-text mb-0 pb-0" title="Edit Site Composition" onClick={() => this.setState({ EditSiteCompositionStatus: true })}>
                                  <span className="svg__iconbox svg__icon--editBox"></span>
                                </p>
                              </div>

                            </a>
                            <div className="spxdropdown-menu" style={{ display: this.state.showComposition ? 'block' : 'none' }}>
                              <ul>
                                {ClientTimeArray?.map((cltime: any, i: any) => {
                                  return <li className="Sitelist">
                                    <span>
                                      <img style={{ width: "22px" }} title={cltime?.SiteName} src={cltime?.SiteImages} />
                                    </span>
                                    {cltime?.ClienTimeDescription != undefined &&
                                      <span>
                                        {Number(cltime?.ClienTimeDescription).toFixed(1)}%
                                      </span>
                                    }
                                    {cltime.ClientCategory != undefined && cltime.ClientCategory.length > 0 ? cltime.ClientCategory?.map((clientcat: any) => {
                                      return (
                                        <span>{clientcat.Title}</span>
                                      )
                                    }) : null}
                                  </li>
                                })}
                              </ul>
                            </div>
                          </div>
                        }
                      </dl>}

                      {this.state.Result?.EstimatedTimeDescriptionArray?.length > 0 &&
                        <dl className="Sitecomposition my-2">
                          <div className='dropdown'>
                            <a className="sitebutton bg-fxdark d-flex">
                              <span className="arrowicons" onClick={() => this.showhideEstimatedTime()}>{this.state.ShowEstimatedTimeDescription ? <SlArrowDown /> : <SlArrowRight />}</span>
                              <div className="d-flex justify-content-between full-width">
                                <p className="pb-0 mb-0 ">Estimated Task Time Details</p>
                              </div>
                            </a>
                            <div className="spxdropdown-menu" style={{ display: this.state.ShowEstimatedTimeDescription ? 'block' : 'none' }}>
                              <div className="col-12" style={{ fontSize: "14px" }}>
                                {this.state.Result?.EstimatedTimeDescriptionArray != null && this.state.Result?.EstimatedTimeDescriptionArray?.length > 0 ?
                                  <div>
                                    {this.state.Result?.EstimatedTimeDescriptionArray?.map((EstimatedTimeData: any, Index: any) => {
                                      return (
                                        <div className={this.state.Result?.EstimatedTimeDescriptionArray?.length == Index + 1 ? "align-content-center alignCenter justify-content-between p-1 px-2" : "align-content-center justify-content-between border-bottom alignCenter p-1 px-2"}>
                                          <div className='alignCenter'>
                                            <span className='me-2'>{EstimatedTimeData?.Team != undefined ? EstimatedTimeData?.Team : EstimatedTimeData?.Category != undefined ? EstimatedTimeData?.Category : null}</span> |
                                            <span className='mx-2'>{EstimatedTimeData?.EstimatedTime ? (EstimatedTimeData?.EstimatedTime > 1 ? EstimatedTimeData?.EstimatedTime + " hours" : EstimatedTimeData?.EstimatedTime + " hour") : "0 hour"}</span>
                                            <img className="ProirityAssignedUserPhoto m-0 mx-2 hreflink " onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, EstimatedTimeData?.UserName, this?.taskUsers)} title={EstimatedTimeData?.UserName} src={EstimatedTimeData?.UserImage != undefined && EstimatedTimeData?.UserImage?.length > 0 ? EstimatedTimeData?.UserImage : ''} />
                                          </div>
                                          {EstimatedTimeData?.EstimatedTimeDescription?.length > 0 && <div className='alignCenter hover-text'>
                                            <span className="svg__iconbox svg__icon--info"></span>
                                            <span className='tooltip-text pop-right'>{EstimatedTimeData?.EstimatedTimeDescription} </span>
                                          </div>}
                                        </div>
                                      )
                                    })}
                                  </div>
                                  : null
                                }
                              </div>
                            </div>
                            <div className="spxdropdown-menu ps-2 py-1 " style={{ zIndex: 0 }}>
                              <span>Total Estimated Time : </span><span className="mx-1">{this.state.Result?.TotalEstimatedTime > 1 ? this.state.Result?.TotalEstimatedTime + " hours" : this.state.Result?.TotalEstimatedTime + " hour"} </span>
                            </div>
                          </div>
                        </dl>
                      }
                    </div>
                  </div>
                  <div className='row url'>
                    <div className="d-flex p-0">
                      <div className='bg-Fa p-2'><label>Url</label></div>
                      <div className='bg-Ff p-2 text-break full-width'>
                        {this.state.Result["component_url"] != null &&
                          <a target="_blank" data-interception="off" href={this.state.Result["component_url"].Url}>{this.state.Result["component_url"].Url}</a>
                        }
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className='p-0'> {this.state.Result.Id != undefined && <KeyDocuments AllListId={AllListId} Context={this.props?.Context} siteUrl={this.props.siteUrl} user={this?.taskUsers} DocumentsListID={this.props?.DocumentsListID} ID={this.state?.itemID} siteName={this.state.listName} folderName={this.state.Result['Title']} keyDoc={true}></KeyDocuments>}</div>
                  </div>
                  <section>
                    <div className="col mt-2">
                      <div className="Taskaddcomment row">
                        {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"]?.length > 0 &&
                          <div className="bg-white col-sm-4 mt-2 p-0">
                            <label className='form-label full-width fw-semibold'>Images</label>
                            {this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"]?.map((imgData: any, i: any) => {
                              return <div className="taskimage border mb-3">


                                <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                  <img alt={imgData?.ImageName} src={imgData?.ImageUrl}
                                    onMouseOver={(e) => this.OpenModal(e, imgData)}
                                    onMouseOut={(e) => this.CloseModal(e)} ></img>
                                </a>


                                <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-1 ">
                                  <div className='usericons'>
                                    <span>
                                      <span >{imgData?.UploadeDate}</span>
                                      <span className='round px-1'>
                                        {imgData?.UserImage != null && imgData?.UserImage != "" ?
                                          <img className='align-self-start hreflink ' title={imgData?.UserName} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, this?.taskUsers)} src={imgData?.UserImage} />
                                          : <span title="Default user icons" onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, this?.taskUsers)} className="alignIcon svg__iconbox svg__icon--defaultUser "></span>
                                        }
                                      </span>
                                      {imgData?.Description != undefined && imgData?.Description != "" && <span title={imgData?.Description} className="mx-1" >
                                        <BiInfoCircle />
                                      </span>}

                                    </span>
                                  </div>
                                  <div className="expandicon">

                                    <span >
                                      {imgData?.ImageName?.length > 15 ? imgData?.ImageName.substring(0, 15) + '...' : imgData?.ImageName}
                                    </span>
                                    <span>|</span>
                                    <a className='images' title="Expand Image" target="_blank" data-interception="off" href={imgData?.ImageUrl}><span className='mx-2'><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M212.686 315.314L120 408l32.922 31.029c15.12 15.12 4.412 40.971-16.97 40.971h-112C10.697 480 0 469.255 0 456V344c0-21.382 25.803-32.09 40.922-16.971L72 360l92.686-92.686c6.248-6.248 16.379-6.248 22.627 0l25.373 25.373c6.249 6.248 6.249 16.378 0 22.627zm22.628-118.628L328 104l-32.922-31.029C279.958 57.851 290.666 32 312.048 32h112C437.303 32 448 42.745 448 56v112c0 21.382-25.803 32.09-40.922 16.971L376 152l-92.686 92.686c-6.248 6.248-16.379 6.248-22.627 0l-25.373-25.373c-6.249-6.248-6.249-16.378 0-22.627z"></path></svg></span></a>
                                  </div>

                                </div>

                              </div>
                            })}
                          </div>
                        }
                        {/*feedback comment section code */}
                        <div className={this.state.Result["BasicImageInfo"] != null && this.state.Result["BasicImageInfo"]?.length > 0 ? "col-sm-8 pe-0 mt-2" : "col-sm-12 p-0 mt-2"}>
                          {this.state.Result["TaskTypeTitle"] != null && (this.state.Result["TaskTypeTitle"] == '' ||
                            this.state.Result["TaskTypeTitle"] == 'Task' || this.state.Result["TaskTypeTitle"] == "Workstream" || this.state.Result["TaskTypeTitle"] == "Activities") && this.state.Result["FeedBack"] != undefined && this.state.Result["FeedBack"].length > 0 && this.state.Result["FeedBack"][0].FeedBackDescriptions != undefined &&
                            this.state.Result["FeedBack"][0]?.FeedBackDescriptions?.length > 0 &&
                            this.state.Result["FeedBack"][0]?.FeedBackDescriptions[0]?.Title != '' && this.state.countfeedback >= 0 &&
                            <div className={"Addcomment " + "manage_gap"}>
                              <label className='form-label full-width fw-semibold'>Task description</label>
                              {this.state.Result["FeedBack"][0]?.FeedBackDescriptions?.map((fbData: any, i: any) => {
                                if (typeof fbData == "object") {
                                  let userdisplay: any = [];
                                  userdisplay.push({ Title: this.props?.userDisplayName })


                                  if (fbData != null && fbData != undefined && fbData?.Title != "") {

                                    try {
                                      if (fbData?.Title != undefined) {
                                        fbData.Title = fbData?.Title?.replace(/\n/g, '<br>');

                                      }
                                    } catch (e) {
                                    }
                                    return (
                                      <>
                                        <div>



                                          <div className="col mb-2">
                                            <div className='justify-content-between d-flex'>
                                              <div className="alignCenter m-0">
                                                {this.state.ApprovalStatus ?
                                                  <span className="alignCenter">
                                                    <span title="Rejected"
                                                      onClick={() => this.changeTrafficLigth(i, "Reject")}
                                                      className={fbData['isShowLight'] == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                    >
                                                    </span>
                                                    <span
                                                      onClick={() => this.changeTrafficLigth(i, "Maybe")}
                                                      title="Maybe" className={fbData['isShowLight'] == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                    </span>
                                                    <span title="Approved"
                                                      onClick={() => this.changeTrafficLigth(i, "Approve")}
                                                      className={fbData['isShowLight'] == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                                    </span>
                                                    {fbData["ApproverData"] != undefined && fbData.ApproverData?.length > 0 &&
                                                      <>
                                                        <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => this.ShowApprovalHistory(fbData, i, null)}>
                                                          {fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={fbData.ApproverData[fbData.ApproverData.length - 1]?.Title}><span><a onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Id,)} target="_blank" data-interception="off" title={fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.Title}> <img className='imgAuthor hreflink ' src={fbData?.ApproverData[fbData?.ApproverData?.length - 1]?.ImageUrl} /></a></span></a></span>
                                                      </>

                                                    }
                                                  </span>
                                                  : null
                                                }
                                              </div>
                                              <div className='m-0'>
                                                <span className="d-block">
                                                  <a className="siteColor" style={{ cursor: 'pointer' }} onClick={(e) => this.showhideCommentBox(i)}>Add Comment</a>
                                                </span>
                                              </div>
                                            </div>


                                            <div className="d-flex p-0 FeedBack-comment ">
                                              <div className="border p-1 me-1">
                                                <span>{i + 1}.</span>
                                                <ul className='list-none'>
                                                  <li>
                                                    {fbData['Completed'] != null && fbData['Completed'] &&

                                                      <span className="svg__iconbox svg__icon--tick"></span>
                                                    }
                                                  </li>
                                                  <li>
                                                    {fbData['HighImportance'] != null && fbData['HighImportance'] &&
                                                      <span className="svg__iconbox svg__icon--taskHighPriority"></span>
                                                    }
                                                  </li>
                                                  <li>
                                                    {fbData['LowImportance'] != null && fbData['LowImportance'] &&
                                                      <span className="svg__iconbox svg__icon--lowPriority"></span>
                                                    }
                                                  </li>
                                                  <li>
                                                    {fbData['Phone'] != null && fbData['Phone'] &&
                                                      <span className="svg__iconbox svg__icon--phone"></span>
                                                    }
                                                  </li>
                                                </ul>
                                              </div>

                                              <div className="border p-2 full-width text-break"

                                              >

                                                <span dangerouslySetInnerHTML={{ __html: this.cleanHTML(fbData?.Title, "folora", i) }}></span>
                                                <div className="col">
                                                  {fbData['Comments'] != null && fbData['Comments']?.length > 0 && fbData['Comments']?.map((fbComment: any, k: any) => {
                                                    return <div className={fbComment.isShowLight != undefined && fbComment.isApprovalComment ? `col add_cmnt my-1 ${fbComment.isShowLight}` : "col add_cmnt my-1"} title={fbComment.isShowLight != undefined ? fbComment.isShowLight : ""}>
                                                      <div className="">
                                                        <div className="d-flex p-0">
                                                          <div className="col-1 p-0 wid30">
                                                            {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, fbComment?.AuthorName, this?.taskUsers)}
                                                              src={fbComment.AuthorImage} /> :
                                                              <span onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, fbComment?.AuthorName, this?.taskUsers)} title="Default user icons" className="alignIcon svg__iconbox svg__icon--defaultUser "></span>}
                                                          </div>
                                                          <div className="col-11 pe-0" >
                                                            <div className='d-flex justify-content-between align-items-center'>
                                                              {fbComment?.AuthorName} - {fbComment?.Created}
                                                              <span className='d-flex'>
                                                                <a className="ps-1" title="Comment Reply" >
                                                                  <div data-toggle="tooltip" id={buttonId + "-" + i + k}
                                                                    onClick={() => this.openReplycommentPopup(i, k)}
                                                                    data-placement="bottom"
                                                                  >
                                                                    <span className="svg__iconbox svg__icon--reply"></span>
                                                                  </div>
                                                                </a>
                                                                <a title='Edit'
                                                                  onClick={() => this.openEditModal(fbComment, k, 0, false, i)}
                                                                >
                                                                  <span className='svg__iconbox svg__icon--edit'></span>
                                                                </a>
                                                                <a title='Delete'
                                                                  onClick={() => this.clearComment(false, k, 0, i)}
                                                                >
                                                                  <span className='svg__iconbox svg__icon--trash'></span></a>
                                                              </span>
                                                            </div>
                                                            <div><span dangerouslySetInnerHTML={{ __html: this.cleanHTML(fbComment?.Title, null, i) }}></span></div>
                                                          </div>
                                                        </div>
                                                        <div className="col-12 ps-3 pe-0 mt-1">
                                                          {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, index: any) => {
                                                            return (
                                                              <div className="d-flex border ms-3 p-2  mb-1">
                                                                <div className="col-1 p-0 wid30">
                                                                  {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, replymessage?.AuthorName, this?.taskUsers)}
                                                                    src={replymessage?.AuthorImage} /> : <span title="Default user icons" className="alignIcon svg__iconbox svg__icon--defaultUser "></span>}
                                                                </div>
                                                                <div className="col-11 pe-0" >
                                                                  <div className='d-flex justify-content-between align-items-center'>
                                                                    {replymessage?.AuthorName} - {replymessage?.Created}
                                                                    <span className='d-flex'>
                                                                      <a title='Edit'
                                                                        onClick={() => this.EditReplyComment(replymessage, k, 0, false, i, index)
                                                                        }
                                                                      >
                                                                        <span className='svg__iconbox svg__icon--edit'></span>
                                                                      </a>
                                                                      <a title='Delete'
                                                                        onClick={() => this.clearReplycomment(false, k, 0, i, index)
                                                                        }
                                                                      >
                                                                        <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                    </span>
                                                                  </div>
                                                                  <div><span dangerouslySetInnerHTML={{ __html: this.cleanHTML(replymessage?.Title, null, i) }}></span></div>
                                                                </div>
                                                              </div>

                                                            )
                                                          })}
                                                        </div>
                                                      </div>


                                                    </div>


                                                  })}
                                                </div>

                                              </div>
                                            </div>
                                            {this.state.showhideCommentBoxIndex == i && <div className='SpfxCheckRadio'>
                                              <div className="col-sm-12 mt-2 p-0" style={{ display: this.state.showcomment }} >
                                                {this.state.Result["Approver"] != "" && this.state.Result["Approver"] != undefined && (this.state.Result["Approver"]?.AssingedToUser?.Id == this?.currentUser[0]?.Id || (this.state.Result["Approver"]?.Approver?.length > 0 && this.state.Result["Approver"]?.Approver[0]?.Id == this?.currentUser[0]?.Id)) && <label className='label--checkbox'><input type='checkbox' className='form-check-input me-1' name='approval' checked={this.state.ApprovalCommentcheckbox} onChange={(e) => this.setState({ ApprovalCommentcheckbox: e.target.checked })} />
                                                  Mark as Approval Comment</label>}
                                              </div>
                                              <div className="align-items-center d-flex"
                                                style={{ display: this.state.showcomment }}
                                              >  <textarea id="txtComment" onChange={(e) => this.handleInputChange(e)} className="form-control full-width"></textarea>
                                                <button type="button" className={this.state.Result["Approver"] != undefined && this.state.Result["Approver"] != "" && (this.state.Result["Approver"]?.AssingedToUser?.Id == this.currentUser[0]?.Id || (this.state.Result["Approver"]?.Approver?.length > 0 && this.state.Result["Approver"]?.Approver[0]?.Id == this?.currentUser[0]?.Id)) ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => this.PostButtonClick(fbData, i)}>Post</button>
                                              </div>
                                            </div>}

                                          </div>

                                          {fbData['Subtext'] != null && fbData['Subtext'].length > 0 && fbData['Subtext']?.map((fbSubData: any, j: any) => {
                                            return <div className="col-sm-12 p-0 mb-2" style={{ width: '100%' }}>
                                              <div className='justify-content-between d-flex'>
                                                <div className='alignCenter m-0'>
                                                  {this.state.ApprovalStatus ?
                                                    <span className="alignCenter">
                                                      <span title="Rejected"
                                                        onClick={() => this.changeTrafficLigthsubtext(i, j, "Reject")}
                                                        className={fbSubData.isShowLight == "Reject" ? "circlelight br_red pull-left ml5 red" : "circlelight br_red pull-left ml5"}
                                                      >
                                                      </span>
                                                      <span title="Maybe"
                                                        onClick={() => this.changeTrafficLigthsubtext(i, j, "Maybe")}
                                                        className={fbSubData?.isShowLight == "Maybe" ? "circlelight br_yellow pull-left yellow" : "circlelight br_yellow pull-left"}>
                                                      </span>
                                                      <span title="Approved"
                                                        onClick={() => this.changeTrafficLigthsubtext(i, j, "Approve")}
                                                        className={fbSubData?.isShowLight == "Approve" ? "circlelight br_green pull-left green" : "circlelight br_green pull-left"}>

                                                      </span>
                                                      {fbSubData?.ApproverData?.length > 0 &&
                                                        <>
                                                          <span className="siteColor ms-2 hreflink" title="Approval-History Popup" onClick={() => this.ShowApprovalHistory(fbSubData, i, j)}>
                                                            {fbSubData?.ApproverData[fbSubData?.ApproverData?.length - 1]?.Status} </span> <span className="ms-1"><a title={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.Title}><span><a onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, fbSubData?.ApproverData[fbSubData?.ApproverData?.length - 1]?.Id,)} target="_blank" data-interception="off" title={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.Title}> <img className='imgAuthor hreflink ' src={fbSubData?.ApproverData[fbSubData?.ApproverData.length - 1]?.ImageUrl} /></a></span></a></span>
                                                        </>}


                                                    </span>
                                                    : null
                                                  }
                                                </div>
                                                <div className='m-0'>
                                                  <a className="d-block text-end">
                                                    <a className='siteColor' style={{ cursor: 'pointer' }}
                                                      onClick={(e) => this.showhideCommentBoxOfSubText(j, i)}
                                                    >Add Comment</a>
                                                  </a>
                                                </div>
                                              </div>

                                              <div className="d-flex pe-0 FeedBack-comment">
                                                <div className="border p-1 me-1">
                                                  <span >{i + 1}.{j + 1}</span>
                                                  <ul className="list-none">
                                                    <li>
                                                      {fbSubData?.Completed != null && fbSubData?.Completed &&
                                                        <span className="svg__iconbox svg__icon--tick"></span>
                                                      }
                                                    </li>
                                                    <li>
                                                      {fbSubData?.HighImportance != null && fbSubData?.HighImportance &&
                                                        <span className="svg__iconbox svg__icon--taskHighPriority"></span>
                                                      }
                                                    </li>
                                                    <li>
                                                      {fbSubData?.LowImportance != null && fbSubData?.LowImportance &&
                                                        <span className="svg__iconbox svg__icon--lowPriority"></span>
                                                      }
                                                    </li>
                                                    <li>
                                                      {fbSubData?.Phone != null && fbSubData?.Phone &&
                                                        <span className="svg__iconbox svg__icon--phone"></span>
                                                      }
                                                    </li>
                                                  </ul>
                                                </div>

                                                <div className="border p-2 full-width text-break"

                                                >
                                                  <span ><span dangerouslySetInnerHTML={{ __html: this.cleanHTML(fbSubData?.Title, null, j) }}></span></span>
                                                  <div className="feedbackcomment col-sm-12 PadR0 mt-10">
                                                    {fbSubData?.Comments != null && fbSubData.Comments.length > 0 && fbSubData?.Comments?.map((fbComment: any, k: any) => {
                                                      return <div className={fbComment?.isShowLight != undefined && fbComment.isApprovalComment ? `col-sm-12  mb-2 add_cmnt my-1 ${fbComment?.isShowLight}` : "col-sm-12  mb-2 add_cmnt my-1 "} title={fbComment?.isShowLight != undefined ? fbComment?.isShowLight : ""}>
                                                        <div className="">
                                                          <div className="d-flex p-0">
                                                            <div className="col-1 p-0 wid30">
                                                              {fbComment?.AuthorImage != undefined && fbComment?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, fbComment?.AuthorName, this?.taskUsers)}
                                                                src={fbComment.AuthorImage} /> : <span title="Default user icons" className="alignIcon svg__iconbox svg__icon--defaultUser "></span>
                                                              }
                                                            </div>
                                                            <div className="col-11 pad0" key={k}>
                                                              <div className="d-flex justify-content-between align-items-center">
                                                                {fbComment?.AuthorName} - {fbComment?.Created}
                                                                <span className='d-flex'>
                                                                  <a className="ps-1" title="Comment Reply" >
                                                                    <div data-toggle="tooltip" id={buttonId + "-" + i + j + k}
                                                                      onClick={() => this.openReplySubcommentPopup(i, j, k)}
                                                                      data-placement="bottom"
                                                                    >
                                                                      <span className="svg__iconbox svg__icon--reply"></span>
                                                                    </div>
                                                                  </a>
                                                                  <a title="Edit"
                                                                    onClick={() => this.openEditModal(fbComment, k, j, true, i)}
                                                                  >

                                                                    <span className='svg__iconbox svg__icon--edit'></span>
                                                                  </a>
                                                                  <a title='Delete'
                                                                    onClick={() => this.clearComment(true, k, j, i)}
                                                                  ><span className='svg__iconbox svg__icon--trash'></span></a>
                                                                </span>
                                                              </div>
                                                              <div ><span dangerouslySetInnerHTML={{ __html: this.cleanHTML(fbComment?.Title, null, j) }}></span></div>
                                                            </div>
                                                          </div>
                                                          <div className="col-12 ps-3 pe-0 mt-1">
                                                            {fbComment?.ReplyMessages != undefined && fbComment?.ReplyMessages.length > 0 && fbComment?.ReplyMessages?.map((replymessage: any, ReplyIndex: any) => {
                                                              return (
                                                                <div className="d-flex border ms-3 p-2  mb-1">
                                                                  <div className="col-1 p-0 wid30">
                                                                    {replymessage?.AuthorImage != undefined && replymessage?.AuthorImage != '' ? <img className="workmember hreflink " onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, replymessage?.AuthorName, this?.taskUsers)}
                                                                      src={replymessage.AuthorImage} /> : <span title="Default user icons" className="alignIcon svg__iconbox svg__icon--defaultUser "></span>}
                                                                  </div>
                                                                  <div className="col-11 pe-0" >
                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                      {replymessage?.AuthorName} - {replymessage?.Created}
                                                                      <span className='d-flex'>
                                                                        <a title='Edit'

                                                                          onClick={() => this.EditReplyComment(replymessage, k, 0, true, i, ReplyIndex)
                                                                          }
                                                                        >
                                                                          <span className='svg__iconbox svg__icon--edit'></span>
                                                                        </a>
                                                                        <a title='Delete'
                                                                          onClick={() => this.clearReplycomment(true, k, j, i, ReplyIndex)}

                                                                        >
                                                                          <span className='svg__iconbox svg__icon--trash'></span></a>
                                                                      </span>
                                                                    </div>
                                                                    <div><span dangerouslySetInnerHTML={{ __html: this.cleanHTML(replymessage?.Title, null, j) }}></span></div>
                                                                  </div>
                                                                </div>

                                                              )
                                                            })}
                                                          </div>
                                                        </div>
                                                      </div>
                                                    })}
                                                  </div>
                                                </div>
                                              </div>
                                              {this.state?.subchildcomment == j && this.state?.subchildParentIndex == i ? <div className='SpfxCheckRadio' >
                                                <div className="col-sm-12 mt-2 p-0  ">
                                                  {this.state.Result["Approver"] != "" && this.state.Result["Approver"] != undefined && (this.state.Result["Approver"]?.AssingedToUser?.Id == this.currentUser[0]?.Id || (this.state.Result["Approver"]?.Approver[0]?.Id == this?.currentUser[0]?.Id)) && <label className='label--checkbox'><input type='checkbox' className='form-check-input me-1' checked={this.state?.ApprovalCommentcheckbox} onChange={(e) => this.setState({ ApprovalCommentcheckbox: e.target?.checked })} />Mark as Approval Comment</label>}

                                                </div>

                                                <div className="align-items-center d-flex"

                                                >  <textarea id="txtCommentSubtext" onChange={(e) => this.handleInputChange(e)} className="form-control full-width" ></textarea>
                                                  <button type="button" className={this.state.Result["Approver"] != undefined && this.state.Result["Approver"] != "" && (this.state.Result["Approver"]?.AssingedToUser?.Id == this.currentUser[0]?.Id || (this.state.Result["Approver"]?.Approver[0]?.Id == this?.currentUser[0]?.Id)) ? "btn-primary btn ms-2" : "btn-primary btn ms-2"} onClick={() => this.SubtextPostButtonClick(j, i)}>Post</button>
                                                </div>
                                              </div> : null}

                                            </div>
                                          })}



                                        </div>


                                      </>
                                    )
                                  }
                                }

                              })}
                            </div>
                          }
                        </div>
                      </div>
                    </div>

                    {/*===================Backgroundimage code and comment========== */}

                    {this.backGroundComment && <div className="col mt-2">
                      <div className="Taskaddcomment row">
                        {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"].length > 0 &&
                          <div className="bg-white col-sm-4 mt-2 p-0">
                            {this.state.Result["OffshoreImageUrl"] != null && this.state.Result["OffshoreImageUrl"]?.map((imgData: any, i: any) => {
                              return <div className="taskimage border mb-3">
                                <a className='images' target="_blank" data-interception="off" href={imgData?.ImageUrl}>
                                  <img alt={imgData?.ImageName} src={imgData?.Url}
                                    onMouseOver={(e) => this.OpenModal(e, imgData)}
                                    onMouseOut={(e) => this.CloseModal(e)} ></img>
                                </a>


                                <div className="Footerimg d-flex align-items-center bg-fxdark justify-content-between p-2 ">
                                  <div className='usericons'>
                                    <span>
                                      <span >
                                        {imgData?.ImageName?.length > 15 ? imgData?.ImageName?.substring(0, 15) + '...' : imgData?.ImageName}
                                      </span>


                                    </span>
                                  </div>
                                  <div className="expandicon">
                                    <span >{imgData?.UploadeDate}</span>
                                    <span className='round px-1'>
                                      {imgData?.UserImage !== null && imgData?.UserImage != "" ?
                                        <img className='align-self-start hreflink ' title={imgData?.UserName} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, this?.taskUsers)} src={imgData?.UserImage} />
                                        : <span title="Default user icons" onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, imgData?.UserName, this?.taskUsers)} className="alignIcon svg__iconbox svg__icon--defaultUser "></span>
                                      }
                                    </span>
                                  </div>
                                </div>

                              </div>
                            })}
                          </div>
                        }
                        {this.state.Result["OffshoreComments"] != null && this.state.Result["OffshoreComments"] != undefined && this.state.Result["OffshoreComments"].length > 0 && <div className="col-sm-8 pe-0 mt-2">
                          <fieldset className='border p-1'>
                            <legend className="border-bottom fs-6">Background Comments</legend>
                            {this.state.Result["OffshoreComments"] != null && this.state.Result["OffshoreComments"].length > 0 && this.state.Result["OffshoreComments"]?.map((item: any, index: any) => {
                              return <div>


                                <span className='round px-1'>
                                  {item.AuthorImage != null &&
                                    <img className='align-self-start hreflink ' title={item?.AuthorName} onClick={() => globalCommon?.openUsersDashboard(AllListId?.siteUrl, undefined, item?.AuthorName, this?.taskUsers)} src={item?.AuthorImage} />
                                  }
                                </span>

                                <span className="pe-1">{item.AuthorName}</span>
                                <span className="pe-1" >{moment(item?.Created).format("DD/MM/YY")}</span>
                                <div style={{ paddingLeft: "30px" }} className=" mb-4 text-break"><span dangerouslySetInnerHTML={{ __html: item?.Body }}></span>
                                </div>


                              </div>
                            })} </fieldset>

                        </div>}
                      </div>
                    </div>}

                  </section>

                </div>
                <div className="col-3">
                  <div>
                    {this.state.Result != undefined && AllListId != undefined && <CommentCard siteUrl={this.props.siteUrl} AllListId={AllListId} Context={this.props.Context} counter={this.state.counter}></CommentCard>}
                    {this.state.Result?.Id != undefined && AllListId != undefined && <>
                      <AncTool item={this?.state?.Result} callBack={this.AncCallback} AllListId={AllListId} Context={this.props.Context} />
                    </>}
                  </div>
                  <div>{this.state.Result.Id && <SmartInformation ref={this.smartInfoRef} Id={this.state.Result.Id} AllListId={AllListId} Context={this.props?.Context} taskTitle={this.state.Result?.Title} listName={this.state.Result?.listName} />}</div>
                  <div> {this.state.Result.Id != undefined && <RelevantDocuments ref={this?.relevantDocRef} AllListId={AllListId} Context={this.props?.Context} siteUrl={this.props.siteUrl} DocumentsListID={this.props?.DocumentsListID} ID={this.state?.itemID} siteName={this.state.listName} folderName={this.state.Result['Title']} ></RelevantDocuments>}</div>
                  <div> {this.state.Result.Id != undefined && <RelevantEmail ref={this?.keyDocRef} AllListId={AllListId} Context={this.props?.Context} siteUrl={this.props.siteUrl} DocumentsListID={this.props?.DocumentsListID} ID={this.state?.itemID} siteName={this.state.listName} folderName={this.state.Result['Title']} ></RelevantEmail>}</div>
                </div>

              </div>
            </section></section>
          <section className='TableContentSection'>
            {console.log("context data ================", myContextValue)}

            <div className="row">
              {this.state.Result != undefined && this.state.Result.Id != undefined && this.state.Result.TaskTypeTitle != "" && this.state.Result.TaskTypeTitle != undefined && this.state.Result.TaskTypeTitle != 'Task' ?
                //  <TasksTable props={this.state.Result} AllMasterTasks={this.masterTaskData} AllSiteTasks={this.allDataOfTask} AllListId={AllListId} Context={this.props?.Context} />
                <RadimadeTable tableId="TaskProfilegit" AllListId={AllListId} configration={"AllAwt"} SelectedSiteForTask={[this.state?.listName]} SelectedItem={this.state.Result}></RadimadeTable>
                : ''}
            </div>
            <div className='row'>

              {this.state.Result != undefined &&
                <div className="ItemInfo mb-20" style={{ paddingTop: '15px' }}>

                  <div>Created <span >{(moment(this.state.Result['Creation']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{this.state.Result['Author'] != null && this.state.Result['Author'].length > 0 && this.state.Result['Author'][0].Title}</span>
                  </div>
                  <div>Last modified <span >{(moment(this.state.Result['Modified']).format('DD MMM YYYY HH:mm '))}</span> by <span className="siteColor">{this.state.Result['ModifiedBy'] != null && this.state.Result['ModifiedBy'].Title}</span><span className='mx-1'>|</span>

                    <span>{this.state.itemID ? <VersionHistoryPopup taskId={this.state.itemID} RequiredListIds={AllListId} listId={this.state.Result.listId} siteUrls={this.state.Result.siteUrl} isOpen={this.state.isopenversionHistory} /> : ''}</span>
                  </div>
                </div>
              }
            </div>
          </section>

          <div className='imghover' style={{ display: this.state.showPopup }}>
            <div className="popup">
              <div className="parentDiv">
                <span style={{ color: 'white' }}>{this.state.imageInfo["ImageName"]}</span>
                <img style={{ maxWidth: '100%' }} src={this.state.imageInfo["ImageUrl"]}></img>
              </div>
            </div>
          </div>
          {this?.state?.isCalloutVisible ? (

            <FocusTrapCallout
              className='p-2 replyTooltip'
              role="alertdialog"

              gapSpace={0}
              target={`#${buttonId}-${this.state.currentDataIndex}`}
              onDismiss={() => this.setState({
                isCalloutVisible: false
              })}
              setInitialFocus
            >
              <Text block variant="xLarge" className='subheading m-0 f-15'

              >
                Comment Reply
              </Text>
              <Text block variant="small">
                <div className="d-flex my-2">
                  <textarea className="form-control" value={this?.state?.replyTextComment}
                    onChange={(e) => this.updateReplyMessagesFunction(e)}
                  ></textarea>
                </div>

              </Text>
              <FocusZone handleTabKey={FocusZoneTabbableElements.all} isCircularNavigation>
                <Stack
                  className='modal-footer'
                  gap={8} horizontal>

                  <button className='btn btn-default'
                    onClick={() => this.setState({
                      isCalloutVisible: false
                    })}
                  >Cancel</button>
                  <button className='btn btn-primary'
                    onClick={this.SaveReplyMessageFunction}
                  >Save</button>
                </Stack>
              </FocusZone>
            </FocusTrapCallout>

          ) : null
          }
          {this.state.isOpenEditPopup ? <EditTaskPopup Items={this.state.Result} context={this.props.Context} AllListId={AllListId} Call={(Type: any) => { this.CallBack(Type) }} /> : ''}

          {this.state.EditSiteCompositionStatus ?
            <CentralizedSiteComposition
              ItemDetails={this.state.Result}
              RequiredListIds={AllListId}
              closePopupCallBack={(Type: any) => { this.CallBack(Type) }}
              usedFor={"AWT"}
              ColorCode={this.state.Result["Portfolio"]?.PortfolioType?.Color}
            /> : ''}
          {this.state?.emailcomponentopen && countemailbutton == 0 && <EmailComponenet approvalcallback={() => { this.approvalcallback() }} Context={this.props?.Context} emailStatus={this.state?.emailComponentstatus} currentUser={this?.currentUser} items={this.state?.Result} />}

          {(this.state?.isopencomonentservicepopup || this.state?.isopenProjectpopup) &&
            <ServiceComponentPortfolioPopup

              props={this?.state?.Result}
              Dynamic={AllListId}
              ComponentType={"Component"}
              Call={(DataItem: any, Type: any, functionType: any) => { this.ComponentServicePopupCallBack(DataItem, Type, functionType) }}
              showProject={this.state?.isopenProjectpopup}
            />
          }
          {(this.state?.CommenttoUpdate != undefined) && <Panel
            onRenderHeader={this.onRenderCustomHeadereditcomment}
            isOpen={this.state.isEditModalOpen ? this.state.isEditModalOpen : this.state.isEditReplyModalOpen}
            onDismiss={this.Closecommentpopup}
            isBlocking={this.state.isEditModalOpen ? !this.state.isEditModalOpen : !this.state.isEditReplyModalOpen}
          >
            <div className="modal-body">
              <div className='col'>
                <textarea id="txtUpdateComment" rows={6} className="full-width" onChange={(e) => this.handleUpdateComment(e)}  >{this.state?.CommenttoUpdate}</textarea>
              </div>
            </div>
            <footer className='modal-footer mt-2'>
              <button className="btn btn-primary ms-1" onClick={(e) => this.updateComment()}>Save</button>
              <button className='btn btn-default ms-1' onClick={this.Closecommentpopup}>Cancel</button>
            </footer>


          </Panel>}

          {this.state.ApprovalHistoryPopup ? <ApprovalHistoryPopup
            ApprovalPointUserData={this.state.ApprovalPointUserData}
            indexSHow={this.state.currentArraySubTextIndex != null ? this.state.ApprovalPointCurrentParentIndex + "." + this.state.currentArraySubTextIndex : this.state.ApprovalPointCurrentParentIndex}
            ApprovalPointCurrentIndex={this.state.ApprovalPointCurrentParentIndex - 1}
            ApprovalPointHistoryStatus={this.state.ApprovalHistoryPopup}
            currentArrayIndex={this.state.currentArraySubTextIndex - 1}
            usefor="TaskProfile"

            callBack={() => this.ApprovalHistoryPopupCallBack()}
          />
            : null}

        </div>
      </myContextValue.Provider>
    );
  }
}
export default Taskprofile
export { myContextValue }