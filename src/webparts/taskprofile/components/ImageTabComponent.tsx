import * as React from 'react'
import { SPFI } from "@pnp/sp";
import FlorarImageUploadComponent from '../../../globalComponents/FlorarComponents/FlorarImageUploadComponent'
import { Tabs, Tab, Col, Nav, Row, Button } from 'react-bootstrap';
import pnp, { sp, Web } from "sp-pnp-js";
import { useState  } from 'react';


const ImagetabFunction = (props: any) => {
    const [selectfolder,setSelectfolder]=useState("Logos");
    const [chooseExistingFile,setChooseExistingFile ]=useState({
        ChooseExistinglogo:[],ChooseExistingCover:[],ChooseExistingImages1:[]  
    });
    const [uploadedImage,setUploadedImage]=useState(null);
    const[uploadedImageUrl,setUploadedImageUrl]=useState("");
    console.log(props)
    console.log(props)
    React.useEffect(()=>{
         
        getimageData();
      }, [selectfolder]) 
    const getimageData=async()=>{
      var  web=props.AllListId.siteUrl;
      var selectfolder2=""
      if(selectfolder=="Logos"){
        selectfolder2="Page-Images"
      }
      if(selectfolder=="Covers"){
        selectfolder2="Covers" 
      }
      if(selectfolder=="Images1"){
        selectfolder2="Portraits" 
      }
      await pnp.sp.web.getFolderByServerRelativeUrl(`${props?.Context?._pageContext?._web?.serverRelativeUrl}/PublishingImages/${selectfolder2}`).files.get()
      .then((data:any)=>{
       console.log(data)
       if(data!=undefined&&data.length>0){
        if(selectfolder=="Logos"){
            setChooseExistingFile({...chooseExistingFile,ChooseExistinglogo:data})
        }
        if(selectfolder=="Covers"){
            setChooseExistingFile({...chooseExistingFile,ChooseExistingCover:data})
        }
        if(selectfolder=="Images1"){
            setChooseExistingFile({...chooseExistingFile,ChooseExistingImages1:data})
        }
      
       }
      }) .catch((err:any) => {
        console.log(err.message);
      
      });
    }
    const florarImageUploadCallBackFunction = (item: any) => {
        console.log(item)
    
    }
    const changesTabFunction=(selecttab:any)=>{

        setSelectfolder(selecttab) ;
    }
    
     const UploadImageValue=(e:any,selectTab:any)=>{
        console.log(e);
        console.log(e.target.file)
        
        let files = e.target.files;

        const file = files[0];

        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = ()=>{
            let uploadedImage = {
                fileURL: reader.result as string,
                fileName: file.name
            }
            setUploadedImage(uploadedImage);
        }
   }
   const uploadImage=async()=>{
    var  web=props.AllListId.siteUrl;
    let resImageAdd;
    var selectfolder2=""
    if(selectfolder=="Logos"){
        selectfolder2="Page-Images"
      }
      if(selectfolder=="Covers"){
        selectfolder2="Covers" 
      }
      if(selectfolder=="Images1"){
        selectfolder2="Portraits" 
      }
    //   let resImage = await spservices.addImage(selectfolder2, uploadedImage);
     let serverRelURL: string = `${props?.Context?._pageContext?._web?.serverRelativeUrl}/PublishingImages/${selectfolder2}`;
      try {
          resImageAdd = await web.getFolderByServerRelativePath(serverRelURL).files.addUsingPath(uploadedImage.fileName, uploadedImage, {Overwrite: true});
          console.log(resImageAdd);
      }
      catch(error) {
          return Promise.reject(error);
      }
      
  

    //   if(resImage) {
    //       let hostWebURL = props.Context.pageContext.web.absoluteUrl.replace(props.Context.pageContext.web.serverRelativeUrl,"");
    //       let imageURL: string = `${hostWebURL}${resImage.data.ServerRelativeUrl}`;
        //   let taskItem = {...this.state.taskItem};
        // setUploadedImageUrl(imageURL);
        //   this.setState({
        //       taskItem: taskItem
        //   });
    // }
    // await pnp.sp.web.getFolderByServerRelativeUrl(`${props?.Context?._pageContext?._web?.serverRelativeUrl}/PublishingImages/${selectfolder2}`).files.add()
   }
    return (
        <>
            <div className='d-flex '>
                <div className="input-group "><label className=" full-width ">Image Url </label>
                    <input type="text" className="form-control" placeholder='Serach' />
                </div>


                <div className="input-group mx-3">
                    <label className=" full-width "></label>
                    <input type="text" className="form-control" placeholder='Alt text' />
                </div>
            </div>

            <div className="col-sm-12 mt-3 row">
                <Tab.Container id="left-tabs-example" defaultActiveKey="Logos">
                    <Row>
                        <        Col sm={3} className='mt-5'>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item >
                                    <Nav.Link eventKey="Logos" onClick={()=>changesTabFunction("Logos")}>Logos</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Covers"onClick={()=>changesTabFunction("Covers")}> Covers</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Images1"onClick={()=>changesTabFunction("Images1")}> Images</Nav.Link>
                                </Nav.Item>
                                <div className='mt-3 mx-4'>
                                <ul className='alignCenter list-none'>
                                  <li>
                              <span><a href={`${props.EditdocumentsData.EncodedAbsUrl}?web=1`}target="_blank" data-interception="off">
                              {props.EditdocumentsData?.File_x0020_Type == "pdf" && <span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "docx" && <span className='svg__iconbox svg__icon--docx' title="docx"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "csv" || props.EditdocumentsData?.File_x0020_Type == "xlsx" && <span className='svg__iconbox svg__icon--csv' title="csv"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "jpeg" || props.EditdocumentsData?.File_x0020_Type == "jpg " && <span className='svg__iconbox svg__icon--jpeg' title="jpeg"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "ppt" || props.EditdocumentsData?.File_x0020_Type == "pptx" && <span className='svg__iconbox svg__icon--ppt' title="ppt"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "svg" && <span className='svg__iconbox svg__icon--svg' title="svg"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "zip" && <span className='svg__iconbox svg__icon--zip' title="zip"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "png" && <span className='svg__iconbox svg__icon--png' title="png"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "txt" && <span className='svg__iconbox svg__icon--txt' title="txt"></span>}
                              {props.EditdocumentsData?.File_x0020_Type == "smg" && <span className='svg__iconbox svg__icon--smg' title="smg"></span>}
                              {props.EditdocumentsData.Url != null && <span className='svg__iconbox svg__icon--link' title="smg"></span>}
                            </a>Open this Document</span>
                          </li>
                         </ul>
                             {/* <span> <a href={`${props.EditdocumentsData.EncodedAbsUrl}?web=1`}>Open this Document</a></span> */}
                             </div>
                                <div className='mt-2 mx-4'><span className="svg__iconbox svg__icon--trash"></span>Clear Image</div>
                            </Nav>
                        </Col>
                        <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="Logos">
                                    <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="copy & paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" value={props.EditdocumentsData.Title} placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImageUploadComponent callBack={florarImageUploadCallBackFunction}></FlorarImageUploadComponent>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0  p-2'>
                                                <div className='mt-3 'style={{height: "500px"}}>
                                                    <input type="file" accept="image/*" className='full-width' onChange={(e)=>UploadImageValue(e,"upload")}/>
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2'onClick={()=>uploadImage()}>Upload</Button></div>
                                                </div>
                                               
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title={`Choose from existing (${chooseExistingFile?.ChooseExistinglogo.length})`}>
                                            <div className='border border-top-0 ImageSec p-2'>
                                                {chooseExistingFile?.ChooseExistinglogo!=undefined&& chooseExistingFile.ChooseExistinglogo.length>0&&chooseExistingFile?.ChooseExistinglogo?.map((imagesData:any)=>{
                                                   return(
                                                    <>
                                                     <img src={`${imagesData?.ServerRelativeUrl}`}></img></>
                                                   )
                                                })}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Covers">
                                <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="copy & paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImageUploadComponent callBack={florarImageUploadCallBackFunction}></FlorarImageUploadComponent>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0  p-2'>
                                                <div className='mt-3'style={{height: "500px"}}>
                                                    <input type="file" multiple accept='image/*' className='full-width'onChange={(e)=>UploadImageValue(e,"upload")}/>
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2 btn btn-primary'>Upload</Button></div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title={ `Choose from existing (${chooseExistingFile?.ChooseExistingCover.length})`}>
                                            <div className='border border-top-0 ImageSec p-2'>
                                            {chooseExistingFile?.ChooseExistingCover!=undefined&& chooseExistingFile?.ChooseExistingCover?.length>0&&chooseExistingFile?.ChooseExistingCover?.map((imagesData:any)=>{
                                                   return(
                                                    <>
                                                     <img src={`${imagesData?.ServerRelativeUrl}`}></img></>
                                                   )
                                                })}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </Tab.Pane>
                                <Tab.Pane eventKey="Images1">
                                    
                                <Tabs
                                        defaultActiveKey="copy & paste"
                                        transition={false}
                                        id="noanim-tab-example"
                                        className=""
                                    >
                                        <Tab eventKey="copy & paste" title="copy & paste">
                                            <div className='border border-top-0  p-2'>
                                                <div className="input-group "><label className=" full-width ">Image Name</label>
                                                    <input type="text" className="form-control" placeholder='image Name' />
                                                </div>
                                                <div className='mt-3'>
                                                    <FlorarImageUploadComponent callBack={florarImageUploadCallBackFunction}></FlorarImageUploadComponent>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Upload" title="Upload">
                                            <div className='border border-top-0 p-2'>
                                                <div className='mt-3'style={{height: "500px"}}>
                                                    <input type="file" multiple accept='image/*' className='full-width'onChange={(e)=>UploadImageValue(e,"upload")}/>
                                                    <div className='text-lg-end mt-2'><Button className='btn btn-primary ms-1  mx-2 btn btn-primary'>Upload</Button></div>
                                                </div>
                                            </div>
                                        </Tab>
                                        <Tab eventKey="Choose from existing (0)" title={`Choose from existing (${chooseExistingFile?.ChooseExistingImages1?.length})`} >
                                            <div className='border border-top-0 ImageSec p-2'>
                                            {chooseExistingFile?.ChooseExistingImages1!=undefined&& chooseExistingFile?.ChooseExistingImages1?.length>0&&chooseExistingFile?.ChooseExistingImages1?.map((imagesData:any)=>{
                                                   return(
                                                    <>
                                                     <img src={`${imagesData?.ServerRelativeUrl}`}></img></>
                                                   )
                                                })}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                  
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        </>
    )
}
export default ImagetabFunction;