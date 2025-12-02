import { PrismaClient, Prisma, Outbox } from '@prisma/client';

export type PrismaClientWithOutbox = PrismaClient & {
  outbox: {
    create: (args: {
      data: {
        eventType: string;
        payload: Prisma.InputJsonValue;
        status: string;
      };
    }) => Promise<Outbox>;
  };
};

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
> & {
  outbox: {
    create: (args: {
      data: {
        eventType: string;
        payload: Prisma.InputJsonValue;
        status: string;
      };
    }) => Promise<unknown>;
  };
};
