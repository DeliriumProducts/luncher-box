import { message } from 'antd';
import Head from 'next/head';
import Router, from 'next/router';
import { ParsedUrlQuery } from 'querystring'
import { Component } from 'react';
import { CategoryAPI, ProductAPI } from '../../api';
import EntityCard from '../../components/EntityCard';
import EntityCardContainer from '../../components/EntityCardContainer';
import EntityModal from '../../components/EntityModal';
import FlexContainer from '../../components/FlexContainer';
import PageHeader from '../../components/PageHeader';
import { withAuth, withRouter } from '../../hocs/';
import { Category, Product } from '../../interfaces';
import { ActionTypes, EntityInstance, EntityTypes } from '../../types';

interface CategoryQuery extends ParsedUrlQuery {
  categoryId: string;
}

interface Props {
  query: CategoryQuery;
}

interface State {
  modalVisible: boolean;
  pageLoading: boolean;
  modalLoading: boolean;
  products: Product[];
  entity?: EntityInstance;
  entityType: EntityTypes;
  actionType: ActionTypes;
  categoryName: string;
}

class CategoryPage extends Component<Props, State> {
  state: State = {
    modalVisible: false,
    pageLoading: true,
    modalLoading: false,
    products: [],
    entity: undefined,
    entityType: 'product',
    actionType: 'create',
    categoryName: ''
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
      entityType: 'product',
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
          entity = (await ProductAPI.create(entity)).data;
          message.success(`Successfully created product ${entity.name} 🎉`);
        } else {
          /**
           * First we check for entity because it may be undefined
           * then inject the id of the entity manually since
           * our modal does not return it when actionType == 'edit'
           */
          if (entityToEdit) {
            entity.id = entityToEdit.id;
            entity = (await ProductAPI.edit(entity)).data;
            message.success(`Successfully edited product ${entity.name} 🎉`);
          }
        }
      } catch (err) {
        this.setState({ modalLoading: false });
        message.error(`${err}`);
        return;
      }

      /**
       * Update the state with the created/edited product
       */
      const productCategories: Category[] = entity.categories;
      let shouldKeepProduct = false;

      for (const category of productCategories) {
        if (category.id === +this.props.query.categoryId) {
          shouldKeepProduct = true;
          break;
        }
      }

      const product = entity;

      if (shouldKeepProduct) {
        if (actionType === 'create') {
          this.setState((prevState: State) => ({
            products: [...prevState.products, product]
          }));
        } else {
          this.setState(prevState => ({
            products: prevState.products.map(p => {
              if (p.id === product.id) {
                return product;
              } else {
                return p;
              }
            })
          }));
        }
      } else {
        this.setState(prevState => ({
          products: prevState.products.filter(p => {
            return p.id !== product.id;
          })
        }));
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

    /**
     * Update current product with all categories
     */
    entity = await ProductAPI.getOne((entity as Product).id);

    this.showModal(entityType, 'edit', entity);
  };

  handleDeleteClick = async (
    e: React.FormEvent<HTMLButtonElement>,
    { id, name }: any
  ) => {
    e.stopPropagation();

    await ProductAPI.delete(id);

    this.setState(
      prevState => ({
        products: prevState.products.filter(p => {
          return p.id !== id;
        })
      }),
      () => message.success(`Successfully deleted product ${name} 🎉`)
    );
  };

  async componentDidMount() {
    try {
      const { products, name: categoryName } = await CategoryAPI.getOne(
        Number(this.props.query.categoryId)
      );

      if (products) {
        this.setState({ products });
      }

      if (categoryName) {
        this.setState({ categoryName });
      }
    } catch (err) {
      message.error(`${err}, Redirecting you to the home page...`, 3, () =>
        Router.replace('/admin')
      );
    } finally {
      this.setState({ pageLoading: false });
    }
  }

  render() {
    const { pageLoading: loading, products } = this.state;

    return (
      <>
        <Head>
          <title>
            {this.state.categoryName === ''
              ? 'Category'
              : this.state.categoryName}{' '}
            • LuncherBox
          </title>
        </Head>
        <FlexContainer>
          <PageHeader
            title={
              <h1>
                <strong>{this.state.categoryName}</strong>
              </h1>
            }
            subTitle={
              <h3>
                <strong>({products.length})</strong>
              </h3>
            }
            onBack={() => {
              Router.back();
            }}
          >
            <EntityCardContainer
              entityType="product"
              loading={loading}
              handleNewClick={this.handleNewClick}
            >
              {products.map(product => (
                <EntityCard
                  key={product.id}
                  {...product}
                  hoverable={true}
                  entityType="product"
                  handleEditClick={this.handleEditClick}
                  handleDeleteClick={this.handleDeleteClick}
                />
              ))}
            </EntityCardContainer>
          </PageHeader>
          <EntityModal
            wrappedComponentRef={this.saveModalFormRef}
            visible={this.state.modalVisible}
            onCancel={this.handleModalCancel}
            onConfirm={this.handleModalAction}
            entityType={this.state.entityType}
            actionType={this.state.actionType}
            entity={this.state.entity}
            loading={this.state.modalLoading}
          />
        </FlexContainer>
      </>
    );
  }
}

export default withAuth(withRouter(CategoryPage));
