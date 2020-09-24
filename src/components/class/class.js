import React,{useState,useEffect,useRef} from "react"
import {Link} from "react-router-dom"
import "./class.css"
import "../../global/global.css"
import plus from "../../images/plus.svg"
import bin from "../../images/bin.png"
import pen from "../../images/pencil 1.png"
import cross from "../../images/close.png"
import bell from "../../images/alarm-bell@3x.png"
import logo from "../../images/Logo.png"
import search from "../../images/search.png"
import axios from "axios"
import spinner from "../../images/spinner.gif"


const Classes = (props) => {

    const [modalOut, setModalOut] = useState(false)
    const [classes,setClasses] = useState([])   
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState([])
    const [editModalOut,setEditModalOut] = useState(false)
    const [editCourseId,setEditCourseId] = useState("")
    const [classData, setClassData] = useState(
        {
            name: "",
            Courses: "",
            Population: "",
            Meeting: "",
            UnavailableRooms: ""
        }
    )

    const [labelData, setLabelData] = useState(
        {
            nameLabel: "",
            courseLabel: "",
            meetingLabel: "",
            populationLabel: "",
            uarLabel: ""
        }
    );

    // setting key for edit form
    const [id, setId] = useState("123");

    const classFormData = (e) => {
        setClassData({
            ...classData,
            [e.target.name]: e.target.value.trim()
        })
        console.log(classData)
    }


    // For cancelling requests
    const source = axios.CancelToken.source();

    // Create Classes
    const createClass = () => {
        let data = JSON.stringify(classData);

        let config = {
        method: 'post',
        url: 'https://tbe-node-deploy.herokuapp.com/Admin/class/create',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios(config)
        .then((response) => {
        console.log(JSON.stringify(response.data));
        })
        .then(()=> getClasses())
        .catch((error) => {
        console.log(error);
        });
    }

    // Get classes
    const getClasses = () => {
        let config = {
        method: 'get',
        url: 'https://tbe-node-deploy.herokuapp.com/Admin/class/all',
        headers: { },
        cancelToken: source.token
        };

        axios(config)
        .then((response) => {
            setClasses(response.data.data)
            setLoading(true)
        })
        .catch((error) => {
        console.log(error);
        });

    }

    const fetchCourses = () => {
        let config = {
            method: 'get',
            url: 'https://tbe-node-deploy.herokuapp.com/Admin/getCourse',
            headers: { },
            cancelToken: source.token
        };
        
        axios(config)
        .then((response) => {
            var res = response.data.data
            console.log(res)
            setCourses(res)
            setLoading(true)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getClasses()
        fetchCourses()
        return () => {
            source.cancel("Component got unmounted");
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    // Delete class
    const deleteClass = (data) => {
        let config = {
            method: 'delete',
            url: 'https://tbe-node-deploy.herokuapp.com/Admin/class/delete',
            headers: { 
              '_id': data
            }
          };
          
          axios(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });
          
    }

    // Remove empty inputs in edit form obj
    const cleanObj = () => {
        Object.keys(classData).forEach((key) => (classData[key] === "") && delete classData[key]);
    }

    // Edit class
    const editClass = () => {
        let data = JSON.stringify(classData);

        let config = {
        method: 'patch',
        url: 'https://tbe-node-deploy.herokuapp.com/Admin/class/update',
        headers: { 
            '_id': editCourseId, 
            'Content-Type': 'application/json'
        },
        data : data
        };

        axios(config)
        .then((response) => {
        console.log(JSON.stringify(response.data));
        })
        .then(()=> getClasses())
        .catch((error) => {
        console.log(error);
        });

    }

    // Generating form labels for edit
    const genFormLabels = (data) => {
        // eslint-disable-next-line array-callback-return
        classes.map((clas) => {
                if(clas._id === data){
                    setLabelData({
                        ...labelData,
                        nameLabel: clas.name,
                        courseLabel: clas.Courses[0].name,
                        meetingLabel: clas.Meeting,
                        populationLabel: clas.Population,
                        uarLabel: clas.UnavailableRooms
                    })
                }
            })
    }

    // Filtering
    const onChangeHandler = () =>{
        console.log(textInput.current.value)
        getClasses()
    }

    const textInput = useRef(null)


    return (
        <>
            <header>
                  <div>
                    <img src={logo} className="logo" alt="logo"/>
                    <p>Classes</p>
                  </div>
                  <div className="navMobile"> 
                    <Link to="/app/notification">
                            <img src={bell} alt="bell"/>
                    </Link>
                  </div>
            </header>
            <div className="section">
                <div className="search-container">
                    <img src={search} className="search" alt="search" onClick={()=> onChangeHandler()}/>
                    <input placeholder="Enter keyword to search" ref={textInput}/>
                    <button onClick={()=>{
                        setModalOut(!modalOut);
                    }}><img src={plus} alt="plus"/>Add new class</button>
                </div>
                <div className="table-container">
                    <table className="table">
                    <thead className="table-head">
                        <tr className="row1">
                        <th>Name</th>
                        <th>Class size</th>
                        <th>Course</th>
                        <th>Unavailable Rooms</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="gfg">
                       {loading === true ? classes
                       .filter(d=> {
                        return d.name.toLowerCase().includes(textInput.current.value.toLowerCase()) === true
                        })
                       .map((clas) => {
                               return (
                                <tr className="default" key={clas._id}>
                                <td>{clas.name}</td>
                                <td>{clas.Population}</td>
                                <td>{clas.Courses[0].name}</td>
                                <td>{clas.UnavailableRooms}</td>
                                <td>
                                    <img
                                    src={pen}
                                    alt="pencil"
                                    className="pencil"
                                    onClick={() => {
                                        setEditModalOut(true)
                                        setEditCourseId(clas._id)
                                        genFormLabels(clas._id)
                                        setId(Math.random().toString())
                                    }}
                                    />
                                    <img
                                    src={bin}
                                    alt="bin"
                                    className="bin"
                                    onClick={()=> deleteClass(clas._id)}
                                    />
                                </td>
                                </tr>
                               );
                           }
                       ) : <tr><td colSpan="5"><img src={spinner} className="spinner" alt="Spinner"/></td></tr>}
                    </tbody>
                    </table>
                </div>

                <div className={modalOut === true ? "overlay modOut" : "overlay"}
                onClick={()=>{
                    setModalOut(!modalOut);
                }}></div>

                {/* Create class form */}
                <div className={modalOut === true ? "modal modalClass modOut" : "modal modalClass"}>
                    <div className="head">
                        <h3>Add new class</h3>
                        <img src={cross} alt="cross" onClick={()=>{
                        setModalOut(!modalOut);
                    }}/>
                    </div>
                    <div className="input-c">
                        <div className="input-g">
                            <p>Name</p>
                            <input name="name" onChange={classFormData}/>
                        </div>
                        <div className="input-g">
                                <p>Course</p>
                                <select className="select-css" name="Courses" onChange={classFormData}>
                                    <option value="" defaultValue>Select a course</option>
                                    {courses.map(course => {
                                        return(
                                        <option value={course._id} label={course.name} key={course._id}/>
                                    )})}
                                </select>
                        </div>
                        <div className="input-sub-group">
                            <div className="input-g2">
                                <p>Meeting</p>
                                <input name="Meeting" onChange={classFormData}/>
                            </div>
                            <div className="input-g2">
                                <p>Population</p>
                                <input name="Population" onChange={classFormData}/>
                            </div>
                        </div>
                        <div className="input-g">
                            <p>Unavailable lecture rooms</p>
                            <input name="UnavailableRooms" onChange={classFormData}/>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="red" onClick={()=> setEditModalOut(false)}>Cancel</button>
                        <button className="blue" onClick={(e)=> {
                            classFormData(e)
                            setEditModalOut(false)
                            createClass()
                        }}>
                            Add course
                        </button>
                    </div>
                </div>

                {/* Edit class form */}
                <div className={editModalOut === true ? "modal modalClass modOut" : "modal modalClass"} key={id}>
                    <div className="head">
                        <h3>Edit class</h3>
                        <img src={cross} alt="cross" onClick={()=>{
                        setEditModalOut(false);
                    }}/>
                    </div>
                    <div className="input-c">
                        <div className="input-g">
                            <p>Name</p>
                            <input name="name" onChange={classFormData} placeholder={labelData.nameLabel}/>
                        </div>
                        <div className="input-g">
                                <p>Course</p>
                                <select className="select-css" name="Courses" defaultValue={labelData.courseLabel} onChange={classFormData}>
                                    <option value={labelData.courseLabel} disabled>{labelData.courseLabel}</option>
                                    {courses.map(course => {
                                        return(
                                        <option value={course._id} label={course.name} key={course._id}/>
                                    )})}
                                </select>
                        </div>
                        <div className="input-sub-group">
                            <div className="input-g2">
                                <p>Meeting</p>
                                <input name="Meeting" onChange={classFormData} placeholder={labelData.meetingLabel}/>
                            </div>
                            <div className="input-g2">
                                <p>Population</p>
                                <input name="Population" onChange={classFormData} placeholder={labelData.populationLabel}/>
                            </div>
                        </div>
                        <div className="input-g">
                            <p>Unavailable lecture rooms</p>
                            <input name="UnavailableRooms" onChange={classFormData} placeholder={labelData.uarLabel}/>
                        </div>
                    </div>
                    <div className="buttons">
                        <button className="red" onClick={()=> setEditModalOut(false)}>Cancel</button>
                        <button className="blue" onClick={(e)=> {
                            classFormData(e)
                            cleanObj()
                            setEditModalOut(false)
                            editClass()
                        }}>
                            Edit class
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Classes;