import { useState, useRef } from "react";
import axios from "axios";

// styled
import styled from "styled-components";
import * as palette from "../../../../../styled/ThemeVariables";

// functions
import { handleAlert } from "../../../../../functions/handleAlert";
import { handleDeleteAlert } from "../../../../../functions/handleDeleteAlert";
import { handleAuthor } from "../../../../../functions/handleAuthor";

// components
import { Alert } from "../../../../../components/Alert";
import { DeleteAlert } from "../../../../../components/DeleteAlert";

// images
import * as icon from '../../../../../assets/IconImports.js'

// redux
import { connect } from "react-redux";

const Comment = ({ comment, projectId, setLoading, bugId, user }) => {

  const AlertRef = useRef();
  const DeleteAlertRef = useRef();

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
    axios.post(`${process.env.REACT_APP_BASE_URL}/${process.env.REACT_APP_DELETE_BUG_COMMENT_URL}/${projectId}/${bugId}/${comment._id}`)
    .then((response) => {
      if (response.data !== "Comment Deleted!") {
        setMessage("Server Error - Comment not deleted");
        handleAlert(AlertRef);
        setLoading(false);
      } else {
        setMessage("Comment Deleted!");
        handleAlert(AlertRef);
        setLoading(false);
      }
    })
    .catch((err) => {
      console.log(err);
      setMessage("Server Error - Comment not deleted");
      handleAlert(AlertRef);
      setLoading(false);
    });
  };
  
  const handleCommentAuthor = (author) => {
    if(author === user.username){
      return { margin: "10px 5% 10px auto", background: `${palette.helperGrey}`};
    } else {
      return { margin: "10px auto 10px 5%", background: "white" };
    }
  }

  return (
    <StyledComment style={handleCommentAuthor(comment.author)} >
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
          {
            handleAuthor(comment.author, user) 
            ? <div className='dropdown'>
                <button className='dropbtn'>
                  <img src={icon.Menu} alt='Menu' />
                </button>
                <div className='dropdown-content'>
                  {
                    handleAuthor(comment.author, user)
                    ? <button onClick={() => { handleDeleteAlert(DeleteAlertRef); }}>Delete</button>
                    : <button>Delete</button>
                  }
                </div>
              </div>
            : <></>
          }
        </div>
        <p>{comment.comment}</p>
      </div>
    </StyledComment>
  );
}

const StyledComment = styled.div`
  display: flex;
  max-width: 80%;
  width: auto;
  height: auto;
  margin: 10px auto;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 3px 3px 3px #5252528d;
  position: relative;
  justify-content: space-around;
  @media (max-width: 450px) {
    max-width: 80%;
  }
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
        font-size: 12px;
        display: flex;
        align-items: center;
        span {
          margin-left: 10px;
          font-size: 10px;
          color: #575757;
        }
      }
      .dropdown {
        position: relative;
        display: inline-block;
        .dropbtn {
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
          display: none;
          position: absolute;
          right: 90%;
          top: 0;
          box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
          z-index: 1;
          background: ${palette.helperGrey};
          button {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            border: none;
            background: none;
            cursor: pointer;
            &:hover {
              background: white;
            }
          }
        }
      }
      .dropdown:hover .dropdown-content,
      .dropdown:active .dropdown-content,
      .dropdown:focus .dropdown-content {
        display: block;
      }
      .dropdown:hover .dropbtn,
      .dropdown:active .dropdown-content,
      .dropdown:focus .dropdown-content {
        background-color: ${palette.helperGrey};
      }
    }
    #Gibby {
      color: #008ee0;
    }
    #Moose {
      color: #0dbe7a;
    }
    p {
      font-size: 12px;
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