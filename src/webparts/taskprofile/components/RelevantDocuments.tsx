import * as React from 'react';
import Tooltip from '../../../globalComponents/Tooltip';
import { Web } from "sp-pnp-js";
import moment from 'moment';
import { useState, useEffect } from 'react';
const RelevantDocuments = (props: any) => {
    const [documentData, setDocumentData] = useState([]);
    const [FileName, setFileName] = useState(props.folderName);
    const [Fileurl, setFileurl] = useState("");
    console.log(props.folderName);

    useEffect(() => {
        loadAllSitesDocuments();
    }, [])
    const loadAllSitesDocuments = async () => {
        if(props.siteName=="Offshore Tasks"){
            props.siteName="OffShoreTask"  
        }
        const web = new Web(props.siteUrl);
        var filter = (`${props?.siteName}/Id eq ${props?.ID}`);
        console.log(filter);
        try{
            await web.lists.getByTitle("Documents").items.select("Id,Title,Priority_x0020_Rank,Year,File_x0020_Type,FileLeafRef,FileDirRef,ItemRank,ItemType,Url,Created,Modified,Author/Id,Author/Title,Editor/Id,Editor/Title,EncodedAbsUrl")
            .expand("Author,Editor").filter(`${props.siteName}/Id eq ${props.ID}`).top(4999)
            .get()
            .then((Data: any[]) => {
              
                Data?.map((item: any, index: any) => {
                    item.siteType = 'sp'
                    item.Author = item?.Author?.Title;
                    item.Editor = item?.Editor?.Title;
                    item.ModifiedDate = moment(item?.ModifiedDate).format("'DD/MM/YYYY HH:mm'");
                    
                })
                console.log("document data", Data);
                setDocumentData(Data);
                setFileurl(Data[0]?.FileDirRef)
            })
            // .catch((err) => {
            //     console.log(err.message);
            // });
        }catch(e: any){
         console.log(e)
        }
       

    }
    return (
        <div>
            {documentData!=undefined&&documentData?.length>0 && <div className='mb-3 card commentsection'>
                <div className='card-header'>
                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Relevant Documents<span><Tooltip /></span></div>
                </div>
                {documentData?.map((item: any, index: any) => {
                    return (
                        <div className='card-body p-1'>
                            <ul  className='d-flex list-none'>
                                <li>
                                   <a  href={item?.FileDirRef} target="_blank" data-interception="off" > <span className='svg__iconbox svg__icon--folder'></span></a>
                                </li>
                                <li>
                                  <a  href={item.EncodedAbsUrl}>
                                    {item?.File_x0020_Type=="pdf"&&<span className='svg__iconbox svg__icon--pdf' title="pdf"></span>}
                                    {item?.File_x0020_Type=="docx"&&<span className='svg__iconbox svg__icon--docx'title="docx"></span>} 
                                    {item?.File_x0020_Type=="csv"||item?.File_x0020_Type=="xlsx"&&<span className='svg__iconbox svg__icon--csv'title="csv"></span>}
                                    {item?.File_x0020_Type=="jpeg"||item?.File_x0020_Type=="jpg "&&<span className='svg__iconbox svg__icon--jpeg'title="jpeg"></span>}
                                    {item?.File_x0020_Type=="ppt"||item?.File_x0020_Type=="pptx"&&<span className='svg__iconbox svg__icon--ppt'title="ppt"></span>}
                                    {item?.File_x0020_Type=="svg"&&<span className='svg__iconbox svg__icon--svg'title="svg"></span>}
                                    {item?.File_x0020_Type=="zip"&&<span className='svg__iconbox svg__icon--zip'title="zip"></span>}
                                    {item?.File_x0020_Type=="png"&&<span className='svg__iconbox svg__icon--png'title="png"></span>}
                                    {item?.File_x0020_Type=="txt"&&<span className='svg__iconbox svg__icon--txt'title="txt"></span>}
                                    {item?.File_x0020_Type=="smg"&&<span className='svg__iconbox svg__icon--smg'title="smg"></span>}
                                    
                                    </a>
                                
                                </li>
                                <li>
                                   <a className='px-2' href={`${item?.EncodedAbsUrl}?web=1`}target="_blank" data-interception="off"> <span>{item?.Title}</span></a>
                                </li>

                            </ul>
                        </div>
                    )
                })}
               
            </div>
             }
            {documentData?.length>0 &&<div className='mb-3 card commentsection'>
                <div className='card-header'>
                    <div className="card-title h5 d-flex justify-content-between align-items-center  mb-0">Main Folder<span><Tooltip /></span></div>
                </div>
                <div className='card-body p-1'>
                <ul className='list-none'>
                                <li>
                                   <a  href={Fileurl} target="_blank" data-interception="off"  className='d-flex'> <span className='svg__iconbox svg__icon--folder '></span> <span className='ms-3'>{props?.folderName}</span></a>
                                </li>
                                </ul>
                    </div>
                </div>
              }
        </div>
    )
}
export default RelevantDocuments;