import React, { useState } from 'react';
import { Dialog, Portal, Button, TextInput } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  boardId: string;
  onMemberAdded: () => Promise<void>;
  addMemberToBoard: (boardId: string, email: string) => Promise<void>;
}

const AddMemberModal: React.FC<AddMemberModalProps> = (props) => {
  const [newMemberEmail, setNewMemberEmail] = useState('');

  return (
    <Portal>
      <Dialog style={{
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}
            visible={props.visible} onDismiss={props.onClose}>
        <Dialog.Title>Ajouter un membre</Dialog.Title>
        <Dialog.Content>
          <TextInput
          style={globalStyles.input}
            label="Email du membre"
            value={newMemberEmail}
            onChangeText={setNewMemberEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </Dialog.Content>
        <Dialog.Actions>
          
          <Button
            mode="contained"
             style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse}
            onPress={async () => {
              try {
                await props.addMemberToBoard(props.boardId, newMemberEmail);
                setNewMemberEmail('');
                await props.onMemberAdded();
                props.onClose();
              } catch (error) {
                console.error("Erreur lors de l'ajout du membre :", error);
              }
            }}
          >
            Ajouter
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AddMemberModal;
