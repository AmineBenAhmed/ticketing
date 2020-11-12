import { Message, Stan } from 'node-nats-streaming';

import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> { //the type T extended from Event type and any property can be of type T, T here is an argument of Listener class and must be provided when Listener called
  abstract subject: T['subject'];//this makes subject of extended classes from Listener must be the same type of subject from Event type and this excludes errors
  abstract onMessage(data: T['data'], msg: Message): void;
  abstract queueGroupName: string;
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptioOptions() {
    return this.client
      .subscriptionOptions() 
      .setDeliverAllAvailable()// Configures the subscription to replay with the last received message. Is used only for the first time after it will be ignored
      .setManualAckMode(true) //this checks if event processed  well and return an acknowlagement
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);// returns acknowlagement to subscriber if events are precessed well if not they still waiting until processed
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptioOptions()
    );

  subscription.on('message', (msg: Message) => {
    console.log(
      `Message received: ${this.subject} / ${this.queueGroupName}`
    );

    const parsedDate = this.parseMessage(msg);
    this.onMessage(parsedDate, msg);
  });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.stringify(data.toString('utf8'));
  }
}