import { Ticket } from "../ticket";

it("implements optimistic concurrency control ", async (done) => {
  const ticket = await Ticket.build({
    price: 12.3,
    userId: "12312312",
    title: "sdfasdf",
  });
  await ticket.save();

  const ticket1 = await Ticket.findById(ticket.id);
  const ticket2 = await Ticket.findById(ticket.id);

  ticket1!.set({
    title: "Updated Title",
  });
  ticket2!.set({
    title: "Updated Title 2",
  });

  await ticket1!.save();

  try {
    await ticket2!.save();
  } catch (e) {
    return done();
  }
  throw new Error("Should not reach this point");
});

it("increments the version in multiple saves ", async () => {
  const ticket = await Ticket.build({
    title: "THis is a titile",
    price: 123,
    userId: "!23123",
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
