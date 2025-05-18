import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import { Card, FAB, Text, Button, Dialog, Portal, TextInput, Provider, IconButton, Checkbox } from 'react-native-paper';
import { fetchBoardListsAndCards, addCardToList, deleteCardFromList, updateCard, assignMembersToCard, fetchBoardMembers, fetchCardMembers, addMemberToBoard } from '../services/cardService';
import UserNavbar from '../components/UserNavbar';
import GradientBackground from '../components/GradientBackground';

import { createList, archiveList, updateList } from '../services/listService';

import AddMemberModal from '../components/AddMemberModal';
import AssignMemberModal from '../components/AssignMemberModal';

import AddCardModal from '../components/AddCardModal';
import EditCardModal from '../components/EditCardModal';
import DeleteCardModal from '../components/DeleteCardModal';

import AddListModal from '../components/AddListModal';
import EditListModal from '../components/EditListModal';
import ArchiveListModal from '../components/ArchiveListModal';
import { globalStyles } from '../styles/globalStyles';

const screenWidth = Dimensions.get('window').width;

interface CardsPageProps {
  route: {
    params: {
      boardId: string;
      boardName: string;
    };
  };
}

interface TrelloCard {
  id: string;
  name: string;
  idMembers?: [];
  cover?: {
    color?: string;
  };
}

interface TrelloList {
  id: string;
  name: string;
  color?: string;
  cards: TrelloCard[];
}

interface BoardMember {
  id: string;
  username: string;
  fullName: string;
}

