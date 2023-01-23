// styled
import styled from "styled-components";
import * as pallette from "../styled/ThemeVariables.js";

// router
import { Link } from "react-router-dom";

export const BreadCrumbs = ({ projectId, projectTitle, title }) => {

  return (
    <StyledBreadCrumbs>
        <Link to={`/`}>Home</Link>
        <span>/</span>
        <Link to={`/projects/${projectId}`}>{projectTitle}</Link>
        {
            title ? 
            <>
                <span>/</span>
                <p>{title}</p>
            </>
            : <></>
        }
    </StyledBreadCrumbs>
  );
}

const StyledBreadCrumbs = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    @media (max-width: 428px) {
      display: none;
    }
    a {
      border: none;
      background: none;
      font-size: 16px;
      color: ${pallette.helperGrey};
      cursor: pointer;
      @media (max-width: 450px) {
        font-size: .6em;
      }
      &:hover {
        color: white;
      }
    }
    p {
      font-size: 16px;
      color: ${pallette.helperGrey};
      @media (max-width: 450px) {
        font-size: 12px;
      }
    }
    span {
      margin: 0 10px;
      color: white;
    }
  }
`;