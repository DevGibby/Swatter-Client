// styled
import styled from 'styled-components';

// router
import { Link } from 'react-router-dom';

// icons
import * as icons from '../../../assets/IconImports.js';

// function
import { handleDate } from '../../../functions/handleDates.js';

// redux
import { connect } from 'react-redux';

const Ticket = ({ user, project, ticket }) => {

	const handleSprintColor = (project) => {
		if(project.sprints){
			let sprintColor = project.sprints.find(sprint => sprint.title === ticket.sprint)
			if(sprintColor){
				let color = sprintColor.color;
				if(color){
					return { background: color, padding: '1px 4px' };
				}
			} else {
				return {};
			}
		}
	}

	const handleTagImage = (tag) => {
		switch (tag) {
		case "Bug":
			return icons.TicketPicture;
		case "Feature":
			return icons.Feature;
		case "Enhancement":
			return icons.Enhancement;
		case "Task":
			return icons.Task;
		case "Redesign":
			return icons.Redesign;
		default:
			return '';
		}
	}

	const handleTicketPriority = (priority) => {
		switch (priority) {
		case "Standard":
			return icons.ArrowGreen;
		case "Medium":
			return icons.ArrowYellow;
		case "High":
			return icons.ArrowRed;
		default:
			return '';
		};
	}

    return (
        <StyledTicket className={ticket.status}>
			<Link to={`/${user.id}/projects/${project._id}/tickets/${ticket._id}`}>
				<div className="top-container">
					<h2 id="title">{ticket.title}</h2> 
				</div>
				<div className="center-container">
					<h2 id="date">{handleDate(ticket.lastUpdate)}</h2>
					<h2 id="sprint" style={handleSprintColor(project)}>{ticket.sprint}</h2>
				</div>
				<div className="bottom-container">
					<div className="status-icons-container">
						<img src={handleTagImage(ticket.tag)} alt={ticket.tag} />
						<img src={handleTicketPriority(ticket.priority)} alt={ticket.priority} />
					</div>
				<h2 id={ticket.author} className='author'>{ticket.author}</h2>
				</div>
			</Link>
        </StyledTicket>
    )
}

const StyledTicket = styled.div`
	display: flex;
	justify-content: center;
	flex-direction: column;
	width: 99%;
	margin: 2% auto;
	border-radius: 4px;
	cursor: pointer;
	border: 1px solid white;
	background: #0f4d92bd;
	transition: 0.2s;
	h2 {
		font-size: .8em;
		font-weight: 400;
	}
	#title {
		color: #ffffff;
		margin-right: 8px;
	}
	#key {
		margin-bottom: auto;
	}
	#date, .author, #sprint, #key {
		color: #c5c5c5;
		font-size: .7em;
		font-weight: 400;
	}
	.center-container, .bottom-container, .top-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 90%;
		height: 50%;
		margin: 10px auto;
		.status-icons-container {
			img {
				width: 20px;
				&:first-child {
					margin-right: 10px;
				}
			}
		}
	}
	.center-container {
		flex-direction: column;
		#date, #sprint {
			margin-right: auto;
		}
		#sprint {
			color: white;
			border-radius: 4px;
			font-weight: 200;
		}
	}
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Ticket);