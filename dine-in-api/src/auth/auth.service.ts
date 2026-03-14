import { Injectable, UnauthorizedException, ConflictException, OnModuleInit, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { SignupDto, LoginDto } from './dto/auth.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class AuthService implements OnModuleInit {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async onModuleInit() {
    // ── Seed delivery test users (only if no users exist) ──
    const count = await this.userModel.countDocuments();
    if (count === 0) {
      const mockData = [
        { name: 'John Doe',      email: 'john.doe@example.com',   password: 'password123', address: '123 Main St', phone: '1234567890' },
        { name: 'Jane Doe',      email: 'jane.doe@example.com',   password: 'password123', address: '456 Elm St',  phone: '0987654321' },
        { name: 'Alice Johnson', email: 'alice.j@example.com',    password: 'password123', address: '789 Oak St',  phone: '1122334455' },
        { name: 'Bob Smith',     email: 'bob.smith@example.com',  password: 'password123', address: '321 Pine St', phone: '5566778899' },
        { name: 'Charlie Brown', email: 'charlie.b@example.com',  password: 'password123', address: '654 Maple St',phone: '9988776655' },
        { name: 'Diana Prince',  email: 'diana.p@example.com',    password: 'password123', address: '246 Cedar St',phone: '2244668800' },
      ];
      const withHashes = await Promise.all(
        mockData.map(async (u) => ({ ...u, password: await bcrypt.hash(u.password, 10), role: UserRole.USER })),
      );
      await this.userModel.insertMany(withHashes);
      if (process.env.NODE_ENV !== 'test') this.logger.log('🌱 Delivery users seeded!');
    }

    // ── Seed admin user (idempotent — from .env) ──
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@restaurant.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const existingAdmin = await this.userModel.findOne({ role: UserRole.ADMIN }).exec();
    if (!existingAdmin) {
      await this.userModel.create({
        name: 'Admin',
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: UserRole.ADMIN,
      });
      if (process.env.NODE_ENV !== 'test') this.logger.log(`🔑 Admin user seeded: ${adminEmail}`);
    }
  }

  async signup(signupDto: SignupDto) {
    const { email, password, name, address, phone } = signupDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      address,
      phone,
    });

    await user.save();

    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
      token: await this.jwtService.signAsync(payload),
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email }).exec();

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
      token: await this.jwtService.signAsync(payload),
    };
  }
}
