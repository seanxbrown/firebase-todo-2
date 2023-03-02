import { Container, Button } from "react-bootstrap";

const DeleteTemplateModal = ({template, closeDeleteTemplateModal, deleteTemplate }) => {

  return (
    <Container className="bg-danger bg-gradient rounded p-4 position-absolute top-50 start-50 translate-middle w-50" id="deleteWorkoutBox">
        <p className="text-dark text-center">Delete "{template.name}"?</p>
        <div id="deleteConfirmationButtonContainer" className="d-flex justify-content-around w-50 gap-4 m-auto">
            <Button type="button" variant="dark" onClick={() => deleteTemplate(template.id)}>Yes</Button>
            <Button type="button" variant="dark" onClick={closeDeleteTemplateModal}>No</Button>
        </div>
    </Container>
  )
}

export default DeleteTemplateModal