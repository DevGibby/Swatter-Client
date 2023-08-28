import axios from "axios";

// styled
import styled from "styled-components";

//redux
import { connect } from "react-redux";

const CommentInput = ({ user, setLoading, projectId, ticketId, CommentContainerRef }) => {

  const sendComment = () => {
    if (!document.getElementById("comment").value) {
      setLoading(false);
    } else {
      setLoading(true);
      axios.post(`${process.env.REACT_APP_BASE_URL}/${user.id}/projects/${projectId}/tickets/${ticketId}/comments`,
        {
          headers: {
            Authorization: user.token
          }
        },
        {
          projectId: projectId,
          ticketId: ticketId,
          comment: document.getElementById("comment").value,
          author: user.username,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          document.getElementById("comment").value = "";
          let container = CommentContainerRef.current;
          setTimeout(() => {
            container.scrollTo(0, document.body.scrollHeight);
          }, 1000);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      })
    }
  };

  return (
    <StyledCommentInput>
      <textarea
        placeholder='Add a comment'
        name='comment'
        id='comment'
      />
      <button onClick={(e) => { sendComment()}}>Send</button>
    </StyledCommentInput>
  );
}

const StyledCommentInput = styled.article`
  margin: 10px 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  textarea {
    background: #d6d6d6;
    padding: 6px;
    min-height: 70px;
    height: auto;
    max-width: 550px;
    width: 100%;
    font-size: .8em;
  }
  button {
    margin: 6px auto;
    width: 100%;
    max-width: 350px;
    height: 30px;
    cursor: pointer;
    color: #0f4d92;
    background: white;
    border: none;
    border-radius: 4px;
    font-size: 1em;
    font-weight: 700;
    transition: 0.2s;
    &:hover {
      background: #000000;
      color: white;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(CommentInput);