import React from 'react';
import { Modal, Button } from 'react-bootstrap';

interface Props {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    orderName: string;
}

function ConfirmDeleteModal({ show, onClose, onConfirm, orderName }: Props) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Удаление прихода</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Вы уверены, что хотите удалить этот приход?</p>
        <strong className="d-block mb-3">{orderName}</strong>
        <div className="text-secondary small">Все продукты, связанные с этим приходом, также будут удалены.</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          ОТМЕНИТЬ
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          УДАЛИТЬ
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmDeleteModal;
