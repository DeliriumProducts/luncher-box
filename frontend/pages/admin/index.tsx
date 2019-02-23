import { message } from 'antd';
import { Component } from 'react';
import styled from 'styled-components';
import { CategoryAPI } from '../../api';
import AdminLayout from '../../components/AdminLayout';
import EntityCard from '../../components/EntityCard';
import EntityCardContainer from '../../components/EntityCardContainer';
import EntityModal from '../../components/EntityModal';
import withAuth from '../../components/withAuth';
import { AdminContext } from '../../context';
import { Category } from '../../interfaces';
import { ActionTypes, EntityInstance, EntityTypes } from '../../types';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;

  .col {
    flex: 1;
    max-width: 70%;
    height: 100%;
    margin: auto;
  }

  @media (max-width: 768px) {
    .col {
      max-width: 100%;
      margin-top: 3%;
    }

    flex-direction: column;
  }
`;
interface State {
  modalVisible: boolean;
  pageLoading: boolean;
  modalLoading: boolean;
  categories: Category[];
  entity?: EntityInstance;
  entityType: EntityTypes;
  actionType: ActionTypes;
}

class Index extends Component<any, State> {
  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  state: State = {
    modalVisible: false,
    pageLoading: true,
    modalLoading: false,
    categories: [],
    entity: undefined,
    entityType: 'category',
    actionType: 'create'
  };

  modalFormRef: any;

  showModal = (
    entityType: EntityTypes,
    actionType: ActionTypes,
    entity?: EntityInstance
  ) => {
    if (entity) {
      this.setState({
        modalVisible: true,
        entityType,
        actionType,
        entity
      });
    } else {
      this.setState({
        modalVisible: true,
        entityType,
        actionType: 'create',
        entity: undefined
      });
    }
  };

  handleModalCancel = () => {
    this.setState({
      modalVisible: false,
      modalLoading: false,
      entity: undefined,
      entityType: 'category',
      actionType: 'create'
    });
  };

  handleModalAction = () => {
    const modalForm = this.modalFormRef.props.form;

    /**
     * We will need the entity from state when actionType == 'edit'
     * so we destructure it now and then we have to check
     * for undefined because entity is undefined on actionType == 'create'
     */
    const { entity: entityToEdit, actionType } = { ...this.state };
    modalForm.validateFields(async (err: any, entity: any) => {
      if (err) {
        return;
      }

      this.setState({ modalLoading: true });

      try {
        if (actionType === 'create') {
          entity = (await CategoryAPI.create(entity)).data;
          message.success(`Successfully created category ${entity.name} 🎉`);
        } else {
          /**
           * First we check for entity because it may be undefined
           * then inject the id of the entity manually since
           * our modal does not return it when actionType == 'edit'
           */
          if (entityToEdit) {
            entity.id = entityToEdit.id;
            entity = (await CategoryAPI.edit(entity)).data;
            message.success(`Successfully edited category ${entity.name} 🎉`);
          }
        }
      } catch (err) {
        this.setState({ modalLoading: false });
        message.error(`${err}`);
        return;
      }

      /**
       * Update the state with the created/edited category
       */
      const category = entity;

      if (actionType === 'create') {
        this.setState((prevState: State) => ({
          categories: [...prevState.categories, category]
        }));
      } else {
        const categories = [...this.state.categories];
        const categoryIndex = categories.findIndex(
          ({ id }: Category) => id === category.id
        );

        if (categoryIndex >= 0) {
          categories[categoryIndex] = category;
          this.setState({ categories });
        }
      }

      modalForm.resetFields();
      this.setState({ modalVisible: false, modalLoading: false });
    });
  };

  saveModalFormRef = (modalFormRef: any) => {
    this.modalFormRef = modalFormRef;
  };

  handleNewClick = (entityType: EntityTypes) => {
    this.showModal(entityType, 'create');
  };

  handleEditClick = async (
    e: React.FormEvent<HTMLButtonElement>,
    entityType: EntityTypes,
    entity: EntityInstance
  ) => {
    e.stopPropagation();

    this.showModal(entityType, 'edit', entity);
  };

  handleDeleteClick = async (
    e: React.FormEvent<HTMLButtonElement>,
    { id, name }: EntityInstance
  ) => {
    e.stopPropagation();

    await CategoryAPI.delete(id);

    const categories = [...this.state.categories];

    const categoryIndex = categories.findIndex(
      ({ id: categoryId }: Category) => categoryId === id
    );

    if (categoryIndex >= 0) {
      categories.splice(categoryIndex, 1);
      this.setState({ categories }, () =>
        message.success(`Successfully deleted category ${name} 🎉`)
      );
    }
  };

  async componentDidMount() {
    try {
      const categories = await CategoryAPI.getAll();

      if (categories) {
        this.setState({ categories });
      }
    } catch (err) {
      message.error(`${err}`, 3);
    } finally {
      this.setState({ pageLoading: false });
    }
  }

  render() {
    const { pageLoading: loading, categories } = this.state;

    return (
      <AdminLayout selectedKey="home">
        <FlexContainer>
          <div className="col">
            <EntityCardContainer
              title={`Categories (${categories.length})`}
              entityType="category"
              loading={loading}
              handleNewClick={this.handleNewClick}
            >
              {categories &&
                categories.map((category: Category) => (
                  <EntityCard
                    key={category.id}
                    {...category}
                    hoverable={true}
                    entityType="category"
                    handleEditClick={this.handleEditClick}
                    handleDeleteClick={this.handleDeleteClick}
                  />
                ))}
            </EntityCardContainer>
            <EntityModal
              wrappedComponentRef={this.saveModalFormRef}
              visible={this.state.modalVisible}
              onCancel={this.handleModalCancel}
              onCreate={this.handleModalAction}
              entityType={this.state.entityType}
              actionType={this.state.actionType}
              entity={this.state.entity}
              loading={this.state.modalLoading}
            />
          </div>
        </FlexContainer>
      </AdminLayout>
    );
  }
}

export default withAuth(Index);
