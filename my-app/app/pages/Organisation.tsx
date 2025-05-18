import React, { useState, useEffect } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { fetchOrganizations, createOrganization, deleteOrganization, editOrganization } from '../services/organizationService';
import { Card, Button, Text, TextInput, FAB, Portal, Dialog, Provider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import UserNavbar from '../components/UserNavbar';
import { globalStyles } from '../styles/globalStyles';
import GradientBackground from '../components/GradientBackground';

type NavigationProp = {
  navigate: (screen: string, params: { orgId: string; orgName: string }) => void;
};

interface Organization {
  id: string;
  displayName: string;
  desc: string;
}

interface NewOrganization {
  displayName: string;
  desc: string;
}

interface DialogVisibleState {
  create: boolean;
  edit: boolean;
  delete: boolean;
}

const Organisation: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [newOrg, setNewOrg] = useState<NewOrganization>({ displayName: '', desc: '' });
  const [orgToEdit, setOrgToEdit] = useState<Organization | null>(null);
  const [orgToDelete, setOrgToDelete] = useState<Organization | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [dialogVisible, setDialogVisible] = useState<DialogVisibleState>({ create: false, edit: false, delete: false });

  const fetchData = async (): Promise<Organization[]> => {
    try {
      const data: Organization[] = await fetchOrganizations();
      setOrganizations(data);
      return data;
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrganization = async (): Promise<void> => {
    try {
      if (newOrg.displayName) {
        await createOrganization(newOrg.displayName, newOrg.desc);
        fetchData();
        setNewOrg({ displayName: '', desc: '' });
        setDialogVisible({ ...dialogVisible, create: false });

      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteOrganization = async (): Promise<void> => {
    try {
      if (orgToDelete) {
        await deleteOrganization(orgToDelete.id);
        fetchData();
        setDialogVisible({ ...dialogVisible, delete: false });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de organisation:', error);
    }
  };

  const handleEditOrganization = async (): Promise<void> => {
    try {
      if (newOrg.displayName && orgToEdit) {
        await editOrganization(orgToEdit.id, newOrg.displayName, newOrg.desc);
        fetchData();
        setNewOrg({ displayName: '', desc: '' });
        setDialogVisible({ ...dialogVisible, edit: false });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Provider>
      <GradientBackground>
        <View style={globalStyles.container}>
          <UserNavbar />
          <Text style={globalStyles.title}>ESPACES DE TRAVAIL</Text>

          {loading ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              data={organizations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Card style={globalStyles.card} onPress={() => navigation.navigate('Boards', { orgId: item.id, orgName: item.displayName })}>
             

                  <Card.Content style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{item.displayName}</Text>
                      <Text style={{ fontSize: 18, marginTop:10 }}>{item.desc || 'Aucune description'}</Text>
                    </View>

                    <View style={globalStyles.iconButtonStyle}>
                      <IconButton
                        icon="pencil"
                        size={15}
                        onPress={() => {
                          setOrgToEdit(item);
                          setNewOrg({ displayName: item.displayName, desc: item.desc || '' });
                          setDialogVisible({ ...dialogVisible, edit: true });
                        }}
                        style={{ marginRight: 8 }}
                      />
                    </View>
                    <View style={[globalStyles.iconButtonStyle, { marginLeft:15 }]}>
                      <IconButton
                        icon="delete"
                        size={15}
                        onPress={() => {
                          setOrgToDelete(item);
                          setDialogVisible({ ...dialogVisible, delete: true });
                        }}
                        style={{ marginRight: 8 }}
                      />
                    </View>
                  </Card.Content>

                  <Card.Actions style={{ justifyContent: 'flex-start' }}>
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate('Boards', { orgId: item.id, orgName: item.displayName })}
                      style={[globalStyles.button, { width: '100%', marginTop:15 }]}
                      labelStyle={globalStyles.labelButton}
                    >
                      Acceder au tableau
                    </Button>
                  </Card.Actions>
                </Card>
              )}
            />

          )}

          <FAB
            icon="plus"
            style={globalStyles.fab}
            onPress={() => {
              setNewOrg({
                displayName: '',
                desc: '',
              });
              setDialogVisible({ ...dialogVisible, create: true });
            }}
          />

          <Portal>
            {/* Dialog pour créer un espace de travail */}
            <Dialog
              visible={dialogVisible.create}
              onDismiss={() => setDialogVisible({ ...dialogVisible, create: false })}
              style={{ backgroundColor: 'white', padding: 20 }}
            >
              <Dialog.Title>Nouvel espace de travail</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Nom"
                  value={newOrg.displayName}
                  onChangeText={(displayName) => setNewOrg({ ...newOrg, displayName })}
                  style={globalStyles.input}
                />
                <TextInput
                  label="Description"
                  value={newOrg.desc}
                  onChangeText={(desc) => setNewOrg({ ...newOrg, desc })}
                  style={globalStyles.input}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setDialogVisible({ ...dialogVisible, create: false })}
                  style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]}
                  labelStyle={globalStyles.labelButtonReverse}
                >
                  Annuler
                </Button>
                <Button
                  onPress={handleCreateOrganization}
                  style={[globalStyles.button, { paddingHorizontal: 15 }]}
                  labelStyle={globalStyles.labelButton}
                >
                  Créer
                </Button>
              </Dialog.Actions>
            </Dialog>


            {/* Dialog pour supprimer un espace de travail */}
            <Dialog
              visible={dialogVisible.delete}
              onDismiss={() => setDialogVisible({ ...dialogVisible, delete: false })}
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <Dialog.Title>Supprimer espace de travail</Dialog.Title>
              <Dialog.Content style={{ backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                <Text>Êtes-vous sûr de vouloir supprimer cet espace de travail ?</Text>
              </Dialog.Content>
              <Dialog.Actions style={{ backgroundColor: 'white', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                <Button
                  onPress={() => setDialogVisible({ ...dialogVisible, delete: false })}
                  style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]}
                  labelStyle={globalStyles.labelButtonReverse}
                >
                  Annuler
                </Button>
                <Button
                  onPress={handleDeleteOrganization}
                  style={[globalStyles.buttonDelete, { paddingHorizontal: 15 }]}
                  labelStyle={globalStyles.labelDelete}
                >
                  Supprimer
                </Button>
              </Dialog.Actions>
            </Dialog>



            {/* Dialog pour modifier un espace de travail */}
            <Dialog
              visible={dialogVisible.edit}
              onDismiss={() => setDialogVisible({ ...dialogVisible, edit: false })}
              style={{ backgroundColor: 'white' }}
            >
              <Dialog.Title>Modifier espace de travail</Dialog.Title>
              <Dialog.Content>
                <TextInput
                  label="Nom de l'espace de travail"
                  value={newOrg.displayName}
                  onChangeText={(displayName) => setNewOrg({ ...newOrg, displayName })}
                  style={globalStyles.input}
                />
                <TextInput
                  label="Description"
                  value={newOrg.desc}
                  onChangeText={(desc) => setNewOrg({ ...newOrg, desc })}
                  style={globalStyles.input}
                />
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  onPress={() => setDialogVisible({ ...dialogVisible, edit: false })}
                  style={[globalStyles.buttonReverse, { paddingHorizontal: 15 }]}
                  labelStyle={globalStyles.labelButtonReverse}
                >
                  Annuler
                </Button>
                <Button
                  onPress={handleEditOrganization}
                  style={[globalStyles.button, { paddingHorizontal: 15 }]}
                  labelStyle={globalStyles.labelButton}
                >
                  Modifier
                </Button>
              </Dialog.Actions>
            </Dialog>

          </Portal>
        </View>
      </GradientBackground>
    </Provider>
  );
};

export default Organisation;