import * as React from "react";
import { useState, useEffect } from 'react';
import pnp from 'sp-pnp-js';
import * as Moment from 'moment';
import { Panel, PanelType } from 'office-ui-fabric-react';

const AddCommentComponent = (FbData: any) => {
    const FeedBackData = FbData.Data;
    const Context = FbData.Context;
    const [FeedBackArray, setFeedBackArray] = useState([]);
    const [postTextInput, setPostTextInput] = useState('');
    const [currentUserData, setCurrentUserData] = useState([]);
    const [editPostPanel, setEditPostPanel] = useState(false);
    const [updateComment, setUpdateComment] = useState({
        Title: "",
        Index: "",
        SubTextIndex: ""
    });
    var Array: any = [];
    useEffect(() => {
        console.log(FeedBackData);
        if (FeedBackData != null && FeedBackData?.length > 0) {
            FeedBackData.map((dataItem: any) => {
                Array.push(dataItem);
            })
            setFeedBackArray(FeedBackData);
        }
        getCurrentUserDetails();
    }, [])

    const openEditModal = (comment: any, indexOfUpdateElement: any, indexOfSubtext: any, isSubtextComment: any) => {
        const commentDetails = {
            Title: comment,
            Index: indexOfUpdateElement,
            SubTextIndex: indexOfSubtext
        }
        setUpdateComment(commentDetails);
        setEditPostPanel(true);
    }
    const clearComment = (isSubtextComment: any, indexOfDeleteElement: any, indexOfSubtext: any) => {
        let tempArray: any = [];
        FeedBackArray?.map((item: any, index: any) => {
            if (index != indexOfDeleteElement) {
                tempArray.push(item);
            }
        })
        setFeedBackArray(tempArray);
        FbData.callBack(isSubtextComment, tempArray, indexOfDeleteElement);
    }
    const handleChangeInput = (e: any) => {
        setPostTextInput(e.target.value)
    }

    const getCurrentUserDetails = async () => {
        let currentUserId: number;
        await pnp.sp.web.currentUser.get().then(result => { currentUserId = result.Id; console.log(currentUserId) });

        if (currentUserId != undefined) {
            if (FbData.allUsers != null && FbData.allUsers?.length > 0) {
                FbData.allUsers?.map((userData: any) => {
                    if (userData.AssingedToUserId == currentUserId) {
                        let temp: any = [];
                        temp.push(userData)
                        setCurrentUserData(temp);
                    }
                })
            }
        }
    }

    const PostButtonClick = (status: any, Index: any) => {
        let txtComment = postTextInput;
        if (txtComment != '') {
            let temp = {
                AuthorImage: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Item_x0020_Cover?.Url : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg",
                AuthorName: currentUserData != null && currentUserData.length > 0 ? currentUserData[0].Title : Context.pageContext._user.displayName,
                Created: Moment(new Date().toLocaleString()).format('DD MMM YYYY HH:mm'),
                Title: txtComment
            };
            FeedBackArray.push(temp);
        }
        FbData.callBack(status, FeedBackArray, Index);
    }

    const editPostCloseFunction = () => {
        setEditPostPanel(false);
    }
    const updateCommentFunction = (e: any, CommentData: any) => {
        FeedBackArray[CommentData.Index].Title = e.target.value;
        FbData.callBack(true, FeedBackArray, 0);
    }

    const cancelCommentBtn = () => {
        FbData.CancelCallback(true);
    }

    return (
        <div>
            <section className="previous-FeedBack-section clearfix">
                {FeedBackArray != null && FeedBackArray?.length > 0 ?
                    <div>
                        {FeedBackArray?.map((commentDtl: any, index: number) => {
                            return (
                                <div>
                                    <div className="col-10 d-flex float-end add_cmnt my-1">
                                        <div className="">
                                            <img style={{ width: "40px", borderRadius: "50%", height: "40px", margin: "5px" }} src={commentDtl.AuthorImage != undefined && commentDtl.AuthorImage != '' ?
                                                commentDtl.AuthorImage : "https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg"} />
                                        </div>
                                        <div className="col-11 pe-0 mt-2 ms-1" >
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className="siteColor font-weight-normal">
                                                    {commentDtl.AuthorName} - {commentDtl.Created}
                                                </span>
                                                <span>
                                                    <a className="ps-1" onClick={() => openEditModal(commentDtl.Title, index, 0, false)}><img src={require('../../Assets/ICON/edit_page.svg')} width="25" /></a>
                                                    <a className="ps-1" onClick={() => clearComment(true, index, 0)}><img src={require('../../Assets/ICON/cross.svg')} width="25"></img></a>
                                                </span>
                                            </div>
                                            <div><span dangerouslySetInnerHTML={{ __html: commentDtl.Title }}></span></div>
                                        </div>

                                    </div>

                                </div>
                            )
                        })}
                    </div>
                    : null
                }
            </section>
            <div>
                {
                    FbData.postStatus ?
                        <section className="mt-1 clearfix">
                            <div className="col-10 d-flex float-end my-1">
                                <textarea id="txtComment SubTestBorder" style={{ width: "80%", height: "40px" }} onChange={(e) => handleChangeInput(e)} className="" ></textarea>
                                <button type="button" className="post btn btn-primary mx-1" onClick={() => PostButtonClick(FbData.postStatus, FbData.index)}>Post</button>
                                <button type="button" className="post btn btn-default" onClick={cancelCommentBtn}>Cancel</button>
                            </div>
                        </section>
                        : null
                }
            </div>
            <section className="Update-FeedBack-section">
                <Panel headerText={`Update Comment`}
                    isOpen={editPostPanel}
                    onDismiss={editPostCloseFunction}
                    isBlocking={editPostPanel}
                    type={PanelType.custom}
                    customWidth="500px"
                >
                    <div className="parentDiv">
                        <div style={{ width: '99%', marginTop: '2%', padding: '2%' }}>
                            <textarea id="txtUpdateComment" rows={6} onChange={(e) => updateCommentFunction(e, updateComment)} style={{ width: '100%', marginLeft: '3px' }} defaultValue={updateComment ? updateComment.Title : ''}>
                            </textarea>
                        </div>
                        <footer className="float-end">
                            <button className="btn btnPrimary" onClick={editPostCloseFunction}>
                                Save
                            </button>
                            <button className='btn btn-default mx-1' onClick={editPostCloseFunction}>
                                Cancel
                            </button>
                        </footer>
                    </div>
                </Panel>
            </section>
        </div>
    )
}
export default AddCommentComponent;