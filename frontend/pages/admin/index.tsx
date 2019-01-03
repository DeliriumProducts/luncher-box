import { Component } from 'react';
import AdminLayout from '../../components/AdminLayout';
import withAuth from '../../components/withAuth';
import { EntityContext } from '../../context';
import EntityCard from '../../components/EntityCard';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`;

class Index extends Component {
  static contextType = EntityContext;
  context!: React.ContextType<typeof EntityContext>;

  componentDidMount() {
    this.context.actions.updateEntities();
  }

  render() {
    return (
      <AdminLayout selectedKey="home">
        <FlexContainer>
          <EntityCard
            name="nadenica"
            description="dadasjdhfdjsk"
            image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg"
          />
          <EntityCard
            name="fksdjfksdjfksjfksjfkjskfsjfksjfksjfkdsjfksjfksjfdsfdasdasdsadsadassajdsajdajsdajsdsajdkdsfsffffffffffffffffffffffffffffffjfjjfjfjjfjfjjfjfjfjfjjdsdskjfkjsfjksfjksjsjfkjsdfdsjfdskjfkjsksdfsfkskfjdskjfdskjfdsfkjsfksjfskjfskfjsfkjskfjskfjskjfkjdsfjkskjdsfkjskfkjdsfkjsjkskjkjskjsfkjskjskjfkjskjfdskjfkjdssdkjskjfskjsdkkjsfkjdskjfskjfkjsfkjskjfskjfsskjfskjssf"
            description="dsjhfjdshifsjdfdsgfdmgfdsfdsfsfjksjfksfjksfdajsajdjsadjadjdjjdadfffffffffffjjjjjfjjfjfjfjfjfsdkjfkdskfAAAAAAAAAAAAAsdjfsdkfsdfsdfsjdkfdskjfdskjfdskjfdsfkjdsfkjsfkjjjdjddjdjdjdfhdskjfdskjfsfdfkjhsdfkjsfdkjdsfsdfkjdsfjdsfdsfsdsfkjdsfdsfkjdskjsdfkjfddsfssfssdfkjsfljsdflkjsdflkjsflkjdsfljdsfljkdsfljdsfljsdfljsdfljsdflkjljfdlgjsdgoiuwt;lfg;lksdf;lkjs fs;kjwt4oij lsd;n gslkj 4elkgnms lkgjsfd gnfd; gkd jg;dfgjd kljglkdjglkds gjfgjddgggggggggggggggggggggggggggggggggjjjjjjjjjgjgjgjgjgjgjfgfdgfdgfdgfdgfdgkjfdgjfdglkdfgljfdkfdlgkjfdlkgjdfkgljrekljfdlkjgdfkjgfdlkgjdflkgjfdglkdjfgfdglkjdgdlfkjfjdshfskfhshfkshfskhfdsfsjfhsfjshfjdshfjhfjshfjdshfjshfjshfjshfjshfjshfjshfjshfjdshfjshjfhsdfhjshfjshfjhjh"
            image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg"
          />
          <EntityCard
            name="nadenica"
            description="dadasjdhfdjsk"
            image="https://sifu.unileversolutions.com/image/en-AU/recipe-topvisual/2/1260-709/beef-burger-with-deep-fried-bacon-and-thousand-island-dressing-50247463.jpg"
          />
        </FlexContainer>
      </AdminLayout>
    );
  }
}

export default withAuth(Index);
