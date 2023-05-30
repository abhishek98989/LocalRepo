
import * as React from 'react';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { Web } from "sp-pnp-js";
import * as $ from 'jquery';
import { arraysEqual, Modal, Panel, PanelType } from 'office-ui-fabric-react';
import * as Moment from 'moment';
import pnp, { PermissionKind } from "sp-pnp-js";
import { parseISO, format } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import * as moment from "moment-timezone";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from '../../globalComponents/Tooltip'
import * as globalCommon from '../globalCommon'
var AllTimeSpentDetails: any = [];
var CurntUserId = ''
var changeTime: any = 0;
var ParentId: any = ''
var Category: any = '';
var NewCategoryId: any = ''
var Eyd = ''
var changeEdited = '';
var Categoryy = '';
var CategoryyID: any = ''
var TaskCate: any = []
var AllUsers: any = [];
var isShowCate: any = ''
var change: any = new Date()
function TimeEntryPopup(item: any) {
    CurntUserId = item.Context.pageContext._legacyPageContext.userId
    const [AllTimeSheetDataNew, setTimeSheet] = React.useState([])
    const [date, setDate] = React.useState(undefined);
    const [showCat, setshowCat] = React.useState('')
    const [modalTimeIsOpen, setTimeModalIsOpen] = React.useState(false);
    // const [AllMetadata, setMetadata] = React.useState([]);
    const [EditTaskItemitle, setEditItem] = React.useState('');
    const [disabled, setDisabled] = React.useState(false);
    const [collapseItem, setcollapseItem] = React.useState(true);
    const [open, setOpen] = React.useState(false);
    const [search, setSearch]: [string, (search: string) => void] = React.useState("");
    const [TaskStatuspopup, setTaskStatuspopup] = React.useState(false);
    const [Editcategory, setEditcategory] = React.useState(false);
    const [TaskStatuspopup2, setTaskStatuspopup2] = React.useState(false);
    const [CopyTaskpopup, setCopyTaskpopup] = React.useState(false);
    const [AddTaskTimepopup, setAddTaskTimepopup] = React.useState(false);
    const [TimeSheet, setTimeSheets] = React.useState([])
    const [changeDates, setchangeDates] = React.useState(Moment().format())
    //const [changeDates, setchangeDates] = React.useState(new Date())
    const [changeTimeAdd, setchangeTimeAdd] = React.useState()
    const [AdditionalTime, setAdditionalTime] = React.useState([])
    const [count, setCount] = React.useState(1)
    const [month, setMonth] = React.useState(1)
    const [counts, setCounts] = React.useState(1)
    const [months, setMonths] = React.useState(1)
    const [saveEditTaskTime, setsaveEditTaskTime] = React.useState([])
    const [demoState, setDemoState] = React.useState()
    const [postData, setPostData] = React.useState({ Title: '', TaskDate: '', Description: '', TaskTime: '' })
    const [newData, setNewData] = React.useState({ Title: '', TaskDate: '', Description: '', TimeSpentInMinute: '', TimeSpentInHours: '', TaskTime: '' })
    const [add, setAdd] = React.useState({ Title: '', TaskDate: '', Description: '', TaskTime: '' })
    const [saveEditTaskTimeChild, setsaveEditTaskTimeChild] = React.useState([])
    const [saveCopyTaskTimeChild, setsaveCopyTaskTimeChild] = React.useState([])
    const [saveCopyTaskTime, setsaveCopyTaskTime] = React.useState([])
    const [AllUser, setAllUser] = React.useState([])
    const [checkCategories, setcheckCategories] = React.useState()
    const [updateData, setupdateData] = React.useState(0)
    const [updateData2, setupdateData2] = React.useState(0)
    const [editeddata, setediteddata] = React.useState('')
    const [editTime, seteditTime] = React.useState('')
    const [year, setYear] = React.useState(1)
    const [years, setYears] = React.useState(1)
    const [TimeInHours, setTimeInHours] = React.useState(0)
    const [TimeInMinutes, setTimeInMinutes] = React.useState(0)
    const [categoryData, setCategoryData] = React.useState([])
    var smartTermName = "Task" + item.props.siteType;

    const GetTaskUsers = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let taskUsers = [];
        taskUsers = await web.lists
            .getByTitle('Task Users')
            .items
            .top(4999)
            .get();
        AllUsers = taskUsers;
        EditData(item.props);
        //console.log(this.taskUsers);

    }
    // pnp.sp.web.currentUser.get().then(result => {
    //     CurntUserId = result.Id;
    //     console.log(CurntUserId)

    // });
    const onRenderCustomHeaderAddTaskTime = () => {
        return (
          <>
    
            <div className='ps-4' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
            Add Task Time
            </div>
            <Tooltip ComponentId='1753' />
          </>
        );
      };
      const onRenderCustomHeaderEditTaskTime = () => {
        return (
          <>
    
            <div className='ps-4' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
            Edit Task Time
            </div>
            <Tooltip ComponentId='1753' />
          </>
        );
      };
      const onRenderCustomHeaderCopyTaskTime = () => {
        return (
          <>
    
            <div className='ps-4' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
            Copy Task Time
            </div>
            <Tooltip ComponentId='1753' />
          </>
        );
      };
      const onRenderCustomHeaderEditCategory= () => {
        return (
          <>
    
            <div className='ps-4' style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600" }}>
            Edit Category
            </div>
            <Tooltip ComponentId='1753' />
          </>
        );
      };

    const changeDate = (val: any, Type: any) => {


        if (val === 'Date') {
            setCount(count + 1)
            var dateeee = change != undefined && change != '' ? change : ''
            change = (Moment(dateeee).add(1, 'days').format())
            setchangeDates(change)

            if (Type == 'EditTime') {
                changeEdited = (Moment(editeddata).add(1, 'days').format())
                var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy")
                setediteddata(editaskk)
            }



        }
        if (val === 'month') {
            setMonth(month + 1)
            change = (Moment(change).add(1, 'months').format())
            setchangeDates(change)

            if (Type == 'EditTime') {
                changeEdited = (Moment(editeddata).add(1, 'months').format())
                var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy")
                setediteddata(editaskk)

            }
        }


        if (val === 'Year') {
            setYear(year + 1)
            change = (Moment(change).add(1, 'years').format())
            setchangeDates(change)

            if (Type == 'EditTime') {
                changeEdited = (Moment(editeddata).add(1, 'years').format())
                var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy")
                setediteddata(editaskk)

            }
        }


    }
    var showProgressBar = () => {


        $(' #SpfxProgressbar').show();
    }
    var showProgressHide = () => {

        $(' #SpfxProgressbar').hide();
    }
    const changeDateDec = (val: any, Type: any) => {


        if (val === 'Date') {
            // setCount(count - 1)
            var dateeee = change != undefined && change != '' ? change : ''
            change = (Moment(dateeee).add(-1, 'days').format())
            setchangeDates(change)

            if (Type == 'EditTime') {
                changeEdited = (Moment(editeddata).add(-1, 'days').format())
                var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy")
                setediteddata(editaskk)
            }
        }
        if (val === 'month') {
            // setMonth(month - 1)
            change = (Moment(change).add(-1, 'months').format())
            setchangeDates(change)

            if (Type == 'EditTime') {
                changeEdited = (Moment(editeddata).add(-1, 'months').format())
                var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy")
                setediteddata(editaskk)

            }
        }
        if (val === 'year') {
            //setYear(year - 1)
            change = (Moment(change).add(-1, 'years').format())
            setchangeDates(change)


            if (Type == 'EditTime') {
                changeEdited = (Moment(editeddata).add(-1, 'years').format())
                var editaskk = Moment(changeEdited).format("ddd, DD MMM yyyy")
                setediteddata(editaskk)

            }
        }
    }
    var newTime: any = ''
    const changeTimesEdit = (val: any, time: any, type: any) => {
        changeTime = Number(changeTime)
        if (type === 'EditTask' && val === '15') {
            if (TimeInMinutes != undefined) {
                time.TaskTimeInMin = Number(time.TaskTimeInMin)
                if (changeTime == 0) {
                    changeTime = time.TaskTimeInMin + 15
                }
                else {
                    changeTime = changeTime + 15
                }

                if (changeTime != undefined) {
                    var TimeInHour: any = changeTime / 60;
                    setTimeInHours(TimeInHour.toFixed(2))

                }
                setTimeInMinutes(changeTime)
            }
            if (TimeInMinutes == undefined) {
                changeTime = 0
                if (changeTime == 0) {
                    changeTime = changeTime + 15
                }
                else {
                    changeTime = changeTime + 15
                }

                if (changeTime != undefined) {
                    var TimeInHour: any = changeTime / 60;
                    setTimeInHours(TimeInHour.toFixed(2))

                }
                setTimeInMinutes(changeTime)
            }


        }
        if (type === 'EditTask' && val === '60') {
            changeTime = Number(changeTime)
            if (TimeInMinutes != undefined) {
                time.TaskTimeInMin = Number(time.TaskTimeInMin)
                if (changeTime == 0) {
                    changeTime = time.TaskTimeInMin + 60
                }
                else {
                    changeTime = changeTime + 60
                }

                if (changeTime != undefined) {
                    var TimeInHour: any = changeTime / 60;
                    setTimeInHours(TimeInHour.toFixed(2))

                }
                setTimeInMinutes(changeTime)
            }
            if (TimeInMinutes == undefined) {
                changeTime = 0
                if (changeTime == 0) {
                    changeTime = changeTime + 60
                }
                else {
                    changeTime = changeTime + 60
                }

                if (changeTime != undefined) {
                    var TimeInHour: any = changeTime / 60;
                    setTimeInHours(TimeInHour.toFixed(2))

                }
                setTimeInMinutes(changeTime)
            }
        }


    }
    const changeTimesDecEdit = (val: any, time: any, type: any) => {

        if (type === 'EditTask' && val === '15') {
            changeTime = Number(changeTime)
            if (changeTime == 0) {
                changeTime = time.TaskTimeInMin - 15
            }
            else {
                changeTime = changeTime - 15
            }

            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))

            }
            setTimeInMinutes(changeTime)

        }
        if (type === 'EditTask' && val === '60') {
            changeTime = Number(changeTime)
            if (changeTime == 0) {
                changeTime = time.TaskTimeInMin - 60
            }
            else {
                changeTime = changeTime - 60
            }

            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;
                setTimeInHours(TimeInHour.toFixed(2))

            }
            setTimeInMinutes(changeTime)
        }
    }


    const changeTimes = (val: any, time: any, type: any) => {

        if (val === '15') {
            changeTime = Number(changeTime)

            changeTime = changeTime + 15
            // changeTime = changeTime > 0

            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;

                setTimeInHours(TimeInHour.toFixed(2))

            }

            setTimeInMinutes(changeTime)


        }
        // if(type==='EditTask' && val === '15'){
        //     if(newTime == '' && newTime == undefined){
        //      newTime = time.TaskTimeInMin + 0.15
        //      setTimeInMinutes(newTime)
        //     }
        //     else{
        //         newTime = newTime + 0.15
        //      setTimeInMinutes(newTime)
        //     }

        // }

        if (val === '60') {

            changeTime = Number(changeTime)
            changeTime = changeTime + 60
            // changeTime = changeTime > 0

            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;

                setTimeInHours(TimeInHour.toFixed(2))

            }


            setTimeInMinutes(changeTime)

        }
        // if(newTime == '' && newTime == undefined){
        //     newTime = time.TaskTimeInMin + 1.00
        //     setTimeInMinutes(newTime)
        //    }
        //    else{
        //        newTime = newTime + 1.00
        //     setTimeInMinutes(newTime)
        //    }

    }
    const openTaskStatusUpdatePoup = () => {
        AllUsers.forEach((val: any) => {
            TimeSheet.forEach((time: any) => {
                if (val.AssingedToUserId == CurntUserId) {
                    isShowCate = val.TimeCategory;
                    if (val.TimeCategory == time.Title) {
                        setshowCat(time.Title)
                        setcheckCategories(time.Title)
                    }

                }
            })
        })
        setTaskStatuspopup(true)
    }
    const Editcategorypopup = (child: any) => {
        var array: any = []
        Categoryy = child.Category.Title
        CategoryyID = child.ID
        array.push(child)
        setCategoryData(array)
        setEditcategory(true)
    }

    const closeEditcategorypopup = (child: any) => {
        setNewData(undefined)
        setEditcategory(false)
    }

    const openCopyTaskpopup = (childitem: any, childinew: any) => {
        setCopyTaskpopup(true)
        dateValue = childinew.TaskDate.split("/");
        dp = dateValue[1] + "/" + dateValue[0] + "/" + dateValue[2];
        Dateet = new Date(dp)
        Eyd = Moment(Dateet).format("ddd, DD MMM yyyy")
        setediteddata(Eyd)
        var Array: any = []
        var Childitem: any = []
        Array.push(childitem)
        Childitem.push(childinew)
        setsaveCopyTaskTime(Array)
        setsaveCopyTaskTimeChild(Childitem)
        console.log(item)

    }

    const openAddTasktimepopup = (val: any) => {
        ParentId = val.Id;
        val.AdditionalTime.map(() => {

        })

        var CategoryTitle = val.Title;
        setAddTaskTimepopup(true)
    }
    let dateValue = ''
    var dp = ''
    var Dateet: any = ''
    const openTaskStatusUpdatePoup2 = (childitem: any, childinew: any) => {

        dateValue = childinew.TaskDate.split("/");
        dp = dateValue[1] + "/" + dateValue[0] + "/" + dateValue[2];
        Dateet = new Date(dp)
        Eyd = Moment(Dateet).format("ddd, DD MMM yyyy")
        setediteddata(Eyd)
        var Array: any = []
        var Childitem: any = []
        setTaskStatuspopup2(true)
        Array.push(childitem)
        setNewData(undefined)
        Childitem.push(childinew)
        setsaveEditTaskTime(Array)
        setsaveEditTaskTimeChild(Childitem)
        console.log(item)

    }
    const closeTaskStatusUpdatePoup = () => {
        setcheckCategories(undefined)
        setTaskStatuspopup(false)
        setTimeInHours(0)
        setNewData(undefined)
        setTimeInMinutes(0)
        setchangeDates(undefined)
        setediteddata(undefined)
        changeTime = 0;
        setCount(1)
        change = Moment().format()
        setMonth(1)
        setYear(1)
        setchangeDates(Moment().format(''))
    }
    const closeCopyTaskpopup = () => {
        setCopyTaskpopup(false)
        setTimeInMinutes(0)
        setTimeInHours(0)
        setediteddata(undefined)
        setNewData(undefined)
        setCount(1)
        change = Moment().format()
        setMonth(1)
        setYear(1)
        changeTime = 0;
        setchangeDates(Moment().format(''))
        setchangeDates(undefined)
        setPostData(undefined)
    }
    const closeAddTaskTimepopup = () => {
        setTimeInMinutes(0)
        setAddTaskTimepopup(false)
        setTimeInHours(0)
        setNewData(undefined)
        setediteddata(undefined)
        setCount(1)
        change = Moment().format()
        setMonth(1)
        setYear(1)
        changeTime = 0;
        setchangeDates(Moment().format(''))
        setchangeDates(undefined)
        setPostData(undefined)
    }
    const closeTaskStatusUpdatePoup2 = () => {
        setTaskStatuspopup2(false)
        setTaskStatuspopup(false)
        setediteddata(undefined)
        setNewData(undefined)
        setTimeInHours(0)
        setchangeDates(undefined)
        change = Moment().format()
        setTimeInMinutes(0)
        setCount(1)
        setMonth(1)
        setYear(1)
        changeTime = 0;
        setchangeDates(Moment().format())
        setediteddata(undefined)
    }
    const changeTimesDec = (items: any) => {

        if (items === '15') {
            changeTime = Number(changeTime)
            changeTime = changeTime - 15
            setTimeInMinutes(changeTime)
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;

                setTimeInHours(TimeInHour.toFixed(2))
            }

        }
        if (items === '60') {
            changeTime = Number(changeTime)
            changeTime = changeTime - 60
            if (changeTime != undefined) {
                var TimeInHour: any = changeTime / 60;

                setTimeInHours(TimeInHour.toFixed(2))
            }
            // if(type=='EditTask'){
            //     var changeTimeEdi = time - 1
            //     setTimeInHours(changeTimeEdi)

            //  }
            setTimeInMinutes(changeTime)


        }

    }


    const GetTimeSheet = async () => {
        var TimeSheets: any = []

        const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        const res = await web.lists.getById('01A34938-8C7E-4EA6-A003-CEE649E8C67A').items
            .select("Id,Title,TaxType").top(4999).get();
        console.log(res)
        // res.map((item: any) => {
        //     if (item.TaxType === "TimesheetCategories") {
        //         TimeSheets.push(item)

        //     }

        // })
        //  TimeSheets.map((val: any,index:any) => {
        //     TimeSheets.map((ite: any,index:any) => {

        //         if (val.Title == ite.Title) {
        //             TimeSheets.splice(index, 1)
        //         }

        //     })
        //     })
        TimeSheets.push({ "TaxType": "TimesheetCategories", "Title": "Design", "Id": 300, "isShow": false }, { "TaxType": "TimesheetCategories", "Title": "Development", "Id": 299, "isShow": false }, { "TaxType": "TimesheetCategories", "Title": "Investigation", "Id": 296, "isShow": false },
            { "TaxType": "TimesheetCategories", "Title": "QA", "Id": 301, "isShow": false }, { "TaxType": "TimesheetCategories", "Title": "Support", "Id": 310, "isShow": false }, { "TaxType": "TimesheetCategories", "Title": "Verification", "Id": 297, "isShow": false }, { "TaxType": "TimesheetCategories", "Title": "Coordination", "Id": 298, "isShow": false },
            { "TaxType": "TimesheetCategories", "Title": "Implementation", "Id": 302, "isShow": false }, { "TaxType": "TimesheetCategories", "Title": "Conception", "Id": 335, "isShow": false }, { "TaxType": "TimesheetCategories", "Title": "Preparation", "Id": 315, "isShow": false });
        setTimeSheets(TimeSheets)

    }
    const selectCategories = (e: any, Title: any) => {
        const target = e.target;
        if (target.checked) {
            setcheckCategories(Title);
            setshowCat(Title)
        }

    }
    React.useEffect(() => {
        GetTimeSheet();
        GetSmartMetadata();
    }, [updateData, updateData2])

    // React.useEffect(() => {
    //     changeDate((e: any) => e);

    // }, [changeDates,TaskCate])

    var AllMetadata: [] = [];
    const GetSmartMetadata = async () => {
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        let MetaData = [];
        MetaData = await web.lists
            .getByTitle('SmartMetadata')
            .items
            .top(4999)
            .get();
        AllMetadata = MetaData;
        await GetTaskUsers();

    }

    var TaskTimeSheetCategoriesGrouping: any = [];
    var TaskTimeSheetCategories: any = [];

    var isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        $.each(arr, function (index: any, items: any) {
            if (items.ID === Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }
    const checkCategory = function (item: any, category: any) {
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, categoryTitle: any) {
            if (categoryTitle.Id === category) {
                // item.isShow = true;
                if (categoryTitle.Childs.length === 0) {
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
        TaskCate = AllTimeSpentDetails


        AllTimeSpentDetails.forEach((items: any) => {
            if (items.TimesheetTitle.Id === undefined) {
                items.Expanded = true;
                items.isAvailableToDelete = false;
                AllTimeSpentDetails.forEach((val: any) => {
                    if (val.TimesheetTitle.Id != undefined && val.TimesheetTitle.Id === items.Id) {
                        val.isShifted = true;
                        val.show = true;
                        val.AdditionalTime.forEach((value: any) => {
                            value.ParentID = val.Id;
                            value.siteListName = val.__metadata.type;
                            value.MainParentId = items.Id;
                            value.AuthorTitle = val.Author.Title;
                            value.EditorTitle = val.Editor.Title;
                            //value.AuthorImage = val.AuthorImage
                            value.show = true;
                            // value.TaskDate = true;
                            if (val.Created != undefined)
                                var date = new Date(val.Created)
                            value.Created = Moment(date).format('DD/MM/YYYY');
                            if (val.Modified != undefined)
                                value.Modified = Moment(val.Modified).format('DD/MM/YYYY');


                            if (!isItemExists(items.AdditionalTime, value.ID))
                                items.AdditionalTime.push(value);


                        })
                        // $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
                        //     if (items.Id == NewCategoryId) {
                        //         items.Childs.push(val);
                        //     }
                        // });
                        //  setAdditionalTime(item.AdditionalTime)


                    }
                })
            }
        })

        AllTimeSpentDetails = $.grep(AllTimeSpentDetails, function (type: any) { return type.isShifted === false });
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            if (items.AdditionalTime.length === 0) {
                items.isAvailableToDelete = true;
            }
            if (items.AdditionalTime != undefined && items.AdditionalTime.length > 0) {
                $.each(items.AdditionalTime, function (index: any, type: any) {
                    if (type.Id != undefined)
                        type.Id = type.ID;
                })
            }
        });
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            if (items.AdditionalTime.length > 0) {
                items.AdditionalTime = items.AdditionalTime.reverse()
                $.each(items.AdditionalTime, function (index: any, val: any) {
                    var NewDate = val.TaskDate;
                    try {
                        getDateForTimeEntry(NewDate, val);
                    } catch (e) { }
                })
            }
        })
        $.each(AllTimeSpentDetails, function (index: any, items: any) {
            if (items.Category.Title === undefined)
                checkCategory(items, 319);
            else
                checkCategory(items, items.Category.Id);
        })
        var IsTimeSheetAvailable = false;
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {
            if (items.Childs.length > 0) {
                IsTimeSheetAvailable = true;
            }
        });



        // $.each(TaskTimeSheetCategoriesGrouping, function (index: any, items: any) {

        //     if (items.Childs != undefined && items.Childs.length > 0) {
        //         $.each(items.Childs, function (index: any, child: any) {
        //             if (child.TimesheetTitle.Id != undefined) {
        //                 if (child.AdditionalTime != undefined && child.AdditionalTime.length > 0) {
        //                     $.each(child.AdditionalTime, function (index: any, Subchild: any) {
        //                         if (Subchild != undefined && (!isItemExists(AdditionalTime, Subchild.ID))) {

        //                             AdditionalTimes.push(Subchild)
        //                             //  AdditionalTimes.sort(datecomp);
        //                             console.log(AdditionalTimes)


        //                         }


        //                     })


        //                 }
        //             }

        //         })

        //     }




        //     //AdditionalTimes= AdditionalTimes.reverse()

        // });
        console.log(TaskTimeSheetCategoriesGrouping)
        // setAdditionalTime(AdditionalTimes)
        setTimeSheet(TaskTimeSheetCategoriesGrouping)
        // var mainArray: any = []
        // var sortedCars: any = []
        // TaskTimeSheetCategoriesGrouping.forEach((temp: any) => {

        //     if (temp.Childs != undefined && temp.Childs.length > 0) {
        //         $.each(temp.Childs, function (index: any, child: any) {
        //             child.AdditionalTimes = []
        //             if (child.AdditionalTime != undefined && child.AdditionalTime.length > 0) {
        //                 $.each(child.AdditionalTime, function (index: any, ch: any) {
        //                     mainArray.push(ch)
        //                 })
        //                 sortedCars = mainArray.sort(datecomp);

        //             }

        //         })

        //     }

        // })
        // const finalData = sortedCars.filter((val: any, id: any, array: any) => {
        //     return array.indexOf(val) == id;
        // })
        // TaskTimeSheetCategoriesGrouping.forEach((temp: any) => {

        //     if (temp.Childs != undefined && temp.Childs.length > 0) {

        //         $.each(temp.Childs, function (index: any, child: any) {
        //             child.AdditionalTime = []
        //             $.each(finalData, function (index: any, ch: any) {
        //                 if (child.Id == ch.MainParentId) {
        //                     child.AdditionalTimes.push(ch)
        //                 }
        //             })


        //         })

        //     }

        // })
        // TaskTimeSheetCategoriesGrouping.forEach((temp: any) => {

        //     if (temp.Childs != undefined && temp.Childs.length > 0) {

        //         $.each(temp.Childs, function (index: any, child: any) {
        //             $.each(child.AdditionalTimes, function (index: any, ch: any) {

        //                 child.AdditionalTime.push(ch)

        //             })


        //         })

        //     }

        // })
        // console.log(finalData)
        // console.log(mainArray)
        // setTimeSheet(TaskTimeSheetCategoriesGrouping);

        if (TaskStatuspopup == true) {

            setupdateData(updateData + 1)
            showProgressHide()
        }



        setModalIsTimeOpenToTrue();

    }


    const setModalIsTimeOpenToTrue = () => {
        setTimeModalIsOpen(true)
    }
    function TimeCallBack(callBack: any) {

        item.CallBackTimeEntry();

    }
    // function datecomp(d1: any, d2: any) {
    //     var a1 = d1.TaskDate.split("/");
    //     var a2 = d2.TaskDate.split("/");
    //     // a1 = a1[2] + a1[0] + a1[1];
    //     // a2 = a2[2] + a2[0] + a2[1];
    //     a1 = a1[1] + a1[0] + a1[2];
    //     a2 = a2[1] + a2[0] + a2[2];
    //     //var a1:any= new Date(d1.TaskDate)
    //     //var a2:any= new Date(d2.TaskDate)
    //     //var b1:any = Moment(a1).format()
    //     //var b2:any = Moment(a1).format()
    //     return a2 - a1;
    // }


    function getDateForTimeEntry(newDate: any, items: any) {
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
                getMonth = 'September';
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
    const getStructurefTimesheetCategories = function () {
        $.each(TaskTimeSheetCategories, function (index: any, item: any) {
            $.each(TaskTimeSheetCategories, function (index: any, val: any) {
                if (item.ParentID === 0 && item.Id === val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
        $.each(TaskTimeSheetCategoriesGrouping, function (index: any, item: any) {
            $.each(TaskTimeSheetCategoriesGrouping, function (index: any, val: any) {
                if (item.ParentID === 0 && item.Id === val.ParentID) {
                    val.ParentType = item.Title;
                }
            })
        })
    }
    var getSmartMetadataItemsByTaxType = function (metadataItems: any, taxType: any) {
        var Items: any = [];
        $.each(metadataItems, function (index: any, taxItem: any) {
            if (taxItem.TaxType === taxType)
                Items.push(taxItem);
        });
        return Items;
    }


    const EditData = async (items: any) => {
        AllTimeSpentDetails = [];

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
        setEditItem(items.Title);

        if (items.siteType == "Offshore Tasks") {
            var siteType = "OffshoreTasks"
            var filteres = "Task" + siteType + "/Id eq " + items.Id;
        }
        else {

            var filteres = "Task" + items.siteType + "/Id eq " + items.Id;
        }
        var select = "Id,Title,TaskDate,Created,Modified,TaskTime,Description,SortOrder,AdditionalTimeEntry,AuthorId,Author/Title,Editor/Id,Editor/Title,Category/Id,Category/Title,TimesheetTitle/Id,TimesheetTitle/Title&$expand=Editor,Author,Category,TimesheetTitle&$filter=" + filteres + "";
        var count = 0;

        if (items.siteType == "Migration" || items.siteType == "ALAKDigital") {

            var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('9ed5c649-3b4e-42db-a186-778ba43c5c93')/items?$select=" + select + "" }]

        }
        else {
            var allurls = [{ 'Url': "https://hhhhteams.sharepoint.com/sites/HHHH/SP/_api/web/lists/getbyid('464FB776-E4B3-404C-8261-7D3C50FF343F')/items?$select=" + select + "" },

            ]
        }
        $.each(allurls, async function (index: any, item: any) {
            await $.ajax({

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

                    if (allurls.length === count) {
                        // if (AllTimeSpentDetails != undefined && AllTimeSpentDetails > 0) {

                        //     AllTimeSpentDetails.map((val:any)=>{
                        //     if(val.AuthorId===CurntUserId){
                        //         AllTimeSpentDetails.push(val)
                        //     }
                        //     })

                        // }
                        //  var AllTimeSpentDetails = data.d.results;
                        let TotalPercentage = 0
                        let TotalHours = 0;
                        let totletimeparentcount = 0;
                        //  let totletimeparentcount = 0;
                        let AllAvailableTitle = [];
                        // TaskTimeSheetCategoriesGrouping.map((val:any)=>{
                        //     (!isItemExists(TaskTimeSheetCategoriesGrouping, val.Id))

                        // })

                        $.each(AllTimeSpentDetails, async function (index: any, item: any) {
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
                            if (NewParentId == item.Id) {
                                var UpdatedData: any = {}
                                AllUsers.forEach((taskUser: any) => {
                                    if (taskUser.AssingedToUserId == CurntUserId) {
                                        UpdatedData['AuthorName'] = taskUser.Title;
                                        UpdatedData['Company'] = taskUser.Company;
                                        UpdatedData['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
                                    }

                                });
                                var Datee: any = new Date(changeDates)
                                if (Datee == 'Invalid Date') {
                                    Datee = Moment().format()
                                }
                                var TimeInH: any = TimeInMinutes / 60
                                TimeInH = TimeInH.toFixed(2);
                                item.TimesheetTitle.Title = NewParentTitle;
                                item.TimesheetTitle.Id = mainParentId;
                                item.AdditionalTime = []
                                var update: any = {};
                                update['AuthorName'] = UpdatedData.AuthorName;
                                update['AuthorId'] = CurntUserId;
                                update['AuthorImage'] = UpdatedData.AuthorImage;
                                update['ID'] = 0;
                                update['MainParentId'] = mainParentId;
                                update['ParentID'] = NewParentId;
                                update['TaskTime'] = TimeInH;
                                update['TaskTimeInMin'] = TimeInMinutes;
                                update['TaskDate'] = Moment(Datee).format('DD/MM/YYYY');
                                update['Description'] = newData.Description
                                item.AdditionalTime.push(update)
                                let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

                                if (items.siteType == "Migration" || items.siteType == "ALAKDigital") {

                                    var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'

                                }
                                else {
                                    var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'
                                }

                                await web.lists.getById(ListId).items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(NewParentId).update({


                                    AdditionalTimeEntry: JSON.stringify(item.AdditionalTime),
                                    TimesheetTitleId: mainParentId

                                }).then((res: any) => {

                                    console.log(res);



                                })

                            }

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

                                    } catch (e) {
                                        console.log(e)
                                    }
                                }
                                setAllUser(AllUsers)

                                $.each(AllUsers, function (index: any, taskUser: any) {
                                    if (taskUser.AssingedToUserId === item.AuthorId) {
                                        item.AuthorName = taskUser.Title;
                                        item.AuthorImage = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
                                    }
                                });
                                if (item.TaskTime != undefined) {
                                    var TimeInHours = item.TaskTime / 60;
                                    // item.IntegerTaskTime = item.TaskTime / 60;
                                    item.TaskTime = TimeInHours;
                                }
                            } else {
                                AllAvailableTitle.push(item);
                            }

                            if (item.AdditionalTime === undefined) {
                                item.AdditionalTime = [];
                            }
                            // item.ServerTaskDate = angular.copy(item.TaskDate);
                            // item.TaskDate = SharewebCommonFactoryService.ConvertLocalTOServerDate(item.TaskDate, 'DD/MM/YYYY');
                            item.isShifted = false;

                        })


                        getStructureData();

                    }

                }
            })
        })
        // setAllTimeSpentDetails(AllTimeSpentDetails)

    };
    // error: function (error) {
    //     count++;
    //     if (allurls.length === count)
    //         getStructureData();
    // }




    const setModalTimmeIsOpenToFalse = () => {
        TimeCallBack(false);
        setTimeModalIsOpen(false)
    }
    const openexpendTime = () => {
        setcollapseItem(true)
    }
    const collapseTime = () => {
        setcollapseItem(false)
    }
    let handleChange = (e: { target: { value: string; }; }, titleName: any) => {
        if (titleName == 'Date' || titleName == 'Time') {
            setSearch(e.target.value);
        }
        else {
            setSearch(e.target.value.toLowerCase());
            var Title = titleName;
        }
    };
    const handleTimeOpen = (item: any) => {

        item.show = item.show = item.show === true ? false : true;
        setTimeSheet(TaskTimeSheetCategoriesGrouping => ([...TaskTimeSheetCategoriesGrouping]));
        // setData(data => ([...data]));

    };
    const sortBy = () => {

        // const copy = data

        // copy.sort((a, b) => (a.Title > b.Title) ? 1 : -1);

        // setTable(copy)

    }
    const sortByDng = () => {

        // const copy = data

        // copy.sort((a, b) => (a.Title > b.Title) ? -1 : 1);

        // setTable(copy)

    }


    const deleteTaskTime = async (childinew: any) => {
        var UpdatedData: any = []
        var deleteConfirmation = confirm("Are you sure, you want to delete this?")
        if (deleteConfirmation) {

            $.each(TaskCate, function (index: any, subItem: any) {
                if (subItem.Id == childinew.ParentID) {
                    if (subItem.AdditionalTime.length > 0 && subItem.AdditionalTime != undefined) {
                        $.each(subItem.AdditionalTime, async function (index: any, NewsubItem: any) {
                            if (NewsubItem.ParentID == childinew.ParentID) {
                                if (NewsubItem.ID === childinew.ID)
                                    subItem.AdditionalTime.splice(index, 1)

                            }

                        })
                        UpdatedData = subItem.AdditionalTime

                    }
                }

            })



            if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

                var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'

            }
            else {
                var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'
            }
            let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

            await web.lists.getById(ListId).items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/Smalsus/Santosh Kumar").getById(childinew.ParentID).update({


                AdditionalTimeEntry: JSON.stringify(UpdatedData),

            }).then((res: any) => {

                console.log(res);


            })
            setupdateData(updateData + 5)
        }
        else {
            console.log("Select Item")
        }

    }

    const UpdateAdditionaltime = async (child: any) => {
        var Dateee = ''
        if (editeddata != undefined) {
            var a = Moment(editeddata).format()
            Dateee = Moment(a).format('DD/MM/YYYY')
        }
        else {
            Dateee = Moment(changeEdited).format('DD/MM/YYYY')
        }

        var DateFormate = new Date(Eyd)
        var UpdatedData: any = []
        $.each(saveEditTaskTime, function (index: any, update: any) {
            $.each(update.AdditionalTime, function (index: any, updateitem: any) {
                if (updateitem.ID === child.ID && updateitem.ParentID === child.ParentID) {

                    updateitem.Id = child.ID;
                    updateitem.TaskTime = TimeInHours != undefined && TimeInHours != 0 ? TimeInHours : child.TaskTime;
                    updateitem.TaskTimeInMin = TimeInMinutes != undefined && TimeInMinutes != 0 ? TimeInMinutes : child.TaskTimeInMin;
                    updateitem.TaskDate = Dateee != "Invalid date" ? Dateee : Moment(DateFormate).format('DD/MM/YYYY');

                    updateitem.Description = postData != undefined && postData.Description != undefined && postData.Description != '' ? postData.Description : child.Description;


                }
                UpdatedData.push(updateitem)
            })
        });
        setTaskStatuspopup2(false)
        if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

            var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'


        }
        else {
            var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'

        }
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        await web.lists.getById(ListId).items.getById(child.ParentID).update({

            AdditionalTimeEntry: JSON.stringify(UpdatedData),

        }).then((res: any) => {

            console.log(res);

            closeTaskStatusUpdatePoup2();

        })

    }
    var NewParentId: any = ''
    var NewParentTitle: any = ''
    var smartTermId = ''
    var mainParentId: any = ''
    var mainParentTitle: any = ''
    const saveTimeSpent = async () => {
        closeTaskStatusUpdatePoup();
        var UpdatedData: any = {}
        smartTermId = "Task" + item.props.siteType + "Id";
        showProgressBar();

        var AddedData: any = []

        if (checkCategories == undefined && checkCategories == undefined) {
            alert("please select category or Title");
            return false;
        }

        $.each(AllUsers, function (index: any, taskUser: any) {
            if (taskUser.AssingedToUserId == CurntUserId) {
                UpdatedData['AuthorName'] = taskUser.Title;
                UpdatedData['Company'] = taskUser.Company;
                UpdatedData['UserImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
            }

        });


        var TimeInHours: any = changeTime / 60;
        TimeInHours = TimeInHours.toFixed(2);



        if (AllTimeSpentDetails == undefined) {
            var AllTimeSpentDetails: any = []
        }

        TimeSheet.map((items: any) => {
            if (items.Title == checkCategories) {
                Category = items.Id
            }
        })



        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");





        //-------------Post Method------------------------------------------------------------

        //let folderUri: string = '/Smalsus'
        let folderUri: string = `/${UpdatedData.Company}`
        if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {
            var listUri: string = '/sites/HHHH/SP/Lists/TasksTimesheet2';
            var listName = 'TasksTimesheet2'
        }
        else {
            var listUri: string = '/sites/HHHH/SP/Lists/TaskTimeSheetListNew';
            var listName = 'TaskTimeSheetListNew'
        }
        let itemMetadataAdded = {
            'Title': newData != undefined && newData.Title != undefined && newData.Title != '' ? newData.Title : checkCategories,
            [smartTermId]: item.props.Id,
            'CategoryId': Category,
        };
        //First Add item on top
        let newdata = await web.lists.getByTitle(listName)
            .items
            .add({ ...itemMetadataAdded });
        console.log(newdata)

        let movedata = await web
            .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
            .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
        console.log(movedata);
        mainParentId = newdata.data.Id;
        mainParentTitle = newdata.data.Title;
        createItemMainList();

        //--------------------------------End Post----------------------------------------------------------------

    }
    const createItemMainList = async () => {
        var UpdatedData: any = {}
        $.each(AllUsers, function (index: any, taskUser: any) {
            if (taskUser.AssingedToUserId == CurntUserId) {
                UpdatedData['AuthorName'] = taskUser.Title;
                UpdatedData['Company'] = taskUser.Company;
                UpdatedData['UserImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
            }

        });
        let web = new Web("https://hhhhteams.sharepoint.com/sites/HHHH/SP");
        if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {
            var listUri: string = '/sites/HHHH/SP/Lists/TasksTimesheet2';
            var listName = 'TasksTimesheet2'
        }
        else {
            var listUri: string = '/sites/HHHH/SP/Lists/TaskTimeSheetListNew';
            var listName = 'TaskTimeSheetListNew'
        }

        // let folderUri: string = '/Smalsus/Santosh Kumar';
        let folderUri: string = `/${UpdatedData.Company}/${UpdatedData.AuthorName}`
        // let listUri: string = '/sites/HHHH/SP/Lists/TaskTimeSheetListNew';
        let itemMetadataAdded = {
            'Title': newData != undefined && newData.Title != undefined && newData.Title != '' ? newData.Title : checkCategories,
            [smartTermId]: item.props.Id,
            'CategoryId': Category,
        };
        //First Add item on top
        let newdata = await web.lists.getByTitle(listName)
            .items
            .add({ ...itemMetadataAdded });
        console.log(newdata)

        let movedata = await web
            .getFileByServerRelativeUrl(`${listUri}/${newdata.data.Id}_.000`)
            .moveTo(`${listUri}${folderUri}/${newdata.data.Id}_.000`);
        console.log(movedata);
        NewParentId = newdata.data.Id;
        NewParentTitle = newdata.data.Title;
        NewCategoryId = newdata.data.CategoryId;
        EditData(item.props);
    }

    const AddTaskTime = async () => {
        var UpdatedData: any = []
        var CurrentUser: any = {}
        var update: any = {};
        var AddMainParentId: any = ''
        var AddParentId: any = ''
        var TimeInMinute: any = changeTime / 60
        $.each(AllUsers, function (index: any, taskUser: any) {
            if (taskUser.AssingedToUserId === CurntUserId
            ) {
                CurrentUser['AuthorName'] = taskUser.Title;
                CurrentUser['Company'] = taskUser.Company;
                CurrentUser['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
            }

        });




        $.each(TaskCate, async function (index: any, items: any) {

            if (items.TimesheetTitle.Id != undefined && items.TimesheetTitle.Id == ParentId) {
                if (items.AdditionalTime.length > 0 && items.AdditionalTime != undefined) {
                    var timeSpentId = items.AdditionalTime[items.AdditionalTime.length - 1];
                    $.each(items.AdditionalTime, async function (index: any, NewsubItem: any) {
                        AddParentId = NewsubItem.ParentID
                        AddMainParentId = NewsubItem.MainParentId

                    })

                    update['AuthorName'] = CurrentUser.AuthorName;
                    update['AuthorId'] = CurntUserId;
                    update['AuthorImage'] = CurrentUser.AuthorImage;
                    update['ID'] = timeSpentId.ID + 1;
                    update['MainParentId'] = AddMainParentId;
                    update['ParentID'] = AddParentId;
                    update['TaskTime'] = TimeInHours;
                    update['TaskTimeInMin'] = TimeInMinutes;
                    update['TaskDate'] = Moment(changeDates).format('DD/MM/YYYY');
                    update['Description'] = postData.Description
                    items.AdditionalTime.push(update)
                    UpdatedData = items.AdditionalTime
                }
                if (items.AdditionalTime.length == 0) {
                    AddParentId = items.Id;
                    update['AuthorName'] = CurrentUser.AuthorName;
                    update['AuthorImage'] = CurrentUser.AuthorImage;
                    update['AuthorId'] = CurntUserId
                    update['ID'] = 0;
                    update['MainParentId'] = items.TimesheetTitle.Id;
                    update['ParentID'] = items.Id;
                    update['TaskTime'] = TimeInHours;
                    update['TaskTimeInMin'] = TimeInMinutes;
                    update['TaskDate'] = Moment(changeDates).format('DD/MM/YYYY');
                    update['Description'] = postData.Description
                    items.AdditionalTime.push(update)
                    UpdatedData = items.AdditionalTime

                }
            }



        })

        if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

            var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'

        }
        else {
            var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'
        }
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        await web.lists.getById(ListId)
            .items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew/" + UpdatedData.Company + "/" + UpdatedData.Author).getById(AddParentId)
            .update({



                AdditionalTimeEntry: JSON.stringify(UpdatedData),

            }).then((res: any) => {
                console.log(res);

                closeAddTaskTimepopup();

                setupdateData(updateData + 1)
                //setAdditionalTime({ ...AdditionalTime })


            })


    }

    const deleteCategory = async (val: any) => {

        confirm("Are you sure, you want to delete this?")
        if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

            var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'

        }
        else {
            var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'
        }
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        await web.lists.getById(ListId).items.getById(val.Id).delete()
            .then(i => {
                console.log(i);

            });
        TaskCate.forEach((item: any, index: any) => {
            if (item.Id == val.Id) {
                TaskCate.splice(index, 1)
            }
        })
        setTimeSheet(TaskTimeSheetCategoriesGrouping => ([...TaskTimeSheetCategoriesGrouping]));
        setupdateData(updateData + 1)

    }






    const SaveCopytime = async (child: any) => {
        var CurrentUser: any = {}
        var update: any = {};
        var TimeInMinute: any = changeTime / 60
        var UpdatedData: any = []
        var AddParent: any = ''
        var AddMainParent: any = ''
        $.each(AllUsers, function (index: any, taskUser: any) {
            if (taskUser.AssingedToUserId === CurntUserId
            ) {
                CurrentUser['AuthorName'] = taskUser.Title;
                CurrentUser['AuthorImage'] = (taskUser.Item_x0020_Cover != undefined && taskUser.Item_x0020_Cover.Url != undefined) ? taskUser.Item_x0020_Cover.Url : '';
            }

        });
        var Dateee = ''
        // if(editeddata != undefined){
        //    var a =  Moment(editeddata).format()
        //     Dateee = Moment(changeDates).format('DD/MM/YYYY')
        // }
        // else{
        //     Dateee = Moment(changeDates).format('DD/MM/YYYY')
        // }

        // var Dateee = Moment(changeEdited).format('DD/MM/YYYY')
        //var DateFormate = new Date(Eyd)

        $.each(TaskCate, function (index: any, subItem: any) {
            if (subItem.Id == child.ParentID) {
                if (subItem.AdditionalTime.length > 0 && subItem.AdditionalTime != undefined) {
                    var timeSpentId = subItem.AdditionalTime[subItem.AdditionalTime.length - 1];
                    $.each(subItem.AdditionalTime, async function (index: any, NewsubItem: any) {
                        AddParent = NewsubItem.ParentID
                        AddMainParent = NewsubItem.MainParentId

                    })

                    update['AuthorName'] = CurrentUser.AuthorName;
                    update['AuthorImage'] = CurrentUser.AuthorImage;
                    update['ID'] = timeSpentId.ID + 1;
                    update['AuthorId'] = CurntUserId
                    update['MainParentId'] = AddMainParent;
                    update['ParentID'] = AddParent;
                    update['TaskTime'] = TimeInHours != undefined && TimeInHours != 0 ? TimeInHours : child.TaskTime;
                    update['TaskTimeInMin'] = TimeInMinutes != undefined && TimeInMinutes != 0 ? TimeInMinutes : child.TaskTimeInMin;
                    update['TaskDate'] = Moment(changeDates).format('DD/MM/YYYY');
                    update['Description'] = postData != undefined && postData.Description != undefined && postData.Description != '' ? postData.Description : child.Description;
                    subItem.AdditionalTime.push(update)
                    UpdatedData = subItem.AdditionalTime
                }
            }
        })

        if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

            var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'

        }
        else {
            var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'
        }
        setCopyTaskpopup(false)
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');

        await web.lists.getById(ListId).items.filter("FileDirRef eq '/sites/HHHH/SP/Lists/TaskTimeSheetListNew" + UpdatedData.AuthorName + "/" + UpdatedData.Company).getById(AddParent).update({


            // TaskDate:postData.TaskDate,
            AdditionalTimeEntry: JSON.stringify(UpdatedData),

        }).then((res: any) => {

            console.log(res);

            closeCopyTaskpopup();
            setupdateData(updateData + 7)

        })
    }
    const DateFormat = (itemL: any) => {

        let Newh = Moment().add('days')
        //console.log(Newh)
        let serverDateTime;
        let mDateTime = Moment(itemL);
        serverDateTime = mDateTime.format(itemL);
        return serverDateTime;

    }
    const updateCategory = async () => {
        TimeSheet.map((items: any) => {
            if (items.Title == checkCategories) {
                Category = items.Id
            }
        })
        let web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP');
        if (item.props.siteType == "Migration" || item.props.siteType == "ALAKDigital") {

            var ListId = '9ed5c649-3b4e-42db-a186-778ba43c5c93'

        }
        else {
            var ListId = '464fb776-e4b3-404c-8261-7d3c50ff343f'
        }

        await web.lists.getById(ListId).items.getById(CategoryyID).update({


            Title: newData != undefined ? newData.Title : checkCategories,
            CategoryId: Category

        }).then((res: any) => {

            console.log(res);

            closeEditcategorypopup((e: any) => e);
            setupdateData(updateData + 3)

        })
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

    const changeDatetodayQuickly = (date: any, type: any, Popup: any) => {
        if (Popup == 'Edit') {
            if (type == 'firstdate') {
                var a1 = date.split("/");
                a1[0] = '01'
                a1 = a1[2] + a1[1] + a1[0];
                var finalDate = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
            if (type == '15thdate') {
                var a1 = date.split("/");
                a1[0] = '15'
                a1 = a1[2] + a1[1] + a1[0];
                var finalDate = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
            if (type == '1Jandate') {
                var a1 = date.split("/");
                a1[1] = '01'
                a1[0] = '01'
                a1 = a1[2] + a1[1] + a1[0];
                var finalDate = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
            if (type == 'Today') {
                var newStartDate: any = Moment().format("DD/MM/YYYY")
                var a1 = newStartDate.split("/");
                a1 = a1[2] + a1[1] + a1[0];
                var finalDate = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
        }
        if (Popup == 'Add') {
            if (type == 'firstdate') {

                var newStartDate: any = Moment(date).format("DD/MM/YYYY")
                var a1 = newStartDate.split("/");
                a1[0] = '01'
                a1 = a1[2] + a1[1] + a1[0];
                var finalDate = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
            if (type == '15thdate') {

                var newStartDate: any = Moment(date).format("DD/MM/YYYY")
                var a1 = newStartDate.split("/");
                a1[0] = '15'
                a1 = a1[2] + a1[1] + a1[0];
                let finalDate: any = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
            if (type == '1Jandate') {

                var newStartDate: any = Moment(date).format("DD/MM/YYYY")
                var a1 = newStartDate.split("/");
                a1[1] = '01'
                a1[0] = '01'
                a1 = a1[2] + a1[1] + a1[0];
                var finalDate = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
            if (type == 'Today') {
                var newStartDate: any = Moment().format("DD/MM/YYYY")
                var a1 = newStartDate.split("/");
                a1 = a1[2] + a1[1] + a1[0];
                var finalDate = Moment(a1).format("ddd, DD MMM yyyy")
                change = new window.Date(finalDate)
                setchangeDates(finalDate)
                setediteddata(finalDate)
            }
        }


    }
    function convert(str: any) {
        var date = new Date(str),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
    }
    const handleDatedue = (date: any) => {
        change = new window.Date(date)
        var NewDate = new window.Date(date).toString()
        var FinalDate = moment(NewDate).format("ddd, DD MMM yyyy")
        setchangeDates(FinalDate)
        setediteddata(FinalDate)
    }
    const handleOnBlur = (event: any) => {
        setNewData({ ...newData, TaskDate: event.target.value })
    }
    const formatDate = React.useCallback((Date) =>
        Date.toLocaleString(), []);

    return (
        <div>
            <div className="container mt-0 p-0">
                <div className="col-sm-12 p-0">
                    <span ng-if="Item!=undefined">

                    </span>
                    <div className="col-sm-12 p-0 mt-10">
                        <div className="col-sm-12 ps-0 pr-5 TimeTabBox">
                            <a className="hreflink pull-right mt-1 mr-0" onClick={openTaskStatusUpdatePoup}>

                                + Add Time in New Structure
                            </a>

                        </div>

                    </div>
                </div>

            </div>

            {collapseItem && <div className="togglecontent clearfix">
                <div id="forShowTask" className="pt-0" >
                    <div className='Alltable'>
                        <div className="col-sm-12 p-0 smart">
                            <div className="section-event">
                                <div className="wrapper">
                                    <table className="table table-hover" id="EmpTable" style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={{ width: "2%" }}>
                                                    <div></div>
                                                </th>
                                                <th style={{ width: "20%" }}>
                                                    <div style={{ width: "19%" }} className="smart-relative">
                                                        <input type="search" placeholder="AuthorName" className="full_width searchbox_height" aria-label="Search" aria-describedby="search-addon"
                                                            onChange={event => handleChange(event, 'Time')} />

                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>


                                                    </div>
                                                </th>
                                                <th style={{ width: "15%" }}>
                                                    <div style={{ width: "14%" }} className="smart-relative">
                                                        <input id="searchClientCategory" type="search" placeholder="Date"
                                                            title="Client Category" className="full_width searchbox_height"
                                                            onChange={event => handleChange(event, 'Date')} />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>
                                                    </div>
                                                </th>
                                                <th style={{ width: "15%" }}>
                                                    <div style={{ width: "14%" }} className="smart-relative">
                                                        <input id="searchClientCategory" type="search" placeholder="Time"
                                                            title="Client Category" className="full_width searchbox_height"
                                                            onChange={event => handleChange(event, 'Time')} />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>

                                                    </div>
                                                </th>
                                                <th style={{ width: "48%" }}>
                                                    <div style={{ width: "43%" }} className="smart-relative">
                                                        <input id="searchClientCategory" type="search" placeholder="Description"
                                                            title="Client Category" className="full_width searchbox_height"
                                                            onChange={event => handleChange(event, 'Description')} />
                                                        <span className="sorticon">
                                                            <span className="up" onClick={sortBy}>< FaAngleUp /></span>
                                                            <span className="down" onClick={sortByDng}>< FaAngleDown /></span>
                                                        </span>

                                                    </div>
                                                </th>
                                                <th style={{ width: "2%" }}></th>
                                                <th style={{ width: "2%" }}></th>
                                                <th style={{ width: "2%" }}></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {AllTimeSheetDataNew != undefined && AllTimeSheetDataNew.length > 0 && AllTimeSheetDataNew.map(function (item, index) {
                                                <div id="SpfxProgressbar" style={{ display: "none" }}>
                                                    <img id="sharewebprogressbar-image" src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/loading_apple.gif" alt="Loading..." />
                                                </div>
                                                if (item.Childs != undefined && item.Childs.length > 0) {

                                                    return (
                                                        <>

                                                            {item.Childs != undefined && item.Childs.length > 0 && (
                                                                <>

                                                                    {item.Childs.map(function (childitem: any) {

                                                                        return (

                                                                            <>
                                                                                <tr >

                                                                                    <td className="p-0" colSpan={9}>
                                                                                        <table className="table m-0" style={{ width: "100%" }}>
                                                                                            <tr className="for-c02">
                                                                                                <td style={{ width: "2%" }}>

                                                                                                    <div className="sign" onClick={() => handleTimeOpen(childitem)}>{childitem.AdditionalTime.length > 0 && childitem.show ? <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png" />
                                                                                                        : <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png" />}
                                                                                                    </div>
                                                                                                </td>

                                                                                                <td colSpan={6} style={{ width: "90%" }}>
                                                                                                    <span className='d-flex'>{item.Title} - {childitem.Title}    <span className="svg__iconbox svg__icon--edit mt-1" onClick={() => Editcategorypopup(childitem)}></span>    <span className="svg__iconbox svg__icon--cross mt-1" onClick={() => deleteCategory(childitem)}></span></span>

                                                                                                </td>
                                                                                                <td style={{ width: "8%" }}>
                                                                                                    <button type="button" className="btn btn-primary me-1 d-flex " onClick={() => openAddTasktimepopup(childitem)} >
                                                                                                        Add Time <span className="bg-light m-0  ms-1 p-0 svg__icon--Plus svg__iconbox"></span>

                                                                                                    </button>
                                                                                                </td>

                                                                                            </tr>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>

                                                                                {childitem.AdditionalTime != undefined && childitem.show && childitem.AdditionalTime.length > 0 && (
                                                                                    <>
                                                                                        {childitem.AdditionalTime.map(function (childinew: any) {
                                                                                            if ((search == "" || childinew.AuthorName?.toLowerCase().includes(search.toLowerCase())) || (search == "" || childinew.Description?.toLowerCase().includes(search.toLowerCase()))
                                                                                                || (search == "" || childinew.TaskDate?.includes(search))) {
                                                                                                return (
                                                                                                    <>
                                                                                                        <tr >
                                                                                                            <td className="p-0" colSpan={10}>
                                                                                                                <table className="table m-0" style={{ width: "100%" }}>
                                                                                                                    <tr className="tdrow">

                                                                                                                        <td colSpan={2} style={{ width: "22%" }}>
                                                                                                                            <img className="workmember wid29 bdrbox"
                                                                                                                                title={childinew.AuthorName}
                                                                                                                                data-toggle="popover"
                                                                                                                                data-trigger="hover"
                                                                                                                                src={childinew.AuthorImage}></img>
                                                                                                                            <span className="ml5"> {childinew.AuthorName}</span>
                                                                                                                        </td>

                                                                                                                        <td style={{ width: "15%" }}>

                                                                                                                            {childinew.TaskDate}
                                                                                                                        </td>
                                                                                                                        <td style={{ width: "15%" }}>
                                                                                                                            {childinew.TaskTime}
                                                                                                                        </td>
                                                                                                                        <td style={{ width: "42%" }}>
                                                                                                                            {childinew.Description}
                                                                                                                        </td>
                                                                                                                        <td style={{ width: "2%" }}>  <a title="Copy" className="hreflink">
                                                                                                                            <img
                                                                                                                                src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png" onClick={() => openCopyTaskpopup(childitem, childinew)}></img>
                                                                                                                        </a></td>

                                                                                                                        <td style={{ width: "2%" }}>  <a className="hreflink"
                                                                                                                        >
                                                                                                                            <span className="svg__iconbox svg__icon--edit" onClick={() => openTaskStatusUpdatePoup2(childitem, childinew)}></span>

                                                                                                                        </a></td>
                                                                                                                        <td style={{ width: "2%" }}>  <a title="Copy" className="hreflink">
                                                                                                                            <span className="mt-1 svg__icon--trash  svg__iconbox" onClick={() => deleteTaskTime(childinew)}></span>

                                                                                                                        </a></td>
                                                                                                                    </tr>
                                                                                                                </table>
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                        {childinew.AdditionalTime != undefined && childinew.AdditionalTime.length > 0 && (
                                                                                                            <>
                                                                                                                {childinew.AdditionalTime.map(function (subchilditem: any) {

                                                                                                                    return (

                                                                                                                        <>
                                                                                                                            <tr >
                                                                                                                                <td className="p-0" colSpan={9}>
                                                                                                                                    <table className="table m-0" style={{ width: "100%" }}>

                                                                                                                                        <tr className="for-c02">

                                                                                                                                            <td colSpan={2} style={{ width: "22%" }}>
                                                                                                                                                <img className="workmember bdrbox"
                                                                                                                                                    title="{subchilds.AuthorName}"
                                                                                                                                                    data-toggle="popover"
                                                                                                                                                    data-trigger="hover"
                                                                                                                                                    src={subchilditem.AuthorImage}></img>
                                                                                                                                                <span
                                                                                                                                                    className="ml5">{subchilditem.AuthorName}</span>
                                                                                                                                            </td>

                                                                                                                                            <td style={{ width: "15%" }}>
                                                                                                                                                {subchilditem.TaskDate}
                                                                                                                                            </td>
                                                                                                                                            <td style={{ width: "15%" }}>
                                                                                                                                                {subchilditem.TaskTime}
                                                                                                                                            </td>
                                                                                                                                            <td style={{ width: "42%" }}>
                                                                                                                                                {subchilditem.Description}</td>
                                                                                                                                            <td style={{ width: "2%" }}><a title="Copy" className="hreflink"
                                                                                                                                            >
                                                                                                                                                <img
                                                                                                                                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/32/icon_copy.png"></img>
                                                                                                                                            </a></td>
                                                                                                                                            <td style={{ width: "2%" }}>
                                                                                                                                                <a className="hreflink"
                                                                                                                                                >

                                                                                                                                                    <span className="svg__iconbox svg__icon--edit"></span>
                                                                                                                                                </a></td>
                                                                                                                                            <td style={{ width: "2%" }}><a title="Copy" className="hreflink"
                                                                                                                                            >
                                                                                                                                                <span className="mt-1 svg__icon--trash  svg__iconbox"></span>

                                                                                                                                            </a></td>
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
                                                                    })}
                                                                </>
                                                            )}
                                                        </>


                                                    )
                                                }

                                            })}
                                        </tbody>
                                    </table>
                                    {TaskCate.length === 0 && <div className="text-center pb-3"
                                    >
                                        No Timesheet Available
                                    </div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}


            <Panel
                onRenderHeader={onRenderCustomHeaderAddTaskTime}
                type={PanelType.custom}
                customWidth="850px"
                isOpen={TaskStatuspopup}
                onDismiss={closeTaskStatusUpdatePoup}
                isBlocking={TaskStatuspopup}
            >
                <div className="modal-body border p-3  ">

                    <div className='row'>
                        <div className="col-sm-9 border-end" >
                            <div className='mb-3'>
                                <div className=" form-group">
                                    <label>Selected Category</label>
                                    <input type="text" autoComplete="off"
                                        className="form-control"
                                        name="CategoriesTitle"
                                        disabled={true}
                                        value={checkCategories}
                                    />
                                </div>
                            </div>
                            <div className='mb-3'>
                                <div className=" form-group" key={checkCategories}>
                                    <label>Title</label>
                                    <input type="text"
                                        className="form-control" name="TimeTitle"
                                        defaultValue={checkCategories}
                                        onChange={(e) => setNewData({ ...newData, Title: e.target.value })} />
                                </div>
                            </div>
                            <div className='mb-3'>
                                <div className=" form-group">
                                    <div className='row'>
                                        <div className="col-sm-6">
                                            <div className="date-div">
                                                <div className="Date-Div-BAR d-flex">
                                                    <span className="href"

                                                        id="selectedYear"

                                                        onClick={() => changeDatetodayQuickly(changeDates, 'firstdate', 'Add')}>1st</span>
                                                    | <span className="href"

                                                        id="selectedYear"

                                                        onClick={() => changeDatetodayQuickly(changeDates, '15thdate', 'Add')}>15th</span>
                                                    | <span className="href"

                                                        id="selectedYear"

                                                        onClick={() => changeDatetodayQuickly(changeDates, '1Jandate', 'Add')}>
                                                        1
                                                        Jan
                                                    </span>
                                                    |
                                                    <span className="href"

                                                        id="selectedToday"

                                                        onClick={() => changeDatetodayQuickly(changeDates, 'Today', 'Add')}>Today</span>
                                                </div>
                                                <label className="full_width">
                                                    Date

                                                </label>
                                                {/* <DatePicker selected={date}  value={Moment(changeDates).format("ddd, DD MMM yyyy")} 
                                                 minDate={new Date("ddd, DD MMM yyyy")}
                                                 maxDate={new Date("ddd, DD MMM yyyy")}
                                                 onChange={date => setDate(date)} />     */}
                                                <DatePicker className="form-control"
                                                    value={Moment(changeDates).format("ddd, DD MMM yyyy")}
                                                    onChange={handleDatedue}
                                                    dateFormat="dd/MM/yyyy"

                                                />
                                                {/* <DatePicker

                                                    label="Start Date"

                                                    styles={{ root: { width: "70%" } }}

                                                    value={date == undefined || date == null?Moment(changeDates).format("ddd, DD MMM yyyy")}

                                                    onSelectDate={(date) => setDate(date)}

                                                /> */}

                                            </div>
                                        </div>

                                        <div className="col-sm-6  session-control-buttons">
                                            <div className='row'>
                                                <div className="col-sm-4 ">
                                                    <button id="DayPlus"
                                                        className="top-container plus-button plus-minus"
                                                        onClick={() => changeDate('Date', 'AddCategory')}>
                                                        <i className="fa fa-plus"
                                                            aria-hidden="true"></i>
                                                    </button>
                                                    <span className="min-input">Day</span>
                                                    <button id="DayMinus"
                                                        className="top-container minus-button plus-minus"
                                                        onClick={() => changeDateDec('Date', 'AddCategory')}>
                                                        <i className="fa fa-minus"
                                                            aria-hidden="true"></i>
                                                    </button>
                                                </div>

                                                <div className="col-sm-4 ">
                                                    <button id="MonthPlus"
                                                        className="top-container plus-button plus-minus"
                                                        onClick={() => changeDate('month', 'AddCategory')}>
                                                        <i className="fa fa-plus"
                                                            aria-hidden="true"></i>
                                                    </button>
                                                    <span className="min-input">Month</span>
                                                    <button id="MonthMinus"
                                                        className="top-container minus-button plus-minus"
                                                        onClick={() => changeDateDec('month', 'AddCategory')}>
                                                        <i className="fa fa-minus"
                                                            aria-hidden="true"></i>
                                                    </button>
                                                </div>

                                                <div
                                                    className="col-sm-4 ">
                                                    <button id="YearPlus"
                                                        className="top-container plus-button plus-minus"
                                                        onClick={() => changeDate('Year', 'AddCategory')}>
                                                        <i className="fa fa-plus"
                                                            aria-hidden="true"></i>
                                                    </button>
                                                    <span className="min-input">Year</span>
                                                    <button id="YearMinus"
                                                        className="top-container minus-button plus-minus"
                                                        onClick={() => changeDateDec('year', 'AddCategory')}>
                                                        <i className="fa fa-minus"
                                                            aria-hidden="true"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-3 pe-0">
                                            <label ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                            <input type="text"
                                                ng-model="TimeSpentInMinutes" ng-change="getInHours(TimeSpentInMinutes)" className="form-control"
                                                value={TimeInMinutes}
                                                onChange={(e) => changeTimeFunction(e, 'Add')} />

                                        </div>
                                        <div className="col-sm-3 ps-0">
                                            <label></label>
                                            <input className="form-control bg-e9" type="text" readOnly style={{cursor:"not-allowed"}} value={`${TimeInHours > 0 ? TimeInHours : 0}  Hours`}
                                            />
                                        </div>
                                        <div
                                            className="col-sm-6  Time-control-buttons">
                                            <div className="pe-0 Quaterly-Time">
                                                <label
                                                    className="full_width"></label>
                                                <button className="btn btn-primary"
                                                    title="Decrease by 15 Min" disabled={TimeInMinutes <= 0 ? true : false}
                                                    onClick={() => changeTimesDec('15')}>
                                                    <i className="fa fa-minus"
                                                        aria-hidden="true"></i>

                                                </button>
                                                <span> 15min </span>
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
                                                <span> 60min </span>
                                                <button className="btn btn-primary"
                                                    title="Increase by 60 Min"
                                                    onClick={() => changeTimes('60', 'add', 'AddNewStructure')}>
                                                    <i className="fa fa-plus"
                                                        aria-hidden="true"></i>

                                                </button>
                                            </div>
                                        </div>
                                    </div>



                                    <div className='col-12'>
                                        <label>Short Description</label>
                                        <textarea className='full-width'
                                            id="AdditionalshortDescription"
                                            cols={15} rows={4}
                                            defaultValue={item.Description}
                                            onChange={(e) => setNewData({ ...newData, Description: e.target.value })}
                                        ></textarea>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="col-sm-3">

                            <div className="col mb-2">
                                <div>
                                    <b>
                                        <a target="_blank" ng-href="{{pageContext}}/SitePages/SmartMetadata.aspx?TabName=Timesheet">
                                            Manage
                                            Categories
                                        </a>
                                    </b>
                                </div>
                                {TimeSheet.map((Items: any) => {
                                    return (
                                        <>
                                            <div className="form-check"
                                                id="subcategorytasksPriority{{item.Id}}">
                                                <input
                                                    type="radio" className="form-check-input"
                                                    checked={showCat == Items.Title ? true : false}
                                                    // checked={selectCategories === Items.Title ? true : false}
                                                    onChange={(e) => selectCategories(e, Items.Title)}

                                                    name="taskcategory" />
                                                <label className='form-check-label'>{Items.Title}</label>
                                            </div>
                                        </>
                                    )
                                })}

                            </div>
                        </div>
                    </div>

                </div>
                <div className="modal-footer mt-1">
                    <button type="button" className="btn btn btn-default mx-1" onClick={closeTaskStatusUpdatePoup}>
                        Cancel
                    </button>
                    <button type="button" className="btn btn-primary" disabled={TimeInMinutes == 0 ? true : false} onClick={saveTimeSpent}>
                        Submit
                    </button>

                </div>
            </Panel>
            {/* ---------------------------------------------------------------------EditTime--------------------------------------------------------------------------------------------------------------------------- */}

            <Panel
                onRenderHeader={onRenderCustomHeaderEditTaskTime}
                type={PanelType.custom}
                customWidth="850px"
                isOpen={TaskStatuspopup2}
                onDismiss={closeTaskStatusUpdatePoup2}
                isBlocking={TaskStatuspopup2}
            >
                {saveEditTaskTime.map((item: any) => {
                    return (
                        <>

                            <div className="modal-body border p-3">
                                <div className="col">

                                    <div className="form-group mb-2">
                                        <label>Title</label>
                                        <input type="text" autoComplete="off"
                                            className="form-control" name="TimeTitle"
                                            defaultValue={item.Title}
                                            onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />

                                    </div>
                                    {saveEditTaskTimeChild.map((child: any, index: any) => {
                                        return (
                                            <>

                                                <div className="col ">
                                                    <div className='row'>
                                                        <div className="col-sm-6 ">
                                                            <div className="date-div">
                                                                <div className="Date-Div-BAR d-flex">
                                                                    <span className="href"

                                                                        id="selectedYear"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, 'firstdate', 'Edit')}>1st</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, '15thdate', 'Edit')}>15th</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, '1Jandate', 'Edit')}>
                                                                        1
                                                                        Jan
                                                                    </span>
                                                                    |
                                                                    <span className="href"

                                                                        id="selectedToday"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, 'Today', 'Edit')}>Today</span>
                                                                </div>
                                                                <label className="full_width">
                                                                    Date

                                                                </label>
                                                                {/* <input type="text"
                                                                    autoComplete="off"
                                                                    id="AdditionalNewDatePicker"
                                                                    className="form-control"
                                                                    ng-required="true"
                                                                    placeholder="DD/MM/YYYY"
                                                                    ng-model="AdditionalnewDate"
                                                                    value={editeddata}
                                                                    onChange={(e) => setNewData({ ...newData, TaskDate: e.target.value })} /> */}
                                                                <DatePicker className="form-control"
                                                                    value={Moment(editeddata).format("ddd, DD MMM yyyy")}
                                                                    onChange={handleDatedue}
                                                                    dateFormat="dd/MM/yyyy"

                                                                />

                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 session-control-buttons">
                                                            <div className='row'>
                                                                <div className="col-sm-4">
                                                                    <button id="DayPlus"
                                                                        className="top-container plus-button plus-minus"
                                                                        onClick={() => changeDate('Date', 'EditTime')}>
                                                                        <i className="fa fa-plus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                    <span className="min-input">Day</span>
                                                                    <button id="DayMinus"
                                                                        className="top-container minus-button plus-minus"
                                                                        onClick={() => changeDateDec('Date', 'EditTime')}>
                                                                        <i className="fa fa-minus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                </div>

                                                                <div
                                                                    className="col-sm-4">
                                                                    <button id="MonthPlus"
                                                                        className="top-container plus-button plus-minus"
                                                                        onClick={() => changeDate('month', 'EditTime')}>
                                                                        <i className="fa fa-plus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                    <span className="min-input">Month</span>
                                                                    <button id="MonthMinus"
                                                                        className="top-container minus-button plus-minus"
                                                                        onClick={() => changeDateDec('month', 'EditTime')}>
                                                                        <i className="fa fa-minus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                </div>

                                                                <div
                                                                    className="col-sm-4  ">
                                                                    <button id="YearPlus"
                                                                        className="top-container plus-button plus-minus"
                                                                        onClick={() => changeDate('Year', 'EditTime')}>
                                                                        <i className="fa fa-plus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                    <span className="min-input">Year</span>
                                                                    <button id="YearMinus"
                                                                        className="top-container minus-button plus-minus"
                                                                        onClick={() => changeDateDec('year', 'EditTime')}>
                                                                        <i className="fa fa-minus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-sm-3 pe-0">
                                                            <label
                                                                ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                            <input type="text"
                                                                className="form-control"
                                                                value={(TimeInMinutes > 0 || TimeInMinutes == undefined) ? TimeInMinutes : child.TaskTimeInMin} onChange={(e) => changeTimeFunction(e, 'Edit')} />

                                                        </div>
                                                        <div className="col-sm-3 ps-0">
                                                            <label></label>
                                                            <input className="form-control bg-e9" type="text" readOnly style={{cursor:"not-allowed"}} value={`${(TimeInHours > 0 || TimeInMinutes == undefined) ? TimeInHours : child.TaskTime} Hours`}
                                                            />
                                                        </div>
                                                        <div
                                                            className="col-sm-6 d-flex justify-content-between align-items-center">
                                                            <div className="Quaterly-Time">
                                                                <label className="full_width"></label>
                                                                <button className="btn btn-primary"
                                                                    title="Decrease by 15 Min"
                                                                    onClick={() => changeTimesDecEdit('15', child, 'EditTask')}><i className="fa fa-minus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                                <span> 15min </span>
                                                                <button className="btn btn-primary"
                                                                    title="Increase by 15 Min"
                                                                    onClick={() => changeTimesEdit('15', child, 'EditTask')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                            </div>
                                                            <div className="pe-0 Full-Time">
                                                                <label
                                                                    className="full_width"></label>
                                                                <button className="btn btn-primary"
                                                                    title="Decrease by 60 Min"
                                                                    onClick={() => changeTimesDecEdit('60', child, 'EditTask')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                                <span> 60min </span>
                                                                <button className="btn btn-primary"
                                                                    title="Increase by 60 Min"
                                                                    onClick={() => changeTimesEdit('60', child, 'EditTask')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-sm-12 ">
                                                        <label>Short Description</label>
                                                        <textarea className='full_width'
                                                            id="AdditionalshortDescription"
                                                            cols={15} rows={4} defaultValue={child.Description
                                                            }
                                                            onChange={(e) => setPostData({ ...postData, Description: e.target.value })}
                                                        ></textarea>
                                                    </div>

                                                </div>
                                                <footer>
                                                    <div className='row'>
                                                        <div className="col-sm-6 ">
                                                            <div className="text-left">
                                                                Created
                                                                <span>{child.TaskTimeCreatedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.AuthorTitle}</span>
                                                            </div>
                                                            <div className="text-left">
                                                                Last modified
                                                                <span>{child.TaskTimeModifiedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.EditorTitle}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 text-end">
                                                            {/* <a target="_blank"
                                                                        ng-if="AdditionalTaskTime.siteListName != 'SP.Data.TasksTimesheet2ListItem'"
                                                                        ng-href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID={{AdditionalTaskTime.ParentID}}">
                                                                        Open out-of-the-box
                                                                        form
                                                                    </a> */}
                                                            <a target="_blank"
                                                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${child.ParentID}`}>
                                                                Open out-of-the-box
                                                                form
                                                            </a>
                                                            <button type="button" className="btn btn-primary ms-2"
                                                                onClick={(e) => UpdateAdditionaltime(child)}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </footer>
                                            </>
                                        )
                                    })}
                                </div>



                            </div>


                        </>
                    )
                })}

            </Panel>



            {/* ----------------------------------------------------------------------------Copy Task------------------------------------------------------------------------------------------------------------ */}


            <Panel
               onRenderHeader={onRenderCustomHeaderCopyTaskTime}
                type={PanelType.custom}
                customWidth="850px"
                isOpen={CopyTaskpopup}
                onDismiss={closeCopyTaskpopup}
                isBlocking={CopyTaskpopup}
            >
                {saveCopyTaskTime.map((item: any) => {
                    return (
                        <>

                            <div className="modal-body border p-3">
                                <div className="col">

                                    <div className="form-group mb-2">
                                        <label>Title</label>
                                        <input type="text" autoComplete="off"
                                            className="form-control" name="TimeTitle"
                                            defaultValue={item.Title}
                                            onChange={(e) => setPostData({ ...postData, Title: e.target.value })} />

                                    </div>
                                    {saveCopyTaskTimeChild.map((child: any, index: any) => {
                                        return (
                                            <>

                                                <div className="col">
                                                    <div className='row'>
                                                        <div className="col-sm-6 ">
                                                            <div className="date-div">
                                                                <div className="Date-Div-BAR d-flex">
                                                                    <span className="href"

                                                                        id="selectedYear"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, 'firstdate', 'Edit')}>1st</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, '15thdate', 'Edit')}>15th</span>
                                                                    | <span className="href"

                                                                        id="selectedYear"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, '1Jandate', 'Edit')}>
                                                                        1
                                                                        Jan
                                                                    </span>
                                                                    |
                                                                    <span className="href"

                                                                        id="selectedToday"

                                                                        onClick={() => changeDatetodayQuickly(child.TaskDate, 'Today', 'Edit')}>Today</span>
                                                                </div>
                                                                <label className="full_width">
                                                                    Date

                                                                </label>
                                                                {/* <input type="text"
                                                                    autoComplete="off"
                                                                    id="AdditionalNewDatePicker"
                                                                    className="form-control"
                                                                    ng-required="true"
                                                                    placeholder="DD/MM/YYYY"
                                                                    ng-model="AdditionalnewDate"
                                                                    value={Moment(changeDates).format('ddd, DD MMM yyyy')}
                                                                    onChange={(e) => setNewData({ ...newData, TaskDate: e.target.value })} /> */}
                                                                <DatePicker className="form-control"
                                                                    value={Moment(changeDates).format("ddd, DD MMM yyyy")}
                                                                    onChange={handleDatedue}
                                                                    dateFormat="dd/MM/yyyy" />

                                                            </div>
                                                        </div>

                                                        <div className="col-sm-6 session-control-buttons">
                                                            <div className='row'>
                                                                <div className="col-sm-4">
                                                                    <button id="DayPlus"
                                                                        className="top-container plus-button plus-minus"
                                                                        onClick={() => changeDate('Date', 'EditTime')}>
                                                                        <i className="fa fa-plus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                    <span className="min-input">Day</span>
                                                                    <button id="DayMinus"
                                                                        className="top-container minus-button plus-minus"
                                                                        onClick={() => changeDateDec('Date', 'EditTime')}>
                                                                        <i className="fa fa-minus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                </div>

                                                                <div
                                                                    className="col-sm-4">
                                                                    <button id="MonthPlus"
                                                                        className="top-container plus-button plus-minus"
                                                                        onClick={() => changeDate('month', 'EditTime')}>
                                                                        <i className="fa fa-plus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                    <span className="min-input">Month</span>
                                                                    <button id="MonthMinus"
                                                                        className="top-container minus-button plus-minus"
                                                                        onClick={() => changeDateDec('month', 'EditTime')}>
                                                                        <i className="fa fa-minus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                </div>

                                                                <div
                                                                    className="col-sm-4  ">
                                                                    <button id="YearPlus"
                                                                        className="top-container plus-button plus-minus"
                                                                        onClick={() => changeDate('Year', 'EditTime')}>
                                                                        <i className="fa fa-plus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                    <span className="min-input">Year</span>
                                                                    <button id="YearMinus"
                                                                        className="top-container minus-button plus-minus"
                                                                        onClick={() => changeDateDec('year', 'EditTime')}>
                                                                        <i className="fa fa-minus"
                                                                            aria-hidden="true"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-2">
                                                        <div className="col-sm-3 pe-0">
                                                            <label
                                                                ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                                            <input type="text"
                                                                className='form-control'
                                                                name="timeSpent"
                                                                ng-model="TimeSpentInMinutes" ng-change="getInHours(TimeSpentInMinutes)"
                                                                value={(TimeInMinutes > 0 || TimeInMinutes == undefined) ? TimeInMinutes : child.TaskTimeInMin} onChange={(e) => changeTimeFunction(e, 'Edit')} />

                                                        </div>
                                                        <div className="col-sm-3 ps-0">
                                                            <label></label>
                                                            <input className="form-control bg-e9" readOnly style={{cursor:"not-allowed"}} type="text" value={`${TimeInHours != 0 ? TimeInHours : child.TaskTime} Hours`}
                                                                onChange={(e) => setPostData({ ...postData, TaskTime: e.target.value })} />
                                                        </div>
                                                        <div
                                                            className="col-sm-6 d-flex justify-content-between align-items-center">
                                                            <div className="Quaterly-Time">
                                                                <label className="full_width"></label>
                                                                <button className="btn btn-primary"
                                                                    title="Decrease by 15 Min"
                                                                    onClick={() => changeTimesDecEdit('15', child, 'EditTask')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                                <span> 15min </span>
                                                                <button className="btn btn-primary"
                                                                    title="Increase by 15 Min"
                                                                    onClick={() => changeTimesEdit('15', child, 'EditTask')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                            </div>
                                                            <div className="pe-0 Full-Time">
                                                                <label
                                                                    className="full_width"></label>
                                                                <button className="btn btn-primary"
                                                                    title="Decrease by 60 Min"
                                                                    onClick={() => changeTimesDecEdit('60', child, 'EditTask')}>
                                                                    <i className="fa fa-minus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                                <span> 60min </span>
                                                                <button className="btn btn-primary"
                                                                    title="Increase by 60 Min"
                                                                    onClick={() => changeTimesEdit('60', child, 'EditTask')}>
                                                                    <i className="fa fa-plus"
                                                                        aria-hidden="true"></i>

                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="col-sm-12 ">
                                                        <label>Short Description</label>
                                                        <textarea className='full_width'
                                                            id="AdditionalshortDescription"
                                                            cols={15} rows={4} defaultValue={child.Description
                                                            }
                                                            onChange={(e) => setPostData({ ...postData, Description: e.target.value })}
                                                        ></textarea>
                                                    </div>

                                                </div>
                                                <footer>
                                                    <div className='row mt-2'>
                                                        <div className="col-sm-6 ">
                                                            <div className="text-left">
                                                                Created
                                                                <span>{child.TaskTimeCreatedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.AuthorTitle}</span>
                                                            </div>
                                                            <div className="text-left">
                                                                Last modified
                                                                <span>{child.TaskTimeModifiedDate}</span>
                                                                by <span
                                                                    className="siteColor">{child.EditorTitle}</span>
                                                            </div>
                                                        </div>
                                                        <div className="col-sm-6 text-end">
                                                            {/* <a target="_blank"
                                                                        ng-if="AdditionalTaskTime.siteListName != 'SP.Data.TasksTimesheet2ListItem'"
                                                                        ng-href="https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID={{AdditionalTaskTime.ParentID}}">
                                                                        Open out-of-the-box
                                                                        form
                                                                    </a> */}
                                                            <a target="_blank"
                                                                ng-if="AdditionalTaskTime.siteListName === 'SP.Data.TasksTimesheet2ListItem'"
                                                                href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/Lists/TaskTimeSheetListNew/EditForm.aspx?ID=${child.ParentID}`}>
                                                                Open out-of-the-box
                                                                form
                                                            </a>
                                                            <button type="button" className="btn btn-primary ms-2"
                                                                onClick={() => SaveCopytime(child)}>
                                                                Save
                                                            </button>
                                                        </div>
                                                    </div>
                                                </footer>
                                            </>
                                        )
                                    })}
                                </div>



                            </div>


                        </>
                    )
                })}

            </Panel>


            {/* ----------------------------------------Add Time Popup------------------------------------------------------------------------------------------------------------------------------------- */}

            <Panel
               onRenderHeader={onRenderCustomHeaderAddTaskTime}
                type={PanelType.custom}
                customWidth="850px"
                isOpen={AddTaskTimepopup}
                onDismiss={closeAddTaskTimepopup}
                isBlocking={AddTaskTimepopup}
            >
                <div className="modal-body  border p-3  ">



                    <div className="col-sm-12">
                        <div className="col-sm-12 p-0 form-group">
                            <div className='row'>
                                <div className="col-sm-6">
                                    <div className="date-div">
                                        <div className="Date-Div-BAR d-flex">
                                            <span className="href"

                                                id="selectedYear"

                                                onClick={() => changeDatetodayQuickly(changeDates, 'firstdate', 'Add')}>1st</span>
                                            | <span className="href"

                                                id="selectedYear"

                                                onClick={() => changeDatetodayQuickly(changeDates, '15thdate', 'Add')}>15th</span>
                                            | <span className="href"

                                                id="selectedYear"

                                                onClick={() => changeDatetodayQuickly(changeDates, '1Jandate', 'Add')}>
                                                1
                                                Jan
                                            </span>
                                            |
                                            <span className="href"

                                                id="selectedToday"

                                                onClick={() => changeDatetodayQuickly(changeDates, 'Today', 'Add')}>Today</span>
                                        </div>
                                        <label className="full_width">
                                            Date

                                        </label>
                                        {/* <input type="text"
                                            autoComplete="off"
                                            id="AdditionalNewDatePicker"
                                            className="form-control"
                                            ng-required="true"
                                            placeholder="DD/MM/YYYY"

                                            value={Moment(changeDates).format('ddd, DD MMM yyyy')}
                                            onChange={(e) => setPostData({ ...postData, TaskDate: e.target.value })} /> */}
                                        <DatePicker className="form-control"
                                            value={Moment(changeDates).format("ddd, DD MMM yyyy")}
                                            onChange={handleDatedue}
                                            dateFormat="dd/MM/yyyy" />

                                    </div>
                                </div>

                                <div
                                    className="col-sm-6 session-control-buttons">
                                    <div className='row'>
                                        <div
                                            className="col-sm-4 ">
                                            <button id="DayPlus"
                                                className="top-container plus-button plus-minus"
                                                onClick={() => changeDate('Date', 'AddTime')}>
                                                <i className="fa fa-plus"
                                                    aria-hidden="true"></i>
                                            </button>
                                            <span className="min-input">Day</span>
                                            <button id="DayMinus"
                                                className="top-container minus-button plus-minus"
                                                onClick={() => changeDateDec('Date', 'AddTime')}>
                                                <i className="fa fa-minus"
                                                    aria-hidden="true"></i>
                                            </button>
                                        </div>

                                        <div
                                            className="col-sm-4 ">
                                            <button id="MonthPlus"
                                                className="top-container plus-button plus-minus"
                                                onClick={() => changeDate('month', 'AddTime')}>
                                                <i className="fa fa-plus"
                                                    aria-hidden="true"></i>
                                            </button>
                                            <span className="min-input">Month</span>
                                            <button id="MonthMinus"
                                                className="top-container minus-button plus-minus"
                                                onClick={() => changeDateDec('month', 'AddTime')}>
                                                <i className="fa fa-minus"
                                                    aria-hidden="true"></i>
                                            </button>
                                        </div>

                                        <div
                                            className="col-sm-4">
                                            <button id="YearPlus"
                                                className="top-container plus-button plus-minus"
                                                onClick={() => changeDate('Year', 'AddTime')}>
                                                <i className="fa fa-plus"
                                                    aria-hidden="true"></i>
                                            </button>
                                            <span className="min-input">Year</span>
                                            <button id="YearMinus"
                                                className="top-container minus-button plus-minus"
                                                onClick={() => changeDateDec('year', 'AddTime')}>
                                                <i className="fa fa-minus"
                                                    aria-hidden="true"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-2">
                                <div className="col-sm-3 pe-0">
                                    <label
                                        ng-bind-html="GetColumnDetails('TimeSpent') | trustedHTML"></label>
                                    <input type="text"
                                        autoComplete="off"
                                        className="form-control"
                                        value={TimeInMinutes} onChange={(e) => changeTimeFunction(e, 'Add')} />

                                </div>
                                <div className="col-sm-3 ps-0">
                                    <label></label>
                                    <input className="form-control bg-e9" type="text"
                                        value={`${TimeInHours} Hours`} />
                                </div>
                                <div
                                    className="col-sm-6  Time-control-buttons">
                                    <div className="pe-0 Quaterly-Time">
                                        <label
                                            className="full_width"></label>
                                        <button className="btn btn-primary"
                                            title="Decrease by 15 Min" disabled={TimeInMinutes <= 0 ? true : false}
                                            onClick={() => changeTimesDec('15')}>
                                            <i className="fa fa-minus"
                                                aria-hidden="true"></i>

                                        </button>
                                        <span> 15min </span>
                                        <button className="btn btn-primary"
                                            title="Increase by 15 Min"
                                            onClick={() => changeTimes('15', 'add', 'AddTime')}>
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
                                        <span> 60min </span>
                                        <button className="btn btn-primary"
                                            title="Increase by 60 Min"
                                            onClick={() => changeTimes('60', 'add', 'AddTime')}>
                                            <i className="fa fa-plus"
                                                aria-hidden="true"></i>

                                        </button>
                                    </div>
                                </div>
                            </div>


                            <div className="col-sm-12 p-0">
                                <label>Short Description</label>
                                <textarea className='full_width'
                                    id="AdditionalshortDescription"
                                    cols={15} rows={4}

                                    onChange={(e) => setPostData({ ...postData, Description: e.target.value })}
                                ></textarea>
                            </div>

                        </div>
                        <footer>
                            <div className='row'>
                                {/* <div className="col-sm-6 ">
                <div className="text-left">
                    Created
                    <span></span>
                    by <span
                        className="siteColor"></span>
                </div>
                <div className="text-left">
                    Last modified
                    <span></span>
                    by <span
                        className="siteColor"></span>
                </div>
            </div> */}
                                <div className="col-sm-12 text-end mt-2">

                                    <button disabled={TimeInMinutes == 0 ? true : false} type="button" className="btn btn-primary ms-2"
                                        onClick={AddTaskTime}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </footer>

                    </div>



                </div>
            </Panel>




            {/* --------------------------------------------------------------------------Start EDit Category------------------------------------------------------------------------------------------- */}

            <Panel
                onRenderHeader={onRenderCustomHeaderEditCategory}
                type={PanelType.custom}
                customWidth="850px"
                isOpen={Editcategory}
                onDismiss={closeEditcategorypopup}
                isBlocking={Editcategory}
            >
                <div className="modal-body border  p-3  ">

                    <div className='row'>
                        {categoryData?.map((item) => {
                            return (
                                <div className="col-sm-9 border-end" >
                                    <div className='mb-3'>
                                        <div className=" form-group">
                                            <label>Selected Category</label>
                                            <input type="text" autoComplete="off"
                                                className="form-control"
                                                name="CategoriesTitle"
                                                value={checkCategories != undefined ? checkCategories : item.Category.Title}
                                            />
                                        </div>
                                    </div>
                                    <div className='mb-3'>
                                        <div className=" form-group" key={checkCategories}>
                                            <label>Title</label>
                                            <input type="text" autoComplete="off"
                                                className="form-control" name="TimeTitle"
                                                defaultValue={checkCategories != undefined ? checkCategories : item.Title}
                                                onChange={(e) => setNewData({ ...newData, Title: e.target.value })} />
                                        </div>
                                    </div>

                                </div>
                            )
                        })}

                        <div className="col-sm-3">

                            <div className="col mb-2">
                                <div>
                                    <a target="_blank" ng-href="{{pageContext}}/SitePages/SmartMetadata.aspx?TabName=Timesheet">
                                        Manage
                                        Categories
                                    </a>
                                </div>
                                {TimeSheet.map((Items: any) => {
                                    return (
                                        <>
                                            <div className="form-check"
                                                id="subcategorytasksPriority{{item.Id}}">
                                                <input
                                                    type="radio" className="form-check-input"
                                                    value={Items.Title} defaultChecked={Items.Title == Categoryy}
                                                    onChange={() => setcheckCategories(Items.Title)}
                                                    name="taskcategory" />
                                                <label className='form-check-label'>{Items.Title}</label>
                                            </div>
                                        </>
                                    )
                                })}

                            </div>
                        </div>
                    </div>

                </div>
                <div className="modal-footer mt-2">
                    <button type="button" className="btn btn-primary" onClick={updateCategory}>
                        Submit
                    </button>

                </div>
            </Panel>
        </div>
    )
}

export default TimeEntryPopup;

function changeDates(arg0: any): any {
    throw new Error('Function not implemented.');
}