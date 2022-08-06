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
  prisma.$use(async (params, next) => {
    if (
      params.model == 'Day' ||
      params.model == 'User' ||
      params.model == 'Homework' ||
      params.model == 'PlannedDate'
    ) {
      if (params.action === 'findUnique' || params.action === 'findFirst') {
        // Change to findFirst - you cannot filter
        // by anything except ID / unique with findUnique
        params.action = 'findFirst';
        // Add 'deleted' filter
        // ID filter maintained
        params.args.where['deleted'] = false;
      }
      if (params.action === 'findMany') {
        // Find many queries
        if (params.args.where) {
          if (!params.args.where.deleted) {
            // Exclude deleted records if they have not been explicitly requested
            params.args.where['deleted'] = false;
          }
        } else {
          params.args['where'] = { deleted: false };
        }
      }
    }
    return next(params);
  });
};

export default applyPrismaMiddlewares;
