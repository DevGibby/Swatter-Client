// styled
import styled from "styled-components";

// redux
import { connect } from "react-redux";
import { handleAdminAuth } from "../../../functions/handleAdminAuth";

const ButtonContainer = ({ user, handleDeleteAlert, editProject, DeleteAlertRef }) => {
  return (
    <StyledButtonContainer>
      {
        handleAdminAuth(user)
        ? <>
            <button id='delete' onClick={() => { handleDeleteAlert(DeleteAlertRef); }}>Delete</button>
            <button onClick={() => { editProject(); }}>Update</button>
          </>
        : <>
            <button>Update</button>
            <button id='delete'>Delete</button>
          </>
      }
    </StyledButtonContainer>
  )
}

const StyledButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    width: 100%;
    @media (max-width: 750px) {
      margin-top: 10%;
      width: 90%;
    }
    button {
      width: 200px;
      height: 40px;
      cursor: pointer;
      border: none;
      border-radius: 6px;
      font-weight: 700;
      font-size: 18px;
      @media (max-width: 1050px) {
        margin: 10px 0;
        width: 150px;
      }
      @media (max-width: 450px) {
        font-size: 16px;
        width: 100px;
        margin-bottom: 0;
      }
      &:hover {
        color: #ffffff;
        background: #000000;
        transform: scale(1.05);
        transition: 0.2s;
      }
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ButtonContainer);