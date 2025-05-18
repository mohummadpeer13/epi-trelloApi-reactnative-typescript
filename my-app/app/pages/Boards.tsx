import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Image, TouchableWithoutFeedback } from 'react-native';
import { Card, Text, Button, FAB, TextInput, Dialog, Portal, Provider, Menu, IconButton } from 'react-native-paper';
import { fetchBoards, createBoard, editBoard, deleteBoard } from '../services/boardService';
import { useNavigation } from '@react-navigation/native';
import UserNavbar from '../components/UserNavbar';
import { globalStyles } from '../styles/globalStyles';
import GradientBackground from '../components/GradientBackground';

type NavigationProp = {
  navigate: (screen: string, params: { boardId: string; boardName: string }) => void;
};

interface BoardsPageProps {
  route: {
    params: {
      orgId: string;
      orgName: string;
    };
  };
}

interface Board {
  id: string;
  name: string;
  desc: string;
  prefs?: {
    backgroundImage?: string;
    backgroundColor?: string;
  };
}

type BoardTemplate = "standard" | "kanban" | "agile";

interface NewBoard {
  name: string;
  desc: string;
  template: BoardTemplate;
}

interface Modals {
  add: boolean;
  edit: boolean;
  delete: boolean;
  menu: boolean;
}

const Boards: React.FC<BoardsPageProps> = ({ route }) => {
  const { orgId, orgName } = route.params;
  const navigation = useNavigation<NavigationProp>();

  const [modals, setModals] = useState<Modals>({ add: false, edit: false, delete: false, menu: false });

  const [newBoard, setNewBoard] = useState<NewBoard>({ name: '', desc: '', template: 'standard' });
  const [boardToEdit, setBoardToEdit] = useState<Board | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const validTemplates: BoardTemplate[] = ["standard", "kanban", "agile"];

  const loadBoards = async (): Promise<Board[]> => {
    try {
      const data = await fetchBoards(orgId);
      setBoards(data);
      return data;
    } catch (error) {
      console.error('Erreur lors du chargement des boards:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoards();
  }, [orgId]);


  const handleAddBoard = async (): Promise<void> => {
    try {
      await createBoard(newBoard.name, newBoard.desc, orgId, newBoard.template);
      setNewBoard({ name: '', desc: '', template: 'standard' });
      setModals({ ...modals, add: false });
      loadBoards();
    } catch (error) {
      console.error('Erreur lors de la création du board:', error);
    }
  };

  const handleEditBoard = async (): Promise<void> => {
    if (boardToEdit) {
      try {
        await editBoard(boardToEdit.id, newBoard.name, newBoard.desc);
        setModals({ ...modals, edit: false });
        setBoardToEdit(null);
        loadBoards();
      } catch (error) {
        console.error('Erreur lors de la modification du board:', error);
      }
    }
  };

  const handleDeleteBoard = async (): Promise<void> => {
    if (boardToEdit) {
      try {
        await deleteBoard(boardToEdit.id);
        setModals({ ...modals, delete: false });
        setBoardToEdit(null);
        loadBoards();
      } catch (error) {
        console.error('Erreur lors de la suppression du board:', error);
      }
    }
  };

  return (
    <Provider>
      <GradientBackground>
        <View style={globalStyles.container}>
          <UserNavbar />
          <Text style={globalStyles.title}>Espace de travail : {orgName.toUpperCase()}</Text>
          <Text style={globalStyles.subtitle}>VOS TABLEAUX</Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={boards}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={() => navigation.navigate('Cards', { boardId: item.id, boardName: item.name })}>


                   <Card style={globalStyles.card}>

                      <Card.Content style={{ flexDirection: 'row' }}>
                      
                          <View style={{ flexDirection: 'row' }}>
                            {item.prefs?.backgroundImage ? (
                              <Image source={{ uri: item.prefs.backgroundImage }} style={{ width: 50, height: 50, borderRadius: 8 }} />
                            ) : (
                              <View style={{ width: 50, height: 50, backgroundColor: item.prefs?.backgroundColor || '#ccc', borderRadius: 8 }} />
                            )}
                            <View style={{}}>
                              <Text style={{ paddingLeft: 10, fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text>
                              <Text style={{ paddingLeft: 10 }}>{item.desc ? item.desc : 'Aucune description'}</Text>
                            </View>
                          </View>

                          <View style={[globalStyles.iconButtonStyle, { marginLeft:15 }]}>
                            <IconButton
                              icon="pencil"
                              size={15}
                              onPress={() => {
                                setBoardToEdit(item);
                                setNewBoard({ name: item.name, desc: item.desc || '', template: 'standard' });
                                setModals({ ...modals, edit: true });
                              }}/>
                          </View>

                          <View style={[globalStyles.iconButtonStyle, { marginLeft:15 }]}>
                            <IconButton
                              icon="delete"
                              size={15}
                              onPress={() => {
                                setBoardToEdit(item);
                                setModals({ ...modals, delete: true });
                              }}/>
                          </View>

                      </Card.Content>

                       <Card.Actions style={{ justifyContent: 'flex-start' }}>
                                          <Button
                                            mode="contained"
                                            onPress={() => navigation.navigate('Cards', { boardId: item.id, boardName: item.name })}
                                            style={[globalStyles.button, { width: '100%', marginTop:15 }]}
                                            labelStyle={globalStyles.labelButton}
                                          >
                                            Acceder aux cartes
                                          </Button>
                                        </Card.Actions>
                  </Card>
                </TouchableWithoutFeedback>
              )}
            />

          )}

          <FAB
            icon="plus"
            style={globalStyles.fab}
            onPress={() => {
              setNewBoard({ name: '', desc: '', template: 'standard' });
              setModals({ ...modals, add: true });
            }}
          />

          <Portal>
            <Dialog style={{
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}
              visible={modals.add} onDismiss={() => setModals({ ...modals, add: false })}>
              <Dialog.Title>Ajouter un tableau</Dialog.Title>
              <Dialog.Content>
                <TextInput label="Nom du tableau" value={newBoard.name} onChangeText={(text) => setNewBoard({ ...newBoard, name: text })} style={globalStyles.input} autoFocus />
                <TextInput label="Description" value={newBoard.desc} onChangeText={(text) => setNewBoard({ ...newBoard, desc: text })} style={globalStyles.input} />
                <Menu
                  visible={modals.menu}
                  onDismiss={() => setModals({ ...modals, menu: false })}
                  anchor={<Button onPress={() => setModals({ ...modals, menu: true })}>{newBoard.template}</Button>}
                >
                  {['standard', 'kanban', 'agile'].map((template) => (
                    <Menu.Item
                      key={template}
                      title={template}
                      onPress={() => {
                        if (validTemplates.includes(template as BoardTemplate)) {
                          setNewBoard({ ...newBoard, template: template as BoardTemplate });
                        } else {
                          console.error("Template non valide :", template);
                        }
                      }}
                    />
                  ))}
                </Menu>
              </Dialog.Content>
              <Dialog.Actions>
                <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={() => setModals({ ...modals, add: false })}>Annuler</Button>
                <Button style={[globalStyles.button, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButton} onPress={handleAddBoard}>Créer</Button>
              </Dialog.Actions>
            </Dialog>

            <Dialog style={{
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}
              visible={modals.delete} onDismiss={() => setModals({ ...modals, delete: false })}>
              <Dialog.Title>Supprimer le board</Dialog.Title>
              <Dialog.Content>
                <Text>Êtes-vous sûr de vouloir supprimer ce tableau ?</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={() => setModals({ ...modals, delete: false })}>Annuler</Button>
                <Button style={[globalStyles.buttonDelete, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelDelete} onPress={handleDeleteBoard}>Supprimer</Button>
              </Dialog.Actions>
            </Dialog>

            <Dialog style={{
              backgroundColor: 'white',
              borderRadius: 10,
              overflow: 'hidden',
            }}
              visible={modals.edit} onDismiss={() => setModals({ ...modals, edit: false })}>
              <Dialog.Title>Modifier le board</Dialog.Title>
              <Dialog.Content>
                <TextInput label="Nom" value={newBoard.name} onChangeText={(text) => setNewBoard({ ...newBoard, name: text })} style={globalStyles.input} />
                <TextInput label="Description" value={newBoard.desc} onChangeText={(text) => setNewBoard({ ...newBoard, desc: text })} style={globalStyles.input} />
              </Dialog.Content>
              <Dialog.Actions>
                <Button style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButtonReverse} onPress={() => setModals({ ...modals, edit: false })}>Annuler</Button>
                <Button style={[globalStyles.button, { paddingHorizontal: 15 }]} labelStyle={globalStyles.labelButton} onPress={handleEditBoard}>Modifier</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </GradientBackground>
    </Provider>
  );
};

export default Boards;
