import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

// styled
import styled from 'styled-components';
//import * as pallette from '../../styled/ThemeVariables';

// components
import BugTable from './components/BugTable.js';
import { ProjectSideNav } from './components/ProjectSideNav';
import { Searchbar } from './components/Searchbar';

// loaders
import ProjectPageLoader from '../../loaders/ProjectPageLoader';

// pop out sections
import CommentSection from './sections/CommentSection';
import BugSection from './sections/BugSection';
import AddBugSection from './sections/AddBugSection';

// images
import arrowRight from '../../assets/icons/arrowRight.png';

// router
import { useParams } from 'react-router-dom';

export default function ProjectPage({ user, role, confirmRole, projectSideNavRef }) {

    const commentSection = useRef();
    const bugSection = useRef();
    const addBugSection = useRef();

    const { projectId, bugId } = useParams();

    const [ bugs, setBugs ] = useState([]);
    const [ project, setProject ] = useState([]);
    const [ rerender, setRerender ] = useState(false);

    // data states
    //const [ totalBugs, setTotalBugs ] = useState([]);
    const [ openBugs, setOpenBugs] = useState([]);
    const [ underwayBugs, setUnderwayBugs ] = useState([]);
    const [ reviewBugs, setReviewBugs ] = useState([]);
    const [ completedBugs, setCompletedBugs ] = useState([]);
    const [ isLoading, setLoading ] = useState(true);

    // bug section states
    const [ sectionBugId, setSectionBugId ] = useState();
    const [ sectionProjectId, setSectionProjectId ] = useState();

    useEffect(() =>{
        function getProject(){
            axios.get(`${process.env.REACT_APP_GET_PROJECT_URL}/${projectId}`)
            .then(function (response){
                setProject(response.data)
                setBugs(response.data.bugs)
                setLoading(false)
               // setTotalBugs(response.data.bugs.length)
                setOpenBugs(response.data.bugs.filter(bugs => bugs.status === "Open"))
                setUnderwayBugs(response.data.bugs.filter(bugs => bugs.status === "Underway"))
                setReviewBugs(response.data.bugs.filter(bugs => bugs.status === "Reviewing"))
                setCompletedBugs(response.data.bugs.filter(bugs => bugs.status === "Completed"))
            })
            .catch(function (error) {
                console.log(error)
            });
        }
        getProject(projectId);
    }, [ projectId, bugId, rerender ]);

    const handleShowComments = () => {
        setRerender(!rerender)
        let section = commentSection.current;
        if (section.style.display === "none") {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    }

    const handleShowBug = () => {
        setRerender(!rerender)
        let section = bugSection.current;
        if (section.style.display === "none") {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    }

    const handleShowAddBug = () => {
        setRerender(!rerender)
        let section = addBugSection.current;
        if (section.style.display === "none") {
            section.style.display = "flex";
        } else {
            section.style.display = "none";
        }
    }

    const handleArrow = () => {
        let element = document.getElementById("arrow");
        element.classList.toggle("rotate");
    }

    const handleShowSideNav = () => {
        let section = projectSideNavRef.current;
        if (section.style.display === "none") {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    }

    return (
        <StyledProjectPage>
            <button id="arrow-button" onClick={() => { handleArrow(); handleShowSideNav();}}><img id="arrow" src={arrowRight} alt="" /></button>
            <ProjectSideNav
                project={project}
                handleShowComments={handleShowComments}
                handleShowAddBugs={handleShowAddBug}
                projectSideNavRef={projectSideNavRef}
            />
            {
                isLoading === true 
                ? <ProjectPageLoader />
                : <div className="bug-table-wrapper">
                    <Searchbar />
                    { 
                        bugs === undefined 
                        ? <div className="undefined">
                            <h1>You've havent entered any bugs</h1>
                        </div>
                        : <>
                            <BugTable
                                setRerender={setRerender}
                                rerender={rerender}
                                user={user}
                                bugs={bugs}
                                openBugs={openBugs}
                                underwayBugs={underwayBugs}
                                reviewBugs={reviewBugs}
                                completedBugs={completedBugs}
                                setSectionProjectId={setSectionProjectId}
                                setSectionBugId={setSectionBugId}
                                projectId={projectId}
                                project={project}
                                handleShowBug={handleShowBug}
                                bugSection={bugSection}
                            />
                        </>
                    }
                </div>
            }
            <CommentSection
                handleShowComments={handleShowComments}
                user={user}
                role={role}
                commentSection={commentSection}
                setRerender={setRerender}
                rerender={rerender}
            />
            <BugSection
                handleShowBug={handleShowBug}
                user={user}
                role={role}
                sectionProjectId={sectionProjectId}
				sectionBugId={sectionBugId}
                bugSection={bugSection}
                setRerender={setRerender}
                rerender={rerender}
            />
            <AddBugSection
                handleShowAddBug={handleShowAddBug}
                user={user}
                role={role}
                projectId={projectId}
                addBugSection={addBugSection}
                confirmRole={confirmRole}
                setRerender={setRerender}
                rerender={rerender}
            />
        </StyledProjectPage>
    )
}

const StyledProjectPage = styled.div`
    height: 100%;
    max-height: 100vh;
    width: 100%;
    max-width: 80vw;
    display: flex;
    position: relative;
    margin-left: 350px;
    @media (max-width: 1440px){
        margin-left: 300px;
    }
    @media (max-width: 810px){
        margin-left: 120px;
        width: 740px;
    }
    @media (max-width: 428px){
        margin-left: 100px;
        width: 340px;
    }
    @media (max-width: 390px){
        width: 320px;
    }
    @media (max-width: 360px){
        width: 295px;
    }
    #arrow-button {
        background: none;
        border: none;
        cursor: pointer;
        display: none;
        position: absolute;
        z-index: 6;
        top: 50%;
        @media (max-width: 810px){
            display: block;
            left: -90px;
        }
        @media (max-width: 428px){
            left: -85px;
        }
        img {
            transition: 0.2s;
            width: 30px;
            height: 30px;
        }   
    }
    .undefined {
        background: white;
        width: 100%;
        min-height: 80vh;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: auto;
    }
    .bug-table-wrapper {
        overflow: scroll;
        scrollbar-width: none;  /* Firefox */
        -ms-overflow-style: none;
        position: relative;
        width: 100vw;
        display: flex;
        &::-webkit-scrollbar {
            display: none;
            width: none;
        }
    }
    .rotate {
        transform: rotate(180deg);
        transition: 0.2s;
    }
`;