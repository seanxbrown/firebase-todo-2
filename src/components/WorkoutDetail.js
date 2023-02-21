import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { AuthContext } from '../contexts/AuthContext'
import { ref, onValue, update} from "firebase/database";
import { database } from '../firebase';
import ExerciseComponent from './ExerciseComponent';
import AddNewExercise from './AddNewExercise';
import { v4 as uuidv4 } from "uuid";
import Exercise from './Exercise';
import DeleteExercise from './DeleteExercise';
import { Button } from "react-bootstrap";
import EditExercise from "./EditExercise";

const WorkoutDetail = () => {
    const [selectedUserWorkout, setSelectedUserWorkout] = useState({})
    const [allUserWorkouts, setAllUserWorkouts] = useState([])
    const [deletingExercise, setDeletingExercise] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState("")
    const [addingNewExercise, setAddingNewExercise] = useState(false);
    const [editing, setEditing] = useState(false)
    const {workoutid} = useParams();
    const user = useContext(AuthContext)

    function getDataForOneWorkout() {
        const dbRef = ref(database, `${user.uid}`);
    
        try {
            onValue(dbRef, snapshot => {
                if (snapshot.val()) {
                    const {workouts: downloadedWorkouts} = snapshot.val()
                    setAllUserWorkouts([...downloadedWorkouts])

                    const selectedWorkout = downloadedWorkouts.filter(downloadedWorkout => downloadedWorkout.id === workoutid)[0]
                    setSelectedUserWorkout(selectedWorkout)
                    } else {
                        setSelectedUserWorkout(selectedUserWorkout => selectedUserWorkout = {})
                }       
            }
                )
        } catch(error) {
            alert(error)
        }    
    }

    function openExerciseDeletionBox(exercise) {
        //This opens the div to confirm deletion of exercise
        setDeletingExercise(true)
    }
    
    function closeExerciseDeletionBox() {
        setDeletingExercise(false)
    
    }
    function openEditBox() {
        setEditing(true)
      }
      
      function closeEditBox() {
        setEditing(false)
      }
      

    function selectExercise(id) {
        setSelectedExercise(id)
    }

    function addExerciseToWorkout(e) {
        e.preventDefault();
        if (selectedUserWorkout === undefined) {
            alert("No workout selected"); 
            return
        }
    
        const newWorkouts = [...allUserWorkouts];
        const exerciseID = uuidv4();
        const exerciseName = document.getElementById("exerciseName").value;
        const exerciseSets = document.getElementById("exerciseSets").value;
        const exerciseReps = document.getElementById("exerciseReps").value;
        const exerciseWeight = document.getElementById("exerciseWeight").value;
        const exercisetTarget = document.getElementById("exercisetTarget").checked;
        const exerciseNotes = document.getElementById("exerciseNotes").value;
        const newExercise = new Exercise(exerciseID, exerciseName, exerciseSets, exerciseReps,`${exerciseWeight}kg`, exercisetTarget, exerciseNotes)
    
        for (let key of newWorkouts) {
            if (key.id === selectedUserWorkout.id) {
                if (key.exercises) {
                    key.exercises.push(newExercise);
                } else {
                    key.exercises = [newExercise];
                }
            }
        }
    
        try {
            update(ref(database, `${user.uid}`), {"workouts": newWorkouts});
            getDataForOneWorkout();
    
        } catch(error) {
            alert(error);
        }
    
        setAddingNewExercise(addingNewExercise => !addingNewExercise)
    }

    //Identify correct workout. Return if no exercises, else remove selected exercise from the selected workout
function removeExerciseFromWorkout(id) {
    const newWorkouts = [...allUserWorkouts];
    for (let workout of newWorkouts) {
        if(selectedUserWorkout.id === workout.id) {
            if (!workout.exercises) {return}
            workout.exercises = workout.exercises.filter(exercise => exercise.id !== id);
        }
    }
    //Also needs to be removed from selected workout, otherwise there will be a display error
    const newSelectedWorkout = {...selectedUserWorkout};
    newSelectedWorkout.exercises = newSelectedWorkout.exercises.filter(exercise => exercise.id !== id);
    setSelectedUserWorkout(newSelectedWorkout);
    
    try {
        update(ref(database, `${user.uid}`), {"workouts": newWorkouts});
        getDataForOneWorkout();

    }catch(error) {
        alert(error);
    }

    setDeletingExercise(false)
}

function toggleNewExerciseStatus() {
    setAddingNewExercise(addingNewExercise => !addingNewExercise);
}

async function handleExerciseUpdate(e) {
    e.preventDefault()
    if (workoutid === undefined) {
        alert("No workout selected"); 
        return
    }

    const newExercise = {...selectedExercise};
    newExercise["name"] = document.getElementById("exerciseName").value;
    newExercise["sets"] = document.getElementById("exerciseSets").value;
    newExercise["reps"] = document.getElementById("exerciseReps").value;
    newExercise["weight"] = document.getElementById("exerciseWeight").value;
    newExercise["target"] = document.getElementById("exercisetTarget").checked;
    newExercise["notes"] = document.getElementById("exerciseNotes").value;
    //console.log(newExercise)

    const newWorkouts = [...allUserWorkouts]
    for (let newWorkout of newWorkouts) {
        if (newWorkout.exercises) {
            newWorkout.exercises = newWorkout.exercises.map(newWorkoutExercise => {
                return newWorkoutExercise.id === newExercise.id ?
                newWorkoutExercise = { ... newExercise}
                : newWorkoutExercise = {...newWorkoutExercise}
            })
        }
    }

    try {
        await update(ref(database, `${user.uid}`), {"workouts": newWorkouts});

    } catch(error) {
        alert(error);
    }
    setEditing(false)
}


    useEffect(() => {

        getDataForOneWorkout()

    }, [])

  return (
    <div className="text-dark position-relative">
        <h2 className="fw-bold py-4 text-center">{selectedUserWorkout && selectedUserWorkout.title}</h2>
        <div className="d-flex gap-4 mb-3" id="exerciseTitleButtonContainer">
            <h3 className="fw-bold">Exercises</h3>
            <Button type="button" onClick={toggleNewExerciseStatus} className="btn btn-primary align-self-center mb-3 rounded-pill text-center">Add New Exercise</Button>
         </div>
        {addingNewExercise && <AddNewExercise selectedWorkout={selectedUserWorkout} addExerciseToWorkout={addExerciseToWorkout} toggleNewExerciseStatus={toggleNewExerciseStatus}/> }
        {deletingExercise && <DeleteExercise selectedExercise={selectedExercise} removeExerciseFromWorkout={removeExerciseFromWorkout} closeExerciseDeletionBox={closeExerciseDeletionBox}/>}
        {editing && <EditExercise selectedExercise={selectedExercise} closeEditBox={closeEditBox} handleExerciseUpdate={handleExerciseUpdate}/>}
        {selectedUserWorkout && selectedUserWorkout.exercises && selectedUserWorkout.exercises.length > 0 ? 
            selectedUserWorkout.exercises.map(exercise => 
            <ExerciseComponent 
                selectExercise={selectExercise} 
                openExerciseDeletionBox={openExerciseDeletionBox} 
                removeExerciseFromWorkout={removeExerciseFromWorkout}
                handleExerciseUpdate={handleExerciseUpdate} 
                openEditBox={openEditBox}
                key={exercise.id} exercise={exercise}/>) 
                : <h3 className="fw-bold text-center">No exercise selected.</h3>
        }
        <Link to={`/firebase-exercise/dashboard`}>Return to dashboard</Link>
    </div>
  )
}

export default WorkoutDetail