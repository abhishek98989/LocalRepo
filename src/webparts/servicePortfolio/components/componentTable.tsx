import * as React from "react";
import { Component } from "react";
import * as $ from "jquery";
import * as Moment from "moment";
//import '../../cssFolder/foundation.scss';
import { Modal, Panel, PanelType } from "office-ui-fabric-react";
//import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaPrint,
  FaFileExcel,
  FaPaintBrush,
  FaSearch,
  FaSort,
  FaSortDown,
  FaSortUp,
  FaInfoCircle,
  FaChevronRight,
  FaChevronDown,
  FaMinus,
  FaPlus,
  FaCompressArrowsAlt,
} from "react-icons/fa";
import { CSVLink } from "react-csv";
import pnp, { Web, SearchQuery, SearchResults, UrlException } from "sp-pnp-js";
//import SmartFilter from './SmartFilter';
//import '../../cssFolder/foundation.scss';
import { map } from "jquery";
import EditInstituton from "../../EditPopupFiles/EditComponent";
import TimeEntryPopup from "../../../globalComponents/TimeEntry/TimeEntryComponent";
import EditTaskPopup from "../../../globalComponents/EditTaskPopup/EditTaskPopup";
import ExpndTable from "../../../globalComponents/ExpandTable/Expandtable";
import { GlobalConstants } from "../../../globalComponents/LocalCommon";
import * as globalCommon from "../../../globalComponents/globalCommon";
import ShowTaskTeamMembers from "../../../globalComponents/ShowTaskTeamMembers";
import { PortfolioStructureCreationCard } from "../../../globalComponents/tableControls/PortfolioStructureCreation";
import CreateActivity from "../../servicePortfolio/components/CreateActivity";
import CreateWS from "../../servicePortfolio/components/CreateWS";
import "bootstrap/dist/css/bootstrap.min.css";
import Tooltip from "../../../globalComponents/Tooltip";
import {
  Column, Table,
  ExpandedState, useReactTable, getCoreRowModel, getFilteredRowModel, getExpandedRowModel, ColumnDef, flexRender, getSortedRowModel, SortingState,
  ColumnFiltersState, FilterFn, getFacetedUniqueValues, getFacetedRowModel
} from "@tanstack/react-table";
import { RankingInfo, rankItem, compareItems } from "@tanstack/match-sorter-utils";
import "bootstrap/dist/css/bootstrap.min.css";
import { HTMLProps } from "react";
// import HighlightableCell from "../../componentPortfolio/components/highlight";
import Loader from "react-loader";
// import ShowTeamMembers from "../../../globalComponents/ShowTeamMember";
// import ShowClintCatogory from "../../../globalComponents/ShowClintCatogory";
// import GlobalCommanTable from "../../../globalComponents/GlobalCommanTable";
var filt: any = "";
var siteConfig: any = [];
var ComponentsDataCopy: any = [];
var SubComponentsDataCopy: any = [];
var FeatureDataCopy: any = [];
var array: any = [];
var childsData: any = [];
let ChengedTitle: any = "";
var ContextValue: any = {};
let AllActivitysData: any = [];
let AllWorkStreamData: any = [];
let globalFilterHighlited: any;
let showPopHover: any;
let popHoverDataGroup: any = []
let Renderarray: any = [];
let AllDataRender: any = [];
let forceExpanded: any = [];
// ReactTable Part/////
declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

///Global Filter Parts//////
// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <>
      <div className="container-2 mx-1">
        <span className="icon"><FaSearch /></span>
        <input type="search" id="search" {...props}
          value={value}
          onChange={(e) => setValue(e.target.value)} />
      </div>
    </>
  );
}


