import { Panel, PanelType } from 'office-ui-fabric-react'
import { Web } from "sp-pnp-js";
import React, { useState } from 'react'
import * as Moment from 'moment';
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import TeamConfigurationCard from "../../../globalComponents/TeamConfiguration/TeamConfiguration";
import { OverlayTrigger, Popover } from 'react-bootstrap';

var ChangeTaskUserStatus: any = true;
let ApprovalStatusGlobal: any = false;
let taskUsers: any = [];
var AssignedToIds: any = [];
var ResponsibleTeamIds: any = [];
var TeamMemberIds: any = [];
var ApproverIds: any = [];
var changeTime: any = 0;
let siteUrl: any = '';
let smartMetadataListId: any = '';
let AllMetadata: any = [];
let TaskCreatorApproverBackupArray: any = [];
let TaskApproverBackupArray: any = [];
const inlineEditingcolumns = (props: any) => {
    const [TimeInHours, setTimeInHours] = React.useState(0)
    const [taskStatusInNumber, setTaskStatusInNumber] = React.useState(0)
    const [TimeInMinutes, setTimeInMinutes] = React.useState(0)
    const [TeamConfig, setTeamConfig] = React.useState();
    const [teamMembersPopup, setTeamMembersPopup] = React.useState(false);
    const [TaskStatusPopup, setTaskStatusPopup] = React.useState(false);
    const [TaskPriorityPopup, setTaskPriorityPopup] = React.useState(false);
    const [PercentCompleteStatus, setPercentCompleteStatus] = React.useState('');
    const [TaskAssignedTo, setTaskAssignedTo] = React.useState([]);
    const [TaskTeamMembers, setTaskTeamMembers] = React.useState([]);
    const [TaskResponsibleTeam, setTaskResponsibleTeam] = React.useState([]);
    const [AllTaskUser, setAllTaskUser] = React.useState([]);
    const [ApproverData, setApproverData] = React.useState([]);
    const [InputFieldDisable, setInputFieldDisable] = React.useState(false);
    const [priorityRank, setpriorityRank] = React.useState([]);
    const [editDate, setEditDate]: any = React.useState(undefined);
    const [dueDate, setDueDate] = useState({ editDate: props?.item?.DueDate != undefined ? props?.item?.DueDate : null, editPopup: false, selectDateName: '' })
    const [UpdateTaskInfo, setUpdateTaskInfo] = React.useState(
        {
            Title: '', PercentCompleteStatus: '', ComponentLink: ''
        }
    )
    const [remark, setRemark]: any = useState(false);
    const [impTaskCategoryType, setImpTaskCategoryType] = React.useState([]);
    const [taskCategoryType, setTaskCategoryType] = React.useState([])
    const [taskStatus, setTaskStatus] = React.useState('');
    const [taskPriority, setTaskPriority] = React.useState('');
    const [ServicesTaskCheck, setServicesTaskCheck] = React.useState(false);
    const [UpdateEstimatedTime, setUpdateEstimatedTime] = React.useState(false);
    const [PercentCompleteCheck, setPercentCompleteCheck] = React.useState(true)
    const [selectedCatId, setSelectedCatId]: any[] = React.useState([]);
    const [feedback, setFeedback] = useState("");
    const StatusArray = [
        { value: 1, status: "01% For Approval", taskStatusComment: "For Approval" },
        { value: 2, status: "02% Follow Up", taskStatusComment: "Follow Up" },
        { value: 3, status: "03% Approved", taskStatusComment: "Approved" },
        { value: 5, status: "05% Acknowledged", taskStatusComment: "Acknowledged" },
        { value: 10, status: "10% working on it", taskStatusComment: "working on it" },
        { value: 70, status: "70% Re-Open", taskStatusComment: "Re-Open" },
        { value: 80, status: "80% In QA Review", taskStatusComment: "In QA Review" },
        { value: 90, status: "90% Task completed", taskStatusComment: "Task completed" },
        { value: 93, status: "93% For Review", taskStatusComment: "For Review" },
        { value: 96, status: "96% Follow-up later", taskStatusComment: "Follow-up later" },
        { value: 99, status: "99% Completed", taskStatusComment: "Completed" },
        { value: 100, status: "100% Closed", taskStatusComment: "Closed" }
    ]
    React.useEffect(() => {
        if (props?.item?.metaDataListId != undefined) {
            smartMetadataListId = props?.item?.metaDataListId;
        } else {
            smartMetadataListId = props?.AllListId?.SmartMetadataListID;
        }
        if (props?.item?.siteUrl != undefined) {
            siteUrl = props?.item?.siteUrl;
        } else {
            siteUrl = props?.AllListId?.siteUrl;
        }

        loadTaskUsers();
        // if (props?.item?.Services?.length > 0 && props?.pageName != 'ProjectOverView') {
        //     setServicesTaskCheck(true)
        // } else {
        //     setServicesTaskCheck(false)
        // }
        if (props?.item?.DueDate != undefined) {
            setEditDate(props?.item?.DueDate);
        }
        let selectedCategoryId: any = [];
        props?.item?.TaskCategories?.map((category: any) => {
            selectedCategoryId.push(category.Id);
        })
        setTaskAssignedTo(props?.item?.AssignedTo)
        setTaskTeamMembers(props?.item?.TeamMembers)
        setTaskResponsibleTeam(props?.item?.ResponsibleTeam)
        setSelectedCatId(selectedCategoryId);
        setTaskPriority(props?.item?.PriorityRank);
        setFeedback(props?.item?.Remark);
        setEstimatedTimeProps()
        if (props?.item?.PercentComplete != undefined) {
            props.item.PercentComplete = parseInt(props?.item?.PercentComplete);
            setTaskStatusInNumber(props.item.PercentComplete)
        }
        GetSmartMetadata();

    }, [props])
    const getPercentCompleteTitle = (percent: any) => {
        let result = '';
        StatusArray?.map((status: any) => {
            if (status?.value == percent) {
                result = status?.status;
            }
        })
        if (result.length <= 0) {
            result = percent + "% Completed"
        }
        return result
    }
    const setEstimatedTimeProps = () => {
        if (props?.item?.EstimatedTime != undefined && props?.item?.EstimatedTime > 0) {
            changeTime = props?.item?.EstimatedTime * 60;
            setTimeInHours(props?.item?.EstimatedTime);
            setTimeInMinutes(changeTime)
        } else {
            setTimeInHours(0);
            setTimeInMinutes(0)
            changeTime = 0;
        }
    }
    const GetSmartMetadata = async () => {
        let impSharewebCategories: any = [];
        let SharewebtaskCategories: any = [];
        var Priority: any = []

        try {
            impSharewebCategories = JSON.parse(localStorage.getItem("impTaskCategoryType"));
            SharewebtaskCategories = JSON.parse(localStorage.getItem("taskCategoryType"));
            Priority = JSON.parse(localStorage.getItem("Priority"));
            let site = JSON.parse(localStorage.getItem("siteUrl"));
            let DataLoaded = JSON.parse(localStorage.getItem("inlineMetaDataLoaded"));
            if ((impSharewebCategories == null || SharewebtaskCategories == null || Priority == null || site == null || site != siteUrl) && !DataLoaded) {
                impSharewebCategories = [];
                SharewebtaskCategories = [];
                Priority = [];
                var TaskTypes: any = []
                var Timing: any = []
                var Task: any = []
                let web = new Web(siteUrl);
                let MetaData = [];
                localStorage.setItem("inlineMetaDataLoaded", JSON.stringify(true));
                MetaData = await web.lists
                    .getById(smartMetadataListId)
                    .items.select("Id", "IsVisible", "ProfileType", "ParentID", "Title", "SmartSuggestions", "TaxType", "Description1", "Item_x005F_x0020_Cover", "listId", "siteName", "siteUrl", "SortOrder", "SmartFilters", "Selectable", "Parent/Id", "Parent/Title")
                    .top(5000)
                    .expand("Parent")
                    .get();
                AllMetadata = MetaData;
                AllMetadata?.map((metadata: any) => {

                    if (metadata.Title == 'Immediate' || metadata.Title == 'Bottleneck' || metadata.Title == 'Favorite') {
                        impSharewebCategories.push(metadata);
                    }
                    if (metadata.TaxType == 'Categories') {
                        SharewebtaskCategories.push(metadata);
                    }

                })
                localStorage.setItem("taskCategoryType", JSON.stringify(SharewebtaskCategories));
                localStorage.setItem("Priority", JSON.stringify(getSmartMetadataItemsByTaxType(AllMetadata, 'Priority Rank')));
                localStorage.setItem("impTaskCategoryType", JSON.stringify(impSharewebCategories));
                localStorage.setItem("siteUrl", JSON.stringify(siteUrl));
                Priority = getSmartMetadataItemsByTaxType(AllMetadata, 'Priority Rank');
                setTaskCategoryType(SharewebtaskCategories);
                setImpTaskCategoryType(impSharewebCategories);
                setpriorityRank(Priority)
            }
            setTaskCategoryType(SharewebtaskCategories);
            setImpTaskCategoryType(impSharewebCategories);
            setpriorityRank(Priority)
        }
        catch (e) {
            console.log(e)
        }


    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        metadataItems?.map((taxItem: any) => {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });

        Items.sort((a: any, b: any) => {
            return a.SortOrder - b.SortOrder;
        });
        return Items;
    }
    const loadTaskUsers = async () => {
        if (props?.TaskUsers?.length > 0) {
            taskUsers = props?.TaskUsers;
        } else {
            taskUsers = [];
        }

        setAllTaskUser(taskUsers)
    }
    const openTaskStatusUpdatePopup = async () => {

        let statusValue: any
        let AssignedUsers: any = [];
        let TeamMemberTemp: any = [];
        if (props?.item?.Approver?.length > 0) {
            TaskApproverBackupArray = props?.item?.Approver;
        }

        if (props?.item?.Author != undefined && props?.item?.Author != null) {
            AllTaskUser?.map((userData: any) => {
                if (props?.item?.Author.Id == userData?.AssingedToUserId) {
                    userData.Approver?.map((AData: any) => {
                        // ApproverDataTemp.push(AData);
                        TaskCreatorApproverBackupArray.push(AData);
                    })
                }
            })
            if ((statusValue <= 2) && ApprovalStatusGlobal) {
                if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                    AllTaskUser?.map((userData1: any) => {
                        TaskApproverBackupArray.map((itemData: any) => {
                            if (itemData.Id == userData1?.AssingedToUserId) {
                                AssignedUsers.push(userData1);
                                TeamMemberTemp.push(userData1);
                            }
                        })
                    })
                } else {
                    if (TaskCreatorApproverBackupArray?.length > 0) {
                        AllTaskUser?.map((userData1: any) => {
                            TaskCreatorApproverBackupArray?.map((itemData: any) => {
                                if (itemData.Id == userData1?.AssingedToUserId) {
                                    AssignedUsers.push(userData1);
                                    TeamMemberTemp.push(userData1);
                                }
                            })
                        })
                    }
                }
            } else {
                AllTaskUser?.map((userData: any) => {
                    props?.item?.AssignedTo?.map((AssignedUser: any) => {
                        if (userData?.AssingedToUserId == AssignedUser.Id) {
                            AssignedUsers.push(userData);
                        }
                    })
                })
            }
        }
        if (taskStatusInNumber != undefined) {
            statusValue = taskStatusInNumber;
            props.item.PercentComplete = statusValue;
            if (statusValue < 70 && statusValue > 20) {
                setTaskStatus("In Progress");
                setPercentCompleteStatus(`${statusValue}% In Progress`);
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: `${statusValue}` })
            } else {
                StatusArray?.map((item: any) => {
                    if (statusValue == item.value) {
                        setPercentCompleteStatus(item.status);
                        setTaskStatus(item.taskStatusComment);
                    }
                })
            }

            if (statusValue == 0) {
                setTaskStatus('Not Started');
                setPercentCompleteStatus('Not Started');
                setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: '0' })
            }

            if (statusValue <= 3 && ApprovalStatusGlobal) {
                ChangeTaskUserStatus = false;
            } else {
                ChangeTaskUserStatus = true;
            }
        }
        setTaskStatusPopup(true);
    }
    function isValidDate(dateString: any): boolean {
        const date = Moment(dateString, 'YYYY-MM-DD', true);
        return date.isValid();
    }
    const UpdateTaskStatus = async () => {
        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: (props?.item?.PercentComplete ? props?.item?.PercentComplete : null) })
        if (TaskAssignedTo != undefined && TaskAssignedTo?.length > 0) {
            TaskAssignedTo?.map((taskInfo) => {
                AssignedToIds.push(taskInfo.Id);
            })
        }

        if (ApproverData != undefined && ApproverData?.length > 0) {
            ApproverData?.map((ApproverInfo) => {
                ApproverIds.push(ApproverInfo.Id);
            })
        }
        if (TaskTeamMembers != undefined && TaskTeamMembers?.length > 0) {
            TaskTeamMembers?.map((taskInfo) => {
                TeamMemberIds.push(taskInfo.Id);
            })
        }
        if (TaskResponsibleTeam != undefined && TaskResponsibleTeam?.length > 0) {
            TaskResponsibleTeam?.map((taskInfo) => {
                ResponsibleTeamIds.push(taskInfo.Id);
            })
        }
        StatusArray?.map((array: any) => {
            if (props?.item?.PercentComplete == array.value) {
                setPercentCompleteStatus(array.status);
                setTaskStatus(array.taskStatusComment);
            }
        })
        let priority: any;
        let priorityRank = 4;
        if (taskPriority === undefined || parseInt(taskPriority) <= 0) {
            priorityRank = 4;
            priority = '(2) Normal';
        }
        else {
            priorityRank = parseInt(taskPriority);
            if (priorityRank >= 8 && priorityRank <= 10) {
                priority = '(1) High';
            }
            if (priorityRank >= 4 && priorityRank <= 7) {
                priority = '(2) Normal';
            }
            if (priorityRank >= 1 && priorityRank <= 3) {
                priority = '(3) Low';
            }
        }
        let CategoryTitle: any;
        selectedCatId?.map((category: any) => {
            taskCategoryType?.map((item: any) => {
                if (category === item.Id) {
                    if (CategoryTitle === undefined) {
                        CategoryTitle = item.Title + ';';
                    } else {
                        CategoryTitle += item.Title + ';';
                    }
                }
            })

        })

        setPercentCompleteCheck(false);
        let newDueDate: any = new Date(editDate);
        if (editDate == null || editDate == '' || editDate == undefined) {
            newDueDate = null;
        } else {
            if (!isValidDate(newDueDate)) {
                newDueDate = ''
            }
        }
        let web = new Web(props?.item?.siteUrl);
        await web.lists.getById(props?.item?.listId).items.getById(props?.item?.Id).update({
            PercentComplete: taskStatusInNumber/100,
            AssignedToId: { "results": (AssignedToIds != undefined && AssignedToIds.length > 0) ? AssignedToIds : [] },
            ResponsibleTeamId: { "results": (ResponsibleTeamIds != undefined && ResponsibleTeamIds.length > 0) ? ResponsibleTeamIds : [] },
            TeamMembersId: { "results": (TeamMemberIds != undefined && TeamMemberIds.length > 0) ? TeamMemberIds : [] },
            ApproverId: { "results": (ApproverIds != undefined && ApproverIds.length > 0) ? ApproverIds : [] },
            "Priority": priority,
            "Categories": CategoryTitle,
            "PriorityRank": priorityRank,
            SharewebCategoriesId: { "results": selectedCatId },
            DueDate: newDueDate,
            Remark: feedback,
            EstimatedTime: TimeInHours
        })
            .then((res: any) => {

                web.lists.getById(props?.item?.listId).items.select("ID", "Title", "EstimatedTime", "Comments", "Remark", "DueDate", "Approver/Id", "Approver/Title", "ParentTask/Id", "ParentTask/Title", "workingThisWeek", "IsTodaysTask", "AssignedTo/Id", "TaskLevel", "TaskLevel", "OffshoreComments", "AssignedTo/Title", "OffshoreImageUrl", "TaskCategories/Id", "TaskCategories/Title", "Status", "StartDate", "CompletedDate", "TeamMembers/Title", "TeamMembers/Id", "ItemRank", "PercentComplete", "Priority", "PriorityRank", "Created", "Author/Title", "Author/Id", "BasicImageInfo", "ComponentLink", "FeedBack", "ResponsibleTeam/Title", "ResponsibleTeam/Id", "TaskType/Title", "ClientTime", "Component/Id", "Component/Title", "Services/Id", "Services/Title", "Services/ItemType", "Editor/Title", "Modified")
                    .expand("TeamMembers", "Approver", "ParentTask", "AssignedTo", "TaskCategories", "Author", "ResponsibleTeam", "TaskType", "Component", "Services", "Editor")
                    .getById(props?.item?.Id).get().then((task) => {
                        task.AllTeamMember = [];
                        task.siteType = props?.item?.siteType;
                        task.listId = props?.item?.listId;
                        task.siteUrl = props?.item?.siteUrl;
                        task.PercentComplete = (task.PercentComplete * 100).toFixed(0);
                        task.DisplayDueDate =
                            task.DueDate != null
                                ? Moment(task.DueDate).format("DD/MM/YYYY")
                                : "";
                        task.TeamMembersSearch = "";
                        task.ApproverIds = [];
                        task?.Approver?.map((approverUser: any) => {
                            task.ApproverIds.push(approverUser?.Id);
                        })
                        task.AssignedToIds = [];
                        task.AssignedTo = [];
                        task?.AssignedToId?.map((assignedUser: any) => {
                            task.AssignedToIds.push(assignedUser)
                            AllTaskUser?.map((user: any) => {
                                if (user.AssingedToUserId == assignedUser.Id) {
                                    if (user?.Title != undefined) {
                                        task.TeamMembersSearch =
                                            task.TeamMembersSearch + " " + user?.Title;
                                    }
                                }
                            });
                        });
                        task.TeamMembersId = [];
                        task.TaskID = globalCommon.getTaskId(task);
                        task?.TeamMembersId?.map((taskUser: any) => {
                            task.TeamMembersId.push(taskUser);
                            var newuserdata: any = {};
                            AllTaskUser?.map((user: any) => {
                                if (user?.AssingedToUserId == taskUser?.Id) {
                                    if (user?.Title != undefined) {
                                        task.TeamMembersSearch =
                                            task.TeamMembersSearch + " " + user?.Title;
                                    }
                                    newuserdata["useimageurl"] = user?.Item_x0020_Cover?.Url;
                                    newuserdata["Suffix"] = user?.Suffix;
                                    newuserdata["Title"] = user?.Title;
                                    newuserdata["UserId"] = user?.AssingedToUserId;
                                    task["Usertitlename"] = user?.Title;
                                }
                                task.AllTeamMember.push(newuserdata);
                            });
                        });
                        props.item = task;
                        clearEstimations();
                        closeTaskDueDate()
                        props?.callBack(task);
                    });

                setTaskStatusPopup(false);
                setTaskPriorityPopup(false);
                setTeamMembersPopup(false);
                clearEstimations();
                setRemark(false)
                closeTaskDueDate();
            })

    }
    const setWorkingMember = (statusId: any) => {
        AllTaskUser?.map((dataTask: any) => {
            if (dataTask.AssingedToUserId == statusId) {
                let tempArray: any = [];
                tempArray.push(dataTask)
                props.item.TaskAssignedUsers = tempArray;
                let updateUserArray: any = [];
                updateUserArray.push(tempArray[0].AssingedToUser)
                setTaskAssignedTo(updateUserArray);
            }
        })
    }
    const DDComponentCallBack = (dt: any) => {
        setTeamConfig(dt);

        if (dt?.AssignedTo?.length > 0) {
            let tempAssigned: any = [];
            dt.AssignedTo?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempAssigned.push(arrayData.AssingedToUser);
                } else {
                    tempAssigned.push(arrayData);
                }
            });
            setTaskAssignedTo(tempAssigned);

        }
        if (dt?.TeamMemberUsers?.length > 0) {
            let tempTeam: any = [];
            dt.TeamMemberUsers?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempTeam.push(arrayData.AssingedToUser);
                } else {
                    tempTeam.push(arrayData);
                }
            });
            setTaskTeamMembers(tempTeam);

        }
        if (dt?.ResponsibleTeam?.length > 0) {
            let tempResponsible: any = [];
            dt.ResponsibleTeam?.map((arrayData: any) => {
                if (arrayData.AssingedToUser != null) {
                    tempResponsible.push(arrayData.AssingedToUser);
                } else {
                    tempResponsible.push(arrayData);
                }
            });
            setTaskResponsibleTeam(tempResponsible);

        }
    };
    const clearEstimations = () => {
        setTimeInHours(0);
        setTimeInMinutes(0)
        changeTime = 0;
        setUpdateEstimatedTime(false);
    }
    const setWorkingMemberFromTeam = (filterArray: any, filterType: any, StatusID: any) => {
        let tempArray: any = [];
        filterArray.map((TeamItems: any) => {
            AllTaskUser?.map((TaskUserData: any) => {
                if (TeamItems.Id == TaskUserData.AssingedToUserId) {
                    if (TaskUserData.TimeCategory == filterType) {
                        tempArray.push(TaskUserData)
                        props.item.TaskAssignedUsers = tempArray;
                        let updateUserArray1: any = [];
                        updateUserArray1.push(tempArray[0].AssingedToUser)
                        setTaskAssignedTo(updateUserArray1);
                    }
                    else {
                        if (tempArray?.length == 0) {
                            setWorkingMember(143);
                        }
                    }
                }
            })
        })
    }
    const isItemExistID = (item: any, array: any) => {
        let result = false;
        array?.map((arrayItem: any) => {
            if (arrayItem?.Id == item.Id || arrayItem?.ID == item.Id || arrayItem?.Id == item.ID || arrayItem?.ID == item.ID) {
                result = true;
            }
        })
        return result;
    }
    const isItemExistTitle = (item: any, array: any) => {
        let result = false;
        array?.map((arrayItem: any) => {
            if (arrayItem?.Title == item) {
                result = true;
            }
        })
        return result;
    }
    const PercentCompleted = (StatusData: any) => {
        setTaskStatusInNumber(StatusData?.value)
        setUpdateTaskInfo({ ...UpdateTaskInfo, PercentCompleteStatus: StatusData.value })
        setPercentCompleteStatus(StatusData.status);
        setTaskStatus(StatusData.taskStatusComment);
        setPercentCompleteCheck(false);
        if (StatusData.value == 1) {
            let tempArray: any = [];
            if (TaskApproverBackupArray != undefined && TaskApproverBackupArray.length > 0) {
                TaskApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            } else if (TaskCreatorApproverBackupArray != undefined && TaskCreatorApproverBackupArray.length > 0) {
                TaskCreatorApproverBackupArray.map((dataItem: any) => {
                    tempArray.push(dataItem);
                })
            }
            setTaskAssignedTo(tempArray);
            setTaskTeamMembers(tempArray);
            setApproverData(tempArray);
        }
        if (StatusData.value == 2) {
            setInputFieldDisable(true)
        }
        if (StatusData.value != 2) {
            setInputFieldDisable(false)
        }

        if (StatusData.value == 80) {
            // let tempArray: any = [];
            if (props?.item?.TeamMembers != undefined && props?.item?.TeamMembers?.length > 0) {
                setWorkingMemberFromTeam(props?.item?.TeamMembers, "QA", 143);
            } else {
                setWorkingMember(143);
            }
            props.item.IsTodaysTask = false;
            props.item.CompletedDate = undefined;
        }

        if (StatusData.value == 5) {
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else if (EditData.TeamMembers != undefined && EditData.TeamMembers?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.TeamMembers, "Development", 156);

            // } else {
            //     setWorkingMember(156);
            // }
            props.item.CompletedDate = undefined;
            props.item.IsTodaysTask = false;
        }
        if (StatusData.value == 10) {
            props.item.CompletedDate = undefined;
            if (props?.item?.StartDate == undefined) {
                props.item.StartDate = Moment(new Date()).format("MM-DD-YYYY")
            }
            props.item.IsTodaysTask = true;
            // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
            //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
            // } else {
            //     setWorkingMember(156);
            // }
        }
        // if (StatusData.value == 70) {
        // if (EditData.AssignedTo != undefined && EditData.AssignedTo?.length > 0) {
        //     setWorkingMemberFromTeam(EditData.AssignedTo, "Development", 156);
        // } else if (EditData.TeamMembers != undefined && EditData.TeamMembers?.length > 0) {
        //     setWorkingMemberFromTeam(EditData.TeamMembers, "Development", 156);
        // } else {
        //     setWorkingMember(156);
        // }
        // }

        if (StatusData.value == 93 || StatusData.value == 96 || StatusData.value == 99) {
            setWorkingMember(9);
            StatusArray?.map((item: any) => {
                if (StatusData.value == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                }
            })
        }
        if (StatusData.value == 90) {
            let DesignStatus = false;
            if (props?.item?.TaskCategories?.length > 0) {
                DesignStatus = isItemExistTitle('Design', props?.item?.TaskCategories?.length)
            }
            if (props?.item?.siteType == 'Offshore Tasks') {
                setWorkingMember(36);
            }
            else if (DesignStatus) {
                setWorkingMember(172);
            }
            else {
                setWorkingMember(42);
            }
            props.item.CompletedDate = Moment(new Date()).format("MM-DD-YYYY")
            StatusArray?.map((item: any) => {
                if (StatusData.value == item.value) {
                    setPercentCompleteStatus(item.status);
                    setTaskStatus(item.taskStatusComment);
                  
                }
            })
        }
    }
    const closeTaskStatusUpdatePopup = () => {
        setTaskStatusPopup(false)
    }
    const handleCategoryChange = (event: any, CategoryId: any) => {
        if (event.target.checked) {
            setSelectedCatId([...selectedCatId, CategoryId]);
        } else {
            setSelectedCatId(selectedCatId.filter((val: any) => val !== CategoryId));
        }


    }
    const closeTaskDueDate = () => {
        setEditDate(undefined);
        setDueDate({ editPopup: false, editDate: undefined, selectDateName: '' })
    }


    const duedatechange = (item: any) => {
        let dates = new Date();

        if (item === 'Today') {
            setDueDate({ ...dueDate, editDate: dates, selectDateName: item });
            setEditDate(dates)
        }
        if (item === 'Tommorow') {
            setEditDate(dates.setDate(dates.getDate() + 1))
            setDueDate({ ...dueDate, editDate: dates.setDate(dates.getDate() + 1), selectDateName: item });
        }
        if (item === 'This Week') {
            setEditDate( new Date(dates.setDate(dates.getDate() - dates.getDay() + 7)))
            setDueDate({ ...dueDate, editDate: new Date(dates.setDate(dates.getDate() - dates.getDay() + 7)), selectDateName: item });
        }
        if (item === 'Next Week') {
           
            let nextweek = new Date(dates.setDate(dates.getDate() - (dates.getDay() - 1) + 6));
            setEditDate(nextweek.setDate(nextweek.getDate() - (nextweek.getDay() - 1) + 6))
            setDueDate({ ...dueDate, editDate: nextweek.setDate(nextweek.getDate() - (nextweek.getDay() - 1) + 6), selectDateName: item });
        }
        if (item === 'This Month') {
            
            let lastDay = new Date(dates.getFullYear(), dates.getMonth() + 1, 0);;
            setEditDate(lastDay)
            setDueDate({ ...dueDate, editDate: lastDay, selectDateName: item });
        }
    }
    const changeTimes = (val: any, time: any, type: any) => {
        if (val === '15') {
            changeTime = Number(TimeInMinutes)
            changeTime = changeTime + 15
            // changeTime = changeTime > 0
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }
            setTimeInMinutes(changeTime)
        }
        if (val === '60') {
            changeTime = Number(TimeInMinutes)
            changeTime = changeTime + 60
            // changeTime = changeTime > 0
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }
            setTimeInMinutes(changeTime)
        }
    }
    const changeTimesDec = (items: any) => {

        if (items === '15') {
            changeTime = Number(TimeInMinutes)
            changeTime = changeTime - 15
            setTimeInMinutes(changeTime)
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;

                setTimeInHours(TimeInHour.toFixed(2))
            }

        }
        if (items === '60') {
            changeTime = Number(TimeInMinutes)
            changeTime = changeTime - 60
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;

                setTimeInHours(TimeInHour.toFixed(2))
            }
            setTimeInMinutes(changeTime)


        }

    }
    const changeTimeFunction = (e: any, type: any) => {
        if (type == 'Add') {
            changeTime = e.target.value
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))
            }
            setTimeInMinutes(changeTime)
        }
        if (type == 'Edit') {
            if (e.target.value > 0) {
                changeTime = e.target.value
                if (changeTime != undefined) {
                    var TimeInHour: any = changeTime / 60;
                    setTimeInHours(TimeInHour.toFixed(2))
                }
                setTimeInMinutes(changeTime)
            }
            else {
                setTimeInMinutes(undefined)
                setTimeInHours(0)
            }
        }
    }

    const onRenderCustomHeader = (columnName: any) => {
        return (
            <div className={ServicesTaskCheck ? "d-flex full-width pb-1 serviepannelgreena" : "d-flex full-width pb-1"}>
                <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
                    <img className="imgWid29 pe-1 mb-1 " src={props?.item?.SiteIcon} />
                    <span className="siteColor">
                        {`Update ${columnName} - ${props?.item?.TaskID} ${props?.item?.Title}`}
                    </span>
                </div>
            </div>
        );
    };






    return (
        <>
            {
                props?.columnName == 'Team' ?
                    <>

                        <span style={{ display: "flex", width: "100%", height: "100%" }} onClick={() => setTeamMembersPopup(true)} className='hreflink'>&nbsp;
                            <span>
                                <ShowTaskTeamMembers props={props?.item} TaskUsers={props?.TaskUsers} />
                            </span>
                        </span>
                    </>
                    : ''
            }
            {
                props?.columnName == 'Priority' ?
                    <>
                        <span className={ServicesTaskCheck && props?.pageName !== 'ProjectOverView' ? "serviepannelgreena hreflink" : "hreflink"} style={{ display: "flex", width: "100%", height: "100%" }} onClick={() => setTaskPriorityPopup(true)} >
                            &nbsp;
                            {props?.item?.PriorityRank}
                            {
                                props?.item?.TaskCategories?.map((category: any) => {
                                    if (category?.Title == 'Immediate') {
                                        return (
                                            <a title="Immediate">
                                                <span className=" svg__iconbox svg__icon--alert " ></span>
                                                {/* <img className=' imgAuthor' src={require("../../../Assets/ICON/urgent.svg")} />  */}
                                            </a>
                                        )
                                    }
                                    if (category?.Title == 'Bottleneck') {
                                        return (
                                            <a title="Bottleneck">
                                                {/* <img className=' imgAuthor' src={require("../../../Assets/ICON/bottleneck.svg")} />  */}
                                                <span className=" svg__iconbox svg__icon--bottleneck" ></span>
                                            </a>
                                        )
                                    }
                                    if (category?.Title == 'Favorite') {
                                        return (
                                            <a title="Favorite">
                                                <span className=" svg__iconbox svg__icon--Star" ></span>
                                                {/* <img className=' imgAuthor' src={require("../../../Assets/ICON/favouriteselected.svg")} />  */}
                                            </a>
                                        )
                                    }
                                })
                            }
                        </span>
                    </>
                    : ''
            }
            {props?.columnName == 'Remark' ?
                <>  <span style={{ display: "block", width: "100%", height: "100%" }} className={ServicesTaskCheck && props?.pageName !== 'ProjectOverView' ? "serviepannelgreena align-content-center d-flex gap-1" : "align-content-center d-flex gap-1"} onClick={() => setRemark(true)}>
                    &nbsp;{props?.item?.Remark}</span></>
                : ""
            }
            {props?.columnName == 'EstimatedTime' ?
                <>  <span style={{ display: "block", width: "100%", height: "100%" }} className={ServicesTaskCheck && props?.pageName !== 'ProjectOverView' ? "serviepannelgreena align-content-center d-flex gap-1" : "align-content-center d-flex gap-1"} onClick={() => setUpdateEstimatedTime(true)}>
                    &nbsp;{props?.item?.EstimatedTime}</span></>
                : ""
            }

            {
                props?.columnName == 'PercentComplete' ?
                    <>

                        <span style={{ display: "block", width: "100%", height: "100%" }} className={ServicesTaskCheck ? "serviepannelgreena align-content-center d-flex gap-1" : "align-content-center d-flex gap-1"} onClick={() => openTaskStatusUpdatePopup()}>
                            &nbsp;
                            {/* <span className="d-inline-block" data-bs-toggle="popover" data-bs-trigger="hover focus" data-bs-content="Disabled popover">
                                {props.item.PercentComplete}
                            </span> */}
                            <span title={getPercentCompleteTitle(props?.item?.PercentComplete)}>{props?.item?.PercentComplete} </span>
                            {
                                props?.item?.IsTodaysTask ? <>
                                    {
                                        props?.item?.AssignedTo?.map((AssignedUser: any) => {
                                            return (
                                                AllTaskUser?.map((user: any) => {
                                                    if (AssignedUser.Id == user.AssingedToUserId) {
                                                        return (
                                                            <a target="_blank"
                                                                data-interception="off"
                                                                title={user.Title}
                                                            >
                                                                {user?.Item_x0020_Cover?.Url != undefined ?
                                                                    <img className="workmember ms-1" title={user?.Title} src={user?.Item_x0020_Cover?.Url}></img> :
                                                                    <span title={user?.Title} className="svg__iconbox svg__icon--defaultUser grey ms-1 "></span>}

                                                            </a>
                                                        )
                                                    }

                                                })
                                            )
                                        })
                                    }
                                </> : ''
                            }
                            {/* <div className="popover__wrapper inlineEdit me-1" data-bs-toggle="tooltip" data-bs-placement="auto">
                            {props.item.PercentComplete}
                                <div className="popover__content">
                                    {
                                        (props.item.PercentComplete > 0 && props.item.PercentComplete <= 4) ?
                                            <a className='svg__iconbox svg__icon--Ellipse' title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                            </a> : (props.item.PercentComplete == 5) ?
                                                <a className='svg__iconbox svg__icon--Acknowledged' title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                                </a> : (props.item.PercentComplete >= 10 && props.item.PercentComplete <= 70) ?
                                                    <a className='svg__iconbox svg__icon--halfellipse' title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                                    </a> : (props.item.PercentComplete >= 80 && props.item.PercentComplete <= 90) ?
                                                        <a className='svg__iconbox svg__icon--UnderReview' title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                                        </a> : (props.item.PercentComplete > 90) ?
                                                            <a className='svg__iconbox svg__icon--Completed' title={getPercentCompleteTitle(props?.item?.PercentComplete)}>
                                                            </a> : ''

                                    }
                                   
                                </div>
                            </div> */}

                            {/* {props?.item?.Categories?.includes('Immediate') ?
        <a style={{ marginRight: '5px' }} title="Immediate"><img src={require("../../../Assets/ICON/alert.svg")} /> </a> : " "} */}
                        </span>
                    </>
                    : ''
            }


            {/* Panel to edit due-date */}

            <Panel
                onRenderHeader={() => onRenderCustomHeader('Due Date')}
                isOpen={dueDate.editPopup}
                customWidth="500px"
                onDismiss={closeTaskDueDate}
                isBlocking={dueDate.editPopup}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >

                    <div className="modal-body mt-3 mb-3 d-flex flex-column">
                        <input className="form-check-input p-3 w-100"
                            type='date'
                            value={editDate != null ? Moment(new Date(editDate)).format('YYYY-MM-DD') : ''}
                            onChange={(e: any) => setEditDate(e.target.value)} />

                        <div className='d-flex flex-column mt-2 mb-2'>
                            <span className='SpfxCheckRadio'>
                                <input className='radio' type="radio" value="Male" name="date" checked={dueDate.selectDateName == 'Today'} onClick={() => duedatechange('Today')} /> Today</span>
                            <span className='SpfxCheckRadio'>
                                <input className='radio' type="radio" value="Female" name="date" checked={dueDate.selectDateName == 'Tommorow'} onClick={() => duedatechange('Tommorow')} /> Tommorow
                            </span>
                            <span className='SpfxCheckRadio'>
                                <input className='radio' type="radio" value="Other" name="date" checked={dueDate.selectDateName == 'This Week'} onClick={() => duedatechange('This Week')} /> This Week
                            </span>
                            <span className='SpfxCheckRadio'>
                                <input className='radio' type="radio" value="Female" name="date" checked={dueDate.selectDateName == 'Next Week'} onClick={() => duedatechange('Next Week')} /> Next Week
                            </span>
                            <span className='SpfxCheckRadio'>
                                <input className='radio' type="radio" value="Female" name="date" checked={dueDate.selectDateName == 'This Month'} onClick={() => duedatechange('This Month')} /> This Month
                            </span>

                        </div>
                    </div>
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={UpdateTaskStatus}>
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
            <Panel
                onRenderHeader={() => onRenderCustomHeader('Estimated Time')}
                isOpen={UpdateEstimatedTime}
                customWidth="500px"
                onDismiss={() => clearEstimations()}
                isBlocking={UpdateEstimatedTime}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >

                    <div className="row">
                        <div className="col-sm-6 pe-0">
                            <label ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                            <input type="text"
                                ng-model="TimeSpentInMinutes" className="form-control"
                                value={TimeInMinutes}
                                onChange={(e) => changeTimeFunction(e, 'Add')} />

                        </div>
                        <div className="col-sm-6 ps-0">
                            <label></label>
                            <input className="form-control bg-e9" type="text" value={`${TimeInHours > 0 ? TimeInHours : 0}  Hours`}
                            />
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-sm-12 Time-control-buttons">
                            <div className="pe-0 Quaterly-Time">
                                <label
                                    className="full_width"></label>
                                <button className="btn btn-primary"
                                    title="Decrease by 15 Min" disabled={TimeInMinutes <= 0 ? true : false}
                                    onClick={() => changeTimesDec('15')}>
                                    <i className="fa fa-minus"
                                        aria-hidden="true"></i>

                                </button>
                                <span> 15 min </span>
                                <button className="btn btn-primary"
                                    title="Increase by 15 Min"
                                    onClick={() => changeTimes('15', 'add', 'AddNewStructure')}>
                                    <i className="fa fa-plus"
                                        aria-hidden="true"></i>

                                </button>
                            </div>
                            <div className="pe-0 Full-Time">
                                <label
                                    className="full_width"></label>
                                <button className="btn btn-primary"
                                    title="Decrease by 60 Min" disabled={TimeInMinutes <= 0 ? true : false}
                                    onClick={() => changeTimesDec('60')}>
                                    <i className="fa fa-minus"
                                        aria-hidden="true"></i>

                                </button>
                                <span> 60 min </span>
                                <button className="btn btn-primary"
                                    title="Increase by 60 Min"
                                    onClick={() => changeTimes('60', 'add', 'AddNewStructure')}>
                                    <i className="fa fa-plus"
                                        aria-hidden="true"></i>

                                </button>
                            </div>
                        </div>
                    </div>
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3 mt-4" onClick={UpdateTaskStatus}>
                            Update
                        </button>
                    </footer>
                </div>
            </Panel>
            {props?.columnName == 'DueDate' ? <span className={ServicesTaskCheck && props.pageName !== 'ProjectOverView' ? "serviepannelgreena hreflink" : "hreflink"} style={{ display: "block", width: "100%", height: "100%" }} onClick={() =>{ setDueDate({ ...dueDate, editPopup: true }); setEditDate(props?.item?.DueDate != undefined ? props?.item?.DueDate : null)}}> &nbsp;{props?.item?.DisplayDueDate} </span> : ''}


            {/* Pannel To select Status */}
            <Panel
                onRenderHeader={() => onRenderCustomHeader('Status')}
                isOpen={TaskStatusPopup}
                customWidth="500px"
                onDismiss={closeTaskStatusUpdatePopup}
                isBlocking={TaskStatusPopup}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena" : ""} >
                    <div className="modal-body">
                        <table className="table table-hover" style={{ marginBottom: "0rem !important" }}>
                            <tbody>
                                {StatusArray?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="SpfxCheckRadio">
                                                    <input className="radio"
                                                        type="radio" checked={taskStatusInNumber == item?.value}
                                                        onClick={() => PercentCompleted(item)} />
                                                    <label className="form-check-label">{item?.status}</label>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => UpdateTaskStatus()}>
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
            {/* Pannel To select Priority */}
            <Panel
                onRenderHeader={() => onRenderCustomHeader('Priority')}
                isOpen={TaskPriorityPopup}
                customWidth="500px"
                onDismiss={() => setTaskPriorityPopup(false)}
                isBlocking={TaskPriorityPopup}
            >
                <div className={ServicesTaskCheck ? "serviepannelgreena inline-update-priority" : "inline-update-priority"} >
                    <div className="modal-body" >
                        <table className="table table-hover" style={{ marginBottom: "0rem !important" }}>
                            <tbody>
                                {priorityRank?.map((item: any, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="SpfxCheckRadio">
                                                    <input className="radio"
                                                        type="radio" checked={taskPriority == item.Title}
                                                        onClick={() => setTaskPriority(item.Title)} />
                                                    <label className="form-check-label mx-2">{item.Title}</label>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    {impTaskCategoryType?.map((option) => (
                        <div className={ServicesTaskCheck ? "serviepannelgreena d-flex" : "d-flex"} key={option.Id}>
                            <input
                                type="checkbox"
                                className='form-check-input'
                                id={option.Id}
                                value={option.Id}
                                checked={selectedCatId?.includes(option.Id)}
                                onChange={(event) => handleCategoryChange(event, option.Id)}
                            />
                            <a title={option.Title}>
                                {option.Title == 'Immediate' ? <span className="workmember svg__iconbox svg__icon--alert " ></span> : ''}
                                {option.Title == 'Bottleneck' ? <span className="workmember svg__iconbox svg__icon--bottleneck " ></span> : ''}
                                {option.Title == 'Favorite' ? <span className="workmember svg__iconbox svg__icon--Star " ></span> : ''}
                            </a>
                            <label htmlFor={option.Id} className='ms-2'>{option.Title}</label>
                        </div>
                    ))}
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => UpdateTaskStatus()}>
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
            <Panel
                onRenderHeader={() => onRenderCustomHeader('Team Members')}
                isOpen={teamMembersPopup}
                onDismiss={() => setTeamMembersPopup(false)}
                isBlocking={teamMembersPopup}
                type={PanelType.medium}
            >
                <div>
                    <TeamConfigurationCard AllListId={props?.AllListId}
                        ItemInfo={props?.item} parentCallback={DDComponentCallBack} ></TeamConfigurationCard>
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => UpdateTaskStatus()}>
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
            <Panel
                onRenderHeader={() => onRenderCustomHeader('Remarks')}
                isOpen={remark}
                customWidth="500px"
                onDismiss={() => setRemark(false)}
                isBlocking={remark}
            >
                <div>
                    <textarea value={feedback} className='full-width' onChange={(e: any) => setFeedback(e.target.value)} />
                    <footer className="float-end">
                        <button type="button" className="btn btn-primary px-3" onClick={() => UpdateTaskStatus()}>
                            Save
                        </button>
                    </footer>
                </div>
            </Panel>
        </>
    )
}
export default inlineEditingcolumns