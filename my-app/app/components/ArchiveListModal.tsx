import React from 'react';
import { Dialog, Button, Text } from 'react-native-paper';
import { globalStyles } from '../styles/globalStyles';

interface ArchiveListModalProps {
  visible: boolean;
  onDismiss: () => void;
  onArchive: () => void;
}

const ArchiveListModal: React.FC<ArchiveListModalProps> = ({ visible, onDismiss, onArchive }) => {
  return (
    <Dialog style={{
      backgroundColor: 'white',
      borderRadius: 10,
      overflow: 'hidden',
    }}
    visible={visible} onDismiss={onDismiss}>
      <Dialog.Title>Confirmation d'archivage</Dialog.Title>
      <Dialog.Content>
        <Text>Voulez-vous vraiment archiver cette liste ? Cette action ne peut pas être annulée.</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={onDismiss}>Annuler</Button>
        <Button style={[globalStyles.button, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButton} onPress={onArchive}>Archiver</Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default ArchiveListModal;
