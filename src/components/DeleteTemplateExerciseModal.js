import { Container, Button } from "react-bootstrap"

const DeleteTemplateExerciseModal = ({selectedTemplateExercise, closeTemplateExerciseDeletionBox, removeExerciseFromTemplate}) => {

  return (
    <Container className="bg-danger bg-gradient border-dark rounded p-4 w-50 shadow-lg position-absolute top-50 start-50 translate-middle" id="deleteExerciseBox">
        <p className="text-dark text-center">Delete this exercise?</p>
        <div id="deleteConfirmationButtonContainer" className="d-flex justify-content-around w-50 gap-4 m-auto">
            <Button type="button" variant="dark" onClick={() => removeExerciseFromTemplate(selectedTemplateExercise.id)} >Yes</Button>
            <Button type="button" variant="dark" onClick={closeTemplateExerciseDeletionBox}>No</Button>
        </div>
    </Container>
  )
}

export default DeleteTemplateExerciseModal