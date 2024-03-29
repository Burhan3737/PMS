import React from "react";
import TeamMemberSelector from "./TeamMemberSelector";

export default function CreateTeam(props) {

  const { newTeam, handleTeamLeadChange, users, handleUsersChange, handleCreateTeam, handleProjectChange, handleTeamNameChange, setNewTeamFormOpen, projects } = props




  return (
    <div>
      <h2>Create New Team</h2>
      <form>
        <label>
          Team Lead:
          <select value={newTeam.teamLead && newTeam.teamLead.email} onChange={handleTeamLeadChange}>
            <option value="">Select Team Lead</option>
            {props.users &&
              props.users.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name}
                </option>
              ))}
          </select>
        </label>

        <label>
          Users:
          {/* <select multiple value={newTeam.users} onChange={handleUsersChange}>
            {users.map((user) => (
              <option key={user._id} value={user.email}>
                {user.name}
              </option>
            ))}
          </select> */}
          <TeamMemberSelector users={users} handleUsersChange={handleUsersChange} newTeam={newTeam}  />
        </label>

        <label>
          Team Name:
          <input type="text" value={newTeam.teamName} onChange={handleTeamNameChange} />
        </label>

        <label>
          Project:
          <select value={newTeam.project} onChange={handleProjectChange}>
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </label>
       <div className="action-class">
        <button type="button" onClick={handleCreateTeam}>
          Create Team
        </button>

        <button type="button" onClick={()=>setNewTeamFormOpen(false)}>
          Close
        </button>

        </div>
      </form>
    </div>
  )
}