const Cards: React.FC<CardsPageProps> = ({ route }) => {
  const { boardId, boardName } = route.params;

  const [loading, setLoading] = useState<boolean>(true);

  const [cardToDelete, setCardToDelete] = useState<TrelloCard | null>(null);
  const [cardToEdit, setCardToEdit] = useState<TrelloCard | null>(null);

  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  const [addCardDialogVisible, setAddCardDialogVisible] = useState<boolean>(false);
  const [editCardDialogVisible, setEditCardDialogVisible] = useState<boolean>(false);
  const [deleteCardDialogVisible, setDeleteCardDialogVisible] = useState<boolean>(false);

  const [createListDialogVisible, setCreateListDialogVisible] = useState<boolean>(false);
  const [editListDialogVisible, setEditListDialogVisible] = useState<boolean>(false);
  const [archiveListDialogVisible, setArchiveListDialogVisible] = useState<boolean>(false);

  const [assignMemberDialogVisible, setAssignMemberDialogVisible] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [editedCardName, setEditedCardName] = useState<string>('');
  const [editedListName, setEditedListName] = useState<string>('');

  const [lists, setLists] = useState<TrelloList[]>([]);
  const [listToArchive, setListToArchive] = useState<TrelloList | null>(null);
  const [listToEdit, setListToEdit] = useState<TrelloList | null>(null);

  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [cardMembers, setCardMembers] = useState<{ [key: string]: BoardMember[] }>({});

  const loadBoardMembers = async () => {
    try {
      const members = await fetchBoardMembers(boardId);
      setBoardMembers(members);
    } catch (error) {
      console.error('Erreur lors du chargement des membres du board:', error);
    }
  };

  const loadBoardDetails = async () => {
    try {
      const data = await fetchBoardListsAndCards(boardId);
  
      if (data && Array.isArray(data.lists)) {
        setLists(data.lists);
      } else {
        setLists([]);
      }
  
      if (data.lists && Array.isArray(data.lists)) {
        data.lists.forEach((list) => {
          if (list.cards && Array.isArray(list.cards)) {
            list.cards.forEach((card: TrelloCard) => {
              if (card.id) {
                loadCardMembers(card.id);
              }
            });
          }
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des listes et cartes:', error);
    }
  };
  
  {/* récupére les membres assignés à une carte */ }
  const loadCardMembers = async (cardId: string) => {
    try {
      const members = await fetchCardMembers(cardId);
      setCardMembers((prevMembers) => ({ ...prevMembers, [cardId]: members }));
    } catch (error) {
      console.error('Erreur lors de la récupération des membres de la carte:', error);
    }
  };

  {/* modifié une liste */ }
  const handleSaveEditedList = async (id: string, newName: string) => {
    if (!newName.trim()) return;
    try {
      await updateList(id, newName);
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === id ? { ...list, name: newName } : list
        )
      );
      setEditListDialogVisible(false);
      setListToEdit(null);
    } catch (error) {
      console.error('Erreur lors de la modification de la liste:', error);
    }
  };

  {/* archivé une liste */ }
  const handleArchiveList = async () => {
    if (!listToArchive) return;

    try {
      await archiveList(listToArchive.id);
      setLists((prevLists) => prevLists.filter((list) => list.id !== listToArchive.id));
      setArchiveListDialogVisible(false);
      setListToArchive(null);
    } catch (error) {
      console.error("Erreur lors de l'archivage de la liste:", error);
    }
  };

  {/* ajouté une liste */ }
  const handleCreateList = async (newListName: string) => {
    if (!newListName.trim()) return;
    try {
      const newList = await createList(newListName, boardId);
      setLists([...lists, newList]);
    } catch (error) {
      console.error("Erreur lors de la création de la liste :", error);
    }
  };

  {/* ajouté une carte */ }
  const handleAddCard = async (cardName: string) => {
    if (!cardName.trim() || !selectedListId) return;
    try {
      await addCardToList(selectedListId, cardName);
      loadBoardDetails();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la carte :", error);
    }
  };

  {/* modifié une carte */ }
  const handleSaveEditedCard = async (newName: string) => {
    if (!newName.trim() || !cardToEdit) return;
    try {
      await updateCard(cardToEdit.id, newName);
      loadBoardDetails();
      setEditCardDialogVisible(false);
      setCardToEdit(null);
    } catch (error) {
      console.error('Erreur lors de la modification de la carte:', error);
    }
  };

  {/* supprimé une carte */ }
  const confirmDeleteCard = async (): Promise<void> => {
    try {
      if (cardToDelete) {
        await deleteCardFromList(cardToDelete.id);
        loadBoardDetails();
        setDeleteCardDialogVisible(false);
        setCardToDelete(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la carte:', error);
    }
  };


  useEffect(() => {
    loadBoardDetails();
    loadBoardMembers();
  }, [boardId]);

  useEffect(() => {
    if (lists && lists.length > 0 && Object.keys(cardMembers).length === 0) {
      lists.forEach((list) => {
        if (list.cards && list.cards.length > 0) {
          list.cards.forEach((card) => {
            loadCardMembers(card.id);
          });
        }
      });
    }
  }, [lists, cardMembers]);


  return (
    <Provider>
      <GradientBackground>
      <View style={{ flex: 1, padding: 12}}>
        <UserNavbar />

        <Text variant="headlineLarge" style={{ fontSize: 20, textAlign: 'center' }}>
          Tableaux : {boardName.toUpperCase()}
        </Text>

        <Button mode="contained" style={{ marginTop: 10 }} onPress={() => setModalVisible(true)}>
          Ajouter un membre
        </Button>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : lists && lists.length > 0 ? (
          <FlatList
            data={lists}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
            renderItem={({ item }) => (
              <View style={{ width: screenWidth * 0.8, marginRight: 16 }}>
                <Card style={{ padding: 10, backgroundColor: item.color || '#dfe3e6' }}>

                  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>
                    {item.name}
                  </Text>

                  {item.cards && Array.isArray(item.cards) ? (
                    item.cards.map((card) => (
                      <View key={card.id || `card-${card.name}`} style={{ marginBottom: 8 }}>
                        {/* Si la carte a une couleur définie, l'afficher au-dessus de la carte */}
                        {card.cover?.color && (
                          <View
                            style={{
                              height: 10,
                              backgroundColor: card.cover.color, // Couleur de la carte
                              marginBottom: 4,
                            }}
                          />
                        )}

                        {/* Affichage de la carte */}
                        <Card
                          style={{
                            marginBottom: 8,
                            padding: 10,
                            backgroundColor: '#ffffff', // Utilise la couleur de la carte ou un blanc par défaut
                            borderRadius: 4,
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ flex: 1 }}>{card.name}</Text>
                            <IconButton
                              icon="account"
                              size={18}
                              onPress={() => {
                                setCardToEdit(card);
                                loadCardMembers(card.id);
                                setAssignMemberDialogVisible(true);
                              }}
                            />
                            <IconButton
                              icon="pencil"
                              size={18}
                              onPress={() => {
                                setCardToEdit(card);
                                setEditedCardName(card.name);
                                setEditCardDialogVisible(true);
                              }}
                            />

                            <IconButton
                              icon="delete"
                              size={18}
                              onPress={() => {
                                setCardToDelete(card);
                                setDeleteCardDialogVisible(true);
                              }}
                            />
                          </View>
                          {/* Affichez les membres assignés à la carte */}
                          {cardMembers[card.id] && cardMembers[card.id].length > 0 ? (
                            <View>
                              <Text>Membres assignés :</Text>
                              {cardMembers[card.id].map((member) => (
                                <Text key={member.id}>{member.fullName}</Text>
                              ))}
                            </View>
                          ) : (
                            <Text>Aucun membre assigné</Text>
                          )}
                        </Card>
                      </View>
                    ))
                  ) : null}

                  <Button onPress={() => { setSelectedListId(item.id); setAddCardDialogVisible(true); }}>+ Ajouter une carte</Button>
                  <Button onPress={() => { setListToEdit(item); setEditedListName(item.name); setEditListDialogVisible(true); }}>Modifier la liste</Button>
                  <Button onPress={() => { setListToArchive(item); setArchiveListDialogVisible(true); }}>Archiver la liste</Button>
                
                </Card>
              </View>
            )}
          />
        ) : (
          <Text>Aucune liste trouvée</Text>
        )}

        <FAB icon="plus"  style={globalStyles.fab} onPress={() => { setCreateListDialogVisible(true);}}/>

        {/* Modale pour ajouté une liste */}
        <AddListModal
          visible={createListDialogVisible}
          onDismiss={() => setCreateListDialogVisible(false)}
          onAddList={handleCreateList}
        />

        {/* Modale pour modifié une liste */}
        <EditListModal
          visible={editListDialogVisible}
          onClose={() => setEditListDialogVisible(false)}
          listToEdit={listToEdit}
          onSave={handleSaveEditedList}
        />

        {/* Modale pour archivé une liste */}
        <ArchiveListModal
          visible={archiveListDialogVisible}
          onDismiss={() => setArchiveListDialogVisible(false)}
          onArchive={handleArchiveList}
        />

        {/* Modale pour ajouté un membre à une carte */}
        <AddMemberModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          boardId={boardId}
          onMemberAdded={loadBoardMembers}
          addMemberToBoard={addMemberToBoard}
        />

        {/* Modale pour ajouté une carte */}
        <AddCardModal
          visible={addCardDialogVisible}
          onDismiss={() => setAddCardDialogVisible(false)}
          onAddCard={handleAddCard}
        />

        {/* Modale pour modifié une carte */}
        <EditCardModal
          visible={editCardDialogVisible}
          onDismiss={() => setEditCardDialogVisible(false)}
          cardName={editedCardName}
          onSave={handleSaveEditedCard}
        />

        {/* Modale pour supprimé une carte */}
        <DeleteCardModal
          visible={deleteCardDialogVisible}
          onDismiss={() => setDeleteCardDialogVisible(false)}
          onDelete={confirmDeleteCard}
        />

        {/* Modale pour assigné un membre à une carte  */}
        <AssignMemberModal
          visible={assignMemberDialogVisible}
          onClose={() => setAssignMemberDialogVisible(false)}
          boardMembers={boardMembers}
          cardId={cardToEdit?.id || ''}
          currentMembers={cardToEdit?.idMembers || []}
          onMembersAssigned={() => {
            loadBoardDetails();
          }}
        />

      </View>
      </GradientBackground>
    </Provider>
  );
};

export default Cards;
