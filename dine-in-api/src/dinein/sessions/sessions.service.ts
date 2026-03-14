import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DineInSession } from './schemas/dinein-session.schema';
import { TablesRepository } from '../tables/tables.repository';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectModel(DineInSession.name) private readonly sessionModel: Model<DineInSession>,
  ) {}

  async create(tableId: string, browserFingerprint: string): Promise<DineInSession> {
    return this.sessionModel.create({
      tableId: new Types.ObjectId(tableId),
      browserFingerprint,
      lastActiveAt: new Date(),
    });
  }

  async findById(id: string): Promise<DineInSession | null> {
    return this.sessionModel.findById(id).exec();
  }

  async updateLastActive(id: string): Promise<void> {
    await this.sessionModel.findByIdAndUpdate(id, { lastActiveAt: new Date() }).exec();
  }
}

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepo: SessionsRepository,
    private readonly tablesRepo: TablesRepository,
  ) {}

  /**
   * Creates or resumes a guest session.
   * Called when user scans QR.
   */
  async initSession(
    tableNumber: string,
    fingerprint: string,
    existingSessionId?: string,
  ): Promise<{ sessionId: string; tableId: string; tableNumber: string; seatCount: number }> {
    const table = await this.tablesRepo.findByTableNumber(tableNumber);
    if (!table) throw new NotFoundException(`Table '${tableNumber}' not found`);

    // Try to resume an existing valid session
    if (existingSessionId) {
      const existing = await this.sessionsRepo.findById(existingSessionId);
      if (
        existing &&
        !existing.expired &&
        existing.tableId.toString() === (table as any)._id.toString()
      ) {
        await this.sessionsRepo.updateLastActive(existingSessionId);
        return {
          sessionId: (existing as any)._id.toString(),
          tableId: (table as any)._id.toString(),
          tableNumber: table.tableNumber,
          seatCount: table.seatCount,
        };
      }
    }

    // Create new session
    const session = await this.sessionsRepo.create((table as any)._id.toString(), fingerprint);
    return {
      sessionId: (session as any)._id.toString(),
      tableId: (table as any)._id.toString(),
      tableNumber: table.tableNumber,
      seatCount: table.seatCount,
    };
  }

  async ping(sessionId: string): Promise<void> {
    await this.sessionsRepo.updateLastActive(sessionId);
  }

  async validateSession(sessionId: string): Promise<DineInSession> {
    const session = await this.sessionsRepo.findById(sessionId);
    if (!session || session.expired) {
      throw new UnauthorizedException('Session expired or not found. Please scan QR again.');
    }
    return session;
  }
}
