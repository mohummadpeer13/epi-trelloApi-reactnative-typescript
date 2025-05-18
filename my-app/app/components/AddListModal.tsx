import React, { useState } from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

interface AddListModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddList: (listName: string) => void;
}

const AddListModal: React.FC<AddListModalProps> = ({ visible, onDismiss, onAddList }) => {
  const [listName, setListName] = useState('');

  const handleAdd = () => {
    if (listName.trim()) {
      onAddList(listName);
      setListName('');
      onDismiss();
    }
  };

  return (
    <Portal>
      <Dialog style={{
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}
            visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Nouvelle liste</Dialog.Title>
        <Dialog.Content>
          <TextInput
          style={globalStyles.input}
            label="Nom de la liste"
            value={listName}
            onChangeText={setListName}
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={onDismiss}>Annuler</Button>
          <Button style={[globalStyles.button, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButton} onPress={handleAdd}>Créer</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AddListModal;
