import { Prisma, PrismaClient } from '@prisma/client';
const applyPrismaMiddlewares = async (
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >
) => {
  prisma.$use(async (params, next) => {
    // Check incoming query type
    if (
      params.model == 'Day' ||
      params.model == 'User' ||
      params.model == 'Homework' ||
      params.model == 'PlannedDate'
    ) {
      if (params.action == 'delete') {
        // Delete queries
        // Change action to an update
        console.log('CHANGING PARAMS TT UPDATE');
        params.action = 'update';
        params.args['data'] = { deleted: true };
      }
      if (params.action == 'deleteMany') {
        // Delete many queries
        params.action = 'updateMany';
        if (params.args.data != undefined) {
          params.args.data['deleted'] = true;
        } else {
          params.args['data'] = { deleted: true };
        }
      }
    }
    return next(params);
  });
};

export default applyPrismaMiddlewares;
