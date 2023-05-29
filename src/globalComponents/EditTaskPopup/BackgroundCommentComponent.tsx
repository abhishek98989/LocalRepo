import * as React from "react";
import FlorarImageUploadComponent from '../FlorarComponents/FlorarImageUploadComponent';
import { useState, useCallback } from 'react';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';
import { FaExpandAlt } from 'react-icons/fa';
import { RiDeleteBin6Line, RiH6 } from 'react-icons/ri';
import { TbReplace } from 'react-icons/tb';
import { Web } from "sp-pnp-js";
import { HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2';

const BackgroundCommentComponent = (Props: any) => {
    const [BackgroundComment, setBackgroundComment] = useState('');
    const [EditCommentPanel, setEditCommentPanel] = useState(false);
    const [BackgroundComments, setBackgroundComments] = useState(Props.TaskData?.BackgroundComments != undefined ? Props.TaskData?.BackgroundComments : []);
    const [uploadImageContainer, setuploadImageContainer] = useState(false);
    const [UpdateCommentData, setUpdateCommentData] = useState('');
    const [CurrentIndex, setCurrentIndex] = useState<any>();

    const currentUserData: any = Props.CurrentUser;
    var BackgroundImageData: any = Props.TaskData?.BackgroundImages != undefined ? Props.TaskData?.BackgroundImages : [];
    const Context = Props.Context;
    const siteUrls = Props.siteUrls;
    // This is used for Upload Background Images section and callback functions
    const FlorarImageReplaceComponentCallBack = (dt: any) => {
        let DataObject: any = {
            data_url: dt,
            file: "Image/jpg",
            fileName:`Cover_Imgage_${BackgroundImageData?.length+1}_${Props.TaskData.Id}_${Props.TaskData.siteType}.jpg`
        }
        let ReplaceImageData = DataObject;
        uploadImageFolder(ReplaceImageData)
    }
   const uploadImageFolder=(Data:any)=>{
    var src = Data.data_url?.split(",")[1];
    var byteArray = new Uint8Array(atob(src)?.split("")?.map(function (c) {
        return c.charCodeAt(0);
    }));
    const data: any = byteArray
    var fileData = '';
    for (var i = 0; i < byteArray.byteLength; i++) {
        fileData += String.fromCharCode(byteArray[i]);
    }
         
    const web=new Web(siteUrls);
    const folder = web.getFolderByServerRelativeUrl(`PublishingImages/Covers`);
    folder.files.add(Data.fileName, data).then(async(item: any) => {
        console.log(item)
        // let hostWebURL = Context.pageContext._site.absoluteUrl.replace(Context.pageContext._site.absoluteUrl,"");
        let imageURL: string = `${Context._pageContext._web.absoluteUrl.split(Context.pageContext._web.serverRelativeUrl)[0]}${item.data.ServerRelativeUrl}`;
        await web.getFileByServerRelativeUrl(`${Context?._pageContext?._web?.serverRelativeUrl}/PublishingImages/Covers/${Data.fileName}`).getItem()
     
        .then(async (res: any) => {
          console.log(res);
         
          let obj={
            "AdminTab": "Admin",
             "Id": res.Id,
             "Url": imageURL,
             "counter": BackgroundImageData?.length,
             "UploadeDate": Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY'),
             "UserName": Context._pageContext._user.displayName,
             "ImageName": Data.fileName,
             
          }
          console.log(obj)
         
        }).catch((error:any)=>{
            console.log(error)
        })
    })
    .catch((error:any)=>{
 console.log(error)
  })
   }
    // This is used for Adding Background Comments 
    const AddBackgroundCommentFunction = async () => {
        if (BackgroundComment.length > 0) {
            let CurrentUserData: any
            if (currentUserData?.length > 0) {
                CurrentUserData = currentUserData[0];
            }
            let CommentJSON = {
                AuthorId: CurrentUserData.AssingedToUserId,
                editable: false,
                Created: Moment(new Date()).tz("Europe/Berlin").format('DD MMM YYYY HH:mm'),
                Body: BackgroundComment,
                AuthorImage: CurrentUserData.Item_x0020_Cover != null ? CurrentUserData.Item_x0020_Cover.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                AuthorName: CurrentUserData.Title != undefined ? CurrentUserData.Title : Context.pageContext._user.displayName,
                ID: (BackgroundComments != undefined ? BackgroundComments?.length + 1 : 0)
            }
            BackgroundComments.push(CommentJSON);
            setBackgroundComments(BackgroundComments);
            setBackgroundComment("");
            updateCommentFunction(BackgroundComments);
        } else {
            alert("Please Enter Your Comment First!")
        }
    }
    // This is used for Deleteing Background Comments 
    const DeleteBackgroundCommentFunction = (ID: any, Body: any) => {
        let tempArray: any = [];
        if (BackgroundComments != undefined && BackgroundComments.length > 0) {
            BackgroundComments.map((CommentData: any) => {
                if (ID != undefined) {
                    if (CommentData.ID != ID) {
                        tempArray.push(CommentData)
                    }
                } else {
                    if (CommentData.Body != Body) {
                        tempArray.push(CommentData)
                    }
                }
            })
        }

        setBackgroundComments(tempArray);
        updateCommentFunction(tempArray);
        tempArray = [];
    }
    // This is common function for  Update Commnent on Backend Side 
    const updateCommentFunction = async (UpdateData: any) => {
        try {
            let web = new Web(siteUrls);
            await web.lists.getById(Props.TaskData.listId).items.getById(Props.TaskData.Id).update({
                OffshoreComments: UpdateData != undefined && UpdateData.length > 0 ? JSON.stringify(UpdateData) : null
            }).then(() => {
                console.log("Background Comment Updated !!!")
            })
        } catch (error) {
            console.log("Error : ", error.message)
        }
    }
    const editPostCloseFunction = () => {
        setEditCommentPanel(false);
    }
    const openEditModal = (Index: any, Body: any) => {
        setEditCommentPanel(true);
        setUpdateCommentData(Body);
        setCurrentIndex(Index);
    }
    const ChangeCommentFunction = () => {
        if (BackgroundComments != undefined && BackgroundComments.length > 0) {
            BackgroundComments[CurrentIndex].Body = UpdateCommentData;
            updateCommentFunction(BackgroundComments);
            setUpdateCommentData("");
        }
        setEditCommentPanel(false);
    }
    return (
        <div className="d-flex justify-content-between">
            <div className="Background_Image col-4">
                {BackgroundImageData != undefined && BackgroundImageData.length > 0 ?
                    <div> {BackgroundImageData.map((ImageDtl: any, index: number) => {
                        return (
                            <div key={index} className="image-item">
                                <div className="my-1">
                                    <div>
                                        <span className="mx-1">{ImageDtl.ImageName ? ImageDtl.ImageName.slice(0, 50) : ''}</span>
                                    </div>
                                    <a href={ImageDtl.Url} target="_blank" data-interception="off">
                                        <img src={ImageDtl.Url ? ImageDtl.Url : ''}
                                            // onMouseOver={(e) => MouseHoverImageFunction(e, ImageDtl)}
                                            // onMouseOut={(e) => MouseOutImageFunction(e)}
                                            className="border card-img-top my-1" />
                                    </a>

                                    <div className="card-footer d-flex justify-content-between">
                                        <div>
                                            <span className="fw-semibold">{ImageDtl.UploadeDate ? ImageDtl.UploadeDate : ''}</span>
                                        </div>
                                        <div>

                                            {/* <span
                                                // onClick={() => openReplaceImagePopup(index)}
                                                title="Replace image"
                                            >
                                                <TbReplace />
                                            </span> */}
                                            <span className="mx-1" title="Delete"
                                                onClick={() => alert("We are working on it. This feature will be live soon ....")}

                                            ><RiDeleteBin6Line /> | </span>

                                            <span title="Open Image In Another Tab">
                                                <a href={ImageDtl.Url} target="_blank" data-interception="off">
                                                    <HiOutlineArrowTopRightOnSquare />
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    </div>
                    :
                    <FlorarImageUploadComponent callBack={FlorarImageReplaceComponentCallBack} />
                }
                {uploadImageContainer ? <FlorarImageUploadComponent callBack={FlorarImageReplaceComponentCallBack} /> : null}
                <div className="Background_Image_footer d-flex justify-content-between my-1 ">
                    {BackgroundImageData != undefined && BackgroundImageData.length > 0 ?
                        <span className="hreflink ms-0 ps-0 siteColor" onClick={() => setuploadImageContainer(true)}>Add New Image</span> : null
                    }

                </div>
            </div>
            <div className="Background_Comment col-8 full-width ps-3">
                <p className="siteColor mb-0">Comments</p>
                {BackgroundComments != undefined && BackgroundComments.length > 0 ? BackgroundComments.map((dataItem: any, Index: any) => {
                    return (
                        <div className={`col-12 d-flex float-end add_cmnt my-1 `}>
                            <div className="">
                                <img style={{ width: "40px", borderRadius: "50%", height: "40px", margin: "5px" }} src={dataItem.AuthorImage != undefined && dataItem.AuthorImage != '' ?
                                    dataItem.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                            </div>
                            <div className="col-11 pe-0 mt-2 ms-1" >
                                <div className='d-flex justify-content-between align-items-center'>
                                    <span className="siteColor font-weight-normal">
                                        {dataItem.AuthorName} - {dataItem.Created}
                                    </span>
                                    <span>
                                        <a className="ps-1"
                                            onClick={() => openEditModal(Index, dataItem.Body)}
                                        // onClick={() => alert("We are working on it. This feature will be live soon ....")}
                                        >
                                            <img src={require('../../Assets/ICON/edit_page.svg')} width="25" />
                                        </a>
                                        <a className="ps-1"
                                            onClick={() => DeleteBackgroundCommentFunction(dataItem.ID, dataItem.Body)}
                                        // onClick={() => alert("We are working on it. This feature will be live soon ....")}
                                        >
                                            <img src={require('../../Assets/ICON/cross.svg')} width="25">
                                            </img>
                                        </a>
                                    </span>
                                </div>
                                <div>
                                    <span dangerouslySetInnerHTML={{ __html: dataItem.Body }}></span>
                                </div>
                            </div>
                        </div>
                    )
                }) :
                    <div className="commented-data-sections my-2 p-1" style={{ width: "100%", height: "150px", border: "2px dotted #ccc" }}>
                        There is no comments
                    </div>
                }
                <div className="enter-comment-data-section">
                    <textarea
                        style={{ width: "100%", height: "100px", border: "2px solid #ccc" }}
                        value={BackgroundComment}
                        onChange={(e) => setBackgroundComment(e.target.value)}
                        placeholder="Enter Your Comment Here"
                    >
                    </textarea>
                </div>
                <button className="btn btn-primary float-end" onClick={AddBackgroundCommentFunction}>
                    Post Comment
                </button>
            </div>
            <section className="Update-FeedBack-section">
                <Panel headerText={`Update Comment`}
                    isOpen={EditCommentPanel}
                    onDismiss={editPostCloseFunction}
                    isBlocking={EditCommentPanel}
                    type={PanelType.custom}
                    customWidth="500px"
                >
                    <div className="parentDiv">
                        <div style={{ width: '99%', marginTop: '2%', padding: '2%' }}>
                            <textarea
                                id="txtUpdateComment"
                                rows={6}
                                defaultValue={UpdateCommentData}
                                onChange={(e) => setUpdateCommentData(e.target.value)}
                                style={{ width: '100%', marginLeft: '3px' }}
                            >
                            </textarea>
                        </div>
                        <footer className="d-flex justify-content-between ms-3 mx-2 float-end">
                            <div>
                                <button className="btn btnPrimary" onClick={ChangeCommentFunction}>
                                    Save
                                </button>
                                <button className='btn btn-default mx-1' onClick={editPostCloseFunction}>
                                    Cancel
                                </button>
                            </div>
                        </footer>
                    </div>
                </Panel>
            </section>
        </div >
    )
}
export default BackgroundCommentComponent;