import { useState, useEffect, useRef } from "react";
import axios from "axios";

// styled
import styled from "styled-components";
import * as palette from "../../../../../styled/ThemeVariables.js";

// components
import Comment from "./Comment.js";
import CommentInput from "./CommentInput.js";
import { DeleteAlert } from "../../../../../components/DeleteAlert.js";

export const CommentSection = ({ user, ticketId, projectId, setLoading }) => {

  const DeleteAlertRef = useRef();

  const [ comments, setComments ] = useState([]);
  const [ commentId, setCommentId] = useState();

  useEffect(() => {
    const getComments = () => {
      axios.get(`${process.env.REACT_APP_BASE_URL}/${user.id}/projects/${projectId}/tickets/${ticketId}`, {
        headers: {
          Authorization: user.token,
        }
      })
      .then((response) => {
        setComments(response.data.comments);
      })
      .catch((err) => {
        console.log(err);
      });
    };
    getComments();
  }, [ user, projectId, ticketId ]);

  const deleteComment = (commentId) => {
    setLoading(true);
    axios.post(`${process.env.REACT_APP_BASE_URL}/${user.id}/projects/${projectId}/tickets/${ticketId}/comments/${commentId}/delete`, {},
      {
        headers: {
          Authorization: user.token
        }
      }
    )
    .then((response) => {
      if (response.status === 200) {
        setComments(response.data);
        setLoading(false);
      }
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
    });
  };

  return (
    <StyledSection className='ticket-page-tabs active' id='comments'>
      <DeleteAlert
        DeleteAlertRef={DeleteAlertRef}
        deleteFunction={deleteComment}
        commentId={commentId}
      />
      <div className='comment-section-wrapper'>
        <div className='comment-container'>
          {
            comments.map((comment, index) => {
              return (
                <Comment
                  comment={comment}
                  ticketId={ticketId}
                  projectId={projectId}
                  key={index}
                  setLoading={setLoading}
                  DeleteAlertRef={DeleteAlertRef}
                  setCommentId={setCommentId}
                />
              );
            })
          }
        </div>
        <CommentInput
          ticketId={ticketId}
          projectId={projectId}
          setLoading={setLoading}
          setComments={setComments}
        />
      </div>
    </StyledSection>
  );
}

const StyledSection = styled.article`
  color: white;
  font-size: 1em;
  margin: 0;
  padding: 2px;
  border: ${palette.greyBorder};
  border-radius: ${palette.borderRadius};
  .comment-section-wrapper {
    width: 100%;
    height: 100%;
    min-height: 30vh;
    h3 {
      color: ${palette.helperGrey};
      font-size: 1em;
      font-weight: 400;
      margin-right: auto;
    }
    .comment-container {
      width: 100%;
      max-height: 300px;
      overflow-y: auto;
      ::-webkit-scrollbar {
        width: 8px; 
      }
      ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 4px;
      }
      scrollbar-width: thin;
      scrollbar-color: #888 transparent;
      @media (max-width: 428px) {
        max-height: 40vh;
      }
    }
  }
`;