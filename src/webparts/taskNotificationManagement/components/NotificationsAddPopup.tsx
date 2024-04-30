import { Panel, PanelType } from 'office-ui-fabric-react'
import React, { useState } from 'react'
import { Web } from "sp-pnp-js";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as Moment from 'moment';
import Button from 'react-bootstrap/Button';
import * as globalCommon from "../../../globalComponents/globalCommon";
import moment from 'moment';
let users: any = []
export const NotificationsAddPopup = (props: any) => {
    const [selectedConfigType, setselectedConfigType] = React.useState('Report')
    const [ConfigTitle, setConfigTitle] = React.useState('')
    const [EmailSubjectReport, setEmailSubjectReport] = React.useState('')
    const [Editdata, setEditData]: any = React.useState('')
    const [PortfolioAvailableToConfigure, setPortfolioAvailableToConfigure] = React.useState([]);
    const [selectedPersonsAndGroups, setSelectedPersonsAndGroups] = React.useState([]);
    const [DefaultSelectedUser, setDefaultSelectedUser] = React.useState([]);

    React.useEffect(() => {
        Promise.all([loadusersAndGroups(),getPortFolioType()])
        // loadusersAndGroups();
        // getPortFolioType()
    }, [])
    const handlePeopleChange = (people: any) => {
        setSelectedPersonsAndGroups(people)
        // console.log(people)
    }
    const onRenderCustomHeader = (
    ) => {
        return (
            <div className=" full-width pb-1" > <div className="subheading">
                <span className="siteColor">
                    {props?.SelectedEditItem?.Id != undefined ? `Edit Permission - ${props?.SelectedEditItem?.Title}` : 'Add Configration'}
                </span>
            </div>
            </div>
        );
    };
    const closePopup = (type?: any | undefined) => {
        props.callBack(type);
    }
    const loadusersAndGroups = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let web = new Web(pageInfo.WebFullUrl);
            users = await web.siteUsers.get();
        }
    }
    const addFunction = async () => {
        let pageInfo = await globalCommon.pageContext()
        if (pageInfo?.WebFullUrl) {
            let peopleAndGroupId: any = [];
            selectedPersonsAndGroups?.map((user: any) => {
                let foundPerson = users?.find((person: any) => person?.LoginName == user?.id);
                if (foundPerson?.Id != undefined) {
                    peopleAndGroupId?.push(foundPerson?.Id)
                }
            })
            let web = new Web(pageInfo.WebFullUrl);
            await web.lists.getByTitle('NotificationsConfigration').items.add({
                Title: ConfigTitle,
                RecipientsId: { 'results': peopleAndGroupId },
                Subject: EmailSubjectReport,
                ConfigType: selectedConfigType
            }).then((data: any) => {
                closePopup('add')
            }).catch((error: any) => {
                console.error('Error While adding ', error);
                alert(error?.data?.responseBody["odata.error"].message?.value)
            })
        }
    }


    const getPortFolioType = async () => {
        let web = new Web(props?.AllListId?.siteUrl);
        let PortFolioType = [];
        PortFolioType = await web.lists.getById(props?.AllListId?.PortFolioTypeID).items.select("Id","Title","Color","IdRange", "StatusOptions").get();
        let result = await web.lists.getByTitle('NotificationsConfigration').items.select('Id,ID,Modified,Created,Title,Author/Id,Author/Title,Editor/Id,Editor/Title,PortfolioType/Id,PortfolioType/Title,Recipients/Id,Recipients/Title,ConfigType,ConfigrationJSON,Subject').expand('Author,Editor,Recipients,PortfolioType').get()
        PortFolioType = PortFolioType?.filter((portfolio: any) => !result?.some((config: any) => config?.PortfolioType?.Id == portfolio?.Id));
    };
    return (
        <>
            <Panel
                onRenderHeader={onRenderCustomHeader}
                type={PanelType.medium}
                isOpen={true}
                onDismiss={() => closePopup()}
                isBlocking={false}>

                <div>
                    <span className="col-sm-3 rediobutton ">
                        <span className='SpfxCheckRadio'>
                            <input type="radio"
                                checked={selectedConfigType == 'Report'} onClick={() => setselectedConfigType('Report')}
                                className="radio" /> Email Report
                        </span>
                        <span className='SpfxCheckRadio'>   
                            <input type="radio"
                                checked={selectedConfigType == 'TaskNotifications'} onClick={() => setselectedConfigType('TaskNotifications')}
                                className="radio" />Task Notifications
                        </span>
                    </span>
                    {selectedConfigType == 'Report' ?
                        <div>
                                <div className="mb-2">
                                    <span>
                                        <input type='text' className='form-control' placeholder='Enter Report Title' value={ConfigTitle} onChange={(e) => { setConfigTitle(e.target.value) }} />

                                    </span>
                                </div>
                                <div>
                                    <span>
                                        <input type='text' className='form-control' placeholder='Enter Report subject' value={EmailSubjectReport} onChange={(e) => { setEmailSubjectReport(e.target.value) }} />

                                    </span>
                                </div>
                                <div className='peoplePickerPermission mb-2' style={{ zIndex: '999999999999' }}>
                                    <PeoplePicker
                                        context={props?.AllListId?.Context}
                                        principalTypes={[PrincipalType.User, PrincipalType.SharePointGroup, PrincipalType.SecurityGroup, PrincipalType.DistributionList]}
                                        personSelectionLimit={10}
                                        titleText="Report Recipients"
                                        resolveDelay={1000}
                                        onChange={handlePeopleChange}
                                        showtooltip={true}
                                        required={true}
                                        defaultSelectedUsers={DefaultSelectedUser}
                                    ></PeoplePicker>
                                </div>

                        </div> : <div></div>

                    }
                </div>
                <footer className='alignCenter'>
                    <div className="col text-end">
                        <Button type="button" variant="primary" className='me-1' onClick={() => addFunction()}>Create</Button>
                        <Button type="button" className="btn btn-default" variant="secondary" onClick={() => closePopup()}>Cancel</Button>
                    </div>
                </footer>

            </Panel>

        </>
    )
}
