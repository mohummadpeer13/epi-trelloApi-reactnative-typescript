import React, { useState } from 'react';
import { View } from 'react-native';
import { Dialog, Portal, Button, Text, Checkbox } from 'react-native-paper';
import { assignMembersToCard } from '../services/cardService';
import { globalStyles } from '../styles/globalStyles';

interface BoardMember {
  id: string;
  username: string;
  fullName: string;
}

interface AssignMemberModalProps {
  visible: boolean;
  onClose: () => void;
  boardMembers: BoardMember[];
  cardId: string;
  currentMembers: string[];
  onMembersAssigned: (updatedMembers: string[]) => void;
}

const AssignMemberModal: React.FC<AssignMemberModalProps> = ({
  visible,
  onClose,
  boardMembers,
  cardId,
  currentMembers,
  onMembersAssigned,
}) => {
  const [selectedMembers, setSelectedMembers] = useState<string[]>(currentMembers);

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers((prevSelected) =>
      prevSelected.includes(memberId)
        ? prevSelected.filter((id) => id !== memberId)
        : [...prevSelected, memberId]
    );
  };

  const handleAssignMembers = async () => {
    try {
      await assignMembersToCard(cardId, selectedMembers);
      onMembersAssigned(selectedMembers);
      onClose();
    } catch (error) {
      console.error('Erreur lors de l’assignation des membres:', error);
    }
  };

  return (
    <Portal>
      <Dialog style={{
      backgroundColor: 'white',
      borderRadius: 10,
      overflow: 'hidden',
    }}
    visible={visible} onDismiss={onClose}>
        <Dialog.Title>Assigner des membres</Dialog.Title>
        <Dialog.Content>
          {boardMembers.map((member) => (
            <View key={member.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
              <Checkbox
                status={selectedMembers.includes(member.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleMemberSelection(member.id)}
              />
              <Text>{member.fullName}</Text>
            </View>
          ))}
        </Dialog.Content>
        <Dialog.Actions>
          <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={onClose}>Annuler</Button>
          <Button style={[globalStyles.button, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButton} onPress={handleAssignMembers}>Assigner</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AssignMemberModal;
