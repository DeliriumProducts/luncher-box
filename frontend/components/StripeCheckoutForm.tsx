import { CardElement, injectStripe } from 'react-stripe-elements';

const StripeCheckoutForm = () => {
  const submit = (e: any) => {
    console.log(e);
  };

  return (
    <div className="checkout">
      <p>Would you like to complete the purchase?</p>
      <CardElement />
      <button onClick={submit}>Send</button>
    </div>
  );
};

export default injectStripe(StripeCheckoutForm);