function Filter({
  column,
  table,
  placeholder,
}: {
  column: Column<any, any>;
  table: Table<any>;
  placeholder: any;
}): any {
  const columnFilterValue = column.getFilterValue();
  // style={{ width: placeholder?.size }}
  return (
    <input
      className="me-1 mb-1 on-search-cross form-control "
      // type="text"
      title={placeholder?.placeholder}
      type="search"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`${placeholder?.placeholder}`}
    // className="w-36 border shadow rounded"
    />
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
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

// ReactTable Part end/////

function ComponentTable(SelectedProp: any) {
  try {
    if (SelectedProp?.SelectedProp != undefined) {
      SelectedProp.SelectedProp.isShowTimeEntry = JSON.parse(
        SelectedProp?.SelectedProp?.TimeEntry
      );

      SelectedProp.SelectedProp.isShowSiteCompostion = JSON.parse(
        SelectedProp?.SelectedProp?.SiteCompostion
      );
    }
  } catch (e) {
    console.log(e);
  }
  const [selectedSearchDuration, setSelectedSearchDuration] = React.useState("All Words");
  const [Display, setDisplay] = React.useState("none");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [expanded, setExpanded] = React.useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const refreshData = () => setData(() => array);
  const rerender = React.useReducer(() => ({}), {})[1];
  const [loaded, setLoaded] = React.useState(true);
  const [color, setColor] = React.useState(false);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [popHoverData, setPopHoverData] = React.useState([])
  const [globalFilter, setGlobalFilter] = React.useState("");
  globalFilterHighlited = globalFilter;
  const [checkData, setcheckData] = React.useState([])
  const [showTeamMemberOnCheck, setShowTeamMemberOnCheck] = React.useState(false)
  const [ShowTeamPopup, setShowTeamPopup] = React.useState(false);
  const [checkCounter, setCheckCounter] = React.useState(true)
  const [createTaskId, setCreateTaskId] = React.useState({});
  const [isOpenCreateTask, setisOpenCreateTask] = React.useState(false);

  const [maidataBackup, setmaidataBackup] = React.useState([]);
  const [search, setSearch]: [string, (search: string) => void] = React.useState("");
  const [data, setData] = React.useState([]);
  Renderarray = data;
  const refreshDataTaskLable = () => setData(() => Renderarray);
  const [Title, setTitle] = React.useState();
  const [ComponentsData, setComponentsData] = React.useState([]);
  const [SubComponentsData, setSubComponentsData] = React.useState([]);
  const [TotalTask, setTotalTask] = React.useState([]);
  //const [childsData, setchildsData] = React.useState<any>([])
  const [ActivityDisable, setActivityDisable] = React.useState(true);
  // const [checkedList, setMeetingItems] = React.useState<any>([])
  const [ActivityPopup, setActivityPopup] = React.useState(false);
  const [TaggedAllTask, setTaggedAllTask] = React.useState([]);
  const [FeatureData, setFeatureData] = React.useState([]);
  const [MeetingPopup, setMeetingPopup] = React.useState(false);
  // const [table, setTable] = React.useState(data);
  const [WSPopup, setWSPopup] = React.useState(false);
  const [AllUsers, setTaskUser] = React.useState([]);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [state, setState] = React.useState([]);
  const [filterGroups, setFilterGroups] = React.useState([]);
  const [filterItems, setfilterItems] = React.useState([]);
  const [AllMetadata, setMetadata] = React.useState([])
  const [AllClientCategory, setAllClientCategory] = React.useState([])
  const [IsComponent, setIsComponent] = React.useState(false);
  const [SharewebComponent, setSharewebComponent] = React.useState("");
  const [IsTask, setIsTask] = React.useState(false);
  const [SharewebTask, setSharewebTask] = React.useState("");
  const [SharewebTimeComponent, setSharewebTimeComponent] = React.useState([]);
  const [IsTimeEntry, setIsTimeEntry] = React.useState(false);
  const [ShowSelectdSmartfilter, setShowSelectdSmartfilter] = React.useState(
    []
  );
  const [checked, setchecked] = React.useState([]);
  const [IsUpdated, setIsUpdated] = React.useState("");
  const [tablecontiner, settablecontiner]: any = React.useState("hundred");
  const [Isshow, setIsshow] = React.useState(false);
  const [checkedList, setCheckedList] = React.useState([]);
  const [TotalArrayBackup, setTotalArrayBackup] = React.useState([]);
  const [IsSmartfilter, setIsSmartfilter] = React.useState(false);
  const [AllTasksData, setAllTasks] = React.useState([]);
  const [AllMasterTasks, setAllMasterTasks] = React.useState([]);
  const [AllCountItems, setAllCountItems] = React.useState({
    AllComponentItems: [],
    AllSubComponentItems: [],
    AllFeaturesItems: [],
    AfterSearchComponentItems: [],
    AfterSearchSubComponentItems: [],
    AfterSearchFeaturesItems: [],
  });
  const [OldArrayBackup, setOldArrayBackup] = React.useState([]);
  const [NewArrayBackup, setNewArrayBackup] = React.useState([]);
  const [ResturuningOpen, setResturuningOpen] = React.useState(false);
  const [RestructureChecked, setRestructureChecked] = React.useState([]);
  const [ChengedItemTitl, setChengedItemTitle] = React.useState("");

  //--------------SmartFiltrt--------------------------------------------------------------------------------------------------------------------------------------------------

  var IsExitSmartfilter = function (array: any, Item: any) {
    var isExists = false;
    var count = 0;
    Item.MultipleTitle = "";
    map(array, (item) => {
      if (
        item.TaxType != undefined &&
        Item.Title != undefined &&
        item.TaxType == Item.Title
      ) {
        isExists = true;
        count++;
        Item.MultipleTitle += item.Title + ", ";
        return false;
      }
    });
    if (Item.MultipleTitle != "")
      Item.MultipleTitle = Item.MultipleTitle.substring(
        0,
        Item.MultipleTitle.length - 2
      );
    Item.count = count;
    return isExists;
  };

  var issmartExists = function (array: any, title: any) {
    var isExists = false;
    map(array, (item) => {
      if (item.Title == title.Title) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  const closeTaskStatusUpdatePoup2 = () => {
    checkedList?.forEach((val: any): any => {
      val.chekBox = false;
    });
    setActivityPopup(false);
  };
  const openActivity = () => {
    if (checkedList.length > 1) {
      alert(
        "More than 1 Parents selected, Select only 1 Parent to create a child item"
      );
    } else {
      if (checkedList[0] != undefined) {
        if (checkedList[0].SharewebTaskType != undefined) {
          if (checkedList[0].SharewebTaskType.Title === "Activities") {
            setWSPopup(true);
          }
        }
        if (
          checkedList != undefined &&
          checkedList[0].SharewebTaskType?.Title === "Workstream"
        ) {
          setActivityPopup(true);
        }
        if (
          checkedList[0].Portfolio_x0020_Type === "Service" &&
          checkedList[0].SharewebTaskType === undefined
          // &&
          // checkedList[0] === undefined
        ) {
          checkedList[0]["NoteCall"] = "Activities";
          setMeetingPopup(true);
        }
        if (
          checkedList[0].Portfolio_x0020_Type === "Component" &&
          checkedList[0].SharewebTaskType === undefined
          // &&
          // checkedList[0] == undefined
        ) {
          setActivityPopup(true);
        }
      }
    }

    if (
      checkedList[0] != undefined &&
      checkedList[0].SharewebTaskType != undefined
    ) {
      if (checkedList[0].SharewebTaskType.Title == "Activities") {
        setWSPopup(true);
        // checkedList.push(checkedList[0]);
        //setMeetingItems(childsData)
      }
    }

    if (
      checkedList[0] != undefined &&
      checkedList[0].SharewebTaskType.Title == "Workstream"
    ) {
      setActivityPopup(true);
      // checkedList.push(checkedList[0]);
    }
  };
  const ShowSelectedfiltersItems = () => {
    var ArrayItem: any = [];
    var arrayselect: any = [];
    $.each(filterItems, function (index: any, newite: any) {
      if (newite.Selected === true) {
        arrayselect.push(newite);
      }
      if (newite.childs != undefined && newite.childs.length > 0) {
        newite.childs.forEach((obj: any) => {
          if (obj.Selected === true) {
            arrayselect.push(obj);
          }
        });
      }
    });
    if (arrayselect != undefined) {
      map(arrayselect, (smart) => {
        var smartfilterItems: any = {};
        smartfilterItems.Title = smart.TaxType;
        if (IsExitSmartfilter(arrayselect, smartfilterItems)) {
          if (smartfilterItems.count >= 3) {
            smartfilterItems.selectTitle =
              " : (" + smartfilterItems.count + ")";
          } else
            smartfilterItems.selectTitle =
              " : " + smartfilterItems.MultipleTitle;
        }
        if (!issmartExists(ArrayItem, smartfilterItems))
          ArrayItem.push(smartfilterItems);
      });
    }
    setShowSelectdSmartfilter((ShowSelectdSmartfilter) => [...ArrayItem]);
  };

  const SingleLookDatatest = (e: any, item: any, value: any) => {
    const { checked } = e.target;
    if (checked) {
      item.Selected = true;
      if (item.childs != undefined && item.childs.length > 0) {
        map(item.childs, (child) => {
          child.Selected = true;
        });
      }
    } else {
      $.each(filterItems, function (index: any, newite: any) {
        if (newite.Title == item.Title) {
          newite.Selected = false;
        }
        if (newite.childs != undefined && newite.childs.length > 0) {
          newite.childs.forEach((obj: any) => {
            if (obj.Title == item.Title) {
              obj.Selected = false;
            }
          });
        }
      });
    }
    setfilterItems((filterItems) => [...filterItems]);
    ShowSelectedfiltersItems();
    // setState(state)
  };
  const Clearitem = () => {
    maidataBackup.forEach(function (val: any) {
      val.show = false;
      if (val.childs != undefined) {
        val.childs.forEach(function (i: any) {
          i.show = false;
          if (i.childs != undefined) {
            i.childs.forEach(function (subc: any) {
              subc.show = false;
              if (subc.childs != undefined) {
                subc.childs.forEach(function (last: any) {
                  last.show = false;
                });
              }
            });
          }
        });
      }
    });
    filterItems.forEach(function (itemm: any) {
      itemm.Selected = false;
    });

    setSubComponentsData(SubComponentsDataCopy);
    setFeatureData(FeatureDataCopy);
    setmaidataBackup(ComponentsDataCopy);
    setShowSelectdSmartfilter([]);

    setState([]);

    setData(maidataBackup);
    // const { checked } = e.target;
  };
  const getCommonItems = function (arr1: any, arr2: any) {
    var commonItems: any = [];
    arr1.forEach((item1: any) => {
      arr2.forEach((item2: any) => {
        if (item1.Id === item2.Id && item1.siteType == item2.siteType) {
          commonItems.push(item2);
          return false;
        }
      });
    });
    return commonItems;
  };

  const Updateitem = function () {
    var selectedFilters: any = [];
    $.each(filterItems, function (index: any, newite: any) {
      if (newite.Selected === true) {
        selectedFilters.push(newite);
      }
      if (newite.childs != undefined && newite.childs.length > 0) {
        newite.childs.forEach((obj: any) => {
          if (obj.Selected === true) {
            selectedFilters.push(obj);
          }
        });
      }
    });

    if (selectedFilters.length > 0) {
      var PortfolioItems: any = [];
      var PriorityItems: any = [];
      var TypeItems = [];
      var ResponsibilityItems: any = [];
      var ItemRankItems: any = [];
      var PercentCompleteItems: any = [];
      var DueDateItems: any = [];
      var isDueDateSelected = false;
      var SitesItems: any = [];
      var isSitesSelected = false;
      var isPortfolioSelected = false;
      var isPrioritySelected = false;
      var isItemRankSelected = false;
      var isTypeSelected = false;
      var isResponsibilitySelected = false;
      var isPercentCompleteSelected = false;
      var AllData: any = [];
      AllTasksData.forEach((item: any) => {
        AllData.push(item);
      });
      AllMasterTasks.forEach((item: any) => {
        AllData.push(item);
      });
      AllData.forEach((item: any) => {
        selectedFilters.forEach((filterItem: any) => {
          if (filterItem.Selected)
            switch (filterItem.TaxType) {
              case "Portfolio":
                if (item.Item_x0020_Type != undefined) {
                  if (
                    item.Item_x0020_Type != undefined &&
                    item.Item_x0020_Type == filterItem.Title &&
                    !isItemExistsNew(PortfolioItems, item)
                  ) {
                    PortfolioItems.push(item);
                    return false;
                  }
                }
                isPortfolioSelected = true;
                break;
              case "Priority":
                if (item.Priority != undefined) {
                  if (
                    item.Priority != undefined &&
                    item.Priority == filterItem.Title &&
                    !isItemExistsNew(PriorityItems, item)
                  ) {
                    PriorityItems.push(item);
                    return false;
                  }
                }
                isPrioritySelected = true;
                break;
              case "ItemRank":
                if (item.ItemRank != undefined) {
                  if (
                    item.ItemRank != undefined &&
                    item.ItemRank == filterItem.Title &&
                    !isItemExistsNew(ItemRankItems, item)
                  ) {
                    ItemRankItems.push(item);
                    return false;
                  }
                }
                isItemRankSelected = true;
                break;
              // case 'Sites':
              //     if (item.ItemRank != undefined) {
              //         if (item.siteType != undefined && item.siteType == filterItem.Title && !isItemExistsNew(SitesItems, item)) {
              //             SitesItems.push(item);
              //             return false;
              //         }
              //     }
              //     isSitesSelected = true;
              //     break;
              case "PercentComplete":
                if (item.PercentComplete != undefined) {
                  if (
                    item.PercentComplete != undefined &&
                    item.PercentComplete == filterItem.Title &&
                    !isItemExistsNew(PercentCompleteItems, item)
                  ) {
                    PercentCompleteItems.push(item);
                    return false;
                  }
                }
                isPercentCompleteSelected = true;
                break;
              case "Team Members":
                if (item.AllTeamName != undefined) {
                  if (
                    item.AllTeamName != undefined &&
                    item.AllTeamName.toLowerCase().indexOf(
                      filterItem.Title.toLowerCase()
                    ) > -1 &&
                    !isItemExistsNew(ResponsibilityItems, item)
                  ) {
                    ResponsibilityItems.push(item);
                    return false;
                  }
                }
                isResponsibilitySelected = true;
                break;
            }
        });
      });
      var commonItems: any = [];
      if (isPortfolioSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, PortfolioItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...PortfolioItems];
      }
      if (isResponsibilitySelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, ResponsibilityItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...ResponsibilityItems];
      }
      if (isPrioritySelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, PriorityItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...PriorityItems];
      }
      if (isItemRankSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, ItemRankItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...ItemRankItems];
      }
      if (isSitesSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, SitesItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...SitesItems];
      }
      if (isPercentCompleteSelected) {
        if (commonItems != undefined && commonItems.length > 0) {
          commonItems = getCommonItems(commonItems, PercentCompleteItems);
          if (commonItems.length == 0) {
            PortfolioItems = null;
            TypeItems = null;
            PriorityItems = null;
            ResponsibilityItems = null;
            ItemRankItems = null;
            PercentCompleteItems = null;
            DueDateItems = null;
            SitesItems = null;
          }
        } else commonItems = [...PercentCompleteItems];
      }
      let arrayItem = [...TotalArrayBackup];
      arrayItem.forEach((item: any, pareIndex: any) => {
        item.flag = false;
        if (item.childs != undefined && item.childs.length > 0) {
          item.childs.forEach((child: any, parentIndex: any) => {
            child.flag = false;
            if (child.childs != undefined && child.childs.length > 0) {
              child.childs.forEach((subchild: any, index: any) => {
                subchild.flag = false;
                if (
                  subchild.childs != undefined &&
                  subchild.childs.length > 0
                ) {
                  subchild.childs.forEach((subchilds: any, index: any) => {
                    subchilds.flag = false;
                    if (
                      subchilds.childs != undefined &&
                      subchilds.childs.length > 0
                    ) {
                      subchilds.childs.forEach(
                        (Lastsubchilds: any, index: any) => {
                          Lastsubchilds.flag = false;
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });

      let Subcomponnet = commonItems.filter(
        (sub: { Item_x0020_Type: string }) =>
          sub.Item_x0020_Type === "SubComponent"
      );
      var Componnet = commonItems.filter(
        (sub: { Item_x0020_Type: string }) =>
          sub.Item_x0020_Type === "Component"
      );
      var Features = commonItems.filter(
        (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Feature"
      );
      setAllCountItems({
        ...AllCountItems,
        AfterSearchComponentItems: Subcomponnet,
        AfterSearchSubComponentItems: Componnet,
        AfterSearchFeaturesItems: Features,
      });
      // var Subcomponnet = commonItems.filter((sub: { Item_x0020_Type: string; }) => (sub.Item_x0020_Type === 'SubComponent'));
      commonItems.forEach((filterItem: any) => {
        arrayItem.forEach((item: any, pareIndex: any) => {
          if (
            item.Id == filterItem.Id &&
            item.siteType.toLowerCase() == filterItem.siteType.toLowerCase()
          ) {
            item.flag = true;
            item.show = true;
          }
          if (item.childs != undefined && item.childs.length > 0) {
            item.childs.forEach((child: any, parentIndex: any) => {
              //  child.flag = false;
              if (
                child.Id == filterItem.Id &&
                child.siteType.toLowerCase() ==
                filterItem.siteType.toLowerCase()
              ) {
                item.childs[parentIndex].flag = true;
                arrayItem[pareIndex].flag = true;
                child.flag = true;
                item.childs[parentIndex].show = true;
                arrayItem[pareIndex].show = true;
              }
              if (child.childs != undefined && child.childs.length > 0) {
                child.childs.forEach((subchild: any, index: any) => {
                  //  subchild.flag = false;
                  if (
                    subchild.Id == filterItem.Id &&
                    subchild.siteType.toLowerCase() ==
                    filterItem.siteType.toLowerCase()
                  ) {
                    item.childs[parentIndex].flag = true;
                    child.flag = true;
                    child.childs[index].flag = true;
                    arrayItem[pareIndex].flag = true;
                    subchild.flag = true;
                    child.childs[index].show = true;
                    arrayItem[pareIndex].show = true;
                    subchild.show = true;
                  }
                  if (
                    subchild.childs != undefined &&
                    subchild.childs.length > 0
                  ) {
                    subchild.childs.forEach(
                      (subchilds: any, childindex: any) => {
                        //  subchilds.flag = false;
                        if (
                          subchilds.Id == filterItem.Id &&
                          subchilds.siteType.toLowerCase() ==
                          filterItem.siteType.toLowerCase()
                        ) {
                          subchilds.flag = true;
                          item.childs[parentIndex].flag = true;
                          subchild.flag = true;
                          subchild.childs[childindex].flag = true;
                          arrayItem[pareIndex].flag = true;
                          item.childs[parentIndex].show = true;
                          subchild.show = true;
                          subchild.childs[childindex].show = true;
                          arrayItem[pareIndex].show = true;
                        }
                        if (
                          subchild.childs != undefined &&
                          subchild.childs.length > 0
                        ) {
                          subchilds.childs.forEach(
                            (Lastsubchilds: any, subchildindex: any) => {
                              //   Lastsubchilds.flag = false;
                              if (
                                Lastsubchilds.Id == filterItem.Id &&
                                Lastsubchilds.siteType.toLowerCase() ==
                                filterItem.siteType.toLowerCase()
                              ) {
                                Lastsubchilds.flag = true;
                                item.childs[parentIndex].flag = true;
                                child.childs[index].flag = true;
                                subchilds.flag = true;
                                subchilds.childs[subchildindex].flag = true;
                                arrayItem[pareIndex].flag = true;

                                item.childs[parentIndex].show = true;
                                child.childs[index].show = true;
                                subchilds.show = true;
                                subchilds.childs[subchildindex].show = true;
                                arrayItem[pareIndex].show = true;
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                });
              }
            });
          }
        });
      });
      setData((arrayItem) => [...arrayItem]);
    } else {
      setData((data) => [...TotalArrayBackup]);
    }
  };

  const CreateMeetingPopups = (item: any) => {
    setMeetingPopup(true);
    checkedList[0]["NoteCall"] = item;
  };

  const LoadAllSiteTasks = function () {
    var Response: any = [];
    var Counter = 0;
    if (siteConfig != undefined && siteConfig.length > 0) {
      map(siteConfig, async (config: any) => {
        let web = new Web(ContextValue.siteUrl);
        let AllTasksMatches = [];
        AllTasksMatches = await web.lists
          .getById(config.listId)
          .items.select(
            "ParentTask/Title",
            "ParentTask/Id",
            "Services/Title",
            "ClientTime",
            "Services/Id",
            "Events/Id",
            "Events/Title",
            "ItemRank",
            "Portfolio_x0020_Type",
            "SiteCompositionSettings",
            "SharewebTaskLevel1No",
            "SharewebTaskLevel2No",
            "TimeSpent",
            "BasicImageInfo",
            "OffshoreComments",
            "OffshoreImageUrl",
            "CompletedDate",
            "Shareweb_x0020_ID",
            "Responsible_x0020_Team/Id",
            "Responsible_x0020_Team/Title",
            "SharewebCategories/Id",
            "SharewebCategories/Title",
            "ParentTask/Shareweb_x0020_ID",
            "SharewebTaskType/Id",
            "SharewebTaskType/Title",
            "SharewebTaskType/Level",
            "Priority_x0020_Rank",
            "Team_x0020_Members/Title",
            "Team_x0020_Members/Name",
            "Component/Id",
            "Component/Title",
            "Component/ItemType",
            "Team_x0020_Members/Id",
            "component_x0020_link",
            "IsTodaysTask",
            "AssignedTo/Title",
            "AssignedTo/Name",
            "AssignedTo/Id",
            "ClientCategory/Id",
            "ClientCategory/Title",
            "FileLeafRef",
            "FeedBack",
            "Title",
            "Id",
            "ID",
            "PercentComplete",
            "StartDate",
            "DueDate",
            "Comments",
            "Categories",
            "Status",
            "Body",
            "Mileage",
            "PercentComplete",
            "ClientCategory",
            "Priority",
            "Created",
            "Modified",
            "Author/Id",
            "Author/Title",
            "Editor/Id",
            "Editor/Title"
          )
          .expand(
            "ParentTask",
            "Events",
            "Services",
            "SharewebTaskType",
            "AssignedTo",
            "Component",
            "ClientCategory",
            "Author",
            "Editor",
            "Team_x0020_Members",
            "Responsible_x0020_Team",
            "SharewebCategories"
          )
          .filter("Status ne 'Completed'")
          .orderBy("orderby", false)
          .getAll(4000);

        console.log(AllTasksMatches);
        Counter++;
        console.log(AllTasksMatches.length);
        if (AllTasksMatches != undefined && AllTasksMatches.length > 0) {
          $.each(AllTasksMatches, function (index: any, item: any) {
            item.isDrafted = false;
            item.flag = true;
            item.TitleNew = item.Title;
            // item.HierarchyData = globalCommon.hierarchyData(item, usePopHoverDataSend)
            item.siteType = config.Title;
            item.childs = [];
            item.listId = config.listId;
            item.siteUrl = ContextValue.siteUrl;
            if (item.SharewebCategories.results != undefined) {
              if (item.SharewebCategories.results.length > 0) {
                $.each(
                  item.SharewebCategories.results,
                  function (ind: any, value: any) {
                    if (value.Title.toLowerCase() == "draft") {
                      item.isDrafted = true;
                    }
                  }
                );
              }
            }
          });
          AllTasks = AllTasks.concat(AllTasksMatches);
          AllTasks = $.grep(AllTasks, function (type: any) {
            return type.isDrafted == false;
          });
          if (Counter == siteConfig.length) {
            map(AllTasks, (result: any) => {
              result.Id = result.Id != undefined ? result.Id : result.ID;
              result.TeamLeaderUser = [];
              result.AllTeamName =
                result.AllTeamName === undefined ? "" : result.AllTeamName;
              result.chekbox = false;
              result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");

              if (result.DueDate == "Invalid date" || "") {
                result.DueDate = result.DueDate.replaceAll("Invalid date", "");
              }
              result.PercentComplete = (result.PercentComplete * 100).toFixed(0);
              result.chekbox = false;
              if (result.Short_x0020_Description_x0020_On != undefined) {
                result.Short_x0020_Description_x0020_On =
                  result.Short_x0020_Description_x0020_On.replace(
                    /(<([^>]+)>)/gi,
                    ""
                  );
              }

              if (
                result.AssignedTo != undefined &&
                result.AssignedTo.length > 0
              ) {
                map(result.AssignedTo, (Assig: any) => {
                  if (Assig.Id != undefined) {
                    map(TaskUsers, (users: any) => {
                      if (
                        Assig.Id != undefined &&
                        users.AssingedToUser != undefined &&
                        Assig.Id == users.AssingedToUser.Id
                      ) {
                        users.ItemCover = users.Item_x0020_Cover;
                        result.TeamLeaderUser.push(users);
                        result.AllTeamName += users.Title + ";";
                      }
                    });
                  }
                });
              }
              if (
                result.Responsible_x0020_Team != undefined &&
                result.Responsible_x0020_Team.length > 0
              ) {
                map(result.Responsible_x0020_Team, (Assig: any) => {
                  if (Assig.Id != undefined) {
                    map(TaskUsers, (users: any) => {
                      if (
                        Assig.Id != undefined &&
                        users.AssingedToUser != undefined &&
                        Assig.Id == users.AssingedToUser.Id
                      ) {
                        users.ItemCover = users.Item_x0020_Cover;
                        result.TeamLeaderUser.push(users);
                        result.AllTeamName += users.Title + ";";
                      }
                    });
                  }
                });
              }
              if (
                result.Team_x0020_Members != undefined &&
                result.Team_x0020_Members.length > 0
              ) {
                map(result.Team_x0020_Members, (Assig: any) => {
                  if (Assig.Id != undefined) {
                    map(TaskUsers, (users: any) => {
                      if (
                        Assig.Id != undefined &&
                        users.AssingedToUser != undefined &&
                        Assig.Id == users.AssingedToUser.Id
                      ) {
                        users.ItemCover = users.Item_x0020_Cover;
                        result.TeamLeaderUser.push(users);
                        result.AllTeamName += users.Title + ";";
                      }
                    });
                  }
                });
              }
              result["SiteIcon"] = GetIconImageUrl(result.siteType, ContextValue.siteUrl, undefined);
              // result["SiteIcon"] = config?.Item_x005F_x0020_Cover?.Url
              // if (
              //   result.ClientCategory != undefined &&
              //   result.ClientCategory.length > 0
              // ) {
              //   map(result.Team_x0020_Members, (catego: any) => {
              //     result.ClientCategory.push(catego);
              //   });
              // }
              if (result.Id === 1441) console.log(result);
              result["Shareweb_x0020_ID"] = globalCommon.getTaskId(result);
              if (result["Shareweb_x0020_ID"] == undefined) {
                result["Shareweb_x0020_ID"] = "";
              }
              result["Item_x0020_Type"] = "Task";
              TasksItem.push(result);
            });

            AllActivitysData = AllTasks?.filter(
              (elem: any) => elem?.SharewebTaskType?.Title == "Activities"
            );
            AllWorkStreamData = AllTasks?.filter(
              (elem: any) => elem?.SharewebTaskType?.Title == "Workstream"
            );
            AllActivitysData?.forEach((elem: any) => {
              elem.childs = [];
              elem.subRows = [];
              AllTasks?.forEach((task: any) => {
                if (elem.Id === task.Id) {
                  task.isTagged = false;
                }
                if (elem?.ID == task?.ParentTask?.Id) {
                  task.isTagged = false;
                  elem.childs.push(task);
                  elem.subRows.push(task);
                }
              });
            });
            AllActivitysData?.forEach((elem: any) => {
              elem?.subRows?.forEach((val: any) => {
                val.childs = val.childs === undefined ? [] : val.childs;
                val.subRows = val.subRows === undefined ? [] : val.subRows;
                AllTasks?.forEach((task: any) => {
                  if (val.Id === task.Id) {
                    task.isTagged = false;
                  }
                  if (val?.ID == task?.ParentTask?.Id) {
                    task.isTagged = false;
                    val.childs.push(task);
                    val.subRows.push(task);
                  }
                });
              });
            });

            AllTasks?.forEach((value: any) => {
              if (value.isTagged != false) {
                value.childs = [];
                value.subRows = [];
                AllActivitysData.push(value);
              }
            });

            console.log("taskssssssssssssss", AllActivitysData);
            console.log("AllActivitysData", AllActivitysData);
            TasksItem = AllActivitysData;
            console.log(Response);
            map(TasksItem, (task: any) => {
              if (!isItemExistsNew(CopyTaskData, task)) {
                CopyTaskData.push(task);
              }
            });
            setAllTasks(CopyTaskData);
            filterDataBasedOnList();
          }
        } else {
          if (Counter == siteConfig.length) {
            filterDataBasedOnList();
            showProgressHide();
          }
        }
      });
    } else showProgressHide();
  };
  const handleOpen2 = (item: any) => {
    item.show = item.showItem = item.show == true ? false : true;
    setfilterItems((filterItems) => [...filterItems]);
  };
  const addModal = () => {
    setAddModalOpen(true);
  };
  var AllComponetsData: any = [];
  var TaskUsers: any = [];
  var MetaData: any = [];
  var showProgressBar = () => {
    setLoaded(false);
    $(" #SpfxProgressbar").show();
  };

  var showProgressHide = () => {
    setLoaded(true);
    $(" #SpfxProgressbar").hide();
  };
  var Response: any = [];
  const getTaskUsers = async () => {
    let web = new Web(ContextValue.siteUrl);
    let taskUsers = [];
    taskUsers = await web.lists
      .getById(ContextValue.TaskUsertListID)
      .items.select(
        "Id",
        "Email",
        "Suffix",
        "Title",
        "Item_x0020_Cover",
        "AssingedToUser/Title",
        "AssingedToUser/Id",
        "AssingedToUser/Name",
        "UserGroup/Id",
        "ItemType"
      )
      .expand("AssingedToUser", "UserGroup")
      .get();
    Response = taskUsers;
    TaskUsers = Response;
    setTaskUser(Response);
    console.log(Response);
  };
  const GetSmartmetadata = async () => {
    var metadatItem: any = [];
    let web = new Web(ContextValue.siteUrl);
    let smartmetaDetails: any = [];
    smartmetaDetails = await web.lists
      //.getById('ec34b38f-0669-480a-910c-f84e92e58adf')
      .getById(ContextValue.SmartMetadataListID)
      .items//.getById(this.state.itemID)
      .select(
        "Id",
        "Title",
        "IsVisible",
        "ParentID",
        "SmartSuggestions",
        "TaxType",
        "Description1",
        "Item_x005F_x0020_Cover",
        "listId",
        "siteName",
        "siteUrl",
        "SortOrder",
        "SmartFilters",
        "Selectable",
        'Color_x0020_Tag',
        "Parent/Id",
        "Parent/Title"
      )
      .top(4999)
      // .filter("TaxType eq 'Client Category'")
      .expand("Parent")
      .get();
    setAllClientCategory(smartmetaDetails?.filter((metadata: any) => metadata?.TaxType == 'Client Category'));
    console.log(smartmetaDetails);
    setMetadata(smartmetaDetails);

    map(smartmetaDetails, (newtest) => {
      newtest.Id = newtest.ID;
      if (
        newtest.Title == "SDC Sites" || newtest.Title == "DRR" || newtest.Title == "Small Projects" || newtest.Title == "Offshore Tasks" ||
        newtest.Title == "Health" ||
        newtest.Title == "Shareweb Old" ||
        newtest.Title == "Master Tasks"
      )
        newtest.DataLoadNew = false;
      else if (newtest.TaxType == "Sites") siteConfig.push(newtest);
    });
    map(smartmetaDetails, (item) => {
      if (
        item.TaxType != "Status" &&
        item.TaxType != "Admin Status" &&
        item.TaxType != "Task Type" &&
        item.TaxType != "Time" &&
        item.Id != 300 &&
        item.TaxType != "Portfolio Type" &&
        item.TaxType != "Task Types"
      ) {
        if (item.TaxType == "Sites") {
          item.DataLoad = false;
          /*-- Code for default Load Task Data---*/
          if (
            item.Title == "DRR" ||
            item.Title == "Small Projects" ||
            item.Title == "Offshore Tasks" ||
            item.Title == "Health"
          ) {
            item.Selected = false;
          } else {
            item.Selected = true;
          }
        } else if (item.TaxType == "Sites Old") {
          /*-- Code for default Load Task Data---*/
          item.Selected = true;
        }
        metadatItem.push(item);
        //setFilterGroups(metadatItem)
      }
    });
    if (siteConfig.length > 0) LoadAllSiteTasks();
    //  else filterDataBasedOnList()

    map(Response, (user: any) => {
      user.TaxType = "Team Members";
      user.SmartFilters = {};
      user.SmartFilters = [];
      user.SmartFilters.push("Portfolio");
      if (user.UserGroup == undefined) user.ParentID = 0;
      if (user.UserGroup != undefined && user.UserGroup.Id != undefined)
        user.ParentID = user.UserGroup.Id;
      metadatItem.push(user);
    });
    map(metadatItem, (item) => {
      if (item.Title == "Shareweb Old") {
        item.TaxType = "Sites";
      }
    });

    map(metadatItem, (filterItem) => {
      if (
        filterItem.SmartFilters != undefined &&
        filterItem.SmartFilters != undefined &&
        filterItem.SmartFilters.indexOf("Portfolio") > -1
      ) {
        var item: any = [];
        item.ID = item.Id = filterItem.Id;
        item.Title = filterItem.Title;
        item.Group = filterItem.TaxType;
        item.TaxType = filterItem.TaxType;
        if (
          item.Title == "Activities" ||
          item.Title == "Workstream" ||
          item.Title == "Task"
        ) {
          item.Selected = true;
        }

        if (
          filterItem.ParentID == 0 ||
          (filterItem.Parent != undefined && filterItem.Parent.Id == undefined)
        ) {
          if (item.TaxType == "Team Members") {
            getChildsBasedonId(item, Response);
          } else {
            getChildsBasedOn(item, smartmetaDetails);
          }
          filterItems.push(item);
          if (
            filterItem.TaxType != "Type" &&
            filterItem.TaxType != "Sites Old" &&
            (filterGroups.length == 0 ||
              filterGroups.indexOf(filterItem.TaxType) == -1)
          ) {
            filterGroups.push(filterItem.TaxType);
          }

          setFilterGroups(filterGroups);
        }
      }
    });
    var ArrayItem: any = [];

    filterItems.push(
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "Component",
        Selected: true,
        value: 1000,
        label: "Component",
        childs: [],
      },
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "SubComponent",
        Selected: true,
        value: 10000,
        label: "SubComponent",
        childs: [],
      },
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "Feature",
        Selected: true,
        value: 100000000,
        label: "Feature",
        childs: [],
      },
      {
        Group: "Portfolio",
        TaxType: "Portfolio",
        Title: "Task",
        Selected: true,
        value: 100000000,
        label: "Feature",
        childs: [],
      }
    );
    map(filterItems, (item) => {
      if (
        (item.TaxType == "Sites" && item.Title == "SDC Sites") ||
        item.Title == "Tasks"
      ) {
        item.Selected = true;
      }
    });
    setfilterItems((filterItems) => [...filterItems]);
    // setfilterItems(filterItems)
    ShowSelectedfiltersItems();
    setShowSelectdSmartfilter((ShowSelectdSmartfilter) => [...ArrayItem]);
    function getChildsBasedonId(
      item: {
        RightArrowIcon: string;
        downArrowIcon: string;
        childs: any[];
        subRows: any[];
        Id: any;
      },
      items: any
    ) {
      item.childs = [];
      item.subRows = [];
      map(metadatItem, (childItem) => {
        if (
          childItem.UserGroup != undefined &&
          childItem.UserGroup.Id != undefined &&
          childItem.UserGroup.Id == item.Id
        ) {
          childItem.value = childItem.Id;
          childItem.label = childItem.Title;

          item.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          item.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
          item.childs.push(childItem);
          item.subRows.push(childItem);
          getChildsBasedonId(childItem, items);
        }
      });
    }
    function getChildsBasedOn(
      item: {
        RightArrowIcon: string;
        downArrowIcon: string;
        childs: any[];
        subRows: any[];
        ID: number;
      },
      items: any
    ) {
      item.childs = [];
      item.subRows = [];
      map(metadatItem, (childItem) => {
        if (
          childItem.Parent != undefined &&
          childItem.Parent.Id != undefined &&
          parseInt(childItem.Parent.Id) == item.ID
        ) {
          childItem.value = childItem.Id;
          childItem.label = childItem.Title;
          item.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          item.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
          item.childs.push(childItem);
          item.subRows.push(childItem);
          getChildsBasedOn(childItem, items);
        }
      });
    }
  };
  var WebpartItem: any = [];
  const GetComponents = async () => {
    filt =
      "(Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature') and ((Portfolio_x0020_Type eq 'Service'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("service") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Service'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("events") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Events'))";
    if (
      IsUpdated != undefined &&
      IsUpdated.toLowerCase().indexOf("component") > -1
    )
      filt =
        "((Item_x0020_Type eq 'Component') or (Item_x0020_Type eq 'SubComponent') or (Item_x0020_Type eq 'Feature')) and ((Portfolio_x0020_Type eq 'Component'))";
    let web = new Web(ContextValue.siteUrl);
    let componentDetails = [];
    componentDetails = await web.lists
      .getById(ContextValue.MasterTaskListID)
      //.getByTitle('Master Tasks')
      .items//.getById(this.state.itemID)
      .select(
        "ID",
        "Id",
        "Title",
        "Mileage",
        "TaskListId",
        "TaskListName",
        "WorkspaceType",
        "PortfolioLevel",
        "PortfolioStructureID",
        "PortfolioStructureID",
        "component_x0020_link",
        "Package",
        "Comments",
        "DueDate",
        "Sitestagging",
        "Body",
        "Deliverables",
        "SiteCompositionSettings",
        "StartDate",
        "Created",
        "Item_x0020_Type",
        "Help_x0020_Information",
        "Background",
        "Categories",
        "Short_x0020_Description_x0020_On",
        "TechnicalExplanations",
        "Idea",
        "ValueAdded",
        "CategoryItem",
        "Priority_x0020_Rank",
        "Priority",
        "TaskDueDate",
        "PercentComplete",
        "Modified",
        "CompletedDate",
        "ItemRank",
        "Portfolio_x0020_Type",
        "Services/Title",
        "ClientTime",
        "Services/Id",
        "Events/Id",
        "Events/Title",
        "Parent/Id",
        "Parent/Title",
        "Component/Id",
        "Component/Title",
        "Component/ItemType",
        "Services/Id",
        "Services/Title",
        "Services/ItemType",
        "Events/Id",
        "Author/Title",
        "Editor/Title",
        "Events/Title",
        "Events/ItemType",
        "SharewebCategories/Id",
        "SharewebTaskType/Title",
        "SharewebCategories/Title",
        "AssignedTo/Id",
        "AssignedTo/Title",
        "Team_x0020_Members/Id",
        "Team_x0020_Members/Title",
        "ClientCategory/Id",
        "ClientCategory/Title",
        // 'ClientCategory/Color_x0020_Tag',
        "Responsible_x0020_Team/Id",
        "Responsible_x0020_Team/Title"
      )
      .expand(
        "Parent",
        "Events",
        "Services",
        "SharewebTaskType",
        "AssignedTo",
        "Component",
        "ClientCategory",
        "Author",
        "Editor",
        "Team_x0020_Members",
        "Responsible_x0020_Team",
        "SharewebCategories"
      )
      .top(4999)
      .filter(filt)
      .get();

    console.log(componentDetails);
    componentDetails.forEach((result: any) => {
      result.AllTeamName = "";
      if (result.Item_x0020_Type === 'Component') {
        result.boldRow = 'boldClable'
        result.lableColor = 'f-bg';
      }
      if (result.Item_x0020_Type === 'SubComponent') {
        result.lableColor = 'a-bg';
      }
      if (result.Item_x0020_Type === 'Feature') {
        result.lableColor = 'w-bg';
      }



      result.Id = result.Id != undefined ? result.Id : result.ID;
      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
        $.each(result.AssignedTo, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(Response, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.Responsible_x0020_Team != undefined &&
        result.Responsible_x0020_Team.length > 0
      ) {
        map(result.Responsible_x0020_Team, (Assig: any) => {
          if (Assig.Id != undefined) {
            map(TaskUsers, (users: any) => {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.Team_x0020_Members != undefined &&
        result.Team_x0020_Members.length > 0
      ) {
        $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(TaskUsers, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
    });
    AllComponetsData = componentDetails;
    ComponetsData["allComponets"] = componentDetails;
    if (siteConfig.length === 0) filterDataBasedOnList();

    setAllMasterTasks(AllComponetsData);
  };

  if (IsUpdated == "") {
    setIsUpdated("Service Portfolio");
  } else if (IsUpdated != SelectedProp?.SelectedProp.dropdownvalue) {
    setIsUpdated(SelectedProp?.SelectedProp.dropdownvalue);
  }

  let props = undefined;
  React.useEffect(() => {
    showProgressBar();
    ContextValue = SelectedProp?.SelectedProp;
    setmaidataBackup((maidataBackup) => [...[]]);
    setmaidataBackup((maidataBackup) => [...[]]);
    GetComponents();
    setData((data) => [...[]]);
    if (filterGroups != undefined && filterGroups.indexOf("Sites") === -1) {
      filterGroups.push("Portfolio");
      filterGroups.push("Sites");
      filterGroups.push("Type");
      filterGroups.push("Team Members");
      getTaskUsers();
      GetSmartmetadata();
    } else {
      map(filterItems, (filte) => {
        if (filte != undefined && filte.childs) {
          filte.downArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
          filte.RightArrowIcon =
            IsUpdated != undefined && IsUpdated == "Service Portfolio"
              ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
              : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
        }
      });
      LoadAllSiteTasks();
    }
  }, [IsUpdated]);
  // common services
  var parseJSON = function (jsonItem: any) {
    var json = [];
    try {
      json = JSON.parse(jsonItem);
    } catch (err) {
      console.log(err);
    }
    return json;
  };

  var GetIconImageUrl = function (listName: any, listUrl: any, Item: any) {
    var IconUrl = "";
    if (listName != undefined) {
      let TaskListsConfiguration = parseJSON(
        GlobalConstants.LIST_CONFIGURATIONS_TASKS
      );
      let TaskListItem = TaskListsConfiguration.filter(function (
        filterItem: any
      ) {
        let SiteRelativeUrl = filterItem.siteUrl;
        return (
          filterItem.Title.toLowerCase() == listName.toLowerCase() &&
          SiteRelativeUrl.toLowerCase() == listUrl.toLowerCase()
        );
      });
      if (TaskListItem.length > 0) {
        if (Item == undefined) {
          IconUrl = TaskListItem[0].ImageUrl;
        } else if (TaskListItem[0].ImageInformation != undefined) {
          var IconUrlItem = TaskListItem[0].ImageInformation.filter(function (
            index: any,
            filterItem: any
          ) {
            return (
              filterItem.ItemType == Item.Item_x0020_Type &&
              filterItem.PortfolioType == Item.Portfolio_x0020_Type
            );
          });
          if (IconUrlItem != undefined && IconUrlItem.length > 0) {
            IconUrl = IconUrlItem[0].ImageUrl;
          }
        }
      }
    }
    return IconUrl;
  };

  var AllTasks: any = [];
  var CopyTaskData: any = [];
  var isItemExistsNew = function (array: any, items: any) {
    var isExists = false;
    $.each(array, function (index: any, item: any) {
      if (item.Id === items.Id && items.siteType === item.siteType) {
        isExists = true;
        return false;
      }
    });
    return isExists;
  };
  const findTaggedComponents = function (task: any) {
    task.Portfolio_x0020_Type = "Component";
    task.isService = false;
    if (IsUpdated === "Service Portfolio") {
      $.each(task["Services"], function (index: any, componentItem: any) {
        if (ComponetsData["allComponets"]?.length != undefined && ComponetsData != undefined) {

          for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
            let crntItem = ComponetsData["allComponets"][i];
            if (componentItem?.Id == crntItem?.Id) {
              if (
                crntItem.PortfolioStructureID != undefined &&
                crntItem.PortfolioStructureID != ""
              ) {
                task.PortfolioStructureID = crntItem.PortfolioStructureID;
                task.ShowTooltipSharewebId =
                  crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
              }
              if (crntItem.Portfolio_x0020_Type == "Service") {
                task.isService = true;
                task.Portfolio_x0020_Type = "Service";
              }
              if (ComponetsData["allComponets"][i]["childs"] === undefined) {
                ComponetsData["allComponets"][i]["childs"] = [];
                ComponetsData["allComponets"][i]["subRows"] = [];
              }
              if (
                !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
              ) {
                ComponetsData["allComponets"][i].downArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service Portfolio"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                ComponetsData["allComponets"][i].RightArrowIcon =
                  IsUpdated != undefined && IsUpdated == "Service Portfolio"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
                ComponetsData["allComponets"][i]["childs"].push(task);
                ComponetsData["allComponets"][i]["subRows"].push(task);
                if (ComponetsData["allComponets"][i].Id === 413)
                  console.log(ComponetsData["allComponets"][i]["childs"].length);
              }
              break;
            }
          }

        }
      });
    }
    if (IsUpdated === "Events Portfolio") {
      $.each(task["Events"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem?.Id == crntItem?.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Events") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Events";
            }
            if (ComponetsData["allComponets"][i]["childs"] == undefined) {
              ComponetsData["allComponets"][i]["childs"] = [];
              ComponetsData["allComponets"][i]["subRows"] = [];
            }
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
            ) {
              ComponetsData["allComponets"][i].downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Events Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png";
              ComponetsData["allComponets"][i].RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Events Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png";

              ComponetsData["allComponets"][i]["childs"].push(task);
              ComponetsData["allComponets"][i]["subRows"].push(task);
            }
            break;
          }
        }
      });
    }
    if (IsUpdated === "Component Portfolio") {
      $.each(task["Component"], function (index: any, componentItem: any) {
        for (var i = 0; i < ComponetsData["allComponets"].length; i++) {
          let crntItem = ComponetsData["allComponets"][i];
          if (componentItem?.Id == crntItem?.Id) {
            if (
              crntItem.PortfolioStructureID != undefined &&
              crntItem.PortfolioStructureID != ""
            ) {
              task.PortfolioStructureID = crntItem.PortfolioStructureID;
              task.ShowTooltipSharewebId =
                crntItem.PortfolioStructureID + "-" + task.Shareweb_x0020_ID;
            }
            if (crntItem.Portfolio_x0020_Type == "Component") {
              task.isService = true;
              task.Portfolio_x0020_Type = "Component";
            }
            if (ComponetsData["allComponets"][i]["childs"] == undefined) {
              ComponetsData["allComponets"][i]["childs"] = [];
              ComponetsData["allComponets"][i]["subRows"] = [];
            }
            if (
              !isItemExistsNew(ComponetsData["allComponets"][i]["childs"], task)
            ) {
              ComponetsData["allComponets"][i].downArrowIcon =
                IsUpdated != undefined && IsUpdated == "Component Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png";
              ComponetsData["allComponets"][i].RightArrowIcon =
                IsUpdated != undefined && IsUpdated == "Component Portfolio"
                  ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png"
                  : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png";
              ComponetsData["allComponets"][i]["childs"].push(task);
              ComponetsData["allComponets"][i]["subRows"].push(task);
            }
            break;
          }
        }
      });
    }
  };
  //var pageType = 'Service-Portfolio';
  var ComponetsData: any = {};
  ComponetsData.allUntaggedTasks = [];

  const DynamicSort = function (items: any, column: any) {
    items?.sort(function (a: any, b: any) {
      // return   a[column] - b[column];
      var aID = a[column];
      var bID = b[column];
      return aID == bID ? 0 : aID > bID ? 1 : -1;
    });
  };
  const bindData = function () {
    var RootComponentsData: any[] = [];

    $.each(ComponetsData["allComponets"], function (index: any, result: any) {
      result.show = false;
      result.checkBox = false;
      if (result.childs != undefined) {
        result.childs.forEach(function (i: any) {
          i.show = [];
          i.checkBox = false;
          if (i.childs != undefined) {
            i.childs.forEach(function (subc: any) {
              subc.show = [];
              subc.checkBox = false;
              if (subc.childs != undefined) {
                subc.childs.forEach(function (last: any) {
                  last.show = [];
                  last.checkBox = false;
                });
              }
            });
          }
        });
      }
      result.TeamLeaderUser =
        result.TeamLeaderUser === undefined ? [] : result.TeamLeaderUser;
      result.Restructuring =
        IsUpdated != undefined && IsUpdated == "Service Portfolio"
          ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Restructuring_Tool.png"
          : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Restructuring_Tool.png";
      result.AllTeamName = "";
      result.TitleNew = result.Title;
      //  getWebpartId(result);
      result.childsLength = 0;
      result.DueDate = Moment(result.DueDate).format("DD/MM/YYYY");
      result.flag = true;
      if (result.DueDate == "Invalid date" || "") {
        result.DueDate = result.DueDate.replaceAll("Invalid date", "");
      }
      result.PercentComplete = (result.PercentComplete * 100).toFixed(0);

      if (result.Short_x0020_Description_x0020_On != undefined) {
        result.Short_x0020_Description_x0020_On =
          result.Short_x0020_Description_x0020_On.replace(/(<([^>]+)>)/gi, "");
      }
      result["siteType"] = "Master Tasks";
      // result['SiteIcon'] = GetIconImageUrl(result.siteType, ContextValue.siteUrl, undefined);
      if (result.AssignedTo != undefined && result.AssignedTo.length > 0) {
        $.each(result.AssignedTo, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(Response, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.Team_x0020_Members != undefined &&
        result.Team_x0020_Members.length > 0
      ) {
        $.each(result.Team_x0020_Members, function (index: any, Assig: any) {
          if (Assig.Id != undefined) {
            $.each(TaskUsers, function (index: any, users: any) {
              if (
                Assig.Id != undefined &&
                users.AssingedToUser != undefined &&
                Assig.Id == users.AssingedToUser.Id
              ) {
                users.ItemCover = users.Item_x0020_Cover;
                result.TeamLeaderUser.push(users);
                result.AllTeamName += users.Title + ";";
              }
            });
          }
        });
      }
      if (
        result.Responsible_x0020_Team != undefined &&
        result.Responsible_x0020_Team.length > 0
      ) {
        $.each(
          result.Responsible_x0020_Team,
          function (index: any, Assig: any) {
            if (Assig.Id != undefined) {
              $.each(TaskUsers, function (index: any, users: any) {
                if (
                  Assig.Id != undefined &&
                  users.AssingedToUser != undefined &&
                  Assig.Id == users.AssingedToUser.Id
                ) {
                  users.ItemCover = users.Item_x0020_Cover;
                  result.TeamLeaderUser.push(users);
                  result.AllTeamName += users.Title + ";";
                }
              });
            }
          }
        );
      }
      if (
        result.PortfolioStructureID != null &&
        result.PortfolioStructureID != undefined
      ) {
        result["Shareweb_x0020_ID"] = result.PortfolioStructureID;
      } else {
        result["Shareweb_x0020_ID"] = "";
      }
      if (result.Item_x0020_Type == "Root Component") {
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        RootComponentsData.push(result);
      }
      if (result.Item_x0020_Type == "Component") {
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        result.SiteIconTitle = "C"; //IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';
        ComponentsData.push(result);
      }

      if (result.Item_x0020_Type == "SubComponent") {
        result.SiteIconTitle = "S"; //IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        SubComponentsData.push(result);
        SubComponentsDataCopy.push(result);
      }
      if (result.Item_x0020_Type == "Feature") {
        result.SiteIconTitle = "F"; //IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
        result["childs"] =
          result["childs"] != undefined ? result["childs"] : [];
        result["subRows"] =
          result["subRows"] != undefined ? result["subRows"] : [];
        FeatureData.push(result);
        FeatureDataCopy.push(result);
      }
      if (result.Title == "Others") {
        result.childsLength = result.childs.length;
        ComponentsData.push(result);
        ComponentsDataCopy.push(result);
      }
    });

    $.each(SubComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        $.each(FeatureData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp.Id == featurecomp.Parent.Id
          ) {
            subcomp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            subcomp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            subcomp.childsLength++;
            subcomp["childs"].push(featurecomp);
            subcomp["subRows"].push(featurecomp);
          }
        });
        DynamicSort(subcomp.childs, "PortfolioLevel");
        DynamicSort(subcomp.subRows, "PortfolioLevel");
      }
    });

    $.each(ComponentsData, function (index: any, subcomp: any) {
      if (subcomp.Title != undefined) {
        $.each(SubComponentsData, function (index: any, featurecomp: any) {
          if (
            featurecomp.Parent != undefined &&
            subcomp.Id == featurecomp.Parent.Id
          ) {
            subcomp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            subcomp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            subcomp.childsLength++;
            subcomp["childs"].push(featurecomp);
            subcomp["subRows"].push(featurecomp);
          }
        });
        DynamicSort(subcomp.childs, "PortfolioLevel");
        DynamicSort(subcomp.subRows, "PortfolioLevel");
      }
    });

    map(ComponentsData, (comp, index) => {
      if (comp.Title != undefined) {
        map(FeatureData, (featurecomp) => {
          if (
            featurecomp.Parent != undefined &&
            comp.Id === featurecomp.Parent.Id
          ) {
            comp.downArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            comp.RightArrowIcon =
              IsUpdated != undefined && IsUpdated == "Service Portfolio"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";
            comp.childsLength++;
            comp["childs"].push(featurecomp);
            comp["subRows"].push(featurecomp);
          }
        });
        DynamicSort(comp.childs, "PortfolioLevel");
        DynamicSort(comp.subRows, "PortfolioLevel");
      }
    });

    map(ComponentsData, (comp, index) => {
      if (comp.childs != undefined && comp.childs.length > 0) {
        var Subcomponnet = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "SubComponent"
        );
        DynamicSort(Subcomponnet, "PortfolioLevel");
        var SubTasks = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) => sub.Item_x0020_Type === "Task"
        );
        var SubFeatures = comp.childs.filter(
          (sub: { Item_x0020_Type: string }) =>
            sub.Item_x0020_Type === "Feature"
        );
        DynamicSort(SubFeatures, "PortfolioLevel");
        SubFeatures = SubFeatures.concat(SubTasks);
        Subcomponnet = Subcomponnet.concat(SubFeatures);
        comp["childs"] = Subcomponnet;
        comp["subRows"] = Subcomponnet;
        array.push(comp);

        if (Subcomponnet != undefined && Subcomponnet.length > 0) {
          //  if (comp.childs != undefined && comp.childs.length > 0) {
          map(Subcomponnet, (subcomp, index) => {
            if (subcomp.childs != undefined && subcomp.childs.length > 0) {
              var Subchildcomponnet = subcomp.childs.filter(
                (sub: any) => sub.Item_x0020_Type === "Feature"
              );
              DynamicSort(SubFeatures, "PortfolioLevel");
              var SubchildTasks = subcomp.childs.filter(
                (sub: any) => sub.Item_x0020_Type === "Task"
              );
              Subchildcomponnet = Subchildcomponnet.concat(SubchildTasks);
              subcomp["childs"] = Subchildcomponnet;
              subcomp["subRows"] = Subchildcomponnet;
            }
          });
        }
      } else array.push(comp);
    });

    setSubComponentsData(SubComponentsData);
    setFeatureData(FeatureData);
    setComponentsData(array);
    setmaidataBackup(array);
    setTotalArrayBackup(array);
    setData(array);
    setAllCountItems({
      ...AllCountItems,
      AfterSearchComponentItems: array,
      AfterSearchSubComponentItems: SubComponentsData,
      AfterSearchFeaturesItems: FeatureData,
      AllComponentItems: array,
      AllSubComponentItems: SubComponentsData,
      AllFeaturesItems: FeatureData,
    });
    showProgressHide();
  };

  var makeFinalgrouping = function () {
    var AllTaskData1: any = [];
    ComponetsData["allUntaggedTasks"] = [];
    var SelectedLevel: any = [];
    filterItems.forEach((item) => {
      if (
        item.Selected &&
        (item.Title == "Activities" ||
          item.Title == "Workstream" ||
          item.Title == "Task")
      ) {
        SelectedLevel.push(item);
      }
    });

    if (SelectedLevel.length > 0) {
      var AllTaggedTask: any = [];
      SelectedLevel.forEach((item: any) => {
        TasksItem.forEach((task: any) => {
          if (
            task.SharewebTaskType != undefined &&
            task.SharewebTaskType.Title != undefined &&
            item.Title == task.SharewebTaskType.Title
          ) {
            AllTaggedTask.push(task);
          }
        });
      });
      // AllTaskData1 = AllTaskData1.concat(TasksItem);
      setTaggedAllTask(AllTaggedTask);
      $.each(AllTaggedTask, function (index: any, task: any) {
        if (
          task.ID === 1473 ||
          task.ID === 2297 ||
          task.ID === 2338 ||
          task.ID === 2392
        )
          var test = "test";
        task.Portfolio_x0020_Type = "Component";
        if (IsUpdated === "Service Portfolio") {
          if (task["Services"] != undefined && task["Services"].length > 0) {
            task.Portfolio_x0020_Type = "Service";
            findTaggedComponents(task);
          } else if (
            task["Component"] != undefined &&
            task["Component"].length === 0 &&
            task["Events"] != undefined &&
            task["Events"].length === 0
          ) {
            // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
            ComponetsData["allUntaggedTasks"].push(task);
          }
        }
        if (IsUpdated === "Events Portfolio") {
          if (task["Events"] != undefined && task["Events"].length > 0) {
            task.Portfolio_x0020_Type = "Events";
            findTaggedComponents(task);
          } else if (
            task["Component"] != undefined &&
            task["Component"].length == 0 &&
            task["Services"] != undefined &&
            task["Services"].length == 0
          ) {
            // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
            ComponetsData["allUntaggedTasks"].push(task);
          }
        }
        if (IsUpdated === "Component Portfolio") {
          if (task["Component"] != undefined && task["Component"].length > 0) {
            task.Portfolio_x0020_Type = "Component";
            findTaggedComponents(task);
          } else if (
            task["Services"] != undefined &&
            task["Services"].length == 0 &&
            task["Events"] != undefined &&
            task["Events"].length == 0
          ) {
            // if (task.SharewebTaskType != undefined && task.SharewebTaskType.Title && (task.SharewebTaskType.Title == "Activities" || task.SharewebTaskType.Title == "Workstream" || task.SharewebTaskType.Title == "Task"))
            ComponetsData["allUntaggedTasks"].push(task);
          }
        }
      });
    }
    var temp: any = {};
    temp.Title = "Others";
    temp.TitleNew = "Others";
    temp.childs = [];
    temp.childsLength = 0;
    temp.flag = true;
    temp.PercentComplete ="";
    temp.ItemRank = "";
    temp.DueDate = "";
    // ComponetsData['allComponets'][i]['childs']
    map(ComponetsData["allUntaggedTasks"], (task: any) => {
      if (task.Title != undefined) {
        temp.downArrowIcon =
          IsUpdated != undefined && IsUpdated == "Service Portfolio"
            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
        temp.RightArrowIcon =
          IsUpdated != undefined && IsUpdated == "Service Portfolio"
            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

        temp.childs.push(task);
      }
    });
    if(temp?.childs?.length>0){
      temp.childs = temp?.childs?.filter((ele:any, ind:any) => ind === temp?.childs?.findIndex((elem:any) => elem.ID === ele.ID));
    }
    ComponetsData["allComponets"].push(temp);
    bindData();
  };
  const filterDataBasedOnList = function () {
    //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
    //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTas kData));

    //$scope.AllTaskData = $scope.CopyTaskData.map(function (value) { value = Object.create(value); return value });
    //$scope.AllTaskData = angular.copy($scope.CopyTaskData);
    //$scope.AllTaskData = JSON.parse(JSON.stringify($scope.CopyTaskData));

    //$scope.AllTaskData = $scope.CopyTaskData.map(function (value) { value = Object.create(value); return value });
    var AllTaskData1: any = [];
    AllTaskData1 = AllTaskData1.concat(CopyTaskData);
    // CountOfAWTStructuredData();
    var SelectedList: any = [];
    $.each(filterItems, function (index: any, config: any) {
      if (config.Selected && config.TaxType == "Sites") {
        SelectedList.push(config);
      }
      if (config.Title == "Foundation" || config.Title == "SDC Sites") {
        config.show = true;
        config.showItem = true;
      }
      if (config.childs != undefined && config.childs.length > 0) {
        $.each(config.childs, function (index: any, child: any) {
          if (child.Selected && child.TaxType == "Sites") {
            SelectedList.push(child);
          }
        });
      }
    });

    var AllTaggedTask: any = [];
    $.each(SelectedList, function (index: any, item: any) {
      $.each(AllTaskData1, function (index: any, task: any) {
        if (item.Title.toLowerCase() == task.siteType.toLowerCase()) {
          AllTaggedTask.push(task);
        }
      });
    });
    if (AllTaggedTask != undefined) {
      AllTaskData1 = AllTaggedTask;
    }
    makeFinalgrouping();
  };
  var TasksItem: any = [];


  const Prints = () => {
    window.print();
  };
  // ---------------------Export to Excel-------------------------------------------------------------------------------------

  const getCsvData = () => {
    const csvData = [["Title"]];
    let i;
    for (i = 0; i < data.length; i += 1) {
      csvData.push([`${data[i].Title}`]);
    }
    return csvData;
  };
  const clearSearch = () => {
    setSearch("");
  };

  const expndpopup = (e: any) => {
    settablecontiner(e);
  };

  //------------------Edit Data----------------------------------------------------------------------------------------------------------------------------

  const EditData = (e: any, item: any) => {
    setSharewebTimeComponent(item);
  };
  const EditDataTimeEntryData = (e: any, item: any) => {
    setIsTimeEntry(true);
    setSharewebTimeComponent(item);
  };

  const Call = React.useCallback((childItem: any) => {
    AllDataRender = []
    setRowSelection({});
    closeTaskStatusUpdatePoup2();
    setIsComponent(false);
    setIsTask(false);
    setMeetingPopup(false);
    setWSPopup(false);

    var MainId: any = "";
    let ParentTaskId: any = "";
    if (childItem != undefined) {
      childItem.data.Services = [];
      childItem.data.Component = [];
      childItem.data["flag"] = true;
      childItem.data["TitleNew"] = childItem?.data?.Title;
      if (childItem?.data?.ServicesId[0] != undefined) {
        childItem.data.Services.push({ Id: childItem?.data?.ServicesId[0] });
      }
      if (childItem?.data?.ComponentId[0] != undefined) {
        childItem.data.Component.push({ Id: childItem?.data?.ComponentId[0] });

      }
      if (
        childItem?.data?.ServicesId != undefined &&
        childItem?.data?.ServicesId?.length > 0
      ) {
        MainId = childItem.data.ServicesId[0];
      }
      if (
        childItem.data.ComponentId != undefined &&
        childItem.data.ComponentId.length > 0
      ) {
        MainId = childItem.data.ComponentId[0];
      }
      if (
        childItem.data.ParentTaskId != undefined &&
        childItem.data.ParentTaskId != ""
      ) {
        ParentTaskId = childItem.data.ParentTaskId;
      }
      if (
        childItem?.data?.DueDate != undefined &&
        childItem?.data?.DueDate != "" &&
        childItem?.data?.DueDate != "Invalid date"
      ) {
        childItem.data.DueDate = childItem.data.DueDate
          ? Moment(childItem?.data?.DueDate).format("MM-DD-YYYY")
          : null;
      }
      if (array != undefined) {
        array?.map((comp: any) => {
          comp.flag = true;
          comp.show = false;
          if (comp.Id == MainId || comp.ID == MainId) {
            comp.childs.push(childItem.data);
            comp.subRows.push(childItem.data);
            comp.subRows = comp?.subRows?.filter((ele:any, ind:any) => ind === comp?.subRows?.findIndex((elem:any) => elem.ID === ele.ID));

          }

          if (comp.subRows != undefined && comp.subRows.length > 0) {
            comp?.subRows?.map((subComp: any) => {
              subComp.flag = true;
              subComp.show = false;
              if (subComp.Id == MainId || subComp.ID == MainId) {
                subComp.childs.push(childItem.data);
                subComp.subRows.push(childItem.data);
                subComp.subRows = subComp?.subRows?.filter((ele:any, ind:any) => ind === subComp?.subRows?.findIndex((elem:any) => elem.ID === ele.ID));

              }

              if (subComp.subRows != undefined && subComp.subRows.length > 0) {
                subComp?.subRows?.map((Feat: any) => {
                  if (
                    Feat?.DueDate?.length > 0 &&
                    Feat?.DueDate != "Invalid date"
                  ) {
                    Feat.DueDate = Feat?.DueDate
                      ? Moment(Feat?.DueDate).format("MM-DD-YYYY")
                      : null;
                  } else {
                    Feat.DueDate = "";
                  }
                  Feat.flag = true;
                  Feat.show = false;
                  if (Feat.Id == ParentTaskId || Feat.ID == ParentTaskId) {
                    Feat.childs = Feat.childs == undefined ? [] : Feat.childs;
                    Feat.subRows =
                      Feat.subRows == undefined ? [] : Feat.subRows;
                    Feat.childs.push(childItem.data);
                    Feat.subRows.push(childItem.data);
                    Feat.subRows = Feat?.subRows?.filter((ele:any, ind:any) => ind === Feat?.subRows?.findIndex((elem:any) => elem.ID === ele.ID));
                  }

                  if (Feat.subRows != undefined && Feat.subRows.length > 0) {
                    Feat?.subRows?.map((Activity: any) => {
                      if (
                        Activity?.DueDate?.length > 0 &&
                        Activity?.DueDate != "Invalid date"
                      ) {
                        Activity.DueDate = Activity?.DueDate
                          ? Moment(Activity?.DueDate).format("MM-DD-YYYY")
                          : null;
                      } else {
                        Activity.DueDate = "";
                      }
                      Activity.flag = true;
                      Activity.show = false;
                      if (
                        Activity.Id == ParentTaskId ||
                        Activity.ID == ParentTaskId
                      ) {
                        Activity.childs =
                          Activity.childs == undefined ? [] : Activity.childs;
                        Activity.subRows =
                          Activity.subRows == undefined ? [] : Activity.subRows;
                        Activity.childs.push(childItem.data);
                        Activity.subRows.push(childItem.data);
                        // Activity.subRows = Activity?.subRows.filter((val: any, id: any, array: any) => {
                        //     return array.indexOf(val) == id;
                        // })
                        // Activity.subRows = Activity?.subRows?.filter((ele: any, ind: any) => ind === Activity?.subRows?.findIndex((elem: { ID: any }) => elem.ID === ele.ID));
                        Activity.subRows = Activity?.subRows?.filter((ele:any, ind:any) => ind === Activity?.subRows?.findIndex((elem:any) => elem.ID === ele.ID));
                      }

                      if (
                        Activity.subRows != undefined &&
                        Activity.subRows.length > 0
                      ) {
                        Activity?.subRows?.map((workst: any) => {
                          if (
                            workst?.DueDate?.length > 0 &&
                            workst?.DueDate != "Invalid date"
                          ) {
                            workst.DueDate = workst?.DueDate
                              ? Moment(workst?.DueDate).format("MM-DD-YYYY")
                              : null;
                          } else {
                            workst.DueDate = "";
                          }
                          workst.flag = true;
                          workst.show = false;
                          if (
                            workst.Id == ParentTaskId ||
                            workst.ID == ParentTaskId
                          ) {
                            workst.childs =
                              workst.childs == undefined ? [] : workst.childs;
                            workst.subRows =
                              workst.subRows == undefined ? [] : workst.subRows;
                            workst.childs.push(childItem.data);
                            workst.subRows.push(childItem.data);
                            // workst.subRows = workst?.subRows?.filter((ele: any, ind: any) => ind === workst?.subRows?.findIndex((elem: { ID: any }) => elem.ID === ele.ID));
                            workst.subRows = workst?.subRows?.filter((ele:any, ind:any) => ind === workst?.subRows?.findIndex((elem:any) => elem.ID === ele.ID));
                          }
                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
        AllDataRender = AllDataRender?.concat(array);
        Renderarray = [];
        Renderarray = Renderarray.concat(AllDataRender);
        // setData((array) => array);
        refreshDataTaskLable();
        // rerender();
      }
    }
  }, []);

  const TimeEntryCallBack = React.useCallback((item1) => {
    setIsTimeEntry(false);
  }, []);
  const EditComponentPopup = (item: any) => {
    item["siteUrl"] = ContextValue.siteUrl;
    item["listName"] = "Master Tasks";
    setIsComponent(true);
    setSharewebComponent(item);
  };
  const EditItemTaskPopup = (item: any) => {
    setIsTask(true);
    setSharewebTask(item);
  };




  let isOpenPopup = false;
  const CloseCall = React.useCallback((item) => {
    setRowSelection({});
    if (!isOpenPopup && item.CreatedItem != undefined) {
      item.CreatedItem.forEach((obj: any) => {
        obj.data.childs = [];
        obj.data.subRows = [];
        obj.data.flag = true;
        obj.data.TitleNew = obj.data.Title;
        obj.data.siteType = "Master Tasks";
        if (
          obj.data.Item_x0020_Type != undefined &&
          obj.data.Item_x0020_Type === "Component"
        )
          obj.data.SiteIconTitle = "C"; // obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

        if (
          obj.data.Item_x0020_Type != undefined &&
          obj.data.Item_x0020_Type === "SubComponent"
        )
          obj.data.SiteIconTitle = "S"; // obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
        if (
          obj.data.Item_x0020_Type != undefined &&
          obj.data.Item_x0020_Type === "Feature"
        )
          obj.data.SiteIconTitle = "F"; // obj.data.Portfolio_x0020_Type != undefined && obj.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
        obj.data["Shareweb_x0020_ID"] = obj.data.PortfolioStructureID;
        if (
          item.props != undefined &&
          item.props.SelectedItem != undefined &&
          item.props.SelectedItem.childs != undefined
        ) {
          item.props.SelectedItem.childs =
            item.props.SelectedItem.childs == undefined
              ? []
              : item.props.SelectedItem.childs;
          item.props.SelectedItem.childs.unshift(obj.data);
        }
      });
      if (array != undefined && array.length > 0) {
        array.forEach((compnew: any, index: any) => {
          if (compnew.childs != undefined && compnew.childs.length > 0) {
            item.props.SelectedItem.downArrowIcon = compnew.downArrowIcon;
            item.props.SelectedItem.RightArrowIcon = compnew.RightArrowIcon;
            return false;
          }
        });
        array.forEach((comp: any, index: any) => {
          if (
            comp.Id != undefined &&
            item.props.SelectedItem != undefined &&
            comp.Id === item.props.SelectedItem.Id
          ) {
            comp.childsLength = item.props.SelectedItem.childs.length;
            comp.show = comp.show == undefined ? false : comp.show;
            comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
            comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;

            comp.childs = item.props.SelectedItem.childs;
            comp.subRows = item.props.SelectedItem.childs;
          }
          if (comp.childs != undefined && comp.childs.length > 0) {
            comp.childs.forEach((subcomp: any, index: any) => {
              if (
                subcomp.Id != undefined &&
                item.props.SelectedItem != undefined &&
                subcomp.Id === item.props.SelectedItem.Id
              ) {
                subcomp.childsLength = item.props.SelectedItem.childs.length;
                subcomp.show = subcomp.show == undefined ? false : subcomp.show;
                subcomp.childs = item.props.SelectedItem.childs;
                subcomp.subRows = item.props.SelectedItem.childs;
                comp.downArrowIcon = item.props.SelectedItem.downArrowIcon;
                comp.RightArrowIcon = item.props.SelectedItem.RightArrowIcon;
              }
            });
          }
        });
        // }
      }
      setData((array) => [...array]);
      if (
        item.CreateOpenType != undefined &&
        item.CreateOpenType === "CreatePopup"
      ) {
        setSharewebComponent(item.CreatedItem[0].data);
        setIsComponent(true);
      }
      refreshData();
      rerender();
    }
    if (!isOpenPopup && item.data != undefined) {
      item.data.childs = [];
      item.data.flag = true;
      item.data.TitleNew = item.data.Title;
      item.data.siteType = "Master Tasks";
      item.data.childsLength = 0;
      if (
        item.data.Item_x0020_Type != undefined &&
        item.data.Item_x0020_Type === "Component"
      )
        item.data.SiteIconTitle = "C"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

      if (
        item.data.Item_x0020_Type != undefined &&
        item.data.Item_x0020_Type === "SubComponent"
      )
        item.data.SiteIconTitle = "S"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
      if (
        item.data.Item_x0020_Type != undefined &&
        item.data.Item_x0020_Type === "Feature"
      )
        item.data.SiteIconTitle = "F"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';

      // item.data['SiteIcon'] = GetIconImageUrl(item.data.siteType, 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/', undefined);
      item.data["Shareweb_x0020_ID"] = item.data.PortfolioStructureID;

      array.unshift(item.data);
      setData((array) => [...array]);
      refreshData();
      rerender();
    }
    setAddModalOpen(false);
  }, []);

  const CreateOpenCall = React.useCallback((item) => {
    setRowSelection({});
    isOpenPopup = true;
    item.data.childs = [];
    item.data.flag = true;
    item.data.siteType = "Master Tasks";
    item.data.TitleNew = item.data.Title;
    item.data.childsLength = 0;
    if (
      item.data.Item_x0020_Type != undefined &&
      item.data.Item_x0020_Type === "Component"
    )
      item.data.SiteIconTitle = "C"; //item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/component_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/component_icon.png';

    if (
      item.data.Item_x0020_Type != undefined &&
      item.data.Item_x0020_Type === "SubComponent"
    )
      item.data.SiteIconTitle = "S"; //item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'
    if (
      item.data.Item_x0020_Type != undefined &&
      item.data.Item_x0020_Type === "Feature"
    )
      item.data.SiteIconTitle = "F"; // item.data.Portfolio_x0020_Type != undefined && item.data.Portfolio_x0020_Type == 'Service' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
    item.data["Shareweb_x0020_ID"] = item.data.PortfolioStructureID;
    if (checkedList != undefined && checkedList.length > 0)
      checkedList[0].childs.unshift(item.data);
    else array.unshift(item.data);

    setSharewebComponent(item.data);
    setIsComponent(true);
    setData((array) => [...array]);
    refreshData();
    rerender();
  }, []);
  const buttonRestructuring = () => {
    var ArrayTest: any = [];
    if (
      checkedList.length > 0 &&
      checkedList[0].childs != undefined &&
      checkedList[0].childs.length > 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    )
      alert("You are not allowed to Restructure this item.");
    if (
      checkedList.length > 0 &&
      checkedList[0].childs != undefined &&
      checkedList[0].childs.length === 0 &&
      checkedList[0].Item_x0020_Type === "Component"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            if (sub.Item_x0020_Type === "SubComponent") {
              sub.isRestructureActive = true;
            }
          });
        }
      });
    }
    if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "SubComponent"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            if (sub.Id === checkedList[0].Id) {
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
            }
          });
        }
      });
    }
    if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "Feature"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            sub.isRestructureActive = true;
            if (sub.Id === checkedList[0].Id) {
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
            }
            if (sub.childs != undefined && sub.childs.length > 0) {
              sub.childs.forEach((newsub: any) => {
                if (newsub.Id === checkedList[0].Id) {
                  ArrayTest.push(...[obj]);
                  ArrayTest.push(...[sub]);
                  ArrayTest.push(...[newsub]);
                }
              });
            }
          });
        }
      });
    } else if (
      checkedList.length > 0 &&
      checkedList[0].Item_x0020_Type === "Task"
    ) {
      maidataBackup.forEach((obj) => {
        obj.isRestructureActive = true;
        if (obj.Id === checkedList[0].Id) {
          ArrayTest.push(...[obj]);
        }
        if (obj.childs != undefined && obj.childs.length > 0) {
          obj.childs.forEach((sub: any) => {
            if (
              sub.Item_x0020_Type === "SubComponent" ||
              sub.Item_x0020_Type === "Feature"
            )
              sub.isRestructureActive = true;
            if (sub.Id === checkedList[0].Id) {
              ArrayTest.push(...[obj]);
              ArrayTest.push(...[sub]);
            }
            if (sub.childs != undefined && sub.childs.length > 0) {
              sub.childs.forEach((subchild: any) => {
                if (
                  subchild.Item_x0020_Type === "SubComponent" ||
                  subchild.Item_x0020_Type === "Feature"
                )
                  subchild.isRestructureActive = true;
                if (subchild.Id === checkedList[0].Id) {
                  ArrayTest.push(...[obj]);
                  ArrayTest.push(...[sub]);
                  ArrayTest.push(...[subchild]);
                }
                if (
                  subchild.childs != undefined &&
                  subchild.childs.length > 0
                ) {
                  subchild.childs.forEach((listsubchild: any) => {
                    if (listsubchild.Id === checkedList[0].Id) {
                      ArrayTest.push(...[obj]);
                      ArrayTest.push(...[sub]);
                      ArrayTest.push(...[subchild]);
                      ArrayTest.push(...[listsubchild]);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
    setOldArrayBackup(ArrayTest);
    setData((data) => [...maidataBackup]);

  };
  const RestruringCloseCall = () => {
    setResturuningOpen(false);
  };
  const OpenModal = (item: any) => {
    var TestArray: any = [];
    setResturuningOpen(true);
    maidataBackup.forEach((obj) => {
      if (obj.Id === item.Id) TestArray.push(obj);
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any) => {
          sub.isRestructureActive = true;
          if (sub.Id === item.Id) {
            TestArray.push(...[obj]);
            TestArray.push(...[sub]);
          }
          if (sub.childs != undefined && sub.childs.length > 0) {
            sub.childs.forEach((newsub: any) => {
              if (newsub.Id === item.Id) {
                TestArray.push(...[obj]);
                TestArray.push(...[sub]);
                TestArray.push(...[newsub]);
              }
            });
          }
        });
      }
    });
    setChengedItemTitle(checkedList[0].Item_x0020_Type);
    ChengedTitle =
      checkedList[0].Item_x0020_Type === "Feature"
        ? "SubComponent"
        : checkedList[0].Item_x0020_Type === "SubComponent"
          ? "Component"
          : checkedList[0].Item_x0020_Type;
    let Items: any = [];
    Items.push(OldArrayBackup[OldArrayBackup.length - 1]);
    setRestructureChecked(Items);
    setNewArrayBackup((NewArrayBackup) => [...TestArray]);
  };

  const setRestructure = (item: any, title: any) => {
    let array: any = [];
    item.Item_x0020_Type = title;
    if (item != undefined && title === "SubComponent") {
      item.SiteIconTitle = "S"; // IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/SubComponent_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/SubComponent_icon.png'

      ChengedTitle = "Component";
    }
    if (item != undefined && title === "Feature") {
      item.SiteIconTitle = "F"; // IsUpdated != undefined && IsUpdated == 'Service Portfolio' ? 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Service_Icons/feature_icon.png' : 'https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/feature_icon.png';
      ChengedTitle = "SubComponent";
    }
    setChengedItemTitle(title);
    array.push(item);
    setRestructureChecked((RestructureChecked: any) => [...array]);
    maidataBackup.forEach((obj) => {
      if (obj.Id === item.Id) {
        PortfolioLevelNum = obj.childs.length + 1;
      }
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any) => {
          if (sub.Id === item.Id) {
            PortfolioLevelNum = sub.childs.length + 1;
          }
          if (sub.childs != undefined && sub.childs.length > 0) {
            sub.childs.forEach((newsub: any) => {
              if (newsub.Id === item.Id) {
                PortfolioLevelNum = newsub.childs.length + 1;
              }
            });
          }
        });
      }
    });
  };
  const UpdateTaskRestructure = async function () {
    var Ids: any = [];
    if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
      NewArrayBackup.forEach((obj, index) => {
        if (NewArrayBackup.length - 1 === index) Ids.push(obj.Id);
      });
    }

    let web = new Web(ContextValue.siteUrl);
    await web.lists
      .getById(checkedList[0].listId)
      .items.getById(checkedList[0].Id)
      .update({
        ComponentId:
          checkedList[0].Portfolio_x0020_Type === "Component"
            ? { results: Ids }
            : { results: [] },
        ServicesId:
          checkedList[0].Portfolio_x0020_Type === "Service"
            ? { results: Ids }
            : { results: [] },
      })
      .then((res: any) => {
        maidataBackup.forEach((obj, index) => {
          obj.isRestructureActive = false;
          if (obj.Id === checkedList[0].Id) {
            if (obj.childs.length === 0) {
              obj.downArrowIcon = "";
              obj.RightArrowIcon = "";
            }
          }
          if (obj.childs != undefined && obj.childs.length > 0) {
            obj.childs.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === checkedList[0].Id) {
                obj.childs.splice(indexsub, 1);
                if (sub.childs.length === 0) {
                  sub.downArrowIcon = "";
                  sub.RightArrowIcon = "";
                }
              }
              if (sub.childs != undefined && sub.childs.length > 0) {
                sub.childs.forEach((newsub: any, lastIndex: any) => {
                  newsub.isRestructureActive = false;
                  if (newsub.Id === checkedList[0].Id) {
                    sub.childs.splice(lastIndex, 1);
                    if (newsub.childs.length === 0) {
                      newsub.downArrowIcon = "";
                      newsub.RightArrowIcon = "";
                    }
                  }
                });
              }
            });
          }
        });
        maidataBackup.forEach((obj, index) => {
          if (obj.Id === Ids[0]) {
            obj.flag = true;
            obj.show = true;
            obj.downArrowIcon =
              obj.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            obj.RightArrowIcon =
              obj.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

            obj.childs.push(checkedList[0]);
            obj.childsLength = obj.childs.length;
          }
          if (obj.childs != undefined && obj.childs.length > 0) {
            obj.childs.forEach((sub: any, indexsub: any) => {
              sub.isRestructureActive = false;
              if (sub.Id === Ids[0]) {
                sub.flag = true;
                sub.show = true;
                sub.downArrowIcon =
                  sub.Portfolio_x0020_Type == "Service"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                sub.RightArrowIcon =
                  sub.Portfolio_x0020_Type == "Service"
                    ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                    : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

                sub.childs.push(checkedList[0]);
                sub.childsLength = sub.childs.length;
              }
              if (sub.childs != undefined && sub.childs.length > 0) {
                sub.childs.forEach((newsub: any, lastIndex: any) => {
                  if (newsub.Id === Ids[0]) {
                    newsub.flag = true;
                    newsub.show = true;
                    newsub.downArrowIcon =
                      newsub.Portfolio_x0020_Type == "Service"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
                    newsub.RightArrowIcon =
                      newsub.Portfolio_x0020_Type == "Service"
                        ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                        : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

                    newsub.childs.push(checkedList[0]);
                    newsub.childsLength = newsub.childs.length;
                  }
                });
              }
            });
          }
        });
        setData((data) => [...maidataBackup]);
        RestruringCloseCall();
      });
  };
  const UpdateRestructure = async function () {
    let PortfolioStructureIDs: any = "";
    var Item: any = "";
    let flag: any = false;
    let ChengedItemTitle: any = "";
    if (
      RestructureChecked != undefined &&
      RestructureChecked.length > 0 &&
      RestructureChecked[0].Item_x0020_Type == "Feature"
    ) {
      ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
    } else if (
      RestructureChecked != undefined &&
      RestructureChecked.length > 0 &&
      RestructureChecked[0].Item_x0020_Type == "SubComponent"
    ) {
      ChengedItemTitle = RestructureChecked[0].Item_x0020_Type;
    }
    let count: any = 0;
    let newItem: any = "";
    if (NewArrayBackup.length === 1) newItem = NewArrayBackup[0];
    else {
      NewArrayBackup.forEach((newe: any) => {
        if (ChengedTitle != "" && newe.Item_x0020_Type === ChengedTitle)
          newItem = newe;
        else if (newe.Item_x0020_Type === ChengedItemTitle) newItem = newe;
      });
    }
    maidataBackup.forEach((obj) => {
      if (obj.Id === newItem.Id) {
        PortfolioLevelNum = obj.childs.length + 1;
      }
      if (obj.childs != undefined && obj.childs.length > 0) {
        obj.childs.forEach((sub: any) => {
          if (sub.Id === newItem.Id) {
            obj.childs.forEach((leng: any) => {
              if (leng.Item_x0020_Type === newItem.Item_x0020_Type) count++;
            });
            PortfolioLevelNum = count + 1;
          }
          if (sub.childs != undefined && sub.childs.length > 0) {
            sub.childs.forEach((newsub: any) => {
              if (newsub.Id === newItem.Id) {
                sub.childs.forEach((subleng: any) => {
                  if (subleng.Item_x0020_Type === newItem.Item_x0020_Type)
                    count++;
                });
                PortfolioLevelNum = count + 1;
              }
            });
          }
        });
      }
    });
    if (NewArrayBackup != undefined && NewArrayBackup.length > 0) {
      NewArrayBackup.forEach((newobj: any) => {
        if (ChengedTitle != "" && newobj.Item_x0020_Type === ChengedTitle)
          Item = newobj;
        else if (
          ChengedTitle === "" &&
          ChengedItemTitle === newobj.Item_x0020_Type
        )
          Item = newobj;
      });
    }
    if (Item === "") Item = NewArrayBackup[0];
    if (
      Item !== undefined &&
      Item.PortfolioStructureID != undefined &&
      ChengedItemTitle != undefined
    ) {
      PortfolioStructureIDs =
        Item.PortfolioStructureID +
        "-" +
        ChengedItemTitle.slice(0, 1) +
        PortfolioLevelNum;
    }

    var UploadImage: any = [];

    var item: any = {};
    if (ChengedItemTitl === undefined) {
      let web = new Web(ContextValue.siteUrl);
      await web.lists
        .getById("ec34b38f-0669-480a-910c-f84e92e58adf")
        .items.getById(checkedList[0].Id)
        .update({
          ParentId: Item.Id,
          PortfolioLevel: PortfolioLevelNum,
          PortfolioStructureID: PortfolioStructureIDs,
        })
        .then((res: any) => {
          if (ChengedItemTitl === undefined) {
            checkedList[0].Shareweb_x0020_ID = PortfolioStructureIDs;
            checkedList[0].PortfolioStructureID = PortfolioStructureIDs;
            checkedList[0].PortfolioLevel = PortfolioLevelNum;
            if (Item.childs != undefined) {
              Item.childs.push(checkedList[0]);
            } else {
              Item.childs = [];
              Item.childs.push(checkedList[0]);
            }
          }
          console.log(res);
          setData((data) => [...maidataBackup]);
          RestruringCloseCall();
        });
    }
    if (ChengedItemTitl != undefined && ChengedItemTitl != "") {
      let web = new Web(ContextValue.siteUrl);
      await web.lists
        .getById(ContextValue.MasterTaskListID)
        .items.getById(checkedList[0].Id)
        .update({
          ParentId: Item.Id,
          PortfolioLevel: PortfolioLevelNum,
          PortfolioStructureID: PortfolioStructureIDs,
          Item_x0020_Type: ChengedItemTitl,
        })
        .then((res: any) => {
          console.log(res);
          maidataBackup.forEach((obj, index) => {
            obj.isRestructureActive = false;
            if (obj.Id === checkedList[0].Id) {
              checkedList[0].downArrowIcon = obj.downArrowIcon;
              checkedList[0].RightArrowIcon = obj.RightArrowIcon;
            }
            if (obj.childs != undefined && obj.childs.length > 0) {
              obj.childs.forEach((sub: any, indexsub: any) => {
                sub.isRestructureActive = false;
                if (sub.Id === checkedList[0].Id) {
                  obj.childs.splice(indexsub, 1);
                  checkedList[0].downArrowIcon = obj.downArrowIcon;
                  checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                }
                if (sub.childs != undefined && sub.childs.length > 0) {
                  sub.childs.forEach((newsub: any, lastIndex: any) => {
                    newsub.isRestructureActive = false;
                    if (newsub.Id === checkedList[0].Id) {
                      sub.childs.splice(lastIndex, 1);

                      checkedList[0].downArrowIcon = obj.downArrowIcon;
                      checkedList[0].RightArrowIcon = obj.RightArrowIcon;
                    }
                  });
                }
              });
            }
          });
          checkedList[0].PortfolioStructureID = PortfolioStructureIDs;
          checkedList[0].Shareweb_x0020_ID = PortfolioStructureIDs;
          checkedList[0].PortfolioLevel = PortfolioLevelNum;
          checkedList[0].IsNew = true;
          checkedList[0].Item_x0020_Type = ChengedItemTitl;
          if (Item.childs != undefined) {
            checkedList[0].downArrowIcon =
              Item.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Downarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/list-icon.png";
            checkedList[0].RightArrowIcon =
              Item.Portfolio_x0020_Type == "Service"
                ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Rightarrowicon-green.png"
                : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/24/right-list-icon.png";

            Item.childs.push(checkedList[0]);
          } else {
            Item.childs = [];
            Item.show = true;
            Item.downArrowIcon = checkedList[0].downArrowIcon;
            Item.RightArrowIcon = checkedList[0].RightArrowIcon;
            Item.childs.push(checkedList[0]);
          }
          setCheckedList((checkedList) => [...[]]);
          setData((data) => [...maidataBackup]);
          RestruringCloseCall();
        });
    }
    // setResturuningOpen(true)
  };
  var PortfolioLevelNum: any = 0;
  const onRenderCustomHeaderMain1 = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px",
          }}
        >
          <span>{`Create Component `}</span>
        </div>
        <Tooltip ComponentId={checkedList[0]?.Id} />
      </div>
    );
  };
  const onRenderCustomHeaderMain = () => {
    return (
      <div className="d-flex full-width pb-1">
        <div
          style={{
            marginRight: "auto",
            fontSize: "20px",
            fontWeight: "600",
            marginLeft: "20px",
          }}
        >
          <span>{`Create Activity ${checkedList[0]?.Title}`} ``</span>
        </div>
        <Tooltip ComponentId={checkedList[0]?.Id} />
      </div>
    );
  };

  ///react table start function//////
  /////////////////////PopHover Structure ID///////////////////////////////
  // const column = React.useMemo<ColumnDef<any, unknown>[]>(
  //   () => [
  //     {
  //       accessorKey: "",
  //       size: 7,
  //       canSort: false,
  //       placeholder: "",
  //       id: 'Shareweb_x0020_ID',
  //       // header: ({ table }: any) => (
  //       //   <>
  //       //     <button className='border-0 bg-Ff'
  //       //       {...{
  //       //         onClick: table.getToggleAllRowsExpandedHandler(),
  //       //       }}
  //       //     >
  //       //       {table.getIsAllRowsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
  //       //     </button>{" "}
  //       //   </>
  //       // ),
  //       cell: ({ row, getValue }) => (
  //         <div
  //           style={row.getCanExpand() ? {
  //             paddingLeft: `${row.depth * 5}px`,
  //           } : {
  //             paddingLeft: "18px",
  //           }}
  //         >
  //           <>
  //             {row.getCanExpand() ? (
  //               <span className=' border-0'
  //                 {...{
  //                   onClick: row.getToggleExpandedHandler(),
  //                   style: { cursor: "pointer" },
  //                 }}
  //               >
  //                 {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
  //               </span>
  //             ) : (
  //               ""
  //             )}{" "}

  //             <> {row?.original?.siteIcon != undefined ?
  //               <a className="hreflink" title="Show All Child" data-toggle="modal">
  //                 <img className="icon-sites-img ml20 me-1" src={row?.original?.siteIcon}></img>
  //               </a> : <>{row?.original?.Title != "Others" ? <div className='Dyicons'>{row?.original?.SiteIconTitle}</div> : ""}</>}
  //               <span>{row?.original?.Shareweb_x0020_ID}</span>
  //             </>
  //             {getValue()}
  //           </>
  //         </div>
  //       ),
  //     },
  //     {
  //       cell: ({ row }) => (
  //         <>
  //           <span>{row.original.Title}</span>
  //         </>
  //       ),
  //       id: "Title",
  //       canSort: false,
  //       placeholder: "",
  //       header: "",
  //       size: 15,
  //     }
  //   ],
  //   [data]
  // );
  // const callBackData = React.useCallback((elem: any, ShowingData: any) => {

  // }, []);

  // const handleSuffixHover = (item: any) => {
  //   if (item != undefined) {
  //     popHoverDataGroup = globalCommon.PopHoverBasedOnTaskId(item)

  //   }
  //   if (popHoverDataGroup != undefined && popHoverDataGroup?.length > 0) {
  //     setPopHoverData((popHoverData) => popHoverDataGroup);
  //     showPopHover = "block"
  //   }
  //   // setDisplay("block");
  // };

  // const handleuffixLeave = (item: any) => {
  //   popHoverDataGroup = [];
  //   setPopHoverData([])
  //   // setDisplay("none");
  //   showPopHover = "none"
  // };



  /////////////////////PopHover Structure ID End///////////////////////////////
  /////////////////////Table Column Start///////////////////////////////
  const columns = React.useMemo<ColumnDef<any, unknown>[]>(
    () => [
      {
        accessorKey: "",
        placeholder: "",
        size: 35,
        id: 'Id',
        header: ({ table }: any) => (
          <>
            <button
              className="border-0 bg-Ff"
              {...{
                onClick: table.getToggleAllRowsExpandedHandler(),
              }}
            >
              {table.getIsAllRowsExpanded() ? (
                <FaChevronDown />) : (<FaChevronRight />)}
            </button>{" "}
          </>
        ),
        cell: ({ row, getValue }) => (
          <div className="d-flex">
            <>
              {row.getCanExpand() ? (
                <span
                  className="border-0"
                  {...{
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: "pointer" },
                  }}
                >
                  {row.getIsExpanded() ? <FaChevronDown /> : <FaChevronRight />}
                </span>
              ) : (
                ""
              )}{" "}
              {getValue()}
            </>
          </div>
        ),
      },


      {
        header: ({ table }: any) => (
          <>
            <IndeterminateCheckbox className="mx-1 "
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />{" "}
          </>
        ),
        cell: ({ row, getValue }) => (
          <>
            <span className="d-flex">
              {row?.original?.Title != "Others" ? (
                <IndeterminateCheckbox
                  {...{
                    checked: row.getIsSelected(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler(),
                  }}
                />
              ) : (
                ""
              )}{" "}
              {row?.original?.SiteIcon != undefined ? (
                <a className="hreflink" title="Show All Child" data-toggle="modal" >
                  <img className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 icon-sites-img ml20 me-1" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Activities" ? "ml-36 icon-sites-img ml20 me-1" :
                    row?.original?.SharewebTaskType?.Title == "Workstream" ? "ml-48 icon-sites-img ml20 me-1" : row?.original?.SharewebTaskType?.Title == "Task" ? "ml-60 icon-sites-img ml20 me-1" : "icon-sites-img ml20 me-1"
                  }
                    src={row?.original?.SiteIcon}>
                  </img>
                </a>
              ) : (
                <>
                  {row?.original?.Title != "Others" ? (
                    <div className={row?.original?.Item_x0020_Type == "SubComponent" ? "ml-12 Dyicons" : row?.original?.Item_x0020_Type == "Feature" ? "ml-24 Dyicons" : row?.original?.SharewebTaskType?.Title == "Activities" ? "ml-36 Dyicons" :
                      row?.original?.SharewebTaskType?.Title == "Workstream" ? "ml-48 Dyicons" : row?.original?.SharewebTaskType?.Title == "Task" ? "ml-60 Dyicons" : "Dyicons"
                    }>
                      {row?.original?.SiteIconTitle}
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}


              {/* ////////// Plush Icons////// */}
              <span>
                {((row.getCanExpand() &&
                  row.subRows?.length !== row.original.subRows?.length) ||
                  !row.getCanExpand() ||
                  forceExpanded.includes(row.id)) &&
                  row.original.subRows?.length ? (
                  <span className="mx-1"
                    {...{
                      onClick: () => {
                        if (!forceExpanded.includes(row.id)) {
                          const coreIds = table.getCoreRowModel().rowsById;
                          row.subRows = coreIds[row.id].subRows;
                          const rowModel = table.getRowModel();
                          const updateRowModelRecursively = (item: any) => {
                            item.subRows?.forEach((elem: any) => {
                              if (!rowModel.rowsById[elem.id]) {
                                rowModel.flatRows.push(elem);
                                rowModel.rowsById[elem.id] = elem;
                              }
                              elem?.subRows?.length &&
                                updateRowModelRecursively(elem);
                            });
                          }
                          updateRowModelRecursively(row);
                          const temp = Object.keys(coreIds).filter(
                            (item: any) =>
                              item === row.id ||
                              item.startsWith(row.id + ".")
                          );
                          forceExpanded = [...forceExpanded, ...temp];
                          setExpanded((prev: any) => ({
                            ...prev,
                            [row.id]: true,
                          }));
                        } else {
                          row.getToggleExpandedHandler()();
                        }
                      },
                      style: { cursor: "pointer" },
                    }}
                  >
                    {!row.getCanExpand() ||
                      (row.getCanExpand() &&
                        row.subRows?.length !== row.original.subRows?.length)
                      ? <FaPlus />
                      : row.getIsExpanded()
                        ? <FaMinus />
                        : <FaPlus />}
                  </span>
                ) : (
                  ""
                )}{" "}
              </span>
              {getValue()}
            </span>
          </>
        ),
        accessorKey: "",
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        size: 145,
      },
      // {
      //   accessorFn: (row) => row?.Shareweb_x0020_ID,
      //   cell: ({ row }) => (
      //     <>
      //       <div className="tooltipSec popover__wrapper me-1">
      //         <span onMouseOver={(e) => handleSuffixHover(row)}>{row?.original?.Shareweb_x0020_ID}</span>
      //         <div className="popover__content" style={{ display: showPopHover }}>
      //           <div>
      //             <div className="tootltip-title">{row?.original?.Title}</div>
      //             <button className="toolClose" onClick={(e) => handleuffixLeave(row)}><div className="popHoverCross">×</div></button>
      //           </div>
      //           <div className="tooltip-body">
      //             {popHoverDataGroup && <GlobalCommanTable columns={column} data={popHoverDataGroup} callBackData={callBackData} />}
      //           </div>
      //         </div>
      //       </div>
      //     </>
      //   ),
      //   id: "Shareweb_x0020_ID",
      //   placeholder: "ID",
      //   header: "",
      //   size: 130,
      // },
      {
        accessorKey: "Shareweb_x0020_ID",
        placeholder: "ID",
        header: "",
        size: 130,
        resetColumnFilters: false,
      },
      {
        accessorFn: (row) => row?.Title,
        cell: ({ row, column, getValue }) => (
          <>
            {row?.original?.siteType == "Master Tasks" && row?.original?.Title !== "Others" && (
              <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Portfolio-Profile.aspx?taskId=" + row?.original?.ID} >
                {/* <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} /> */}
              </a>
            )}
            {row?.original?.siteType != "Master Tasks" && row?.original?.Title !== "Others" && (
              <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" onClick={(e) => EditData(e, row?.original)}
                href={ContextValue.siteUrl + "/SitePages/Task-Profile.aspx?taskId=" + row?.original?.ID + "&Site=" + row?.original?.siteType} >
                {/* <HighlightableCell value={getValue()} searchTerm={column.getFilterValue() != undefined ? column.getFilterValue() : globalFilterHighlited} /> */}
              </a>
            )}
            {row?.original.Title === "Others" ? (
              <span>{row?.original.Title}</span>
            ) : (
              ""
            )}
            {row?.original?.Categories == 'Draft' ?
              <FaCompressArrowsAlt style={{ height: '11px', width: '20px' }} /> : ''}
            {row?.original?.subRows?.length > 0 ?
              <span className='ms-1'>{row?.original?.subRows?.length ? '(' + row?.original?.subRows?.length + ')' : ""}</span> : ''}
            {/* {<span className='ms-1'>{'(' + row?.original?.ChlidLenghtVal + ')'}</span> : ''} */}

            {row?.original?.Short_x0020_Description_x0020_On != null && (
              <span className="popover__wrapper ms-1" data-bs-toggle="tooltip" data-bs-placement="auto" >
                <span
                  title="Edit"
                  className="svg__iconbox svg__icon--info"
                ></span>
                <span
                  className="popover__content"
                  dangerouslySetInnerHTML={{
                    __html: row?.original?.Short_x0020_Description_x0020_On,
                  }}
                ></span>
              </span>
            )}
          </>
        ),
        id: "Title",
        placeholder: "Title",
        resetColumnFilters: false,
        header: "",
      },
      {
        accessorFn: (row) => row?.ClientCategory?.map((elem: any) => elem.Title).join("-"),
        cell: ({ row }) => (
          <>
            {/* <ShowClintCatogory clintData={row?.original} AllMetadata={AllMetadata} /> */}
          </>
        ),
        id: "ClientCategory",
        placeholder: "Client Category",
        header: "",
        resetColumnFilters: false,
        size: 100,
      },
      {
        accessorFn: (row) => row?.TeamLeaderUser?.map((val: any) => val.Title).join("-"),
        cell: ({ row }) => (
          <div>
            <ShowTaskTeamMembers key={row?.original?.Id} props={row?.original} TaskUsers={AllUsers} Context={SelectedProp?.SelectedProp} />
          </div>
        ),
        id: "TeamLeaderUser",
        placeholder: "Team",
        resetColumnFilters: false,
        header: "",
        size: 131,
      },
      {
        accessorKey: "PercentComplete",
        placeholder: "Status",
        header: "",
        resetColumnFilters: false,
        size: 42,
      },
      {
        accessorKey: "ItemRank",
        placeholder: "Item Rank",
        header: "",
        resetColumnFilters: false,
        size: 42,
      },
      {
        accessorKey: "DueDate",
        placeholder: "Due Date",
        header: "",
        resetColumnFilters: false,
        size: 100,
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.siteType != "Master Tasks" && (
              <a
                onClick={(e) => EditDataTimeEntryData(e, row.original)}
                data-bs-toggle="tooltip"
                data-bs-placement="auto"
                title="Click To Edit Timesheet"
              >
                <span
                  className="svg__iconbox svg__icon--clock"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title="Click To Edit Timesheet"
                ></span>
              </a>
            )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 1,
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.siteType === "Master Tasks" &&
              row?.original?.Title !== "Others" &&
              row?.original?.isRestructureActive && (
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title="Edit"
                >
                  <img
                    className="icon-sites-img"
                    src={row?.original?.Restructuring}
                    onClick={(e) => OpenModal(row?.original)}
                  />
                </a>
              )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 1,
      },
      {
        cell: ({ row, getValue }) => (
          <>
            {row?.original?.siteType === "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title="Edit"
                >
                  {" "}
                  <span
                    title="Edit"
                    className="svg__iconbox svg__icon--edit"
                    onClick={(e) => EditComponentPopup(row?.original)}
                  ></span>
                </a>
              )}
            {row?.original?.siteType != "Master Tasks" &&
              row?.original?.Title !== "Others" && (
                <a
                  href="#"
                  data-bs-toggle="tooltip"
                  data-bs-placement="auto"
                  title="Edit"
                >
                  {" "}
                  <span
                    title="Edit"
                    className="svg__iconbox svg__icon--edit"
                    onClick={(e) => EditItemTaskPopup(row?.original)}
                  ></span>
                </a>
              )}
            {getValue()}
          </>
        ),
        id: "row?.original.Id",
        canSort: false,
        placeholder: "",
        header: "",
        size: 30,
      },
    ],
    [data]
  );

  /////////////////////Table Column End///////////////////////////////
  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      columnFilters,
      globalFilter,
      expanded,
      sorting,
      rowSelection,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
    filterFromLeafRows: true,
    enableSubRowSelection: false,
  });

  console.log(".........", table.getSelectedRowModel().flatRows);
  React.useEffect(() => {
    CheckDataPrepre();
  }, [table?.getSelectedRowModel()?.flatRows.length]);

  const CheckDataPrepre = () => {
    let itrm: any;
    let parentData: any;
    let parentDataCopy: any;
    if (table?.getSelectedRowModel()?.flatRows.length > 0) {
      table?.getSelectedRowModel()?.flatRows?.map((elem: any) => {
        if (elem?.getParentRows() != undefined) {
        // parentData = elem?.parentRow;
        // parentDataCopy = elem?.parentRow?.original
        parentDataCopy = elem?.getParentRows()[0]?.original;
        // if (parentData != undefined && parentData?.parentRow != undefined) {

        //   parentData = elem?.parentRow?.parentRow
        //   parentDataCopy = elem?.parentRow?.parentRow?.original

        //   if (parentData != undefined && parentData?.parentRow != undefined) {

        //     parentData = elem?.parentRow?.parentRow?.parentRow
        //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.original
        //   }
        //   if (parentData != undefined && parentData?.parentRow != undefined) {

        //     parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow
        //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.original
        //   }
        //   if (parentData != undefined && parentData?.parentRow != undefined) {

        //     parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
        //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
        //   }
        //   if (parentData != undefined && parentData?.parentRow != undefined) {
        //     parentData = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow
        //     parentDataCopy = elem?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.parentRow?.original
        //   }
        // }
        }
        elem.original.Id = elem.original.ID;
        itrm = elem.original;
        if (elem?.getCanSelect() == true) {
          if (itrm.SharewebTaskType == undefined) {
            setActivityDisable(false);
            itrm["siteUrl"] = ContextValue?.siteUrl;
            itrm["listName"] = "Master Tasks";
          }
          if (itrm.SharewebTaskType != undefined) {
            if (
              itrm?.SharewebTaskType?.Title == "Activities" || itrm.SharewebTaskType.Title == "Workstream") {
              setActivityDisable(false);
              itrm["siteUrl"] = ContextValue?.siteUrl;
              itrm["PortfolioId"] = parentDataCopy.Id ? parentDataCopy?.Id : 'parent';
            }
          }
          // if (itrm?.SharewebTaskType != undefined) {
          //   if (itrm?.SharewebTaskType?.Title == "Task") {
          //     setActivityDisable(true);
          //   }
          // }
        }
        if (elem?.getCanSelect() === true) {
          setcheckData(table?.getSelectedRowModel()?.flatRows)
          setShowTeamMemberOnCheck(true)
        }
        setCheckedList([itrm])
      });
    } else {
      maidataBackup?.forEach((obj, index) => {
        obj.isRestructureActive = false;
        if (obj.childs != undefined && obj?.childs?.length > 0) {
          obj?.childs?.forEach((sub: any, indexsub: any) => {
            sub.isRestructureActive = false;
            if (sub.childs != undefined && sub.childs.length > 0) {
              sub?.childs?.forEach((newsub: any, lastIndex: any) => {
                newsub.isRestructureActive = false;
              });
            }
          });
        }
      });
      setcheckData([])
      setCheckedList([]);
      setShowTeamMemberOnCheck(false)
    }
  };

  const openTaskAndPortfolioMulti = () => {
    checkData?.map((item: any) => {
      if (item?.original?.siteType === "Master Tasks") {
        window.open(`${ContextValue?.siteUrl}/SitePages/Portfolio-Profile.aspx?taskId=${item?.original?.Id}`, '_blank')
      } else {
        window.open(`${ContextValue?.siteUrl}/SitePages/Task-Profile.aspx?taskId=${item?.original?.Id}&Site=${item?.original?.siteType}`, '_blank')
      }
    })
  }

  let activity = 0;
  let workstrim = 0;
  let task = 0;
  data.map((Com) => {
    

    Com?.subRows?.map((Sub: any) => {
      if (Sub?.SharewebTaskType?.Title == "Activities") {
        activity = activity + 1;
      }
      if (Sub?.SharewebTaskType?.Title == "Workstream") {
        workstrim = workstrim + 1;
      }
      if (Sub?.SharewebTaskType?.Title == "Task") {
        task = task + 1;
      }

      Sub?.subRows?.map((feat: any) => {
        if (feat?.SharewebTaskType?.Title == "Activities") {
          activity = activity + 1;
        }
        if (feat?.SharewebTaskType?.Title == "Workstream") {
          workstrim = workstrim + 1;
        }
        if (feat?.SharewebTaskType?.Title == "Task") {
          task = task + 1;
        }
        feat?.subRows?.map((acti: any) => {
          if (acti?.SharewebTaskType?.Title == "Activities") {
            activity = activity + 1;
          }
          if (acti?.SharewebTaskType?.Title == "Workstream") {
            workstrim = workstrim + 1;
          }
          if (acti?.SharewebTaskType?.Title == "Task") {
            task = task + 1;
          }
          acti?.subRows?.map((works: any) => {
            if (works?.SharewebTaskType?.Title == "Activities") {
              activity = activity + 1;
            }
            if (works?.SharewebTaskType?.Title == "Workstream") {
              workstrim = workstrim + 1;
            }
            if (works?.SharewebTaskType?.Title == "Task") {
              task = task + 1;
            }
            works?.subRows?.map((taskss: any) => {
              if (taskss?.SharewebTaskType?.Title == "Activities") {
                activity = activity + 1;
              }
              if (taskss?.SharewebTaskType?.Title == "Workstream") {
                workstrim = workstrim + 1;
              }
              if (taskss?.SharewebTaskType?.Title == "Task") {
                task = task + 1;
              }
            });
          });
        });
      });
    });
  });

  let AfterSearch = table?.getRowModel()?.rows;
  let ComponentCopy = 0;
  let SubComponentCopy = 0;
  let FeatureCopy = 0;
  let FilterShowhideShwingData: any = false;
  let activityCopy = 0;
  let workstrimCopy = 0;
  let taskCopy = 0;

  if (AfterSearch != undefined && AfterSearch.length > 0) {
    AfterSearch?.map((Comp: any) => {
      if (
        Comp.columnFilters.Title == true ||
        Comp.columnFilters.Shareweb_x0020_ID == true ||
        Comp.columnFilters.ClientCategory == true ||
        Comp.columnFilters.TeamLeaderUser == true ||
        Comp.columnFilters.PercentComplete == true ||
        Comp.columnFilters.ItemRank == true ||
        Comp.columnFilters.DueDate == true
      ) {
        FilterShowhideShwingData = true;
      }
      else if (Comp?.columnFilters?.__global__ === true) {
        FilterShowhideShwingData = true;
      }
      if (Comp.original != undefined) {
        if (Comp?.original?.Item_x0020_Type == "Component") {
          ComponentCopy = ComponentCopy + 1;
        }
        if (Comp?.original?.Item_x0020_Type == "SubComponent") {
          SubComponentCopy = SubComponentCopy + 1;
        }
        if (Comp?.original?.Item_x0020_Type == "Feature") {
          FeatureCopy = FeatureCopy + 1;
        }
        if (Comp?.original?.SharewebTaskType?.Title == "Activities") {
          activityCopy = activityCopy + 1;
        }
        if (Comp?.original?.SharewebTaskType?.Title == "Workstream") {
          workstrimCopy = workstrimCopy + 1;
        }
        if (Comp?.original?.SharewebTaskType?.Title == "Task") {
          taskCopy = taskCopy + 1;
        }
      }
    });
  }

  // React.useEffect(() => {
  //   if (table.getState()?.globalFilter?.length > 0) {
  //     setExpanded(true);
  //   } else {
  //     setExpanded({})
  //   }
  // }, [table.getState().globalFilter]);

  // React.useEffect(() => {
  //   if (table.getState().columnFilters.length) {
  //     setExpanded(true);
  //   } else {
  //     setExpanded({});
  //   }
  // }, [table.getState().columnFilters]);

  React.useEffect(() => {
    if (table.getState().columnFilters.length || table.getState()?.globalFilter?.length > 0) {
      const allKeys = Object.keys(table.getFilteredRowModel().rowsById).reduce(
        (acc: any, cur: any) => {
          if (table.getFilteredRowModel().rowsById[cur].subRows?.length) {
            acc[cur] = true;
          }
          return acc;
        },
        {}
      );
      setExpanded(allKeys);
    } else {
      setExpanded({});
    }
    forceExpanded = [];
  }, [table.getState().columnFilters, table.getState().globalFilter]);

  const ShowTeamFunc = () => {
    setShowTeamPopup(true)
  }

  const showTaskTeamCAllBack = React.useCallback(() => {
    setShowTeamPopup(false)
    setRowSelection({});
  }, []);

  return (
    <div
      id="ExandTableIds"
      className={
        IsUpdated == "Events Portfolio"
          ? "app component clearfix eventpannelorange"
          : IsUpdated == "Service Portfolio"
            ? "app component clearfix serviepannelgreena"
            : "app component clearfix eventpanneblue"
      }
    >
      <section className="ContentSection">
        <div className="col-sm-12 clearfix">
          <h2 className="d-flex justify-content-between align-items-center siteColor  serviceColor_Active">
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("service") > -1 && (
                <div>Service Portfolio</div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("service") > -1 && (
                <div className="text-end fs-6">
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Service-Portfolio-Old.aspx"
                    }
                  >
                    Old Service Portfolio
                  </a>
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("event") > -1 && (
                <div>Event Portfolio</div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("event") > -1 && (
                <div className="text-end fs-6">
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Event-Portfolio-Old.aspx"
                    }
                  >
                    Old Event Portfolio
                  </a>
                </div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("component") > -1 && (
                <div>Component Portfolio</div>
              )}
            {IsUpdated != "" &&
              IsUpdated != undefined &&
              IsUpdated.toLowerCase().indexOf("component") > -1 && (
                <div className="text-end fs-6">
                  {(IsUpdated != "" && IsUpdated != undefined && IsUpdated.toLowerCase().indexOf('component') > -1) && <div className='text-end fs-6'>
                    {(ContextValue?.siteUrl?.toLowerCase().indexOf('ksl') > -1 || ContextValue?.siteUrl?.toLowerCase().indexOf('gmbh') > -1) ? (
                      <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Team-Portfolio-Old.aspx"} >Old Team Portfolio</a>
                    ) : <a data-interception="off" target="_blank" className="hreflink serviceColor_Active" href={ContextValue.siteUrl + "/SitePages/Component-Portfolio-Old.aspx"} >Old Component Portfolio</a>
                    } </div>}
                </div>
              )}
          </h2>
        </div>
        <div className="bg-wihite border p-2">
          <div className="togglebox">
            <label className="toggler full_width mb-10">
              <span
                className=" siteColor"
                onClick={() =>
                  setIsSmartfilter(IsSmartfilter === true ? false : true)
                }
              >
                {/* <img className="hreflink wid22"
                                    src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png" /> */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 48 48" fill="currentColor">
                                    <path d="M36 11H11V15.0625L20.6774 23.1875V32.9375L27.129 37V23.1875L36 15.0625V11Z" stroke="#333333" stroke-width="0" />
                                </svg> */}
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("service") > -1 && (
                    <img
                      className="hreflink wid22"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Filter-12-WF.png"
                    />
                  )}
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("event") > -1 && (
                    <img
                      className="hreflink wid22"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Event_Icons/Filter-12-WF.png"
                    />
                  )}
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("component") > -1 && (
                    <img
                      className="hreflink wid22"
                      src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Filter-12-WF.png"
                    />
                  )}
                SmartSearch – Filters
              </span>
              <span className="ml-20 siteColor">
                {ShowSelectdSmartfilter != undefined &&
                  ShowSelectdSmartfilter.length > 0 && (
                    <>
                      {ShowSelectdSmartfilter?.map(function (obj, index) {
                        return (
                          <>
                            {obj.Title}
                            <span className="font-normal">
                              {obj.selectTitle}
                            </span>
                            {index != ShowSelectdSmartfilter.length - 1 && (
                              <span> | </span>
                            )}
                          </>
                        );
                      })}
                    </>
                  )}
              </span>
              <span className="pull-right bg-color">
                {IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("service") > -1 && (
                    <span>
                      {" "}
                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        onClick={() =>
                          setIsSmartfilter(
                            IsSmartfilter === true ? false : true
                          )
                        }
                        src={
                          IsSmartfilter === true
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/newsub_icon.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Service_Icons/Add-New.png"
                        }
                      />
                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Green.png"
                      />
                    </span>
                  )}
                {((IsUpdated != undefined &&
                  IsUpdated.toLowerCase().indexOf("component") > -1) ||
                  (IsUpdated != undefined &&
                    IsUpdated.toLowerCase().indexOf("event") > -1)) && (
                    <span>
                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        onClick={() =>
                          setIsSmartfilter(IsSmartfilter === true ? false : true)
                        }
                        src={
                          IsSmartfilter === true
                            ? "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/newsub_icon.png"
                            : "https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Add-New.png"
                        }
                      />
                      <img
                        className="icon-sites-img  wid22 ml5"
                        title="Share SmartFilters selection"
                        ng-click="GenerateUrl()"
                        src="https://hhhhteams.sharepoint.com/sites/HHHH/SP/SiteCollectionImages/ICONS/Shareweb/Icon_Share_Blue.png"
                      />
                    </span>
                  )}
              </span>
            </label>
            {IsSmartfilter ? (
              <div className="togglecontent mt-1">
                <table width="100%" className="indicator_search">
                  <tr>
                    {filterGroups?.map(function (item) {
                      return (
                        <>
                          <td valign="top">
                            <fieldset>
                              {item != "teamSites" && (
                                <legend>
                                  <span className="mparent">{item}</span>
                                </legend>
                              )}
                              {item == "teamSites" && (
                                <legend>
                                  <span className="mparent">Sites</span>
                                </legend>
                              )}
                            </fieldset>
                            {filterItems?.map(function (ItemType, index) {
                              return (
                                <>
                                  {ItemType.Group == item && (
                                    <div style={{ display: "block" }}>
                                      <>
                                        {ItemType.TaxType != "Status" && (
                                          <div className="align-items-center d-flex">
                                            <span
                                              className="hreflink me-1 GByicon"
                                              onClick={() =>
                                                handleOpen2(ItemType)
                                              }
                                            >
                                              {ItemType.childs.length > 0 && (
                                                <a title="Tap to expand the childs">
                                                  {ItemType.showItem ? (
                                                    <img
                                                      src={
                                                        ItemType.downArrowIcon
                                                      }
                                                    />
                                                  ) : (
                                                    <img
                                                      src={
                                                        ItemType.RightArrowIcon
                                                      }
                                                    />
                                                  )}
                                                </a>
                                              )}
                                            </span>
                                            <input
                                              className="form-check-input me-1"
                                              defaultChecked={
                                                ItemType.Selected == true
                                              }
                                              type="checkbox"
                                              value={ItemType.Title}
                                              onChange={(e) =>
                                                SingleLookDatatest(
                                                  e,
                                                  ItemType,
                                                  index
                                                )
                                              }
                                            />
                                            <label className="form-check-label">
                                              {ItemType.Title}
                                            </label>
                                          </div>
                                        )}
                                        {ItemType.TaxType == "Status" && (
                                          <div className="align-items-center d-flex">
                                            <input
                                              className="form-check-input me-1"
                                              defaultChecked={
                                                ItemType.Selected == true
                                              }
                                              type="checkbox"
                                              value={ItemType.Title}
                                              onChange={(e) =>
                                                SingleLookDatatest(
                                                  e,
                                                  ItemType,
                                                  index
                                                )
                                              }
                                            />
                                            <label className="form-check-label">
                                              {ItemType.Title}
                                            </label>
                                          </div>
                                        )}
                                        <ul
                                          id="id_{ItemType.Id}"
                                          className="m-0 ps-3 pe-2"
                                        >
                                          <span>
                                            {ItemType.show && (
                                              <>
                                                {ItemType?.childs?.map(function (
                                                  child1: any,
                                                  index: any
                                                ) {
                                                  return (
                                                    <>
                                                      <div className="align-items-center d-flex">
                                                        {child1.childs.length >
                                                          0 &&
                                                          !child1.expanded && (
                                                            <span className="hreflink me-1 GByicon">
                                                              <span className="svg__iconbox svg__icon--GroupDown"></span>
                                                            </span>
                                                          )}
                                                        {child1.childs.length >
                                                          0 &&
                                                          child1.expanded && (
                                                            <span className="hreflink me-1 GByicon">
                                                              <span className="svg__iconbox svg__icon--GroupRight "></span>
                                                            </span>
                                                          )}
                                                        <input
                                                          type="checkbox"
                                                          defaultChecked={
                                                            child1.Selected ==
                                                            true
                                                          }
                                                          className="form-check-input me-1"
                                                          onChange={(e) =>
                                                            SingleLookDatatest(
                                                              e,
                                                              child1,
                                                              index
                                                            )
                                                          }
                                                        />
                                                        <label className="form-check-label">
                                                          {child1.Title}
                                                        </label>
                                                        <ul
                                                          id="id_{{child1.Id}}"
                                                          style={{
                                                            display: "none",
                                                          }}
                                                          className="m-0 ps-3 pe-2"
                                                        >
                                                          {child1?.childs?.map(
                                                            function (
                                                              child2: any
                                                            ) {
                                                              <li>
                                                                <div className="align-items-center d-flex">
                                                                  <input
                                                                    className="form-check-input me-1"
                                                                    type="checkbox"
                                                                    defaultChecked={
                                                                      child1.Selected ==
                                                                      true
                                                                    }
                                                                    ng-model="child2.Selected"
                                                                    onChange={(
                                                                      e
                                                                    ) =>
                                                                      SingleLookDatatest(
                                                                        e,
                                                                        child1,
                                                                        index
                                                                      )
                                                                    }
                                                                  />
                                                                  <label className="form-check-label">
                                                                    {
                                                                      child2.Title
                                                                    }
                                                                  </label>
                                                                </div>
                                                              </li>;
                                                            }
                                                          )}
                                                        </ul>
                                                      </div>
                                                    </>
                                                  );
                                                })}
                                              </>
                                            )}
                                          </span>
                                        </ul>
                                      </>
                                    </div>
                                  )}
                                </>
                              );
                            })}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                </table>
                <div className="text-end mt-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    title="Smart Filter"
                    onClick={() => Updateitem()}
                  >
                    Update Filters
                  </button>
                  <button
                    type="button"
                    className="btn btn-grey ms-2"
                    title="Clear All"
                    onClick={() => Clearitem()}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </section>

      <section
        className="TableContentSection taskprofilepagegreen"
        id={tablecontiner}
      >
        <div className="container-fluid">
          <section className="TableSection">
            <div className="container p-0">
              <div className="Alltable mt-2">
                <div className="tbl-headings bg-white">
                  <span className="leftsec">
                    <label>
                      Showing {ComponentCopy} of{" "}
                      {AllCountItems?.AllComponentItems?.length > 1 ? AllCountItems?.AllComponentItems?.length - 1 : AllCountItems?.AllComponentItems?.length} Components
                    </label>
                    <label className="ms-1 me-1"> | </label>
                    {FilterShowhideShwingData === true ? (
                      <label>
                        {SubComponentCopy} of{" "}
                        {AllCountItems?.AllSubComponentItems?.length}{" "}
                        SubComponents
                      </label>
                    ) : (
                      <label>
                        {AllCountItems?.AllSubComponentItems?.length} of{" "}
                        {AllCountItems?.AllSubComponentItems?.length}{" "}
                        SubComponents
                      </label>
                    )}
                    <label className="ms-1 me-1"> | </label>
                    {FilterShowhideShwingData === true ? (
                      <label>
                        {FeatureCopy} of {AllCountItems?.AllFeaturesItems?.length}{" "}
                        Features
                      </label>
                    ) : (
                      <label>
                        {AllCountItems?.AllFeaturesItems?.length} of{" "}
                        {AllCountItems?.AllFeaturesItems?.length} Features
                      </label>
                    )}
                    <span
                      className="popover__wrapper ms-1"
                      style={{ position: "unset" }}
                      data-bs-toggle="tooltip"
                      data-bs-placement="auto"
                    >
                      <FaInfoCircle />

                      <span
                        className="popover__content mt-3 m-3 mx-3"
                        style={{ zIndex: 100 }}
                      >
                        <label>
                          Showing {ComponentCopy} of{" "}
                          {AllCountItems?.AllComponentItems?.length > 1 ? AllCountItems?.AllComponentItems?.length - 1 : AllCountItems?.AllComponentItems?.length} Components
                        </label>
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label>
                            {SubComponentCopy} of{" "}
                            {AllCountItems?.AllSubComponentItems?.length}{" "}
                            SubComponents
                          </label>
                        ) : (
                          <label>
                            {AllCountItems?.AllSubComponentItems?.length} of{" "}
                            {AllCountItems?.AllSubComponentItems?.length}{" "}
                            SubComponents
                          </label>
                        )}
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label>
                            {FeatureCopy} of{" "}
                            {AllCountItems?.AllFeaturesItems?.length} Features
                          </label>
                        ) : (
                          <label>
                            {AllCountItems?.AllFeaturesItems?.length} of{" "}
                            {AllCountItems?.AllFeaturesItems?.length} Features
                          </label>
                        )}

                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label>
                            {activityCopy} of {activity} Activities
                          </label>
                        ) : (
                          <label>
                            {activity} of {activity} Activities
                          </label>
                        )}
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label>
                            {workstrimCopy} of {workstrim} Workstreams
                          </label>
                        ) : (
                          <label>
                            {workstrim} of {workstrim} Workstreams
                          </label>
                        )}
                        <label className="ms-1 me-1"> | </label>
                        {FilterShowhideShwingData === true ? (
                          <label>
                            {taskCopy} of {task} Tasks
                          </label>
                        ) : (
                          <label>
                            {task} of {task} Tasks
                          </label>
                        )}
                      </span>
                    </span>

                    <span>
                      <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        placeholder="Search All..." />
                    </span>
                    <span>
                      <span>
                        <select className="" style={{ height: '30px' }} aria-label="Default select example" value={selectedSearchDuration} onChange={(e) => setSelectedSearchDuration((e.target.value))}>
                          <option selected>All Words</option>
                          <option value="1">Any Words</option>
                          <option value="2">Exact Phrase</option>
                        </select>
                      </span>
                    </span>

                  </span>
                  <span className="toolbox mx-auto">
                    {table?.getSelectedRowModel()?.flatRows?.length === 1 &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Feature" &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.SharewebTaskType?.Title != "Activities" &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.SharewebTaskType?.Title != "Workstream" &&
                      table?.getSelectedRowModel()?.flatRows[0]?.original?.SharewebTaskType?.Title != "Task" ||
                      table?.getSelectedRowModel()?.flatRows?.length === 0 ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addModal}
                        title=" Add Structure"
                      >
                        Add Structure
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={true}
                        className="btn btn-primary"
                        onClick={addModal}
                        title=" Add Structure"
                      >
                        Add Structure
                      </button>
                    )}

                    {table?.getSelectedRowModel()?.flatRows.length === 1 ? <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => openActivity()}
                      disabled={ActivityDisable}
                    >
                      Add Activity-Task
                    </button> : <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => openActivity()}
                      disabled={true}
                    >
                      Add Activity-Task
                    </button>}
                    {table?.getSelectedRowModel()?.flatRows?.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.Item_x0020_Type != "Component" ||
                      table?.getSelectedRowModel()?.flatRows?.length === 1 && table?.getSelectedRowModel()?.flatRows[0]?.original?.subRows?.length === 0 ? <button
                        type="button"
                        className="btn btn-primary"
                        onClick={buttonRestructuring}
                      >
                      Restructure
                    </button> : <button
                      type="button"
                      disabled={true}
                      className="btn btn-primary"
                      onClick={buttonRestructuring}
                    >
                      Restructure
                    </button>}

                    {table?.getSelectedRowModel()?.flatRows?.length > 0 && <span>
                      <a onClick={() => openTaskAndPortfolioMulti()} className="openWebIcon"><span className="svg__iconbox svg__icon--openWeb"></span></a>
                    </span>}
                    {showTeamMemberOnCheck === true ? <span><a className="teamIcon" onClick={() => ShowTeamFunc()}><span title="Create Teams Group" className="svg__iconbox svg__icon--team teamIcon"></span></a></span> : ''}

                    <a className="brush" onClick={clearSearch}>
                      <FaPaintBrush />
                    </a>

                    <a onClick={Prints} className="Prints">
                      <FaPrint />
                    </a>

                    <CSVLink className="excal" data={getCsvData()}>
                      <FaFileExcel />
                    </CSVLink>
                    <a className="expand">
                      <ExpndTable prop={expndpopup} prop1={tablecontiner} />
                    </a>
                  </span>
                </div>

                <div className="col-sm-12 p-0 smart">
                  <div className="">
                    <div className="wrapper">
                      <table
                        className="SortingTable searchCrossIcon groupTable  table table-hover"
                        style={{ width: "100%" }}
                      >
                        <thead className="fixed-Header top-0">
                          {table?.getHeaderGroups()?.map((headerGroup) => (
                            <tr key={headerGroup?.id}>
                              {headerGroup?.headers?.map((header) => {
                                return (
                                  <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={header.id != 'Title' ? {
                                      width: header.column.columnDef.size + "px",
                                    } : {}}
                                  >
                                    {header.isPlaceholder ? null : (
                                      <div
                                        className="position-relative"
                                        style={{ display: "flex" }}
                                      >
                                        {flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                        {header.column.getCanFilter() ? (
                                          // <span>
                                          <Filter
                                            column={header.column}
                                            table={table}
                                            placeholder={
                                              header.column.columnDef
                                            }
                                          />
                                        ) : // </span>
                                          null}
                                        {header.column.getCanSort() ? (
                                          <div
                                            {...{
                                              className:
                                                header.column.getCanSort()
                                                  ? "cursor-pointer select-none shorticon"
                                                  : "",
                                              onClick:
                                                header.column.getToggleSortingHandler(),
                                            }}
                                          >
                                            {header.column.getIsSorted() ? (
                                              {
                                                asc: <FaSortDown />,
                                                desc: <FaSortUp />,
                                              }[
                                              header.column.getIsSorted() as string
                                              ] ?? null
                                            ) : (
                                              <FaSort />
                                            )}
                                          </div>
                                        ) : (
                                          ""
                                        )}
                                      </div>
                                    )}
                                  </th>
                                );
                              })}
                            </tr>
                          ))}
                        </thead>
                        <tbody>
                          <Loader loaded={loaded} lines={13} length={20} width={10} radius={30} corners={1} rotate={0} direction={1}
                            color={
                              IsUpdated == "Events Portfolio"
                                ? "#f98b36"
                                : IsUpdated == "Service Portfolio"
                                  ? "#228b22"
                                  : "#000069"
                            }
                            speed={2}
                            trail={60}
                            shadow={false}
                            hwaccel={false}
                            className="spinner"
                            zIndex={2e9}
                            top="28%"
                            left="50%"
                            scale={1.0}
                            loadedClassName="loadedContent"
                          />

                          {table?.getRowModel()?.rows?.map((row: any) => {
                            return (
                              <tr className={row?.original?.lableColor} key={row.id} >
                                {row.getVisibleCells().map((cell: any) => {
                                  return (
                                    <td className={row?.original?.boldRow} key={cell.id}>
                                      {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* {ShowTeamPopup === true ? <ShowTeamMembers props={checkData} callBack={showTaskTeamCAllBack} TaskUsers={AllUsers} /> : ''} */}

      {IsTask && (
        <EditTaskPopup
          Items={SharewebTask}
          Call={Call}
          AllListId={SelectedProp?.SelectedProp}
          context={SelectedProp?.SelectedProp.Context}
        ></EditTaskPopup>
      )}
      {IsComponent && (
        <EditInstituton
          item={SharewebComponent}
          Calls={Call}
          showProgressBar={showProgressBar}
          SelectD={SelectedProp}
        >
          {" "}
        </EditInstituton>
      )}
      {IsTimeEntry && (
        <TimeEntryPopup
          props={SharewebTimeComponent}
          CallBackTimeEntry={TimeEntryCallBack}
          Context={SelectedProp?.SelectedProp.Context}
        ></TimeEntryPopup>
      )}
      {MeetingPopup && (
        <CreateActivity
          props={checkedList[0]}
          Call={Call}
          TaskUsers={AllUsers}
          AllClientCategory={AllClientCategory}
          LoadAllSiteTasks={LoadAllSiteTasks}
          SelectedProp={SelectedProp}
        ></CreateActivity>
      )}
      {WSPopup && (
        <CreateWS
          props={checkedList[0]}
          Call={Call}
          TaskUsers={AllUsers}
          AllClientCategory={AllClientCategory}
          data={data}
          SelectedProp={SelectedProp}
        ></CreateWS>
      )}
      <Panel
        onRenderHeader={onRenderCustomHeaderMain1}
        type={PanelType.large}
        isOpen={addModalOpen}
        isBlocking={false}
        onDismiss={CloseCall}
      >
        <PortfolioStructureCreationCard
          CreatOpen={CreateOpenCall}
          Close={CloseCall}
          PortfolioType={IsUpdated}
          PropsValue={ContextValue}
          SelectedItem={
            checkedList != null && checkedList.length > 0
              ? checkedList[0]
              : props
          }
        />
      </Panel>

      <Panel
        onRenderHeader={onRenderCustomHeaderMain}
        type={PanelType.custom}
        customWidth="600px"
        isOpen={ActivityPopup}
        onDismiss={closeTaskStatusUpdatePoup2}
        isBlocking={false}
      >
        <div className="modal-body bg-f5f5 clearfix">
          <div
            className={
              IsUpdated == "Events Portfolio"
                ? "app component clearfix eventpannelorange"
                : IsUpdated == "Service Portfolio"
                  ? "app component clearfix serviepannelgreena"
                  : "app component clearfix"
            }
          >
            <div id="portfolio" className="section-event pt-0">
              {childsData != undefined &&
                checkedList[0]?.SharewebTaskType?.Title == "Workstream" ? (
                <ul className="quick-actions">
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={(e) => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/bug.png"
                        />
                      </span>
                      Bug
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/feedbck.png"
                        />
                      </span>
                      Feedback
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Impovement.png" />
                      </span>
                      Improvement
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites">
                        <img src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/design.png" />
                      </span>
                      Design
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Task")}>
                      <span className="icon-sites"></span>
                      Task
                    </div>
                  </li>
                </ul>
              ) : (
                <ul className="quick-actions">
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={(e) => CreateMeetingPopups("Implementation")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/Implementation.png"
                        />
                      </span>
                      Implmentation
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Development")}>
                      <span className="icon-sites">
                        <img
                          className="icon-sites"
                          src="	https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/Shareweb/development.png"
                        />
                      </span>
                      Development
                    </div>
                  </li>
                  <li className="mx-1 p-2 position-relative bg-siteColor text-center mb-2">
                    <div onClick={() => CreateMeetingPopups("Activities")}>
                      <span className="icon-sites"></span>
                      Activity
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-default btn-default ms-1 pull-right"
            onClick={closeTaskStatusUpdatePoup2}
          >
            Cancel
          </button>
        </div>
      </Panel>
      <Panel
        headerText={` Restructuring Tool `}
        type={PanelType.medium}
        isOpen={ResturuningOpen}
        isBlocking={false}
        onDismiss={RestruringCloseCall}
      >
        <div>
          {ResturuningOpen ? (
            <div className="bg-ee p-2 restructurebox">
              <div>
                {NewArrayBackup != undefined && NewArrayBackup.length > 0 ? (
                  <span>
                    All below selected items will become child of{" "}
                    <div className="Dyicons ">
                      {NewArrayBackup[0].SiteIconTitle}
                    </div>{" "}
                    <a
                      data-interception="off"
                      target="_blank"
                      className="hreflink serviceColor_Active"
                      href={
                        ContextValue.siteUrl +
                        "/SitePages/Portfolio-Profile.aspx?taskId=" +
                        NewArrayBackup[0].Id
                      }
                    >
                      <span>{NewArrayBackup[0].Title}</span>
                    </a>{" "}
                    please click Submit to continue.
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div>
                <span> Old: </span>
                {OldArrayBackup?.map(function (obj: any, index) {
                  return (
                    <span>
                      <span className="Dyicons ">{obj.SiteIconTitle}</span>
                      <a
                        data-interception="off"
                        target="_blank"
                        className="hreflink serviceColor_Active"
                        href={
                          ContextValue.siteUrl +
                          "/SitePages/Portfolio-Profile.aspx?taskId=" +
                          obj.Id
                        }
                      >
                        <span>{obj.Title} </span>
                      </a>
                      {OldArrayBackup.length - 1 < index ? ">" : ""}{" "}
                    </span>
                  );
                })}
              </div>
              <div>
                <span> New: </span>{" "}
                {NewArrayBackup?.map(function (newobj: any, indexnew) {
                  return (
                    <>
                      <span>
                        <div className="Dyicons ">{newobj.SiteIconTitle}</div>
                        <a
                          data-interception="off"
                          target="_blank"
                          className="hreflink serviceColor_Active"
                          href={
                            ContextValue.siteUrl +
                            "/SitePages/Portfolio-Profile.aspx?taskId=" +
                            newobj.Id
                          }
                        >
                          <span>{newobj.Title} </span>
                        </a>
                        {NewArrayBackup.length - 1 < indexnew ? ">" : ""}
                      </span>
                    </>
                  );
                })}
                <span>
                  <div className="Dyicons ">
                    {RestructureChecked[0].SiteIconTitle}
                  </div>
                  <a
                    data-interception="off"
                    target="_blank"
                    className="hreflink serviceColor_Active"
                    href={
                      ContextValue.siteUrl +
                      "/SitePages/Portfolio-Profile.aspx?taskId=" +
                      RestructureChecked[0].Id
                    }
                  >
                    <span>{RestructureChecked[0].Title} </span>
                  </a>
                </span>
              </div>
              {console.log(
                "restructure functio test in div==================================="
              )}
              {checkedList != undefined &&
                checkedList.length > 0 &&
                checkedList[0].Item_x0020_Type != "Task" ? (
                <div>
                  <span>
                    {" "}
                    {"Select Component Type :"}
                    <input
                      type="radio"
                      name="fav_language"
                      value="SubComponent"
                      checked={
                        RestructureChecked[0].Item_x0020_Type == "SubComponent"
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setRestructure(RestructureChecked[0], "SubComponent")
                      }
                    />
                    <label className="ms-1"> {"SubComponent"} </label>
                  </span>
                  <span>
                    {" "}
                    <input
                      type="radio"
                      name="fav_language"
                      value="SubComponent"
                      checked={
                        RestructureChecked[0].Item_x0020_Type === "Feature"
                          ? true
                          : false
                      }
                      onChange={(e) =>
                        setRestructure(RestructureChecked[0], "Feature")
                      }
                    />{" "}
                    <label className="ms-1"> {"Feature"} </label>{" "}
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <footer className="mt-2 text-end">
          {checkedList != undefined &&
            checkedList.length > 0 &&
            checkedList[0]?.Item_x0020_Type === "Task" ? (
            <button
              type="button"
              className="btn btn-primary "
              onClick={(e) => UpdateTaskRestructure()}
            >
              Save
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary "
              onClick={(e) => UpdateRestructure()}
            >
              Save
            </button>
          )}
          <button
            type="button"
            className="btn btn-default btn-default ms-1"
            onClick={RestruringCloseCall}
          >
            Cancel
          </button>
        </footer>
      </Panel>
    </div>
  );
}
export default ComponentTable;
