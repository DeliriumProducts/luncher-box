import { message } from 'antd';
import Head from 'next/head';
import { Component } from 'react';
import { CategoryAPI } from '../../api';
import EntityCard from '../../components/EntityCard';
import EntityCardContainer from '../../components/EntityCardContainer';
import EntityModal from '../../components/EntityModal';
import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import { SocketContext } from '../../context';
import { withAuth } from '../../hocs/';
import { Category } from '../../interfaces';
import { ActionTypes, EntityInstance, EntityTypes } from '../../types';

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
  static contextType = SocketContext;
  context!: React.ContextType<typeof SocketContext>;

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
    this.modalFormRef.props.form.resetFields();

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
     * We will need the entity from state when actionType == 'edit',
     * so we destructure it now and then we have to check
     * if it's undefined, because it will be undefined if actionType == 'create'
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
           * First we check wheter we have an entity
           * Second we inject the id of the entity since,
           * the modal does not return it back when actionType == 'edit'
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

    await CategoryAPI.delete(id as number);

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
      <>
        <Head>
          <title>Admin Home • LuncherBox</title>
        </Head>
        <FlexContainer>
          <PageHeader
            title={
              <h1>
                <strong>Categories</strong>
              </h1>
            }
            subTitle={
              <h3>
                <strong>({categories.length})</strong>
              </h3>
            }
          >
            <EntityCardContainer
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
          </PageHeader>
        </FlexContainer>
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
      </>
    );
  }
}

export default withAuth(Index);
