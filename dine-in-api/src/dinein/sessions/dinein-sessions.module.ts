import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DineInSession, DineInSessionSchema } from './schemas/dinein-session.schema';
import { SessionsRepository, SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { DineInTablesModule } from '../tables/dinein-tables.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DineInSession.name, schema: DineInSessionSchema },
    ]),
    DineInTablesModule, // for TablesRepository
  ],
  providers: [SessionsRepository, SessionsService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class DineInSessionsModule {}
