import React from 'react';
import { TbTruckDelivery } from 'react-icons/tb';
import { Web } from "sp-pnp-js";
import Tooltip from '../Tooltip';
import { SlArrowRight, SlArrowLeft, SlArrowUp, SlArrowDown } from "react-icons/sl";

export interface ITeamConfigurationProps {
    parentCallback: (dt: any) => void;
    ItemInfo: any;
    AllListId: any;
}

export interface ITeamConfigurationState {
    taskUsers: any;
    taskDetails: any;
    ResponsibleTeam: any;
    AssignedToUsers: any;
    TeamMemberUsers: any;
    updateDragState: boolean;
    TeamConfiguration: any;
    TeamUserExpended: boolean;
}

const dragItem: any = {};
let web: any;

export class TeamConfigurationCard extends React.Component<ITeamConfigurationProps, ITeamConfigurationState> {
    constructor(props: ITeamConfigurationProps) {
        super(props);
        this.state = {
            taskUsers: [],
            taskDetails: [],
            ResponsibleTeam: [],
            AssignedToUsers: [],
            TeamMemberUsers: [],
            updateDragState: false,
            TeamConfiguration: {},
            TeamUserExpended: true
        }
        this.loadData();

    }

    private async loadData() {
        await this.loadTaskUsers();
        await this.GetTaskDetails();
        this.showComposition();
    }
    private AllUsers: any = [];
    private dragUser: any;
    private async loadTaskUsers() {
        if (this.props.ItemInfo.siteUrl != undefined) {
            web = new Web(this.props.ItemInfo.siteUrl);
        } else {
            web = new Web(this.props.AllListId?.siteUrl);
        }
        let results: any = [];

        let taskUsers: any = [];
        results = await web.lists
            .getById(this.props.AllListId?.TaskUsertListID)
            .items
            .select('Id', 'IsActive', 'UserGroupId', 'Suffix', 'Title', 'Email', 'SortOrder', 'Role', 'Company', 'ParentID1', 'TaskStatusNotification', 'Status', 'Item_x0020_Cover', 'AssingedToUserId', 'isDeleted', 'AssingedToUser/Title', 'AssingedToUser/Id', 'AssingedToUser/EMail', 'ItemType')
            .filter('IsActive eq 1')
            .expand('AssingedToUser')
            .orderBy('SortOrder', true)
            .orderBy("Title", true)
            .get();

        let self = this;
        results.forEach(function (item: any) {
            if (item.ItemType != 'Group') {
                if (self.props.ItemInfo.Services != undefined && self.props.ItemInfo.Services.length > 0) {
                    if (item.Role != null && item.Role.length > 0) {
                        let FindServiceUser = item.Role.join(';').indexOf('Service Teams');
                        if (FindServiceUser > -1) {
                            self.AllUsers.push(item);
                        }
                    }
                } else {
                    self.AllUsers.push(item);
                }
            }
        })
        results.forEach(function (item: any) {
            if (item.UserGroupId == undefined) {
                self.getChilds(item, results);
                taskUsers.push(item);
            }
        });
        if (taskUsers != undefined && taskUsers.length > 0) {
            taskUsers?.map((Alluser: any) => {
                if (Alluser.childs != undefined && Alluser.childs.length > 0) {
                    Alluser.childs.map((ChildUser: any) => {
                        if (ChildUser.Item_x0020_Cover == null || ChildUser.Item_x0020_Cover == undefined) {
                            let tempObject: any = {
                                Description: 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg',
                                Url: 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'
                            }
                            ChildUser.Item_x0020_Cover = tempObject;
                        }
                    })
                }
            })
        }
        console.log(taskUsers);
        this.setState({
            taskUsers
        })
    }
    private async GetTaskDetails() {
        if (this.props.ItemInfo.siteUrl != undefined) {
            web = new Web(this.props.ItemInfo.siteUrl);
        } else {
            web = new Web(this.props.AllListId?.siteUrl);
        }
        let taskDetails = [];
        if (this.props.ItemInfo.listId != undefined) {
            taskDetails = await web.lists
                .getById(this.props.ItemInfo.listId)
                .items
                .getById(this.props.ItemInfo.Id)
                .select("ID", "Title", "AssignedTo/Title", "AssignedTo/Id", "TeamMembers/Title", "TeamMembers/Id", "ResponsibleTeam/Title", "ResponsibleTeam/Id" )
                .expand("TeamMembers", "AssignedTo", "ResponsibleTeam")
                .get()
        } else {
            taskDetails = await web.lists
                .getByTitle('Master Tasks')
                .items
                .getById(this.props.ItemInfo.Id)
                .select("ID", "Title", "AssignedTo/Title", "AssignedTo/Id", "TeamMembers/Title", "TeamMembers/Id", "ResponsibleTeam/Title", "ResponsibleTeam/Id" )
                .expand("TeamMembers", "AssignedTo", "ResponsibleTeam")
                .get()
        }


        console.log('Task Details---');
        console.log(taskDetails);


        this.setState({ taskDetails })
    }
    private getChilds(item: any, items: any) {
        item.childs = [];
        for (let index = 0; index < items.length; index++) {
            let childItem = items[index];
            if (childItem.UserGroupId != undefined && parseInt(childItem.UserGroupId) == item.ID) {
                // if (this.props.ItemInfo?.Services != undefined && (this.props.ItemInfo?.Services.length > 0 || this.props?.ItemInfo?.Portfolio_x0020_Type == 'Service')) {
                //     if (childItem.Role != null && childItem.Role.length > 0 && childItem.Role.join(';').indexOf('Service Teams') > -1) {
                //         item.childs.push(childItem);
                //     }
                // } else {
                //     item.childs.push(childItem);
                // }
                item.childs.push(childItem);
                this.getChilds(childItem, items);
            }
        }
    }
    private ResponsibleTeam: any = [];
    private AssignedToUsers: any = [];
    private TeamMemberUsers: any = [];
    private NewTeamConfigurations: any = [];
    private showComposition() {
        let Item = this.state.taskDetails;
        let taskUsers = this.state.taskUsers;
        let self = this;

        if (Item.ResponsibleTeam != undefined) {
            if (self.ResponsibleTeam != undefined && self.ResponsibleTeam.length > 0) {
                let TeamLeaderData = self.getUsersWithImage(Item.ResponsibleTeam);
                TeamLeaderData.forEach(function (item: any) {
                    if (!self.isItemExists(self.ResponsibleTeam, item.Id)) {
                        self.ResponsibleTeam.push(item);
                    }
                });
            }
            else {
                self.ResponsibleTeam = self.getUsersWithImage(Item.ResponsibleTeam);
            }
            self.NewTeamConfigurations.push({ Title: 'Task Leader', childs: self.ResponsibleTeam });
        }
        console.log('Task Leader');
        console.log(this.NewTeamConfigurations);

        if (Item.TeamMembers != undefined) {
            if (self.TeamMemberUsers != undefined && self.TeamMemberUsers.length > 0) {
                let TeamMemberUsersData = self.getUsersWithImage(Item.TeamMembers);
                TeamMemberUsersData.forEach(function (item: any) {
                    if (!self.isItemExists(self.TeamMemberUsers, item.Id)) {
                        self.TeamMemberUsers.push(item);
                    }
                });
            }
            else {
                self.TeamMemberUsers = self.getUsersWithImage(Item.TeamMembers);
            }
            self.NewTeamConfigurations.push({ Title: 'Team Members', childs: self.TeamMemberUsers });
        }
        console.log('Task Leader,Team Members');
        console.log(this.NewTeamConfigurations);

        if (Item.AssignedTo != undefined) {
            if (self.AssignedToUsers != undefined && self.AssignedToUsers.length > 0) {
                let AssignedToUsersData = self.getUsersWithImage(Item.AssignedTo);
                AssignedToUsersData.forEach(function (item: any) {
                    if (!self.isItemExists(self.AssignedToUsers, item.Id)) {
                        self.AssignedToUsers.push(item);
                    }
                });
            }
            else {
                self.AssignedToUsers = self.getUsersWithImage(Item.AssignedTo);
            }
            self.AssignedToUsers = self.getUsersWithImage(Item.AssignedTo);
            //AssignedToUsersDetail = self.AssignedToUsers;
        }

        taskUsers.forEach(function (categoryUser: any) {
            for (var i = 0; i < categoryUser.childs.length; i++) {
                if (categoryUser.childs[i].Item_x0020_Cover != undefined) {
                    self.TeamMemberUsers.forEach(function (item: any) {
                        if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
                            categoryUser.childs.splice(i, 1);
                        }
                    });
                }
            }
        });
        taskUsers.forEach(function (categoryUser: any) {
            for (var i = 0; i < categoryUser.childs.length; i++) {
                if (categoryUser.childs[i].Item_x0020_Cover != undefined) {
                    self.AssignedToUsers.forEach(function (item: any) {
                        if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
                            categoryUser.childs.splice(i, 1);
                        }
                    });
                }
            }
        });
        taskUsers.forEach(function (categoryUser: any) {
            for (var i = 0; i < categoryUser.childs.length; i++) {
                if (categoryUser.childs[i].Item_x0020_Cover != undefined) {
                    self.ResponsibleTeam.forEach(function (item: any) {
                        if (categoryUser.childs[i] != undefined && categoryUser.childs[i].AssingedToUserId != undefined && categoryUser.childs[i].AssingedToUserId == item.Id) {
                            categoryUser.childs.splice(i, 1);
                        }
                    });
                }
            }
        });
        let AllTeamDetails = {
            Item1: { Title: 'Team Member', Childs: self.TeamMemberUsers },
            Item2: { Title: 'Working Member', Childs: self.AssignedToUsers },
            Item3: { Title: 'Team Leader', Childs: self.ResponsibleTeam }
        };
        console.log('Task Leader,Team Members', 'Task Leader', 'AllTeamDetails');
        console.log(AllTeamDetails);
        this.setState({
            taskUsers,
            TeamMemberUsers: self.TeamMemberUsers,
            AssignedToUsers: self.AssignedToUsers,
            ResponsibleTeam: self.ResponsibleTeam
        })
    }

    private isItemExists = function (arr: any, Id: any) {
        var isExists = false;
        arr.forEach(function (item: any) {
            if (item.ID == Id) {
                isExists = true;
                return false;
            }
        });
        return isExists;
    }

    private getUsersWithImage(items: any) {
        let users: any = [];
        let self = this;
        for (let i = 0; i < self.AllUsers.length; i++) {
            //  angular.forEach(categoryUser.childs, function (child, ) {
            if (self.AllUsers[i]) {
                items.forEach(function (item: any) {
                    if (self.AllUsers[i] != undefined && self.AllUsers[i].AssingedToUserId != undefined && self.AllUsers[i].AssingedToUserId == item.Id) {
                        if (self.AllUsers[i].Item_x0020_Cover == undefined || self.AllUsers[i].Item_x0020_Cover == null) {
                            self.AllUsers[i].Item_x0020_Cover = {}
                            self.AllUsers[i].Item_x0020_Cover.Url = 'https://hhhhteams.sharepoint.com/sites/HHHH/SiteCollectionImages/ICONS/32/icon_user.jpg'
                        }
                        item.userImage = self.AllUsers[i].Item_x0020_Cover.Url
                        item.Title = self.AllUsers[i].Title;
                        item.Suffix = self.AllUsers[i].Suffix;
                        item.UserGroupId = self.AllUsers[i].UserGroupId;
                        item.ID = self.AllUsers[i].ID;
                        item.Company = self.AllUsers[i].Company;
                        item.AssingedToUserId = self.AllUsers[i].AssingedToUserId;
                        item.Role = self.AllUsers[i].Role;
                        item.AssingedToUser = self.AllUsers[i].AssingedToUser;

                        if (self.AllUsers[i].Item_x0020_Cover != undefined) {
                            item.Item_x0020_Cover = self.AllUsers[i].Item_x0020_Cover;
                        }
                        if (!self.isItemExists(users, item.Id)) {
                            users.push(item);
                        }
                    }
                });
            }
        }
        return users;
    }

    private dragStart = (e: any, position: any, user: any, team: any) => {
        dragItem.current = position;
        dragItem.user = user;
        dragItem.userType = team;
        console.log(dragItem);
    };

    private onDropRemoveTeam = (e: any, taskUsers: any) => {
        e.preventDefault();
        let $data = dragItem.user;
        let self = this;
        this.state.taskUsers.forEach(function (child: any) {
            if (child.ID == $data.UserGroupId) {
                if (!self.isItemExists(child.childs, $data.Id))
                    child.childs.push($data);
            }
        });
        this.dropSuccessHandler(true);
    }

    private onDropTeam(e: any, array: any, Team: any, AllUser: any, userType: any) {
        if (dragItem.userType != userType) {
            let $data = dragItem.user;
            let self = this;
            array.forEach(function (user: any, indexParent: any) {
                if (user.Title == $data.Company && !self.isItemExists(array, $data.Id)) {
                    user.childs.push($data);
                }
            })
            if (!self.isItemExists(array, $data.Id)) {
                array.push($data);
            }
            if (Team != undefined) {
                AllUser.forEach(function (Group: any, index: any) {
                    if (Group.childs != undefined && Group.childs.length > 0) {
                        Group.childs.forEach(function (user: any, userindex: any) {
                            if ((user.AssingedToUserId != undefined && user.AssingedToUserId == $data.AssingedToUserId) || (user.Id != undefined && user.Id == $data.Id)) {
                                Group.childs.splice(userindex, 1);
                            }
                        })
                    }
                })
            }
            this.dropSuccessHandler(true);
        }
    }

    private onDropTeam1(e: any, array: any, Team: any, AllUser: any, userType: any) {
        if (dragItem.userType != userType) {
            let $data = dragItem.user;
            let self = this;
            array.forEach(function (user: any, indexParent: any) {
                if (user.Title == $data.Company && !self.isItemExists(array, $data.Id)) {
                    user.childs.push($data);
                }
            })
            if (Team != undefined) {
                AllUser.forEach(function (Group: any, index: any) {
                    if (Group.childs != undefined && Group.childs.length > 0) {
                        Group.childs.forEach(function (user: any, userindex: any) {
                            if ((user.AssingedToUserId != undefined && user.AssingedToUserId == $data.AssingedToUserId) || (user.Id != undefined && user.Id == $data.Id)) {
                                Group.childs.splice(userindex, 1);
                            }
                        })
                    }
                })
            }

            if (!self.isItemExists(array, $data.Id)) {
                array.push($data);
            }
            this.dropSuccessHandler(false);
        }
    }

    private dropSuccessHandler(isRemove: any) {
        if (isRemove) {
            if (dragItem.userType == 'TeamMemberUsers')
                this.state.TeamMemberUsers.splice(dragItem.current, 1);

            if (dragItem.userType == 'ResponsibleTeam')
                this.state.ResponsibleTeam.splice(dragItem.current, 1);
        }
        if (dragItem.userType == 'Assigned User')
            this.state.AssignedToUsers.splice(dragItem.current, 1);
        let TeamConfiguration = {
            TeamMemberUsers: this.state.TeamMemberUsers,
            ResponsibleTeam: this.state.ResponsibleTeam,
            AssignedTo: this.state.AssignedToUsers,
            isDrop: true,
            isDropRes: true
        }
        //set state of array element
        this.setState({
            updateDragState: true,
            TeamConfiguration
        }, () => this.props.parentCallback(this.state.TeamConfiguration))

    }

    public render(): React.ReactElement<ITeamConfigurationProps> {
        return (
            <>
                <div className="col">
                    <div className="col bg-ee px-1 border">
                        <div ng-if="teamUserExpanded" className="alignCenter justify-content-between align-items-center commonheader" ng-click="forCollapse()">
                            <span className='alignCenter'>
                                {this.state.TeamUserExpended ?
                                    <SlArrowDown onClick={() => this.setState({ TeamUserExpended: false })}></SlArrowDown>
                                    
                                    :
                                    <SlArrowRight onClick={() => this.setState({ TeamUserExpended: true })}></SlArrowRight>
                                }
                                <span className='mx-2'>
                                    Select Team Members
                                </span>
                            </span>
                            <span className='alignCenter'>
                                <a target="_blank " className="me-1 mt-2" href={`${this.props.AllListId?.siteUrl}/SitePages/TaskUser-Management.aspx`} data-interception="off">
                                    Task User Management
                                </a>
                                <Tooltip ComponentId="1745" />
                            </span>
                        </div>
                    </div>
                    {this.state.TeamUserExpended ?
                        <div className="border col p-2 border-top-0" ng-show="teamUserExpanded">
                            <div className="taskTeamBox">
                                {this.state.taskUsers != null && this.state.taskUsers.length > 0 && this.state.taskUsers.map((user: any, index: number) => {
                                    return <div ui-on-drop="onDropRemoveTeam($event,$data,taskUsers)" className="top-assign ng-scope">
                                        {user.childs.length > 0 &&
                                            <div ng-if="user.childs.length >0" className="team ng-scope">
                                                <label className="BdrBtm">
                                                    {user.Title}
                                                </label>
                                                <div className='d-flex'>
                                                    {user.childs.map((item: any, i: number) => {
                                                        return <div className="marginR41 ng-scope">
                                                            {item.Item_x0020_Cover != undefined && item.AssingedToUser != undefined &&
                                                                <span>
                                                                    <img
                                                                        className="ProirityAssignedUserPhoto"
                                                                        src={item.Item_x0020_Cover.Url}
                                                                        // style={{ backgroundImage: "url('" + item.Item_x0020_Cover.Url + "')", backgroundSize: "24px 24px" }}
                                                                        title={item.AssingedToUser.Title}
                                                                        draggable
                                                                        onDragStart={(e) => this.dragStart(e, i, item, 'All')}
                                                                        onDragOver={(e) => e.preventDefault()} />
                                                                </span>
                                                            }
                                                        </div>
                                                    })}
                                                </div>
                                            </div>
                                        }
                                    </div>
                                })
                                }
                            </div>
                            <div className="row ">

                                <div className="col-sm-7">
                                    <h6 className='mb-1'>Team Members</h6>
                                    <div className="d-flex pb-1 UserTimeTabGray" style={{paddingTop:"3px"}}>
                                        <div className="col-sm-5 border-end p-0" >
                                            <div className="col"
                                                onDrop={(e) => this.onDropTeam(e, this.state.ResponsibleTeam, 'Team Leaders', this.state.taskUsers, 'ResponsibleTeam')}
                                                onDragOver={(e) => e.preventDefault()}>
                                                <div className="p-1">
                                                    <div data-placeholder="Team Leader" className='flex-wrap selectmember'>
                                                        {this.state.ResponsibleTeam != null && this.state.ResponsibleTeam.length > 0 && this.state.ResponsibleTeam.map((image: any, index: number) => {
                                                            return <img
                                                                className="ProirityAssignedUserPhoto"
                                                                src={image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url}
                                                                // style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "24px 24px" }}
                                                                title={image.Title} draggable
                                                                onDragStart={(e) => this.dragStart(e, index, image, 'ResponsibleTeam')}
                                                                onDragOver={(e) => e.preventDefault()}
                                                            />
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-7 ">
                                            <div className="col-sm-12"
                                                onDrop={(e) => this.onDropTeam(e, this.state.TeamMemberUsers, 'Team Members', this.state.taskUsers, 'TeamMemberUsers')}
                                                onDragOver={(e) => e.preventDefault()}>
                                                <div className="p-1">
                                                    <div data-placeholder="Responsible Team" className='flex-wrap selectmember'>
                                                        {this.state.TeamMemberUsers != null && this.state.TeamMemberUsers.length > 0 && this.state.TeamMemberUsers.map((image: any, index: number) => {
                                                            return <img
                                                                className="ProirityAssignedUserPhoto me-1"
                                                                // style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "24px 24px" }}
                                                                title={image.Title}
                                                                src={image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url}
                                                                draggable
                                                                onDragStart={(e) => this.dragStart(e, index, image, 'TeamMemberUsers')}
                                                                onDragOver={(e) => e.preventDefault()} />
                                                        })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-sm-3'>
                                    <h6 className='mb-1'>Working Members</h6>
                                    <div className="col"
                                        onDrop={(e) => this.onDropTeam1(e, this.state.AssignedToUsers, 'Assigned User', this.state.taskUsers, 'Assigned User')}
                                        onDragOver={(e) => e.preventDefault()}>
                                        <div className="d-flex  working-box"  style={{padding:"8px 0px 7px 0px"}} >
                                            <div className='flex-wrap' data-placeholder="Working Members">
                                                {this.state.AssignedToUsers && this.state.AssignedToUsers.map((image: any, index: number) => {
                                                    return <img
                                                        className="ProirityAssignedUserPhoto"
                                                        src={image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url}
                                                        // style={{ backgroundImage: "url('" + (image.userImage != null ? image.userImage : image.Item_x0020_Cover.Url) + "')", backgroundSize: "24px 24px" }}
                                                        title={image.Title}
                                                        draggable
                                                        onDragStart={(e) => this.dragStart(e, index, image, 'Assigned User')}
                                                        onDragOver={(e) => e.preventDefault()} />
                                                })
                                                }
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                <div className="col-sm-2">
                                   
                                        <div className="dustbin bg-siteColor" onDrop={(e) => this.onDropRemoveTeam(e, this.state.taskUsers)}
                                            onDragOver={(e) => e.preventDefault()}>
                                            <span className="svg__iconbox svg__icon--palmTree" title="Drag user here to  remove user from team for this Network Activity."></span>
                                        </div>
                                  
                                </div>
                            </div>
                        </div>
                        : null}

                </div>
            </>
        );
    }
}

export default TeamConfigurationCard;
