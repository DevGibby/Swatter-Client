import { useState, useRef } from "react";
import axios from "axios";

// styled
import styled from "styled-components";
import * as pallette from "../../../styled/ThemeVariables";

// images
import Menu from "../../../assets/icons/dotMenu.png";

// redux
import { connect } from "react-redux";

// components
import { DeleteAlert } from "../../../components/DeleteAlert";
import { Alert } from "../../../components/Alert";

// functions
import { handleDeleteAlert } from "../../../functions/handleDeleteAlert";
import { handleAlert } from "../../../functions/handleAlert";
import { toggleRef } from "../../../functions/toggleRef";
import { handleAuthor } from "../../../functions/handleAuthor.js";

const Comment = ({ comment, user, projectId, setLoading }) => {

  const AlertRef = useRef();
  const DeleteAlertRef = useRef();
  const DropDownRef = useRef();

  const [ message, setMessage ] = useState('');

  const handleDate = (comment) => {
		let currentDate = new Date();
		let compareDate = currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' }).split(",");
		const [ commentDate, commentTime ] = comment.date.split(",");
		if(compareDate[0] === commentDate){
			return commentTime;
		} else {
			return commentDate;
		}
	}

  const deleteComment = () => {
    setLoading(true);
    axios.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DELETE_COMMENT_URL}/${projectId}/${comment._id}`)
    .then((response) => {
      if (response.data !== "Comment Deleted") {
        setLoading(false);
        setMessage('Server Error - Comment Not Deleted');
        handleAlert(AlertRef);
      } else {
        setLoading(false);
      }
    })
    .catch((err) => {
      console.log(err);
    })
  };

  const handleCommentAuthor = (author) => {
    if(author === user.username){
      return { margin: "10px 5% 10px auto", background: `${pallette.helperGrey}`};
    } else {
      return { margin: "10px auto 10px 5%", background: "white" };
    }
  }

  return (
    <StyledComment style={handleCommentAuthor(comment.author)}>
      <Alert
        message={message}
        AlertRef={AlertRef}
      />
      <DeleteAlert
        DeleteAlertRef={DeleteAlertRef}
        deleteFunction={deleteComment}
        title={'comment'}
      />
      <div className='comment-wrapper'>
        <div className='comment-title-container'>
          <h3 id={comment.author}>{comment.author}<span>{handleDate(comment)}</span></h3>
          <div className='dropdown'>
            <button className='drop-down-btn' onClick={() => { toggleRef(DropDownRef)}}><img src={Menu} alt='Menu' /></button>
            <div className='dropdown-content' ref={DropDownRef} style={{display: 'none'}}>
              {  
                handleAuthor(comment.author, user)
                ? <button onClick={() => { handleDeleteAlert(DeleteAlertRef); toggleRef(DropDownRef)}}>Delete</button>
                : <button>Delete</button>
              }
            </div>
          </div>
        </div>
        <p>{comment.comment}</p>
      </div>
    </StyledComment>
  );
}

const StyledComment = styled.div`
  display: flex;
  max-width: 60%;
  width: auto;
  height: auto;
  margin: 10px auto;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 3px 3px 3px #5252528d;
  position: relative;
  justify-content: space-around;
  .comment-wrapper {
    width: 95%;
    margin: 10px auto;
    .comment-title-container {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 20px;
      align-items: center;
      margin-bottom: 10px;
      h3 {
        font-size: .8em;
        display: flex;
        align-items: center;
        span {
          margin-left: 10px;
          font-size: .6em;
          color: #575757;
        }
      }
      .dropdown {
        position: relative;
        display: inline-block;
        .drop-down-btn {
          color: white;
          font-size: 16px;
          border: none;
          background: none;
          cursor: pointer;
          padding: 0;
          height: 25px;
          width: 25px;
          img {
            height: 25px;
            width: 25px;
          }
        }
        .dropdown-content {
          position: absolute;
          right: 10%;
          top: 99%;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
          background: ${pallette.helperGrey};
          border-radius: 4px;
          button {
            color: #ff0000;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            border: 1px solid black;
            background: none;
            cursor: pointer;
            &:hover {
              background: white;
            }
          }
        }
      }
    }
    #Gibby {
      color: #008ee0;
    }
    #Moose {
      color: #0dbe7a;
    }
    p {
      font-size: .6em;
      font-weight: 400;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Comment);