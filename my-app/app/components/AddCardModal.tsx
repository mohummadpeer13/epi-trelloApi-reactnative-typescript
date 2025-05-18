import React, { useState } from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

interface AddCardModalProps {
  visible: boolean;
  onDismiss: () => void;
  onAddCard: (cardName: string) => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ visible, onDismiss, onAddCard }) => {
  const [cardName, setCardName] = useState('');

  const handleAdd = () => {
    if (cardName.trim()) {
      onAddCard(cardName);
      setCardName('');
      onDismiss();
    }
  };

  return (
    <Portal>
      <Dialog style={{
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }} visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Nouvelle carte</Dialog.Title>
        <Dialog.Content>
          <TextInput style={globalStyles.input}
            label="Nom de la carte"
            value={cardName}
            onChangeText={setCardName}
            autoFocus
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={onDismiss}>Annuler</Button>
          <Button style={[globalStyles.button, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButton} onPress={handleAdd}>Ajouter</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AddCardModal;
