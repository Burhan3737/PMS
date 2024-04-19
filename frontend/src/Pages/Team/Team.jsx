import React, { useState, useEffect, useRef } from "react";
import { actionOptions } from "../../reduxCURD/actionOptions";
import { curdActions } from "../../reduxCURD/actions";
import { CRUDFunction } from "../../reduxCURD/container";
import { Row, Col } from "reactstrap";
import CreateTeam from "./CreateTeam";
import "./TeamsComponent.css"; // Import the CSS file
import TeamMemberSelector from "./TeamMemberSelector";
import EditTeam from "./EditTeam";
import { projects } from "../../components/DailyLogging/DailyLoggingVars";
const Team = (props) => {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const prevActionType = props.actionType;
  const prevActionTypeRef = useRef(prevActionType);

  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);

  const [newTeamFormOpen, setNewTeamFormOpen] = useState(false);
  const [editTeamFormOpen, setEditTeamFormOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    teamLead: "",
    team: [],
    teamName: "",
    project: "",
  });

  useEffect(() => {
    props.getTeams();
    props.getUsers();
  }, []);
  useEffect(() => {
    setUsers(props.users);
  }, [props.users]);

  useEffect(() => {
    if (prevActionTypeRef.current !== props.actionType && props.actionType === "TEAMS_READ_SUCCESS") {
      setTeams(props.teams);
    }
    if (prevActionTypeRef.current !== props.actionType && props.actionType === "TEAM_CREATE_SUCCESS") {
      setTeams([...teams, props.team]);
    }

    if (prevActionTypeRef.current !== props.actionType && props.actionType === "TEAM_UPDATE_SUCCESS") {
      confirmEditTeam(props.team);
    }
    if (prevActionTypeRef.current !== props.actionType && props.actionType === "TEAM_DELETE_SUCCESS") {
      handleDeleteTeam(props.team._id);
    }
    if (prevActionTypeRef.current !== props.actionType) {
      prevActionTypeRef.current = props.actionType;
    }
  }, [props.actionType]);

  const handleTeamLeadChange = (event) => {
    if (!props.users) return;
    let usersToSave = props.users.filter((u) => u.email !== event.target.value);
    let selectedTeam = newTeam.team.filter((tu) => tu.email !== event.target.value);
    let teamLead = props.users.find((u) => u.email === event.target.value);
    setUsers(usersToSave);
    setNewTeam({ ...newTeam, teamLead: { name: teamLead.name, id: teamLead._id, email: teamLead.email }, team: selectedTeam });
  };

  const handleUsersChange = (selectedUsers) => {
    let usersToSave = props.users
      .filter((u) => selectedUsers.find((su) => su === u.email))
      .map((u) => ({ name: u.name, id: u._id, email: u.email }));
    setNewTeam({ ...newTeam, team: usersToSave });
  };

  const handleTeamNameChange = (event) => {
    setNewTeam({ ...newTeam, teamName: event.target.value });
  };

  const handleProjectChange = (event) => {
    setNewTeam({ ...newTeam, project: event.target.value });
  };

  const handleCreateClick = () => {
    setNewTeam({
      teamLead: "",
      team: [],
      teamName: "",
      project: "",
    });
    setEditTeamFormOpen(false);
    setNewTeamFormOpen(true);
  };
  const handleCreateTeam = () => {
    props.createTeam(newTeam);
    // Add new team to the teams list
    // setTeams([...teams, newTeam]);
    // Clear the new team form
    setNewTeam({
      teamLead: "",
      team: [],
      teamName: "",
      project: "",
    });
    // Close the new team form
    setNewTeamFormOpen(false);
  };

  const confirmEditTeam = (updatedTeam) => {
    const oldTeams = [...teams];

    const updatedTeams = oldTeams.map((team) => (team._id === updatedTeam._id ? updatedTeam : team));

    setTeams([...updatedTeams]);
  };

  const handleEditTeam = (team) => {
    setEditTeamFormOpen(false);
    setNewTeam((prevNewTeam) => ({
      ...prevNewTeam,
      _id: team._id,
      teamLead: team.teamLead,
      team: team.team,
      teamName: team.teamName,
      project: team.project,
    }));

    setNewTeamFormOpen(false);
    setEditTeamFormOpen(true);
  };

  const handleConfirmEdit = () => {
    props.updateTeam(newTeam, newTeam._id);

    setNewTeam({
      teamLead: "",
      team: [],
      teamName: "",
      project: "",
    });

    setEditTeamFormOpen(false);
  };

  const handleDeleteTeam = (teamId) => {
    // Remove the team at the specified index from the teams list
    const cpyTeams = [...teams];
    let updatedTeams = cpyTeams.filter((t) => t._id !== teamId);
    setTeams(updatedTeams);
  };

  const deleteTeam = (teamId) => {
    if (window.confirm("Are You Sure")) {
      props.deleteTeam(teamId);
    }
  };
  return (
    <div className="form-wrapper">
      <h2>Teams</h2>
      {teams.length !== 0 && (
        <div className="table-wrapper">
          <table className="table table-striped table-responsive">
            <thead className="table-head">
              <tr>
                <th scope="col" style={{ width: "15%" }}>
                  Team Name
                </th>
                <th scope="col" style={{ width: "15%" }}>
                  Team Lead
                </th>

                <th scope="col" style={{ width: "15%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr style={{ height: "40px" }}>
                  <td>{team.teamName} </td>
                  <td>{team.teamLead && team.teamLead.name}</td>
                  <td>
                    {
                      <div className="action-class">
                        <span
                          className="action-item"
                          onClick={(e) => {
                            console.log("Delete");
                            deleteTeam({ _id: team._id });
                          }}
                        >
                          Delete
                        </span>

                        <span
                          className="action-item"
                          onClick={(e) => {
                            handleEditTeam(team);
                          }}
                        >
                          Edit
                        </span>
                      </div>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="teams-container">
        {/* Create new team form */}
        {newTeamFormOpen ? (
          <CreateTeam
            newTeam={newTeam}
            handleTeamLeadChange={handleTeamLeadChange}
            users={props.users}
            handleUsersChange={handleUsersChange}
            handleCreateTeam={handleCreateTeam}
            handleProjectChange={handleProjectChange}
            handleTeamNameChange={handleTeamNameChange}
            projects={projects}
            setNewTeamFormOpen={setNewTeamFormOpen}
          />
        ) : (
          <button className="create-button" onClick={handleCreateClick}>
            Create New Team
          </button>
        )}

        {editTeamFormOpen && (
          <EditTeam
            newTeam={newTeam}
            handleTeamLeadChange={handleTeamLeadChange}
            users={props.users}
            handleUsersChange={handleUsersChange}
            handleConfirmEdit={handleConfirmEdit}
            handleProjectChange={handleProjectChange}
            handleTeamNameChange={handleTeamNameChange}
            projects={projects}
            setEditTeamFormOpen={setEditTeamFormOpen}
          />
        )}
      </div>
    </div>
  );
};
let variableList = {
  userReducer: {
    users: [],
  },
};
actionOptions.others.getUsers = curdActions.getUsers;
const TeamContainer = CRUDFunction(Team, "team", actionOptions, variableList, ["userReducer"]);
export default TeamContainer;
