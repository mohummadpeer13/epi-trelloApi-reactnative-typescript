import React from 'react';
import { Dialog, Portal, Button, Text } from 'react-native-paper';

interface DeleteCardModalProps {
  visible: boolean;
  onDismiss: () => void;
  onDelete: () => void;
}

const DeleteCardModal: React.FC<DeleteCardModalProps> = ({ visible, onDismiss, onDelete }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Confirmation</Dialog.Title>
        <Dialog.Content>
          <Text>Voulez-vous vraiment supprimer cette carte ?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Annuler</Button>
          <Button onPress={onDelete} mode="contained" buttonColor="red">
            Supprimer
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default DeleteCardModal;
