import * as React from 'react'
import { Web } from 'sp-pnp-js'
import { Panel, PanelType } from '@fluentui/react'
import * as globalcommon from './globalCommon'

var isCompleted = false
var AllListId: any = {}
let groupedComponentData: any = [];
export default function CallNotes({callBack}: any) {
  const [IsOpenPortfolio, setIsOpenPortfolio] = React.useState(false);
  const [ShareWebComponent, setShareWebComponent] = React.useState('');
  const [masterTasks, setMasterTasks] = React.useState<any>([])
  const [smartComponentData, setSmartComponentData] = React.useState([]);
  const [panel, setPanel] = React.useState<any>(false)
  const [SearchedServiceCompnentKey, setSearchedServiceCompnentKey] = React.useState<any>('');
  const [SearchedServiceCompnentData, setSearchedServiceCompnentData] = React.useState<any>([]);
  const [inputData, setInputData] = React.useState<any>([{ Title: '', PortfolioId: null, URL: '', ShortDescriptionOn: '', Site: '', saveItem: false, IsUpdateItemId: undefined, IsUpdatelistId: undefined, IsUpdatesiteUrl: undefined, IsUpdatemetadatainfo: undefined }])
  const [siteData, setSiteData] = React.useState([])
  const openPanel = () => {
    setPanel(true)
  }
  const closePanel = () => {
    callBack()
  }

  const autoSuggestionsForServiceAndComponent = (e: any) => {
    let SearchedKeyWord: any = e.target.value;
    let TempArray: any = [];
    if (SearchedKeyWord.length > 0) {
      if (masterTasks != undefined && masterTasks?.length > 0) {
        masterTasks.map((AllDataItem: any) => {
          if ((AllDataItem.Path?.toLowerCase())?.includes(SearchedKeyWord.toLowerCase())) {
            TempArray.push(AllDataItem);
          }
        })
      }
      if (TempArray != undefined && TempArray.length > 0) {
        setSearchedServiceCompnentData(TempArray);
        setSearchedServiceCompnentKey(SearchedKeyWord);
      }
    } else {
      setSearchedServiceCompnentData([]);
      setSearchedServiceCompnentKey("");
    }
  }

  const web = new Web('https://hhhhteams.sharepoint.com/sites/HHHH/SP')

  React.useEffect(() => {
    AllListId = {
      siteUrl: 'https://hhhhteams.sharepoint.com/sites/HHHH/SP',
      MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf',
      TaskUsertListID: 'b318ba84-e21d-4876-8851-88b94b9dc300',
      SmartMetadataListID: '01a34938-8c7e-4ea6-a003-cee649e8c67a',
      SmartInformationListID: 'edf0a6fb-f80e-4772-ab1e-666af03f7ccd',
      DocumentsListID: 'd0f88b8f-d96d-4e12-b612-2706ba40fb08',
      TaskTimeSheetListID: '464fb776-e4b3-404c-8261-7d3c50ff343f',
      AdminConfigrationListID: 'e968902a-3021-4af2-a30a-174ea95cf8fa',
      TimeEntry: false,
      SiteCompostion: false,
    }
  }, [])

  const loadComponents = async () => {
    let PropsObject: any = {
      MasterTaskListID: 'ec34b38f-0669-480a-910c-f84e92e58adf',
      siteUrl: 'https://hhhhteams.sharepoint.com/sites/HHHH/SP',
      TaskUserListId: 'b318ba84-e21d-4876-8851-88b94b9dc300',
    }
    let componentDetails: any = [];
    let results = await globalcommon.GetServiceAndComponentAllData(PropsObject)
    if (results?.AllData?.length > 0) {
      componentDetails = results?.AllData;
      groupedComponentData = results?.GroupByData;
    }
    setMasterTasks(componentDetails);
  }

  loadComponents();

  const loadSmartMetaData = () => {
    web.lists.getById("01a34938-8c7e-4ea6-a003-cee649e8c67a").items.select('Id,Title,Configurations,listId,TaxType,siteName,siteUrl,Parent/Id,Parent/Title').expand('Parent').top(4999).get().then((item: any) => {
      let allSites: any = item.filter((smartdata: any) => {
        return smartdata.TaxType == 'Sites'
      })
      allSites.map((site: any) => {
        site.ConfigurationDetails = JSON.parse(site.Configurations)
      })
      setSiteData(allSites)
    }).catch((error: any) => {
      console.log(error)
    })
  }

  React.useEffect(() => {
    loadSmartMetaData();
  }, [])

  const ComponentServicePopupCallBack = React.useCallback((DataItem: any, Type: any, functionType: any) => {
    // let saveItem = save;
    if (functionType == "Close") {
      setIsOpenPortfolio(false)
    } else {
      if (DataItem != undefined && DataItem.length > 0) {
        setInputData({ ...inputData, PortfolioId: DataItem[0]?.Id })
        setSmartComponentData(DataItem);
        setSearchedServiceCompnentData([]);
        setSearchedServiceCompnentKey('');
        // selectPortfolioType('Component');
        console.log("Popup component component ", DataItem)
      }
      setIsOpenPortfolio(false)
    }
    // setSave(saveItem);
  }, [])

  const addNewTextField = () => {
    inputData.map((i: any, index: any) => {
      if (i.saveItem == false) {
        if (!inputData[index].Title || !inputData[index].Site) {
          alert("Enter Task Name and Select Site");
        }
        else {
          if (i.saveItem == false) {
            addOrUpdateMultipleTasks();
          }
        }
      }
    }
    )
  }

  const addOrUpdateMultipleTasks = () => {
    let feedbackDetails: any = [];
    let selectedSite: any = siteData.filter((sites: any) => sites.Id == inputData[inputData.length - 1].Site)
    const Obj :any= { Title: '', PortfolioId: null, URL: '', ShortDescriptionOn: '', Site: '', saveItem: false, IsUpdateItemId: undefined, IsUpdatelistId: undefined, IsUpdatesiteUrl: undefined, IsUpdatemetadatainfo: undefined }
    inputData.map((task: any) => {
      if (task.Title == '' || task.Site == '') {
        alert('Task is missing Title or Site.');
      } else {
        var date = new Date();
        let addDescription: any = [];
        var obj = { Title: '' };
        var param = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
        task.ShortDescription = task.ShortDescriptionOn.replace(/\n/gi, "<br/>");
        obj.Title = task.ShortDescriptionOn
        var FeedBackItem: any = {};
        FeedBackItem['Title'] = obj.Title
        FeedBackItem['FeedBackDescriptions'] = addDescription;
        FeedBackItem['ImageDate'] = param;
        FeedBackItem['Completed'] = isCompleted;
        feedbackDetails.push(FeedBackItem);
        let portfolioID = task.PortfolioId;

        if (task.saveItem == true) {
          const updateValue = {
            Body: '<div><p>' + task.ShortDescriptionOn + '</p></div>',
            Title: task.Title,
            Categories: 'Draft',
            ComponentLink: {
              'Description': task.URL != undefined ? task.URL : null,
              'Url': task.URL != undefined ? task.URL : null,
            },
            component_x0020_link: {
              'Description': task.URL != undefined ? task.URL : null,
              'Url': task.URL != undefined ? task.URL : null,
            },
            FeedBack: JSON.stringify(feedbackDetails),
            PortfolioId: portfolioID,
            SharewebCategoriesId: { results: [286] },
            TaskCategoriesId: { results: [286] },
            TaskTypeId: 2,
          };
          web.lists.getById(selectedSite[0].ConfigurationDetails[0].listId)
            .items.getById(task.IsUpdateItemId)
            .update(updateValue)
            .then((response: any) => {
              alert('Task Updated Successfully');
            })
            .catch((error: any) => {
              console.log('Error Updating task:', error);
            });

        } else {
          const addValue = {
            Body: '<div><p>' + task.ShortDescriptionOn + '</p></div>',
            Title: task.Title,
            Categories: 'Draft',
            ComponentLink: {
              'Description': task.URL != undefined ? task.URL : null,
              'Url': task.URL != undefined ? task.URL : null,
            },
            component_x0020_link: {
              'Description': task.URL != undefined ? task.URL : null,
              'Url': task.URL != undefined ? task.URL : null,
            },
            FeedBack: JSON.stringify(feedbackDetails),
            PortfolioId: portfolioID,
            SharewebCategoriesId: { results: [286] },
            TaskCategoriesId: { results: [286] },
            TaskTypeId: 2,
          };
          web.lists.getById(selectedSite[0].ConfigurationDetails[0].listId)
            .items.add(addValue)
            .then((response: any) => {
              alert('Task Added Successfully');
              inputData.push(Obj)
              task.saveItem = true;
              task.IsUpdateItemId = response.data.Id;
              task.IsUpdatelistId = selectedSite[0].ConfigurationDetails[0].listId
              task.IsUpdatesiteUrl = AllListId?.siteUrl;
              isCompleted = true
            })
            .catch((error: any) => {
              console.log('Error adding task:', error);
            });
        }
      }
    });
  };

  const resetForm = () => {
    setInputData([{ Title: '', Portfolio: '', URL: '', ShortDescriptionOn: '', Site: '', saveItem: false }]);
    closePanel();
  };

  const setInputFieldData = (value: any, Title: keyof typeof inputData[0], index: any) => {
    let input: any = [...inputData]
    input[index][Title] = value
    setInputData(input)
  }

  const EditPortfolio = (item: any, Type: any) => {
    setIsOpenPortfolio(true);
    setShareWebComponent(item);
  }

  const onRenderCustomHeader = (
  ) => {
    return (
      <div className="d-flex full-width pb-1" >
        <div style={{ marginRight: "auto", fontSize: "20px", fontWeight: "600", marginLeft: '20px' }}>
          <span className="siteColor">
            {`Create Call Notes`}
          </span>
        </div>
        {/* <Tooltip ComponentId="1138" /> */}
      </div>
    );
  };

  return (
    <>
      <button onClick={openPanel}>Open Panel</button>
      <Panel type={PanelType.medium}
        isOpen={panel}
        onDismiss={() => { resetForm() }}
        onRenderHeader={onRenderCustomHeader}
        closeButtonAriaLabel='Close'
      >
        {inputData.map((items: any, index: any) => {
          return (
            <form action=''>
              <div className='row'>
                <div className='col'>
                  <div className='input-group mb-1'>
                    <label className='full-width'>Task Name </label>
                    <input className='form-control' type='text' placeholder='Enter Task Name' onChange={e => setInputFieldData(e.target.value, 'Title', index)} />
                  </div>
                </div>
                <div className='col'>
                  <div className="input-group autosuggest-container">
                    <label className="full-width">Portfolio Item</label>
                    {smartComponentData?.length > 0 ? null :
                      <><div className='input-group'>
                        <input type="text" onChange={(e) => autoSuggestionsForServiceAndComponent(e)}
                          className="form-control"
                          id="{{PortfoliosID}}" autoComplete="off"
                        /></div>
                      </>
                    }{SearchedServiceCompnentData?.length > 0 ? (
                      <ul className="autosuggest-list maXh-200 scrollbar">
                        {SearchedServiceCompnentData.map((Item: any) => {
                          return (
                            <li key={Item.id} onClick={() => ComponentServicePopupCallBack([Item], undefined, undefined)} >
                              <a>{Item.Path}</a>
                            </li>
                          )
                        }
                        )}
                      </ul>) : null}
                    {smartComponentData?.length > 0 ? smartComponentData?.map((com: any) => {
                      return (
                        <>
                          <div className="block d-flex justify-content-between pt-1 px-2" style={{ width: "95%" }}>
                            <a style={{ color: "#fff !important" }} data-interception="off" target="_blank" href={`https://hhhhteams.sharepoint.com/sites/HHHH/SP/SitePages/Portfolio-Profile.aspx?taskId=${com.ID}`}>{com.Title}</a>
                            <a>
                              <span title="Remove Component" onClick={() => { setSmartComponentData([]), setInputData({ ...inputData, PortfolioId: null }); }}
                                style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--cross hreflink mx-2"></span>
                            </a>
                          </div>
                        </>
                      )
                    }) : null}
                    <span className="input-group-text">
                      <span onClick={(e) => EditPortfolio(inputData, 'Component')} style={{ backgroundColor: 'white' }} className="svg__iconbox svg__icon--edit"></span>
                      {/* <img src="https://hhhhteams.sharepoint.com/_layouts/images/edititem.gif"
                                        onClick={(e) => EditComponent(save, 'Component')} /> */}
                    </span>
                  </div>
                </div>
                <div className='col'>
                  <div className='input-group mb-1'>
                    <label className='full-width'>Site</label>
                    <select className='form-control' placeholder='Select Site' onChange={e => setInputFieldData(e.target.value, 'Site', index)}>
                      <option value=''>Select Site</option>
                      {siteData.length > 0 && siteData?.map((site: any, index: any) => (
                        <option key={index} value={site.Id}>
                          {site.Title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className='row'>
                <div>
                  <div className='input-group mb-1'>
                    <label className='full-width'>Url </label>
                    <input className='form-control' type='text' placeholder='Enter Url' onChange={e => setInputFieldData(e.target.value, 'URL', index)} />
                  </div>
                  <div className='input-group mb-1'>
                    <label className='full-width'>Description </label>
                    <textarea className='form-control' onChange={e => setInputFieldData(e.target.value, 'ShortDescriptionOn', index)} />
                  </div>
                </div>
                <div>
                </div>
              </div>
            </form>
          )
        })}
        <div className='text-end mt-2'>
          <button className='btn btnCol btn-primary pull-left' onClick={() => { addNewTextField() }}>
            Add More Items
          </button>
          <button className='me-2 btn btnCol btn-primary' onClick={() => { addOrUpdateMultipleTasks(); resetForm(); }}>
            Save
          </button>
          <button className='btn btn-default' onClick={() => { resetForm() }}>
            Cancel
          </button>
        </div>
      </Panel>
      {/* {IsOpenPortfolio &&
        <ServiceComponentPortfolioPopup
          props={ShareWebComponent}
          Dynamic={AllListId}
          Call={ComponentServicePopupCallBack}
          groupedData={groupedComponentData}
        />
      } */}
    </>
  )
}