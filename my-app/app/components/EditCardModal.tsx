import React, { useState, useEffect } from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';

interface EditCardModalProps {
  visible: boolean;
  onDismiss: () => void;
  cardName: string;
  onSave: (newName: string) => void;
}

const EditCardModal: React.FC<EditCardModalProps> = ({ visible, onDismiss, cardName, onSave }) => {
  const [editedCardName, setEditedCardName] = useState(cardName);

  useEffect(() => {
    setEditedCardName(cardName);
  }, [cardName]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Modifier la carte</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nom de la carte"
            value={editedCardName}
            onChangeText={setEditedCardName}
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Annuler</Button>
          <Button onPress={() => onSave(editedCardName)}>Enregistrer</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EditCardModal;
