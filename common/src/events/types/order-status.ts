export enum OrderStatus {
  //when the order has been created, but the ticket it is trying to order has
  //not been reserved
  Created = 'created',

  //The ticket the order trying to reserve has been already reserve or
  //th user has canceled the order
  //the order expires before payment
  Canceled = 'canceled',

  //the order has successfully reserved the ticket
  AwaitingPayment = 'awaiting:payment',

  //the order has reserved the ticket and the user 
  //has provided the payment successfully
  Complete = 'complete'
}