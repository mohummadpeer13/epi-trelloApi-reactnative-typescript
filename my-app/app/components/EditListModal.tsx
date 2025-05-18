import React, { useState, useEffect } from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

interface EditListModalProps {
  visible: boolean;
  onClose: () => void;
  listToEdit: { id: string; name: string } | null;
  onSave: (id: string, newName: string) => void;
}

const EditListModal: React.FC<EditListModalProps> = (props) => {
  const [editedListName, setEditedListName] = useState<string>('');

  // Met à jour la valeur de `editedListName` chaque fois que la `listToEdit` change
  useEffect(() => {
    if (props.listToEdit) {
      setEditedListName(props.listToEdit.name);
    }
  }, [props.listToEdit]);

  return (
    <Portal>
      <Dialog style={{
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }} visible={props.visible} onDismiss={props.onClose}>
        <Dialog.Title>Modifier la liste</Dialog.Title>
        <Dialog.Content>
          <TextInput
           style={globalStyles.input}
            label="Nom de la liste"
            value={editedListName}
            onChangeText={setEditedListName}
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={props.onClose}>Annuler</Button>
          <Button  style={[globalStyles.button, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButton} onPress={() => {
            if (props.listToEdit) {
                props.onSave(props.listToEdit.id, editedListName);
            }
          }}>Enregistrer</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default EditListModal;
