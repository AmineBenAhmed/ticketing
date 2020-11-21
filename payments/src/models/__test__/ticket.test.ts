import { Ticket } from '../order';

it('implements optimistic concurrency control', async (done) => {
  //create an instance of a tikcet
  const ticket = Ticket.build({
    title: 'new course',
    price: 225,
    userId: '1235'
  })

  //save the ticket to the database
  await ticket.save();

  //fecth the ticket twice (TWO TIMES)
  const firstInstance = await Ticket.findById(ticket.id); // ticket with version: 0
  const secondInstance = await Ticket.findById(ticket.id);// ticket with version: 0

  //make two seperate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  //save the first fetched ticket
  await firstInstance!.save(); // version 0 => 1 updated ticket

  //save the second ticket
  try {
    await secondInstance!.save();//when saving ticket mongoose increment the version from current to cureent version + 1
    //but when saving the current is 0 and the stored ticket version is 1 which is increment by the first instance here he returns an error and can't update it
    //because versions must be seccession not from 0 to 2 directly
  } catch (err) {
    return done(); // 
  }
  throw new Error('should reach this point')
});

it('increments the version number on multiple saves', async () => {
    //create an instance of a tikcet
    const ticket = Ticket.build({
      title: 'new course',
      price: 225,
      userId: '1235'
    })
  
    //save the ticket to the database
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})