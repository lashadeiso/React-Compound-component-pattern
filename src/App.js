import "./styles.css";
import Modal from "./ui/Modal";
import Button from "./ui/Button";
import GlobalStyles from "./styles/GlobalStyles";
import CreateForm from "./features/CreateForm";
import TableFrom from "./features/TableFrom";

function App() {
  return (
    <>
      <GlobalStyles />
      <Modal>
        {/* მოდალი 1 */}
        <Modal.Open modalName="modal-1">
          <Button>Modal 1</Button>
        </Modal.Open>
        <Modal.Window windowName="modal-1">
          <CreateForm />
        </Modal.Window>

        {/* მოდალი 2 */}
        <Modal.Open opens="modal-2">
          <Button>Modal 2</Button>
        </Modal.Open>
        <Modal.Window window="window-2">
          <TableFrom />
        </Modal.Window>
      </Modal>
    </>
  );
}

export default App;
